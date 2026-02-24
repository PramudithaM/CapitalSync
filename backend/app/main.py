from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routes import income, expense, transaction, categories  # ← added categories

Base.metadata.create_all(bind=engine)

app = FastAPI(title="WealthTrack API", version="1.0.0")

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(income.router)
app.include_router(expense.router)
app.include_router(transaction.router)
app.include_router(categories.router) 
@app.get("/")
def read_root():
    return {"message": "WealthTrack API is running"}