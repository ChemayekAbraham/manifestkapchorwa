import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { UpdatePrayerRequestSchema } from "@/validators/prayer";
import { logAudit } from "@/lib/audit";
import { getClientIp } from "@/lib/rate-limit";

export async function PATCH(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || !hasPermission(session.role, "prayer:manage")) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
  }

  const { id } = await props.params;
  try {
    const body = await req.json();
    const validated = UpdatePrayerRequestSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json({ success: false, message: "Invalid payload" }, { status: 400 });
    }

    const updated = await prisma.prayerRequest.update({
      where: { id },
      data: validated.data,
    });

    await logAudit({
      userId: session.userId,
      userEmail: session.email,
      action: "PRAYER_REQUEST_UPDATED",
      entity: "PrayerRequest",
      entityId: id,
      metadata: validated.data,
      ipAddress: getClientIp(req),
    });

    return NextResponse.json({ success: true, message: "Prayer request updated", data: updated });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to update prayer request" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || !hasPermission(session.role, "prayer:manage")) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
  }

  const { id } = await props.params;
  try {
    await prisma.prayerRequest.delete({ where: { id } });

    await logAudit({
      userId: session.userId,
      userEmail: session.email,
      action: "PRAYER_REQUEST_DELETED",
      entity: "PrayerRequest",
      entityId: id,
      ipAddress: getClientIp(req),
    });

    return NextResponse.json({ success: true, message: "Prayer request deleted" });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to delete" }, { status: 500 });
  }
}
