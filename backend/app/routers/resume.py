from pathlib import Path

from fastapi import APIRouter, File, HTTPException, UploadFile

from app.config import ALLOWED_EXTENSIONS, MAX_RESUME_BYTES, ai_provider
from app.schemas.resume import ResumeAnalysisResponse, ResumeUploadResponse
from app.services.resume_analyzer import ResumeAnalysisError, analyze_resume_text
from app.services.resume_parser import ResumeParseError, extract_resume_text
from app.services.resume_store import get_resume, save_resume

router = APIRouter(prefix="/api/resume", tags=["resume"])


@router.get("/ai-status")
def ai_status():
    provider = ai_provider()
    return {
        "configured": provider is not None,
        "provider": provider,
    }


@router.post("/upload", response_model=ResumeUploadResponse)
async def upload_resume(file: UploadFile = File(...)):
    filename = file.filename or ""
    extension = _extension(filename)
    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Invalid file type. Please upload a PDF or DOCX resume.",
        )

    data = await file.read()
    if not data:
        raise HTTPException(status_code=400, detail="The selected file appears to be empty.")
    if len(data) > MAX_RESUME_BYTES:
        raise HTTPException(status_code=413, detail="File is too large. Maximum size is 5 MB.")

    record = save_resume(filename=filename, data=data, extension=extension)
    return ResumeUploadResponse(
        id=record["id"],
        filename=record["filename"],
        size=record["size"],
    )


@router.post("/{resume_id}/analyze", response_model=ResumeAnalysisResponse)
def analyze_resume(resume_id: str):
    record = get_resume(resume_id)
    if record is None:
        raise HTTPException(status_code=404, detail="Resume not found. Upload it again and retry.")

    try:
        data = Path(record["path"]).read_bytes()
        text = extract_resume_text(data, record["extension"])
        return analyze_resume_text(
            resume_id=record["id"],
            filename=record["filename"],
            text=text,
        )
    except ResumeParseError as exc:
        raise HTTPException(status_code=422, detail=exc.message) from exc
    except ResumeAnalysisError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.message) from exc


def _extension(filename: str) -> str:
    dot = filename.rfind(".")
    if dot < 0:
        return ""
    return filename[dot:].lower()
