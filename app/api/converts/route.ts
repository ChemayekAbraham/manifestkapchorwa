import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { NewConvertSchema } from "@/validators/convert";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rateLimit = checkRateLimit(`converts:${ip}`, 10, 60 * 1000);

    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, message: "Too many submissions. Please wait a moment and try again." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const validated = NewConvertSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid full name and select your registration type.",
          errors: validated.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { convertType, fullName, phone, email, village, notes } = validated.data;
    const typeLabel =
      convertType === "SOULS_WON"
        ? "Souls Won (Mobilization & Outreach)"
        : "I've Just Received Jesus (Born Again)";

    const administrativeNotes = [
      `New Convert Record: ${typeLabel}`,
      notes ? `Notes: ${notes.trim()}` : null,
      `Registered via online website on ${new Date().toLocaleDateString()}`,
    ]
      .filter(Boolean)
      .join(" | ");

    // Check if duplicate exists with same name/email
    let person = null;
    if (email && email.trim()) {
      person = await prisma.person.findFirst({
        where: { email: { equals: email.trim().toLowerCase(), mode: "insensitive" } },
      });
    }

    if (person) {
      person = await prisma.person.update({
        where: { id: person.id },
        data: {
          category: "NEW_CONVERT",
          notes: administrativeNotes,
          village: village?.trim() || person.village,
          phone: phone?.trim() || person.phone,
        },
      });
    } else {
      person = await prisma.person.create({
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
    }

    logger.info(`New convert recorded: ${person.fullName} (${typeLabel})`, {
      personId: person.id,
      convertType,
    });

    return NextResponse.json({
      success: true,
      message:
        convertType === "RECEIVED_JESUS"
          ? `Praise God and welcome to the family of Christ, ${person.fullName}! Heaven rejoices with you today!`
          : `Praise God! The soul record for ${person.fullName} has been successfully registered.`,
      data: {
        id: person.id,
        fullName: person.fullName,
        convertType,
      },
    });
  } catch (error) {
    logger.error("Error creating new convert record", error);
    return NextResponse.json(
      { success: false, message: "Unable to process registration. Please try again." },
      { status: 500 }
    );
  }
}
