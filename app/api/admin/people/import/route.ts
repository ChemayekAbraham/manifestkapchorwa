import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { ImportService } from "@/services/import.service";
import { logAudit } from "@/lib/audit";
import { getClientIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || !hasPermission(session.role, "people:create")) {
    return NextResponse.json({ success: false, message: "Unauthorized to import members" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { action, csv, rows } = body;

    if (action === "preview") {
      if (!csv || typeof csv !== "string") {
        return NextResponse.json({ success: false, message: "CSV content is required for preview" }, { status: 400 });
      }

      const preview = await ImportService.previewCSV(csv);
      return NextResponse.json({ success: true, data: preview });
    }

    if (action === "execute") {
      if (!rows || !Array.isArray(rows)) {
        return NextResponse.json({ success: false, message: "Rows array is required for execution" }, { status: 400 });
      }

      const results = await ImportService.executeImport(rows);

      await logAudit({
        userId: session.userId,
        userEmail: session.email,
        action: "MEMBERS_IMPORTED_CSV",
        entity: "Person",
        metadata: { importedCount: results.length },
        ipAddress: getClientIp(req),
      });

      return NextResponse.json({
        success: true,
        message: `Successfully imported ${results.length} members into the church database`,
        data: { importedCount: results.length },
      });
    }

    return NextResponse.json({ success: false, message: "Invalid action. Expected 'preview' or 'execute'" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message || "Failed to process CSV import" }, { status: 400 });
  }
}
