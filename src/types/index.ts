// =============================================================================
// Hotel Kalya — Unified TypeScript Interfaces
// =============================================================================

export type MenuCategory = 
  | "breakfast"
  | "lunch"
  | "dinner"
  | "drinks"
  | "specials";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number; // in KES
  category: MenuCategory;
  categoryLabel: string;
  image: string;
  dietary?: ("Vegetarian" | "Halal" | "Chef Special" | "Farm to Table" | "Spicy" | "Gluten-Free")[];
  prepTime?: string;
  available: boolean;
  featured?: boolean;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  specialInstructions?: string;
}

export type OrderType = "room_delivery" | "dine_in" | "takeaway";

export interface FoodOrder {
  id: string;
  items: CartItem[];
  orderType: OrderType;
  customerName: string;
  customerPhone: string;
  roomOrTableNumber?: string;
  specialNotes?: string;
  subtotal: number;
  serviceFee: number;
  total: number;
  status: "received" | "preparing" | "ready" | "delivered" | "cancelled";
  createdAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "guest" | "staff" | "admin";
  staffRole?: string;
  department?: string;
  permissions?: string[];
  dietaryPreferences?: string[];
  createdAt: string;
}

export interface Reservation {
  id: string;
  service: "accommodation" | "conference" | "dining" | "catering" | "garden" | "airbnb";
  serviceTitle: string;
  date: string;
  endDate?: string;
  guests: number;
  roomType?: string;
  specialRequests?: string;
  status: "confirmed" | "pending" | "completed" | "cancelled";
  totalEstimatedPrice?: number;
  createdAt: string;
}

export interface ReviewItem {
  id: string;
  author: string;
  rating: number; // 1 to 5
  date: string;
  text: string;
  source: "Google" | "Website" | "Verified Guest";
  service?: string;
  verified?: boolean;
}
