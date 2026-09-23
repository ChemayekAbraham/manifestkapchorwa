"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  Users,
  Calendar,
  BookOpen,
  Send,
  MessageSquare,
  FileBarChart2,
  Shield,
  History,
  Settings,
  X,
  Church,
} from "lucide-react";
import { Role, canManageUsers, canViewAuditLogs } from "@/lib/permissions";

interface AdminSidebarProps {
  userRole?: Role;
  isOpen: boolean;
  onClose: () => void;
}

export function AdminSidebar({ userRole, isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "People / Members", href: "/admin/people", icon: Users },
    { name: "Events & Attendance", href: "/admin/events", icon: Calendar },
    { name: "Devotionals", href: "/admin/devotions", icon: BookOpen },
    { name: "Prayer Requests", href: "/admin/prayer-requests", icon: Send },
    { name: "Testimonies", href: "/admin/testimonies", icon: MessageSquare },
    { name: "Reports & Exports", href: "/admin/reports", icon: FileBarChart2 },
    ...(canManageUsers(userRole)
      ? [{ name: "User Accounts", href: "/admin/users", icon: Shield }]
      : []),
    ...(canViewAuditLogs(userRole)
      ? [{ name: "Audit Logs", href: "/admin/audit-logs", icon: History }]
      : []),
    { name: "System Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-neutral-950 text-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Top Header */}
        <div className="flex h-16 items-center justify-between border-b border-neutral-800 px-4">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <div className="relative h-10 w-28">
              <Image
                src="/images/logo.png"
                alt="Kapchorwa Manifest"
                fill
                priority
                className="object-contain object-left"
                sizes="120px"
              />
            </div>
            <div className="border-l border-neutral-700 pl-2">
              <span className="text-[10px] font-bold text-white uppercase block leading-tight">
                Kapchorwa Manifest
              </span>
              <span className="text-[8px] font-semibold text-highland-400 uppercase block">
                Admin
              </span>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-900 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-highland-400">
            Ministry Operations
          </div>
          {navigation.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-colors ${
                  isActive
                    ? "bg-highland-600 text-white shadow-sm border border-highland-500"
                    : "text-neutral-300 hover:bg-highland-900/80 hover:text-white"
                }`}
              >
                <item.icon className={`h-4 w-4 ${isActive ? "text-white" : "text-neutral-400"}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Link to Public Website */}
        <div className="border-t border-highland-900 p-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 rounded-xl bg-highland-900/60 px-3 py-2 text-xs font-medium text-neutral-300 hover:bg-highland-900 hover:text-white transition-colors"
          >
            <Church className="h-4 w-4 text-clay-400" />
            <span>Open Public Website</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
