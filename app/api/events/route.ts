import { NextResponse } from "next/server";
import { EventsService } from "@/services/events.service";

export async function GET() {
  try {
    const events = await EventsService.listUpcoming(20, true);
    return NextResponse.json({ success: true, data: events });
  } catch {
    return NextResponse.json({ success: false, message: "Error fetching events" }, { status: 500 });
  }
}
