from app.config import SCORE_WEIGHTS
from app.schemas.resume import ResumeAnalysisResponse, ResumeInfo, ScoreBreakdown, ScoreWeights
from app.services.ai_client import AIServiceError, complete_json

ANALYSIS_INSTRUCTIONS = """
You review resumes for college students and fresh graduates.
Read only the resume text provided. Do not invent employers, degrees, projects, or skills that are not supported by the text.
Return a single JSON object and nothing else, using this exact shape:
{
  "breakdown": {
    "skills": 0,
    "projects": 0,
    "education": 0,
    "experience": 0,
    "keywords": 0,
    "structure": 0
  },
  "strengths": ["short phrase"],
  "improvements": ["short phrase"],
  "extractedSkills": ["skill"],
  "info": {
    "name": "",
    "education": ["one line each"],
    "projects": ["one line each"],
    "experience": ["one line each"],
    "certifications": ["one line each"]
  }
}
Each breakdown value is an integer from 0 to 100:
- skills: relevance and clarity of technical and professional skills
- projects: presence, relevance, and measurable outcomes
- education: degree, institution, and academic clarity
- experience: internships, jobs, or practical work
- keywords: coverage of role-relevant terms a recruiter would search for
- structure: headings, readability, contact info, and organization
Give 3 to 5 strengths and 3 to 5 concrete improvements.
extractedSkills should be short skill names found in the resume.
""".strip()


class ResumeAnalysisError(Exception):
    def __init__(self, message: str, status_code: int = 502):
        super().__init__(message)
        self.message = message
        self.status_code = status_code


def analyze_resume_text(*, resume_id: str, filename: str, text: str) -> ResumeAnalysisResponse:
    try:
        payload = complete_json(ANALYSIS_INSTRUCTIONS, f"Resume text:\n\n{text}")
    except AIServiceError as exc:
        raise ResumeAnalysisError(exc.message, status_code=exc.status_code) from exc
    return _to_response(payload, resume_id=resume_id, filename=filename)


def _to_response(payload: dict, *, resume_id: str, filename: str) -> ResumeAnalysisResponse:
    breakdown_raw = payload.get("breakdown") or {}
    breakdown = ScoreBreakdown(
        skills=_score(breakdown_raw.get("skills")),
        projects=_score(breakdown_raw.get("projects")),
        education=_score(breakdown_raw.get("education")),
        experience=_score(breakdown_raw.get("experience")),
        keywords=_score(breakdown_raw.get("keywords")),
        structure=_score(breakdown_raw.get("structure")),
    )
    overall = round(
        sum(getattr(breakdown, key) * (weight / 100) for key, weight in SCORE_WEIGHTS.items())
    )
    info_raw = payload.get("info") or {}

    return ResumeAnalysisResponse(
        resumeId=resume_id,
        filename=filename,
        overallScore=max(0, min(100, overall)),
        breakdown=breakdown,
        weights=ScoreWeights(**SCORE_WEIGHTS),
        strengths=_string_list(payload.get("strengths"), limit=5),
        improvements=_string_list(
            payload.get("improvements") or payload.get("areasToImprove"),
            limit=5,
        ),
        extractedSkills=_string_list(
            payload.get("extractedSkills") or payload.get("skills"),
            limit=30,
        ),
        info=ResumeInfo(
            name=_string(info_raw.get("name") or info_raw.get("fullName")),
            education=_string_list(info_raw.get("education"), limit=8),
            projects=_string_list(info_raw.get("projects"), limit=8),
            experience=_string_list(info_raw.get("experience"), limit=8),
            certifications=_string_list(info_raw.get("certifications"), limit=8),
        ),
    )


def _score(value) -> int:
    try:
        number = int(round(float(value)))
    except (TypeError, ValueError):
        return 0
    return max(0, min(100, number))


def _string(value) -> str:
    if value is None:
        return ""
    return str(value).strip()


def _string_list(value, *, limit: int) -> list[str]:
    if value is None:
        return []
    if isinstance(value, str):
        items = [value]
    elif isinstance(value, list):
        items = value
    else:
        return []

    cleaned = []
    seen = set()
    for item in items:
        text = _string(item)
        key = text.lower()
        if not text or key in seen:
            continue
        seen.add(key)
        cleaned.append(text)
        if len(cleaned) >= limit:
            break
    return cleaned
