import threading
import uuid
from pathlib import Path

from app.config import UPLOAD_DIR

_lock = threading.Lock()
_resumes: dict[str, dict] = {}


def ensure_upload_dir() -> None:
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


def save_resume(*, filename: str, data: bytes, extension: str) -> dict:
    ensure_upload_dir()
    resume_id = str(uuid.uuid4())
    stored_name = f"{resume_id}{extension}"
    path = UPLOAD_DIR / stored_name
    path.write_bytes(data)

    record = {
        "id": resume_id,
        "filename": Path(filename).name,
        "size": len(data),
        "extension": extension,
        "path": str(path),
    }
    with _lock:
        _resumes[resume_id] = record
    return record


def get_resume(resume_id: str) -> dict | None:
    with _lock:
        record = _resumes.get(resume_id)
        return dict(record) if record else None
