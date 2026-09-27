import fs from "fs/promises";
import path from "path";
import {
  MenuCategoryEntity,
  MenuItemEntity,
  GardenExperience,
  ConferenceHall,
  EventSpace,
  CateringPackage,
  AirbnbApartment,
  HospitalityOffer,
  GalleryItem,
  Announcement,
  CustomerReview,
  HotelSettings,
  PublishStatus,
} from "@/types/hospitality";
import { logAuditEvent, getAuditLogs, getRooms, getRoomById, createRoom, updateRoom, deleteRoom } from "./db";
export { getRooms, getRoomById, createRoom, updateRoom, deleteRoom, getAuditLogs, logAuditEvent };
import { UserProfile } from "@/types";
import { IMAGES, BRAND } from "./constants";
import { MENU_CATEGORIES, MENU_ITEMS } from "./menu-data";

const DATA_DIR = path.resolve(process.cwd(), ".data");

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch {
    // Already exists
  }
}

async function writeJsonFile<T>(filename: string, data: T): Promise<void> {
  await ensureDataDir();
  const targetPath = path.join(DATA_DIR, filename);
  const tempPath = path.join(
    DATA_DIR,
    `${filename}.tmp.${Date.now()}.${Math.random().toString(36).substring(2, 9)}`
  );
  try {
    await fs.writeFile(tempPath, JSON.stringify(data, null, 2), "utf-8");
    await fs.rename(tempPath, targetPath);
  } catch {
    try {
      await fs.writeFile(targetPath, JSON.stringify(data, null, 2), "utf-8");
      await fs.unlink(tempPath).catch(() => {});
    } catch {
      // ignore
    }
  }
}

async function readJsonFile<T>(filename: string, fallback: T): Promise<T> {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    writeJsonFile(filename, fallback).catch(() => {});
    return fallback;
  }
}

// =============================================================================
// SEED GENERATORS
// =============================================================================

function generateSeedMenuCategories(): MenuCategoryEntity[] {
  return MENU_CATEGORIES.map((cat, idx) => ({
    id: cat.id,
    slug: cat.id,
    label: cat.label,
    description: cat.description,
    order: idx + 1,
    isActive: true,
  }));
}

function generateSeedMenuItems(): MenuItemEntity[] {
  return MENU_ITEMS.map((item, idx) => ({
    id: item.id,
    name: item.name,
    description: item.description,
    price: item.price,
    discountPrice: item.featured ? Math.round(item.price * 0.9) : undefined,
    category: item.category,
    categoryLabel: item.categoryLabel,
    image: item.image,
    images: [item.image],
    ingredients: item.dietary ? ["Fresh Farm Produce", "Locally Sourced Ingredients"] : undefined,
    allergens: ["None / Standard Preparation"],
    portionSize: "Generous Single Serving",
    dietary: item.dietary,
    prepTime: item.prepTime || "15 mins",
    available: item.available,
    featured: item.featured,
    isSpicy: item.dietary?.includes("Spicy"),
    publishStatus: "published",
    order: idx + 1,
    createdAt: new Date("2026-08-01").toISOString(),
  }));
}

function generateSeedGardens(): GardenExperience[] {
  return [
    {
      id: "garden-wedding-lawn",
      name: "Kalya Grand Wedding Lawn & Terraces",
      slug: "wedding-lawn",
      description: "Expansive manicured kikuyu grass lawns set against panoramic backdrop views of Kapenguria hills. Ideal for high-profile weddings, VIP receptions, and grand banquets.",
      capacity: { minGuests: 150, maxGuests: 1500 },
      pricing: { perDay: 50000, halfDay: 30000, photographySession: 15000 },
      images: [IMAGES.gardenLandscape, IMAGES.gardenTerrace, IMAGES.weddingSetup],
      featuredImage: IMAGES.gardenLandscape,
      facilities: ["Dedicated Bridal Dressing Suite", "Power Hookups for PA & Lighting", "Clean Restroom Blocks", "Direct Vehicle Access for Decorators"],
      eventSuitability: ["Weddings", "Banquets", "County Summits", "Product Launches", "Photo & Video Shoots"],
      features: ["Lush Manicured Lawns", "Perimeter Security & Lighting", "Highland Mountain Air", "Ample Parking for 200+ Cars"],
      openingHours: "6:00 AM – 7:00 PM Daily",
      bookingRequirements: "50% deposit upon reservation, 5-day advance booking for event setup.",
      location: "West Wing Lawn, Hotel Kalya Compound",
      publishStatus: "published",
      createdAt: new Date("2026-08-01").toISOString(),
    },
    {
      id: "garden-hillside-terrace",
      name: "Upper Hillside View Terrace & Gazebos",
      slug: "hillside-terrace",
      description: "Elevated outdoor stone terrace with private thatched gazebos, gentle mountain breezes, and sunset viewpoints for intimate gatherings and private dining.",
      capacity: { minGuests: 20, maxGuests: 150 },
      pricing: { perDay: 25000, halfDay: 15000, photographySession: 10000 },
      images: [IMAGES.gardenTerrace, IMAGES.gardenParty, IMAGES.heroExterior],
      featuredImage: IMAGES.gardenTerrace,
      facilities: ["Private Thatched Gazebos", "Barbecue Grill Station Access", "Dedicated Waitstaff Counter"],
      eventSuitability: ["Cocktail Parties", "Birthday Celebrations", "Sundowners", "Private Corporate Dinners"],
      features: ["Sunset Viewpoint", "Ambient Evening Lighting", "Windbreak Landscaping"],
      openingHours: "8:00 AM – 10:00 PM",
      bookingRequirements: "Full payment required 48 hours prior to function.",
      location: "Upper Level Terrace, Main Hotel",
      publishStatus: "published",
      createdAt: new Date("2026-08-05").toISOString(),
    },
    {
      id: "garden-family-park",
      name: "Family Picnic Park & Children's Playgrounds",
      slug: "family-park",
      description: "Secure, enclosed garden park designed for families, school groups, and community fun days, with shaded picnic trees and green playground spaces.",
      capacity: { minGuests: 10, maxGuests: 200 },
      pricing: { perDay: 18000, halfDay: 10000 },
      images: [IMAGES.gardenParty, IMAGES.gardenLandscape, IMAGES.buildingFacade],
      featuredImage: IMAGES.gardenParty,
      facilities: ["Children Swings & Slides", "Shaded Benches", "Kiosk for Soft Drinks & Snacks"],
      eventSuitability: ["Family Fun Days", "Church Gatherings", "School Picnics", "Birthday Parties"],
      features: ["Fenced & Child Safe", "Soft Turf Grass", "Baby Changing Station Nearby"],
      openingHours: "8:00 AM – 6:30 PM",
      bookingRequirements: "Reservation at front desk 24 hours in advance.",
      location: "East Garden Zone",
      publishStatus: "published",
      createdAt: new Date("2026-08-10").toISOString(),
    },
  ];
}

