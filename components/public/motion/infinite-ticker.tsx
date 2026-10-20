"use client";

import React from "react";
import { Sparkles, Church, Heart, Flame, Shield, Compass } from "lucide-react";

const TICKER_ITEMS = [
  { text: "Word of Truth & Life", icon: Sparkles },
  { text: "Holy Spirit Revival in the Highlands", icon: Flame },
  { text: "Sunday Celebrations: 9:00 AM – 11:00 AM & 11:00 AM – 1:30 PM", icon: Church },
  { text: "Supernatural Grace & Salvation", icon: Heart },
  { text: "Thursday Word Fellowship: 5:00 PM – 9:00 PM", icon: Compass },
  { text: "Transforming Families & Generations", icon: Shield },
  { text: "Kapchorwa Town, Sebei Sub-Region", icon: Church },
];

export function InfiniteMotionTicker() {
  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-r from-neutral-950 via-highland-950 to-neutral-950 border-y border-white/10 py-3 select-none">
      {/* Left/Right Edge Shadows for smooth gradient fade */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-neutral-950 to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-neutral-950 to-transparent z-10" />

      {/* Marquee Track */}
      <div className="animate-marquee flex items-center gap-8 whitespace-nowrap">
        {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="inline-flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-neutral-200 hover:text-white transition-colors"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-highland-500/20 text-highland-400 border border-highland-400/30">
                <Icon className="h-3 w-3" />
              </span>
              <span>{item.text}</span>
              <span className="text-ochre-400/60 font-serif text-base ml-4">✦</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
