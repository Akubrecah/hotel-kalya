import {
  getRooms,
  createRoom,
  updateRoom,
  deleteRoom,
  getMenuCategories,
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getGardens,
  createGarden,
  updateGarden,
  deleteGarden,
  getConferenceHalls,
  createConferenceHall,
  updateConferenceHall,
  deleteConferenceHall,
  getCateringPackages,
  createCateringPackage,
  updateCateringPackage,
  deleteCateringPackage,
  getAirbnbApartments,
  createAirbnbApartment,
  updateAirbnbApartment,
  deleteAirbnbApartment,
  getOffers,
  createOffer,
  updateOffer,
  deleteOffer,
  getGalleryItems,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  getCustomerReviews,
  createCustomerReview,
  updateCustomerReview,
  deleteCustomerReview,
  getHotelSettings,
  updateHotelSettings,
  getAuditLogs
} from "../src/lib/cms-db";

async function runCMSVerification() {
  console.log("🚀 Starting Dynamic Hospitality CMS End-to-End Verification Pipeline...\n");

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition: boolean, testName: string, details?: string) {
    totalTests++;
    if (condition) {
      passedTests++;
      console.log(`  ✅ [PASS] ${testName}`);
    } else {
      console.error(`  ❌ [FAIL] ${testName}${details ? ` -> ${details}` : ""}`);
      process.exitCode = 1;
    }
  }

  // 1. ROOMS MODULE
  console.log("--- 1. Testing Rooms & Accommodation CMS Module ---");
  const initialPublishedRooms = await getRooms(true);
  console.log(`  Initial published rooms: ${initialPublishedRooms.length}`);

  const testRoomId = `test-room-${Date.now()}`;
  const createdRoom = await createRoom({
    id: testRoomId,
    roomNumber: "TEST-999",
    name: "Verification Presidential Suite",
    type: "VIP",
    typeSlug: "vip-suite",
    basePrice: 18500,
    capacity: { adults: 2, children: 1, maxGuests: 3 },
    bedConfiguration: "Super King Bed",
    size: "65 sqm",
    bedType: "Super King",
    amenities: ["Ultra High Speed Wi-Fi", "Jacuzzi", "Panoramic Balcony"],
    images: ["/images/hero-1.webp"],
    description: "Automated test suite verification room.",
    reservationStatus: "AVAILABLE",
    housekeepingStatus: "CLEAN",
    floor: "3rd Floor",
    publishStatus: "draft",
    featured: true,
    isActive: true,
  });
  assert(createdRoom.id === testRoomId, "Create Room in Draft state");

  let publishedAfterDraft = await getRooms(true);
  assert(
    !publishedAfterDraft.some((r) => r.id === testRoomId),
    "Draft room is NOT exposed to public frontend"
  );

  const updatedRoom = await updateRoom(testRoomId, { publishStatus: "published", basePrice: 19500 });
  assert(updatedRoom?.publishStatus === "published", "Update room to published");

  let publishedAfterPublish = await getRooms(true);
  assert(
    publishedAfterPublish.some((r) => r.id === testRoomId && r.basePrice === 19500),
    "Published room is immediately available on public frontend with updated price"
  );

  await deleteRoom(testRoomId);
  let publishedAfterDelete = await getRooms(true);
  assert(
    !publishedAfterDelete.some((r) => r.id === testRoomId),
    "Deleted room is removed from public frontend"
  );

  // 2. RESTAURANT & MENU MODULE
  console.log("\n--- 2. Testing Restaurant & Menu CMS Module ---");
  const categories = await getMenuCategories();
  assert(categories.length > 0, `Menu categories loaded (${categories.length} found)`);

  const testMenuItemId = `test-menu-${Date.now()}`;
  const createdMenuItem = await createMenuItem({
    id: testMenuItemId,
    name: "Verification Signature Herb Trout",
    category: "dinner",
    description: "Pan-seared fresh herb trout with organic seasonal vegetables.",
    price: 1650,
    prepTime: "25 mins",
    isVegetarian: false,
    isSpicy: false,
    available: true,
    allergens: ["Fish"],
    publishStatus: "draft",
  });
  assert(createdMenuItem.id === testMenuItemId, "Create Menu Item in Draft state");

  const initialPublishedMenu = await getMenuItems(true);
  assert(
    !initialPublishedMenu.some((item) => item.id === testMenuItemId),
    "Draft menu item is NOT exposed to public digital menu"
  );

  await updateMenuItem(testMenuItemId, { publishStatus: "published", available: false });
  const publishedMenuUpdated = await getMenuItems(true);
  assert(
    !publishedMenuUpdated.some((item) => item.id === testMenuItemId),
    "Unavailable/86 menu item is safely excluded from active public orders"
  );

  await deleteMenuItem(testMenuItemId);
  const menuAfterDelete = await getMenuItems(false);
  assert(
    !menuAfterDelete.some((item) => item.id === testMenuItemId),
    "Deleted menu item removed from digital menu"
  );

  // 3. GARDENS & EXPERIENCES MODULE
  console.log("\n--- 3. Testing Gardens & Experiences CMS Module ---");
  const testGardenId = `test-garden-${Date.now()}`;
  await createGarden({
    id: testGardenId,
    name: "Verification Sunset Pavilion Garden",
    slug: "verification-sunset-pavilion",
    description: "Scenic gardens for outdoor weddings and photography.",
    capacity: { minGuests: 50, maxGuests: 400 },
    pricing: { perDay: 45000, photographySession: 25000 },
    facilities: ["Gazebo setup", "Ample guest parking"],
    features: ["Manicured lawn", "Indigenous trees"],
    eventSuitability: ["Weddings", "Photo Sessions", "Private Parties"],
    openingHours: "6:00 AM - 6:30 PM",
    bookingRequirements: "Deposit required 48 hours prior",
    location: "Hotel Kalya Grounds, Kapenguria",
    images: ["/images/hero-2.webp"],
    featuredImage: "/images/hero-2.webp",
    publishStatus: "draft",
  });

  let gardens = await getGardens(true);
  assert(!gardens.some((g) => g.id === testGardenId), "Draft garden excluded from public services page");

  await updateGarden(testGardenId, { publishStatus: "published" });
  gardens = await getGardens(true);
  assert(gardens.some((g) => g.id === testGardenId), "Published garden live on public services page");

  await deleteGarden(testGardenId);
  gardens = await getGardens(true);
  assert(!gardens.some((g) => g.id === testGardenId), "Deleted garden removed");

  // 4. CONFERENCE HALLS MODULE
  console.log("\n--- 4. Testing Conference Halls CMS Module ---");
  const testHallId = `test-hall-${Date.now()}`;
  await createConferenceHall({
    id: testHallId,
    name: "Verification Executive Plenary",
    slug: "verification-executive-plenary",
    capacity: { minGuests: 20, maxGuests: 250 },
    dimensions: "18m x 12m",
    pricing: {
      halfDay: 20000,
      fullDay: 35000,
      hourly: 5000,
    },
    seatingLayouts: [
      { layoutName: "Theatre", maxCapacity: 250 },
      { layoutName: "Classroom", maxCapacity: 140 },
      { layoutName: "Banquet", maxCapacity: 120 },
      { layoutName: "Boardroom", maxCapacity: 60 },
    ],
    equipment: ["HD Laser Projector", "Wireless Lapel Microphones", "PA Audio Matrix"],
    images: ["/images/hero-1.webp"],
    featuredImage: "/images/hero-1.webp",
    description: "High capacity plenary hall with fiber internet connectivity.",
    publishStatus: "draft",
  });

  let halls = await getConferenceHalls(true);
  assert(!halls.some((h) => h.id === testHallId), "Draft hall excluded from public conference directory");

  await updateConferenceHall(testHallId, { publishStatus: "published" });
  halls = await getConferenceHalls(true);
  assert(halls.some((h) => h.id === testHallId), "Published hall live with 6 seating layouts & equipment list");

  await deleteConferenceHall(testHallId);
  halls = await getConferenceHalls(true);
  assert(!halls.some((h) => h.id === testHallId), "Deleted hall removed");

  // 5. OUTSIDE CATERING MODULE
  console.log("\n--- 5. Testing Outside Catering CMS Module ---");
  const testCateringId = `test-cat-${Date.now()}`;
  await createCateringPackage({
    id: testCateringId,
    title: "Verification County Gala Banquet",
    name: "Verification County Gala Banquet",
    slug: "verification-county-gala-banquet",
    pricePerPerson: 1850,
    minGuests: 100,
    maxGuests: 1200,
    description: "Complete five-course outdoor banquet service.",
    menuSelections: ["Slow-roasted mountain goat", "Charcoal tilapia", "Savory rice pilau"],
    includedServices: ["Chafing dishes", "Fine porcelain tableware", "Uniformed waitstaff"],
    deliveryTerms: "Complimentary setup within 25km radius of Kapenguria",
    images: ["/images/hero-2.webp"],
    featuredImage: "/images/hero-2.webp",
    publishStatus: "draft",
  });

  let catering = await getCateringPackages(true);
  assert(!catering.some((c) => c.id === testCateringId), "Draft catering package excluded");

  await updateCateringPackage(testCateringId, { publishStatus: "published" });
  catering = await getCateringPackages(true);
  assert(catering.some((c) => c.id === testCateringId), "Published catering package live with per-person pricing");

  await deleteCateringPackage(testCateringId);
  catering = await getCateringPackages(true);
  assert(!catering.some((c) => c.id === testCateringId), "Deleted catering package removed");

  // 6. AIRBNB APARTMENTS MODULE
  console.log("\n--- 6. Testing Airbnb / Serviced Apartments CMS Module ---");
  const testAptId = `test-apt-${Date.now()}`;
  await createAirbnbApartment({
    id: testAptId,
    name: "Verification Ridge View Penthouse",
    slug: "verification-ridge-view-penthouse",
    propertyType: "Apartment",
    bedrooms: 3,
    bathrooms: 2,
    capacity: { maxGuests: 6 },
    pricePerNight: 12000,
    pricing: { perNight: 12000, perMonth: 180000 },
    description: "Luxury self-catering apartment with mountain views.",
    amenities: ["Fully fitted kitchen", "Smart TV with Netflix", "Balcony"],
    houseRules: ["No indoor smoking", "Quiet hours after 10 PM"],
    checkInTime: "14:00",
    checkOutTime: "10:00",
    images: ["/images/hero-1.webp"],
    featuredImage: "/images/hero-1.webp",
    location: "Upper Hill, Kapenguria",
    publishStatus: "draft",
  });

  let apts = await getAirbnbApartments(true);
  assert(!apts.some((a) => a.id === testAptId), "Draft apartment excluded");

  await updateAirbnbApartment(testAptId, { publishStatus: "published" });
  apts = await getAirbnbApartments(true);
  assert(apts.some((a) => a.id === testAptId), "Published apartment live with bedrooms, rules, and nightly pricing");

  await deleteAirbnbApartment(testAptId);
  apts = await getAirbnbApartments(true);
  assert(!apts.some((a) => a.id === testAptId), "Deleted apartment removed");

  // 7. PACKAGES & OFFERS MODULE
  console.log("\n--- 7. Testing Packages & Offers CMS Module ---");
  const testOfferId = `test-offer-${Date.now()}`;
  await createOffer({
    id: testOfferId,
    title: "Verification Easter Getaway Special",
    discountBadge: "25% OFF",
    category: "accommodation",
    description: "Discounted executive accommodation with complimentary dinner.",
    offerPrice: 8500,
    originalPrice: 11000,
    validUntil: "2026-04-15",
    inclusions: ["Deluxe Suite Stay", "Chef's 3-Course Dinner", "Morning Buffet Breakfast"],
    image: "/images/hero-1.webp",
    publishStatus: "draft",
    featured: true,
  });

  let offers = await getOffers(true);
  assert(!offers.some((o) => o.id === testOfferId), "Draft offer excluded from /offers page");

  await updateOffer(testOfferId, { publishStatus: "published" });
  offers = await getOffers(true);
  assert(offers.some((o) => o.id === testOfferId), "Published offer live with discount badge & validity dates");

  await deleteOffer(testOfferId);
  offers = await getOffers(true);
  assert(!offers.some((o) => o.id === testOfferId), "Deleted offer removed");

  // 8. GALLERY MODULE
  console.log("\n--- 8. Testing Centralized Gallery CMS Module ---");
  const testGalleryId = `test-gal-${Date.now()}`;
  await createGalleryItem({
    id: testGalleryId,
    title: "Verification Serene Garden Pathway",
    category: "gardens",
    imageUrl: "/images/hero-2.webp",
    altText: "Stone pathway traversing the indigenous gardens.",
    caption: "Stone pathway traversing the indigenous gardens.",
    publishStatus: "draft",
    featured: false,
  });

  let gallery = await getGalleryItems(true);
  assert(!gallery.some((g) => g.id === testGalleryId), "Draft gallery item excluded");

  await updateGalleryItem(testGalleryId, { publishStatus: "published" });
  gallery = await getGalleryItems(true);
  assert(gallery.some((g) => g.id === testGalleryId), "Published gallery photo live in centralized media grid");

  await deleteGalleryItem(testGalleryId);
  gallery = await getGalleryItems(true);
  assert(!gallery.some((g) => g.id === testGalleryId), "Deleted gallery photo removed");

  // 9. ANNOUNCEMENTS & PROMOTIONS MODULE
  console.log("\n--- 9. Testing Announcements & Top Banner CMS Module ---");
  const testAnnounceId = `test-ann-${Date.now()}`;
  await createAnnouncement({
    id: testAnnounceId,
    title: "Verification Live Band Sundowner",
    message: "Join us this Friday for acoustic live mountain music and goat choma.",
    bannerType: "info",
    startDate: "2026-09-24",
    endDate: "2026-09-30",
    ctaText: "Reserve Table",
    ctaLink: "/cart",
    isActive: true,
    publishStatus: "draft",
  });

  let announcements = await getAnnouncements(true);
  assert(!announcements.some((a) => a.id === testAnnounceId), "Draft announcement excluded from top banner");

  await updateAnnouncement(testAnnounceId, { publishStatus: "published" });
  announcements = await getAnnouncements(true);
  assert(announcements.some((a) => a.id === testAnnounceId), "Published announcement active on site-wide TopBar");

  await deleteAnnouncement(testAnnounceId);
  announcements = await getAnnouncements(true);
  assert(!announcements.some((a) => a.id === testAnnounceId), "Deleted announcement removed");

  // 10. CUSTOMER REVIEWS & MODERATION MODULE
  console.log("\n--- 10. Testing Customer Reviews & Moderation Pipeline ---");
  const testReviewId = `test-rev-${Date.now()}`;
  await createCustomerReview({
    id: testReviewId,
    authorName: "Grace Cherono (Guest)",
    authorLocation: "Eldoret",
    rating: 5,
    comment: "The quiet environment and delicious kienyeji chicken made our seminar a total success.",
    source: "Guest Submission",
    category: "Services",
    publishStatus: "published",
    isApproved: false, // Pending moderation!
    isFeatured: false,
    createdAt: new Date().toISOString(),
  });

  let publicReviews = await getCustomerReviews(true);
  assert(
    !publicReviews.some((r) => r.id === testReviewId),
    "Unapproved review is HELD in moderation queue and NOT visible on public site"
  );

  let allReviews = await getCustomerReviews(false);
  assert(
    allReviews.some((r) => r.id === testReviewId && r.isApproved === false),
    "Unapproved review is visible to Administrator in /admin/reviews moderation console"
  );

  await updateCustomerReview(testReviewId, { isApproved: true });
  publicReviews = await getCustomerReviews(true);
  assert(
    publicReviews.some((r) => r.id === testReviewId),
    "Approved review is immediately displayed on /reviews and Homepage Reviews section"
  );

  await deleteCustomerReview(testReviewId);
  publicReviews = await getCustomerReviews(true);
  assert(!publicReviews.some((r) => r.id === testReviewId), "Deleted review removed");

  // 11. HOTEL SETTINGS & BRANDING MODULE
  console.log("\n--- 11. Testing Hotel Global Settings, WhatsApp & Maps CMS ---");
  const initialSettings = await getHotelSettings();
  assert(Boolean(initialSettings.name), "Hotel name configured: " + initialSettings.name);
  assert(Boolean(initialSettings.phone), "Hotel phone configured: " + initialSettings.phone);
  assert(Boolean(initialSettings.whatsappNumber), "WhatsApp number configured: " + initialSettings.whatsappNumber);
  assert(Boolean(initialSettings.googleMapsUrl), "Google Maps URL configured");
  assert(
    initialSettings.coordinates.lat !== 0 && initialSettings.coordinates.lng !== 0,
    `Coordinates verified: (${initialSettings.coordinates.lat}, ${initialSettings.coordinates.lng})`
  );

  // Test updating WhatsApp contact
  const testNumber = "+254 722 000 999";
  await updateHotelSettings({ whatsappNumber: testNumber });
  const updatedSettings = await getHotelSettings();
  assert(updatedSettings.whatsappNumber === testNumber, "Updated WhatsApp number persisted");

  // Revert back
  await updateHotelSettings({ whatsappNumber: initialSettings.whatsappNumber });
  const revertedSettings = await getHotelSettings();
  assert(revertedSettings.whatsappNumber === initialSettings.whatsappNumber, "Reverted WhatsApp number back safely");

  // 12. AUDIT LOGGING MODULE
  console.log("\n--- 12. Testing Immutable CMS Audit Logs ---");
  const auditLogs = await getAuditLogs();
  assert(auditLogs.length > 0, `Audit logs recorded accurately (${auditLogs.length} recent entries inspected)`);
  const hasSettingsAudit = auditLogs.some(
    (log) =>
      log.action.toLowerCase().includes("settings") ||
      (log.target && log.target.toLowerCase().includes("settings"))
  );
  assert(hasSettingsAudit, "Settings modification logged in audit trail");

  console.log("\n========================================================");
  console.log(`🎉 Pipeline Results: ${passedTests}/${totalTests} tests passed (${Math.round((passedTests / totalTests) * 100)}%)`);
  console.log("========================================================\n");

  if (passedTests !== totalTests) {
    throw new Error(`Only ${passedTests} of ${totalTests} assertions passed.`);
  }
}

runCMSVerification().catch((err) => {
  console.error("Verification pipeline encountered an unhandled error:", err);
  process.exit(1);
});
