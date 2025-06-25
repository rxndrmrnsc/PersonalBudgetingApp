from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_google_genai import ChatGoogleGenerativeAI  # Import for Google Gemini
from langchain_core.messages import HumanMessage, AIMessage  # Use langchain_core.messages
import uvicorn
import os  # To access environment variables

app = FastAPI()

# Allow your frontend to access this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace * with your React domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the Google Gemini LLM
# It's recommended to load this from an environment variable for security.
os.environ["GOOGLE_API_KEY"] = os.getenv("API_KEY")
llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash-preview-05-20", temperature=0.7)


class ChatRequest(BaseModel):
    message: str
    history: list[list[str]]  # [[user1, bot1], [user2, bot2], ...]


@app.post("/chat")
def chat(req: ChatRequest):
    history_langchain_format = []
    # convert chat history to langchain HumanMessage and AIMessage format
    for human, ai in req.history:
        history_langchain_format.append(HumanMessage(content=human))
        history_langchain_format.append(AIMessage(content=ai))

    # add the current user message
    history_langchain_format.append(HumanMessage(content=req.message))

    # invoke the Gemini LLM with the formatted history
    response = llm.invoke(history_langchain_format)

    # return the content of the AI's response
    return {"response": response.content}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)