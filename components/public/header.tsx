"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  Menu,
  X,
  Heart,
  Calendar,
  BookOpen,
  UserPlus,
  Phone,
  ChevronDown,
  Camera,
  ShoppingBag,
  Sparkles,
  HeartHandshake,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// The 3 main top-level navigation links
const MAIN_NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Services", href: "/services" },
];

// The secondary links grouped elegantly under "More"
const MORE_NAV_LINKS = [
  {
    name: "Devotions",
    href: "/devotions",
    icon: BookOpen,
    description: "Daily scripture & devotionals",
    color: "bg-blue-50 text-blue-700",
  },
  {
    name: "Events",
    href: "/events",
    icon: Calendar,
    description: "Upcoming programs & summits",
    color: "bg-emerald-50 text-emerald-700",
  },
  {
    name: "Gallery",
    href: "/gallery",
    icon: Camera,
    description: "Photos & celebration moments",
    color: "bg-purple-50 text-purple-700",
  },
  {
    name: "Merchandise",
    href: "/merchandise",
    icon: ShoppingBag,
    description: "Official T-shirts, caps & hoodies",
    badge: "Store",
    color: "bg-amber-50 text-amber-700",
  },
  {
    name: "Salvation",
    href: "/salvation",
    icon: HeartHandshake,
    description: "New converts registration",
    color: "bg-rose-50 text-rose-700",
  },
  {
    name: "Testimonies",
    href: "/testimony",
    icon: Sparkles,
    description: "Praise reports of God's grace",
    color: "bg-yellow-50 text-yellow-700",
  },
  {
    name: "Giving",
    href: "/give",
    icon: Heart,
    description: "Tithes, offerings & partnership",
    color: "bg-red-50 text-red-700",
  },
  {
    name: "Contact",
    href: "/contact",
    icon: Phone,
    description: "Office location & inquiries",
    color: "bg-neutral-100 text-neutral-800",
  },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setMoreDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close menu & dropdown on route change
  useEffect(() => {
    setMoreDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  const isMoreActive = MORE_NAV_LINKS.some((link) => pathname === link.href);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200/80 bg-white/95 backdrop-blur-md transition-all">
      {/* Top Highland Notification Bar */}
      <div className="bg-highland-900 px-4 py-1.5 text-xs text-highland-100 hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span>📍 Kapchorwa Town, Joshua Cheptegei Foundation Office</span>
          <div className="flex items-center gap-4">
            <span>Sunday Services: 9:00 AM & 11:00 AM E.A.T</span>
            <span className="text-highland-300">Thursday Fellowship: 5:00 PM E.A.T</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group py-1">
          <div className="relative h-11 w-32 sm:w-36">
            <Image
              src="/images/logo.png"
              alt="Kapchorwa Manifest"
              fill
              priority
              className="object-contain object-left group-hover:scale-105 transition-transform"
              sizes="160px"
            />
          </div>
          <div className="border-l border-neutral-300 pl-2.5 hidden sm:block">
            <span className="text-[11px] font-extrabold tracking-wider text-neutral-900 uppercase block leading-tight">
              Kapchorwa Manifest
            </span>
            <span className="text-[9px] font-bold text-highland-700 tracking-wider uppercase block">
              Eastern Uganda
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links — 3 Main Links + "More" Dropdown */}
        <nav className="hidden md:flex items-center gap-2">
          {MAIN_NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-highland-100 text-highland-900 shadow-xs"
                    : "text-neutral-700 hover:text-highland-900 hover:bg-neutral-100/80"
                }`}
              >
                {link.name}
              </Link>
            );
          })}

          {/* "More" Dropdown Menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                isMoreActive || moreDropdownOpen
                  ? "bg-highland-100 text-highland-900 font-bold shadow-xs"
                  : "text-neutral-700 hover:text-highland-900 hover:bg-neutral-100/80"
              }`}
              aria-expanded={moreDropdownOpen}
              aria-haspopup="true"
            >
              <span>More</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  moreDropdownOpen ? "rotate-180 text-highland-900" : "text-neutral-500"
                }`}
              />
            </button>

            {/* Dropdown Panel */}
            {moreDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-[480px] rounded-2xl bg-white/95 backdrop-blur-xl border border-neutral-200/90 shadow-2xl p-3 z-50 animate-in fade-in-50 zoom-in-95 duration-150">
                <div className="grid grid-cols-2 gap-1.5">
                  {MORE_NAV_LINKS.map((link) => {
                    const isActive = pathname === link.href;
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMoreDropdownOpen(false)}
                        className={`flex items-start gap-3 p-2.5 rounded-xl transition-all ${
                          isActive
                            ? "bg-highland-100/80 text-highland-900 font-semibold"
                            : "hover:bg-neutral-100 text-neutral-800"
                        }`}
                      >
                        <div
                          className={`h-8 w-8 shrink-0 rounded-lg flex items-center justify-center ${link.color}`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold leading-tight truncate">
                              {link.name}
                            </span>
                            {link.badge && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase bg-amber-400 text-neutral-950">
                                {link.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-neutral-500 leading-snug line-clamp-1">
                            {link.description}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                <div className="mt-2 pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500 px-2">
                  <span>Phaneroo Ministries International</span>
                  <a
                    href="https://phaneroo.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-highland-700 font-bold hover:underline"
                  >
                    phaneroo.org ↗
                  </a>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Action Button */}
        <div className="hidden sm:flex items-center gap-3">
          <Link href="/register">
            <Button size="sm" variant="clay" className="gap-1.5 shadow-sm font-bold">
              <UserPlus className="h-4 w-4" />
              <span>Join / Register</span>
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="flex items-center gap-2 md:hidden">
          <Link href="/register">
            <Button size="sm" variant="clay" className="px-3 text-xs font-bold">
              Register
            </Button>
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center rounded-lg p-2 text-neutral-700 hover:bg-neutral-100 focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6 text-neutral-900" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-neutral-200 bg-white px-4 pt-3 pb-6 space-y-4 shadow-xl animate-in slide-in-from-top-2 duration-200">
          {/* Main 3 Links */}
          <div className="grid grid-cols-3 gap-2">
            {MAIN_NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-center py-2.5 px-2 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? "bg-highland-800 text-white shadow-sm"
                      : "bg-neutral-100 text-neutral-800 hover:bg-neutral-200"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* More Links Section */}
          <div className="space-y-2 pt-1 border-t border-neutral-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block px-1">
              Explore More
            </span>
            <div className="grid grid-cols-2 gap-2">
              {MORE_NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2 p-2 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? "bg-highland-100 text-highland-900 font-bold"
                        : "bg-neutral-50 text-neutral-700 hover:bg-neutral-100"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0 text-highland-700" />
                    <span className="truncate">{link.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full justify-center font-bold" variant="clay">
                <UserPlus className="h-4 w-4 mr-2" />
                Register as Member
              </Button>
            </Link>
            <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-1 px-1">
              <span>Kapchorwa Town, Uganda</span>
              <span className="text-highland-800 font-semibold">+256 770 123456</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
