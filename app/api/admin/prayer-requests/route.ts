import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session || !hasPermission(session.role, "prayer:view")) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const reviewed = searchParams.get("reviewed");
  const archived = searchParams.get("archived") === "true";

  const where: any = {
    isArchived: archived,
  };
  if (reviewed === "true") where.isReviewed = true;
  if (reviewed === "false") where.isReviewed = false;

  try {
    const items = await prisma.prayerRequest.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: items });
  } catch {
    return NextResponse.json({ success: false, message: "Error loading prayer requests" }, { status: 500 });
  }
}
