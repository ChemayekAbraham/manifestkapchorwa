import React from "react";
import Link from "next/link";
import { EventsService } from "@/services/events.service";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/utils";

export const metadata = {
  title: "Church Events & Gatherings",
  description: "Explore upcoming ministry conferences, prayer summits, and special services in Kapchorwa.",
};

export const revalidate = 60;

export default async function EventsPage() {
  const events = await EventsService.listUpcoming(20, true).catch(() => []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-3">
        <Badge variant="clay">Events & Calendar</Badge>
        <h1 className="font-heading text-3xl sm:text-5xl font-bold text-neutral-900">
          Upcoming Ministry Events
        </h1>
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-neutral-600 leading-relaxed">
          Stay informed with our church calendar, conferences, evangelistic missions, and prayer summits across Kapchorwa.
        </p>
      </div>

      {events.length === 0 ? (
        <div className="rounded-3xl bg-white border border-neutral-200 p-12 text-center text-neutral-500 space-y-2">
          <Calendar className="h-10 w-10 text-neutral-400 mx-auto" />
          <h3 className="font-heading text-lg font-bold text-neutral-800">No Events Currently Scheduled</h3>
          <p className="text-xs text-neutral-500">Please check back soon or join our weekly Sunday services.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event) => (
            <Card key={event.id} className="hover:shadow-md transition-shadow border-t-4 border-t-highland-800 flex flex-col justify-between">
              <CardHeader>
                <div className="flex items-center justify-between text-xs text-clay-600 font-semibold mb-1">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(event.date)}
                  </span>
                  <Badge variant="outline">Event</Badge>
                </div>
                <CardTitle className="text-xl">{event.name}</CardTitle>
                <CardDescription className="line-clamp-3 leading-relaxed">
                  {event.description || "Join us for this special church event."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-xs text-neutral-600">
                  <MapPin className="h-4 w-4 text-highland-700 shrink-0" />
                  <span>{event.location}</span>
                </div>
                <Link href={`/events/${event.id}`}>
                  <Button variant="outline" size="sm" className="w-full text-xs justify-between">
                    <span>View Event Details</span>
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
