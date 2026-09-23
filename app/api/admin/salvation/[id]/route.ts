import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";
import { getClientIp } from "@/lib/rate-limit";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || !hasPermission(session.role, "people:edit")) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
  }

  const { id } = await params;

  try {
    const body = await req.json();
    const { fullName, phone, email, village, notes, category, status } = body;

    const existing = await prisma.person.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, message: "Record not found" }, { status: 404 });
    }

    const updated = await prisma.person.update({
      where: { id },
      data: {
        ...(fullName ? { fullName: fullName.trim() } : {}),
        ...(phone !== undefined ? { phone: phone ? phone.trim() : null } : {}),
        ...(email !== undefined ? { email: email ? email.trim().toLowerCase() : null } : {}),
        ...(village !== undefined ? { village: village ? village.trim() : null } : {}),
        ...(notes !== undefined ? { notes } : {}),
        ...(category ? { category } : {}),
        ...(status ? { status } : {}),
      },
    });

    await logAudit({
      userId: session.userId,
      userEmail: session.email,
      action: "CONVERT_UPDATED",
      entity: "Person",
      entityId: id,
      metadata: { fullName: updated.fullName, category: updated.category },
      ipAddress: getClientIp(req),
    });

    return NextResponse.json({
      success: true,
      message: category === "MEMBER" ? "Successfully transitioned to Full Member!" : "Salvation record updated",
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update record" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || !hasPermission(session.role, "people:delete")) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
  }

  const { id } = await params;

  try {
    const person = await prisma.person.findUnique({ where: { id } });
    if (!person) {
      return NextResponse.json({ success: false, message: "Record not found" }, { status: 404 });
    }

    await prisma.person.delete({ where: { id } });

    await logAudit({
      userId: session.userId,
      userEmail: session.email,
      action: "CONVERT_DELETED",
      entity: "Person",
      entityId: id,
      metadata: { fullName: person.fullName },
      ipAddress: getClientIp(req),
    });

    return NextResponse.json({ success: true, message: "Record deleted successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete record" },
      { status: 500 }
    );
  }
}
