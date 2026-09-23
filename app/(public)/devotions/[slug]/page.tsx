import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DevotionsService } from "@/services/devotions.service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Calendar, BookOpen, Share2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

export const revalidate = 60;

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const devotion = await DevotionsService.getBySlug(slug, true);
  if (!devotion) return { title: "Devotional Not Found" };

  return {
    title: devotion.title,
    description: devotion.excerpt || devotion.title,
    openGraph: {
      title: `${devotion.title} — Manifest Kapchorwa`,
      description: devotion.excerpt || devotion.title,
    },
  };
}

export default async function DevotionDetailPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const devotion = await DevotionsService.getBySlug(slug, true);

  if (!devotion) {
    notFound();
  }

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <Link href="/devotions" className="inline-flex items-center gap-1.5 text-xs font-semibold text-highland-800 hover:underline">
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Devotionals</span>
      </Link>

      <div className="rounded-3xl bg-white border border-neutral-200 p-6 sm:p-12 space-y-8 shadow-sm">
        <header className="space-y-4 border-b border-neutral-100 pb-6">
          <Badge variant="clay">Manifest Devotional</Badge>
          <h1 className="font-heading text-2xl sm:text-4xl font-bold text-neutral-900 leading-tight">
            {devotion.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500 pt-2">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-highland-700" />
              {formatDate(devotion.publishedAt || devotion.createdAt)}
            </span>
            <span className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-highland-700" />
              {devotion.author}
            </span>
          </div>
        </header>

        {/* Devotional Content formatted as clean readable text */}
        <div className="prose prose-neutral max-w-none text-neutral-800 leading-relaxed space-y-4 text-base font-serif">
          {devotion.content.split("\n\n").map((para, i) => {
            if (para.startsWith("### ")) {
              return (
                <h3 key={i} className="font-heading text-xl font-bold text-neutral-900 pt-3">
                  {para.replace("### ", "")}
                </h3>
              );
            }
            if (para.startsWith("> ")) {
              return (
                <blockquote key={i} className="border-l-4 border-clay-500 pl-4 py-1 italic bg-cream-50 text-neutral-700 rounded-r-lg my-3">
                  {para.replace("> ", "")}
                </blockquote>
              );
            }
            if (para.startsWith("**") && para.endsWith("**")) {
              return (
                <p key={i} className="font-bold text-neutral-900">
                  {para.replace(/\*\*/g, "")}
                </p>
              );
            }
            return <p key={i} className="leading-relaxed whitespace-pre-wrap">{para}</p>;
          })}
        </div>

        {/* Footer & Share CTA */}
        <div className="pt-8 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-neutral-500">
            Published by Manifest Kapchorwa Ministry Team
          </div>
          <Link href="/register">
            <Button size="sm" variant="outline" className="text-xs">
              Join Our Ministry Community
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
}
