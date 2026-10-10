import json
import re

import httpx
from openai import OpenAI

from app.config import ai_provider, gemini_settings, openai_settings


class AIServiceError(Exception):
    def __init__(self, message: str, status_code: int = 502):
        super().__init__(message)
        self.message = message
        self.status_code = status_code


def complete_json(instructions: str, user_prompt: str) -> dict:
    provider = ai_provider()
    if provider is None:
        raise AIServiceError(
            "No AI API key is configured. Add OPENAI_API_KEY or GEMINI_API_KEY to backend/.env and restart the API.",
            status_code=503,
        )

    try:
        if provider == "openai":
            raw = _call_openai(instructions, user_prompt)
        elif provider == "gemini":
            raw = _call_gemini(instructions, user_prompt)
        else:
            raise AIServiceError("Unsupported AI provider.", status_code=500)
    except AIServiceError:
        raise
    except Exception as exc:
        raise AIServiceError(
            "The AI service could not complete this request. Check the API key, model name, and network connection."
        ) from exc

    return _parse_json(raw)


def _call_openai(instructions: str, user_prompt: str) -> str:
    settings = openai_settings()
    if not settings["api_key"]:
        raise AIServiceError(
            "OPENAI_API_KEY is missing. Add it to backend/.env and restart the API.",
            status_code=503,
        )

    # An empty OPENAI_BASE_URL in .env must not replace the official API address.
    client = OpenAI(
        api_key=settings["api_key"],
        base_url=settings["base_url"] or "https://api.openai.com/v1",
    )
    response = client.chat.completions.create(
        model=settings["model"],
        temperature=0.2,
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": instructions},
            {"role": "user", "content": user_prompt},
        ],
    )
    content = response.choices[0].message.content if response.choices else ""
    if not content:
        raise AIServiceError("The AI returned an empty response.")
    return content


def _call_gemini(instructions: str, user_prompt: str) -> str:
    settings = gemini_settings()
    if not settings["api_key"]:
        raise AIServiceError(
            "GEMINI_API_KEY is missing. Add it to backend/.env and restart the API.",
            status_code=503,
        )

    url = (
        "https://generativelanguage.googleapis.com/v1beta/models/"
        f"{settings['model']}:generateContent"
    )
    body = {
        "systemInstruction": {"parts": [{"text": instructions}]},
        "contents": [{"role": "user", "parts": [{"text": user_prompt}]}],
        "generationConfig": {
            "temperature": 0.2,
            "responseMimeType": "application/json",
        },
    }
    try:
        response = httpx.post(url, params={"key": settings["api_key"]}, json=body, timeout=60)
    except httpx.HTTPError as exc:
        raise AIServiceError("Could not reach the Gemini API. Check your network connection.") from exc

    if response.status_code in {400, 401, 403}:
        raise AIServiceError(
            "Gemini rejected the request. Check GEMINI_API_KEY and GEMINI_MODEL.",
            status_code=502,
        )
    if response.status_code >= 400:
        raise AIServiceError("The Gemini API failed while handling this request.")

    data = response.json()
    candidates = data.get("candidates") or []
    if not candidates:
        raise AIServiceError("The AI returned an empty response.")
    parts = candidates[0].get("content", {}).get("parts") or []
    text = "".join(part.get("text", "") for part in parts).strip()
    if not text:
        raise AIServiceError("The AI returned an empty response.")
    return text


def _parse_json(raw: str) -> dict:
    cleaned = raw.strip()
    if cleaned.startswith("```"):
        cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned)
        cleaned = re.sub(r"\s*```$", "", cleaned)
    try:
        parsed = json.loads(cleaned)
    except json.JSONDecodeError as exc:
        raise AIServiceError("The AI response was not valid JSON.") from exc
    if not isinstance(parsed, dict):
        raise AIServiceError("The AI response had an unexpected format.")
    return parsed
