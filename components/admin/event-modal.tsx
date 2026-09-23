"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert } from "@/components/ui/alert";
import { EventInput } from "@/validators/event";

interface EventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event?: any | null;
  onSuccess: () => void;
}

export function EventModal({ open, onOpenChange, event, onSuccess }: EventModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<EventInput>();

  useEffect(() => {
    if (event) {
      setValue("name", event.name || "");
      const d = event.date ? new Date(event.date).toISOString().slice(0, 16) : "";
      setValue("date", d);
      setValue("location", event.location || "Main Sanctuary, Manifest Kapchorwa");
      setValue("description", event.description || "");
      setValue("published", event.published ?? true);
    } else {
      reset({
        location: "Main Sanctuary, Manifest Kapchorwa",
        published: true,
      });
    }
    setErrorMessage(null);
  }, [event, open, reset, setValue]);

  const onSubmit = async (data: EventInput) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const url = event ? `/api/admin/events/${event.id}` : "/api/admin/events";
      const method = event ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (!res.ok) {
        setErrorMessage(json.message || "Failed to save event");
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
      title={event ? "Edit Church Event" : "Create New Event"}
      description="Schedule a church service, prayer summit, or conference."
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {errorMessage && (
          <Alert variant="destructive" title="Error">
            {errorMessage}
          </Alert>
        )}

        <Input
          label="Event Name / Title"
          required
          placeholder="e.g. Sunday Celebration Service"
          {...register("name", { required: "Event name is required" })}
          error={errors.name?.message}
        />

        <Input
          label="Date & Time"
          type="datetime-local"
          required
          {...register("date", { required: "Date & Time is required" })}
          error={errors.date?.message}
        />

        <Input
          label="Location / Venue"
          placeholder="e.g. Main Sanctuary, Manifest Kapchorwa"
          {...register("location")}
        />

        <Textarea
          label="Event Description"
          rows={4}
          placeholder="Provide program details, theme scripture, or speaker information..."
          {...register("description")}
        />

        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="published"
            className="h-4 w-4 rounded border-neutral-300 text-highland-800 focus:ring-highland-700"
            {...register("published")}
          />
          <label htmlFor="published" className="text-xs font-semibold text-neutral-700 cursor-pointer">
            Publish event on public church website calendar
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" variant="default" isLoading={isSubmitting}>
            {event ? "Save Changes" : "Create Event"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
