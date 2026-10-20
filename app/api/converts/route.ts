import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { NewConvertSchema } from "@/validators/convert";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";
import { normalizeUgandanPhone } from "@/lib/phone";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rateLimit = checkRateLimit(`converts:${ip}`, 15, 60 * 1000);

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
          message: "Please enter a valid full name for each person and select registration type.",
          errors: validated.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { convertType } = validated.data;
    const typeLabel =
      convertType === "SOULS_WON"
        ? "Souls Won (Mobilization & Outreach)"
        : "I've Just Received Jesus (Born Again)";

    // Determine the list of people to process (single or multiple)
    const rawList =
      validated.data.people && validated.data.people.length > 0
        ? validated.data.people
        : validated.data.fullName
        ? [
            {
              fullName: validated.data.fullName,
              phone: validated.data.phone,
              village: validated.data.village,
              notes: validated.data.notes,
            },
          ]
        : [];

    const peopleList = rawList.filter((p) => p.fullName && p.fullName.trim().length >= 2);

    if (peopleList.length === 0) {
      return NextResponse.json(
        { success: false, message: "Please enter at least one person's full name." },
        { status: 400 }
      );
    }

    const createdRecords: Array<{ id: string; fullName: string }> = [];

    for (const item of peopleList) {
      const cleanName = item.fullName.trim();
      const normPhone = normalizeUgandanPhone(item.phone) || item.phone?.trim() || null;
      const administrativeNotes = [
        `New Convert Record: ${typeLabel}`,
        item.notes ? `Notes: ${item.notes.trim()}` : null,
        `Registered via online website on ${new Date().toLocaleDateString()}`,
      ]
        .filter(Boolean)
        .join(" | ");

      // Check if duplicate exists with same phone or exact name
      let person = null;
      if (normPhone) {
        person = await prisma.person.findFirst({
          where: {
            OR: [{ phone: normPhone }, { phone: item.phone?.trim() }],
          },
        });
      }

      if (!person) {
        person = await prisma.person.findFirst({
          where: {
            fullName: { equals: cleanName, mode: "insensitive" },
          },
        });
      }

      if (person) {
        person = await prisma.person.update({
          where: { id: person.id },
          data: {
            category: "NEW_CONVERT",
            notes: administrativeNotes,
            village: item.village?.trim() || person.village,
            phone: normPhone || person.phone,
          },
        });
      } else {
        person = await prisma.person.create({
          data: {
            fullName: cleanName,
            category: "NEW_CONVERT",
            status: "ACTIVE",
            phone: normPhone,
            village: item.village?.trim() || null,
            notes: administrativeNotes,
            dateJoined: new Date(),
          },
        });
      }

      createdRecords.push({ id: person.id, fullName: person.fullName });
    }

    logger.info(`Recorded ${createdRecords.length} converts (${typeLabel})`, {
      convertType,
      count: createdRecords.length,
    });

    const isSingle = createdRecords.length === 1;
    const singleName = createdRecords[0]?.fullName;

    return NextResponse.json({
      success: true,
      message:
        convertType === "RECEIVED_JESUS"
          ? `Praise God and welcome to the family of Christ, ${singleName}! Heaven rejoices with you today!`
          : isSingle
          ? `Praise God! The soul record for ${singleName} has been successfully registered.`
          : `Praise God! All ${createdRecords.length} souls have been successfully registered for follow-up!`,
      data: {
        id: createdRecords[0]?.id,
        fullName: singleName,
        convertType,
        count: createdRecords.length,
        people: createdRecords,
      },
    });
  } catch (error) {
    logger.error("Error creating new convert records", error);
    return NextResponse.json(
      { success: false, message: "Unable to process registration. Please try again." },
      { status: 500 }
    );
  }
}
