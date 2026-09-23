import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { hasPermission, canPermanentDelete } from "@/lib/permissions";
import { PeopleService } from "@/services/people.service";
import { PersonSchema } from "@/validators/person";
import { logAudit } from "@/lib/audit";
import { getClientIp } from "@/lib/rate-limit";

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || !hasPermission(session.role, "people:view")) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
  }

  const { id } = await props.params;
  const person = await PeopleService.getById(id);

  if (!person) {
    return NextResponse.json({ success: false, message: "Person not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: person });
}

export async function PATCH(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || !hasPermission(session.role, "people:edit")) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
  }

  const { id } = await props.params;
  try {
    const body = await req.json();
    const validated = PersonSchema.partial().safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, message: "Validation error", errors: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const updated = await PeopleService.update(id, validated.data);

    await logAudit({
      userId: session.userId,
      userEmail: session.email,
      action: "PERSON_UPDATED",
      entity: "Person",
      entityId: id,
      metadata: validated.data as Record<string, unknown>,
      ipAddress: getClientIp(req),
    });

    return NextResponse.json({ success: true, message: "Member updated successfully", data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message || "Failed to update" }, { status: 400 });
  }
}

export async function DELETE(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await props.params;
  const { searchParams } = new URL(req.url);
  const isPermanent = searchParams.get("permanent") === "true";

  if (isPermanent) {
    if (!canPermanentDelete(session.role)) {
      return NextResponse.json(
        { success: false, message: "Only Super Administrators can permanently delete records" },
        { status: 403 }
      );
    }

    try {
      await PeopleService.permanentDelete(id);
      await logAudit({
        userId: session.userId,
        userEmail: session.email,
        action: "PERSON_PERMANENTLY_DELETED",
        entity: "Person",
        entityId: id,
        ipAddress: getClientIp(req),
      });

      return NextResponse.json({ success: true, message: "Record permanently deleted" });
    } catch {
      return NextResponse.json({ success: false, message: "Failed to permanently delete record" }, { status: 500 });
    }
  }

  // Soft delete
  if (!hasPermission(session.role, "people:delete")) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
  }

  try {
    await PeopleService.softDelete(id);
    await logAudit({
      userId: session.userId,
      userEmail: session.email,
      action: "PERSON_SOFT_DELETED",
      entity: "Person",
      entityId: id,
      metadata: { status: "INACTIVE" },
      ipAddress: getClientIp(req),
    });

    return NextResponse.json({ success: true, message: "Member marked as inactive" });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to deactivate member" }, { status: 500 });
  }
}
