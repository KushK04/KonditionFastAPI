import uuid
from typing import Any, List

from sqlmodel import Session, select
from app.core.security import get_password_hash, verify_password
from app.models import Item, ItemCreate, User, UserCreate, UserUpdate
from app.models import Workout, PersonalBest, PersonalBestCreate
from app.models import User, PushToken, CustomReminder
from datetime import date, datetime, timezone

# Define metric keys for exercises we want to track personal bests for
TRACKED_EXERCISES = {
    "bench press": "bench-press",
    "squat": "squat",
    "deadlift": "deadlift",
    "push-ups": "pushups",
    "pull-ups": "pullups",
    # extend as needed
}


def create_or_update_push_token(
    *,
    session: Session,
    user_id: uuid.UUID,
    expo_token: str
) -> PushToken:
    """
    If a PushToken already exists for this user_id, update its expo_token.
    Otherwise, create a new row in push_tokens.
    """
    user_exists = session.exec(select(User).where(User.id == user_id)).first()
    if not user_exists:
        raise ValueError(f"User {user_id} not found when registering push token.")

    # See if there's already a PushToken
    stmt = select(PushToken).where(PushToken.user_id == user_id)
    existing = session.exec(stmt).one_or_none()

    if existing:
        existing.expo_token = expo_token
        session.add(existing)
        session.commit()
        session.refresh(existing)
        return existing
    else:
        new_token = PushToken(user_id=user_id, expo_token=expo_token)
        session.add(new_token)
        session.commit()
        session.refresh(new_token)
        return new_token