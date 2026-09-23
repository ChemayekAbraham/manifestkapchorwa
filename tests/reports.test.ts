import { describe, it, expect } from "vitest";
import { WHITELISTED_REPORT_FIELDS, ReportFilterSchema } from "../validators/report";

describe("Reports Validation & Whitelist", () => {
  it("enforces whitelisted fields for custom report builder", () => {
    expect(WHITELISTED_REPORT_FIELDS).toContain("fullName");
    expect(WHITELISTED_REPORT_FIELDS).toContain("phone");
    expect(WHITELISTED_REPORT_FIELDS).toContain("category");
    expect(WHITELISTED_REPORT_FIELDS).toContain("status");
    expect(WHITELISTED_REPORT_FIELDS).toContain("village");
    expect((WHITELISTED_REPORT_FIELDS as readonly string[]).includes("passwordHash")).toBe(false);
  });

  it("validates report filter input schema", () => {
    const valid = ReportFilterSchema.safeParse({
      type: "membership-summary",
      category: "MEMBER",
      status: "ACTIVE",
    });
    expect(valid.success).toBe(true);
  });
});