function generateSeedConferenceHalls(): ConferenceHall[] {
  return [
    {
      id: "hall-mount-elgon",
      name: "Mount Elgon Grand Ballroom & Conference Centre",
      slug: "mount-elgon-ballroom",
      description: "State-of-the-art pillarless conference hall featuring high ceilings, acoustic treatment, dual HD projection, and integrated climate control for international delegates.",
      capacity: { minGuests: 80, maxGuests: 350 },
      dimensions: "24m x 15m (360 m²)",
      pricing: { fullDay: 45000, halfDay: 28000, hourly: 6000, perDelegatePackage: 2800 },
      images: [IMAGES.conferenceRoom, IMAGES.boardroom, IMAGES.buildingFacade],
      featuredImage: IMAGES.conferenceRoom,
      equipment: [
        "Dual 4K Laser Projectors & Motorized Screens",
        "Wireless UHF Shure Lapel & Handheld Microphones",
        "JBL Line Array PA & Acoustic Audio System",
        "Dedicated Fiber Optic Wi-Fi (100 Mbps)",
        "Podium with Integrated HDMI/USB-C Ports",
        "Individual Climate Control / AC",
      ],
      seatingConfigurations: [
        { layout: "Theatre", capacity: 350, image: IMAGES.conferenceRoom },
        { layout: "Classroom", capacity: 200, image: IMAGES.conferenceRoom },
        { layout: "Banquet", capacity: 180, image: IMAGES.conferenceRoom },
        { layout: "U-Shape", capacity: 80, image: IMAGES.conferenceRoom },
      ],
      cateringAvailable: true,
      parkingAvailable: true,
      publishStatus: "published",
      createdAt: new Date("2026-08-01").toISOString(),
    },
    {
      id: "hall-cherangany",
      name: "Cherang'any Executive Conference Suite",
      slug: "cherangany-suite",
      description: "Mid-sized contemporary seminar room suited for workshops, government ministry retreats, training programs, and regional NGO meetings.",
      capacity: { minGuests: 25, maxGuests: 80 },
      dimensions: "14m x 9m (126 m²)",
      pricing: { fullDay: 25000, halfDay: 16000, hourly: 3500, perDelegatePackage: 2400 },
      images: [IMAGES.boardroom, IMAGES.conferenceRoom, IMAGES.executiveRoom],
      featuredImage: IMAGES.boardroom,
      equipment: [
        "HD Smart Interactive Touchscreen Display",
        "Conference Speakerphone System",
        "Flipcharts & Whiteboard Stands",
        "High-Speed Wi-Fi",
        "Air Conditioning & Natural Light",
      ],
      seatingConfigurations: [
        { layout: "Classroom", capacity: 60, image: IMAGES.boardroom },
        { layout: "U-Shape", capacity: 35, image: IMAGES.boardroom },
        { layout: "Theatre", capacity: 80, image: IMAGES.boardroom },
        { layout: "Cabaret", capacity: 45, image: IMAGES.boardroom },
      ],
      cateringAvailable: true,
      parkingAvailable: true,
      publishStatus: "published",
      createdAt: new Date("2026-08-05").toISOString(),
    },
    {
      id: "hall-boardroom",
      name: "Kapenguria Executive VIP Boardroom",
      slug: "kapenguria-boardroom",
      description: "Prestigious boardroom designed for corporate boards of directors, legal arbitrations, confidential negotiations, and high-level strategy sessions.",
      capacity: { minGuests: 8, maxGuests: 25 },
      dimensions: "9m x 6m (54 m²)",
      pricing: { fullDay: 15000, halfDay: 10000, hourly: 2500, perDelegatePackage: 2750 },
      images: [IMAGES.boardroom, IMAGES.deluxeSuite, IMAGES.heroExterior],
      featuredImage: IMAGES.boardroom,
      equipment: [
        "65\" 4K UHD Video Conferencing Display (Zoom / Teams)",
        "Logitech Group Conferencecam with 10x Zoom",
        "Executive Leather Ergonomic Chairs",
        "Mahogany Conference Table with Inset Power Outlets",
        "Tea / Nespresso Coffee Station",
      ],
      seatingConfigurations: [
        { layout: "Boardroom", capacity: 20, image: IMAGES.boardroom },
        { layout: "U-Shape", capacity: 16, image: IMAGES.boardroom },
      ],
      cateringAvailable: true,
      parkingAvailable: true,
      publishStatus: "published",
      createdAt: new Date("2026-08-08").toISOString(),
    },
  ];
}

function generateSeedEventSpaces(): EventSpace[] {
  return [
    {
      id: "event-grand-pavilion",
      name: "The Grand Pavilion & Banqueting Hall",
      slug: "grand-pavilion",
      description: "Covered, high-capacity pavilion with chandeliers, draped ceiling options, and stage platform for awards ceremonies, galas, and graduation dinners.",
      capacity: { minGuests: 100, maxGuests: 500 },
      pricing: { baseHire: 60000, perGuestPackage: 2200 },
      images: [IMAGES.weddingSetup, IMAGES.restaurantHall, IMAGES.kenyanBuffet],
      featuredImage: IMAGES.weddingSetup,
      amenities: ["Raised Stage Platform", "Specialized Ambient Mood Lighting", "Dedicated Buffet Service Alley", "Bridal Table Setup"],
      eventTypes: ["Gala Dinners", "Corporate Dinners", "Weddings", "Graduation Parties", "Fundraisers"],
      cateringOptions: ["3-Course Plated Service", "Grand Buffet", "Cocktail Canapés"],
      decorationOptions: ["Draping", "Floral Arches", "Chiavari Chairs", "Red Carpet Entrance"],
      publishStatus: "published",
      createdAt: new Date("2026-08-01").toISOString(),
    },
    {
      id: "event-botanical-amphitheatre",
      name: "Kalya Botanical Amphitheatre",
      slug: "botanical-amphitheatre",
      description: "Tiered natural grass amphitheatre surrounded by native acacia trees. Stunning setting for cultural performances, evening acoustic music, and wedding vows.",
      capacity: { minGuests: 50, maxGuests: 600 },
      pricing: { baseHire: 45000, perGuestPackage: 1800 },
      images: [IMAGES.gardenLandscape, IMAGES.gardenTerrace, IMAGES.weddingSetup],
      featuredImage: IMAGES.gardenLandscape,
      amenities: ["Acoustic Backdrop Wall", "Terraced Lawn Seating", "Underground Cable Ducts for Live Sound"],
      eventTypes: ["Wedding Ceremonies", "Cultural Festivals", "Acoustic Concerts", "Church Rallies"],
      cateringOptions: ["Outdoor Live Cooking Stations", "Nyama Choma BBQ Line"],
      decorationOptions: ["Fairy Lights", "Rustic Wooden Arches", "Lantern Pathways"],
      publishStatus: "published",
      createdAt: new Date("2026-08-10").toISOString(),
    },
  ];
}

function generateSeedCateringPackages(): CateringPackage[] {
  return [
    {
      id: "cat-pkg-summit",
      title: "Executive Summit Full-Course Buffet",
      slug: "executive-summit-buffet",
      description: "Our signature catering spread for official functions, NGO symposiums, and ministerial delegations across West Pokot and Trans-Nzoia Counties.",
      pricePerPerson: 1800,
      minGuests: 50,
      maxGuests: 800,
      includedServices: [
        "Professional uniformed buffet service crew",
        "Insulated chaffing dishes & food warmers",
        "Stainless steel cutlery, chinaware & glassware",
        "Buffet table linen & decor skirts",
        "Clean-up & waste handling post function",
      ],
      menuSelections: [
        "Starters: Creamy Butternut Squash Soup & Fresh Dinner Rolls",
        "Main Proteins: Herb Roast Beef Medallions & Oven-Baked Kienyeji Chicken",
        "Carbs: Fragrant Pilau Rice & Steamed Mukimo / Chapati",
        "Greens: Sautéed Seasonal Pokot Greens & Tossed Garden Salad with House Vinaigrette",
        "Dessert: Fresh Tropical Fruit Salad & Vanilla Bean Custard",
        "Drinks: Spiced Kalya Masala Chai & Fresh Mint Infusion",
      ],
      equipment: ["Stainless Chaffing Dishes", "Melamine Platters", "Coffee Urns", "Handwash Stations"],
      staffServices: ["1 Head Chef", "1 Banquet Captain", "1 Waiter per 30 guests"],
      deliveryTerms: "Complimentary delivery within 25km of Kapenguria. Fuel surcharge applies beyond.",
      eventTypes: ["County Summits", "Corporate AGMs", "Conferences", "VIP Dinners"],
      images: [IMAGES.cateringBuffet, IMAGES.kenyanBuffet, IMAGES.diningFood],
      featuredImage: IMAGES.cateringBuffet,
      publishStatus: "published",
      createdAt: new Date("2026-08-01").toISOString(),
    },
    {
      id: "cat-pkg-royal-wedding",
      title: "Royal Banquet & Live BBQ Nyama Choma Spread",
      slug: "royal-banquet-bbq",
      description: "Grand outdoor feast featuring live-on-site open flame barbecue, whole roast goat, traditional delicacies, and decadent dessert spreads for memorable wedding banquets.",
      pricePerPerson: 2500,
      minGuests: 100,
      maxGuests: 2000,
      includedServices: [
        "Live on-site charcoal barbecue grill masters",
        "VIP bridal service & reserved presidential table service",
        "Heavy-duty buffet marquees & buffet tables",
        "Full crockery, cutlery & linen napkins",
      ],
      menuSelections: [
        "Live Carvery: Highland Goat Nyama Choma & Honey Glazed Pork Ribs",
        "Traditional: Kienyeji Wet Fry Chicken & Tilapia Fillet with Lemon Butter",
        "Carbs: Traditional Ugali (Brown & White), Vegetable Biryani, Soft Layered Chapati",
        "Salads: Kachumbari with Avocado & Coriander, Coleslaw with Raisins",
        "Dessert: Black Forest Gateau, Strawberry Mousse, Fresh Cut Watermelon & Pineapple",
      ],
      equipment: ["Commercial Charcoal Grills", "Carvery Stations", "Ice Boxes for Beverages"],
      staffServices: ["Lead Grill Chef", "Executive Sous Chef", "Dedicated VIP Waiters"],
      deliveryTerms: "Transport van and mobile kitchen setup dispatched 3 hours prior to feast.",
      eventTypes: ["Weddings", "Traditional Ruracio / Koito", "State Banquets", "Anniversaries"],
      images: [IMAGES.diningFood, IMAGES.cateringBuffet, IMAGES.weddingSetup],
      featuredImage: IMAGES.diningFood,
      publishStatus: "published",
      createdAt: new Date("2026-08-05").toISOString(),
    },
    {
      id: "cat-pkg-tea-break",
      title: "Highland High Tea & Morning Conference Bites",
      slug: "highland-high-tea",
      description: "Energizing mid-morning or afternoon refreshment package with freshly baked pastries, organic sweet roots, and signature spiced Kalya mountain tea.",
      pricePerPerson: 750,
      minGuests: 25,
      maxGuests: 500,
      includedServices: [
        "Self-service beverage station with thermal pump pots",
        "Porcelain teacups, saucers, and teaspoons",
        "Napkins and serving tongs",
      ],
      menuSelections: [
        "Fresh Bakes: Golden Fried Beef Samosas, Spiced Mandazi, Vegetable Spring Rolls",
        "Healthy Roots: Steamed Sweet Potatoes & Arrowroots (Nduma)",
        "Beverages: Fresh Cow Milk Tea, Spiced Masala Chai, Barista Brewed Coffee, Fresh Passion Juice",
      ],
      equipment: ["Thermal Beverage Pumps", "Pastry Baskets", "Sugar & Sweetener Trays"],
      staffServices: ["Beverage Attendant"],
      deliveryTerms: "Delivered hot in thermal insulated carriers 30 minutes prior to session.",
      eventTypes: ["Board Meetings", "Morning Workshops", "Press Briefings"],
      images: [IMAGES.kenyanBuffet, IMAGES.diningFood, IMAGES.cateringBuffet],
      featuredImage: IMAGES.kenyanBuffet,
      publishStatus: "published",
      createdAt: new Date("2026-08-10").toISOString(),
    },
  ];
}

