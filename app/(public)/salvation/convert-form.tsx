"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Heart,
  Sparkles,
  UserPlus,
  Users,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";

interface PersonEntry {
  id: string;
  fullName: string;
  phone: string;
  village: string;
  showDetails: boolean;
}

export function ConvertForm() {
  const [selectedType, setSelectedType] = useState<"SOULS_WON" | "RECEIVED_JESUS">("SOULS_WON");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    count: number;
    fullName?: string;
    convertType: string;
    people?: Array<{ id: string; fullName: string }>;
  } | null>(null);

  // Dynamic list of people with an initial person
  const [people, setPeople] = useState<PersonEntry[]>([
    {
      id: "1",
      fullName: "",
      phone: "",
      village: "",
      showDetails: false,
    },
  ]);

  const addPerson = () => {
    setPeople((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        fullName: "",
        phone: "",
        village: "",
        showDetails: false,
      },
    ]);
  };

  const removePerson = (id: string) => {
    if (people.length <= 1) return;
    setPeople((prev) => prev.filter((p) => p.id !== id));
  };

  const updatePerson = (id: string, field: keyof PersonEntry, value: any) => {
    setPeople((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validate that every person has a full name
    const invalidPerson = people.find((p) => !p.fullName || p.fullName.trim().length < 2);
    if (invalidPerson) {
      setErrorMessage("Please enter a valid full name (at least 2 characters) for every person in the list.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/converts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          convertType: selectedType,
          people: people.map((p) => ({
            fullName: p.fullName.trim(),
            phone: p.phone.trim() || undefined,
            village: p.village.trim() || undefined,
          })),
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setErrorMessage(json.message || "Failed to submit registration. Please try again.");
        return;
      }

      setSuccessData(json.data);
      // Reset form to single empty person
      setPeople([
        {
          id: String(Date.now()),
          fullName: "",
          phone: "",
          village: "",
          showDetails: false,
        },
      ]);
    } catch {
      setErrorMessage("Network error. Please check your internet connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-3xl bg-white border border-neutral-200 p-6 sm:p-10 shadow-xl space-y-8">
      {successData ? (
        <div className="rounded-2xl bg-highland-50 border border-highland-200 p-6 sm:p-10 text-center space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-highland-600 text-white shadow-lg">
            <Sparkles className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <h3 className="font-heading text-2xl sm:text-3xl font-bold text-neutral-900">
              {successData.count > 1
                ? `Praise God! All ${successData.count} Souls Registered Successfully!`
                : successData.convertType === "RECEIVED_JESUS"
                ? `Welcome Home, ${successData.fullName}!`
                : `Praise God! Soul Registered: ${successData.fullName}`}
            </h3>
            <p className="text-sm text-neutral-700 max-w-lg mx-auto leading-relaxed">
              {successData.convertType === "RECEIVED_JESUS"
                ? "“Therefore, if anyone is in Christ, he is a new creation; old things have passed away; behold, all things have become new.” — 2 Corinthians 5:17"
                : "“Likewise, I say to you, there is joy in the presence of the angels of God over one sinner who repents.” — Luke 15:10"}
            </p>
          </div>

          {/* List of registered people */}
          {successData.people && successData.people.length > 1 && (
            <div className="p-4 bg-white rounded-xl border border-highland-200 max-w-md mx-auto text-left text-xs space-y-2 text-neutral-800">
              <div className="font-bold text-highland-900 uppercase tracking-wider text-[11px] border-b border-neutral-100 pb-1.5">
                Registered Names ({successData.people.length}):
              </div>
              <ul className="space-y-1 divide-y divide-neutral-100">
                {successData.people.map((p, idx) => (
                  <li key={p.id || idx} className="pt-1 flex items-center justify-between">
                    <span className="font-medium text-neutral-900">
                      {idx + 1}. {p.fullName}
                    </span>
                    <span className="text-[10px] text-highland-700 font-bold uppercase">Recorded</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="p-4 bg-white rounded-xl border border-highland-200 max-w-md mx-auto text-left text-xs space-y-2 text-neutral-700">
            <div className="font-bold text-highland-900 uppercase tracking-wider text-[11px]">
              Next Steps in Discipleship:
            </div>
            <ul className="space-y-1 list-disc list-inside text-neutral-600">
              <li>Pastoral follow-up and foundational discipleship classes</li>
              <li>Sunday Service welcome at the Main Sanctuary</li>
              <li>Home cell fellowship and community connection</li>
            </ul>
          </div>

          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <Button
              onClick={() => setSuccessData(null)}
              variant="outline"
              size="sm"
              className="text-xs font-bold"
            >
              Register More Souls
            </Button>
            <Link href="/services">
              <Button size="sm" variant="clay" className="text-xs font-bold">
                View Weekly Service Times
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-6">
          {errorMessage && (
            <Alert variant="destructive" title="Submission Error">
              {errorMessage}
            </Alert>
          )}

          {/* 1. SELECTION BOXES (Matching Phaneroo Style) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label
              onClick={() => setSelectedType("SOULS_WON")}
              className={`relative flex items-start gap-3.5 p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                selectedType === "SOULS_WON"
                  ? "border-highland-700 bg-highland-50/50 shadow-sm"
                  : "border-neutral-200 bg-white hover:border-neutral-300"
              }`}
            >
              <input
                type="radio"
                name="convertTypeRadio"
                checked={selectedType === "SOULS_WON"}
                onChange={() => setSelectedType("SOULS_WON")}
                className="mt-1 h-4 w-4 text-highland-700 focus:ring-highland-700"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-sm text-neutral-900">
                  <Users className="h-4 w-4 text-highland-700" />
                  <span>Souls Won (Mobilization & Outreach)</span>
                </div>
                <p className="text-xs text-neutral-500 italic">
                  If you won souls during mobilization or an outreach
                </p>
              </div>
            </label>

            <label
              onClick={() => setSelectedType("RECEIVED_JESUS")}
              className={`relative flex items-start gap-3.5 p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                selectedType === "RECEIVED_JESUS"
                  ? "border-highland-700 bg-highland-50/50 shadow-sm"
                  : "border-neutral-200 bg-white hover:border-neutral-300"
              }`}
            >
              <input
                type="radio"
                name="convertTypeRadio"
                checked={selectedType === "RECEIVED_JESUS"}
                onChange={() => setSelectedType("RECEIVED_JESUS")}
                className="mt-1 h-4 w-4 text-highland-700 focus:ring-highland-700"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-sm text-neutral-900">
                  <Heart className="h-4 w-4 text-red-500" />
                  <span>I&apos;ve Just Received Jesus</span>
                </div>
                <p className="text-xs text-neutral-500 italic">
                  If you got born again while watching or attending a service
                </p>
              </div>
            </label>
          </div>

          {/* 2. DYNAMIC LIST OF PEOPLE */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                {selectedType === "SOULS_WON" ? "People / Souls Won" : "Person Details"}
                {people.length > 1 && ` (${people.length} People)`}
              </span>
              <span className="text-xs text-neutral-400">
                Use the <strong className="text-highland-700">+ button</strong> below to add more people
              </span>
            </div>

            <div className="space-y-4">
              {people.map((person, index) => (
                <div
                  key={person.id}
                  className="p-5 rounded-2xl bg-neutral-50/80 border border-neutral-200 space-y-3.5 relative transition-all hover:border-highland-300"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-highland-900 bg-highland-100 px-2.5 py-0.5 rounded-full">
                      Person #{index + 1}
                    </span>

                    {people.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePerson(person.id)}
                        className="text-xs font-semibold text-rose-600 hover:text-rose-800 flex items-center gap-1 p-1 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Remove this person"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Remove</span>
                      </button>
                    )}
                  </div>

                  {/* Full Name input */}
                  <div>
                    <Input
                      label="Full Name"
                      placeholder="e.g. Chemutai Joshua Kwemoi"
                      required
                      value={person.fullName}
                      onChange={(e) => updatePerson(person.id, "fullName", e.target.value)}
                    />
                  </div>

                  {/* Collapsible Contact / Village Details */}
                  {!person.showDetails ? (
                    <button
                      type="button"
                      onClick={() => updatePerson(person.id, "showDetails", true)}
                      className="text-xs font-semibold text-highland-700 hover:text-highland-800 hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <ChevronDown className="h-3.5 w-3.5" />
                      <span>+ Add phone or village details (Optional)</span>
                    </button>
                  ) : (
                    <div className="space-y-2 pt-1 animate-in fade-in-50">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Input
                          label="Phone Number (Optional)"
                          placeholder="e.g. 0770 123456"
                          value={person.phone}
                          onChange={(e) => updatePerson(person.id, "phone", e.target.value)}
                        />
                        <Input
                          label="Village / Cell (Optional)"
                          placeholder="e.g. Cheptuya"
                          value={person.village}
                          onChange={(e) => updatePerson(person.id, "village", e.target.value)}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => updatePerson(person.id, "showDetails", false)}
                        className="text-[11px] text-neutral-400 hover:text-neutral-600 inline-flex items-center gap-1 cursor-pointer"
                      >
                        <ChevronUp className="h-3 w-3" />
                        <span>Hide additional details</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* 3. THE PROMINENT "+" ADD BUTTON */}
            <div className="pt-1">
              <Button
                type="button"
                onClick={addPerson}
                variant="outline"
                className="w-full sm:w-auto border-2 border-dashed border-highland-400 hover:border-highland-600 hover:bg-highland-50/70 text-highland-800 font-bold gap-2 py-3 px-6 rounded-2xl shadow-xs transition-all flex items-center justify-center cursor-pointer"
              >
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-highland-600 text-white">
                  <Plus className="h-3.5 w-3.5 stroke-[3]" />
                </div>
                <span>+ Add Another Person ({people.length + 1})</span>
              </Button>
            </div>
          </div>

          {/* 4. SUBMIT BUTTON */}
          <div className="pt-4 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-neutral-500">
              Ready to submit {people.length} {people.length === 1 ? "person" : "people"} to church discipleship records.
            </span>
            <Button
              type="submit"
              variant="clay"
              size="lg"
              isLoading={isSubmitting}
              className="w-full sm:w-auto font-bold px-10 shadow-md text-sm"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              <span>
                {people.length > 1 ? `Submit All (${people.length} People)` : "Submit Registration"}
              </span>
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
