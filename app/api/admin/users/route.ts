import { NextRequest, NextResponse } from "next/server";
import { getSession, hashPassword } from "@/lib/auth";
import { canManageUsers } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { CreateUserSchema } from "@/validators/auth";
import { logAudit } from "@/lib/audit";
import { getClientIp } from "@/lib/rate-limit";

export async function GET() {
  const session = await getSession();
  if (!session || !canManageUsers(session.role)) {
    return NextResponse.json({ success: false, message: "Super Administrator access required" }, { status: 403 });
  }

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: users });
  } catch {
    return NextResponse.json({ success: false, message: "Error fetching users" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || !canManageUsers(session.role)) {
    return NextResponse.json({ success: false, message: "Super Administrator access required" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const validated = CreateUserSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, message: "Validation error", errors: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({
      where: { email: validated.data.email.toLowerCase().trim() },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, message: "A user with this email address already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(validated.data.password);

    const user = await prisma.user.create({
      data: {
        name: validated.data.name.trim(),
        email: validated.data.email.toLowerCase().trim(),
        passwordHash,
        role: validated.data.role,
        active: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
        createdAt: true,
      },
    });

    await logAudit({
      userId: session.userId,
      userEmail: session.email,
      action: "USER_CREATED",
      entity: "User",
      entityId: user.id,
      metadata: { email: user.email, role: user.role },
      ipAddress: getClientIp(req),
    });

    return NextResponse.json({ success: true, message: "User account created successfully", data: user });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to create user" }, { status: 500 });
  }
}
