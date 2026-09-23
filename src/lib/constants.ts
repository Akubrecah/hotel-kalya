// =============================================================================
// Hotel Kalya — Brand Constants & Content Data
// Derived directly from the Hotel Kalya brochure / flyer
// =============================================================================

export const BRAND = {
  name: "HOTEL KALYA",
  tagline: "HOSPITALITY REDEFINED",
  location: "Kapenguria, West Pokot County, Kenya",
  phone: "+254 719 766649",
  phoneClean: "254719766649",
  email: "hotelkalya@gmail.com",
  operatingHours: {
    reception: "24/7",
    restaurant: "6:30 AM – 10:00 PM",
  },
  googleMapsUrl:
    "https://maps.google.com/?q=Kapenguria,+West+Pokot,+Kenya",
} as const;

// ---------------------------------------------------------------------------
// Unsplash stock images — will be replaced with real hotel photos later
// ---------------------------------------------------------------------------
export const IMAGES = {
  // Building & Exterior
  heroExterior:
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1920&q=80",
  buildingFacade:
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80",

  // Accommodation
  deluxeSuite:
    "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=900&q=80",
  executiveRoom:
    "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=900&q=80",
  airbnbStay:
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80",
  standardRoom:
    "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=900&q=80",

  // Dining & Restaurant
  restaurantHall:
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80",
  diningFood:
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=80",
  kenyanBuffet:
    "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80",

  // Conference & Meetings
  conferenceRoom:
    "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=900&q=80",
  boardroom:
    "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&w=900&q=80",

  // Outside Catering & Events
  cateringBuffet:
    "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=900&q=80",
  weddingSetup:
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80",

  // Garden Experience
  gardenLandscape:
    "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80",
  gardenTerrace:
    "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=80",
  gardenParty:
    "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=900&q=80",
} as const;

// ---------------------------------------------------------------------------
// Navigation links
// ---------------------------------------------------------------------------
export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Accommodation", href: "/accommodation" },
  { label: "Dining", href: "/dining" },
  { label: "Conference", href: "/conference" },
  { label: "Catering", href: "/catering" },
  { label: "Gardens", href: "/gardens" },
  { label: "Events", href: "/events" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
] as const;

// ---------------------------------------------------------------------------
// Service Categories (for booking form dropdown)
// ---------------------------------------------------------------------------
export const SERVICE_CATEGORIES = [
  "Accommodation (Rooms & Suites)",
  "Food Service / Table Reservation",
  "Conference / Seminar Space",
  "Outside Catering",
  "AirBnB / Short-Stay Apartment",
  "Garden Experience / Photoshoot",
  "Events & Private Celebrations",
  "General Inquiries",
] as const;

// ---------------------------------------------------------------------------
// Guest count options (for booking form dropdown)
// ---------------------------------------------------------------------------
export const GUEST_OPTIONS = [
  "1 Guest",
  "2 Guests",
  "3 - 5 Guests (Family)",
  "10 - 25 Delegates",
  "25 - 50 Delegates",
  "50 - 150+ Guests (Function)",
] as const;

// ---------------------------------------------------------------------------
// Services Data (matching the Hotel Kalya brochure)
// ---------------------------------------------------------------------------
export interface ServiceItem {
  id: string;
  title: string;
  tagline: string;
  desc: string;
  iconName: string;
  image: string;
  features: string[];
  cta: string;
  href: string;
}

export const SERVICES_LIST: ServiceItem[] = [
  {
    id: "accommodation",
    title: "Accommodation",
    tagline: "Serene & Comfortable Rest",
    desc: "Thoughtfully appointed executive suites, standard rooms, and family cottages designed for unmatched comfort in Kapenguria.",
    iconName: "bed",
    image: IMAGES.deluxeSuite,
    features: [
      "Complimentary Breakfast",
      "High-speed Wi-Fi",
      "En-suite Bathrooms",
      "24/7 Room Service",
    ],
    cta: "Explore Rooms",
    href: "/accommodation",
  },
  {
    id: "food-service",
    title: "Food Service & Dining",
    tagline: "Authentic Kenyan & Continental Cuisine",
    desc: "Delight in freshly prepared farm-fresh meals, hearty breakfast spreads, local West Pokot specialties, and a relaxed dining ambience.",
    iconName: "utensils",
    image: IMAGES.diningFood,
    features: [
      "A La Carte & Buffet",
      "Fresh Mountain Produce",
      "Family Dining Hall",
      "Express Takeaways",
    ],
    cta: "View Restaurant",
    href: "/dining",
  },
  {
    id: "conference",
    title: "Conference Facilities",
    tagline: "Professional Corporate Spaces",
    desc: "Fully equipped seminar halls, executive boardrooms with audiovisual systems, PA setups, and tailored delegate tea & meal packages.",
    iconName: "presentation",
    image: IMAGES.conferenceRoom,
    features: [
      "HD Projectors & PA Audio",
      "Flexible Seating Layouts",
      "Tea/Snack Catering",
      "High-speed Connectivity",
    ],
    cta: "Book Conference",
    href: "/conference",
  },
  {
    id: "outside-catering",
    title: "Outside Catering",
    tagline: "Flawless Event Catering",
    desc: "Bring Kalya's signature culinary standards to your outdoor venue, wedding, county summit, corporate luncheon, or private celebration.",
    iconName: "coffee",
    image: IMAGES.cateringBuffet,
    features: [
      "Custom Buffet Menus",
      "Professional Serving Crew",
      "Chafing & Table Setup",
      "Hygiene-first Service",
    ],
    cta: "Request Catering",
    href: "/catering",
  },
  {
    id: "airbnb",
    title: "AirBnB / Short-Stays",
    tagline: "Your Home Away from Home",
    desc: "Self-contained apartments and private living suites ideal for visiting professionals, NGO staff, tourists, and extended family stays.",
    iconName: "sparkles",
    image: IMAGES.airbnbStay,
    features: [
      "Kitchenette Facilities",
      "Private Balcony & Lounge",
      "Laundry Options",
      "Secure Parking",
    ],
    cta: "View AirBnB",
    href: "/accommodation#airbnb",
  },
  {
    id: "garden",
    title: "Garden Experience",
    tagline: "Lush Tropical Grounds & Vistas",
    desc: "Manicured green gardens perfect for tranquil afternoon walks, outdoor dining, wedding photoshoots, and rejuvenating weekend relaxation.",
    iconName: "trees",
    image: IMAGES.gardenLandscape,
    features: [
      "Manicured Lawns",
      "Photography Backdrops",
      "Outdoor Shaded Seating",
      "Children-friendly Spaces",
    ],
    cta: "Explore Gardens",
    href: "/gardens",
  },
  {
    id: "events",
    title: "Events & Functions",
    tagline: "Memorable Gatherings",
    desc: "Whether celebrating birthdays, graduations, family reunions, or official county receptions, our dedicated team makes every moment special.",
    iconName: "party-popper",
    image: IMAGES.weddingSetup,
    features: [
      "Themed Décor Services",
      "Sound & Lighting Layouts",
      "Dedicated Event Manager",
      "Ample Secure Parking",
    ],
    cta: "Plan an Event",
    href: "/events",
  },
];

