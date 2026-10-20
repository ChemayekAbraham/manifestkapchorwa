import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { TeamService } from "@/services/team.service";
import { teamMemberSchema } from "@/validators/team";
import { logAudit } from "@/lib/audit";
import { getClientIp } from "@/lib/rate-limit";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session || !hasPermission(session.role, "content:manage")) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
  }

  try {
    const members = await TeamService.getAll(true);
    return NextResponse.json({
      success: true,
      data: members,
    });
  } catch (error: any) {
    console.error("Failed to fetch team members:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to fetch team members" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || !hasPermission(session.role, "content:manage")) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const validated = teamMemberSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, message: "Validation failed", errors: validated.error.flatten() },
        { status: 400 }
      );
    }

    const member = await TeamService.create(validated.data);

    await logAudit({
      userId: session.userId,
      userEmail: session.email,
      action: "CREATE",
      entity: "TeamMember",
      entityId: member.id,
      metadata: { name: member.name, role: member.role },
      ipAddress: getClientIp(req),
    });

    return NextResponse.json({
      success: true,
      data: member,
      message: `${member.name} has been added to the team`,
    });
  } catch (error: any) {
    console.error("Failed to create team member:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to create team member" },
      { status: 500 }
    );
  }
}
