import { NextRequest, NextResponse } from "next/server";
import { getSession, hashPassword } from "@/lib/auth";
import { canManageUsers } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { UpdateUserSchema } from "@/validators/auth";
import { logAudit } from "@/lib/audit";
import { getClientIp } from "@/lib/rate-limit";

export async function PATCH(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || !canManageUsers(session.role)) {
    return NextResponse.json({ success: false, message: "Super Administrator access required" }, { status: 403 });
  }

  const { id } = await props.params;

  try {
    const body = await req.json();
    const validated = UpdateUserSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, message: "Validation error", errors: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (validated.data.name) updateData.name = validated.data.name.trim();
    if (validated.data.email) updateData.email = validated.data.email.toLowerCase().trim();
    if (validated.data.role) updateData.role = validated.data.role;
    if (validated.data.active !== undefined) updateData.active = validated.data.active;
    if (validated.data.password) {
      updateData.passwordHash = await hashPassword(validated.data.password);
    }

    const updated = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
        updatedAt: true,
      },
    });

    await logAudit({
      userId: session.userId,
      userEmail: session.email,
      action: "USER_UPDATED",
      entity: "User",
      entityId: id,
      metadata: { email: updated.email, role: updated.role, active: updated.active },
      ipAddress: getClientIp(req),
    });

    return NextResponse.json({ success: true, message: "User updated successfully", data: updated });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || !canManageUsers(session.role)) {
    return NextResponse.json({ success: false, message: "Super Administrator access required" }, { status: 403 });
  }

  const { id } = await props.params;

  if (session.userId === id) {
    return NextResponse.json({ success: false, message: "You cannot delete your own account" }, { status: 400 });
  }

  try {
    await prisma.user.delete({ where: { id } });

    await logAudit({
      userId: session.userId,
      userEmail: session.email,
      action: "USER_DELETED",
      entity: "User",
      entityId: id,
      ipAddress: getClientIp(req),
    });

    return NextResponse.json({ success: true, message: "User account deleted" });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to delete user" }, { status: 500 });
  }
}
