"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert } from "@/components/ui/alert";
import { DevotionInput } from "@/validators/devotion";

interface DevotionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  devotion?: any | null;
  onSuccess: () => void;
}

export function DevotionModal({ open, onOpenChange, devotion, onSuccess }: DevotionModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<DevotionInput>();

  useEffect(() => {
    if (devotion) {
      setValue("title", devotion.title || "");
      setValue("slug", devotion.slug || "");
      setValue("author", devotion.author || "Pastor / Ministry Team");
      setValue("excerpt", devotion.excerpt || "");
      setValue("content", devotion.content || "");
      setValue("published", devotion.published ?? false);
    } else {
      reset({
        author: "Pastor / Ministry Team",
        published: false,
      });
    }
    setErrorMessage(null);
  }, [devotion, open, reset, setValue]);

  const onSubmit = async (data: DevotionInput) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const url = devotion ? `/api/admin/devotions/${devotion.id}` : "/api/admin/devotions";
      const method = devotion ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (!res.ok) {
        setErrorMessage(json.message || "Failed to save devotion");
        return;
      }

      onSuccess();
      onOpenChange(false);
    } catch {
      setErrorMessage("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={devotion ? "Edit Devotional" : "Write New Devotional"}
      description="Create or publish spiritual encouragement for the church community."
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {errorMessage && (
          <Alert variant="destructive" title="Error">
            {errorMessage}
          </Alert>
        )}

        <Input
          label="Devotional Title"
          required
          placeholder="e.g. Standing Firm on the Rock of Ages"
          {...register("title", { required: "Title is required" })}
          error={errors.title?.message}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Author / Speaker"
            placeholder="e.g. Senior Pastor"
            {...register("author")}
          />

          <Input
            label="Custom URL Slug (Optional)"
            placeholder="e.g. standing-firm-rock"
            {...register("slug")}
            helperText="Auto-generated from title if left blank"
          />
        </div>

        <Textarea
          label="Short Excerpt (Summary for preview cards)"
          rows={2}
          placeholder="Brief 1-2 sentence overview..."
          {...register("excerpt")}
        />

        <Textarea
          label="Devotional Message Content"
          required
          rows={10}
          placeholder="Write the full scripture reading, reflections, and closing prayer..."
          {...register("content", { required: "Devotional content is required" })}
          error={errors.content?.message}
        />

        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="devotion-published"
            className="h-4 w-4 rounded border-neutral-300 text-highland-800 focus:ring-highland-700"
            {...register("published")}
          />
          <label htmlFor="devotion-published" className="text-xs font-semibold text-neutral-700 cursor-pointer">
            Publish immediately on public website (Uncheck to save as draft)
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" variant="default" isLoading={isSubmitting}>
            {devotion ? "Update Devotional" : "Save Devotional"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
