from sqlalchemy import select
from sqlalchemy.orm import Session
from models.jewellery import Jewellery


def list_jewellery(db: Session, category: str | None = None):
    stmt = select(Jewellery).where(Jewellery.is_active.is_(True)).order_by(Jewellery.id)
    if category:
        stmt = stmt.where(Jewellery.category == category)
    return db.scalars(stmt).all()


def get_jewellery(db: Session, jewellery_id: int):
    return db.get(Jewellery, jewellery_id)
