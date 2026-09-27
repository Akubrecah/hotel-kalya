import { NextRequest, NextResponse } from "next/server";
import { getSessionUser, signSessionToken } from "@/lib/auth-session";
import { DEMO_ACCOUNTS } from "@/lib/auth-accounts";
import { UserProfile } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const user = getSessionUser(request);
    if (!user) {
      return NextResponse.json({ success: false, user: null }, { status: 401 });
    }
    return NextResponse.json({ success: true, user });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const currentUser = getSessionUser(request);

    let targetUser: UserProfile | null = null;

    // Case 1: Switching to a predefined valid demo account
    if (body.accountKey && DEMO_ACCOUNTS[body.accountKey]) {
      targetUser = DEMO_ACCOUNTS[body.accountKey];
    }
    // Case 2: Updating client preferences on an existing authenticated session
    else if (currentUser) {
      const updates = body.user || {};
      // Strictly prevent updating privilege fields: id, role, staffRole, permissions
      targetUser = {
        ...currentUser,
        name: updates.name ? String(updates.name).trim() : currentUser.name,
        phone: updates.phone !== undefined ? String(updates.phone).trim() : currentUser.phone,
        activeWorkspaceDepartment: updates.activeWorkspaceDepartment || currentUser.activeWorkspaceDepartment,
        dietaryPreferences: Array.isArray(updates.dietaryPreferences) ? updates.dietaryPreferences : currentUser.dietaryPreferences,
      };
    }
    // Case 3: Initial guest registration / session creation
    else if (body.isGuestRegistration && body.user) {
      const g = body.user;
      targetUser = {
        id: "usr_" + Math.random().toString(36).substring(2, 9),
        name: g.name ? String(g.name).trim() : "Guest",
        email: g.email ? String(g.email).toLowerCase().trim() : "guest@hotelkalya.com",
        phone: g.phone ? String(g.phone).trim() : undefined,
        role: "guest",
        createdAt: new Date().toISOString(),
      };
    }

    if (!targetUser) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Active session required to update profile." },
        { status: 401 }
      );
    }

    const token = signSessionToken(targetUser);

    const response = NextResponse.json({
      success: true,
      user: targetUser,
      token,
    });

    response.cookies.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
