"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UserPlus, CheckCircle2, ShieldCheck, Phone, MapPin, Heart } from "lucide-react";
import Link from "next/link";

interface RegistrationFormData {
  fullName: string;
  phone: string;
  email?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  dateOfBirth?: string;
  village?: string;
  parish?: string;
  subCounty?: string;
  district?: string;
  category?: "MEMBER" | "VISITOR" | "WORKER" | "NEW_CONVERT" | "YOUTH" | "CHILD";
  notes?: string;
  website_hp?: string; // Honeypot field
}

export default function RegisterPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<{ id: string; fullName: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegistrationFormData>({
    defaultValues: {
      category: "MEMBER",
      district: "Kapchorwa",
      website_hp: "",
    },
  });

  const onSubmit = async (data: RegistrationFormData) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        setErrorMessage(
          json.message ||
            "A registration with this phone number or email may already exist. Please contact the church office if you believe this is an error."
        );
        return;
      }

      setSuccessData(json.data);
      reset();
    } catch {
      setErrorMessage("Unable to connect to the church registration server. Please check your internet connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (successData) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="rounded-3xl bg-white border border-neutral-200 p-8 sm:p-12 text-center space-y-6 shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 text-green-700 shadow-inner">
            <CheckCircle2 className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <Badge variant="success">Registration Received</Badge>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-neutral-900">
              Welcome to the Family, {successData.fullName}!
            </h1>
            <p className="text-sm text-neutral-600 leading-relaxed max-w-md mx-auto">
              Your member registration for Manifest Kapchorwa has been successfully recorded. We are thrilled to walk with you in your spiritual journey.
            </p>
          </div>

          <div className="rounded-2xl bg-cream-50 border border-cream-200 p-4 text-xs text-neutral-700 space-y-1">
            <p className="font-semibold">Join us this Sunday:</p>
            <p>1st Service: 8:00 AM – 10:30 AM | 2nd Service: 11:00 AM – 1:30 PM</p>
            <p>Plot 14, Main Street, Kapchorwa Municipality</p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button onClick={() => setSuccessData(null)} variant="outline" size="sm">
              Register Another Family Member
            </Button>
            <Link href="/services">
              <Button variant="default" size="sm">
                View Service Times
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-3">
        <Badge variant="clay">Member Registration</Badge>
        <h1 className="font-heading text-3xl sm:text-5xl font-bold text-neutral-900">
          Join Manifest Kapchorwa
        </h1>
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-neutral-600 leading-relaxed">
          Please fill in your contact and residence information below to register as a church member or newcomer.
        </p>
      </div>

      <Card className="border-t-4 border-t-clay-600 shadow-sm bg-white">
        <CardHeader>
          <CardTitle className="text-xl">Registration Form</CardTitle>
          <CardDescription>
            All personal information is securely stored for church pastoral care and administrative records only.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Honeypot hidden input */}
            <div className="hidden" aria-hidden="true">
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                {...register("website_hp")}
              />
            </div>

            {errorMessage && (
              <Alert variant="destructive" title="Registration Notice">
                {errorMessage}
              </Alert>
            )}

            {/* Section 1: Personal Info */}
            <div className="space-y-4">
              <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-neutral-700 border-b border-neutral-100 pb-2">
                1. Personal Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Input
                    label="Full Name"
                    required
                    placeholder="e.g. Chemutai Joshua Kwemoi"
                    {...register("fullName", { required: "Full name is required (minimum 2 characters)" })}
                    error={errors.fullName?.message}
                  />
                </div>

                <div>
                  <Input
                    label="Phone Number (Uganda)"
                    required
                    placeholder="e.g. 0770 123456 or +256 750..."
                    {...register("phone", {
                      required: "Phone number is required",
                      minLength: { value: 8, message: "Please enter a valid phone number" },
                    })}
                    error={errors.phone?.message}
                    helperText="Used for church SMS updates and pastoral check-ins"
                  />
                </div>

                <div>
                  <Input
                    label="Email Address (Optional)"
                    type="email"
                    placeholder="e.g. joshua@example.com"
                    {...register("email")}
                    error={errors.email?.message}
                  />
                </div>

                <div>
                  <Select
                    label="Gender"
                    {...register("gender")}
                    options={[
                      { value: "", label: "-- Select Gender --" },
                      { value: "MALE", label: "Male" },
                      { value: "FEMALE", label: "Female" },
                      { value: "OTHER", label: "Prefer not to say" },
                    ]}
                  />
                </div>

                <div>
                  <Input
                    label="Date of Birth"
                    type="date"
                    {...register("dateOfBirth")}
                    helperText="Helps us connect you with appropriate age ministries"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Location & Residence in Sebei / Kapchorwa */}
            <div className="space-y-4 pt-2">
              <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-neutral-700 border-b border-neutral-100 pb-2">
                2. Residence & Location
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Input
                    label="Village / Cell / Zone"
                    placeholder="e.g. Cheptuya, Kawowo, Sipi Upper"
                    {...register("village")}
                  />
                </div>

                <div>
                  <Input
                    label="Parish / Ward"
                    placeholder="e.g. Kapchesombe, Tegeres"
                    {...register("parish")}
                  />
                </div>

                <div>
                  <Input
                    label="Sub-County / Division"
                    placeholder="e.g. Kapchorwa Municipality, Kween"
                    {...register("subCounty")}
                  />
                </div>

                <div>
                  <Input
                    label="District"
                    defaultValue="Kapchorwa"
                    {...register("district")}
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Ministry & Category */}
            <div className="space-y-4 pt-2">
              <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-neutral-700 border-b border-neutral-100 pb-2">
                3. Ministry Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Select
                    label="Membership Category"
                    {...register("category")}
                    options={[
                      { value: "MEMBER", label: "Regular Member" },
                      { value: "VISITOR", label: "Visitor / First Time Guest" },
                      { value: "NEW_CONVERT", label: "New Convert (Recent Decision for Christ)" },
                      { value: "WORKER", label: "Church Worker / Ministry Volunteer" },
                      { value: "YOUTH", label: "Youth & Young Adults" },
                      { value: "CHILD", label: "Child / Sunday School" },
                    ]}
                  />
                </div>

                <div className="sm:col-span-2">
                  <Textarea
                    label="Additional Notes / Prayer Burdens (Optional)"
                    placeholder="Share any special background, areas you'd like to serve, or prayer needs..."
                    {...register("notes")}
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-100">
              <Button
                type="submit"
                variant="clay"
                size="lg"
                isLoading={isSubmitting}
                className="w-full text-base font-bold shadow-md"
              >
                <UserPlus className="h-5 w-5 mr-2" />
                Submit Member Registration
              </Button>
              <p className="text-center text-xs text-neutral-500 mt-3">
                By submitting this form, you agree to receive pastoral communications from Manifest Kapchorwa.
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
