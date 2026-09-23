"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, LogOut, User as UserIcon, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Role } from "@/lib/permissions";

interface AdminHeaderProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: Role;
  };
  onMenuToggle: () => void;
}

export function AdminHeader({ user, onMenuToggle }: AdminHeaderProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch {
      setIsLoggingOut(false);
    }
  };

  const getRoleBadgeVariant = (role: Role) => {
    if (role === "SUPER_ADMIN") return "clay";
    if (role === "ADMIN") return "default";
    return "secondary";
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-neutral-200 bg-white px-4 sm:px-6 lg:px-8 shadow-xs">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="rounded-lg p-2 text-neutral-600 hover:bg-neutral-100 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
        <span className="font-heading text-sm font-bold text-neutral-900 hidden sm:inline-block">
          Manifest Kapchorwa Ministry System
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* User Info */}
        <div className="flex items-center gap-2.5 text-right">
          <div className="hidden sm:block">
            <span className="font-semibold text-xs text-neutral-900 block leading-tight">
              {user.name}
            </span>
            <span className="text-[10px] text-neutral-500 block">{user.email}</span>
          </div>
          <Badge variant={getRoleBadgeVariant(user.role)} className="text-[10px] tracking-wider uppercase">
            {user.role.replace("_", " ")}
          </Badge>
        </div>

        {/* Logout Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          isLoading={isLoggingOut}
          className="gap-1.5 text-xs text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Sign Out</span>
        </Button>
      </div>
    </header>
  );
}
