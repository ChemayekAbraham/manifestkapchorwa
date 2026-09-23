import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { PhanerooSyncService } from "@/services/phaneroo-sync.service";
import { logAudit } from "@/lib/audit";
import { getClientIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || !hasPermission(session.role, "devotions:manage")) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
  }

  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      // Body may be empty
    }

    const { searchParams } = new URL(req.url);
    const syncAll = body.syncAll ?? searchParams.get("all") === "true";
    const maxPages = body.maxPages ? Number(body.maxPages) : syncAll ? 25 : 8;

    const result = await PhanerooSyncService.syncLatestDevotions({ maxPages, syncAll });

    await logAudit({
      userId: session.userId,
      userEmail: session.email,
      action: "DEVOTIONS_SYNCED",
      entity: "Devotion",
      metadata: {
        syncedCount: result.syncedCount,
        updatedCount: result.updatedCount,
        totalProcessed: result.totalProcessed,
        newItems: result.newItems,
      },
      ipAddress: getClientIp(req),
    });

    return NextResponse.json({
      success: true,
      message:
        result.syncedCount > 0
          ? `Successfully synced ${result.syncedCount} new devotional(s) (processed ${result.totalProcessed} sermons from Phaneroo)!`
          : `All ${result.totalProcessed} Phaneroo daily devotions are already up to date.`,
      data: result,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to sync devotions" },
      { status: 500 }
    );
  }
}