function generateSeedAirbnb(): AirbnbApartment[] {
  return [
    {
      id: "airbnb-unit-a1",
      name: "Highland Vista Serviced 2-Bedroom Apartment (Unit A1)",
      slug: "highland-vista-a1",
      propertyType: "Serviced 2-Bedroom Apartment",
      description: "Modern self-contained apartment featuring floor-to-ceiling windows with panoramic views of Kapenguria. Includes fully equipped granite kitchen, cozy living room, and washer/dryer.",
      bedrooms: 2,
      bathrooms: 2,
      capacity: 4,
      pricePerNight: 9500,
      amenities: [
        "Equipped Kitchen with Gas Cooker, Microwave & Fridge",
        "High-Speed Fiber Wi-Fi",
        "55\" Smart 4K TV with Netflix & DStv",
        "En-suite Master with Rainfall Shower",
        "Washer & Ironing Facilities",
        "Dedicated Covered Parking Slot",
        "24/7 Gated Security & CCTV",
      ],
      houseRules: [
        "No smoking inside the apartment",
        "Quiet hours from 10:00 PM to 6:00 AM",
        "Pets strictly on prior approval",
        "Maximum 4 overnight guests",
      ],
      checkInTime: "2:00 PM",
      checkOutTime: "11:00 AM",
      images: [IMAGES.airbnbStay, IMAGES.deluxeSuite, IMAGES.standardRoom],
      featuredImage: IMAGES.airbnbStay,
      location: "Hotel Kalya Residences, Block A, 1st Floor",
      bookingStatus: "AVAILABLE",
      publishStatus: "published",
      createdAt: new Date("2026-08-01").toISOString(),
    },
    {
      id: "airbnb-unit-b2",
      name: "Cherang'any Executive 1-Bedroom Loft (Unit B2)",
      slug: "cherangany-loft-b2",
      propertyType: "1-Bedroom Executive Loft",
      description: "Stylish loft ideal for business consultants, medical professionals, and couples visiting West Pokot. Features plush orthopedic queen bed, high-speed workstation, and sunny balcony.",
      bedrooms: 1,
      bathrooms: 1,
      capacity: 2,
      pricePerNight: 6500,
      amenities: [
        "Kitchenette with Induction Hob & Fridge",
        "High-Speed Fiber Wi-Fi",
        "Dedicated Work Desk & Ergonomic Chair",
        "Private Mountain View Balcony",
        "Daily Housekeeping on Request",
      ],
      houseRules: ["No parties or loud events", "No smoking", "Check-out on time for cleaning"],
      checkInTime: "2:00 PM",
      checkOutTime: "11:00 AM",
      images: [IMAGES.executiveRoom, IMAGES.airbnbStay, IMAGES.heroExterior],
      featuredImage: IMAGES.executiveRoom,
      location: "Hotel Kalya Residences, Block B, 2nd Floor",
      bookingStatus: "AVAILABLE",
      publishStatus: "published",
      createdAt: new Date("2026-08-05").toISOString(),
    },
    {
      id: "airbnb-unit-c3",
      name: "Kalya Family Garden Cottage Annex (Unit C3)",
      slug: "family-garden-cottage-c3",
      propertyType: "Family Garden Cottage",
      description: "Detached 3-bedroom family residence situated in a private garden compound. Features large open-plan living and dining areas, kid-friendly bedrooms, and outdoor terrace seating.",
      bedrooms: 3,
      bathrooms: 2,
      capacity: 6,
      pricePerNight: 12000,
      amenities: [
        "Full Family Kitchen with Oven & Dishware",
        "Private Fenced Garden Lawn",
        "Master En-suite with Bathtub & Shower",
        "Baby Cot Available on Request",
        "Complimentary Hotel Breakfast for 4",
      ],
      houseRules: ["Family-friendly", "No loud outdoor music past 9:00 PM"],
      checkInTime: "2:00 PM",
      checkOutTime: "10:30 AM",
      images: [IMAGES.heroExterior, IMAGES.gardenLandscape, IMAGES.airbnbStay],
      featuredImage: IMAGES.heroExterior,
      location: "Garden Annex, North Gate",
      bookingStatus: "AVAILABLE",
      publishStatus: "published",
      createdAt: new Date("2026-08-10").toISOString(),
    },
  ];
}

function generateSeedOffers(): HospitalityOffer[] {
  return [
    {
      id: "offer-weekend-romantic",
      title: "Kapenguria Highland Romantic Escape",
      subtitle: "2 Nights Deluxe Suite Stay + 3-Course Candlelight Dinner + Bottle of Sparkling Juice",
      category: "accommodation",
      originalPrice: 24000,
      offerPrice: 18500,
      discountPercentage: 23,
      validUntil: "2026-11-30",
      inclusions: [
        "2 Nights accommodation in Deluxe Executive Suite",
        "Daily full farmhouse breakfast in bed",
        "Private 3-course candlelight dinner at Garden Terrace",
        "Late checkout at 2:00 PM (subject to availability)",
      ],
      image: IMAGES.deluxeSuite,
      publishStatus: "published",
      featured: true,
      createdAt: new Date("2026-08-01").toISOString(),
    },
    {
      id: "offer-corporate-delegate",
      title: "Full-Day Corporate Delegate Conference Package",
      subtitle: "Full hall hire, 2 tea breaks with hot snacks, 3-course lunch buffet, and high-speed Wi-Fi.",
      category: "conference",
      originalPrice: 3200,
      offerPrice: 2650,
      discountPercentage: 17,
      validUntil: "2026-12-15",
      inclusions: [
        "Hall hire with HD projector & sound system",
        "Morning tea with traditional bites and pastries",
        "Full 3-course buffet lunch with soft drink",
        "Afternoon spiced tea with fresh bakes",
        "Conference writing pads, pens & mints",
      ],
      image: IMAGES.conferenceRoom,
      publishStatus: "published",
      featured: true,
      createdAt: new Date("2026-08-05").toISOString(),
    },
    {
      id: "offer-family-sunday-choma",
      title: "Sunday Family Garden Nyama Choma Platter",
      subtitle: "1kg Highland Goat Nyama Choma + Whole Kienyeji Chicken + Sides & 2L Fresh Juice",
      category: "dining",
      originalPrice: 5800,
      offerPrice: 4500,
      discountPercentage: 22,
      validUntil: "2026-10-31",
      inclusions: [
        "1kg Tender Highland Goat Nyama Choma (wet or dry fry)",
        "1 Whole Free-Range Kienyeji Chicken",
        "Ugali, Roast Potatoes, Kachumbari & Greens",
        "2-Litre Pitcher of Fresh Squeezed Passion Juice",
      ],
      image: IMAGES.diningFood,
      publishStatus: "published",
      featured: true,
      createdAt: new Date("2026-08-10").toISOString(),
    },
  ];
}

