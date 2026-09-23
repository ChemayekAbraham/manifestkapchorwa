import React from "react";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Quote } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { TestimonyForm } from "@/components/public/testimony-form";

export const metadata = {
  title: "Testimonies & Praise Reports",
  description: "Read testimonies of God's grace and power in Kapchorwa, and submit your own praise report.",
};

export const revalidate = 60; // Revalidate every 60s

export default async function TestimonyPage() {
  const approvedTestimonies = await prisma.testimony
    .findMany({
      where: { status: "APPROVED" },
      orderBy: { approvedAt: "desc" },
      take: 20,
      select: {
        id: true,
        name: true,
        content: true,
        approvedAt: true,
        createdAt: true,
      },
    })
    .catch(() => []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Page Header */}
      <div className="text-center space-y-3">
        <Badge variant="default" className="bg-highland-500 text-white">Praise & Thanksgiving</Badge>
        <h1 className="font-heading text-3xl sm:text-5xl font-bold text-neutral-900">
          Testimonies of God’s Faithfulness
        </h1>
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-neutral-600 leading-relaxed">
          “They overcame him by the blood of the Lamb and by the word of their testimony.” (Revelation 12:11). Read how God is moving in Kapchorwa and share what He has done for you!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Submit Testimony */}
        <div className="lg:col-span-6">
          <TestimonyForm />
        </div>

        {/* Right Column: Approved Testimonies List */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
            <h3 className="font-heading text-lg font-bold text-neutral-900">Recent Praise Reports</h3>
            <span className="text-xs text-neutral-500 font-medium">Verified Church Testimonies</span>
          </div>

          {approvedTestimonies.length === 0 ? (
            <div className="rounded-2xl bg-white border border-neutral-200 p-8 text-center text-neutral-500 text-sm">
              Be the first to share what God has done in your life!
            </div>
          ) : (
            <div className="space-y-4">
              {approvedTestimonies.map((t) => (
                <div
                  key={t.id}
                  className="rounded-2xl bg-white border border-neutral-200/90 p-5 shadow-sm space-y-3"
                >
                  <div className="flex items-start gap-3">
                    <Quote className="h-6 w-6 text-highland-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-neutral-700 leading-relaxed font-serif italic">
                      "{t.content}"
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-xs text-neutral-500 pt-2 border-t border-neutral-100">
                    <span className="font-bold text-neutral-900">{t.name}</span>
                    <span>{formatDate(t.approvedAt || t.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
