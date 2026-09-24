import { NextResponse } from "next/server";
import { FoodOrder, OrderType } from "@/types";
import { authorizeApiRequest, sanitizeOrderForKitchen } from "@/lib/rbac";
import { logAuditEvent } from "@/lib/db";

const DEFAULT_ORDERS: FoodOrder[] = [
  {
    id: "ORD-938210",
    customerName: "James Chemosit",
    customerPhone: "+254 712 345678",
    orderType: "room_delivery",
    roomOrTableNumber: "Suite 204",
    specialNotes: "Extra chili sauce on the side please.",
    subtotal: 2700,
    serviceFee: 150,
    total: 2850,
    status: "delivered",
    createdAt: "2026-09-22T19:45:00Z",
    items: [
      {
        menuItem: {
          id: "dish_01",
          name: "Kapenguria Kienyeji Chicken Special",
          description: "Free-range local organic chicken stewed in aromatic herbs and indigenous greens.",
          price: 1400,
          category: "lunch",
          categoryLabel: "Lunch & Dinner",
          image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=800&q=80",
          available: true,
          dietary: ["Chef Special", "Farm to Table"],
        },
        quantity: 1,
      },
      {
        menuItem: {
          id: "dish_03",
          name: "Fresh Tilapia Wet Fry",
          description: "Whole fresh Lake Victoria Tilapia pan-fried with sweet peppers, ripe tomatoes, and coriander.",
          price: 1100,
          category: "lunch",
          categoryLabel: "Lunch & Dinner",
          image: "https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&w=800&q=80",
          available: true,
          dietary: ["Halal"],
        },
        quantity: 1,
      },
      {
        menuItem: {
          id: "dish_08",
          name: "Kalya Spiced Masala Chai",
          description: "Kenyan highland black tea infused with ginger, cardamom, cinnamon, and fresh local milk.",
          price: 200,
          category: "drinks",
          categoryLabel: "Drinks & Refreshments",
          image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80",
          available: true,
        },
        quantity: 1,
      },
    ],
  },
  {
    id: "ORD-519283",
    customerName: "County Health Delegation",
    customerPhone: "+254 722 889911",
    orderType: "dine_in",
    roomOrTableNumber: "Conference Hall A / Table 4",
    specialNotes: "Deliver during 10:30 AM tea break.",
    subtotal: 4800,
    serviceFee: 200,
    total: 5000,
    status: "preparing",
    createdAt: "2026-09-23T09:10:00Z",
    items: [
      {
        menuItem: {
          id: "dish_05",
          name: "Kalya Executive Farmhouse Breakfast",
          description: "Farm eggs, grilled beef sausages, bacon, roasted tomato, hash brown, toasted bread, and tea.",
          price: 950,
          category: "breakfast",
          categoryLabel: "Breakfast",
          image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=800&q=80",
          available: true,
        },
        quantity: 4,
      },
      {
        menuItem: {
          id: "dish_06",
          name: "Coastal Mahamri & Spicy Viazi",
          description: "Three cardamom-scented coconut doughnuts served with mildly curried potato chunks.",
          price: 500,
          category: "breakfast",
          categoryLabel: "Breakfast",
          image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80",
          available: true,
          dietary: ["Vegetarian"],
        },
        quantity: 2,
      },
    ],
  },
  {
    id: "ORD-410982",
    customerName: "David Kiprop",
    customerPhone: "+254 733 456123",
    orderType: "room_delivery",
    roomOrTableNumber: "Cottage 3",
    specialNotes: "Please bring forks and extra napkins.",
    subtotal: 3200,
    serviceFee: 150,
    total: 3350,
    status: "received",
    createdAt: "2026-09-23T12:30:00Z",
    items: [
      {
        menuItem: {
          id: "dish_02",
          name: "Kapenguria Prime Goat Nyama Choma",
          description: "Succulent charcoal-grilled West Pokot highland goat ribs served with kachumbari and ugali.",
          price: 1600,
          category: "dinner",
          categoryLabel: "Lunch & Dinner",
          image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
          available: true,
          dietary: ["Chef Special"],
        },
        quantity: 2,
      },
    ],
  },
];

const globalStore = global as unknown as { __hotel_kalya_orders?: FoodOrder[] };
if (!globalStore.__hotel_kalya_orders) {
  globalStore.__hotel_kalya_orders = [...DEFAULT_ORDERS];
}

