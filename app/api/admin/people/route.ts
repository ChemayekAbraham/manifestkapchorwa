import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { PeopleService } from "@/services/people.service";
import { PersonFilterSchema, PersonSchema } from "@/validators/person";
import { logAudit } from "@/lib/audit";
import { getClientIp } from "@/lib/rate-limit";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session || !hasPermission(session.role, "people:view")) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const rawParams = Object.fromEntries(searchParams.entries());
  const validated = PersonFilterSchema.safeParse(rawParams);

  if (!validated.success) {
    return NextResponse.json(
      { success: false, message: "Invalid filter parameters", errors: validated.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  try {
    const data = await PeopleService.list(validated.data);
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ success: false, message: "Error fetching people list" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || !hasPermission(session.role, "people:create")) {
    return NextResponse.json({ success: false, message: "Unauthorized to create records" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const validated = PersonSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, message: "Validation error", errors: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const person = await PeopleService.create(validated.data);

    await logAudit({
      userId: session.userId,
      userEmail: session.email,
      action: "PERSON_CREATED",
      entity: "Person",
      entityId: person.id,
      metadata: { fullName: person.fullName, category: person.category },
      ipAddress: getClientIp(req),
    });

    return NextResponse.json({ success: true, message: "Member created successfully", data: person });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message || "Failed to create person" }, { status: 400 });
  }
}
