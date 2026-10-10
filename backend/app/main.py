from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import CORS_ORIGINS
from app.database import db_ready, init_db
from app.routers.auth import router as auth_router
from app.routers.guidance import router as guidance_router
from app.routers.resume import router as resume_router


@asynccontextmanager
async def lifespan(_app: FastAPI):
    try:
        init_db()
    except Exception as exc:
        print(f"PostgreSQL is not ready: {exc}")
    yield


app = FastAPI(
    title="NextHire AI API",
    description="AI-powered career readiness platform",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(resume_router)
app.include_router(auth_router)
app.include_router(guidance_router)


@app.get("/")
def root():
    return {
        "message": "Welcome to NextHire AI",
        "status": "API is running",
    }


@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "database": "connected" if db_ready() else "unavailable",
    }
