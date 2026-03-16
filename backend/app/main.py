from fastapi import FastAPI
from app.database.connection import Base, engine
from app.auth.router import router as auth_router

# Creates all tables in the DB on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Parkinson Keystroke Screening API")

app.include_router(auth_router)

@app.get("/")
def health_check():
    return {"status": "API is running"}