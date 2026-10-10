from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app import database
from app.models.user import User
from app.schemas.auth import AuthResponse, LoginRequest, RegisterRequest, UserPublic
from app.services.passwords import hash_password, verify_password

router = APIRouter(prefix="/api/auth", tags=["auth"])

DB_UNAVAILABLE = (
    "PostgreSQL is not connected. Set DATABASE_URL in backend/.env to your local "
    "Postgres password and restart the API."
)


def get_db():
    if database.SessionLocal is None:
        raise HTTPException(status_code=503, detail=DB_UNAVAILABLE)
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()


def _blank_to_none(value: str | None) -> str | None:
    if value is None:
        return None
    cleaned = value.strip()
    return cleaned or None


@router.post("/register", response_model=AuthResponse, status_code=201)
def register_user(payload: RegisterRequest, db: Session = Depends(get_db)):
    email = payload.email.lower()
    existing = db.query(User).filter(User.email == email).first()
    if existing:
        raise HTTPException(status_code=409, detail="An account with this email already exists.")

    user = User(
        full_name=payload.full_name.strip(),
        email=email,
        password_hash=hash_password(payload.password),
        target_career=_blank_to_none(payload.target_career),
        current_education=_blank_to_none(payload.current_education),
    )
    db.add(user)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="An account with this email already exists.")
    db.refresh(user)
    return AuthResponse(user=UserPublic.model_validate(user))


@router.post("/login", response_model=AuthResponse)
def login_user(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email.lower()).first()
    if user is None or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Incorrect email or password.")
    return AuthResponse(user=UserPublic.model_validate(user))
