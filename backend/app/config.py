import os
from pathlib import Path

from dotenv import load_dotenv

BACKEND_DIR = Path(__file__).resolve().parents[1]
PROJECT_DIR = BACKEND_DIR.parent
UPLOAD_DIR = BACKEND_DIR / "uploads"

# Project .env wins if both exist, then backend/.env can fill gaps.
load_dotenv(PROJECT_DIR / ".env")
load_dotenv(BACKEND_DIR / ".env", override=False)

MAX_RESUME_BYTES = 5 * 1024 * 1024
ALLOWED_EXTENSIONS = {".pdf", ".docx"}
MAX_RESUME_CHARS = 14000

SCORE_WEIGHTS = {
    "skills": 25,
    "projects": 20,
    "education": 15,
    "experience": 15,
    "keywords": 15,
    "structure": 10,
}

CORS_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]


def _clean(value: str | None) -> str:
    return (value or "").strip().strip('"').strip("'")


def ai_provider() -> str | None:
    """Which model API to call. Explicit AI_PROVIDER overrides auto-detect."""
    explicit = _clean(os.getenv("AI_PROVIDER")).lower()
    if explicit in {"openai", "gemini"}:
        return explicit
    if _clean(os.getenv("OPENAI_API_KEY")):
        return "openai"
    if _clean(os.getenv("GEMINI_API_KEY")) or _clean(os.getenv("GOOGLE_API_KEY")):
        return "gemini"
    return None


def openai_settings() -> dict:
    return {
        "api_key": _clean(os.getenv("OPENAI_API_KEY")),
        "model": _clean(os.getenv("OPENAI_MODEL")) or "gpt-4o-mini",
        "base_url": _clean(os.getenv("OPENAI_BASE_URL")) or None,
    }


def gemini_settings() -> dict:
    return {
        "api_key": _clean(os.getenv("GEMINI_API_KEY")) or _clean(os.getenv("GOOGLE_API_KEY")),
        "model": _clean(os.getenv("GEMINI_MODEL")) or "gemini-2.5-flash",
    }


def database_url() -> str:
    return _clean(os.getenv("DATABASE_URL"))
