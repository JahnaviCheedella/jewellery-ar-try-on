from datetime import datetime
from decimal import Decimal
from sqlalchemy import Boolean, DateTime, Integer, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column
from ..database import Base


class Jewellery(Base):
    __tablename__ = "jewellery"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(160), nullable=False)
    category: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    description: Mapped[str] = mapped_column(Text, default="")
    price: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=0)
    material: Mapped[str] = mapped_column(String(80), default="Gold")
    purity: Mapped[str] = mapped_column(String(40), default="22K")
    weight: Mapped[Decimal] = mapped_column(Numeric(8, 3), default=0)
    image_url: Mapped[str] = mapped_column(String(500), nullable=False)
    ar_asset_url: Mapped[str] = mapped_column(String(500), nullable=False)
    anchor_type: Mapped[str] = mapped_column(String(50), nullable=False)
    scale: Mapped[float] = mapped_column(default=1.0)
    offset_x: Mapped[float] = mapped_column(default=0)
    offset_y: Mapped[float] = mapped_column(default=0)
    rotation_enabled: Mapped[bool] = mapped_column(Boolean, default=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
