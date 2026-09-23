import React from "react";
import { ContentService } from "@/services/content.service";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Clock, ExternalLink, MessageCircle } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Contact & Location",
  description:
    "Get in touch with Manifest Kapchorwa church office, view location directions, and office hours.",
};

export const revalidate = 60;

export default async function ContactPage() {
  const contactContent = await ContentService.getContent("CONTACT_INFORMATION");
  let contactData: any = {};
  try {
    contactData = JSON.parse(contactContent.content);
  } catch {
    contactData = {
      address: "Plot 14, Main Street, Kapchorwa Municipality, Eastern Uganda",
      phone: "+256 770 123456 / +256 750 123456",
      email: "info@manifestkapchorwa.org",
      officeHours: "Tuesday – Saturday: 8:30 AM – 5:00 PM (EAT)",
      mapsUrl: "https://maps.google.com/?q=Kapchorwa+Uganda",
    };
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Page Header */}
      <div className="text-center space-y-3">
        <Badge variant="clay">Get in Touch</Badge>
        <h1 className="font-heading text-3xl sm:text-5xl font-bold text-neutral-900">
          Contact & Location
        </h1>
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-neutral-600 leading-relaxed">
          We would love to hear from you. Reach out with questions, pastoral inquiries, or visit us in person at our sanctuary in Kapchorwa.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Left Column: Contact Cards */}
        <div className="space-y-4">
          <Card className="border-t-4 border-t-highland-800 bg-white">
            <CardHeader className="pb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-highland-100 text-highland-800 mb-2">
                <MapPin className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg">Physical Location</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-neutral-700">
              <p className="leading-relaxed">{contactData.address}</p>
              <a
                href={contactData.mapsUrl || "https://maps.google.com/?q=Kapchorwa+Uganda"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-highland-800 hover:underline"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-clay-600 bg-white">
            <CardHeader className="pb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-clay-100 text-clay-700 mb-2">
                <Phone className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg">Phone & WhatsApp</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm text-neutral-700">
              <p className="font-semibold text-neutral-900">{contactData.phone}</p>
              <p className="text-xs text-neutral-500">Available for calls and pastoral inquiries</p>
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-ochre-500 bg-white">
            <CardHeader className="pb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ochre-100 text-ochre-700 mb-2">
                <Mail className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg">Email & Office Hours</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-neutral-700">
              <p className="font-semibold text-neutral-900">{contactData.email}</p>
              <div className="pt-2 border-t border-neutral-100 flex items-start gap-2 text-xs text-neutral-600">
                <Clock className="h-4 w-4 text-highland-700 shrink-0 mt-0.5" />
                <span>Office Hours: {contactData.officeHours}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Quick Action Box & Highlands Map Placeholder */}
        <div className="space-y-6">
          <div className="rounded-3xl bg-highland-950 text-white p-8 space-y-5 shadow-lg">
            <h3 className="font-heading text-2xl font-bold">Visiting This Sunday?</h3>
            <p className="text-xs sm:text-sm text-highland-200 leading-relaxed">
              We look forward to hosting you in God's presence. Our welcoming ushers will guide you to parking, seating, and age-appropriate children’s church classes.
            </p>

            <div className="space-y-3 pt-2">
              <Link href="/register" className="block">
                <Button variant="clay" className="w-full justify-center">
                  Register as a Visitor / Member
                </Button>
              </Link>
              <Link href="/prayer" className="block">
                <Button variant="outline" className="w-full justify-center text-white border-white/20 hover:bg-white/10">
                  Send a Prayer Request
                </Button>
              </Link>
            </div>
          </div>

          {/* Lightweight Maps Banner */}
          <div className="rounded-3xl bg-cream-100 border border-cream-200 p-6 text-center space-y-3">
            <MapPin className="h-8 w-8 text-clay-600 mx-auto" />
            <h4 className="font-heading text-base font-bold text-neutral-900">Map & Directions</h4>
            <p className="text-xs text-neutral-600">
              Located within Kapchorwa Municipality along the scenic main highway leading to Mount Elgon National Park and Sipi Falls.
            </p>
            <a
              href={contactData.mapsUrl || "https://maps.google.com/?q=Kapchorwa+Uganda"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block pt-1"
            >
              <Button size="sm" variant="default" className="gap-1.5 text-xs">
                <span>View on Google Maps</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
