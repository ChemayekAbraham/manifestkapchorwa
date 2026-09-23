"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Menu, X, Heart, Calendar, BookOpen, UserPlus, Phone, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Devotions", href: "/devotions" },
  { name: "Events", href: "/events" },
  { name: "Salvation", href: "/salvation" },
  { name: "Testimonies", href: "/testimony" },
  { name: "Giving", href: "/give" },
  { name: "Contact", href: "/contact" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200/80 bg-white/95 backdrop-blur-md transition-all">
      {/* Top Highland Notification Bar */}
      <div className="bg-highland-900 px-4 py-1.5 text-xs text-highland-100 hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span>📍 Kapchorwa Town, Sebei Highlands, Uganda</span>
          <div className="flex items-center gap-4">
            <span>Sunday Services: 8:00 AM & 11:00 AM</span>
            <span className="text-highland-300">Midweek Prayers: Wed 5:00 PM</span>
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

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-2 xl:px-2.5 py-1.5 rounded-md text-xs xl:text-sm font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? "bg-highland-50 text-highland-900 font-semibold"
                    : "text-neutral-600 hover:text-highland-900 hover:bg-neutral-50"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Action Button */}
        <div className="hidden sm:flex items-center gap-3">
          <Link href="/register">
            <Button size="sm" variant="clay" className="gap-1.5 shadow-sm">
              <UserPlus className="h-4 w-4" />
              <span>Join / Register</span>
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <Link href="/register">
            <Button size="sm" variant="clay" className="px-3 text-xs">
              Register
            </Button>
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center rounded-lg p-2 text-neutral-700 hover:bg-neutral-100 focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-neutral-200 bg-white px-4 pt-2 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-2">
          <div className="grid grid-cols-2 gap-2 pt-2 pb-3 border-b border-neutral-100">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2.5 rounded-lg text-sm font-medium ${
                    isActive
                      ? "bg-highland-100 text-highland-900 font-bold"
                      : "text-neutral-700 hover:bg-neutral-50"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full justify-center" variant="clay">
                <UserPlus className="h-4 w-4 mr-2" />
                Register as Member
              </Button>
            </Link>
            <div className="flex items-center justify-between text-xs text-neutral-500 pt-2 px-1">
              <span>Kapchorwa, Uganda</span>
              <span className="text-highland-800 font-medium">+256 770 123456</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
