import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { ReportsService } from "@/services/reports.service";
import { ReportFilterSchema } from "@/validators/report";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || !hasPermission(session.role, "reports:view")) {
    return NextResponse.json({ success: false, message: "Unauthorized to view reports" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const validated = ReportFilterSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, message: "Invalid report parameters", errors: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const report = await ReportsService.runReport(validated.data);
    return NextResponse.json({ success: true, data: report });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || "Failed to generate report" }, { status: 500 });
  }
}
