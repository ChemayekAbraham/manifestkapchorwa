import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { DashboardService } from "@/services/dashboard.service";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await DashboardService.getSummary();
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to load dashboard data" },
      { status: 500 }
    );
  }
}
