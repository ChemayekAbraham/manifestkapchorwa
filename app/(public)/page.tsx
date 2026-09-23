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
  Send,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ContentService } from "@/services/content.service";
import { EventsService } from "@/services/events.service";
import { DevotionsService } from "@/services/devotions.service";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export const revalidate = 60; // Revalidate every minute

export default async function HomePage() {
  const [heroContent, upcomingEvents, latestDevotions, testimonies] = await Promise.all([
    ContentService.getContent("HOME_HERO"),
    EventsService.listUpcoming(3, true).catch(() => []),
    DevotionsService.listPublic(1, 3).then((res) => res.items).catch(() => []),
    prisma.testimony.findMany({
      where: { status: "APPROVED" },
      take: 2,
      orderBy: { approvedAt: "desc" },
    }).catch(() => []),
  ]);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. HERO SECTION WITH MINISTRY WORSHIP PHOTO */}
      <section className="relative overflow-hidden bg-neutral-900 text-white pt-16 pb-24 sm:pt-24 sm:pb-32 px-4 sm:px-6 lg:px-8 shadow-xl">
        {/* Background Images: Mobile portrait + Desktop landscape */}
        <div className="absolute inset-0 z-0">
          {/* Mobile View Portrait Image */}
          <div className="block sm:hidden absolute inset-0">
            <Image
              src="/images/hero-mobile.jpg"
              alt="Kapchorwa Manifest Worship"
              fill
              priority
              className="object-cover object-top opacity-90 filter brightness-105 contrast-105"
              sizes="100vw"
            />
          </div>
          {/* Desktop & Tablet View Landscape Image */}
          <div className="hidden sm:block absolute inset-0">
            <Image
              src="/images/hero.jpg"
              alt="Kapchorwa Manifest Worship & Word"
              fill
              priority
              className="object-cover object-center opacity-95 filter brightness-110 contrast-105"
              sizes="100vw"
            />
          </div>
          {/* Light Translucent Overlay for rich light and readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/15 to-black/60" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6 sm:space-y-8">
          <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.1] drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)] max-w-4xl mx-auto">
            Proclaiming Christ & Transforming Lives in{" "}
            <span className="text-highland-400 underline decoration-highland-400 decoration-wavy underline-offset-8 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
              Kapchorwa
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-neutral-100 font-medium leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
            {heroContent.content}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link href="/register" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto gap-2 bg-highland-500 hover:bg-highland-600 text-white shadow-xl font-bold text-base border border-highland-400/50 transition-all transform hover:-translate-y-0.5">
                <UserPlus className="h-5 w-5" />
                <span>Join / Register with Us</span>
              </Button>
            </Link>
            <Link href="/services" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-white bg-white/10 hover:bg-white/20 border-white/40 backdrop-blur-md font-semibold transition-all">
                <Clock className="h-4 w-4 mr-2" />
                <span>Service Times</span>
              </Button>
            </Link>
          </div>

          {/* Quick Highlands Metric Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6 pt-10 border-t border-white/15 max-w-3xl mx-auto text-left">
            <div className="bg-black/40 rounded-xl p-3.5 border border-white/15 backdrop-blur-md shadow-sm">
              <span className="text-xs text-highland-300 block font-semibold">Sunday Main</span>
              <span className="font-heading font-bold text-sm sm:text-base text-white">11:00 AM — 1:30 PM</span>
            </div>
            <div className="bg-black/40 rounded-xl p-3.5 border border-white/15 backdrop-blur-md shadow-sm">
              <span className="text-xs text-highland-300 block font-semibold">Mid-Week Prayer</span>
              <span className="font-heading font-bold text-sm sm:text-base text-white">Wed 5:00 PM</span>
            </div>
            <div className="col-span-2 sm:col-span-1 bg-black/40 rounded-xl p-3.5 border border-white/15 backdrop-blur-md shadow-sm">
              <span className="text-xs text-highland-300 block font-semibold">Location</span>
              <span className="font-heading font-bold text-sm sm:text-base text-white">Plot 14, Main Street</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CORE ACTION CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 sm:-mt-16 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Action 1: Registration */}
          <Card className="border-t-4 border-t-highland-500 hover:shadow-lg transition-all bg-white">
            <CardHeader className="pb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-highland-100 text-highland-700 mb-2">
                <UserPlus className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg">Member Registration</CardTitle>
              <CardDescription>
                New in town or looking for a home church? Register your family with Manifest Kapchorwa.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/register">
                <Button size="sm" className="w-full bg-highland-500 hover:bg-highland-600 text-white justify-between shadow-sm">
                  <span>Register Now</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Action 2: Salvation & New Converts */}
          <Card className="border-t-4 border-t-highland-600 hover:shadow-lg transition-all bg-white">
            <CardHeader className="pb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-highland-100 text-highland-700 mb-2">
                <Sparkles className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg">Salvation / New Converts</CardTitle>
              <CardDescription>
                Received Jesus or won a soul to Christ? Register for discipleship and spiritual growth.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/salvation">
                <Button size="sm" variant="outline" className="w-full text-highland-700 border-highland-300 hover:bg-highland-50 justify-between">
                  <span>Register Decision</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Action 3: Church Giving */}
          <Card className="border-t-4 border-t-highland-500 hover:shadow-lg transition-all bg-white">
            <CardHeader className="pb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-highland-100 text-highland-700 mb-2">
                <Heart className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg">Tithes & Offerings</CardTitle>
              <CardDescription>
                Support God’s work, church missions, and community outreach in Kapchorwa.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/give">
                <Button size="sm" variant="outline" className="w-full text-highland-700 border-highland-300 hover:bg-highland-50 justify-between">
                  <span>Giving Information</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 3. SERVICE TIMES & LOCATION HIGHLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-neutral-50 border border-neutral-200/80 p-6 sm:p-10 shadow-sm">
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
              <div className="rounded-2xl bg-white p-4 shadow-sm border border-neutral-200/80 flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-highland-100 text-highland-800 font-bold text-lg">
                  SUN
                </div>
                <div className="space-y-1">
                  <h4 className="font-heading font-bold text-neutral-900">Sunday Celebration Service</h4>
                  <p className="text-xs text-neutral-500">8:00 AM – 10:30 AM | Main Sanctuary</p>
                </div>
              </div>

              <div className="rounded-2xl bg-white p-4 shadow-sm border border-neutral-200/80 flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-highland-800 text-white font-bold text-lg">
                  SUN
                </div>
                <div className="space-y-1">
                  <h4 className="font-heading font-bold text-neutral-900">Sunday Main Service (Grace Service)</h4>
                  <p className="text-xs text-neutral-500">11:00 AM – 1:30 PM | Main Sanctuary</p>
                </div>
              </div>

              <div className="rounded-2xl bg-white p-4 shadow-sm border border-neutral-200/80 flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-clay-100 text-clay-700 font-bold text-lg">
                  WED
                </div>
                <div className="space-y-1">
                  <h4 className="font-heading font-bold text-neutral-900">Mid-Week Prayer & Word Encounter</h4>
                  <p className="text-xs text-neutral-500">5:00 PM – 7:00 PM | Prayer Hall</p>
                </div>
              </div>

              {/* Phaneroo Sister Ministry Times */}
              <div className="rounded-2xl bg-neutral-900 p-4 shadow-sm border border-neutral-800 flex items-center justify-between gap-4 text-white">
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
      </section>

      {/* 4. UPCOMING EVENTS */}
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
            {upcomingEvents.map((event) => (
              <Card key={event.id} className="hover:shadow-md transition-shadow">
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
            ))}
          </div>
        )}
      </section>

      {/* 5. WRITTEN DEVOTIONALS PREVIEW */}
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
            {latestDevotions.map((devotion) => (
              <Card key={devotion.id} className="hover:shadow-md transition-shadow flex flex-col justify-between">
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
            ))}
          </div>
        )}
      </section>

      {/* 6. TESTIMONIES STRIP */}
      {testimonies.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-highland-900 rounded-3xl p-6 sm:p-10 text-white space-y-6">
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
                <div key={t.id} className="bg-white/10 rounded-2xl p-5 border border-white/10 space-y-3">
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
        </section>
      )}

      {/* 7. BOTTOM BANNER CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="rounded-3xl bg-gradient-to-b from-white via-highland-50/30 to-neutral-50/80 border-2 border-highland-100 p-8 sm:p-12 space-y-4 shadow-xl">
          <Badge variant="clay">Get Connected</Badge>
          <h2 className="font-heading text-2xl sm:text-4xl font-bold text-neutral-900">Ready to Connect With Us?</h2>
          <p className="max-w-xl mx-auto text-sm sm:text-base text-neutral-600 leading-relaxed">
            Register your membership details, request pastoral visitation, or reach out with your questions. We are glad you are here.
          </p>
          <div className="pt-3 flex flex-wrap justify-center gap-3">
            <Link href="/register">
              <Button size="lg" variant="clay" className="font-bold shadow-md px-6">
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
      </section>
    </div>
  );
}
