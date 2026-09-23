import { NextRequest, NextResponse } from "next/server";
import { authenticateCredentials, setSessionCookie } from "@/lib/auth";
import { LoginSchema } from "@/validators/auth";
import { logAudit } from "@/lib/audit";
import { getClientIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = LoginSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password format", errors: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { email, password } = validated.data;
    const user = await authenticateCredentials(email, password);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    await setSessionCookie({
      userId: user.userId,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const ip = getClientIp(req);
    await logAudit({
      userId: user.userId,
      userEmail: user.email,
      action: "USER_LOGIN",
      entity: "User",
      entityId: user.userId,
      ipAddress: ip,
    });

    return NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        id: user.userId,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred during login" },
      { status: 500 }
    );
  }
}
