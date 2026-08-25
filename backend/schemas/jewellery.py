from decimal import Decimal
from pydantic import BaseModel, ConfigDict


class JewelleryOut(BaseModel):
    id: int
    name: str
    category: str
    description: str
    price: Decimal
    material: str
    purity: str
    weight: Decimal
    image_url: str
    ar_asset_url: str
    anchor_type: str
    scale: float
    offset_x: float
    offset_y: float
    rotation_enabled: bool

    model_config = ConfigDict(from_attributes=True)
