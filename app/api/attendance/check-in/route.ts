import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ServiceCheckInSchema } from "@/validators/check-in";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rateLimit = checkRateLimit(`check-in:${ip}`, 10, 60 * 1000);

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Too many check-in requests. Please wait a moment and try again.",
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const validated = ServiceCheckInSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Please select the service and enter your registered email address.",
          errors: validated.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { fullName, email, serviceName, serviceId } = validated.data;
    const normalizedEmail = email.trim().toLowerCase();

    // 1. Check if person exists in the database by email
    const person = await prisma.person.findFirst({
      where: {
        email: { equals: normalizedEmail, mode: "insensitive" },
      },
    });

    if (!person) {
      return NextResponse.json(
        {
          success: false,
          notRegistered: true,
          message:
            "This email is not registered in our church database. Please first register as a church member to attend and check in for services.",
        },
        { status: 404 }
      );
    }

    // 2. Find or auto-create the selected service event
    let activeEvent = null;

    if (serviceId) {
      activeEvent = await prisma.event.findUnique({
        where: { id: serviceId },
      });
    }

    if (!activeEvent) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Look for event matching the serviceName today
      const cleanName = serviceName.split("(")[0].trim();
      activeEvent = await prisma.event.findFirst({
        where: {
          name: { contains: cleanName, mode: "insensitive" },
          date: { gte: today, lt: tomorrow },
        },
        orderBy: { date: "asc" },
      });

      // If not found today, look for any upcoming or existing event with matching name
      if (!activeEvent) {
        activeEvent = await prisma.event.findFirst({
          where: {
            name: { contains: cleanName, mode: "insensitive" },
          },
          orderBy: { date: "desc" },
        });
      }

      // If still not found, create a new event record for this service session
      if (!activeEvent) {
        activeEvent = await prisma.event.create({
          data: {
            name: serviceName.trim(),
            date: new Date(),
            location: "Main Sanctuary, Manifest Kapchorwa",
            published: true,
            description: "Weekly fellowship and service gathering attendance session.",
          },
        });
      }
    }

    // 3. Mark attendance as PRESENT
    await prisma.eventAttendance.upsert({
      where: {
        eventId_personId: {
          eventId: activeEvent.id,
          personId: person.id,
        },
      },
      create: {
        eventId: activeEvent.id,
        personId: person.id,
        status: "PRESENT",
        notes: "Self checked-in via online Services portal",
      },
      update: {
        status: "PRESENT",
        markedAt: new Date(),
      },
    });

    logger.info(`Member checked into service: ${person.fullName} (${person.email}) -> ${activeEvent.name}`, {
      eventId: activeEvent.id,
      personId: person.id,
    });

    return NextResponse.json({
      success: true,
      message: `Welcome, ${person.fullName}! Your attendance for "${activeEvent.name}" has been successfully recorded as Present.`,
      data: {
        personName: person.fullName,
        serviceName: activeEvent.name,
      },
    });
  } catch (error) {
    logger.error("Error in service check-in", error);
    return NextResponse.json(
      { success: false, message: "Unable to process attendance check-in. Please try again." },
      { status: 500 }
    );
  }
}

