from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.services.ai_client import AIServiceError
from app.services.guidance import evaluate_answer, match_job, recommend_careers, start_interview

router = APIRouter(tags=["guidance"])


class ProfilePayload(BaseModel):
    name: str = ""
    targetCareer: str = ""
    skills: list[str] = Field(default_factory=list)
    education: list[str] = Field(default_factory=list)
    projects: list[str] = Field(default_factory=list)
    experience: list[str] = Field(default_factory=list)
    certifications: list[str] = Field(default_factory=list)
    strengths: list[str] = Field(default_factory=list)
    improvements: list[str] = Field(default_factory=list)


class CareerRequest(BaseModel):
    profile: ProfilePayload


class JobMatchRequest(BaseModel):
    profile: ProfilePayload
    jobDescription: str = Field(min_length=20)


class InterviewStartRequest(BaseModel):
    profile: ProfilePayload
    role: str = Field(min_length=2, max_length=120)
    difficulty: str = "Medium"
    interviewType: str = "Mixed"


class InterviewAnswerRequest(BaseModel):
    role: str = ""
    question: str = Field(min_length=5)
    answer: str = Field(min_length=1)


def _profile(payload: ProfilePayload) -> dict:
    return payload.model_dump()


def _ai_error(exc: AIServiceError) -> HTTPException:
    return HTTPException(status_code=exc.status_code, detail=exc.message)


@router.post("/api/career/recommendations")
def career_recommendations(body: CareerRequest):
    try:
        return recommend_careers(_profile(body.profile))
    except AIServiceError as exc:
        raise _ai_error(exc) from exc
    except ValueError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc


@router.post("/api/job-matcher")
def job_matcher(body: JobMatchRequest):
    try:
        return match_job(_profile(body.profile), body.jobDescription.strip())
    except AIServiceError as exc:
        raise _ai_error(exc) from exc


@router.post("/api/interview/start")
def interview_start(body: InterviewStartRequest):
    difficulty = body.difficulty if body.difficulty in {"Easy", "Medium", "Hard"} else "Medium"
    interview_type = body.interviewType if body.interviewType in {"Technical", "Behavioral", "Mixed"} else "Mixed"
    try:
        return start_interview(_profile(body.profile), body.role.strip(), difficulty, interview_type)
    except AIServiceError as exc:
        raise _ai_error(exc) from exc
    except ValueError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc


@router.post("/api/interview/answer")
def interview_answer(body: InterviewAnswerRequest):
    try:
        evaluation = evaluate_answer(
            role=body.role.strip() or "the target role",
            question=body.question.strip(),
            answer=body.answer.strip(),
        )
    except AIServiceError as exc:
        raise _ai_error(exc) from exc
    return {"evaluation": evaluation}
