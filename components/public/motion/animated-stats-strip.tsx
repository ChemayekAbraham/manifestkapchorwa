"use client";

import React from "react";
import { motion } from "motion/react";
import { Users, HeartHandshake, MapPin, Sparkles } from "lucide-react";

const STATS = [
  {
    icon: Users,
    value: "500+",
    label: "Weekly Worshippers",
    sub: "Gathering in the sanctuary",
  },
  {
    icon: Sparkles,
    value: "100%",
    label: "Christ Centered",
    sub: "Apostolic teaching & truth",
  },
  {
    icon: MapPin,
    value: "12+",
    label: "Highland Parishes",
    sub: "Kapchorwa, Kween & Bukwo",
  },
  {
    icon: HeartHandshake,
    value: "24/7",
    label: "Prayer Intercession",
    sub: "Standing in the gap",
  },
];

export function AnimatedStatsStrip() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {STATS.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-sm hover:shadow-md hover:border-highland-300 transition-all text-center sm:text-left flex flex-col justify-between"
            >
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-highland-100 text-highland-700">
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <div>
                <span className="font-heading text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
                  {stat.value}
                </span>
                <h5 className="font-semibold text-xs sm:text-sm text-neutral-800 mt-0.5">
                  {stat.label}
                </h5>
                <p className="text-[11px] text-neutral-500 mt-0.5">{stat.sub}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
