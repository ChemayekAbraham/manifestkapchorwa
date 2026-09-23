import { describe, it, expect } from "vitest";
import { hasPermission, canManageUsers, canPermanentDelete, canViewAuditLogs } from "../lib/permissions";

describe("Role-Based Access Control (RBAC) Matrix", () => {
  it("SUPER_ADMIN has full permissions", () => {
    expect(hasPermission("SUPER_ADMIN", "people:view")).toBe(true);
    expect(hasPermission("SUPER_ADMIN", "people:create")).toBe(true);
    expect(hasPermission("SUPER_ADMIN", "people:permanent_delete")).toBe(true);
    expect(hasPermission("SUPER_ADMIN", "users:manage")).toBe(true);
    expect(hasPermission("SUPER_ADMIN", "audit:view")).toBe(true);
    expect(canManageUsers("SUPER_ADMIN")).toBe(true);
    expect(canPermanentDelete("SUPER_ADMIN")).toBe(true);
    expect(canViewAuditLogs("SUPER_ADMIN")).toBe(true);
  });

  it("ADMIN can manage people, events, and reports, but NOT users or audit logs", () => {
    expect(hasPermission("ADMIN", "people:view")).toBe(true);
    expect(hasPermission("ADMIN", "people:create")).toBe(true);
    expect(hasPermission("ADMIN", "events:manage")).toBe(true);
    expect(hasPermission("ADMIN", "reports:export")).toBe(true);
    expect(hasPermission("ADMIN", "users:manage")).toBe(false);
    expect(hasPermission("ADMIN", "audit:view")).toBe(false);
    expect(canManageUsers("ADMIN")).toBe(false);
    expect(canPermanentDelete("ADMIN")).toBe(false);
  });

  it("VIEWER has read-only access", () => {
    expect(hasPermission("VIEWER", "people:view")).toBe(true);
    expect(hasPermission("VIEWER", "events:view")).toBe(true);
    expect(hasPermission("VIEWER", "reports:view")).toBe(true);
    expect(hasPermission("VIEWER", "people:create")).toBe(false);
    expect(hasPermission("VIEWER", "people:edit")).toBe(false);
    expect(hasPermission("VIEWER", "people:delete")).toBe(false);
    expect(hasPermission("VIEWER", "events:manage")).toBe(false);
  });
});
