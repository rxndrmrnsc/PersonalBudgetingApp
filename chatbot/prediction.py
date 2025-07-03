from fastapi import FastAPI, HTTPException, APIRouter
from pydantic import BaseModel
from typing import List
from pymongo import MongoClient
import pandas as pd
from sklearn.linear_model import LinearRegression
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()
router = APIRouter()

# Setup FastAPI
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow React frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB client
MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client["disertatie"]
collection = db["Budget"]

# Request model
class UserRequest(BaseModel):
    user_id: str  # MongoDB string userId

# Response models
class BudgetPrediction(BaseModel):
    category: str
    sub_category: str
    predicted: float

class FullBudgetResponse(BaseModel):
    user_id: str
    predicted_budget: List[BudgetPrediction]

def flatten_budget(doc):
    rows = []

    def add_rows(entries, category, sub_category_type=None):
        for item in entries:
            rows.append({
                "user_id": doc["userId"],
                "year": doc["year"],
                "month": doc["month"],
                "category": category if not sub_category_type else f"{category}: {sub_category_type}",
                "sub_category": item["name"],
                "expected": item["expected"],
                "actual": item["actual"],
                "date_index": pd.to_datetime(f"{doc['year']}-{doc['month'][:3]}", errors='coerce')
            })

    add_rows(doc.get("incomes", []), "income")
    for needs_or_wants in ["needs", "wants"]:
        add_rows(doc.get("expenses", {}).get(needs_or_wants, []), "expenses", needs_or_wants)
    add_rows(doc.get("savings", []), "savings")

    return rows

@router.post("/predict_full_budget", response_model=FullBudgetResponse)
def predict_full_budget(req: UserRequest):
    user_id = req.user_id

    # Get all budget documents for the user
    docs = list(collection.find({"userId": user_id}))

    if not docs:
        raise HTTPException(status_code=404, detail="No budgets found for user")

    # Flatten documents
    records = []
    for doc in docs:
        records.extend(flatten_budget(doc))

    df = pd.DataFrame(records)
    df.dropna(subset=["date_index"], inplace=True)
    df.sort_values("date_index", inplace=True)

    # Create time index for regression
    df["month_index"] = df.groupby(["user_id", "category", "sub_category"]).cumcount()

    # Predict for each (category, sub_category)
    predictions = []
    grouped = df.groupby(["category", "sub_category"])

    for (category, sub_category), group in grouped:
        if len(group) < 3:
            continue

        X = group[["month_index"]]
        y = group["actual"]
        model = LinearRegression().fit(X, y)

        next_index = group["month_index"].max() + 1
        predicted = model.predict([[next_index]])[0]

        predictions.append(BudgetPrediction(
            category=category,
            sub_category=sub_category,
            predicted=round(predicted, 2)
        ))

    if not predictions:
        raise HTTPException(status_code=400, detail="Not enough data to predict")

    return FullBudgetResponse(user_id=user_id, predicted_budget=predictions)