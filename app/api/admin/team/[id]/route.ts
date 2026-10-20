import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { TeamService } from "@/services/team.service";
import { updateTeamMemberSchema } from "@/validators/team";
import { logAudit } from "@/lib/audit";
import { getClientIp } from "@/lib/rate-limit";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || !hasPermission(session.role, "content:manage")) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
  }

  const { id } = await params;

  try {
    const member = await TeamService.getById(id);
    if (!member) {
      return NextResponse.json({ success: false, message: "Team member not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: member });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to fetch member" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || !hasPermission(session.role, "content:manage")) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
  }

  const { id } = await params;

  try {
    const existing = await TeamService.getById(id);
    if (!existing) {
      return NextResponse.json({ success: false, message: "Team member not found" }, { status: 404 });
    }

    const body = await req.json();
    const validated = updateTeamMemberSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, message: "Validation failed", errors: validated.error.flatten() },
        { status: 400 }
      );
    }

    const updated = await TeamService.update(id, validated.data);

    await logAudit({
      userId: session.userId,
      userEmail: session.email,
      action: "UPDATE",
      entity: "TeamMember",
      entityId: id,
      metadata: { previous: { name: existing.name, role: existing.role }, current: validated.data },
      ipAddress: getClientIp(req),
    });

    return NextResponse.json({
      success: true,
      data: updated,
      message: `${updated.name} updated successfully`,
    });
  } catch (error: any) {
    console.error("Failed to update team member:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to update team member" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || !hasPermission(session.role, "content:manage")) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
  }

  const { id } = await params;

  try {
    const existing = await TeamService.getById(id);
    if (!existing) {
      return NextResponse.json({ success: false, message: "Team member not found" }, { status: 404 });
    }

    await TeamService.delete(id);

    await logAudit({
      userId: session.userId,
      userEmail: session.email,
      action: "DELETE",
      entity: "TeamMember",
      entityId: id,
      metadata: { name: existing.name, role: existing.role },
      ipAddress: getClientIp(req),
    });

    return NextResponse.json({
      success: true,
      message: `${existing.name} has been removed from the team`,
    });
  } catch (error: any) {
    console.error("Failed to delete team member:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to delete team member" },
      { status: 500 }
    );
  }
}
