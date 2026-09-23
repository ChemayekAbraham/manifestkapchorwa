import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { canViewAuditLogs } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session || !canViewAuditLogs(session.role)) {
    return NextResponse.json({ success: false, message: "Super Administrator access required" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action") || undefined;
  const entity = searchParams.get("entity") || undefined;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "30", 10);

  const where: any = {};
  if (action) where.action = { contains: action, mode: "insensitive" };
  if (entity) where.entity = { contains: entity, mode: "insensitive" };

  try {
    const [total, items] = await Promise.all([
      prisma.auditLog.count({ where }),
      prisma.auditLog.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        items,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch {
    return NextResponse.json({ success: false, message: "Error loading audit logs" }, { status: 500 });
  }
}
