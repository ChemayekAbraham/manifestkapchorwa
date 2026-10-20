"use client";

import React from "react";
import { motion } from "motion/react";

interface AnimatedSvgEmblemProps {
  className?: string;
  size?: number;
}

export function AnimatedSvgEmblem({ className = "", size = 160 }: AnimatedSvgEmblemProps) {
  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Background Soft Glow Aura */}
      <motion.div
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.35, 0.65, 0.35],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-0 rounded-full bg-gradient-to-tr from-highland-400 via-emerald-300 to-ochre-400 blur-2xl"
      />

      {/* SVG Animation Vector */}
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10 drop-shadow-[0_8px_24px_rgba(0,0,0,0.45)]"
      >
        <defs>
          {/* Gradient definitions */}
          <linearGradient id="emblemGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#ca8a04" />
          </linearGradient>

          <linearGradient id="highlandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8ed254" />
            <stop offset="100%" stopColor="#467619" />
          </linearGradient>

          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. Outer Orbit Ring with dashed rotation */}
        <motion.circle
          cx="100"
          cy="100"
          r="88"
          stroke="rgba(255, 255, 255, 0.25)"
          strokeWidth="1.5"
          strokeDasharray="4 8"
          animate={{ rotate: 360 }}
          transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "100px 100px" }}
        />

        {/* 2. Middle Radiant Ring with animated pulsing stroke */}
        <motion.circle
          cx="100"
          cy="100"
          r="74"
          stroke="url(#highlandGrad)"
          strokeWidth="2.5"
          strokeDasharray="16 12 8 12"
          animate={{
            rotate: -360,
            strokeDashoffset: [0, 96],
          }}
          transition={{
            rotate: { duration: 24, repeat: Infinity, ease: "linear" },
            strokeDashoffset: { duration: 6, repeat: Infinity, ease: "linear" },
          }}
          style={{ transformOrigin: "100px 100px" }}
          filter="url(#softGlow)"
        />

        {/* 3. Rotating 8-Point Apostolic Star Rays */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "100px 100px" }}
        >
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <motion.line
              key={deg}
              x1="100"
              y1="40"
              x2="100"
              y2="52"
              stroke="url(#emblemGoldGrad)"
              strokeWidth="2"
              strokeLinecap="round"
              transform={`rotate(${deg} 100 100)`}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                delay: (deg / 360) * 2,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.g>

        {/* 4. Kapchorwa Mountain Silhouette Peak */}
        <motion.path
          d="M 45 142 L 80 92 L 105 120 L 125 96 L 155 142 Z"
          fill="rgba(255, 255, 255, 0.12)"
          stroke="rgba(255, 255, 255, 0.4)"
          strokeWidth="1.5"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
        />

        {/* 5. Center Sacred Cross Emblem */}
        <motion.g
          animate={{
            scale: [0.96, 1.04, 0.96],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ transformOrigin: "100px 96px" }}
        >
          {/* Vertical Beam */}
          <path
            d="M 96 68 H 104 V 132 H 96 Z"
            fill="url(#emblemGoldGrad)"
            rx="2"
            filter="url(#softGlow)"
          />
          {/* Horizontal Beam */}
          <path
            d="M 80 82 H 120 V 90 H 80 Z"
            fill="url(#emblemGoldGrad)"
            rx="2"
            filter="url(#softGlow)"
          />
          {/* Core Light Center Jewel */}
          <circle cx="100" cy="86" r="3.5" fill="#ffffff" filter="url(#softGlow)" />
        </motion.g>

        {/* 6. Orbiting Blessing Particle Spark */}
        <motion.circle
          cx="100"
          cy="26"
          r="3"
          fill="#fef08a"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{ transformOrigin: "100px 100px" }}
          filter="url(#softGlow)"
        />
      </svg>
    </div>
  );
}