function generateSeedGallery(): GalleryItem[] {
  return [
    {
      id: "gal-01",
      title: "Deluxe Executive Suite Master Bedroom",
      category: "accommodation",
      imageUrl: IMAGES.deluxeSuite,
      altText: "Spacious master bedroom in Deluxe Suite with king-size bed and modern finishes",
      caption: "Our premiere suite overlooking the hills of Kapenguria",
      featured: true,
      publishStatus: "published",
      createdAt: new Date("2026-08-01").toISOString(),
    },
    {
      id: "gal-02",
      title: "Hotel Kalya Front Facade & Welcoming Portico",
      category: "accommodation",
      imageUrl: IMAGES.heroExterior,
      altText: "Exterior architecture of Hotel Kalya Kapenguria",
      caption: "A beacon of tranquil hospitality in West Pokot County",
      featured: true,
      publishStatus: "published",
      createdAt: new Date("2026-08-01").toISOString(),
    },
    {
      id: "gal-03",
      title: "Farm-to-Table Kenyan Culinary Spread",
      category: "dining",
      imageUrl: IMAGES.diningFood,
      altText: "Savory grilled meats, kienyeji chicken and fresh garden vegetables",
      caption: "Freshly harvested and prepared by Chef Patrick Mwangi",
      featured: true,
      publishStatus: "published",
      createdAt: new Date("2026-08-02").toISOString(),
    },
    {
      id: "gal-04",
      title: "Main Restaurant Dining Room",
      category: "dining",
      imageUrl: IMAGES.restaurantHall,
      altText: "Warmly lit dining hall with spacious table arrangements",
      caption: "Comfortable dining for breakfast, lunch, and dinner",
      featured: false,
      publishStatus: "published",
      createdAt: new Date("2026-08-02").toISOString(),
    },
    {
      id: "gal-05",
      title: "Mount Elgon Grand Ballroom Conference Setup",
      category: "conferences",
      imageUrl: IMAGES.conferenceRoom,
      altText: "Professional conference setup with projector screens and podium",
      caption: "Hosting county summits and international NGO workshops",
      featured: true,
      publishStatus: "published",
      createdAt: new Date("2026-08-03").toISOString(),
    },
    {
      id: "gal-06",
      title: "VIP Executive Boardroom",
      category: "conferences",
      imageUrl: IMAGES.boardroom,
      altText: "Executive boardroom with leather seating and video conferencing",
      caption: "High-level board meetings in total discretion",
      featured: false,
      publishStatus: "published",
      createdAt: new Date("2026-08-03").toISOString(),
    },
    {
      id: "gal-07",
      title: "Lush Kalya Manicured Wedding Gardens",
      category: "gardens",
      imageUrl: IMAGES.gardenLandscape,
      altText: "Green lawns and floral hedges under blue skies in Kapenguria",
      caption: "Picturesque wedding vows and outdoor receptions",
      featured: true,
      publishStatus: "published",
      createdAt: new Date("2026-08-04").toISOString(),
    },
    {
      id: "gal-08",
      title: "Sunset Hillside Terrace Seating",
      category: "gardens",
      imageUrl: IMAGES.gardenTerrace,
      altText: "Outdoor patio with sun umbrellas overlooking the valley",
      caption: "Breathtaking afternoon sundowners and cool mountain breezes",
      featured: false,
      publishStatus: "published",
      createdAt: new Date("2026-08-04").toISOString(),
    },
    {
      id: "gal-09",
      title: "Outdoor Banqueting & Catering Service",
      category: "events",
      imageUrl: IMAGES.cateringBuffet,
      altText: "Chaffing dishes and buffet line setup in garden marquee",
      caption: "Full catering service delivered anywhere in the North Rift region",
      featured: true,
      publishStatus: "published",
      createdAt: new Date("2026-08-05").toISOString(),
    },
    {
      id: "gal-10",
      title: "Royal Wedding Grand Pavilion Setup",
      category: "events",
      imageUrl: IMAGES.weddingSetup,
      altText: "Draped wedding tent with floral centerpieces and decorated chairs",
      caption: "Turning dream wedding celebrations into cherished realities",
      featured: true,
      publishStatus: "published",
      createdAt: new Date("2026-08-05").toISOString(),
    },
  ];
}

function generateSeedAnnouncements(): Announcement[] {
  return [
    {
      id: "ann-01",
      title: "Welcome to Hotel Kalya — Hospitality Redefined",
      message: "Experience pristine Highland hospitality in Kapenguria, West Pokot County. Direct website bookings enjoy complimentary full farmhouse breakfast.",
      bannerType: "promo",
      linkUrl: "/book",
      linkText: "Book Your Stay Online",
      isActive: true,
      startDate: "2026-09-01",
      endDate: "2026-12-31",
      createdAt: new Date("2026-09-01").toISOString(),
    },
  ];
}

function generateSeedHotelSettings(): HotelSettings {
  return {
    name: BRAND.name,
    tagline: BRAND.tagline,
    officialWhatsApp: BRAND.phoneClean,
    primaryPhone: BRAND.phone,
    secondaryPhone: "+254 722 000000",
    email: BRAND.email,
    address: "A1 Highway, Kapenguria, West Pokot County, Kenya",
    coordinates: { lat: 1.2415, lng: 35.1185 },
    googleMapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15951.688846399066!2d35.1082!3d1.2415!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x178229b46e8f498b%3A0xb3651fa1957262dc!2sKapenguria!5e0!3m2!1sen!2ske!4v1700000000000!5m2!1sen!2ske",
    googleMapsDirectionsUrl: "https://maps.google.com/?daddr=1.2415,35.1185",
    checkInTime: "2:00 PM (14:00)",
    checkOutTime: "10:00 AM (10:00)",
    receptionHours: "24 Hours / 7 Days a Week",
    restaurantHours: "6:30 AM – 10:00 PM",
    wifiNetwork: "HotelKalya-HighSpeed (Complimentary)",
    updatedAt: new Date().toISOString(),
  };
}

function generateSeedReviews(): CustomerReview[] {
  return [
    {
      id: "rev-01",
      authorName: "Prof. Kenneth Chesire",
      authorLocation: "Eldoret / Moi University",
      rating: 5,
      date: "2026-09-18",
      category: "Accommodation & Dining",
      comment: "Outstanding hospitality in Kapenguria! The Deluxe Suite had crisp linens, hot shower, and super fast Wi-Fi. The Kienyeji chicken at dinner was authentic and flavourful.",
      source: "Google Reviews",
      isApproved: true,
      isFeatured: true,
      createdAt: new Date("2026-09-18").toISOString(),
    },
    {
      id: "rev-02",
      authorName: "Mercy Wambui",
      authorLocation: "Nairobi",
      rating: 5,
      date: "2026-09-14",
      category: "Conferences & Events",
      comment: "We held a 3-day health symposium in the Mount Elgon hall. The AV equipment worked flawlessly and the staff catering breaks were punctual and delicious. Sarah and Dennis took great care of our delegates.",
      source: "Google Reviews",
      isApproved: true,
      isFeatured: true,
      createdAt: new Date("2026-09-14").toISOString(),
    },
    {
      id: "rev-03",
      authorName: "David Kiprop",
      authorLocation: "Kitale",
      rating: 5,
      date: "2026-09-08",
      category: "Cottages & Gardens",
      comment: "The standalone cottages are a peaceful haven. Waking up to garden views and bird songs was heavenly. Perfect getaway for family relaxation.",
      source: "Google Reviews",
      isApproved: true,
      isFeatured: true,
      createdAt: new Date("2026-09-08").toISOString(),
    },
    {
      id: "rev-04",
      authorName: "Eng. Samuel Lokeris",
      authorLocation: "Kapenguria",
      rating: 5,
      date: "2026-08-29",
      category: "Restaurant & Nyama Choma",
      comment: "Best Nyama Choma in West Pokot without a doubt. Always succulent and well-seasoned. The terrace garden is our regular Friday evening spot.",
      source: "Direct Guest Feedback",
      isApproved: true,
      isFeatured: true,
      createdAt: new Date("2026-08-29").toISOString(),
    },
  ];
}

