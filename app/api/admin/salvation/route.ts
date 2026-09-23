import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";
import { getClientIp } from "@/lib/rate-limit";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session || !hasPermission(session.role, "people:view")) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search")?.trim() || "";
  const filterType = searchParams.get("type") || "ALL"; // ALL | SOULS_WON | RECEIVED_JESUS
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "25", 10);
  const skip = (page - 1) * pageSize;

  try {
    const where: any = {
      category: "NEW_CONVERT",
    };

    if (filterType === "SOULS_WON") {
      where.notes = { contains: "Souls Won", mode: "insensitive" };
    } else if (filterType === "RECEIVED_JESUS") {
      where.notes = { contains: "Received Jesus", mode: "insensitive" };
    }

    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { village: { contains: search, mode: "insensitive" } },
        { notes: { contains: search, mode: "insensitive" } },
      ];
    }

    const [items, total, statsSoulsWon, statsReceivedJesus, totalConverts] = await Promise.all([
      prisma.person.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
      prisma.person.count({ where }),
      prisma.person.count({
        where: {
          category: "NEW_CONVERT",
          notes: { contains: "Souls Won", mode: "insensitive" },
        },
      }),
      prisma.person.count({
        where: {
          category: "NEW_CONVERT",
          notes: { contains: "Received Jesus", mode: "insensitive" },
        },
      }),
      prisma.person.count({
        where: { category: "NEW_CONVERT" },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        items,
        stats: {
          totalConverts,
          soulsWon: statsSoulsWon,
          receivedJesus: statsReceivedJesus,
        },
        pagination: {
          total,
          page,
          pageSize,
          totalPages: Math.ceil(total / pageSize) || 1,
        },
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch salvation records" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || !hasPermission(session.role, "people:create")) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { fullName, phone, email, village, convertType, notes } = body;

    if (!fullName || typeof fullName !== "string" || fullName.trim().length < 2) {
      return NextResponse.json(
        { success: false, message: "Full Name is required (minimum 2 characters)" },
        { status: 400 }
      );
    }

    const typeLabel =
      convertType === "SOULS_WON"
        ? "Souls Won (Mobilization & Outreach)"
        : "I've Just Received Jesus (Born Again)";

    const administrativeNotes = [
      `New Convert Record: ${typeLabel}`,
      notes ? `Notes: ${notes.trim()}` : null,
      `Recorded in Admin Portal by ${session.email} on ${new Date().toLocaleDateString()}`,
    ]
      .filter(Boolean)
      .join(" | ");

    const person = await prisma.person.create({
      data: {
        fullName: fullName.trim(),
        category: "NEW_CONVERT",
        status: "ACTIVE",
        phone: phone?.trim() || null,
        email: email?.trim().toLowerCase() || null,
        village: village?.trim() || null,
        notes: administrativeNotes,
        dateJoined: new Date(),
      },
    });

    await logAudit({
      userId: session.userId,
      userEmail: session.email,
      action: "CONVERT_REGISTERED_ADMIN",
      entity: "Person",
      entityId: person.id,
      metadata: { fullName: person.fullName, convertType },
      ipAddress: getClientIp(req),
    });

    return NextResponse.json({
      success: true,
      message: `Successfully registered salvation record for ${person.fullName}!`,
      data: person,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create salvation record" },
      { status: 500 }
    );
  }
}
