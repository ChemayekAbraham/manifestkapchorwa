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
          <Badge variant="ochre">Our Foundation • phaneroo.org</Badge>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-neutral-900">{faith.title}</h2>
          <p className="text-xs sm:text-sm text-neutral-600">
            As articulated by Phaneroo Ministries International (Apostle Grace Lubega):
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              id: 1,
              title: "God The Father",
              text: "We believe in God the creator of heaven and earth, the Supreme Being and Father of us all.",
            },
            {
              id: 2,
              title: "Jesus Christ",
              text: "We believe Jesus Christ is His son who was God manifest in the flesh; He walked the earth, lived among men; died and was raised again to life.",
            },
            {
              id: 3,
              title: "Creation & The Fall",
              text: "We believe that man is a created being, made in the likeness and image of God, but through Adam’s transgression and fall, sin came into the world.",
            },
            {
              id: 4,
              title: "Salvation & Healing",
              text: "We believe that the redemptive work of Christ on the cross provides salvation for the soul of everyone that believes and divine healing for the body.",
            },
            {
              id: 5,
              title: "Freedom in Christ",
              text: "We believe in the freedom of the Christian from sin, and the consequent blessing of being bond servants of Christ; exhibiting our fruit unto holiness and life everlasting (Romans 6:22).",
            },
            {
              id: 6,
              title: "Justification by Faith",
              text: "We believe that we are justified by faith, and have received of the free gift of righteousness through God’s Grace, which gift is not of works (Galatians 2:16, Romans 4:16).",
            },
            {
              id: 7,
              title: "God's Purpose in Men",
              text: "We believe that God wills and works in men and that His purposes are fulfilled by His work through us who believe.",
            },
            {
              id: 8,
              title: "Authority of The Word",
              text: "We believe that the Word of God is the sole standard of truth and is the pattern for Christian living.",
            },
            {
              id: 9,
              title: "The Holy Spirit",
              text: "We believe that when an individual receives the Holy Spirit, he/she receives divine enablement for Christian service and witness.",
            },
            {
              id: 10,
              title: "The Blessed Hope",
              text: "We believe that Jesus will return and '. . . The dead in Christ shall rise first: Then we which are alive and remain shall be caught up together with them in the clouds to meet the Lord in the air . . .' (1 Thess. 4:16–17).",
            },
          ].map((item) => (
            <div
              key={item.id}
              className="bg-white/90 rounded-2xl p-4 border border-neutral-200/80 shadow-sm space-y-1.5"
            >
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-highland-800 text-white font-bold text-xs">
                  {item.id}
                </span>
                <span className="font-heading font-bold text-sm text-neutral-900">{item.title}</span>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed pl-8">
                {item.text}
              </p>
            </div>
          ))}
        </div>

        <div className="pt-2 flex items-center justify-between flex-wrap gap-4 border-t border-cream-300">
          <span className="text-xs text-neutral-500">Official statement from Phaneroo Ministries International</span>
          <a
            href="https://phaneroo.org/our-statement-of-faith/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-highland-700 hover:text-highland-900 underline"
          >
            Read on phaneroo.org ↗
          </a>
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
