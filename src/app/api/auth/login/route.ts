import { NextRequest, NextResponse } from "next/server";
import { signSessionToken } from "@/lib/auth-session";
import { DEMO_ACCOUNTS } from "@/lib/auth-accounts";
import { UserProfile } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, accountKey } = body;

    let targetUser: UserProfile | null = null;

    if (accountKey && DEMO_ACCOUNTS[accountKey]) {
      targetUser = DEMO_ACCOUNTS[accountKey];
    } else if (email) {
      const lower = email.toLowerCase().trim();
      for (const key of Object.keys(DEMO_ACCOUNTS)) {
        if (DEMO_ACCOUNTS[key].email.toLowerCase() === lower) {
          targetUser = DEMO_ACCOUNTS[key];
          break;
        }
      }
      if (!targetUser) {
        // Fallback user registration strictly defaults to guest role.
        // Administrative or staff roles can NEVER be claimed via arbitrary email substrings.
        targetUser = {
          id: "usr_" + Math.random().toString(36).substring(2, 9),
          name: email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase()),
          email: lower,
          role: "guest",
          createdAt: new Date().toISOString(),
        };
      }
    }

    if (!targetUser) {
      return NextResponse.json({ success: false, error: "Invalid login credentials" }, { status: 401 });
    }

    const token = signSessionToken(targetUser);

    const response = NextResponse.json({
      success: true,
      user: targetUser,
      token,
    });

    // Set secure HttpOnly cookie
    response.cookies.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
