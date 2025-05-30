import uuid
from typing import Any

from sqlmodel import Session, select
from app.core.security import get_password_hash, verify_password
from app.models import Item, ItemCreate, User, UserCreate, UserUpdate
from app.models import Workout, Exercise, PersonalBest, PersonalBestCreate
from datetime import date

# Define metric keys for exercises we want to track personal bests for
TRACKED_EXERCISES = {
    "bench press": "bench-press",
    "squat": "squat",
    "deadlift": "deadlift",
    "push-ups": "pushups",
    "pull-ups": "pullups",
    # extend as needed
}

def create_user(*, session: Session, user_create: UserCreate) -> User:
    db_obj = User.model_validate(
        user_create, update={"hashed_password": get_password_hash(user_create.password)}
    )
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return db_obj


def update_user(*, session: Session, db_user: User, user_in: UserUpdate) -> Any:
    user_data = user_in.model_dump(exclude_unset=True)
    extra_data = {}
    if "password" in user_data:
        password = user_data["password"]
        hashed_password = get_password_hash(password)
        extra_data["hashed_password"] = hashed_password
    db_user.sqlmodel_update(user_data, update=extra_data)
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user


def get_user_by_email(*, session: Session, email: str) -> User | None:
    statement = select(User).where(User.email == email)
    session_user = session.exec(statement).first()
    return session_user


def authenticate(*, session: Session, email: str, password: str) -> User | None:
    db_user = get_user_by_email(session=session, email=email)
    if not db_user:
        return None
    if not verify_password(password, db_user.hashed_password):
        return None
    return db_user


def create_item(*, session: Session, item_in: ItemCreate, owner_id: uuid.UUID) -> Item:
    db_item = Item.model_validate(item_in, update={"owner_id": owner_id})
    session.add(db_item)
    session.commit()
    session.refresh(db_item)
    return db_item



#TODO test, create_or_update_personal_best will upsert only if the new value is strictly better.
# Two getters: one for all metrics, one for a single metric.

def create_or_update_personal_best(
    *, session: Session, user_id: uuid.UUID, pb_in: PersonalBestCreate
) -> PersonalBest:
    # see if user already has a PB on this metric
    stmt = select(PersonalBest).where(
        PersonalBest.user_id == user_id,
        PersonalBest.metric == pb_in.metric
    )
    existing = session.exec(stmt).one_or_none()

    # update if new value is "better" (you define the logic per metric)
    if existing:
        if pb_in.value > existing.value:
            existing.value = pb_in.value
            existing.date = pb_in.date
            session.add(existing)
    else:
        existing = PersonalBest.model_validate(pb_in, update={"user_id": user_id})
        session.add(existing)

    session.commit()
    session.refresh(existing)
    return existing

def get_personal_bests(
    *, session: Session, user_id: uuid.UUID
) -> list[PersonalBest]:
    stmt = select(PersonalBest).where(PersonalBest.user_id == user_id)
    return session.exec(stmt).all()

def get_personal_best(
    *, session: Session, user_id: uuid.UUID, metric: str
) -> PersonalBest | None:
    stmt = select(PersonalBest).where(
        PersonalBest.user_id == user_id,
        PersonalBest.metric == metric
    )
    return session.exec(stmt).one_or_none()

def update_personal_bests_after_workout(*, session: Session, workout: Workout):
    user_id = workout.user_id

    # Fetch all exercises associated with this workout
    exercises = workout.exercises

    for exercise in exercises:
        name = exercise.name.lower()
        metric_key = TRACKED_EXERCISES.get(name)
        if not metric_key:
            #
            continue  # skip exercises we don't track

        # Use weight * reps as performance metric for now
        value = (exercise.weight or 0) * (exercise.reps or 0)
        if value <= 0:
            #continue
            value = 0

        pb_in = PersonalBestCreate(metric=metric_key, value=value, date=date.today())

        from app.crud import create_or_update_personal_best  # to avoid circular imports
        create_or_update_personal_best(session=session, user_id=user_id, pb_in=pb_in)