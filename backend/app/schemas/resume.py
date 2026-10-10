from pydantic import BaseModel, Field


class ScoreBreakdown(BaseModel):
    skills: int = Field(ge=0, le=100)
    projects: int = Field(ge=0, le=100)
    education: int = Field(ge=0, le=100)
    experience: int = Field(ge=0, le=100)
    keywords: int = Field(ge=0, le=100)
    structure: int = Field(ge=0, le=100)


class ScoreWeights(BaseModel):
    skills: int = 25
    projects: int = 20
    education: int = 15
    experience: int = 15
    keywords: int = 15
    structure: int = 10


class ResumeInfo(BaseModel):
    name: str = ""
    education: list[str] = Field(default_factory=list)
    projects: list[str] = Field(default_factory=list)
    experience: list[str] = Field(default_factory=list)
    certifications: list[str] = Field(default_factory=list)


class ResumeUploadResponse(BaseModel):
    id: str
    filename: str
    size: int


class ResumeAnalysisResponse(BaseModel):
    resumeId: str
    filename: str
    overallScore: int
    breakdown: ScoreBreakdown
    weights: ScoreWeights
    strengths: list[str]
    improvements: list[str]
    extractedSkills: list[str]
    info: ResumeInfo
