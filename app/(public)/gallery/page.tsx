import React from "react";
import { Badge } from "@/components/ui/badge";
import { GalleryClient } from "./gallery-client";

export const metadata = {
  title: "Photo Gallery — Manifest Moments & Celebration",
  description:
    "Explore photo highlights from Manifest Kapchorwa and Phaneroo Ministries International gatherings, worship, and fellowship.",
};

export default function GalleryPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <Badge variant="clay">Make Manifest Moments</Badge>
        <h1 className="font-heading text-3xl sm:text-5xl font-bold text-neutral-900">
          Photo & Ministry Gallery
        </h1>
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-neutral-600 leading-relaxed">
          Witness the vibrant joy of fellowship, deep worship in the Holy Spirit, and the manifestation of God’s glory across our gatherings in Kapchorwa and beyond.
        </p>
      </div>

      {/* Interactive Gallery */}
      <GalleryClient />
    </div>
  );
}
