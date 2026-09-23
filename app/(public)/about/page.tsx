import React from "react";
import { ContentService } from "@/services/content.service";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, ShieldCheck, Heart, Users, Compass } from "lucide-react";

export const metadata = {
  title: "About Us — Vision, Mission & Faith",
  description:
    "Learn about Manifest Kapchorwa, our vision for the Sebei sub-region, pastoral leadership, and biblical statement of faith.",
};

export const revalidate = 60;

export default async function AboutPage() {
  const [vision, mission, faith] = await Promise.all([
    ContentService.getContent("ABOUT_VISION"),
    ContentService.getContent("ABOUT_MISSION"),
    ContentService.getContent("ABOUT_STATEMENT_OF_FAITH"),
  ]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Page Header */}
      <div className="text-center space-y-3">
        <Badge variant="clay">About Manifest Kapchorwa</Badge>
        <h1 className="font-heading text-3xl sm:text-5xl font-bold text-neutral-900">
          Who We Are & What We Believe
        </h1>
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-neutral-600 leading-relaxed">
          Manifest Kapchorwa is a community of believers rooted in the grace and love of Jesus Christ, worshipping together in the heart of the eastern Ugandan highlands.
        </p>
      </div>

      {/* Vision & Mission Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-t-4 border-t-highland-800 bg-white">
          <CardHeader>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-highland-100 text-highland-800 mb-2">
              <Compass className="h-5 w-5" />
            </div>
            <CardTitle className="text-xl">{vision.title}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-neutral-600 leading-relaxed">
            {vision.content}
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-clay-600 bg-white">
          <CardHeader>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-clay-100 text-clay-700 mb-2">
              <Users className="h-5 w-5" />
            </div>
            <CardTitle className="text-xl">{mission.title}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-neutral-600 leading-relaxed">
            {mission.content}
          </CardContent>
        </Card>
      </div>

      {/* Statement of Faith */}
      <div className="rounded-3xl bg-cream-100 border border-cream-200 p-6 sm:p-10 space-y-6">
        <div className="space-y-2">
          <Badge variant="ochre">Our Foundation</Badge>
          <h2 className="font-heading text-2xl font-bold text-neutral-900">{faith.title}</h2>
        </div>
        <p className="text-sm text-neutral-700 leading-relaxed font-serif text-base sm:text-lg italic bg-white/70 p-6 rounded-2xl border border-neutral-200/60">
          "{faith.content}"
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-neutral-700 font-medium">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-highland-700 shrink-0" />
            <span>Infallible Authority of Scripture</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-highland-700 shrink-0" />
            <span>Salvation by Grace through Faith</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-highland-700 shrink-0" />
            <span>Power & Ministry of the Holy Spirit</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-highland-700 shrink-0" />
            <span>Discipleship & Community Impact</span>
          </div>
        </div>
      </div>

      {/* Church History & Community */}
      <div className="rounded-3xl bg-white border border-neutral-200 p-6 sm:p-10 space-y-4">
        <h3 className="font-heading text-2xl font-bold text-neutral-900">Serving Kapchorwa & Sebei</h3>
        <p className="text-sm text-neutral-600 leading-relaxed">
          Founded with a mandate to bring hope, reconciliation, and the life-changing truth of God to Kapchorwa and surrounding districts, Manifest Kapchorwa continues to invest deeply into families, youth development, prayer summits, and local evangelism.
        </p>
        <p className="text-sm text-neutral-600 leading-relaxed">
          Our congregation includes athletes, farmers, teachers, civil servants, students, and elders from diverse parishes across the highland ridge.
        </p>
      </div>
    </div>
  );
}