// ---------------------------------------------------------------------------
// Accommodation / Room Types
// ---------------------------------------------------------------------------
export interface RoomType {
  id: string;
  name: string;
  type: string;
  capacity: string;
  bed: string;
  desc: string;
  image: string;
  amenities: string[];
  tag: string;
}

export const ACCOMMODATION_ROOMS: RoomType[] = [
  {
    id: "deluxe-exec",
    name: "Deluxe Executive Suite",
    type: "Master Suite",
    capacity: "2 Adults • 1 Child",
    bed: "King Bed",
    desc: "Spacious luxury room with scenic hill views of Kapenguria, premium bedding, work desk, and lavish en-suite shower.",
    image: IMAGES.deluxeSuite,
    amenities: [
      "Free High-speed Wi-Fi",
      "Smart Flat TV",
      "Complimentary Breakfast",
      "Working Desk",
      "Room Service",
    ],
    tag: "Most Popular",
  },
  {
    id: "standard-comfort",
    name: "Standard Executive Room",
    type: "Executive Single / Double",
    capacity: "2 Adults",
    bed: "Queen Bed",
    desc: "Cozy, quiet, and spotless accommodation for traveling business executives, government delegations, and tourists.",
    image: IMAGES.standardRoom,
    amenities: [
      "Free Wi-Fi",
      "Hot Shower",
      "Satellite TV",
      "Daily Housekeeping",
      "Balcony Access",
    ],
    tag: "Best Value",
  },
  {
    id: "kalya-airbnb",
    name: "Kalya AirBnB & Serviced Stay",
    type: "Short & Extended Stay Apartment",
    capacity: "Up to 4 Guests",
    bed: "2 Double Beds",
    desc: "Independent living with a cozy lounge area, kitchenette provisions, privacy, and full access to hotel amenities.",
    image: IMAGES.airbnbStay,
    amenities: [
      "Equipped Kitchenette",
      "Lounge & Dining",
      "Dedicated Parking",
      "Garden Access",
      "24/7 Security",
    ],
    tag: "Short-Stay Favorite",
  },
];

// ---------------------------------------------------------------------------
// Gallery Items
// ---------------------------------------------------------------------------
export interface GalleryItem {
  id: number;
  title: string;
  category: string;
  image: string;
}

export const GALLERY_ITEMS: GalleryItem[] = [
  { id: 1, title: "Modern Hotel Kalya Facade", category: "accommodation", image: IMAGES.buildingFacade },
  { id: 2, title: "Executive Room Interior", category: "accommodation", image: IMAGES.deluxeSuite },
  { id: 3, title: "Main Dining & Restaurant Hall", category: "dining", image: IMAGES.restaurantHall },
  { id: 4, title: "Freshly Prepared Culinary Spread", category: "dining", image: IMAGES.diningFood },
  { id: 5, title: "Conference & Seminar Arrangement", category: "conference", image: IMAGES.conferenceRoom },
  { id: 6, title: "Executive Boardroom Session", category: "conference", image: IMAGES.boardroom },
  { id: 7, title: "Kalya Lush Landscaped Gardens", category: "gardens", image: IMAGES.gardenLandscape },
  { id: 8, title: "Outdoor Garden Terrace", category: "gardens", image: IMAGES.gardenTerrace },
  { id: 9, title: "Outside Catering Buffet Setup", category: "catering", image: IMAGES.cateringBuffet },
  { id: 10, title: "Celebration & Banquet Function", category: "events", image: IMAGES.weddingSetup },
];

export const GALLERY_FILTERS = [
  { label: "All Photos", value: "all" },
  { label: "Accommodation", value: "accommodation" },
  { label: "Dining & Cuisine", value: "dining" },
  { label: "Conferences", value: "conference" },
  { label: "Gardens", value: "gardens" },
  { label: "Catering & Events", value: "catering" },
  { label: "Events", value: "events" },
] as const;
