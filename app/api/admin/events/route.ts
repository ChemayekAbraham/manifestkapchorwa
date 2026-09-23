import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { EventsService } from "@/services/events.service";
import { EventSchema } from "@/validators/event";
import { logAudit } from "@/lib/audit";
import { getClientIp } from "@/lib/rate-limit";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session || !hasPermission(session.role, "events:view")) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "20", 10);

  try {
    const data = await EventsService.listAll(page, pageSize);
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ success: false, message: "Error loading events" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || !hasPermission(session.role, "events:manage")) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const validated = EventSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, message: "Validation error", errors: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const event = await EventsService.create(validated.data);

    await logAudit({
      userId: session.userId,
      userEmail: session.email,
      action: "EVENT_CREATED",
      entity: "Event",
      entityId: event.id,
      metadata: { name: event.name, date: event.date },
      ipAddress: getClientIp(req),
    });

    return NextResponse.json({ success: true, message: "Event created successfully", data: event });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message || "Failed to create event" }, { status: 400 });
  }
}
