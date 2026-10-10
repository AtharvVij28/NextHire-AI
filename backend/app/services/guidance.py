from app.services.ai_client import complete_json


def recommend_careers(profile: dict) -> dict:
    payload = complete_json(
        """
You are a career mentor for college students and fresh graduates.
Use only the resume profile provided. Do not invent jobs, degrees, or skills the student does not have.
Return JSON:
{
  "recommendations": [
    {
      "career": "role name",
      "matchPercentage": 0,
      "skills": ["skills from the profile that support this role"],
      "missingSkills": ["important skills they still need"],
      "description": "one sentence",
      "roadmap": {
        "currentSkills": ["skills they already have for this path"],
        "skillsToLearn": ["next skills"],
        "projects": ["specific project ideas"],
        "interviewPreparation": ["what to practice"],
        "jobReady": "one sentence describing the outcome"
      }
    }
  ]
}
Return exactly 3 recommendations, ordered from strongest match to weakest.
matchPercentage is an integer from 0 to 100.
""".strip(),
        _profile_prompt(profile),
    )
    recommendations = []
    for item in (payload.get("recommendations") or [])[:3]:
        if not isinstance(item, dict):
            continue
        roadmap = item.get("roadmap") if isinstance(item.get("roadmap"), dict) else {}
        recommendations.append(
            {
                "career": _text(item.get("career")) or "Career path",
                "matchPercentage": _score(item.get("matchPercentage")),
                "skills": _items(item.get("skills"), limit=8),
                "missingSkills": _items(item.get("missingSkills"), limit=8),
                "description": _text(item.get("description")),
                "roadmap": {
                    "currentSkills": _items(roadmap.get("currentSkills"), limit=6),
                    "skillsToLearn": _items(roadmap.get("skillsToLearn"), limit=6),
                    "projects": _items(roadmap.get("projects"), limit=4),
                    "interviewPreparation": _items(roadmap.get("interviewPreparation"), limit=4),
                    "jobReady": _text(roadmap.get("jobReady")),
                },
            }
        )
    if not recommendations:
        raise ValueError("The AI did not return career recommendations.")
    return {"recommendations": recommendations}


def match_job(profile: dict, job_description: str) -> dict:
    payload = complete_json(
        """
Compare a student's resume profile with one job description.
Base the result only on evidence in the profile and the job text.
Return JSON:
{
  "compatibility": 0,
  "matchedSkills": ["skills present in both"],
  "missingSkills": ["important job skills missing from the profile"],
  "explanation": "2 or 3 sentences explaining the score"
}
compatibility is an integer from 0 to 100.
""".strip(),
        _profile_prompt(profile) + f"\n\nJob description:\n{job_description[:8000]}",
    )
    return {
        "compatibility": _score(payload.get("compatibility")),
        "matchedSkills": _items(payload.get("matchedSkills"), limit=12),
        "missingSkills": _items(payload.get("missingSkills"), limit=12),
        "explanation": _text(payload.get("explanation")),
    }


def start_interview(profile: dict, role: str, difficulty: str, interview_type: str) -> dict:
    payload = complete_json(
        """
Create interview practice questions for a college student.
Use their resume profile so questions relate to their projects and skills.
Return JSON:
{
  "questions": [
    {"question": "one question", "type": "Technical or Behavioral"}
  ]
}
Return exactly 5 questions.
Match the requested interview type: Technical, Behavioral, or Mixed.
Match the requested difficulty: Easy, Medium, or Hard.
""".strip(),
        _profile_prompt(profile)
        + f"\n\nTarget role: {role}\nDifficulty: {difficulty}\nInterview type: {interview_type}",
    )
    questions = []
    for index, item in enumerate((payload.get("questions") or [])[:5], start=1):
        if isinstance(item, str):
            text = _text(item)
            kind = interview_type
        elif isinstance(item, dict):
            text = _text(item.get("question"))
            kind = _text(item.get("type")) or interview_type
        else:
            continue
        if text:
            questions.append({"id": index, "question": text, "type": kind})
    if not questions:
        raise ValueError("The AI did not return interview questions.")
    return {
        "sessionId": f"interview-{role.lower().replace(' ', '-')}",
        "questions": questions,
    }


def evaluate_answer(*, role: str, question: str, answer: str) -> dict:
    payload = complete_json(
        """
Evaluate one interview answer from a college student.
Return JSON:
{
  "technicalAccuracy": 0,
  "relevance": 0,
  "completeness": 0,
  "clarity": 0,
  "overall": 0,
  "feedback": "2 or 3 sentences of specific feedback"
}
Each score is an integer from 0 to 100.
overall should reflect the other four scores.
Do not claim the answer included facts that are not in the answer text.
""".strip(),
        f"Target role: {role}\n\nQuestion:\n{question}\n\nAnswer:\n{answer[:4000]}",
    )
    scores = {
        "technicalAccuracy": _score(payload.get("technicalAccuracy")),
        "relevance": _score(payload.get("relevance")),
        "completeness": _score(payload.get("completeness")),
        "clarity": _score(payload.get("clarity")),
    }
    overall = payload.get("overall")
    if overall is None:
        overall = round(sum(scores.values()) / 4)
    return {**scores, "overall": _score(overall), "feedback": _text(payload.get("feedback"))}


def _profile_prompt(profile: dict) -> str:
    return "Student resume profile:\n" + str(
        {
            "name": _text(profile.get("name")),
            "targetCareer": _text(profile.get("targetCareer")),
            "skills": _items(profile.get("skills"), limit=30),
            "education": _items(profile.get("education"), limit=8),
            "projects": _items(profile.get("projects"), limit=8),
            "experience": _items(profile.get("experience"), limit=8),
            "certifications": _items(profile.get("certifications"), limit=8),
            "strengths": _items(profile.get("strengths"), limit=5),
            "improvements": _items(profile.get("improvements"), limit=5),
        }
    )


def _score(value) -> int:
    try:
        number = int(round(float(value)))
    except (TypeError, ValueError):
        return 0
    return max(0, min(100, number))


def _text(value) -> str:
    if value is None:
        return ""
    return str(value).strip()


def _items(value, *, limit: int) -> list[str]:
    if value is None:
        return []
    source = [value] if isinstance(value, str) else value if isinstance(value, list) else []
    cleaned = []
    seen = set()
    for item in source:
        text = _text(item)
        key = text.lower()
        if not text or key in seen:
            continue
        seen.add(key)
        cleaned.append(text)
        if len(cleaned) >= limit:
            break
    return cleaned