// =============================================================================
// DATABASE CRUD OPERATIONS
// =============================================================================

// --- 1. MENU CATEGORIES ---
export async function getMenuCategories(): Promise<MenuCategoryEntity[]> {
  const cats = await readJsonFile<MenuCategoryEntity[]>("menu_categories.json", generateSeedMenuCategories());
  return cats.sort((a, b) => a.order - b.order);
}

export async function createMenuCategory(data: Omit<MenuCategoryEntity, "id">): Promise<MenuCategoryEntity> {
  const cats = await getMenuCategories();
  const id = data.slug.toLowerCase().replace(/[^a-z0-9]/g, "-");
  if (cats.some((c) => c.id === id || c.slug === data.slug)) {
    throw new Error(`Category with slug "${data.slug}" already exists.`);
  }

  const newCat: MenuCategoryEntity = { ...data, id };
  cats.push(newCat);
  await writeJsonFile("menu_categories.json", cats);

  await logAuditEvent({
    userId: "admin",
    userName: "System Administrator",
    role: "ADMIN",
    action: "CREATED_MENU_CATEGORY",
    target: newCat.label,
    details: `Created menu category "${newCat.label}" (${newCat.slug})`,
  });

  return newCat;
}

export async function updateMenuCategory(id: string, updates: Partial<MenuCategoryEntity>): Promise<MenuCategoryEntity | null> {
  const cats = await getMenuCategories();
  const idx = cats.findIndex((c) => c.id === id || c.slug === id);
  if (idx === -1) return null;

  cats[idx] = { ...cats[idx], ...updates };
  await writeJsonFile("menu_categories.json", cats);

  await logAuditEvent({
    userId: "admin",
    userName: "System Administrator",
    role: "ADMIN",
    action: "UPDATED_MENU_CATEGORY",
    target: cats[idx].label,
    details: `Updated menu category "${cats[idx].label}"`,
  });

  return cats[idx];
}

export async function deleteMenuCategory(id: string): Promise<{ success: boolean; error?: string }> {
  const cats = await getMenuCategories();
  const idx = cats.findIndex((c) => c.id === id || c.slug === id);
  if (idx === -1) return { success: false, error: "Category not found." };

  const deleted = cats[idx];
  cats.splice(idx, 1);
  await writeJsonFile("menu_categories.json", cats);

  await logAuditEvent({
    userId: "admin",
    userName: "System Administrator",
    role: "ADMIN",
    action: "DELETED_MENU_CATEGORY",
    target: deleted.label,
    details: `Deleted menu category "${deleted.label}"`,
  });

  return { success: true };
}

// --- 2. MENU ITEMS ---
export async function getMenuItems(
  categoryOrOnlyPublished?: string | boolean,
  onlyPublished: boolean = false
): Promise<MenuItemEntity[]> {
  let category: string | undefined;
  let isOnlyPublished = onlyPublished;

  if (typeof categoryOrOnlyPublished === "boolean") {
    isOnlyPublished = categoryOrOnlyPublished;
    category = undefined;
  } else if (typeof categoryOrOnlyPublished === "string") {
    category = categoryOrOnlyPublished;
  }

  const items = await readJsonFile<MenuItemEntity[]>("menu_items.json", generateSeedMenuItems());
  let filtered = items;
  if (category && category !== "all") {
    filtered = filtered.filter((i) => (i.category || "").toLowerCase() === category.toLowerCase());
  }
  if (isOnlyPublished) {
    filtered = filtered.filter((i) => i.publishStatus === "published" && i.available !== false);
  }
  return filtered.sort((a, b) => (a.order || 0) - (b.order || 0));
}

export async function getMenuItemById(id: string): Promise<MenuItemEntity | null> {
  const items = await readJsonFile<MenuItemEntity[]>("menu_items.json", generateSeedMenuItems());
  return items.find((i) => i.id === id) || null;
}

