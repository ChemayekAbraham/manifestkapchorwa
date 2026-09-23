"use client";

import React, { createContext, useContext } from "react";
import { Role } from "@/lib/permissions";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

interface AdminUserContextType {
  user: AdminUser;
}

const AdminUserContext = createContext<AdminUserContextType | null>(null);

export function AdminUserProvider({
  user,
  children,
}: {
  user: AdminUser;
  children: React.ReactNode;
}) {
  return (
    <AdminUserContext.Provider value={{ user }}>
      {children}
    </AdminUserContext.Provider>
  );
}

export function useAdminUser(): AdminUserContextType {
  const context = useContext(AdminUserContext);
  if (!context) {
    throw new Error("useAdminUser must be used within an AdminUserProvider");
  }
  return context;
}
