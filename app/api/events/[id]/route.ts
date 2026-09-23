import { NextRequest, NextResponse } from "next/server";
import { EventsService } from "@/services/events.service";

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;
    const event = await EventsService.getById(id);

    if (!event || !event.published) {
      return NextResponse.json({ success: false, message: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: event.id,
        name: event.name,
        date: event.date,
        location: event.location,
        description: event.description,
      },
    });
  } catch {
    return NextResponse.json({ success: false, message: "Error loading event" }, { status: 500 });
  }
}
