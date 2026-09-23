import React from "react";
import Link from "next/link";
import { DevotionsService } from "@/services/devotions.service";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, User, ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/utils";

export const metadata = {
  title: "Written Devotionals",
  description: "Daily and weekly spiritual devotionals from Manifest Kapchorwa pastors and teachers.",
};

export const revalidate = 60;

export default async function DevotionsPage() {
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
            <Card key={devotion.id} className="hover:shadow-md transition-shadow border-t-4 border-t-highland-800 flex flex-col justify-between">
              <CardHeader>
                <div className="flex items-center justify-between text-xs text-neutral-500 mb-1">
                  <span>{formatDate(devotion.publishedAt || devotion.createdAt)}</span>
                  <div className="flex items-center gap-1 text-highland-800 font-medium">
                    <User className="h-3 w-3" />
                    <span>{devotion.author}</span>
                  </div>
                </div>
                <CardTitle className="text-xl">{devotion.title}</CardTitle>
                <CardDescription className="line-clamp-3 leading-relaxed">
                  {devotion.excerpt}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={`/devotions/${devotion.slug}`}>
                  <Button variant="outline" size="sm" className="w-full text-xs justify-between">
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
