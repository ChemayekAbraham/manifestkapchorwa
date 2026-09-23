import React from "react";
import Image from "next/image";
import { ContentService } from "@/services/content.service";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, MapPin, CheckCircle2, Phone, Calendar } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ServiceAttendanceForm } from "@/components/public/service-attendance-form";

export const metadata = {
  title: "Weekly Services & Schedule",
  description:
    "Join us for Sunday celebration services, mid-week prayer, and youth fellowship in Kapchorwa.",
};

export const revalidate = 60;

export default async function ServicesPage() {
  const serviceContent = await ContentService.getContent("SERVICE_SCHEDULE");
  let schedules = [];
  try {
    schedules = JSON.parse(serviceContent.content);
  } catch {
    schedules = [
      { name: "Sunday First Service", day: "Sunday", time: "8:00 AM - 10:30 AM", location: "Main Sanctuary" },
      { name: "Sunday Second Service", day: "Sunday", time: "11:00 AM - 1:30 PM", location: "Main Sanctuary" },
      { name: "Mid-Week Deliverance & Prayer", day: "Wednesday", time: "5:00 PM - 7:00 PM", location: "Prayer Hall" },
      { name: "Youth Fellowship", day: "Friday", time: "5:30 PM - 7:30 PM", location: "Youth Chapel" },
    ];
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-3">
        <Badge variant="clay">Join Us This Week</Badge>
        <h1 className="font-heading text-3xl sm:text-5xl font-bold text-neutral-900">
          Weekly Worship & Fellowship Times
        </h1>
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-neutral-600 leading-relaxed">
          Every gathering is an opportunity to encounter God’s presence through heartfelt praise, intercession, and anointed teaching.
        </p>
      </div>

      {/* 1. SERVICE ATTENDANCE CHECK-IN SECTION */}
      <ServiceAttendanceForm />

      {/* 2. Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {schedules.map((srv: any, idx: number) => (
          <Card key={idx} className="hover:shadow-md transition-shadow border-t-4 border-t-highland-800">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between mb-1">
                <Badge variant="outline">{srv.day}</Badge>
                <div className="flex items-center gap-1 text-xs text-clay-600 font-semibold">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{srv.time}</span>
                </div>
              </div>
              <CardTitle className="text-xl">{srv.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-xs text-neutral-600">
                <MapPin className="h-4 w-4 text-highland-700 shrink-0" />
                <span>Location: {srv.location} (Plot 14, Main Street)</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* What to Expect Card */}
      <div className="rounded-3xl bg-cream-100 border border-cream-200 p-6 sm:p-10 space-y-4">
        <h3 className="font-heading text-xl font-bold text-neutral-900">What to Expect on Sunday</h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-neutral-700">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-highland-700 shrink-0 mt-0.5" />
            <span>Passionate worship in Sabiny, Luganda, and English</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-highland-700 shrink-0 mt-0.5" />
            <span>Relevant, practical exposition of the Word of God</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-highland-700 shrink-0 mt-0.5" />
            <span>Dedicated Sunday School classes for children of all ages</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-highland-700 shrink-0 mt-0.5" />
            <span>Dedicated pastoral prayer ministry at the close of every service</span>
          </li>
        </ul>
        <div className="pt-4 flex items-center justify-between flex-wrap gap-4 border-t border-neutral-200">
          <p className="text-xs text-neutral-600">
            Have questions about visiting? Reach our pastoral team directly.
          </p>
          <Link href="/contact">
            <Button size="sm" variant="default">
              Contact Us
            </Button>
          </Link>
        </div>
      </div>

      {/* 3. PHANEROO GLOBAL BROADCASTS & SERVICE TIMES */}
      <div className="rounded-3xl bg-neutral-950 text-white overflow-hidden shadow-2xl border border-neutral-800">
        {/* Banner Graphic Showcase */}
        <div className="relative w-full aspect-[21/9] sm:aspect-[24/9] max-h-[320px] bg-neutral-900 overflow-hidden border-b border-neutral-800">
          <Image
            src="/images/phaneroo-service-times.png"
            alt="Phaneroo Service Times - An open invitation to a life in the Word"
            fill
            priority
            className="object-cover object-center"
            sizes="(max-width: 1200px) 100vw, 1200px"
          />
        </div>

        <div className="p-6 sm:p-10 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800/80 pb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 uppercase tracking-wider">
                  Sister Ministry & Global Broadcast
                </span>
                <span className="text-xs text-neutral-400">East African Time (E.A.T)</span>
              </div>
              <h3 className="font-heading text-2xl sm:text-3xl font-black text-white tracking-tight">
                An open invitation to a <span className="text-amber-400">life in the Word.</span>
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300">
                Apostle Grace Lubega • Phaneroo Ministries International
              </p>
            </div>
            <a
              href="https://phaneroo.org/live/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 px-5 py-2.5 text-xs font-bold transition-all shadow-lg hover:shadow-amber-500/20 shrink-0"
            >
              <span className="h-2 w-2 rounded-full bg-red-600 animate-ping"></span>
              <span>Watch Phaneroo Live</span>
            </a>
          </div>

          {/* Detailed Service Times Matching Graphic */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* THURSDAYS */}
            <div className="bg-neutral-900/90 rounded-2xl p-6 border border-neutral-800 space-y-4 relative overflow-hidden group hover:border-amber-500/50 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-widest text-amber-400">
                  PHANEROO GROUNDS
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">
                  Weekly Fellowship
                </span>
              </div>
              <div>
                <h4 className="font-heading text-2xl font-black text-white">THURSDAYS</h4>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">5:00 PM</span>
                  <span className="text-sm font-bold text-amber-400">E.A.T</span>
                </div>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed pt-2 border-t border-neutral-800/80">
                Main fellowship service held at Phaneroo Grounds, Kampala. Broadcast live worldwide across Manifest TV, YouTube, and online streaming.
              </p>
            </div>

            {/* SUNDAYS */}
            <div className="bg-neutral-900/90 rounded-2xl p-6 border border-neutral-800 space-y-4 relative overflow-hidden group hover:border-amber-500/50 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-widest text-amber-400">
                  PHANEROO GROUNDS
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">
                  Sunday Services
                </span>
              </div>
              <div>
                <h4 className="font-heading text-2xl font-black text-white">SUNDAYS</h4>
                <div className="mt-2 grid grid-cols-2 gap-3">
                  <div className="bg-neutral-950/60 p-3 rounded-xl border border-neutral-800">
                    <span className="text-[11px] font-bold text-neutral-400 block uppercase">First Service</span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-xl sm:text-2xl font-black text-white">9:00 AM</span>
                      <span className="text-[11px] font-bold text-amber-400">E.A.T</span>
                    </div>
                  </div>
                  <div className="bg-neutral-950/60 p-3 rounded-xl border border-neutral-800">
                    <span className="text-[11px] font-bold text-neutral-400 block uppercase">Second Service</span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-xl sm:text-2xl font-black text-white">11:00 AM</span>
                      <span className="text-[11px] font-bold text-amber-400">E.A.T</span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed pt-2 border-t border-neutral-800/80">
                Celebration services at Phaneroo Grounds with transformative teaching of the Word, available on live broadcast to all partners and members.
              </p>
            </div>
          </div>

          {/* Online Channels & Broadcast Links */}
          <div className="pt-2 border-t border-neutral-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <a
              href="https://phaneroo.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 transition-all"
            >
              <span className="text-xs font-semibold text-neutral-200">Phaneroo Website</span>
              <span className="text-xs text-amber-400 font-medium">phaneroo.org ↗</span>
            </a>

            <a
              href="https://www.youtube.com/@phaneroo"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 transition-all"
            >
              <span className="text-xs font-semibold text-neutral-200">Phaneroo YouTube</span>
              <span className="text-xs text-red-400 font-medium">Watch Online ↗</span>
            </a>

            <a
              href="https://phaneroo.org/broadcast/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 transition-all"
            >
              <span className="text-xs font-semibold text-neutral-200">Manifest Television</span>
              <span className="text-xs text-amber-400 font-medium">TV Broadcasts ↗</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
