"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Alert } from "@/components/ui/alert";
import { CreateUserInput, UpdateUserInput } from "@/validators/auth";

interface UserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: any | null;
  onSuccess: () => void;
}

export function UserModal({ open, onOpenChange, user, onSuccess }: UserModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<any>();

  useEffect(() => {
    if (user) {
      setValue("name", user.name || "");
      setValue("email", user.email || "");
      setValue("role", user.role || "ADMIN");
      setValue("active", user.active ?? true);
      setValue("password", "");
    } else {
      reset({
        role: "ADMIN",
        active: true,
        password: "",
      });
    }
    setErrorMessage(null);
  }, [user, open, reset, setValue]);

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const url = user ? `/api/admin/users/${user.id}` : "/api/admin/users";
      const method = user ? "PATCH" : "POST";

      const payload: any = {
        name: data.name,
        email: data.email,
        role: data.role,
      };

      if (user) {
        payload.active = data.active;
        if (data.password) payload.password = data.password;
      } else {
        payload.password = data.password;
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        setErrorMessage(json.message || "Failed to save user");
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
      title={user ? "Edit User Account" : "Create Administrator Account"}
      description="Configure role permissions and access credentials."
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {errorMessage && (
          <Alert variant="destructive" title="Error">
            {errorMessage}
          </Alert>
        )}

        <Input
          label="Full Name"
          required
          placeholder="e.g. Pastoral Secretary"
          {...register("name", { required: "Name is required" })}
          error={errors.name?.message as string}
        />

        <Input
          label="Email Address"
          type="email"
          required
          placeholder="e.g. staff@manifestkapchorwa.org"
          {...register("email", { required: "Email is required" })}
          error={errors.email?.message as string}
        />

        <Input
          label={user ? "New Password (Leave blank to keep unchanged)" : "Password"}
          type="password"
          required={!user}
          placeholder="••••••••••••"
          {...register("password", {
            required: user ? false : "Password is required (minimum 8 characters)",
            minLength: { value: 8, message: "Minimum 8 characters" },
          })}
          error={errors.password?.message as string}
        />

        <Select
          label="System Role"
          {...register("role")}
          options={[
            { value: "ADMIN", label: "ADMIN (Can manage records, reports & content)" },
            { value: "VIEWER", label: "VIEWER (Read-only access to dashboard & reports)" },
            { value: "SUPER_ADMIN", label: "SUPER_ADMIN (Full administrative access)" },
          ]}
        />

        {user && (
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="user-active"
              className="h-4 w-4 rounded border-neutral-300 text-highland-800 focus:ring-highland-700"
              {...register("active")}
            />
            <label htmlFor="user-active" className="text-xs font-semibold text-neutral-700 cursor-pointer">
              Account Active (Uncheck to suspend login)
            </label>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" variant="default" isLoading={isSubmitting}>
            {user ? "Save Changes" : "Create Account"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
