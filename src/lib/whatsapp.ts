import { ServiceContact } from "@/types/hospitality";

export interface WhatsAppInquiryContext {
  serviceKey: "accommodation" | "restaurant" | "conference" | "catering" | "garden" | "general";
  roomName?: string;
  roomNumber?: string;
  checkInDate?: string;
  checkOutDate?: string;
  guestsCount?: string | number;
  totalPrice?: number;
  tableNumber?: string;
  eventType?: string;
  clientName?: string;
  customMessage?: string;
}

// Fallback staff contacts if DB is initializing
export const DEFAULT_SERVICE_CONTACTS: Record<string, ServiceContact> = {
  accommodation: {
    id: "sc-01",
    serviceKey: "accommodation",
    serviceTitle: "Room Reservations Desk",
    department: "Front Office & Reservations",
    responsibleStaff: "Dennis Kiplagat",
    roleTitle: "Reservations Officer",
    whatsappNumber: "254719766649",
    email: "reservations@hotelkalya.com",
    phone: "+254 719 766649",
    availabilityHours: "24 Hours Daily",
    quickGreeting: "Hello Reservations Desk, I would like to inquire about room booking at Hotel Kalya.",
  },
  restaurant: {
    id: "sc-02",
    serviceKey: "restaurant",
    serviceTitle: "Restaurant & Dining Desk",
    department: "Food & Beverage",
    responsibleStaff: "Faith Jepchirchir",
    roleTitle: "Restaurant Service Lead",
    whatsappNumber: "254719766649",
    email: "dining@hotelkalya.com",
    phone: "+254 719 766649",
    availabilityHours: "6:30 AM – 10:00 PM Daily",
    quickGreeting: "Hello Kalya Dining, I would like to reserve a table / inquire about the restaurant menu.",
  },
  conference: {
    id: "sc-03",
    serviceKey: "conference",
    serviceTitle: "Conference & Seminar Facilities",
    department: "Corporate Events & Seminars",
    responsibleStaff: "Kevin Lokor",
    roleTitle: "Conference & Events Coordinator",
    whatsappNumber: "254719766649",
    email: "conferences@hotelkalya.com",
    phone: "+254 719 766649",
    availabilityHours: "7:30 AM – 7:00 PM Daily",
    quickGreeting: "Hello Conference Coordinator, I would like to request availability and quote for our upcoming workshop.",
  },
  catering: {
    id: "sc-04",
    serviceKey: "catering",
    serviceTitle: "Outside Catering Services",
    department: "Catering Operations",
    responsibleStaff: "Grace Chepkorir",
    roleTitle: "Outside Catering Operations Manager",
    whatsappNumber: "254719766649",
    email: "catering@hotelkalya.com",
    phone: "+254 719 766649",
    availabilityHours: "8:00 AM – 6:00 PM Daily",
    quickGreeting: "Hello Catering Team, I would like to discuss outside catering for our upcoming event in West Pokot.",
  },
  garden: {
    id: "sc-05",
    serviceKey: "garden",
    serviceTitle: "Garden Experience & Photoshoots",
    department: "Grounds & Events",
    responsibleStaff: "Kevin Lokor",
    roleTitle: "Events & Grounds Coordinator",
    whatsappNumber: "254719766649",
    email: "gardens@hotelkalya.com",
    phone: "+254 719 766649",
    availabilityHours: "8:00 AM – 6:30 PM Daily",
    quickGreeting: "Hello Kalya Gardens, I would like to book the lush garden grounds for our photography session / private party.",
  },
  general: {
    id: "sc-06",
    serviceKey: "general",
    serviceTitle: "General Hotel Reception",
    department: "Executive Management",
    responsibleStaff: "Sarah Rotich",
    roleTitle: "Front Office Duty Manager",
    whatsappNumber: "254719766649",
    email: "hotelkalya@gmail.com",
    phone: "+254 719 766649",
    availabilityHours: "24 Hours Daily",
    quickGreeting: "Hello Hotel Kalya Reception, I have a general inquiry.",
  },
};

/**
 * Builds a structured, context-rich WhatsApp consultation link
 */
export function buildContextualWhatsAppUrl(
  context: WhatsAppInquiryContext,
  serviceContact?: ServiceContact
): string {
  const contact = serviceContact || DEFAULT_SERVICE_CONTACTS[context.serviceKey] || DEFAULT_SERVICE_CONTACTS.general;
  const cleanPhone = contact.whatsappNumber.replace(/[^0-9]/g, "");

  let message = `*Hotel Kalya Consultation Request*\n`;
  message += `Attn: ${contact.responsibleStaff} (${contact.roleTitle} — ${contact.department})\n\n`;

  if (context.roomName) {
    message += `🏨 *Accommodation:* ${context.roomName}${context.roomNumber ? ` (Room ${context.roomNumber})` : ""}\n`;
  }

  if (context.checkInDate && context.checkOutDate) {
    message += `📅 *Dates:* ${context.checkInDate} to ${context.checkOutDate}\n`;
  } else if (context.checkInDate) {
    message += `📅 *Date:* ${context.checkInDate}\n`;
  }

  if (context.guestsCount) {
    message += `👥 *Guests / Capacity:* ${context.guestsCount}\n`;
  }

  if (context.totalPrice) {
    message += `💰 *Quoted Rate:* KES ${context.totalPrice.toLocaleString()}\n`;
  }

  if (context.eventType) {
    message += `🎉 *Event Type:* ${context.eventType}\n`;
  }

  if (context.tableNumber) {
    message += `🍽️ *Table:* ${context.tableNumber}\n`;
  }

  if (context.clientName) {
    message += `👤 *Client / Inquirer:* ${context.clientName}\n`;
  }

  if (context.customMessage) {
    message += `\n💬 *Details / Question:*\n${context.customMessage}\n`;
  } else {
    message += `\nCould you please verify availability, confirm rates, and provide guidance on completing our reservation?\n`;
  }

  message += `\n_Sent via Hotel Kalya Kapenguria Digital Platform_`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
