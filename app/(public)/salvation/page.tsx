import React from "react";
import Link from "next/link";
import { ConvertForm } from "./convert-form";

export const metadata = {
  title: "New Converts Registration",
  description: "Register your decision to follow Jesus Christ or record souls won during mobilization and outreach in Kapchorwa.",
};

export default function SalvationPage() {
  return (
    <div>
      {/* Top Highland / Phaneroo Style Green Banner */}
      <div className="bg-[#78a928] text-white py-8 sm:py-12 px-4 sm:px-6 lg:px-8 border-b border-[#6ba020]">
        <div className="max-w-5xl mx-auto space-y-1.5">
          <h1 className="font-heading text-2xl sm:text-4xl font-bold tracking-tight text-white">
            New Converts Registration
          </h1>
          <div className="text-xs sm:text-sm text-white/90 flex items-center gap-2">
            <Link href="/" className="hover:underline">
              Home
            </Link>
            <span>→</span>
            <span className="font-medium text-white">New Converts Registration</span>
          </div>
        </div>
      </div>

      {/* Main Registration Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
        <ConvertForm />
      </div>
    </div>
  );
}
