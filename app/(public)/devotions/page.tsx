import React from "react";
import Link from "next/link";
import { DevotionsService } from "@/services/devotions.service";
import { PhanerooSyncService } from "@/services/phaneroo-sync.service";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, User, ArrowRight, Sparkles } from "lucide-react";
import { formatDate } from "@/lib/utils";

export const metadata = {
  title: "Written Devotionals & Daily Teachings",
  description: "Daily spiritual devotionals and biblical teachings from Apostle Grace Lubega and Manifest Kapchorwa pastors.",
};

export const revalidate = 60;

export default async function DevotionsPage() {
  // Sync latest devotions from Phaneroo in the background
  try {
    await PhanerooSyncService.syncLatestDevotions();
  } catch {
    // Non-blocking fallback
  }

  const result = await DevotionsService.listPublic(1, 20).catch(() => ({ items: [], total: 0 }));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-3">
        <Badge variant="clay">Spiritual Encouragement</Badge>
        <h1 className="font-heading text-3xl sm:text-5xl font-bold text-neutral-900">
          Written Devotionals
        </h1>
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-neutral-600 leading-relaxed">
          Nourish your spirit with practical biblical teachings, reflections, and prayers from our ministry leadership.
        </p>
      </div>

      {result.items.length === 0 ? (
        <div className="rounded-3xl bg-white border border-neutral-200 p-12 text-center text-neutral-500 space-y-2">
          <BookOpen className="h-10 w-10 text-neutral-400 mx-auto" />
          <h3 className="font-heading text-lg font-bold text-neutral-800">No Devotionals Published Yet</h3>
          <p className="text-xs text-neutral-500">New devotionals will be available here soon.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {result.items.map((devotion) => (
            <Card
              key={devotion.id}
              className="overflow-hidden hover:shadow-lg transition-all border border-neutral-200/80 flex flex-col justify-between group rounded-3xl bg-white"
            >
              {devotion.imageUrl && (
                <div className="relative aspect-video w-full overflow-hidden bg-neutral-950">
                  <img
                    src={devotion.imageUrl}
                    alt={devotion.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-3 text-[11px] font-bold text-white bg-highland-900/90 px-2.5 py-0.5 rounded-full backdrop-blur-xs border border-white/20">
                    {devotion.author}
                  </span>
                </div>
              )}
              <CardHeader className={devotion.imageUrl ? "pt-4" : ""}>
                <div className="flex items-center justify-between text-xs text-neutral-500 mb-1">
                  <span>{formatDate(devotion.publishedAt || devotion.createdAt)}</span>
                  {!devotion.imageUrl && (
                    <div className="flex items-center gap-1 text-highland-800 font-medium">
                      <User className="h-3 w-3" />
                      <span>{devotion.author}</span>
                    </div>
                  )}
                </div>
                <CardTitle className="text-xl group-hover:text-highland-800 transition-colors leading-snug">
                  {devotion.title}
                </CardTitle>
                <CardDescription className="line-clamp-3 leading-relaxed text-xs sm:text-sm">
                  {devotion.excerpt}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Link href={`/devotions/${devotion.slug}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs justify-between group-hover:bg-highland-50 group-hover:border-highland-300 font-semibold"
                  >
                    <span>Read Full Devotional</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
