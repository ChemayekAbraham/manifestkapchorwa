import React from "react";
import { BookOpen, Sparkles, Heart, BookmarkCheck } from "lucide-react";

interface DevotionContentRendererProps {
  content: string;
}

interface ParsedDevotion {
  scripture?: { reference: string; text: string };
  bodyParagraphs: string[];
  furtherStudy?: string;
  goldenNugget?: string;
  prayer?: string;
}

export function parseDevotionText(rawContent: string): ParsedDevotion {
  // Normalize raw content: clean stray markup or asterisks
  const normalized = rawContent
    .replace(/\*\+/g, "")
    .replace(/\+\*/g, "")
    .replace(/\r\n/g, "\n");

  const rawParagraphs = normalized.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

  let scripture: { reference: string; text: string } | undefined = undefined;
  let furtherStudy: string | undefined = undefined;
  let goldenNugget: string | undefined = undefined;
  let prayer: string | undefined = undefined;
  const bodyParagraphs: string[] = [];

  for (let i = 0; i < rawParagraphs.length; i++) {
    let p = rawParagraphs[i];

    // Clean leading dashes or empty dividers
    if (p === "—" || p === "–" || p === "---" || p === "***") {
      continue;
    }

    // Check if it's the Golden Nugget
    const nuggetMatch = p.match(/(?:\*{0,3}_?_?|\b)GOLDEN NUGGET:?\s*(?:\*{0,3}_?_?|\s*)([\s\S]*)/i);
    if (nuggetMatch) {
      goldenNugget = cleanInlineText(nuggetMatch[1]);
      continue;
    }

    // Check if it's Further Study
    const studyMatch = p.match(/(?:\*{0,3}_?_?|\b)FURTHER STUDY:?\s*(?:\*{0,3}_?_?|\s*)([\s\S]*)/i);
    if (studyMatch) {
      furtherStudy = cleanInlineText(studyMatch[1]);
      continue;
    }

    // Check if it's Prayer
    const prayerMatch = p.match(/(?:\*{0,3}_?_?|\b)PRAYER:?\s*(?:\*{0,3}_?_?|\s*)([\s\S]*)/i);
    if (prayerMatch) {
      prayer = cleanInlineText(prayerMatch[1]);
      continue;
    }

    // Check if first paragraph is opening Scripture (contains book + chapter:verse)
    if (!scripture && i === 0 && /\b(?:\d\s*)?[A-Z][a-z]+\s+\d+:\d+(?:-\d+)?/i.test(p)) {
      const parts = p.split(/:\s*[“”"']/);
      if (parts.length >= 2) {
        const ref = cleanInlineText(parts[0]);
        const txt = cleanInlineText(parts.slice(1).join(": "));
        scripture = {
          reference: ref.replace(/^["'“”]/, "").replace(/["'“”]$/, ""),
          text: txt.replace(/^["'“”]/, "").replace(/["'“”]$/, ""),
        };
        continue;
      }
    }

    // Regular body paragraph
    const cleaned = cleanInlineText(p);
    if (cleaned.length > 0) {
      bodyParagraphs.push(cleaned);
    }
  }

  return { scripture, bodyParagraphs, furtherStudy, goldenNugget, prayer };
}

function cleanInlineText(text: string): string {
  return text
    .replace(/\*{1,4}/g, "")
    .replace(/_{1,4}/g, "")
    .replace(/^[–—]\s*/, "")
    .replace(/^["'“”]/, "")
    .replace(/["'“”]$/, "")
    .trim();
}

export function DevotionContentRenderer({ content }: DevotionContentRendererProps) {
  const parsed = parseDevotionText(content);

  return (
    <div className="space-y-8 text-neutral-800">
      {/* 1. THEME SCRIPTURE CALLOUT */}
      {parsed.scripture && (
        <div className="rounded-2xl bg-cream-50 border-l-4 border-highland-700 p-5 sm:p-7 space-y-3 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-highland-800">
            <BookOpen className="h-4 w-4" />
            <span>Theme Scripture — {parsed.scripture.reference}</span>
          </div>
          <blockquote className="font-serif text-base sm:text-lg italic text-neutral-900 leading-relaxed">
            “{parsed.scripture.text}”
          </blockquote>
        </div>
      )}

      {/* 2. MAIN TEACHING BODY */}
      <div className="space-y-5 font-serif text-base sm:text-[17px] leading-relaxed text-neutral-800">
        {parsed.bodyParagraphs.map((para, idx) => (
          <p key={idx} className="leading-loose text-justify text-neutral-800">
            {para}
          </p>
        ))}
      </div>

      {/* 3. FURTHER STUDY SCRIPTURES */}
      {parsed.furtherStudy && (
        <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-5 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-700">
            <BookmarkCheck className="h-4 w-4 text-highland-700" />
            <span>Further Study</span>
          </div>
          <p className="font-medium text-sm text-highland-900 font-sans tracking-wide">
            {parsed.furtherStudy}
          </p>
        </div>
      )}

      {/* 4. GOLDEN NUGGET */}
      {parsed.goldenNugget && (
        <div className="rounded-2xl bg-amber-50/70 border border-amber-200 p-5 sm:p-6 space-y-2 relative overflow-hidden">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-900">
            <Sparkles className="h-4 w-4 text-amber-600" />
            <span>Golden Nugget</span>
          </div>
          <p className="font-serif italic text-base text-amber-950 font-medium leading-relaxed">
            “{parsed.goldenNugget}”
          </p>
        </div>
      )}

      {/* 5. PRAYER */}
      {parsed.prayer && (
        <div className="rounded-2xl bg-highland-50/80 border border-highland-200 p-5 sm:p-7 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-highland-800">
            <Heart className="h-4 w-4 text-highland-700" />
            <span>Prayer</span>
          </div>
          <p className="font-serif italic text-base sm:text-[16.5px] text-neutral-900 leading-relaxed">
            {parsed.prayer}
          </p>
        </div>
      )}
    </div>
  );
}