export async function createMenuItem(data: Omit<MenuItemEntity, "id"> & { id?: string }): Promise<MenuItemEntity> {
  const items = await readJsonFile<MenuItemEntity[]>("menu_items.json", generateSeedMenuItems());
  const id = data.id || `item_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const newItem: MenuItemEntity = {
    ...data,
    id,
    publishStatus: data.publishStatus || "published",
    available: data.available !== undefined ? data.available : true,
    createdAt: new Date().toISOString(),
  };

  items.push(newItem);
  await writeJsonFile("menu_items.json", items);

  await logAuditEvent({
    userId: "admin",
    userName: "System Administrator",
    role: "ADMIN",
    action: "CREATED_MENU_ITEM",
    target: newItem.name,
    details: `Created menu item "${newItem.name}" under ${newItem.categoryLabel || newItem.category || "General"} (KES ${newItem.price})`,
  });

  return newItem;
}

export async function updateMenuItem(id: string, updates: Partial<MenuItemEntity>): Promise<MenuItemEntity | null> {
  const items = await readJsonFile<MenuItemEntity[]>("menu_items.json", generateSeedMenuItems());
  const idx = items.findIndex((i) => i.id === id);
  if (idx === -1) return null;

  items[idx] = { ...items[idx], ...updates, updatedAt: new Date().toISOString() };
  await writeJsonFile("menu_items.json", items);

  await logAuditEvent({
    userId: "admin",
    userName: "System Administrator",
    role: "ADMIN",
    action: "UPDATED_MENU_ITEM",
    target: items[idx].name,
    details: `Updated menu item "${items[idx].name}" - Price: KES ${items[idx].price}, Status: ${items[idx].publishStatus}`,
  });

  return items[idx];
}

export async function deleteMenuItem(id: string): Promise<{ success: boolean; error?: string }> {
  const items = await readJsonFile<MenuItemEntity[]>("menu_items.json", generateSeedMenuItems());
  const idx = items.findIndex((i) => i.id === id);
  if (idx === -1) return { success: false, error: "Menu item not found." };

  const deleted = items[idx];
  items.splice(idx, 1);
  await writeJsonFile("menu_items.json", items);

  await logAuditEvent({
    userId: "admin",
    userName: "System Administrator",
    role: "ADMIN",
    action: "DELETED_MENU_ITEM",
    target: deleted.name,
    details: `Deleted menu item "${deleted.name}"`,
  });

  return { success: true };
}

// --- 3. GARDENS ---
export async function getGardens(onlyPublished: boolean = false): Promise<GardenExperience[]> {
  const list = await readJsonFile<GardenExperience[]>("gardens.json", generateSeedGardens());
  return onlyPublished ? list.filter((g) => g.publishStatus === "published") : list;
}

export async function getGardenById(id: string): Promise<GardenExperience | null> {
  const list = await getGardens(false);
  return list.find((g) => g.id === id || g.slug === id) || null;
}

export async function createGarden(data: Omit<GardenExperience, "id"> & { id?: string }): Promise<GardenExperience> {
  const list = await getGardens(false);
  const id = data.id || `garden-${data.slug || Date.now()}`;
  const newGarden: GardenExperience = {
    ...data,
    id,
    publishStatus: data.publishStatus || "published",
    createdAt: new Date().toISOString(),
  };

  list.push(newGarden);
  await writeJsonFile("gardens.json", list);

  await logAuditEvent({
    userId: "admin",
    userName: "System Administrator",
    role: "ADMIN",
    action: "CREATED_GARDEN",
    target: newGarden.name,
    details: `Created garden experience: "${newGarden.name}"`,
  });

  return newGarden;
}

export async function updateGarden(id: string, updates: Partial<GardenExperience>): Promise<GardenExperience | null> {
  const list = await getGardens(false);
  const idx = list.findIndex((g) => g.id === id || g.slug === id);
  if (idx === -1) return null;

  list[idx] = { ...list[idx], ...updates, updatedAt: new Date().toISOString() };
  await writeJsonFile("gardens.json", list);

  await logAuditEvent({
    userId: "admin",
    userName: "System Administrator",
    role: "ADMIN",
    action: "UPDATED_GARDEN",
    target: list[idx].name,
    details: `Updated garden: "${list[idx].name}"`,
  });

  return list[idx];
}

export async function deleteGarden(id: string): Promise<{ success: boolean; error?: string }> {
  const list = await getGardens(false);
  const idx = list.findIndex((g) => g.id === id || g.slug === id);
  if (idx === -1) return { success: false, error: "Garden not found." };

  const deleted = list[idx];
  list.splice(idx, 1);
  await writeJsonFile("gardens.json", list);

  await logAuditEvent({
    userId: "admin",
    userName: "System Administrator",
    role: "ADMIN",
    action: "DELETED_GARDEN",
    target: deleted.name,
    details: `Deleted garden experience "${deleted.name}"`,
  });

  return { success: true };
}

// --- 4. CONFERENCE HALLS ---
export async function getConferenceHalls(onlyPublished: boolean = false): Promise<ConferenceHall[]> {
  const list = await readJsonFile<ConferenceHall[]>("conference_halls.json", generateSeedConferenceHalls());
  return onlyPublished ? list.filter((h) => h.publishStatus === "published") : list;
}

export async function getConferenceHallById(id: string): Promise<ConferenceHall | null> {
  const list = await getConferenceHalls(false);
  return list.find((h) => h.id === id || h.slug === id) || null;
}

export async function createConferenceHall(data: Omit<ConferenceHall, "id"> & { id?: string }): Promise<ConferenceHall> {
  const list = await getConferenceHalls(false);
  const id = data.id || `hall-${data.slug || Date.now()}`;
  const newHall: ConferenceHall = {
    ...data,
    id,
    publishStatus: data.publishStatus || "published",
    createdAt: new Date().toISOString(),
  };

  list.push(newHall);
  await writeJsonFile("conference_halls.json", list);

  await logAuditEvent({
    userId: "admin",
    userName: "System Administrator",
    role: "ADMIN",
    action: "CREATED_CONFERENCE_HALL",
    target: newHall.name,
    details: `Created conference hall: "${newHall.name}"`,
  });

  return newHall;
}

export async function updateConferenceHall(id: string, updates: Partial<ConferenceHall>): Promise<ConferenceHall | null> {
  const list = await getConferenceHalls(false);
  const idx = list.findIndex((h) => h.id === id || h.slug === id);
  if (idx === -1) return null;

  list[idx] = { ...list[idx], ...updates, updatedAt: new Date().toISOString() };
  await writeJsonFile("conference_halls.json", list);

  await logAuditEvent({
    userId: "admin",
    userName: "System Administrator",
    role: "ADMIN",
    action: "UPDATED_CONFERENCE_HALL",
    target: list[idx].name,
    details: `Updated conference hall: "${list[idx].name}"`,
  });

  return list[idx];
}

export async function deleteConferenceHall(id: string): Promise<{ success: boolean; error?: string }> {
  const list = await getConferenceHalls(false);
  const idx = list.findIndex((h) => h.id === id || h.slug === id);
  if (idx === -1) return { success: false, error: "Hall not found." };

  const deleted = list[idx];
  list.splice(idx, 1);
  await writeJsonFile("conference_halls.json", list);

  await logAuditEvent({
    userId: "admin",
    userName: "System Administrator",
    role: "ADMIN",
    action: "DELETED_CONFERENCE_HALL",
    target: deleted.name,
    details: `Deleted conference hall: "${deleted.name}"`,
  });

  return { success: true };
}

// --- 5. EVENT SPACES ---
export async function getEventSpaces(onlyPublished: boolean = false): Promise<EventSpace[]> {
  const list = await readJsonFile<EventSpace[]>("event_spaces.json", generateSeedEventSpaces());
  return onlyPublished ? list.filter((s) => s.publishStatus === "published") : list;
}

export async function getEventSpaceById(id: string): Promise<EventSpace | null> {
  const list = await getEventSpaces(false);
  return list.find((s) => s.id === id || s.slug === id) || null;
}

export async function createEventSpace(data: Omit<EventSpace, "id"> & { id?: string }): Promise<EventSpace> {
  const list = await getEventSpaces(false);
  const id = data.id || `event-space-${data.slug || Date.now()}`;
  const newSpace: EventSpace = {
    ...data,
    id,
    publishStatus: data.publishStatus || "published",
    createdAt: new Date().toISOString(),
  };

  list.push(newSpace);
  await writeJsonFile("event_spaces.json", list);

  await logAuditEvent({
    userId: "admin",
    userName: "System Administrator",
    role: "ADMIN",
    action: "CREATED_EVENT_SPACE",
    target: newSpace.name,
    details: `Created event space: "${newSpace.name}"`,
  });

  return newSpace;
}

export async function updateEventSpace(id: string, updates: Partial<EventSpace>): Promise<EventSpace | null> {
  const list = await getEventSpaces(false);
  const idx = list.findIndex((s) => s.id === id || s.slug === id);
  if (idx === -1) return null;

  list[idx] = { ...list[idx], ...updates, updatedAt: new Date().toISOString() };
  await writeJsonFile("event_spaces.json", list);

  await logAuditEvent({
    userId: "admin",
    userName: "System Administrator",
    role: "ADMIN",
    action: "UPDATED_EVENT_SPACE",
    target: list[idx].name,
    details: `Updated event space: "${list[idx].name}"`,
  });

  return list[idx];
}

export async function deleteEventSpace(id: string): Promise<{ success: boolean; error?: string }> {
  const list = await getEventSpaces(false);
  const idx = list.findIndex((s) => s.id === id || s.slug === id);
  if (idx === -1) return { success: false, error: "Event space not found." };

  const deleted = list[idx];
  list.splice(idx, 1);
  await writeJsonFile("event_spaces.json", list);

  await logAuditEvent({
    userId: "admin",
    userName: "System Administrator",
    role: "ADMIN",
    action: "DELETED_EVENT_SPACE",
    target: deleted.name,
    details: `Deleted event space: "${deleted.name}"`,
  });

  return { success: true };
}

// --- 6. CATERING PACKAGES ---
export async function getCateringPackages(onlyPublished: boolean = false): Promise<CateringPackage[]> {
  const list = await readJsonFile<CateringPackage[]>("catering_packages.json", generateSeedCateringPackages());
  return onlyPublished ? list.filter((p) => p.publishStatus === "published") : list;
}

export async function getCateringPackageById(id: string): Promise<CateringPackage | null> {
  const list = await getCateringPackages(false);
  return list.find((p) => p.id === id || p.slug === id) || null;
}

export async function createCateringPackage(data: Omit<CateringPackage, "id"> & { id?: string }): Promise<CateringPackage> {
  const list = await getCateringPackages(false);
  const id = data.id || `catering-${data.slug || Date.now()}`;
  const newPkg: CateringPackage = {
    ...data,
    id,
    publishStatus: data.publishStatus || "published",
    createdAt: new Date().toISOString(),
  };

  list.push(newPkg);
  await writeJsonFile("catering_packages.json", list);

  await logAuditEvent({
    userId: "admin",
    userName: "System Administrator",
    role: "ADMIN",
    action: "CREATED_CATERING_PACKAGE",
    target: newPkg.title || newPkg.name || "Catering Package",
    details: `Created outside catering package "${newPkg.title || newPkg.name}" at KES ${newPkg.pricePerPerson}/pax`,
  });

  return newPkg;
}

export async function updateCateringPackage(id: string, updates: Partial<CateringPackage>): Promise<CateringPackage | null> {
  const list = await getCateringPackages(false);
  const idx = list.findIndex((p) => p.id === id || p.slug === id);
  if (idx === -1) return null;

  list[idx] = { ...list[idx], ...updates, updatedAt: new Date().toISOString() };
  await writeJsonFile("catering_packages.json", list);

  await logAuditEvent({
    userId: "admin",
    userName: "System Administrator",
    role: "ADMIN",
    action: "UPDATED_CATERING_PACKAGE",
    target: list[idx].title || list[idx].name || "Catering Package",
    details: `Updated catering package "${list[idx].title || list[idx].name}"`,
  });

  return list[idx];
}

export async function deleteCateringPackage(id: string): Promise<{ success: boolean; error?: string }> {
  const list = await getCateringPackages(false);
  const idx = list.findIndex((p) => p.id === id || p.slug === id);
  if (idx === -1) return { success: false, error: "Package not found." };

  const deleted = list[idx];
  list.splice(idx, 1);
  await writeJsonFile("catering_packages.json", list);

  await logAuditEvent({
    userId: "admin",
    userName: "System Administrator",
    role: "ADMIN",
    action: "DELETED_CATERING_PACKAGE",
    target: deleted.title || deleted.name || "Catering Package",
    details: `Deleted catering package "${deleted.title || deleted.name}"`,
  });

  return { success: true };
}

// --- 7. AIRBNB APARTMENTS ---
export async function getAirbnbApartments(onlyPublished: boolean = false): Promise<AirbnbApartment[]> {
  const list = await readJsonFile<AirbnbApartment[]>("airbnb_apartments.json", generateSeedAirbnb());
  return onlyPublished ? list.filter((a) => a.publishStatus === "published") : list;
}

export async function getAirbnbApartmentById(id: string): Promise<AirbnbApartment | null> {
  const list = await getAirbnbApartments(false);
  return list.find((a) => a.id === id || a.slug === id) || null;
}

export async function createAirbnbApartment(data: Omit<AirbnbApartment, "id"> & { id?: string }): Promise<AirbnbApartment> {
  const list = await getAirbnbApartments(false);
  const id = data.id || `airbnb-${data.slug || Date.now()}`;
  const newApt: AirbnbApartment = {
    ...data,
    id,
    publishStatus: data.publishStatus || "published",
    bookingStatus: data.bookingStatus || "AVAILABLE",
    createdAt: new Date().toISOString(),
  };

  list.push(newApt);
  await writeJsonFile("airbnb_apartments.json", list);

  await logAuditEvent({
    userId: "admin",
    userName: "System Administrator",
    role: "ADMIN",
    action: "CREATED_AIRBNB_UNIT",
    target: newApt.name,
    details: `Created Airbnb apartment "${newApt.name}" at KES ${newApt.pricePerNight}/night`,
  });

  return newApt;
}

export async function updateAirbnbApartment(id: string, updates: Partial<AirbnbApartment>): Promise<AirbnbApartment | null> {
  const list = await getAirbnbApartments(false);
  const idx = list.findIndex((a) => a.id === id || a.slug === id);
  if (idx === -1) return null;

  list[idx] = { ...list[idx], ...updates, updatedAt: new Date().toISOString() };
  await writeJsonFile("airbnb_apartments.json", list);

  await logAuditEvent({
    userId: "admin",
    userName: "System Administrator",
    role: "ADMIN",
    action: "UPDATED_AIRBNB_UNIT",
    target: list[idx].name,
    details: `Updated Airbnb unit "${list[idx].name}"`,
  });

  return list[idx];
}

export async function deleteAirbnbApartment(id: string): Promise<{ success: boolean; error?: string }> {
  const list = await getAirbnbApartments(false);
  const idx = list.findIndex((a) => a.id === id || a.slug === id);
  if (idx === -1) return { success: false, error: "Apartment not found." };

  const deleted = list[idx];
  list.splice(idx, 1);
  await writeJsonFile("airbnb_apartments.json", list);

  await logAuditEvent({
    userId: "admin",
    userName: "System Administrator",
    role: "ADMIN",
    action: "DELETED_AIRBNB_UNIT",
    target: deleted.name,
    details: `Deleted Airbnb apartment "${deleted.name}"`,
  });

  return { success: true };
}

// --- 8. OFFERS & PACKAGES ---
export async function getOffers(onlyPublished: boolean = false): Promise<HospitalityOffer[]> {
  const list = await readJsonFile<HospitalityOffer[]>("offers.json", generateSeedOffers());
  return onlyPublished ? list.filter((o) => o.publishStatus === "published") : list;
}

export async function getOfferById(id: string): Promise<HospitalityOffer | null> {
  const list = await getOffers(false);
  return list.find((o) => o.id === id) || null;
}

export async function createOffer(data: Omit<HospitalityOffer, "id"> & { id?: string }): Promise<HospitalityOffer> {
  const list = await getOffers(false);
  const id = data.id || `offer-${Date.now()}`;
  const newOffer: HospitalityOffer = {
    ...data,
    id,
    publishStatus: data.publishStatus || "published",
    createdAt: new Date().toISOString(),
  };

  list.push(newOffer);
  await writeJsonFile("offers.json", list);

  await logAuditEvent({
    userId: "admin",
    userName: "System Administrator",
    role: "ADMIN",
    action: "CREATED_OFFER",
    target: newOffer.title,
    details: `Created offer "${newOffer.title}" at KES ${newOffer.offerPrice}`,
  });

  return newOffer;
}

export async function updateOffer(id: string, updates: Partial<HospitalityOffer>): Promise<HospitalityOffer | null> {
  const list = await getOffers(false);
  const idx = list.findIndex((o) => o.id === id);
  if (idx === -1) return null;

  list[idx] = { ...list[idx], ...updates, updatedAt: new Date().toISOString() };
  await writeJsonFile("offers.json", list);

  await logAuditEvent({
    userId: "admin",
    userName: "System Administrator",
    role: "ADMIN",
    action: "UPDATED_OFFER",
    target: list[idx].title,
    details: `Updated offer "${list[idx].title}"`,
  });

  return list[idx];
}

export async function deleteOffer(id: string): Promise<{ success: boolean; error?: string }> {
  const list = await getOffers(false);
  const idx = list.findIndex((o) => o.id === id);
  if (idx === -1) return { success: false, error: "Offer not found." };

  const deleted = list[idx];
  list.splice(idx, 1);
  await writeJsonFile("offers.json", list);

  await logAuditEvent({
    userId: "admin",
    userName: "System Administrator",
    role: "ADMIN",
    action: "DELETED_OFFER",
    target: deleted.title,
    details: `Deleted offer "${deleted.title}"`,
  });

  return { success: true };
}

// --- 9. GALLERY & MEDIA ---
export async function getGalleryItems(
  categoryOrOnlyPublished?: string | boolean,
  onlyPublished: boolean = false
): Promise<GalleryItem[]> {
  let category: string | undefined;
  let isOnlyPublished = onlyPublished;

  if (typeof categoryOrOnlyPublished === "boolean") {
    isOnlyPublished = categoryOrOnlyPublished;
    category = undefined;
  } else if (typeof categoryOrOnlyPublished === "string") {
    category = categoryOrOnlyPublished;
  }

  const list = await readJsonFile<GalleryItem[]>("gallery.json", generateSeedGallery());
  let filtered = list;
  if (category && category !== "all") {
    filtered = filtered.filter((i) => (i.category || "").toLowerCase() === category.toLowerCase());
  }
  if (isOnlyPublished) {
    filtered = filtered.filter((i) => i.publishStatus === "published");
  }
  return filtered;
}

export async function getGalleryItemById(id: string): Promise<GalleryItem | null> {
  const list = await getGalleryItems("all", false);
  return list.find((i) => i.id === id) || null;
}

export async function createGalleryItem(data: Omit<GalleryItem, "id"> & { id?: string }): Promise<GalleryItem> {
  const list = await getGalleryItems("all", false);
  const id = data.id || `gal-${Date.now()}`;
  const newItem: GalleryItem = {
    ...data,
    id,
    publishStatus: data.publishStatus || "published",
    createdAt: new Date().toISOString(),
  };

  list.push(newItem);
  await writeJsonFile("gallery.json", list);

  await logAuditEvent({
    userId: "admin",
    userName: "System Administrator",
    role: "ADMIN",
    action: "CREATED_GALLERY_ITEM",
    target: newItem.title,
    details: `Added gallery item "${newItem.title}" (${newItem.category})`,
  });

  return newItem;
}

export async function updateGalleryItem(id: string, updates: Partial<GalleryItem>): Promise<GalleryItem | null> {
  const list = await getGalleryItems("all", false);
  const idx = list.findIndex((i) => i.id === id);
  if (idx === -1) return null;

  list[idx] = { ...list[idx], ...updates, updatedAt: new Date().toISOString() };
  await writeJsonFile("gallery.json", list);

  await logAuditEvent({
    userId: "admin",
    userName: "System Administrator",
    role: "ADMIN",
    action: "UPDATED_GALLERY_ITEM",
    target: list[idx].title,
    details: `Updated gallery item "${list[idx].title}"`,
  });

  return list[idx];
}

export async function deleteGalleryItem(id: string): Promise<{ success: boolean; error?: string }> {
  const list = await getGalleryItems("all", false);
  const idx = list.findIndex((i) => i.id === id);
  if (idx === -1) return { success: false, error: "Gallery item not found." };

  const deleted = list[idx];
  list.splice(idx, 1);
  await writeJsonFile("gallery.json", list);

  await logAuditEvent({
    userId: "admin",
    userName: "System Administrator",
    role: "ADMIN",
    action: "DELETED_GALLERY_ITEM",
    target: deleted.title,
    details: `Deleted gallery item "${deleted.title}"`,
  });

  return { success: true };
}

// --- 10. ANNOUNCEMENTS ---
export async function getAnnouncements(onlyPublishedOrActive: boolean = false): Promise<Announcement[]> {
  const list = await readJsonFile<Announcement[]>("announcements.json", generateSeedAnnouncements());
  if (onlyPublishedOrActive) {
    return list.filter((a) => {
      const isAct = a.isActive ?? a.active ?? true;
      const isPub = a.publishStatus ? a.publishStatus === "published" : true;
      return isAct && isPub;
    });
  }
  return list;
}

export async function getActiveAnnouncements(): Promise<Announcement[]> {
  return getAnnouncements(true);
}

export async function createAnnouncement(data: Omit<Announcement, "id"> & { id?: string; active?: boolean }): Promise<Announcement> {
  const list = await getAnnouncements(false);
  const id = data.id || `ann-${Date.now()}`;
  const newAnn: Announcement = {
    ...data,
    id,
    isActive: data.isActive !== undefined ? data.isActive : (data.active !== undefined ? data.active : true),
    publishStatus: data.publishStatus || "published",
    createdAt: new Date().toISOString(),
  };

  list.push(newAnn);
  await writeJsonFile("announcements.json", list);

  await logAuditEvent({
    userId: "admin",
    userName: "System Administrator",
    role: "ADMIN",
    action: "CREATED_ANNOUNCEMENT",
    target: newAnn.title,
    details: `Created website promotional announcement: "${newAnn.title}"`,
  });

  return newAnn;
}

export async function updateAnnouncement(id: string, updates: Partial<Announcement> & { active?: boolean }): Promise<Announcement | null> {
  const list = await getAnnouncements(false);
  const idx = list.findIndex((a) => a.id === id);
  if (idx === -1) return null;

  list[idx] = {
    ...list[idx],
    ...updates,
    isActive: updates.isActive !== undefined ? updates.isActive : (updates.active !== undefined ? updates.active : list[idx].isActive),
    updatedAt: new Date().toISOString()
  };
  await writeJsonFile("announcements.json", list);

  await logAuditEvent({
    userId: "admin",
    userName: "System Administrator",
    role: "ADMIN",
    action: "UPDATED_ANNOUNCEMENT",
    target: list[idx].title,
    details: `Updated announcement "${list[idx].title}" (Active: ${list[idx].isActive})`,
  });

  return list[idx];
}

export async function deleteAnnouncement(id: string): Promise<{ success: boolean; error?: string }> {
  const list = await getAnnouncements();
  const idx = list.findIndex((a) => a.id === id);
  if (idx === -1) return { success: false, error: "Announcement not found." };

  const deleted = list[idx];
  list.splice(idx, 1);
  await writeJsonFile("announcements.json", list);

  await logAuditEvent({
    userId: "admin",
    userName: "System Administrator",
    role: "ADMIN",
    action: "DELETED_ANNOUNCEMENT",
    target: deleted.title,
    details: `Deleted announcement "${deleted.title}"`,
  });

  return { success: true };
}

// --- 11. HOTEL SETTINGS ---
export async function getHotelSettings(): Promise<HotelSettings & { phone?: string; whatsappNumber?: string; googleMapsUrl?: string }> {
  const settings = await readJsonFile<HotelSettings>("hotel_settings.json", generateSeedHotelSettings());
  return {
    ...settings,
    phone: settings.phone || settings.primaryPhone,
    whatsappNumber: (settings as any).whatsappNumber || settings.officialWhatsApp,
    googleMapsUrl: (settings as any).googleMapsUrl || settings.googleMapsDirectionsUrl,
  };
}

export async function updateHotelSettings(
  updates: Partial<HotelSettings> & { phone?: string; whatsappNumber?: string; googleMapsUrl?: string },
  user?: UserProfile
): Promise<HotelSettings> {
  const current = await getHotelSettings();
  const normalizedUpdates: Partial<HotelSettings> & Record<string, any> = { ...updates };
  if (updates.phone) normalizedUpdates.primaryPhone = updates.phone;
  if (updates.whatsappNumber) {
    normalizedUpdates.officialWhatsApp = updates.whatsappNumber;
    normalizedUpdates.whatsappNumber = updates.whatsappNumber;
  }
  if (updates.googleMapsUrl) {
    normalizedUpdates.googleMapsDirectionsUrl = updates.googleMapsUrl;
    normalizedUpdates.googleMapsUrl = updates.googleMapsUrl;
  }

  const updated: HotelSettings = {
    ...current,
    ...normalizedUpdates,
    updatedAt: new Date().toISOString(),
  };

  await writeJsonFile("hotel_settings.json", updated);

  await logAuditEvent({
    userId: user?.id || "system",
    userName: user?.name || "System Administrator",
    role: (user?.staffRole as any) || (user?.role?.toUpperCase() as any) || "ADMIN",
    action: "UPDATED_HOTEL_SETTINGS",
    target: "Hotel Settings",
    details: `Updated hotel operational settings & contact details`,
  });

  return updated;
}

// --- 12. CUSTOMER REVIEWS ---
export async function getReviews(onlyApproved: boolean = false): Promise<CustomerReview[]> {
  const list = await readJsonFile<CustomerReview[]>("customer_reviews.json", generateSeedReviews());
  return onlyApproved ? list.filter((r) => r.isApproved) : list;
}

export async function createReview(
  data: Omit<CustomerReview, "id"> & { id?: string; author?: string; authorLocation?: string }
): Promise<CustomerReview> {
  const list = await getReviews(false);
  const id = data.id || `rev-${Date.now()}`;
  const authorName = data.authorName || data.author || "Valued Guest";
  const newRev: CustomerReview = {
    ...data,
    id,
    authorName,
    comment: data.comment || "",
    isApproved: data.isApproved !== undefined ? data.isApproved : false,
    isFeatured: data.isFeatured !== undefined ? data.isFeatured : false,
    source: data.source || "Direct Guest Feedback",
    rating: data.rating || 5,
    publishStatus: data.publishStatus || "published",
    createdAt: data.createdAt || new Date().toISOString(),
  };

  list.push(newRev);
  await writeJsonFile("customer_reviews.json", list);

  await logAuditEvent({
    userId: "admin",
    userName: "System Administrator",
    role: "ADMIN",
    action: "CREATED_REVIEW",
    target: newRev.authorName,
    details: `Recorded guest review from ${newRev.authorName} (${newRev.rating} stars)`,
  });

  return newRev;
}

export async function updateReview(id: string, updates: Partial<CustomerReview>): Promise<CustomerReview | null> {
  const list = await getReviews(false);
  const idx = list.findIndex((r) => r.id === id);
  if (idx === -1) return null;

  list[idx] = { ...list[idx], ...updates, updatedAt: new Date().toISOString() };
  await writeJsonFile("customer_reviews.json", list);

  await logAuditEvent({
    userId: "admin",
    userName: "System Administrator",
    role: "ADMIN",
    action: "UPDATED_REVIEW",
    target: list[idx].authorName,
    details: `Updated review by ${list[idx].authorName} (Approved: ${list[idx].isApproved})`,
  });

  return list[idx];
}

export async function deleteReview(id: string): Promise<{ success: boolean; error?: string }> {
  const list = await getReviews(false);
  const idx = list.findIndex((r) => r.id === id);
  if (idx === -1) return { success: false, error: "Review not found." };

  const deleted = list[idx];
  list.splice(idx, 1);
  await writeJsonFile("customer_reviews.json", list);

  await logAuditEvent({
    userId: "admin",
    userName: "System Administrator",
    role: "ADMIN",
    action: "DELETED_REVIEW",
    target: deleted.authorName,
    details: `Deleted review from ${deleted.authorName}`,
  });

  return { success: true };
}

// Aliases for review methods
export const getCustomerReviews = getReviews;
export const createCustomerReview = createReview;
export const updateCustomerReview = updateReview;
export const deleteCustomerReview = deleteReview;

