from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from .routes import router


Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="My Inventory API",
    description="API for managing personal inventory",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173",
    "https://meowwwwwwwwwwwwwwwwwwwww.github.io",
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(router)


@app.get("/")
def root():
    return {
        "message": "Inventory API is running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }