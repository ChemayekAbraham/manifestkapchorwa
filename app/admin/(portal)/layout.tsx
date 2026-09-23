import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { AdminShell } from "@/components/admin/admin-shell";

export default async function AdminPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/admin/login");
  }

  const user = {
    id: session.userId,
    name: session.name,
    email: session.email,
    role: session.role,
  };

  return <AdminShell user={user}>{children}</AdminShell>;
}
