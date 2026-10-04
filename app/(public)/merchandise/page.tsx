import React from "react";
import { Badge } from "@/components/ui/badge";
import { MerchandiseClient } from "./merchandise-client";

export const metadata = {
  title: "Official Merchandise Store — T-Shirts, Hoodies, Caps & Accessories",
  description:
    "Official Phaneroo and Manifest Kapchorwa merchandise. T-shirts, caps, hoodies, and accessories sourced from distribution.phaneroo.org with local pickup in Kapchorwa.",
};

export default function MerchandisePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <Badge variant="clay">Official Ministry Merchandise</Badge>
        <h1 className="font-heading text-3xl sm:text-5xl font-bold text-neutral-900">
          Phaneroo & Manifest Store
        </h1>
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-neutral-600 leading-relaxed">
          Wear and carry the manifestation of the Word everywhere you go. High-quality official T-shirts, embroidered caps, fleece hoodies, and lifestyle accessories brought directly from Phaneroo Distribution.
        </p>
      </div>

      {/* Interactive Store Client */}
      <MerchandiseClient />
    </div>
  );
}
