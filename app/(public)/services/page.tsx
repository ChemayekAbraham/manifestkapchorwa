import React from "react";
import { ContentService } from "@/services/content.service";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, MapPin, CheckCircle2, Phone, Calendar } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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

      {/* Services Grid */}
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
    </div>
  );
}
