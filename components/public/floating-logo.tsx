"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

export function FloatingLogo() {
  const [mounted, setMounted] = useState(false);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    let animId: number;
    let lastTime = performance.now();

    const logoEl = logoRef.current;
    if (!logoEl) return;

    // Measure logo dimensions
    let logoWidth = logoEl.offsetWidth || 140;
    let logoHeight = logoEl.offsetHeight || 240;

    // Start at random coordinates within the screen bounds
    const maxX = Math.max(10, window.innerWidth - logoWidth);
    const maxY = Math.max(10, window.innerHeight - logoHeight);
    let posX = Math.random() * (maxX - 20) + 10;
    let posY = Math.random() * (maxY - 20) + 10;

    // Constant smooth glide speed (pixels per second)
    const speed = 72;

    // Pick random non-trivial initial trajectory
    let angle = (Math.PI / 4) + (Math.random() * 0.5 - 0.25);
    if (Math.random() > 0.5) angle += Math.PI / 2;
    if (Math.random() > 0.5) angle += Math.PI;

    let vx = Math.cos(angle) * speed;
    let vy = Math.sin(angle) * speed;

    // Ensure velocity is never stalled on any axis
    if (Math.abs(vx) < 35) vx = vx < 0 ? -45 : 45;
    if (Math.abs(vy) < 35) vy = vy < 0 ? -45 : 45;

    let currentTilt = 0;
    let targetTilt = vx > 0 ? 5 : -5;

    const handleResize = () => {
      if (!logoRef.current) return;
      logoWidth = logoRef.current.offsetWidth || 140;
      logoHeight = logoRef.current.offsetHeight || 240;
    };
    window.addEventListener("resize", handleResize);

    const step = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      posX += vx * dt;
      posY += vy * dt;

      const curMaxX = Math.max(0, window.innerWidth - logoWidth);
      const curMaxY = Math.max(0, window.innerHeight - logoHeight);

      // Bounce off Left / Right edges
      if (posX <= 0) {
        posX = 0;
        vx = Math.abs(vx);
        // Slightly vary angle on bounce for dynamic organic path
        vy += (Math.random() - 0.5) * 8;
        targetTilt = 5;
      } else if (posX >= curMaxX) {
        posX = curMaxX;
        vx = -Math.abs(vx);
        vy += (Math.random() - 0.5) * 8;
        targetTilt = -5;
      }

      // Bounce off Top / Bottom edges
      if (posY <= 0) {
        posY = 0;
        vy = Math.abs(vy);
        vx += (Math.random() - 0.5) * 8;
      } else if (posY >= curMaxY) {
        posY = curMaxY;
        vy = -Math.abs(vy);
        vx += (Math.random() - 0.5) * 8;
      }

      // Re-normalize speed so it doesn't drift too fast or slow
      const currentSpeed = Math.hypot(vx, vy);
      if (currentSpeed > 0) {
        vx = (vx / currentSpeed) * speed;
        vy = (vy / currentSpeed) * speed;
      }

      // Smooth tilt towards heading
      currentTilt += (targetTilt - currentTilt) * 0.05;

      if (logoRef.current) {
        logoRef.current.style.transform = `translate3d(${posX}px, ${posY}px, 0) rotate(${currentTilt.toFixed(2)}deg)`;
      }

      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, [mounted]);

  if (!mounted) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-20 overflow-hidden select-none"
    >
      <div
        ref={logoRef}
        style={{
          opacity: 0.5,
          willChange: "transform",
        }}
        className="absolute top-0 left-0 w-28 sm:w-36 md:w-44 aspect-[258/441] drop-shadow-[0_12px_32px_rgba(0,0,0,0.22)] filter"
      >
        <Image
          src="/images/phaneroo-floating-emblem.png"
          alt=""
          fill
          priority
          unoptimized
          className="object-contain"
        />
      </div>
    </div>
  );
}
