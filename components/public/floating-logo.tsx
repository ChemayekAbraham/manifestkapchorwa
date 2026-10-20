"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";

export function FloatingLogo() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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
        initial={{ x: "5vw", y: "20vh", opacity: 0.08, rotate: 0 }}
        animate={{
          x: [
            "4vw",
            "78vw",
            "35vw",
            "82vw",
            "12vw",
            "70vw",
            "4vw",
          ],
          y: [
            "18vh",
            "35vh",
            "72vh",
            "15vh",
            "60vh",
            "80vh",
            "18vh",
          ],
          rotate: [0, 10, -8, 14, -6, 8, 0],
          scale: [1, 1.08, 0.96, 1.1, 0.98, 1.05, 1],
          opacity: [0.09, 0.15, 0.1, 0.16, 0.09, 0.14, 0.09],
        }}
        transition={{
          duration: 48,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "loop",
        }}
        className="relative w-24 sm:w-32 md:w-36 aspect-[258/441] drop-shadow-[0_8px_24px_rgba(0,0,0,0.12)] filter"
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
