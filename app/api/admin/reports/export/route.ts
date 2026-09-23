import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { ReportsService } from "@/services/reports.service";
import { ExportService } from "@/services/export.service";
import { ReportFilterSchema } from "@/validators/report";
import { logAudit } from "@/lib/audit";
import { getClientIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || !hasPermission(session.role, "reports:export")) {
    return NextResponse.json({ success: false, message: "Unauthorized to export reports" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const validated = ReportFilterSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, message: "Invalid export parameters", errors: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const report = await ReportsService.runReport(validated.data);
    const format = validated.data.format || "csv";
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const sanitizedTitle = report.title.toLowerCase().replace(/[\s/]/g, "-");

    // Audit logging for export
    await logAudit({
      userId: session.userId,
      userEmail: session.email,
      action: "REPORT_EXPORTED",
      entity: "Report",
      metadata: { reportType: report.type, format, totalRecords: report.totalRecords },
      ipAddress: getClientIp(req),
    });

    if (format === "xlsx") {
      const excelBuffer = await ExportService.generateExcel(report, session.name);
      return new NextResponse(excelBuffer as unknown as BodyInit, {
        status: 200,
        headers: {
          "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": `attachment; filename="${sanitizedTitle}-${timestamp}.xlsx"`,
        },
      });
    }

    if (format === "pdf") {
      const pdfBuffer = ExportService.generatePDF(report, session.name);
      return new NextResponse(pdfBuffer as unknown as BodyInit, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${sanitizedTitle}-${timestamp}.pdf"`,
        },
      });
    }

    // Default CSV
    const csvString = ExportService.generateCSV(report, session.name);
    return new NextResponse(csvString, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${sanitizedTitle}-${timestamp}.csv"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || "Export failed" }, { status: 500 });
  }
}
