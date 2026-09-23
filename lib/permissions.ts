export type Role = "SUPER_ADMIN" | "ADMIN" | "VIEWER";

export type Permission =
  | "people:view"
  | "people:create"
  | "people:edit"
  | "people:delete"
  | "people:permanent_delete"
  | "events:view"
  | "events:manage"
  | "attendance:mark"
  | "devotions:view"
  | "devotions:manage"
  | "prayer:view"
  | "prayer:manage"
  | "testimonies:view"
  | "testimonies:manage"
  | "reports:view"
  | "reports:export"
  | "content:manage"
  | "users:manage"
  | "audit:view"
  | "settings:manage";

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  SUPER_ADMIN: [
    "people:view",
    "people:create",
    "people:edit",
    "people:delete",
    "people:permanent_delete",
    "events:view",
    "events:manage",
    "attendance:mark",
    "devotions:view",
    "devotions:manage",
    "prayer:view",
    "prayer:manage",
    "testimonies:view",
    "testimonies:manage",
    "reports:view",
    "reports:export",
    "content:manage",
    "users:manage",
    "audit:view",
    "settings:manage",
  ],
  ADMIN: [
    "people:view",
    "people:create",
    "people:edit",
    "people:delete",
    "events:view",
    "events:manage",
    "attendance:mark",
    "devotions:view",
    "devotions:manage",
    "prayer:view",
    "prayer:manage",
    "testimonies:view",
    "testimonies:manage",
    "reports:view",
    "reports:export",
    "content:manage",
    "settings:manage",
  ],
  VIEWER: [
    "people:view",
    "events:view",
    "devotions:view",
    "reports:view",
  ],
};

export function hasPermission(role: Role | undefined | null, permission: Permission): boolean {
  if (!role) return false;
  const permissions = ROLE_PERMISSIONS[role];
  return permissions ? permissions.includes(permission) : false;
}

export function canManageUsers(role?: Role | null): boolean {
  return role === "SUPER_ADMIN";
}

export function canPermanentDelete(role?: Role | null): boolean {
  return role === "SUPER_ADMIN";
}

export function canViewAuditLogs(role?: Role | null): boolean {
  return role === "SUPER_ADMIN";
}

export function canEdit(role?: Role | null): boolean {
  return role === "SUPER_ADMIN" || role === "ADMIN";
}
