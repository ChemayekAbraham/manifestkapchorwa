import { NextRequest, NextResponse } from "next/server";
import { PublicTestimonySchema } from "@/validators/testimony";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

export async function GET() {
  try {
    const testimonies = await prisma.testimony.findMany({
      where: { status: "APPROVED" },
      select: {
        id: true,
        name: true,
        content: true,
        approvedAt: true,
        createdAt: true,
      },
      orderBy: { approvedAt: "desc" },
      take: 20,
    });

    return NextResponse.json({ success: true, data: testimonies });
  } catch (error) {
    logger.error("Error fetching public testimonies", error);
    return NextResponse.json({ success: false, message: "Error fetching testimonies" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rateLimit = checkRateLimit(`testimony:${ip}`, 5, 60 * 1000);

    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, message: "Too many requests. Please wait a minute and try again." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const validated = PublicTestimonySchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, message: "Invalid submission", errors: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    // Honeypot check
    if (validated.data.website_hp) {
      return NextResponse.json({ success: true, message: "Testimony received" });
    }

    const testimony = await prisma.testimony.create({
      data: {
        name: validated.data.name.trim(),
        contact: validated.data.contact?.trim() || null,
        content: validated.data.content.trim(),
        status: "PENDING", // Strictly pending until admin approval
      },
    });

    logger.info("New testimony submitted (Pending review)", { id: testimony.id, ip });

    return NextResponse.json({
      success: true,
      message:
        "Thank you for sharing your testimony of God's goodness! Your testimony will be reviewed by church leadership before publication.",
    });
  } catch (error) {
    logger.error("Error submitting testimony", error);
    return NextResponse.json(
      { success: false, message: "Unable to submit testimony. Please try again." },
      { status: 500 }
    );
  }
}
