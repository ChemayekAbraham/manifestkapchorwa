import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { EventsService } from "@/services/events.service";
import { EventSchema } from "@/validators/event";
import { logAudit } from "@/lib/audit";
import { getClientIp } from "@/lib/rate-limit";

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || !hasPermission(session.role, "events:view")) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
  }

  const { id } = await props.params;
  const event = await EventsService.getById(id);

  if (!event) {
    return NextResponse.json({ success: false, message: "Event not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: event });
}

export async function PATCH(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || !hasPermission(session.role, "events:manage")) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
  }

  const { id } = await props.params;
  try {
    const body = await req.json();
    const validated = EventSchema.partial().safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, message: "Validation error", errors: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const updated = await EventsService.update(id, validated.data);

    await logAudit({
      userId: session.userId,
      userEmail: session.email,
      action: "EVENT_UPDATED",
      entity: "Event",
      entityId: id,
      ipAddress: getClientIp(req),
    });

    return NextResponse.json({ success: true, message: "Event updated", data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message || "Failed to update event" }, { status: 400 });
  }
}

export async function DELETE(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || !hasPermission(session.role, "events:manage")) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
  }

  const { id } = await props.params;
  try {
    await EventsService.delete(id);

    await logAudit({
      userId: session.userId,
      userEmail: session.email,
      action: "EVENT_DELETED",
      entity: "Event",
      entityId: id,
      ipAddress: getClientIp(req),
    });

    return NextResponse.json({ success: true, message: "Event deleted" });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to delete event" }, { status: 500 });
  }
}
