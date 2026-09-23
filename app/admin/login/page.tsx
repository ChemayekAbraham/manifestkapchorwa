"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lock, Church, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { LoginInput } from "@/validators/auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/admin/dashboard";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>();

  const onSubmit = async (data: LoginInput) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        setErrorMessage(json.message || "Invalid login credentials");
        return;
      }

      router.push(from);
      router.refresh();
    } catch {
      setErrorMessage("Network error. Please check your internet connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-neutral-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-4 px-4">
        {/* Brand Logo */}
        <div className="relative h-16 w-48 mx-auto">
          <Image
            src="/images/logo.png"
            alt="Manifest Kapchorwa Logo"
            fill
            priority
            className="object-contain"
            sizes="200px"
          />
        </div>

        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-neutral-900">
            Kapchorwa Manifest
          </h1>
          <p className="text-xs font-bold tracking-wider text-highland-700 uppercase mt-0.5">
            Administrative Portal
          </p>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <Card className="border-t-4 border-t-highland-500 shadow-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Administrator Sign In</CardTitle>
            <CardDescription>
              Enter your church email and password to access member records, reports, and settings.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {errorMessage && (
                <Alert variant="destructive" title="Authentication Error">
                  {errorMessage}
                </Alert>
              )}

              <Input
                label="Email Address"
                type="email"
                required
                placeholder="admin@manifestkapchorwa.org"
                {...register("email", { required: "Email is required" })}
                error={errors.email?.message}
              />

              <Input
                label="Password"
                type="password"
                required
                placeholder="••••••••••••"
                {...register("password", { required: "Password is required" })}
                error={errors.password?.message}
              />

              <Button
                type="submit"
                variant="default"
                size="lg"
                isLoading={isSubmitting}
                className="w-full font-bold shadow-md"
              >
                <Lock className="h-4 w-4 mr-2" />
                Sign In to Admin Portal
              </Button>
            </form>

            <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
              <Link href="/" className="flex items-center gap-1 hover:text-highland-800 font-medium">
                <Church className="h-3.5 w-3.5" />
                <span>Return to Website</span>
              </Link>
              <span className="text-[11px] text-neutral-400">Kapchorwa, Uganda</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
