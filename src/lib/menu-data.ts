import { MenuItem, MenuCategory } from "@/types";

export const MENU_CATEGORIES: { id: MenuCategory; label: string; description: string }[] = [
  {
    id: "breakfast",
    label: "Breakfast",
    description: "Wholesome morning favorites, free-range eggs, farm-fresh roots & hot beverages.",
  },
  {
    id: "lunch",
    label: "Lunch",
    description: "Hearty stews, freshly prepared Kenyan favorites, grilled meats & accompaniments.",
  },
  {
    id: "dinner",
    label: "Dinner",
    description: "Chef's evening gourmet specialties, barbecue nyama choma & fresh lake fish.",
  },
  {
    id: "drinks",
    label: "Drinks & Refreshments",
    description: "Freshly squeezed tropical juices, spiced Kalya tea, barista coffees & soft drinks.",
  },
  {
    id: "specials",
    label: "Chef's Specials",
    description: "Signature culinary highlights, shared banqueting platters & seasonal local dishes.",
  },
];

export const MENU_ITEMS: MenuItem[] = [
  // BREAKFAST
  {
    id: "item_br_01",
    name: "Full Kalya Farm Breakfast",
    description:
      "Two eggs cooked to order, choice of beef or chicken sausage, baked beans, grilled tomato, toast, and home fries served with freshly brewed tea or coffee.",
    price: 650,
    category: "breakfast",
    categoryLabel: "Breakfast",
    image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=800&q=80",
    dietary: ["Farm to Table"],
    prepTime: "15 mins",
    available: true,
    featured: true,
  },
  {
    id: "item_br_02",
    name: "Traditional African Breakfast Platter",
    description:
      "Steamed indigenous arrowroots (nduma), organic sweet potatoes, boiled maize cob, and spicy fried eggs paired with traditional spiced milk tea.",
    price: 550,
    category: "breakfast",
    categoryLabel: "Breakfast",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80",
    dietary: ["Farm to Table", "Halal"],
    prepTime: "12 mins",
    available: true,
    featured: true,
  },
  {
    id: "item_br_03",
    name: "Golden Fluffy Pancakes with Honey & Berries",
    description:
      "Three buttermilk pancakes served warm with natural highland honey, dairy butter, and fresh seasonal fruit slices.",
    price: 450,
    category: "breakfast",
    categoryLabel: "Breakfast",
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=80",
    dietary: ["Vegetarian"],
    prepTime: "15 mins",
    available: true,
  },
  {
    id: "item_br_04",
    name: "Highland Fresh Fruit Salad & Yoghurt",
    description:
      "Diced sweet papaya, pineapple, watermelon, and bananas topped with plain or vanilla yoghurt and toasted chia seeds.",
    price: 350,
    category: "breakfast",
    categoryLabel: "Breakfast",
    image: "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&w=800&q=80",
    dietary: ["Vegetarian", "Gluten-Free"],
    prepTime: "8 mins",
    available: true,
  },

  // LUNCH
  {
    id: "item_lu_01",
    name: "Kapenguria Kienyeji Chicken Stew",
    description:
      "Locally reared free-range chicken simmered slowly in rich onion, tomato, coriander and garlic gravy. Served with traditional Ugali and sautéed Managu.",
    price: 1400,
    category: "lunch",
    categoryLabel: "Lunch",
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80",
    dietary: ["Halal", "Farm to Table", "Chef Special"],
    prepTime: "30 mins",
    available: true,
    featured: true,
  },
  {
    id: "item_lu_02",
    name: "Slow-Braised Beef Stew with Aromatic Pilau",
    description:
      "Tender prime beef cubes cooked in aromatic Swahili pilau spices. Accompanied by fresh tomato kachumbari and a side of steamed spinach.",
    price: 950,
    category: "lunch",
    categoryLabel: "Lunch",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
    dietary: ["Halal"],
    prepTime: "20 mins",
    available: true,
  },
  {
    id: "item_lu_03",
    name: "Deep-Fried Fresh Whole Tilapia",
    description:
      "Whole freshwater Lake Victoria tilapia crisped to golden perfection, finished in dry fry or thick coconut curry sauce with Ugali and greens.",
    price: 1300,
    category: "lunch",
    categoryLabel: "Lunch",
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80",
    dietary: ["Halal", "Chef Special"],
    prepTime: "25 mins",
    available: true,
  },
  {
    id: "item_lu_04",
    name: "Cherangani Vegetable Coconut Curry",
    description:
      "Medley of fresh local vegetables, green peas, and butternut simmered in fragrant coconut milk and turmeric sauce. Served with steamed basmati rice.",
    price: 750,
    category: "lunch",
    categoryLabel: "Lunch",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80",
    dietary: ["Vegetarian", "Gluten-Free"],
    prepTime: "15 mins",
    available: true,
  },

  // DINNER
  {
    id: "item_di_01",
    name: "Charcoal-Roasted Goat Nyama Choma (1/2 kg)",
    description:
      "Tender goat ribs roasted over open charcoal embers with sea salt marinade. Served hot with crunchy kachumbari, pili-pili dip, and hot white ugali.",
    price: 1200,
    category: "dinner",
    categoryLabel: "Dinner",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
    dietary: ["Halal", "Chef Special"],
    prepTime: "35 mins",
    available: true,
    featured: true,
  },
  {
    id: "item_di_02",
    name: "Grilled Pepper Steak with Garlic Mashed Potatoes",
    description:
      "Aged beef tenderloin steak grilled to your preferred temperature, glazed in creamy black peppercorn reduction with buttered seasonal greens.",
    price: 1350,
    category: "dinner",
    categoryLabel: "Dinner",
    image: "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80",
    dietary: ["Halal"],
    prepTime: "25 mins",
    available: true,
  },
  {
    id: "item_di_03",
    name: "Herb-Marinated Pan-Seared Fish Fillet",
    description:
      "Fresh white fish fillet seared in virgin olive oil, garlic, lemon and dill, served with hand-cut potato wedges and garden salad.",
    price: 1100,
    category: "dinner",
    categoryLabel: "Dinner",
    image: "https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&w=800&q=80",
    dietary: ["Halal", "Gluten-Free"],
    prepTime: "20 mins",
    available: true,
  },

  // DRINKS
  {
    id: "item_dr_01",
    name: "Traditional Kalya Spiced Masala Chai",
    description:
      "Pot of fresh cow milk tea simmered with fresh mountain ginger, crushed cardamom, cloves, and premium Kenyan tea leaves.",
    price: 250,
    category: "drinks",
    categoryLabel: "Drinks & Refreshments",
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80",
    dietary: ["Vegetarian"],
    prepTime: "6 mins",
    available: true,
    featured: true,
  },
  {
    id: "item_dr_02",
    name: "Fresh Highland Passion & Mango Juice",
    description:
      "Cold-pressed juice blend made with tree-ripened passion fruit and sweet mangoes. 100% natural with no artificial preservatives.",
    price: 350,
    category: "drinks",
    categoryLabel: "Drinks & Refreshments",
    image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=800&q=80",
    dietary: ["Vegetarian", "Gluten-Free"],
    prepTime: "5 mins",
    available: true,
  },
  {
    id: "item_dr_03",
    name: "Kenyan AA French Press Coffee",
    description:
      "Freshly ground medium-dark roast arabica beans from local highland cooperatives. Rich aroma, chocolate notes, and clean finish.",
    price: 300,
    category: "drinks",
    categoryLabel: "Drinks & Refreshments",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
    dietary: ["Vegetarian", "Gluten-Free"],
    prepTime: "6 mins",
    available: true,
  },

  // SPECIALS
  {
    id: "item_sp_01",
    name: "Kalya Executive Mixed Grill Platter",
    description:
      "Abundant feast combining prime roasted goat cuts, marinated chicken skewers, beef sausages, roasted maize, kachumbari, and seasoned potato wedges. (Ideal for 2 to 3 guests).",
    price: 3200,
    category: "specials",
    categoryLabel: "Chef's Specials",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
    dietary: ["Chef Special", "Halal"],
    prepTime: "40 mins",
    available: true,
    featured: true,
  },
  {
    id: "item_sp_02",
    name: "Chef's Whole Free-Range Kienyeji Feast",
    description:
      "Complete whole indigenous chicken roasted and fried with herbs, accompanied by multiple ugali platters, sukuma wiki, traditional managu, and house bone broth.",
    price: 2800,
    category: "specials",
    categoryLabel: "Chef's Specials",
    image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80",
    dietary: ["Chef Special", "Farm to Table", "Halal"],
    prepTime: "45 mins",
    available: true,
    featured: true,
  },
];