export async function GET(request: Request) {
  const auth = authorizeApiRequest(request, "view_orders", [
    "KITCHEN",
    "SERVICE",
    "MANAGEMENT",
    "EXECUTIVE",
  ]);

  if (!auth.authorized) {
    await logAuditEvent({
      userId: auth.user?.id || "unauthorized_caller",
      userName: auth.user?.name || "Unknown Caller",
      role: auth.user?.staffRole || "UNKNOWN",
      department: auth.user?.department || "UNKNOWN",
      action: "UNAUTHORIZED_ORDERS_ACCESS",
      target: "/api/orders",
      details: auth.error || "Blocked cross-department food order access.",
      status: "DENIED",
    });
    return NextResponse.json(
      { success: false, error: auth.error },
      { status: auth.status }
    );
  }

  const { searchParams } = new URL(request.url);
  const statusFilter = searchParams.get("status");

  let orders = globalStore.__hotel_kalya_orders || DEFAULT_ORDERS;

  if (statusFilter && statusFilter !== "all") {
    orders = orders.filter((o) => o.status === statusFilter);
  }

  // Data Privacy: If kitchen/chef personnel, sanitize to operational details only
  const isChefOrKitchen =
    auth.user?.staffRole === "CHEF" ||
    auth.user?.department?.toUpperCase().includes("KITCHEN");

  const sanitizedOrders = isChefOrKitchen
    ? orders.map(sanitizeOrderForKitchen)
    : orders;

  return NextResponse.json({
    success: true,
    total: sanitizedOrders.length,
    orders: sanitizedOrders,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Cart is empty. Please select menu items." },
        { status: 400 }
      );
    }

    if (!body.customerName || !body.customerPhone) {
      return NextResponse.json(
        { success: false, error: "Customer name and phone number are required." },
        { status: 400 }
      );
    }

    const orderId = "ORD-" + Math.floor(100000 + Math.random() * 900000);
    const subtotal = Number(body.subtotal) || 0;
    const serviceFee = Number(body.serviceFee) || 150;
    const total = Number(body.total) || subtotal + serviceFee;

    const newOrder: FoodOrder = {
      id: orderId,
      items: body.items,
      orderType: (body.orderType as OrderType) || "room_delivery",
      customerName: body.customerName.trim(),
      customerPhone: body.customerPhone.trim(),
      roomOrTableNumber: body.roomOrTableNumber || "TBD",
      specialNotes: body.specialNotes || "",
      subtotal,
      serviceFee,
      total,
      status: "received",
      createdAt: new Date().toISOString(),
    };

    if (!globalStore.__hotel_kalya_orders) {
      globalStore.__hotel_kalya_orders = [...DEFAULT_ORDERS];
    }
    globalStore.__hotel_kalya_orders.unshift(newOrder);

    return NextResponse.json(
      {
        success: true,
        message: "Order successfully received by the kitchen.",
        order: newOrder,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const auth = authorizeApiRequest(request, "update_order", [
      "KITCHEN",
      "SERVICE",
      "MANAGEMENT",
      "EXECUTIVE",
    ]);

    if (!auth.authorized) {
      await logAuditEvent({
        userId: auth.user?.id || "unauthorized_caller",
        userName: auth.user?.name || "Unknown Caller",
        role: auth.user?.staffRole || "UNKNOWN",
        department: auth.user?.department || "UNKNOWN",
        action: "UNAUTHORIZED_ORDER_STATUS_UPDATE",
        target: "/api/orders",
        details: auth.error || "Blocked cross-department order modification.",
        status: "DENIED",
      });
      return NextResponse.json(
        { success: false, error: auth.error },
        { status: auth.status }
      );
    }

    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: "Order ID and target status are required." },
        { status: 400 }
      );
    }

    const orders = globalStore.__hotel_kalya_orders || DEFAULT_ORDERS;
    const order = orders.find((o) => o.id === id);

    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found." }, { status: 404 });
    }

    order.status = status;

    await logAuditEvent({
      userId: auth.user?.id || "staff",
      userName: auth.user?.name || "Kitchen Staff",
      role: auth.user?.staffRole || "CHEF",
      department: auth.user?.department || "Kitchen",
      action: "UPDATE_ORDER_STATUS",
      target: `Order ${id}`,
      details: `Status updated to ${status}`,
      status: "SUCCESS",
    });

    return NextResponse.json({
      success: true,
      message: `Order ${id} status updated to ${status}.`,
      order,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
