import { describe, it, expect } from "vitest";
import { PublicRegistrationSchema } from "../validators/registration";
import { PersonSchema } from "../validators/person";
import { DevotionSchema } from "../validators/devotion";
import { PrayerRequestSchema } from "../validators/prayer";
import { PublicTestimonySchema } from "../validators/testimony";
import { ServiceCheckInSchema } from "../validators/check-in";
import { NewConvertSchema } from "../validators/convert";
import { validateEmailAddress } from "../lib/email-validator";

describe("Validation Schemas", () => {
  it("validates valid public registration data with phone number (email optional)", () => {
    const valid = PublicRegistrationSchema.safeParse({
      fullName: "Joshua Chemutai",
      phone: "0770123456",
      village: "Cheptuya",
      category: "MEMBER",
      website_hp: "",
    });
    expect(valid.success).toBe(true);

    const missingPhone = PublicRegistrationSchema.safeParse({
      fullName: "Joshua Chemutai",
      village: "Cheptuya",
    });
    expect(missingPhone.success).toBe(false);
  });

  it("rejects registration with populated honeypot bot field", () => {
    const bot = PublicRegistrationSchema.safeParse({
      fullName: "Spam Bot",
      phone: "0770123456",
      email: "bot@gmail.com",
      website_hp: "http://spam.link",
    });
    expect(bot.success).toBe(false);
  });

  it("validates Google account format and catches typos", async () => {
    const validGoogle = await validateEmailAddress("chemayekabraham289@gmail.com");
    expect(validGoogle.isValid).toBe(true);
    expect(validGoogle.isGoogleAccount).toBe(true);

    const shortGoogle = await validateEmailAddress("ab@gmail.com");
    expect(shortGoogle.isValid).toBe(false);

    const typoDomain = await validateEmailAddress("chemayek@gmail.con");
    expect(typoDomain.isValid).toBe(false);
    expect(typoDomain.error).toContain("Did you mean @gmail.com");
  });

  it("validates devotion data", () => {
    const valid = DevotionSchema.safeParse({
      title: "Mountain Prayer Summit",
      content: "Deep reflections on biblical prayer and faith in the highlands.",
      author: "Pastor",
      published: true,
    });
    expect(valid.success).toBe(true);
  });

  it("validates prayer request data", () => {
    const valid = PrayerRequestSchema.safeParse({
      name: "Sister Mary",
      request: "Please pray for my mother's complete healing.",
    });
    expect(valid.success).toBe(true);
  });

  it("validates testimony data", () => {
    const valid = PublicTestimonySchema.safeParse({
      name: "Brother Peter",
      content: "God provided school fees miraculously through an unexpected blessing!",
    });
    expect(valid.success).toBe(true);
  });

  it("validates service attendance check-in data", () => {
    const valid = ServiceCheckInSchema.safeParse({
      fullName: "Joshua Chemutai",
      phone: "0770123456",
      serviceName: "Sunday First Service (9:00 AM – 11:00 AM E.A.T)",
    });
    expect(valid.success).toBe(true);

    const invalid = ServiceCheckInSchema.safeParse({
      fullName: "J",
      phone: "123",
    });
    expect(invalid.success).toBe(false);
  });

  it("validates new convert registration requiring name only", () => {
    const validReceived = NewConvertSchema.safeParse({
      convertType: "RECEIVED_JESUS",
      fullName: "Mary Chemutai",
    });
    expect(validReceived.success).toBe(true);

    const validSoulsWon = NewConvertSchema.safeParse({
      convertType: "SOULS_WON",
      fullName: "Peter Kiptoo",
      phone: "0771234567",
    });
    expect(validSoulsWon.success).toBe(true);

    const invalidEmpty = NewConvertSchema.safeParse({
      convertType: "RECEIVED_JESUS",
      fullName: "",
    });
    expect(invalidEmpty.success).toBe(false);
  });
});

