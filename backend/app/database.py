from sqlalchemy import create_engine
from sqlalchemy.engine import make_url
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from app.config import database_url

engine = None
SessionLocal = None


class Base(DeclarativeBase):
    pass


def db_ready() -> bool:
    return SessionLocal is not None


def init_db() -> None:
    """Create the nexthire database if needed, then create tables."""
    global engine, SessionLocal

    url = database_url()
    if not url:
        raise RuntimeError("DATABASE_URL is not set in backend/.env.")

    _ensure_database(url)
    engine = create_engine(url, pool_pre_ping=True)
    SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

    from app.models.user import User  # noqa: F401

    Base.metadata.create_all(bind=engine)


def _ensure_database(url: str) -> None:
    import psycopg
    from psycopg import sql

    parsed = make_url(url)
    db_name = parsed.database
    if not db_name or db_name == "postgres":
        raise RuntimeError("DATABASE_URL should point at a database named nexthire.")

    connection = psycopg.connect(
        host=parsed.host or "localhost",
        port=parsed.port or 5432,
        user=parsed.username,
        password=parsed.password or "",
        dbname="postgres",
        autocommit=True,
    )
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1 FROM pg_database WHERE datname = %s", (db_name,))
            if cursor.fetchone() is None:
                cursor.execute(sql.SQL("CREATE DATABASE {}").format(sql.Identifier(db_name)))
    finally:
        connection.close()
