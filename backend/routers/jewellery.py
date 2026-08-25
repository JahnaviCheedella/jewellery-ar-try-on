from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..schemas.jewellery import JewelleryOut
from ..services.jewellery_service import get_jewellery, list_jewellery

router = APIRouter(prefix="/api/jewellery", tags=["jewellery"])


@router.get("", response_model=list[JewelleryOut])
def get_items(category: str | None = Query(default=None), db: Session = Depends(get_db)):
    return list_jewellery(db, category)


@router.get("/{jewellery_id}", response_model=JewelleryOut)
def get_item(jewellery_id: int, db: Session = Depends(get_db)):
    item = get_jewellery(db, jewellery_id)
    if not item or not item.is_active:
        raise HTTPException(status_code=404, detail="Jewellery not found")
    return item
