"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { motion } from "motion/react";

function getRandomPosition() {
  const minX = 4;
  const maxX = 78;
  const minY = 8;
  const maxY = 76;

  const randomX = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
  const randomY = Math.floor(Math.random() * (maxY - minY + 1)) + minY;
  const randomRotate = Math.floor(Math.random() * 34) - 17; // -17deg to +17deg
  const randomDuration = Math.floor(Math.random() * 5) + 11; // 11s to 15s smooth wander
  const randomScale = Number((0.95 + Math.random() * 0.15).toFixed(2)); // 0.95 to 1.10
  const randomOpacity = Number((0.35 + Math.random() * 0.12).toFixed(2)); // 0.35 to 0.47

  return {
    x: `${randomX}vw`,
    y: `${randomY}vh`,
    rotate: randomRotate,
    scale: randomScale,
    opacity: randomOpacity,
    duration: randomDuration,
  };
}

export function FloatingLogo() {
  const [mounted, setMounted] = useState(false);
  const [target, setTarget] = useState({
    x: "8vw",
    y: "18vh",
    rotate: 0,
    scale: 1,
    opacity: 0.38,
    duration: 12,
  });

  const nextRandomMove = useCallback(() => {
    setTarget(getRandomPosition());
  }, []);

  useEffect(() => {
    setMounted(true);
    // Kick off random movement after mounting
    const timer = setTimeout(() => {
      setTarget(getRandomPosition());
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-20 overflow-hidden select-none"
    >
      <motion.div
        animate={{
          x: target.x,
          y: target.y,
          rotate: target.rotate,
          scale: target.scale,
          opacity: target.opacity,
        }}
        transition={{
          duration: target.duration,
          ease: "easeInOut",
        }}
        onAnimationComplete={nextRandomMove}
        className="relative w-28 sm:w-36 md:w-44 aspect-[258/441] drop-shadow-[0_12px_32px_rgba(0,0,0,0.18)] filter transition-opacity"
      >
        <Image
          src="/images/phaneroo-floating-emblem.png"
          alt=""
          fill
          priority
          unoptimized
          className="object-contain"
        />
      </motion.div>
    </div>
  );
}
