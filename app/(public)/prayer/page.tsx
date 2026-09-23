"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Send, CheckCircle2, ShieldCheck, Heart } from "lucide-react";

interface PrayerFormData {
  name: string;
  contact?: string;
  request: string;
  website_hp?: string;
}

export default function PrayerPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PrayerFormData>();

  const onSubmit = async (data: PrayerFormData) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/prayer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (!res.ok) {
        setErrorMessage(json.message || "Failed to send prayer request");
        return;
      }

      setSubmitted(true);
      reset();
    } catch {
      setErrorMessage("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-3">
        <Badge variant="clay">Pastoral Intercession</Badge>
        <h1 className="font-heading text-3xl sm:text-5xl font-bold text-neutral-900">
          Submit a Prayer Request
        </h1>
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-neutral-600 leading-relaxed">
          “The effective, fervent prayer of a righteous man avails much.” (James 5:16). Our pastoral and intercession team faithfully lifts every request to the Lord.
        </p>
      </div>

      {submitted ? (
        <div className="rounded-3xl bg-white border border-neutral-200 p-8 sm:p-12 text-center space-y-6 shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 text-green-700 shadow-inner">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <Badge variant="success">Prayer Request Submitted</Badge>
            <h2 className="font-heading text-2xl font-bold text-neutral-900">
              We Are Standing in Faith With You
            </h2>
            <p className="text-sm text-neutral-600 leading-relaxed max-w-md mx-auto">
              Your prayer request has been received by the Manifest Kapchorwa intercessory ministry. May the peace of God which surpasses all understanding guard your heart and mind.
            </p>
          </div>
          <Button onClick={() => setSubmitted(false)} variant="outline" size="sm">
            Submit Another Prayer Request
          </Button>
        </div>
      ) : (
        <Card className="border-t-4 border-t-highland-800 shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-xl">Prayer Request Form</CardTitle>
            <CardDescription>
              Prayer requests are kept confidential and shared only with pastoral intercessors.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="hidden" aria-hidden="true">
                <input type="text" tabIndex={-1} autoComplete="off" {...register("website_hp")} />
              </div>

              {errorMessage && (
                <Alert variant="destructive" title="Error">
                  {errorMessage}
                </Alert>
              )}

              <Input
                label="Your Name / Family Name"
                required
                placeholder="e.g. Sister Grace"
                {...register("name", { required: "Name is required" })}
                error={errors.name?.message}
              />

              <Input
                label="Phone Number or Email (Optional)"
                placeholder="e.g. 0770 123456 (if you would like a pastor to call you)"
                {...register("contact")}
              />

              <Textarea
                label="Your Prayer Request"
                required
                rows={5}
                placeholder="Please describe your prayer burden, healing need, family breakthrough, or thanksgiving..."
                {...register("request", {
                  required: "Please enter your prayer request",
                  minLength: { value: 5, message: "Request must be at least 5 characters" },
                })}
                error={errors.request?.message}
              />

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="default"
                  size="lg"
                  isLoading={isSubmitting}
                  className="w-full text-base font-semibold shadow"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Prayer Request
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
