export const DEMO_CATEGORIES = [
  { id: 1, name: "Earrings", slug: "earrings" },
  { id: 2, name: "Necklaces", slug: "necklaces" },
  { id: 3, name: "Nose Rings", slug: "nose-rings" },
];

const make = (id, name, category, description, asset, price, material, purity, weight, anchor, scale, offsetY) => {
  const isEarring = category === "earrings";
  const isNecklace = category === "necklaces";
  const assetPath = isEarring
    ? `/assets/jewellery/earrings/${asset}`
    : isNecklace
      ? `/assets/jewellery/necklaces/${asset}`
      : `/assets/jewellery/nose-rings/${asset}`;

  return {
    id,
    name,
    category,
    description,
    price,
    material,
    purity,
    weight,
    image_url: assetPath,
    ar_asset_url: assetPath,
    anchor_type: anchor,
    scale,
    offset_x: 0,
    offset_y: offsetY,
    rotation_enabled: true,
  };
};

export const DEMO_JEWELLERY = [
  make(1, "Ruby Floral Jhumka",       "earrings",   "Floral jhumka featuring ruby stones with intricate detailing.",                            "earring-1.png",  58000,  "Ruby",    "22K", 8.2,  "ear",  1.0,  5),
  make(2, "Diamond Halo Earring",     "earrings",   "Halo-style earring featuring a central diamond surrounded by smaller stones.",             "earring2.png",   85000,  "Diamond", "18K", 9.1,  "ear",  1.05, 6),
  make(3, "Pearl Drop Earring",       "earrings",   "Elegant earring featuring a pearl drop with a refined oval design.",                       "earring3.png",   42000,  "Pearl",   "18K", 4.8,  "ear",  0.9,  3),
  make(4, "Star Chain Earring",       "earrings",   "Star-shaped earring with a delicate hanging chain design.",                                "earring4.png",   36000,  "Gold",    "22K", 7.4,  "ear",  0.95, 5),
  make(5, "Diamond Temple Necklace",  "necklaces",  "Traditional temple necklace featuring diamond stones and intricate detailing.",            "necklace1.png",  185000, "Diamond", "22K", 24.5, "neck", 0.95, 0),
  make(6, "Heart Pendant Necklace",   "necklaces",  "Elegant necklace featuring a heart-shaped pendant on a delicate chain.",                   "necklace2.png",  95000,  "Gold",    "18K", 29.0, "neck", 1.42, 18),
  make(7, "Pearl Necklace",           "necklaces",  "Classic necklace featuring a strand of elegant white pearls.",                             "necklace4.png",  125000, "Pearl",   "22K", 15.5, "neck", 1.28, 12),
  make(8, "Traditional Nose Ring",    "nose-rings", "Traditional nose ring featuring an intricate circular design.",                            "nosering1.png",  18000,  "Gold",    "22K", 1.2,  "nose", 0.7,  0),
  make(9, "Ruby Beaded Nose Ring",    "nose-rings", "Traditional nose ring decorated with ruby beads and detailed craftsmanship.",              "nosering2.png",  26000,  "Ruby",    "22K", 1.4,  "nose", 0.75, 0),
];

