import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { AdminUpdateTestimonySchema } from "@/validators/testimony";
import { logAudit } from "@/lib/audit";
import { getClientIp } from "@/lib/rate-limit";

export async function PATCH(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || !hasPermission(session.role, "testimonies:manage")) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
  }

  const { id } = await props.params;
  try {
    const body = await req.json();
    const validated = AdminUpdateTestimonySchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, message: "Validation error", errors: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const isApproval = validated.data.status === "APPROVED";

    const updated = await prisma.testimony.update({
      where: { id },
      data: {
        status: validated.data.status,
        ...(validated.data.name ? { name: validated.data.name.trim() } : {}),
        ...(validated.data.content ? { content: validated.data.content.trim() } : {}),
        reviewedBy: session.name,
        approvedAt: isApproval ? new Date() : undefined,
      },
    });

    await logAudit({
      userId: session.userId,
      userEmail: session.email,
      action: `TESTIMONY_${validated.data.status}`,
      entity: "Testimony",
      entityId: id,
      metadata: { status: validated.data.status },
      ipAddress: getClientIp(req),
    });

    return NextResponse.json({ success: true, message: "Testimony status updated", data: updated });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to update testimony" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || !hasPermission(session.role, "testimonies:manage")) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
  }

  const { id } = await props.params;
  try {
    await prisma.testimony.delete({ where: { id } });

    await logAudit({
      userId: session.userId,
      userEmail: session.email,
      action: "TESTIMONY_DELETED",
      entity: "Testimony",
      entityId: id,
      ipAddress: getClientIp(req),
    });

    return NextResponse.json({ success: true, message: "Testimony deleted" });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to delete" }, { status: 500 });
  }
}
