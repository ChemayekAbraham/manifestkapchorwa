"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  ExternalLink,
  Camera,
  Sparkles,
  Share2,
  Check,
  MapPin,
} from "lucide-react";

export interface GalleryImage {
  id: string;
  title: string;
  category: "Kapchorwa Outreach" | "Cheptegei Foundation" | "Worship & Celebration" | "Apostle Grace Lubega" | "Phaneroo Grounds" | "Fellowship";
  thumbnailUrl: string;
  fullUrl: string;
  description: string;
  date?: string;
  location?: string;
}

const GALLERY_ITEMS: GalleryImage[] = [
  {
    id: "kapchorwa-street-mission-team",
    title: "Street Mission Outreach Team — Kapchorwa Town",
    category: "Kapchorwa Outreach",
    thumbnailUrl: "/images/gallery/kapchorwa-street-mission-team.jpg",
    fullUrl: "/images/gallery/kapchorwa-street-mission-team.jpg",
    description: "Passionate brethren and ministers taking the Gospel to the streets and communities of Kapchorwa.",
    date: "Street Outreach 2026",
    location: "Kapchorwa Town",
  },
  {
    id: "kapchorwa-evangelism-outreach",
    title: "Taking the Word to the Marketplaces & Streets",
    category: "Kapchorwa Outreach",
    thumbnailUrl: "/images/gallery/kapchorwa-evangelism-outreach.jpg",
    fullUrl: "/images/gallery/kapchorwa-evangelism-outreach.jpg",
    description: "Ministers reaching souls on the streets, sharing the love and transformative power of Jesus Christ.",
    date: "Community Outreach",
    location: "Kapchorwa Municipality",
  },
  {
    id: "kapchorwa-youth-preaching",
    title: "Bold Proclamation of the Gospel",
    category: "Kapchorwa Outreach",
    thumbnailUrl: "/images/gallery/kapchorwa-youth-preaching.jpg",
    fullUrl: "/images/gallery/kapchorwa-youth-preaching.jpg",
    description: "Zealous young ministers proclaiming Christ without shame, igniting faith across the highland hills.",
    date: "Open-Air Ministry",
    location: "Kapchorwa Town",
  },
  {
    id: "kapchorwa-district-headquarters-witnessing",
    title: "Personal Evangelism at District Headquarters",
    category: "Kapchorwa Outreach",
    thumbnailUrl: "/images/gallery/kapchorwa-district-headquarters-witnessing.jpg",
    fullUrl: "/images/gallery/kapchorwa-district-headquarters-witnessing.jpg",
    description: "One-on-one ministry and prayer at Kapchorwa District Local Government Headquarters.",
    date: "Civic & Marketplace Ministry",
    location: "District Headquarters",
  },
  {
    id: "kapchorwa-declaration-prayer",
    title: "Prophetic Proclamation & Prayer Over the Highlands",
    category: "Kapchorwa Outreach",
    thumbnailUrl: "/images/gallery/kapchorwa-declaration-prayer.jpg",
    fullUrl: "/images/gallery/kapchorwa-declaration-prayer.jpg",
    description: "Lifting holy hands in prayer and decreeing the reign of Christ over the families and land of Kapchorwa.",
    date: "Highland Intercession",
    location: "Kapchorwa",
  },
  {
    id: "kapchorwa-roadside-worship-proclamation",
    title: "Roadside Worship & Open-Air Proclamation",
    category: "Kapchorwa Outreach",
    thumbnailUrl: "/images/gallery/kapchorwa-roadside-worship-proclamation.jpg",
    fullUrl: "/images/gallery/kapchorwa-roadside-worship-proclamation.jpg",
    description: "Lifting up praises and declaring the Word of life along the busy streets and thoroughfares of Kapchorwa.",
    date: "Street Worship",
    location: "Kapchorwa Main Road",
  },
  {
    id: "kapchorwa-prophetic-direction",
    title: "Directing Hearts to the Savior",
    category: "Kapchorwa Outreach",
    thumbnailUrl: "/images/gallery/kapchorwa-prophetic-direction.jpg",
    fullUrl: "/images/gallery/kapchorwa-prophetic-direction.jpg",
    description: "Pointing the lost to Christ Jesus with boldness, power, and fervent intercession alongside prayer partners.",
    date: "Gospel Campaign",
    location: "Kapchorwa Town",
  },
  {
    id: "kapchorwa-marketplace-conversation",
    title: "Marketplace Evangelism & One-on-One Ministry",
    category: "Kapchorwa Outreach",
    thumbnailUrl: "/images/gallery/kapchorwa-marketplace-conversation.jpg",
    fullUrl: "/images/gallery/kapchorwa-marketplace-conversation.jpg",
    description: "Engaging traders, shoppers, and community members with the Gospel of grace in Kapchorwa shopping centers.",
    date: "Marketplace Mission",
    location: "Silus Shopping Centre, Kapchorwa",
  },
  {
    id: "kapchorwa-youth-mission-team",
    title: "Youth Evangelical Force on the Move",
    category: "Kapchorwa Outreach",
    thumbnailUrl: "/images/gallery/kapchorwa-youth-mission-team.jpg",
    fullUrl: "/images/gallery/kapchorwa-youth-mission-team.jpg",
    description: "Energized young disciples unified in vision, advancing the Kingdom across neighborhoods and hilltops.",
    date: "Youth Outreach 2026",
    location: "Kapchorwa Municipality",
  },
  {
    id: "cheptegei-foundation-evening-service",
    title: "Evening Fellowship Gathering — Cheptegei Foundation",
    category: "Cheptegei Foundation",
    thumbnailUrl: "/images/gallery/cheptegei-foundation-evening-service.jpg",
    fullUrl: "/images/gallery/cheptegei-foundation-evening-service.jpg",
    description: "Believers gathered under the highland evening sky at Joshua Cheptegei Foundation, feeding on the uncompromised Word.",
    date: "Weekly Fellowship Service",
    location: "Joshua Cheptegei Foundation, Kapchorwa",
  },
  {
    id: "cheptegei-foundation-service-grounds",
    title: "Open-Air Fellowship Grounds Overlooking the Valley",
    category: "Cheptegei Foundation",
    thumbnailUrl: "/images/gallery/cheptegei-foundation-service-grounds.jpg",
    fullUrl: "/images/gallery/cheptegei-foundation-service-grounds.jpg",
    description: "The scenic prayer and gathering grounds at the Cheptegei Foundation, set against the green mountain hills of Kapchorwa.",
    date: "Sanctuary Grounds",
    location: "Joshua Cheptegei Foundation Grounds",
  },
  {
    id: "cheptegei-foundation-night-fellowship",
    title: "Atmosphere of Word & Holy Spirit Impartation",
    category: "Cheptegei Foundation",
    thumbnailUrl: "/images/gallery/cheptegei-foundation-night-fellowship.jpg",
    fullUrl: "/images/gallery/cheptegei-foundation-night-fellowship.jpg",
    description: "Intense hunger and focus as saints listen attentively to the divine counsel during evening ministry sessions.",
    date: "Night Fellowship",
    location: "Joshua Cheptegei Foundation, Kapchorwa",
  },
  {
    id: "drone-grounds",
    title: "Vast Ocean of Believers at Phaneroo Grounds",
    category: "Phaneroo Grounds",
    thumbnailUrl: "https://phaneroo.org/wp-content/uploads/2024/11/Drone-7-768x424.jpg",
    fullUrl: "https://phaneroo.org/wp-content/uploads/2024/11/Drone-7.jpg",
    description: "Aerial perspective of tens of thousands responding to the call of God's Word in Kampala.",
    date: "Annual Celebration",
  },
  {
    id: "apostle-grace-17",
    title: "Apostle Grace Lubega Ministering with Power",
    category: "Apostle Grace Lubega",
    thumbnailUrl: "https://phaneroo.org/wp-content/uploads/2025/08/Anniversary-Apostle-Grace-Lubega-17-768x1152.jpg",
    fullUrl: "https://phaneroo.org/wp-content/uploads/2025/08/Anniversary-Apostle-Grace-Lubega-17-scaled.jpg",
    description: "Expounding the mysteries of the Kingdom and releasing the prophetic word for the nations.",
    date: "Anniversary Service",
  },
  {
    id: "pmg-worship",
    title: "Pure High Praises & Joyful Fellowship",
    category: "Worship & Celebration",
    thumbnailUrl: "https://phaneroo.org/wp-content/uploads/2024/11/PMG_9127-768x512.jpg",
    fullUrl: "https://phaneroo.org/wp-content/uploads/2024/11/PMG_9127.jpg",
    description: "Every gathering is an unreserved altar of passionate praise and intense thanksgiving.",
    date: "Sunday Gathering",
  },
  {
    id: "altar-ministry-0j6a",
    title: "Transformative Teaching of the Word",
    category: "Worship & Celebration",
    thumbnailUrl: "https://phaneroo.org/wp-content/uploads/2024/11/0J6A0335-768x511.jpg",
    fullUrl: "https://phaneroo.org/wp-content/uploads/2024/11/0J6A0335.jpg",
    description: "Hungry hearts receiving divine impartation that shifts destiny and breaks limitations.",
    date: "Weekly Fellowship",
  },
  {
    id: "apostle-grace-18",
    title: "The Heart of a Spiritual Father",
    category: "Apostle Grace Lubega",
    thumbnailUrl: "https://phaneroo.org/wp-content/uploads/2025/08/Anniversary-Apostle-Grace-Lubega-18-768x512.jpg",
    fullUrl: "https://phaneroo.org/wp-content/uploads/2025/08/Anniversary-Apostle-Grace-Lubega-18.jpg",
    description: "Sharing the joy of salvation and fatherly blessing with the congregants.",
    date: "Special Service",
  },
  {
    id: "anniversary-guests-1",
    title: "Celebration Guests & Partners",
    category: "Fellowship",
    thumbnailUrl: "https://phaneroo.org/wp-content/uploads/2025/08/Anniversary-Guests-1-scaled.jpg",
    fullUrl: "https://phaneroo.org/wp-content/uploads/2025/08/Anniversary-Guests-1-scaled.jpg",
    description: "Partners, ministers, and invited guests joined in unified worship across all chapters.",
    date: "Ministry Anniversary",
  },
  {
    id: "apostle-grace-19",
    title: "Standing in the Counsels of God",
    category: "Apostle Grace Lubega",
    thumbnailUrl: "https://phaneroo.org/wp-content/uploads/2025/08/Anniversary-Apostle-Grace-Lubega-19-768x512.jpg",
    fullUrl: "https://phaneroo.org/wp-content/uploads/2025/08/Anniversary-Apostle-Grace-Lubega-19-scaled.jpg",
    description: "Declaring the mind and counsel of the Father to an attentive generation.",
    date: "Prophetic Meeting",
  },
  {
    id: "anniversary-guests-2",
    title: "Believers Rejoicing in Faith",
    category: "Fellowship",
    thumbnailUrl: "https://phaneroo.org/wp-content/uploads/2025/08/Anniversary-Guests-2-scaled.jpg",
    fullUrl: "https://phaneroo.org/wp-content/uploads/2025/08/Anniversary-Guests-2-scaled.jpg",
    description: "Joy unspeakable and full of glory as the miraculous manifested across the congregation.",
    date: "Ministry Anniversary",
  },
  {
    id: "apostle-grace-20",
    title: "Anointed Apostolic Declaration",
    category: "Apostle Grace Lubega",
    thumbnailUrl: "https://phaneroo.org/wp-content/uploads/2025/08/Anniversary-Apostle-Grace-Lubega-20-768x512.jpg",
    fullUrl: "https://phaneroo.org/wp-content/uploads/2025/08/Anniversary-Apostle-Grace-Lubega-20-scaled.jpg",
    description: "Releasing grace upon families, marketplace leaders, and ministers of the Gospel.",
    date: "Celebration Service",
  },
  {
    id: "apostle-grace-1",
    title: "Apostle Grace Lubega — Make Manifest",
    category: "Apostle Grace Lubega",
    thumbnailUrl: "https://phaneroo.org/wp-content/uploads/2025/08/Anniversary-Apostle-Grace-Lubega-1-768x512.jpg",
    fullUrl: "https://phaneroo.org/wp-content/uploads/2025/08/Anniversary-Apostle-Grace-Lubega-1-scaled.jpg",
    description: "Leading the body of Christ into maturity, authority, and intimacy with the Holy Spirit.",
    date: "Global Broadcast",
  },
  {
    id: "apostle-grace-3",
    title: "Fervent Prayer & Deliverance",
    category: "Worship & Celebration",
    thumbnailUrl: "https://phaneroo.org/wp-content/uploads/2025/08/Anniversary-Apostle-Grace-Lubega-3-768x512.jpg",
    fullUrl: "https://phaneroo.org/wp-content/uploads/2025/08/Anniversary-Apostle-Grace-Lubega-3-scaled.jpg",
    description: "Chains broken, lives restored, and sick bodies healed under the heavy power of God.",
    date: "Miracle Service",
  },
  {
    id: "apostle-grace-4",
    title: "Deep Revelation in the Word",
    category: "Apostle Grace Lubega",
    thumbnailUrl: "https://phaneroo.org/wp-content/uploads/2025/08/Anniversary-Apostle-Grace-Lubega-4-768x512.jpg",
    fullUrl: "https://phaneroo.org/wp-content/uploads/2025/08/Anniversary-Apostle-Grace-Lubega-4-scaled.jpg",
    description: "Feeding believers with the strong meat of the Word, building solid foundations.",
    date: "Thursdays 5PM E.A.T",
  },
];

