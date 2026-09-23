import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EventsService } from "@/services/events.service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, ArrowLeft, Share2, Heart } from "lucide-react";
import { formatDate, formatDateTime } from "@/lib/utils";

export const revalidate = 60;

export default async function EventDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const event = await EventsService.getById(id);

  if (!event || !event.published) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <Link href="/events" className="inline-flex items-center gap-1.5 text-xs font-semibold text-highland-800 hover:underline">
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Events Calendar</span>
      </Link>

      <div className="rounded-3xl bg-white border border-neutral-200 p-6 sm:p-10 space-y-6 shadow-sm">
        <div className="space-y-3">
          <Badge variant="clay">Manifest Kapchorwa Event</Badge>
          <h1 className="font-heading text-2xl sm:text-4xl font-bold text-neutral-900 leading-tight">
            {event.name}
          </h1>
        </div>

        {/* Date & Location Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="flex items-center gap-3 rounded-2xl bg-neutral-50 p-4 border border-neutral-200/80">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-highland-100 text-highland-800">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs text-neutral-500 block">Event Date</span>
              <span className="font-semibold text-sm text-neutral-900">{formatDateTime(event.date)}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-neutral-50 p-4 border border-neutral-200/80">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-clay-100 text-clay-700">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs text-neutral-500 block">Location</span>
              <span className="font-semibold text-sm text-neutral-900">{event.location}</span>
            </div>
          </div>
        </div>

        {/* Description Body */}
        <div className="prose prose-neutral max-w-none text-sm leading-relaxed pt-4 border-t border-neutral-100">
          <h3 className="font-heading text-lg font-bold text-neutral-900 mb-2">About This Program</h3>
          <p className="whitespace-pre-wrap text-neutral-700">{event.description || "All are warmly invited to attend."}</p>
        </div>

        {/* Action strip */}
        <div className="pt-6 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-neutral-500">
            Have questions regarding this program? Contact our church office.
          </p>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link href="/contact" className="w-full sm:w-auto">
              <Button size="sm" variant="default" className="w-full sm:w-auto">
                Contact Church Office
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
