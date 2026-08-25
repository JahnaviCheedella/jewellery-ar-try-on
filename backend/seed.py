from decimal import Decimal
from database import Base, SessionLocal, engine
# pyrefly: ignore [missing-import]
from models import Category, Jewellery

Base.metadata.create_all(bind=engine)

CATEGORIES = [
    ("Earrings", "earrings", 1),
    ("Necklaces", "necklaces", 2),
    ("Nose Rings", "nose-rings", 3),
]

ITEMS = [
("Ruby Floral Jhumka", "earrings", "Floral jhumka featuring ruby stones with intricate detailing.", 58000, "Ruby", "22K", 8.2, "/assets/jewellery/earrings/earring-1.png", "/assets/jewellery/earrings/earring-1.png", "ear", 1.0, 0, 5, True),

("Diamond Halo Earring", "earrings", "Halo-style earring featuring a central diamond surrounded by smaller stones.", 85000, "Diamond", "18K", 9.1, "/assets/jewellery/earrings/earring2.png", "/assets/jewellery/earrings/earring2.png", "ear", 1.05, 0, 6, True),

("Pearl Drop Earring", "earrings", "Elegant earring featuring a pearl drop with a refined oval design.", 42000, "Pearl", "18K", 4.8, "/assets/jewellery/earrings/earring3.png", "/assets/jewellery/earrings/earring3.png", "ear", 0.9, 0, 3, True),

("Star Chain Earring", "earrings", "Star-shaped earring with a delicate hanging chain design.", 36000, "Gold", "22K", 7.4, "/assets/jewellery/earrings/earring4.png", "/assets/jewellery/earring4.png", "ear", 0.95, 0, 5, True),

("Diamond Temple Necklace", "necklaces", "Traditional temple necklace featuring diamond stones and intricate detailing.", 185000, "Diamond", "22K", 24.5, "/assets/jewellery/necklaces/necklace1.png", "/assets/jewellery/necklaces/necklace1.png", "neck", 0.95, 0, 0, True),

("Heart Pendant Necklace", "necklaces", "Elegant necklace featuring a heart-shaped pendant on a delicate chain.", 95000, "Gold", "18K", 29.0, "/assets/jewellery/necklaces/necklace2.png", "/assets/jewellery/necklaces/necklace2.png", "neck", 1.42, 0, 18, True),

("Pearl Necklace", "necklaces", "Classic necklace featuring a strand of elegant white pearls.", 125000, "Pearl", "22K", 15.5, "/assets/jewellery/necklaces/necklace4.png", "/assets/jewellery/necklaces/necklace4.png", "neck", 1.28, 0, 12, True),

("Traditional Nose Ring", "nose-rings", "Traditional nose ring featuring an intricate circular design.", 18000, "Gold", "22K", 1.2, "/assets/jewellery/nose-rings/nosering1.png", "/assets/jewellery/nose-rings/nosering1.png", "nose", 0.7, 0, 0, True),

("Ruby Beaded Nose Ring", "nose-rings", "Traditional nose ring decorated with ruby beads and detailed craftsmanship.", 26000, "Ruby", "22K", 1.4, "/assets/jewellery/nose-rings/nosering2.png", "/assets/jewellery/nose-rings/nosering2.png", "nose", 0.75, 0, 0, True),
]

with SessionLocal() as db:
    if not db.query(Category).count():
        db.add_all([Category(name=n, slug=s, display_order=o) for n, s, o in CATEGORIES])
    
    # Remove any stale demo records
    current_names = [row[0] for row in ITEMS]
    db.query(Jewellery).filter(~Jewellery.name.in_(current_names)).delete(synchronize_session=False)

    # Update existing items or insert new ones
    for row in ITEMS:
        existing = db.query(Jewellery).filter(Jewellery.name == row[0]).first()
        if existing:
            existing.category = row[1]
            existing.description = row[2]
            existing.price = Decimal(str(row[3]))
            existing.material = row[4]
            existing.purity = row[5]
            existing.weight = Decimal(str(row[6]))
            existing.image_url = row[7]
            existing.ar_asset_url = row[8]
            existing.anchor_type = row[9]
            existing.scale = row[10]
            existing.offset_x = row[11]
            existing.offset_y = row[12]
            existing.rotation_enabled = row[13]
        else:
            db.add(Jewellery(
                name=row[0], category=row[1], description=row[2],
                price=Decimal(str(row[3])), material=row[4], purity=row[5],
                weight=Decimal(str(row[6])), image_url=row[7], ar_asset_url=row[8],
                anchor_type=row[9], scale=row[10], offset_x=row[11], offset_y=row[12],
                rotation_enabled=row[13]
            ))
    db.commit()

print("Seed complete.")
