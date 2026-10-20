import { NextRequest, NextResponse } from "next/server";
import { PublicRegistrationSchema } from "@/validators/registration";
import { PeopleService, DuplicateRecordError } from "@/services/people.service";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";
import { validateEmailAddress } from "@/lib/email-validator";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rateLimit = checkRateLimit(`register:${ip}`, 5, 60 * 1000);

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Too many registration attempts. Please wait a minute and try again.",
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const validated = PublicRegistrationSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Please correct the highlighted fields.",
          errors: validated.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    // Honeypot validation
    if (validated.data.website_hp) {
      logger.warn("Bot detected on registration honeypot", { ip });
      return NextResponse.json({ success: true, message: "Registration received" });
    }

    // Optional email validation (if provided)
    let validatedEmail: string | null = null;
    if (validated.data.email && validated.data.email.trim() !== "") {
      const emailCheck = await validateEmailAddress(validated.data.email);
      if (!emailCheck.isValid) {
        return NextResponse.json(
          {
            success: false,
            message: emailCheck.error || "Please enter a valid email address.",
            errors: { email: [emailCheck.error || "Invalid email address"] },
          },
          { status: 400 }
        );
      }
      validatedEmail = emailCheck.normalizedEmail;
    }

    try {
      const person = await PeopleService.create({
        fullName: validated.data.fullName,
        phone: validated.data.phone,
        email: validatedEmail,
        gender: validated.data.gender || null,
        dateOfBirth: validated.data.dateOfBirth || null,
        village: validated.data.village || null,
        parish: validated.data.parish || null,
        subCounty: validated.data.subCounty || null,
        district: validated.data.district || "Kapchorwa",
        category: validated.data.category || "MEMBER",
        status: "ACTIVE",
        notes: validated.data.notes ? `Self-registered online. ${validated.data.notes}` : "Self-registered online",
      });

      logger.info(`New member registered: ${person.fullName}`, { personId: person.id, ip });

      return NextResponse.json({
        success: true,
        message: "Thank you! Your registration with Manifest Kapchorwa has been received successfully.",
        data: {
          id: person.id,
          fullName: person.fullName,
        },
      });
    } catch (err: any) {
      if (err instanceof DuplicateRecordError) {
        return NextResponse.json(
          {
            success: false,
            message: err.message,
            errors: { [err.field]: [err.message] },
          },
          { status: 409 }
        );
      }

      logger.error("Database or service error during registration", { error: err?.message || err, ip });
      return NextResponse.json(
        {
          success: false,
          message: "Our registration database server is temporarily unavailable. Please try again shortly or contact church administration.",
        },
        { status: 503 }
      );
    }
  } catch (error) {
    logger.error("Unhandled error in /api/register", error);
    return NextResponse.json(
      { success: false, message: "Unable to complete registration. Please try again later." },
      { status: 500 }
    );
  }
}
