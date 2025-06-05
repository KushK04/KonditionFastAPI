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

def schedule_custom_reminder(
    *,
    session: Session,
    user_id: uuid.UUID,
    expo_token: str,
    remind_time: datetime,
    message: str
) -> CustomReminder:
    """
    Insert a new CustomReminder row. The background scheduler
    (running every minute) will pick it up when remind_time <= now().
    """
    # (Optional) Confirm the user exists
    user_exists = session.exec(select(User).where(User.id == user_id)).first()
    if not user_exists:
        raise ValueError(f"User {user_id} not found when scheduling reminder.")

    new_reminder = CustomReminder(
        user_id=user_id,
        expo_token=expo_token,
        remind_time=remind_time,
        message=message,
        sent_at=None,
    )
    session.add(new_reminder)
    session.commit()
    session.refresh(new_reminder)
    return new_reminder


def get_due_custom_reminders(*, session: Session) -> List[CustomReminder]:
    """
    Return all CustomReminder rows where:
      - remind_time <= current UTC time
      - sent_at is still None (i.e. not yet delivered).
    """
    now_utc = datetime.now(timezone.utc)
    stmt = select(CustomReminder).where(
        CustomReminder.remind_time <= now_utc,
        CustomReminder.sent_at.is_(None),
    )
    return session.exec(stmt).all()


def mark_reminder_as_sent(
    *,
    session: Session,
    reminder_id: uuid.UUID
) -> CustomReminder:
    """
    After sending a reminder, set its sent_at timestamp to UTC now,
    so it will no longer appear in get_due_custom_reminders().
    """
    stmt = select(CustomReminder).where(CustomReminder.id == reminder_id)
    reminder = session.exec(stmt).one_or_none()
    if not reminder:
        raise ValueError(f"CustomReminder {reminder_id} not found.")
    reminder.sent_at = datetime.now(timezone.utc)
    session.add(reminder)
    session.commit()
    session.refresh(reminder)
    return reminder
