"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { UserCheck, CheckCircle2, AlertTriangle, UserPlus, Church } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ServiceCheckInInput } from "@/validators/check-in";

const DEFAULT_SERVICES = [
  "Sunday First Service (8:00 AM – 10:30 AM)",
  "Sunday Second Service (11:00 AM – 1:30 PM)",
  "Wednesday Mid-Week Deliverance & Prayer (5:00 PM – 7:00 PM)",
  "Friday Youth Fellowship (5:30 PM – 7:30 PM)",
  "Highlands Overnight Prayer Summit",
  "Special Celebration & Thanksgiving Service",
];

export function ServiceAttendanceForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [notRegistered, setNotRegistered] = useState(false);
  const [successInfo, setSuccessInfo] = useState<{ personName: string; serviceName: string } | null>(null);
  const [serviceOptions, setServiceOptions] = useState<string[]>(DEFAULT_SERVICES);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<ServiceCheckInInput>({
    defaultValues: {
      serviceName: DEFAULT_SERVICES[0],
    },
  });

  const enteredEmail = watch("email");
  const enteredName = watch("fullName");

  // Optionally fetch upcoming church events from database to enrich the dropdown
  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await fetch("/api/events");
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          const dbEventNames = json.data.map((e: any) => e.name);
          const combined = Array.from(new Set([...DEFAULT_SERVICES, ...dbEventNames]));
          setServiceOptions(combined);
        }
      } catch {
        // Fallback to DEFAULT_SERVICES
      }
    }
    loadEvents();
  }, []);

  const onSubmit = async (data: ServiceCheckInInput) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    setNotRegistered(false);

    try {
      const res = await fetch("/api/attendance/check-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        if (res.status === 404 || json.notRegistered) {
          setNotRegistered(true);
          setErrorMessage(
            json.message ||
              "This email address is not registered in our church records. Please first register as a church member to check in for services."
          );
        } else {
          setErrorMessage(json.message || "Unable to confirm attendance. Please try again.");
        }
        return;
      }

      setSuccessInfo(json.data);
      reset({
        fullName: "",
        email: "",
        serviceName: data.serviceName,
      });
    } catch {
      setErrorMessage("Network error. Please check your internet connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-3xl bg-white border-2 border-highland-100 p-6 sm:p-10 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="clay">Service Attendance</Badge>
            <span className="text-xs text-neutral-500">Quick Check-in</span>
          </div>
          <h3 className="font-heading text-2xl font-bold text-neutral-900 mt-1">
            Check In for Service Today
          </h3>
          <p className="text-xs sm:text-sm text-neutral-600">
            Attending service today? Select your service, enter your name and registered email address to confirm your attendance.
          </p>
        </div>
        <div className="hidden sm:flex h-12 w-12 rounded-2xl bg-highland-50 text-highland-700 items-center justify-center shrink-0">
          <UserCheck className="h-6 w-6" />
        </div>
      </div>

      {successInfo ? (
        <div className="rounded-2xl bg-highland-50 border border-highland-200 p-6 text-center space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-highland-600 text-white shadow-md">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <div className="space-y-1">
            <h4 className="font-heading text-xl font-bold text-neutral-900">
              Attendance Confirmed: Present!
            </h4>
            <p className="text-xs sm:text-sm text-neutral-700 max-w-md mx-auto">
              Welcome, <strong>{successInfo.personName}</strong>! Your attendance for <strong>{successInfo.serviceName}</strong> has been successfully recorded as <strong>Present</strong> on the church register.
            </p>
          </div>
          <Button
            onClick={() => setSuccessInfo(null)}
            variant="outline"
            size="sm"
            className="text-xs border-highland-300 text-highland-800 hover:bg-highland-100 font-semibold"
          >
            Check in another person
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {notRegistered ? (
            <div className="rounded-2xl bg-amber-50 border-2 border-amber-300 p-5 space-y-3">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-amber-900">Registration Required First</h4>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    We could not find a member account with the email <strong>{enteredEmail}</strong>. You must first register as a church member before checking in for services.
                  </p>
                </div>
              </div>
              <div className="pt-2 flex flex-wrap gap-2">
                <Link
                  href={`/register?email=${encodeURIComponent(enteredEmail || "")}&name=${encodeURIComponent(enteredName || "")}`}
                >
                  <Button size="sm" variant="clay" className="font-bold shadow-sm">
                    <UserPlus className="h-3.5 w-3.5 mr-1.5" />
                    Register as Member Now
                  </Button>
                </Link>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setNotRegistered(false);
                    setErrorMessage(null);
                  }}
                  className="text-xs"
                >
                  Try a Different Email
                </Button>
              </div>
            </div>
          ) : errorMessage ? (
            <Alert variant="destructive" title="Check-in Error">
              {errorMessage}
            </Alert>
          ) : null}

          {/* Service Selector Dropdown */}
          <Select
            label="Service / Gathering Attending"
            required
            {...register("serviceName", { required: "Please select the service you are attending" })}
            error={errors.serviceName?.message}
          >
            {serviceOptions.map((srv) => (
              <option key={srv} value={srv}>
                {srv}
              </option>
            ))}
          </Select>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              placeholder="e.g. Chemutai Joshua Kwemoi"
              required
              {...register("fullName", { required: "Full name is required" })}
              error={errors.fullName?.message}
            />

            <Input
              label="Registered Email Address"
              type="email"
              placeholder="e.g. joshua@example.com"
              required
              {...register("email", { required: "Email address is required" })}
              error={errors.email?.message}
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <p className="text-[11px] text-neutral-500">
              Not yet registered?{" "}
              <Link href="/register" className="text-highland-700 font-semibold underline hover:text-highland-800">
                Register as a member here
              </Link>
            </p>
            <Button
              type="submit"
              variant="clay"
              size="lg"
              isLoading={isSubmitting}
              className="w-full sm:w-auto font-bold px-8 shadow-md"
            >
              <UserCheck className="h-4 w-4 mr-2" />
              Confirm My Attendance
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

