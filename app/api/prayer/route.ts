import { NextRequest, NextResponse } from "next/server";
import { PrayerRequestSchema } from "@/validators/prayer";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rateLimit = checkRateLimit(`prayer:${ip}`, 5, 60 * 1000);

    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, message: "Too many requests. Please wait a minute and try again." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const validated = PrayerRequestSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, message: "Invalid submission", errors: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    // Honeypot check
    if (validated.data.website_hp) {
      return NextResponse.json({ success: true, message: "Prayer request received" });
    }

    const prayer = await prisma.prayerRequest.create({
      data: {
        name: validated.data.name.trim(),
        contact: validated.data.contact?.trim() || null,
        request: validated.data.request.trim(),
        isReviewed: false,
        isArchived: false,
      },
    });

    logger.info("Prayer request submitted", { id: prayer.id, ip });

    return NextResponse.json({
      success: true,
      message: "Your prayer request has been submitted to the pastoral intercession team. God hears your prayers!",
    });
  } catch (error) {
    logger.error("Error in /api/prayer", error);
    return NextResponse.json(
      { success: false, message: "Unable to submit prayer request. Please try again." },
      { status: 500 }
    );
  }
}
