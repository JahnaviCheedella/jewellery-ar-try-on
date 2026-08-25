from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.category import Category
from ..schemas.category import CategoryOut

router = APIRouter(prefix="/api/categories", tags=["categories"])


@router.get("", response_model=list[CategoryOut])
def get_categories(db: Session = Depends(get_db)):
    stmt = (
        select(Category)
        .where(Category.is_active.is_(True))
        .order_by(Category.display_order, Category.id)
    )
    return db.scalars(stmt).all()
