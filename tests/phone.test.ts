import { describe, it, expect } from "vitest";
import { normalizeUgandanPhone, isValidUgandanPhone, formatUgandanPhoneDisplay } from "../lib/phone";

describe("Ugandan Phone Normalization & Validation", () => {
  it("normalizes local 10-digit number starting with 0", () => {
    expect(normalizeUgandanPhone("0770123456")).toBe("+256770123456");
    expect(normalizeUgandanPhone("0752 987 654")).toBe("+256752987654");
    expect(normalizeUgandanPhone("0392-123-456")).toBe("+256392123456");
  });

  it("normalizes 12-digit number starting with 256", () => {
    expect(normalizeUgandanPhone("256770123456")).toBe("+256770123456");
  });

  it("normalizes 9-digit number starting with 7 or 3", () => {
    expect(normalizeUgandanPhone("770123456")).toBe("+256770123456");
  });

  it("validates legitimate Ugandan phone numbers", () => {
    expect(isValidUgandanPhone("0770123456")).toBe(true);
    expect(isValidUgandanPhone("+256750123456")).toBe(true);
    expect(isValidUgandanPhone("0392123456")).toBe(true);
    expect(isValidUgandanPhone("invalid-phone")).toBe(false);
    expect(isValidUgandanPhone("123")).toBe(false);
  });

  it("formats display cleanly", () => {
    expect(formatUgandanPhoneDisplay("+256770123456")).toBe("+256 770 123456");
    expect(formatUgandanPhoneDisplay(null)).toBe("-");
  });
});
