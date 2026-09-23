import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { DevotionsService } from "@/services/devotions.service";
import { DevotionSchema } from "@/validators/devotion";
import { logAudit } from "@/lib/audit";
import { getClientIp } from "@/lib/rate-limit";

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || !hasPermission(session.role, "devotions:view")) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
  }

  const { id } = await props.params;
  const devotion = await DevotionsService.getById(id);

  if (!devotion) {
    return NextResponse.json({ success: false, message: "Devotion not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: devotion });
}

export async function PATCH(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || !hasPermission(session.role, "devotions:manage")) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
  }

  const { id } = await props.params;
  try {
    const body = await req.json();
    const validated = DevotionSchema.partial().safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, message: "Validation error", errors: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const updated = await DevotionsService.update(id, validated.data);

    await logAudit({
      userId: session.userId,
      userEmail: session.email,
      action: "DEVOTION_UPDATED",
      entity: "Devotion",
      entityId: id,
      metadata: validated.data as Record<string, unknown>,
      ipAddress: getClientIp(req),
    });

    return NextResponse.json({ success: true, message: "Devotion updated", data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message || "Failed to update devotion" }, { status: 400 });
  }
}

export async function DELETE(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || !hasPermission(session.role, "devotions:manage")) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
  }

  const { id } = await props.params;
  try {
    await DevotionsService.delete(id);

    await logAudit({
      userId: session.userId,
      userEmail: session.email,
      action: "DEVOTION_DELETED",
      entity: "Devotion",
      entityId: id,
      ipAddress: getClientIp(req),
    });

    return NextResponse.json({ success: true, message: "Devotion deleted" });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to delete devotion" }, { status: 500 });
  }
}
