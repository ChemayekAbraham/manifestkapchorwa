import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { EventsService } from "@/services/events.service";
import { AttendanceMarkSchema, BatchAttendanceSchema } from "@/validators/event";
import { logAudit } from "@/lib/audit";
import { getClientIp } from "@/lib/rate-limit";

export async function POST(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || !hasPermission(session.role, "attendance:mark")) {
    return NextResponse.json({ success: false, message: "Unauthorized to mark attendance" }, { status: 403 });
  }

  const { id: eventId } = await props.params;

  try {
    const body = await req.json();

    // Check if batch
    if (body.attendance && Array.isArray(body.attendance)) {
      const validatedBatch = BatchAttendanceSchema.safeParse(body);
      if (!validatedBatch.success) {
        return NextResponse.json(
          { success: false, message: "Invalid batch payload", errors: validatedBatch.error.flatten().fieldErrors },
          { status: 400 }
        );
      }

      await EventsService.batchMarkAttendance(eventId, validatedBatch.data.attendance);

      await logAudit({
        userId: session.userId,
        userEmail: session.email,
        action: "ATTENDANCE_BATCH_MARKED",
        entity: "EventAttendance",
        entityId: eventId,
        metadata: { count: validatedBatch.data.attendance.length },
        ipAddress: getClientIp(req),
      });

      return NextResponse.json({ success: true, message: "Attendance updated successfully" });
    }

    // Single record mark
    const validated = AttendanceMarkSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { success: false, message: "Invalid attendance data", errors: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const rec = await EventsService.markAttendance(eventId, validated.data);

    await logAudit({
      userId: session.userId,
      userEmail: session.email,
      action: "ATTENDANCE_MARKED",
      entity: "EventAttendance",
      entityId: rec.id,
      metadata: { eventId, personId: validated.data.personId, status: validated.data.status },
      ipAddress: getClientIp(req),
    });

    return NextResponse.json({ success: true, message: "Attendance recorded", data: rec });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message || "Failed to mark attendance" }, { status: 400 });
  }
}
