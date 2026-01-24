from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from contextlib import asynccontextmanager
from model import classifier

class ClassificationRequest(BaseModel):
    text: str

class ExpenseItem(BaseModel):
    date: str
    category: str
    cost: float
    desc: str

class ClassificationResponse(BaseModel):
    items: list[ExpenseItem]

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load the model on startup
    classifier.load_models("models")
    yield
    # Clean up (if needed)

import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(lifespan=lifespan)

# Get frontend URL from env or default to local dev
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Budget Classifier API is running"}

@app.post("/classify", response_model=ClassificationResponse)
def classify_text(request: ClassificationRequest):
    if not request.text:
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    
    items = classifier.predict_v2(request.text)
    
    return ClassificationResponse(items=items)