const CATEGORIES = [
  "All",
  "Kapchorwa Outreach",
  "Cheptegei Foundation",
  "Fellowship",
  "Worship & Celebration",
  "Apostle Grace Lubega",
  "Phaneroo Grounds",
] as const;

export function GalleryClient() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const filteredItems =
    selectedCategory === "All"
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === selectedCategory);

  const handleNext = useCallback(() => {
    if (activeImageIndex === null) return;
    setActiveImageIndex((prev) => (prev! + 1) % filteredItems.length);
  }, [activeImageIndex, filteredItems.length]);

  const handlePrev = useCallback(() => {
    if (activeImageIndex === null) return;
    setActiveImageIndex((prev) => (prev! - 1 + filteredItems.length) % filteredItems.length);
  }, [activeImageIndex, filteredItems.length]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (activeImageIndex === null) return;
      if (e.key === "Escape") setActiveImageIndex(null);
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeImageIndex, handleNext, handlePrev]);

  const currentImage = activeImageIndex !== null ? filteredItems[activeImageIndex] : null;

  const handleShare = (image: GalleryImage) => {
    if (navigator.share) {
      navigator.share({
        title: image.title,
        text: `${image.title} - Manifest Kapchorwa & Phaneroo Gallery`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-8">
      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setActiveImageIndex(null);
              }}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                isActive
                  ? "bg-highland-800 text-white shadow-md shadow-highland-900/20 scale-105"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900"
              }`}
            >
              {cat}
              {cat === "All" && (
                <span className="ml-1.5 opacity-70">({GALLERY_ITEMS.length})</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item, index) => (
          <div
            key={item.id}
            onClick={() => setActiveImageIndex(index)}
            className="group relative rounded-3xl overflow-hidden bg-neutral-900 cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 border border-neutral-200"
          >
            {/* Image Container */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-800">
              <Image
                src={item.thumbnailUrl}
                alt={item.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover object-center group-hover:scale-108 transition-transform duration-500 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/20 to-transparent opacity-60 group-hover:opacity-85 transition-opacity" />

              {/* Top Category Badge */}
              <div className="absolute top-3 left-3 z-10">
                <Badge variant="clay" className="text-[10px] bg-white/90 backdrop-blur-md text-neutral-900 font-bold border-none shadow-sm">
                  {item.category}
                </Badge>
              </div>

              {/* Hover Zoom Icon */}
              <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="h-8 w-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-neutral-900 shadow-md">
                  <Maximize2 className="h-4 w-4" />
                </div>
              </div>

              {/* Bottom Details Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4 z-10 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  {item.date && (
                    <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block">
                      {item.date}
                    </span>
                  )}
                  {item.location && (
                    <span className="text-[10px] font-medium text-neutral-300 flex items-center gap-0.5">
                      <MapPin className="h-2.5 w-2.5 text-ochre-400" />
                      {item.location}
                    </span>
                  )}
                </div>
                <h3 className="font-heading text-base font-bold text-white line-clamp-1 group-hover:text-amber-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-neutral-300 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Official Phaneroo Gallery Attribution Banner */}
      <div className="rounded-3xl bg-neutral-900 text-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 border border-neutral-800 shadow-xl">
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <Camera className="h-5 w-5 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Phaneroo Global Media
            </span>
          </div>
          <h4 className="font-heading text-xl sm:text-2xl font-bold text-white">
            Explore More Moments on phaneroo.org
          </h4>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-xl">
            Thousands of high-definition photographs documenting God’s glorious work across weekly services, crusades, and celebrations worldwide.
          </p>
        </div>
        <a
          href="https://phaneroo.org/gallery/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold px-5 py-3 text-xs sm:text-sm transition-all shadow-lg shrink-0"
        >
          <span>Visit Phaneroo Gallery</span>
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>

      {/* Lightbox Modal */}
      {currentImage && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setActiveImageIndex(null)}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={() => setActiveImageIndex(null)}
            className="absolute top-4 right-4 z-50 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            aria-label="Close photo preview"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Navigation Prev */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-50 h-12 w-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all shadow-xl hover:scale-110"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-7 w-7" />
          </button>

          {/* Navigation Next */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-50 h-12 w-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all shadow-xl hover:scale-110"
            aria-label="Next image"
          >
            <ChevronRight className="h-7 w-7" />
          </button>

          {/* Modal Content */}
          <div
            className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-[60vh] sm:h-[72vh] rounded-2xl overflow-hidden shadow-2xl bg-neutral-900 border border-neutral-800">
              <Image
                src={currentImage.fullUrl}
                alt={currentImage.title}
                fill
                priority
                sizes="100vw"
                className="object-contain"
              />
            </div>

            {/* Lightbox Caption & Details Bar */}
            <div className="w-full mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-white">
              <div className="space-y-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <Badge variant="clay" className="text-[10px] bg-amber-500 text-neutral-950 font-bold border-none">
                    {currentImage.category}
                  </Badge>
                  {currentImage.date && (
                    <span className="text-xs text-neutral-400 font-medium">
                      {currentImage.date}
                    </span>
                  )}
                  {currentImage.location && (
                    <span className="text-xs text-amber-300 font-medium flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {currentImage.location}
                    </span>
                  )}
                  <span className="text-xs text-neutral-500">
                    ({activeImageIndex! + 1} of {filteredItems.length})
                  </span>
                </div>
                <h3 className="font-heading text-lg sm:text-xl font-bold text-white">
                  {currentImage.title}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 max-w-2xl leading-relaxed">
                  {currentImage.description}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleShare(currentImage)}
                  className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 mr-1.5 text-green-400" />
                      <span>Copied link!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="h-3.5 w-3.5 mr-1.5" />
                      <span>Share</span>
                    </>
                  )}
                </Button>
                <a
                  href={currentImage.fullUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-neutral-900 hover:bg-neutral-100 text-xs font-bold transition-colors"
                >
                  <span>Open Full Size</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
