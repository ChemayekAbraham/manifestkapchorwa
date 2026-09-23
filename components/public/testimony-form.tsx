"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sparkles, CheckCircle2 } from "lucide-react";

interface TestimonyFormData {
  name: string;
  contact?: string;
  content: string;
  website_hp?: string;
}

export function TestimonyForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TestimonyFormData>();

  const onSubmit = async (data: TestimonyFormData) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/testimony", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (!res.ok) {
        setErrorMessage(json.message || "Failed to submit testimony");
        return;
      }

      setSubmitted(true);
      reset();
    } catch {
      setErrorMessage("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-3xl bg-white border border-neutral-200 p-8 text-center space-y-4 shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-700">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <Badge variant="success">Submitted for Moderation</Badge>
        <h3 className="font-heading text-xl font-bold text-neutral-900">Thank You for Sharing!</h3>
        <p className="text-xs text-neutral-600 leading-relaxed">
          Your praise report has been sent to our pastoral team for review. Once approved, it will be published to inspire and build the faith of the church.
        </p>
        <Button onClick={() => setSubmitted(false)} variant="outline" size="sm">
          Share Another Testimony
        </Button>
      </div>
    );
  }

  return (
    <Card className="border-t-4 border-t-highland-500 shadow-sm bg-white">
      <CardHeader>
        <CardTitle className="text-xl">Share Your Testimony</CardTitle>
        <CardDescription>
          Every testimony is reviewed by church administrators before publication.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="hidden" aria-hidden="true">
            <input type="text" tabIndex={-1} autoComplete="off" {...register("website_hp")} />
          </div>

          {errorMessage && (
            <Alert variant="destructive" title="Submission Error">
              {errorMessage}
            </Alert>
          )}

          <Input
            label="Your Name"
            required
            placeholder="e.g. Chemutai Brenda"
            {...register("name", { required: "Name is required" })}
            error={errors.name?.message}
          />

          <Input
            label="Phone or Email (Optional)"
            placeholder="e.g. 0770 123456"
            {...register("contact")}
          />

          <Textarea
            label="What Has God Done For You?"
            required
            rows={6}
            placeholder="Describe how the Lord provided, healed, delivered, or answered your prayers..."
            {...register("content", {
              required: "Please write your testimony",
              minLength: { value: 10, message: "Testimony must be at least 10 characters" },
            })}
            error={errors.content?.message}
          />

          <Button
            type="submit"
            variant="default"
            size="lg"
            isLoading={isSubmitting}
            className="w-full font-semibold shadow"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Submit Testimony
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
