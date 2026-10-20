"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
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
  Sparkles,
  HeartHandshake,
  Compass,
  MapPin,
  ArrowUpRight,
  Flame,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const MAIN_NAV = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
];

const EXPLORE_CATEGORIES = [
  {
    category: "Word & Spiritual Life",
    items: [
      {
        name: "Devotionals",
        href: "/devotions",
        icon: BookOpen,
        desc: "Daily scripture & teachings",
        badge: "Daily",
        gradient: "from-blue-500/20 to-cyan-500/20 text-blue-600",
      },
      {
        name: "Salvation Decisions",
        href: "/salvation",
        icon: HeartHandshake,
        desc: "New converts discipleship",
        badge: "Life",
        gradient: "from-rose-500/20 to-orange-500/20 text-rose-600",
      },
      {
        name: "Praise Testimonies",
        href: "/testimony",
        icon: Sparkles,
        desc: "God's goodness & miracles",
        gradient: "from-amber-500/20 to-yellow-500/20 text-amber-600",
      },
    ],
  },
  {
    category: "Community & Worship",
    items: [
      {
        name: "Church Events",
        href: "/events",
        icon: Calendar,
        desc: "Summits, outreaches & conferences",
        gradient: "from-emerald-500/20 to-green-500/20 text-emerald-600",
      },
      {
        name: "Photo Gallery",
        href: "/gallery",
        icon: Camera,
        desc: "Moments in God's presence",
        gradient: "from-purple-500/20 to-pink-500/20 text-purple-600",
      },
      {
        name: "Leadership Team",
        href: "/about#leadership",
        icon: Users,
        desc: "Team leading Kapchorwa",
        badge: "Team",
        gradient: "from-amber-500/20 to-amber-600/20 text-amber-700",
      },
    ],
  },
  {
    category: "Giving & Contact",
    items: [
      {
        name: "Tithes & Offerings",
        href: "/give",
        icon: Heart,
        desc: "Partner with gospel expansion",
        gradient: "from-red-500/20 to-rose-500/20 text-red-600",
      },
      {
        name: "Church Office",
        href: "/contact",
        icon: Phone,
        desc: "Kapchorwa location & lines",
        gradient: "from-slate-500/20 to-neutral-500/20 text-neutral-700",
      },
    ],
  },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const isHome = pathname === "/";

  // Track scroll position for dynamic glass styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  const isMoreActive = EXPLORE_CATEGORIES.some((cat) =>
    cat.items.some((item) => item.href === pathname)
  );

  return (
    <>
      {/* 1. TOP CREATIVE ANNOUNCEMENT RIBBON */}
      <div className="relative z-50 bg-gradient-to-r from-neutral-950 via-highland-950 to-neutral-950 text-white text-[11px] py-1.5 px-4 border-b border-white/10 hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between font-medium">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-highland-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-highland-400" />
            </span>
            <span className="text-neutral-300">
              Kapchorwa Town, Uganda • Cheptegei Foundation Office
            </span>
          </div>

          <div className="flex items-center gap-5 text-neutral-300">
            <span className="flex items-center gap-1.5">
              <Flame className="h-3 w-3 text-amber-400" />
              <span>Sunday Services: <strong className="text-white">9:00 AM & 11:00 AM</strong></span>
            </span>
            <span className="text-white/20">|</span>
            <span className="text-highland-300">
              Thursday Fellowship: <strong className="text-white">5:00 PM</strong>
            </span>
          </div>
        </div>
      </div>

      {/* 2. FLOATING DYNAMIC GLASS HEADER */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          mobileMenuOpen
            ? "py-3 bg-white text-neutral-900 border-b border-neutral-200 shadow-md"
            : scrolled
            ? "py-2 sm:py-3 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.08)] border-b border-neutral-200 text-neutral-900"
            : "py-3 sm:py-4 bg-white shadow-xs border-b border-neutral-200 text-neutral-900"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* BRAND LOGO WITH GLOW PILL */}
            <Link href="/" className="group flex items-center gap-3">
              <div className="relative h-11 w-32 sm:w-36 transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/images/logo.png"
                  alt="Manifest Kapchorwa"
                  fill
                  priority
                  className="object-contain object-left"
                  sizes="160px"
                />
              </div>

              {/* Sub-badge */}
              <div className="border-l border-neutral-200 pl-2.5 hidden sm:block">
                <span className="text-[11px] font-black uppercase tracking-wider block leading-tight text-neutral-900">
                  Kapchorwa
                </span>
                <span className="text-[9px] font-bold uppercase tracking-widest text-highland-600 block">
                  Manifest Ministry
                </span>
              </div>
            </Link>

            {/* FLOATING PILL NAVIGATION (Desktop) */}
            <nav className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-full border border-neutral-200/80 bg-neutral-100/80 backdrop-blur-xl shadow-xs">
              {MAIN_NAV.map((link) => {
                const isActive = pathname === link.href;
                const isHovered = hoveredNav === link.href;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onMouseEnter={() => setHoveredNav(link.href)}
                    onMouseLeave={() => setHoveredNav(null)}
                    className="relative px-4 py-1.5 text-xs font-bold rounded-full transition-colors select-none"
                  >
                    {/* Active / Hover Motion Pill Background */}
                    {isActive && (
                      <motion.div
                        layoutId="nav-active-pill"
                        className="absolute inset-0 rounded-full shadow-xs bg-white text-neutral-950 border border-neutral-200/50"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}

                    {!isActive && isHovered && (
                      <motion.div
                        layoutId="nav-hover-pill"
                        className="absolute inset-0 rounded-full bg-neutral-200/70"
                        transition={{ type: "spring", stiffness: 400, damping: 35 }}
                      />
                    )}

                    <span
                      className={`relative z-10 transition-colors ${
                        isActive
                          ? "text-neutral-950 font-black"
                          : "text-neutral-600 hover:text-neutral-900 font-semibold"
                      }`}
                    >
                      {link.name}
                    </span>
                  </Link>
                );
              })}

              {/* CREATIVE EXPLORE MEGA DROPDOWN BUTTON */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`relative px-4 py-1.5 text-xs font-bold rounded-full transition-all flex items-center gap-1.5 select-none ${
                    isMoreActive || dropdownOpen
                      ? "bg-white text-neutral-950 shadow-xs font-black border border-neutral-200/50"
                      : "text-neutral-600 hover:text-neutral-900 font-semibold"
                  }`}
                >
                  <Compass className="h-3.5 w-3.5 text-highland-600" />
                  <span>Explore</span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform duration-200 ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* MEGA-MENU FLYOUT */}
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 12, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.96 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute right-0 top-full mt-3 w-[620px] rounded-3xl bg-white border border-neutral-200 shadow-[0_20px_60px_rgba(0,0,0,0.22)] p-5 z-50 text-neutral-900"
                    >
                      <div className="grid grid-cols-3 gap-5">
                        {EXPLORE_CATEGORIES.map((section, sIdx) => (
                          <div key={sIdx} className="space-y-3">
                            <h5 className="text-[10px] font-black uppercase tracking-wider text-neutral-400 px-1">
                              {section.category}
                            </h5>
                            <div className="space-y-1">
                              {section.items.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href;
                                return (
                                  <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setDropdownOpen(false)}
                                    className={`group flex flex-col p-2 rounded-2xl transition-all ${
                                      isActive
                                        ? "bg-highland-50 border border-highland-200"
                                        : "hover:bg-neutral-50 hover:shadow-xs"
                                    }`}
                                  >
                                    <div className="flex items-center gap-2">
                                      <div
                                        className={`flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-br ${item.gradient} transition-transform group-hover:scale-110`}
                                      >
                                        <Icon className="h-3.5 w-3.5" />
                                      </div>
                                      <div className="min-w-0 flex-1">
                                        <div className="flex items-center justify-between">
                                          <span className="text-xs font-bold text-neutral-900 group-hover:text-highland-700 transition-colors">
                                            {item.name}
                                          </span>
                                          {item.badge && (
                                            <span className="px-1.5 py-0.5 rounded-full text-[8px] font-black uppercase bg-amber-400 text-neutral-950">
                                              {item.badge}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                    <p className="text-[10px] text-neutral-500 mt-1 pl-9 line-clamp-1">
                                      {item.desc}
                                    </p>
                                  </Link>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Dropdown Footer */}
                      <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500 px-1">
                        <span className="flex items-center gap-1.5 font-medium">
                          <MapPin className="h-3 w-3 text-highland-600" />
                          <span>Kapchorwa Sanctuary • Eastern Uganda</span>
                        </span>
                        <a
                          href="https://phaneroo.org"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-highland-700 font-bold hover:underline"
                        >
                          <span>Phaneroo Global</span>
                          <ArrowUpRight className="h-3 w-3" />
                        </a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>

            {/* ACTION CTA BUTTONS */}
            <div className="hidden sm:flex items-center gap-2.5">
              <Link href="/give">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs font-bold rounded-full transition-all text-neutral-700 border-neutral-200 bg-white hover:bg-neutral-100 shadow-xs"
                >
                  <Heart className="h-3.5 w-3.5 mr-1 text-rose-500" />
                  <span>Give</span>
                </Button>
              </Link>

              <Link href="/register">
                <Button
                  size="sm"
                  className="rounded-full bg-gradient-to-r from-highland-500 via-highland-600 to-highland-700 hover:from-highland-600 hover:to-highland-800 text-white font-bold text-xs shadow-[0_4px_16px_rgba(114,183,41,0.35)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 px-4"
                >
                  <UserPlus className="h-3.5 w-3.5 mr-1.5" />
                  <span>Join / Register</span>
                </Button>
              </Link>
            </div>

            {/* MOBILE MENU TOGGLE */}
            <div className="flex items-center gap-2.5 md:hidden">
              {!mobileMenuOpen && (
                <Link href="/register">
                  <Button
                    size="sm"
                    className="rounded-full text-xs font-bold px-3.5 h-8 bg-gradient-to-r from-highland-500 to-highland-600 hover:from-highland-600 hover:to-highland-700 text-white shadow-sm"
                  >
                    Join
                  </Button>
                </Link>
              )}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="h-9 w-9 rounded-full flex items-center justify-center transition-all bg-neutral-100 text-neutral-900 hover:bg-neutral-200 border border-neutral-200 shadow-xs"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5 text-neutral-900 stroke-[2.5]" />
                ) : (
                  <Menu className="h-5 w-5 stroke-[2.5] text-neutral-900" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 3. MOBILE FULL-SCREEN CREATIVE DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-x-0 top-[60px] sm:top-[64px] z-50 bg-white text-neutral-900 border-b border-neutral-200 shadow-2xl p-5 md:hidden max-h-[calc(100vh-64px)] overflow-y-auto space-y-5"
          >
            {/* Top 3 Quick Links */}
            <div className="grid grid-cols-3 gap-2">
              {MAIN_NAV.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`py-3 px-2 rounded-2xl text-center text-xs font-black transition-all ${
                      isActive
                        ? "bg-highland-600 text-white shadow-md shadow-highland-600/30"
                        : "bg-neutral-100 text-neutral-800 hover:bg-neutral-200 border border-neutral-200/60"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            {/* Categorized Links */}
            <div className="space-y-4 pt-2 border-t border-neutral-100">
              {EXPLORE_CATEGORIES.map((section, idx) => (
                <div key={idx} className="space-y-2">
                  <h6 className="text-[10px] font-black uppercase tracking-wider text-neutral-400 px-1">
                    {section.category}
                  </h6>
                  <div className="grid grid-cols-2 gap-2">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center gap-2.5 p-2.5 rounded-2xl text-xs font-bold transition-all ${
                            isActive
                              ? "bg-highland-50 text-highland-900 border border-highland-300 font-extrabold"
                              : "bg-neutral-50 text-neutral-900 hover:bg-neutral-100 border border-neutral-200/80"
                          }`}
                        >
                          <div
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${item.gradient} shadow-xs`}
                          >
                            <Icon className="h-4 w-4" />
                          </div>
                          <span className="truncate text-neutral-900 font-bold">{item.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Action Buttons */}
            <div className="pt-2 space-y-2.5">
              <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full rounded-2xl font-bold bg-gradient-to-r from-highland-500 via-highland-600 to-highland-700 hover:from-highland-600 hover:to-highland-800 text-white shadow-lg shadow-highland-600/30 py-5">
                  <UserPlus className="h-4 w-4 mr-2" />
                  <span>Join / Register as Member</span>
                </Button>
              </Link>
              <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-1 px-1">
                <span>Kapchorwa Town, Uganda</span>
                <span className="text-highland-700 font-bold">+256 770 123456</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
