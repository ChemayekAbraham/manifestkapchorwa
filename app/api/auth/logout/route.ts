import { NextResponse } from "next/server";
import { clearSessionCookie, getSession } from "@/lib/auth";
import { logAudit } from "@/lib/audit";

export async function POST() {
  const session = await getSession();
  if (session) {
    await logAudit({
      userId: session.userId,
      userEmail: session.email,
      action: "USER_LOGOUT",
      entity: "User",
      entityId: session.userId,
    });
  }

  await clearSessionCookie();
  return NextResponse.json({ success: true, message: "Logged out successfully" });
}
