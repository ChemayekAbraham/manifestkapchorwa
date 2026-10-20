import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  Clock,
  MapPin,
  Heart,
  BookOpen,
  UserPlus,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Camera,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ContentService } from "@/services/content.service";
import { EventsService } from "@/services/events.service";
import { DevotionsService } from "@/services/devotions.service";
import { Testimony } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { MotionHero } from "@/components/public/motion/motion-hero";
import { InfiniteMotionTicker } from "@/components/public/motion/infinite-ticker";
import { MotionReveal, MotionCard } from "@/components/public/motion/motion-reveal";
import { AnimatedStatsStrip } from "@/components/public/motion/animated-stats-strip";

export const revalidate = 60; // Revalidate every minute

export default async function HomePage() {
  const [heroContent, upcomingEvents, latestDevotions, testimonies] = await Promise.all([
    ContentService.getContent("HOME_HERO"),
    EventsService.listUpcoming(3, true),
    DevotionsService.listPublic(1, 3).then((res) => res.items),
    prisma.testimony
      .findMany({
        where: { status: "APPROVED" },
        take: 2,
        orderBy: { approvedAt: "desc" },
      })
      .catch((): Testimony[] => []),
  ]);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16 overflow-hidden">
      {/* 1. DYNAMIC MOTION HERO SECTION */}
      <MotionHero heroContentText={heroContent.content} />

      {/* 2. INFINITE CONTINUOUS MOTION TICKER */}
      <InfiniteMotionTicker />

      {/* 3. CORE ACTION CARDS WITH SPRING HOVER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Action 1: Registration */}
          <MotionCard delay={0.1}>
            <Card className="border-t-4 border-t-highland-500 bg-white h-full flex flex-col justify-between">
              <CardHeader className="pb-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-highland-100 text-highland-700 mb-2 shadow-inner">
                  <UserPlus className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg">Member Registration</CardTitle>
                <CardDescription>
                  New in town or looking for a home church? Register your family with Manifest Kapchorwa.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/register">
                  <Button size="sm" className="w-full bg-highland-500 hover:bg-highland-600 text-white justify-between shadow-sm font-semibold">
                    <span>Register Now</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </MotionCard>

          {/* Action 2: Salvation & New Converts */}
          <MotionCard delay={0.2}>
            <Card className="border-t-4 border-t-highland-600 bg-white h-full flex flex-col justify-between">
              <CardHeader className="pb-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-highland-100 text-highland-700 mb-2 shadow-inner">
                  <Sparkles className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg">Salvation / New Converts</CardTitle>
                <CardDescription>
                  Received Jesus or won a soul to Christ? Register for discipleship and spiritual growth.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/salvation">
                  <Button size="sm" variant="outline" className="w-full text-highland-700 border-highland-300 hover:bg-highland-50 justify-between font-semibold">
                    <span>Register Decision</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </MotionCard>

          {/* Action 3: Church Giving */}
          <MotionCard delay={0.3}>
            <Card className="border-t-4 border-t-highland-500 bg-white h-full flex flex-col justify-between">
              <CardHeader className="pb-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-highland-100 text-highland-700 mb-2 shadow-inner">
                  <Heart className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg">Tithes & Offerings</CardTitle>
                <CardDescription>
                  Support God’s work, church missions, and community outreach in Kapchorwa.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/give">
                  <Button size="sm" variant="outline" className="w-full text-highland-700 border-highland-300 hover:bg-highland-50 justify-between font-semibold">
                    <span>Giving Information</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </MotionCard>
        </div>
      </section>

      {/* 4. ANIMATED KINGDOM IMPACT STATS STRIP */}
      <AnimatedStatsStrip />

      {/* 5. SERVICE TIMES & LOCATION HIGHLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <MotionReveal direction="up">
          <div className="rounded-3xl bg-neutral-50 border border-neutral-200/80 p-6 sm:p-10 shadow-sm hover:shadow-md transition-shadow">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <Badge variant="default" className="bg-highland-500 text-white">Weekly Gathering Schedule</Badge>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-neutral-900">
                  Join Us in Worship & Fellowship
                </h2>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  Whether you are a lifelong believer or seeking answers about God, you are warmly welcome at Manifest Kapchorwa. We gather together every week to worship, learn from the Scriptures, and build one another up in faith.
                </p>
                <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-neutral-700">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-highland-700" />
                    Children Ministry Available
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-highland-700" />
                    Luganda & English Translation
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="rounded-2xl bg-white p-4 shadow-sm border border-neutral-200/80 flex items-start gap-4 hover:border-highland-300 transition-colors">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-highland-100 text-highland-800 font-bold text-lg">
                    SUN
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-heading font-bold text-neutral-900">Sunday First Service</h4>
                    <p className="text-xs text-neutral-500">9:00 AM – 10:45 AM E.A.T | Phaneroo Grounds</p>
                  </div>
                </div>

                <div className="rounded-2xl bg-white p-4 shadow-sm border border-neutral-200/80 flex items-start gap-4 hover:border-highland-300 transition-colors">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-highland-800 text-white font-bold text-lg">
                    SUN
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-heading font-bold text-neutral-900">Sunday Second Service</h4>
                    <p className="text-xs text-neutral-500">11:00 AM – 1:30 PM E.A.T | Phaneroo Grounds</p>
                  </div>
                </div>

                <div className="rounded-2xl bg-white p-4 shadow-sm border border-neutral-200/80 flex items-start gap-4 hover:border-clay-300 transition-colors">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-clay-100 text-clay-700 font-bold text-lg">
                    THU
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-heading font-bold text-neutral-900">Thursday Fellowship Service</h4>
                    <p className="text-xs text-neutral-500">5:00 PM – 7:30 PM E.A.T | Phaneroo Grounds</p>
                  </div>
                </div>

                {/* Phaneroo Sister Ministry Times */}
                <div className="rounded-2xl bg-neutral-900 p-4 shadow-sm border border-neutral-800 flex items-center justify-between gap-4 text-white hover:border-neutral-700 transition-colors">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Phaneroo Global</span>
                      <span className="text-[10px] text-neutral-400">Phaneroo Grounds • E.A.T</span>
                    </div>
                    <h4 className="font-heading text-sm font-bold text-white">Thurs 5PM • Sun 9AM & 11AM</h4>
                  </div>
                  <Link href="/services">
                    <Button size="sm" variant="clay" className="text-xs font-bold shrink-0">
                      Full Schedule
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </MotionReveal>
      </section>

      {/* 6. UPCOMING EVENTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-neutral-200 pb-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-clay-600">Upcoming Events</span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-neutral-900">Church Calendar & Special Programs</h2>
          </div>
          <Link href="/events" className="text-xs font-semibold text-highland-800 hover:underline flex items-center gap-1">
            <span>View All Events</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {upcomingEvents.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-2xl border border-neutral-200 p-6 text-neutral-500 text-sm">
            No upcoming special events scheduled at the moment. Please check back soon or join our weekly services!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingEvents.map((event, idx) => (
              <MotionCard key={event.id} delay={idx * 0.1}>
                <Card className="h-full flex flex-col justify-between">
                  <CardHeader>
                    <div className="flex items-center justify-between text-xs text-clay-600 font-semibold mb-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(event.date)}
                      </span>
                      <Badge variant="outline">Church Event</Badge>
                    </div>
                    <CardTitle className="text-base">{event.name}</CardTitle>
                    <CardDescription className="line-clamp-2">{event.description || "Join us for this special program."}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-xs text-neutral-600 flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-neutral-400" />
                      <span>{event.location}</span>
                    </div>
                    <Link href={`/events/${event.id}`}>
                      <Button variant="outline" size="sm" className="w-full text-xs">
                        Event Details
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </MotionCard>
            ))}
          </div>
        )}
      </section>

      {/* 7. WRITTEN DEVOTIONALS PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-neutral-200 pb-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-highland-700">Spiritual Growth</span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-neutral-900">Latest Written Devotionals</h2>
          </div>
          <Link href="/devotions" className="text-xs font-semibold text-highland-800 hover:underline flex items-center gap-1">
            <span>Read More Devotions</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {latestDevotions.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-2xl border border-neutral-200 p-6 text-neutral-500 text-sm">
            Devotionals will appear here soon.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestDevotions.map((devotion, idx) => (
              <MotionCard key={devotion.id} delay={idx * 0.1}>
                <Card className="h-full flex flex-col justify-between">
                  <CardHeader>
                    <div className="flex items-center gap-2 text-xs text-neutral-500 mb-1">
                      <BookOpen className="h-3.5 w-3.5 text-highland-700" />
                      <span>{formatDate(devotion.publishedAt || devotion.createdAt)}</span>
                    </div>
                    <CardTitle className="text-base">{devotion.title}</CardTitle>
                    <CardDescription className="line-clamp-3 leading-relaxed">
                      {devotion.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href={`/devotions/${devotion.slug}`}>
                      <Button variant="link" className="p-0 text-highland-800 text-xs font-semibold">
                        Read Full Devotional →
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </MotionCard>
            ))}
          </div>
        )}
      </section>

      {/* 8. TESTIMONIES STRIP */}
      {testimonies.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <MotionReveal direction="up">
            <div className="bg-gradient-to-br from-highland-900 via-highland-950 to-neutral-950 rounded-3xl p-6 sm:p-10 text-white space-y-6 shadow-xl border border-highland-800/40">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-ochre-400">Praise Reports</span>
                  <h3 className="font-heading text-xl sm:text-2xl font-bold">God’s Goodness in Our Midst</h3>
                </div>
                <Link href="/testimony">
                  <Button size="sm" variant="clay">
                    Share Your Testimony
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {testimonies.map((t) => (
                  <div key={t.id} className="bg-white/10 rounded-2xl p-5 border border-white/10 space-y-3 backdrop-blur-sm">
                    <p className="text-sm text-neutral-100 italic leading-relaxed">
                      "{t.content}"
                    </p>
                    <div className="text-xs font-semibold text-ochre-300">
                      — {t.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </MotionReveal>
        </section>
      )}

      {/* 9. KAPCHORWA PHOTO & OUTREACH GALLERY SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <MotionCard delay={0.1}>
          <div className="rounded-3xl bg-highland-950 text-white p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8 border border-highland-800 shadow-2xl relative overflow-hidden group">
            {/* Photo backdrop */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <Image
                src="/images/gallery/kapchorwa-street-mission-team.jpg"
                alt="Kapchorwa Street Mission"
                fill
                className="object-cover opacity-20 group-hover:scale-105 group-hover:opacity-30 transition-all duration-700 ease-out"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-highland-950 via-highland-950/85 to-highland-900/60" />
            </div>

            <div className="space-y-4 relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 text-xs font-bold">
                <Camera className="h-3.5 w-3.5 text-amber-300" />
                <span>Kapchorwa In Pictures</span>
                <span className="text-amber-300 text-[10px] font-extrabold uppercase ml-1 px-1.5 py-0.5 rounded bg-amber-400/20">
                  New Photos
                </span>
              </div>
              <h3 className="font-heading text-2xl sm:text-4xl font-bold text-white leading-tight">
                Photo & Outreach Gallery
              </h3>
              <p className="text-xs sm:text-base text-highland-100/90 leading-relaxed">
                Witness authentic moments of street evangelism, open-air preaching across Kapchorwa Town, and weekly fellowship at the Joshua Cheptegei Foundation in the scenic highlands.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 relative z-10 shrink-0 w-full sm:w-auto">
              <Link href="/gallery" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-highland-500 hover:bg-highland-400 text-white font-bold gap-2 text-sm shadow-lg px-6 py-6 rounded-xl">
                  <span>Explore Photo Gallery</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </MotionCard>
      </section>

      {/* 10. BOTTOM BANNER CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <MotionReveal direction="up">
          <div className="rounded-3xl bg-gradient-to-b from-white via-highland-50/40 to-neutral-50/80 border-2 border-highland-100 p-8 sm:p-12 space-y-4 shadow-xl">
            <Badge variant="clay">Get Connected</Badge>
            <h2 className="font-heading text-2xl sm:text-4xl font-bold text-neutral-900">Ready to Connect With Us?</h2>
            <p className="max-w-xl mx-auto text-sm sm:text-base text-neutral-600 leading-relaxed">
              Register your membership details, request pastoral visitation, or reach out with your questions. We are glad you are here.
            </p>
            <div className="pt-3 flex flex-wrap justify-center gap-3">
              <Link href="/register">
                <Button size="lg" variant="clay" className="font-bold shadow-md px-6 hover:shadow-lg transition-shadow">
                  Register as Church Member
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-neutral-300 text-neutral-800 hover:bg-neutral-100 font-semibold px-6">
                  Contact Office
                </Button>
              </Link>
            </div>
          </div>
        </MotionReveal>
      </section>
    </div>
  );
}
