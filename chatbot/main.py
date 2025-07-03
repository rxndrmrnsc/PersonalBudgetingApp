import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from prediction import router as budget_router
from chatbot import router as chatbot_router

app = FastAPI()
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow React frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register both routers
app.include_router(budget_router)
app.include_router(chatbot_router)

@app.get("/")
def root():
    return {"message": "Welcome to the Budgeting + Chatbot API"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)