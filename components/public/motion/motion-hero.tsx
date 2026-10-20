"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import {
  UserPlus,
  Clock,
  MapPin,
  Sparkles,
  ArrowRight,
  Radio,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface MotionHeroProps {
  heroContentText?: string;
}

export function MotionHero({ heroContentText }: MotionHeroProps) {
  return (
    <section className="relative overflow-hidden bg-neutral-950 text-white pt-14 pb-24 sm:pt-20 sm:pb-32 px-4 sm:px-6 lg:px-8 shadow-2xl">
      {/* 1. Living Aurora & Mesh Background Glows */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Mobile View Portrait Image */}
        <div className="block sm:hidden absolute inset-0">
          <Image
            src="/images/hero-mobile.jpg"
            alt="Kapchorwa Manifest Worship"
            fill
            priority
            className="object-cover object-top opacity-60 filter brightness-105 contrast-105"
            sizes="100vw"
          />
        </div>
        {/* Desktop Landscape Image */}
        <div className="hidden sm:block absolute inset-0">
          <Image
            src="/images/hero.jpg"
            alt="Kapchorwa Manifest Worship & Word"
            fill
            priority
            className="object-cover object-center opacity-70 filter brightness-110 contrast-105"
            sizes="100vw"
          />
        </div>

        {/* Dynamic Animated Aurora Orbs */}
        <motion.div
          animate={{
            x: [0, 60, -30, 0],
            y: [0, -40, 30, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-highland-500/25 blur-[120px]"
        />
        <motion.div
          animate={{
            x: [0, -50, 40, 0],
            y: [0, 50, -30, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 -right-24 w-[28rem] h-[28rem] rounded-full bg-ochre-500/20 blur-[130px]"
        />

        {/* Ambient Darkened Gradient for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/70 via-neutral-950/40 to-neutral-950/90" />
      </div>

      {/* 2. Main Hero Content Container */}
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Top Live Badge */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-6"
        >
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-neutral-200 shadow-lg">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-highland-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-highland-400" />
            </span>
            <span>Sunday Celebrations: 9:00 AM – 11:00 AM & 11:00 AM – 1:30 PM E.A.T</span>
            <span className="text-white/40">•</span>
            <span className="text-ochre-300 font-bold hidden sm:inline">Kapchorwa Sanctuary</span>
          </div>
        </motion.div>

        {/* Main Content: Headlines & Call-to-actions */}
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="font-heading text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.08] drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]"
          >
            Proclaiming Christ & Transforming Lives in{" "}
            <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-highland-300 via-ochre-300 to-highland-400 drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
              Kapchorwa
              <svg
                className="absolute left-0 -bottom-2 w-full h-3 text-highland-400 overflow-visible opacity-80"
                viewBox="0 0 100 12"
                preserveAspectRatio="none"
              >
                <motion.path
                  d="M 0,8 Q 25,2 50,8 T 100,8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, delay: 0.7 }}
                />
              </svg>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="max-w-2xl mx-auto text-base sm:text-lg text-neutral-200 font-normal leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]"
          >
            {heroContentText ||
              "Welcome to Manifest Kapchorwa. We are a family of believers committed to the pure apostolic Word of God, fervent prayer, vibrant worship, and transforming communities across Mt. Elgon and Eastern Uganda."}
          </motion.p>

          {/* Action Buttons with Spring Feedback */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2"
          >
            <Link href="/register" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto gap-2.5 bg-gradient-to-r from-highland-500 to-highland-600 hover:from-highland-600 hover:to-highland-700 text-white shadow-[0_4px_20px_rgba(114,183,41,0.45)] font-bold text-base border border-highland-400/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <UserPlus className="h-5 w-5" />
                <span>Join / Register with Us</span>
                <ArrowRight className="h-4 w-4 ml-1 opacity-70" />
              </Button>
            </Link>
            <Link href="/services" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto text-white bg-white/10 hover:bg-white/20 border-white/30 backdrop-blur-md font-semibold transition-all hover:-translate-y-0.5"
              >
                <Clock className="h-4 w-4 mr-2 text-ochre-300" />
                <span>Service Times</span>
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* 3. Bottom Highlands Metric Strip with Motion Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6 pt-10 mt-10 border-t border-white/15 max-w-4xl mx-auto text-left"
        >
          <div className="bg-neutral-900/70 rounded-2xl p-4 border border-white/15 backdrop-blur-md shadow-sm hover:border-highland-400/40 transition-colors">
            <span className="text-xs text-highland-400 block font-semibold">Sunday Services</span>
            <span className="font-heading font-bold text-sm sm:text-base text-white">
              9:00 AM – 11:00 AM & 11:00 AM – 1:30 PM
            </span>
          </div>
          <div className="bg-neutral-900/70 rounded-2xl p-4 border border-white/15 backdrop-blur-md shadow-sm hover:border-highland-400/40 transition-colors">
            <span className="text-xs text-highland-400 block font-semibold">Thursday Service</span>
            <span className="font-heading font-bold text-sm sm:text-base text-white">
              Thurs 5:00 PM – 9:00 PM
            </span>
          </div>
          <div className="col-span-2 sm:col-span-1 bg-neutral-900/70 rounded-2xl p-4 border border-white/15 backdrop-blur-md shadow-sm hover:border-highland-400/40 transition-colors">
            <span className="text-xs text-highland-400 block font-semibold">Location</span>
            <span className="font-heading font-bold text-sm sm:text-base text-white">
              Cheptegei Foundation, Kapchorwa
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
