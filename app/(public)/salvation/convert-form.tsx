"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Heart, Sparkles, CheckCircle2, UserPlus, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { NewConvertInput } from "@/validators/convert";

export function ConvertForm() {
  const [selectedType, setSelectedType] = useState<"SOULS_WON" | "RECEIVED_JESUS">("RECEIVED_JESUS");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{ fullName: string; convertType: string } | null>(null);
  const [showOptionalFields, setShowOptionalFields] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<NewConvertInput>({
    defaultValues: {
      convertType: "RECEIVED_JESUS",
    },
  });

  const onSubmit = async (data: NewConvertInput) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/converts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          convertType: selectedType,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setErrorMessage(json.message || "Failed to submit registration. Please try again.");
        return;
      }

      setSuccessData(json.data);
      reset();
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
              {successData.convertType === "RECEIVED_JESUS"
                ? `Welcome Home, ${successData.fullName}!`
                : `Praise God! Soul Registered: ${successData.fullName}`}
            </h3>
            <p className="text-sm text-neutral-700 max-w-lg mx-auto leading-relaxed">
              {successData.convertType === "RECEIVED_JESUS"
                ? "“Therefore, if anyone is in Christ, he is a new creation; old things have passed away; behold, all things have become new.” — 2 Corinthians 5:17"
                : "“Likewise, I say to you, there is joy in the presence of the angels of God over one sinner who repents.” — Luke 15:10"}
            </p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-highland-200 max-w-md mx-auto text-left text-xs space-y-2 text-neutral-700">
            <div className="font-bold text-highland-900 uppercase tracking-wider text-[11px]">
              Next Steps in Your Faith Journey:
            </div>
            <ul className="space-y-1 list-disc list-inside text-neutral-600">
              <li>Join us for Sunday Service at the Main Sanctuary</li>
              <li>Sign up for our foundational discipleship classes</li>
              <li>Connect with our pastoral prayer team for guidance</li>
            </ul>
          </div>

          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <Button
              onClick={() => setSuccessData(null)}
              variant="outline"
              size="sm"
              className="text-xs font-bold"
            >
              Register Another Person
            </Button>
            <Link href="/services">
              <Button size="sm" variant="clay" className="text-xs font-bold">
                View Weekly Service Times
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

          {/* 2. NAME ONLY INPUT (Required) */}
          <div className="space-y-4 pt-2">
            <Input
              label="Full Name"
              placeholder="e.g. Chemutai Joshua Kwemoi"
              required
              {...register("fullName", { required: "Full name is required" })}
              error={errors.fullName?.message}
            />

            {/* Optional Collapsible Details */}
            {!showOptionalFields ? (
              <button
                type="button"
                onClick={() => setShowOptionalFields(true)}
                className="text-xs font-semibold text-highland-700 hover:text-highland-800 hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <span>+ Add contact or village details (Optional)</span>
              </button>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-neutral-50 border border-neutral-200 animate-in fade-in-50">
                <Input
                  label="Phone Number (Optional)"
                  placeholder="e.g. 0770 123456"
                  {...register("phone")}
                />
                <Input
                  label="Village / Cell (Optional)"
                  placeholder="e.g. Cheptuya"
                  {...register("village")}
                />
              </div>
            )}
          </div>

          {/* 3. SUBMIT BUTTON */}
          <div className="pt-2">
            <Button
              type="submit"
              variant="clay"
              size="lg"
              isLoading={isSubmitting}
              className="w-full sm:w-auto font-bold px-10 shadow-md text-sm"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Submit
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
