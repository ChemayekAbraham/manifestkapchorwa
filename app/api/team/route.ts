import { NextResponse } from "next/server";
import { TeamService } from "@/services/team.service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const members = await TeamService.getPublicMembers();
    return NextResponse.json({
      success: true,
      data: members,
    });
  } catch (error: any) {
    console.error("Public team fetch error:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to fetch team members" },
      { status: 500 }
    );
  }
}
