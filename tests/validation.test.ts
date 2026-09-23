import { describe, it, expect } from "vitest";
import { PublicRegistrationSchema } from "../validators/registration";
import { PersonSchema } from "../validators/person";
import { DevotionSchema } from "../validators/devotion";
import { PrayerRequestSchema } from "../validators/prayer";
import { PublicTestimonySchema } from "../validators/testimony";

describe("Validation Schemas", () => {
  it("validates valid public registration data", () => {
    const valid = PublicRegistrationSchema.safeParse({
      fullName: "Joshua Chemutai",
      phone: "0770123456",
      village: "Cheptuya",
      category: "MEMBER",
      website_hp: "",
    });
    expect(valid.success).toBe(true);
  });

  it("rejects registration with populated honeypot bot field", () => {
    const bot = PublicRegistrationSchema.safeParse({
      fullName: "Spam Bot",
      phone: "0770123456",
      website_hp: "http://spam.link",
    });
    expect(bot.success).toBe(false);
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
});
