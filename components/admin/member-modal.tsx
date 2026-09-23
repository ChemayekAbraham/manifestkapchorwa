"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Alert } from "@/components/ui/alert";
import { PersonInput } from "@/validators/person";

interface MemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  person?: any | null;
  onSuccess: () => void;
}

export function MemberModal({ open, onOpenChange, person, onSuccess }: MemberModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<PersonInput>();

  useEffect(() => {
    if (person) {
      setValue("fullName", person.fullName || "");
      setValue("phone", person.phone || "");
      setValue("email", person.email || "");
      setValue("gender", person.gender || "");
      setValue("dateOfBirth", person.dateOfBirth ? new Date(person.dateOfBirth).toISOString().split("T")[0] : "");
      setValue("village", person.village || "");
      setValue("parish", person.parish || "");
      setValue("subCounty", person.subCounty || "");
      setValue("district", person.district || "Kapchorwa");
      setValue("category", person.category || "MEMBER");
      setValue("status", person.status || "ACTIVE");
      setValue("notes", person.notes || "");
      setValue("dateJoined", person.dateJoined ? new Date(person.dateJoined).toISOString().split("T")[0] : "");
    } else {
      reset({
        category: "MEMBER",
        status: "ACTIVE",
        district: "Kapchorwa",
        dateJoined: new Date().toISOString().split("T")[0],
      });
    }
    setErrorMessage(null);
  }, [person, open, reset, setValue]);

  const onSubmit = async (data: PersonInput) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const url = person ? `/api/admin/people/${person.id}` : "/api/admin/people";
      const method = person ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (!res.ok) {
        setErrorMessage(json.message || "Failed to save person record");
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
      title={person ? "Edit Church Member" : "Add New Person / Member"}
      description="Record or update membership and contact information."
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {errorMessage && (
          <Alert variant="destructive" title="Notice">
            {errorMessage}
          </Alert>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="sm:col-span-2">
            <Input
              label="Full Name"
              required
              placeholder="e.g. Chemutai Joshua"
              {...register("fullName", { required: "Full Name is required" })}
              error={errors.fullName?.message}
            />
          </div>

          <div>
            <Input
              label="Phone Number"
              placeholder="e.g. 0770 123456 or +256 770..."
              {...register("phone")}
            />
          </div>

          <div>
            <Input
              label="Email Address"
              type="email"
              placeholder="e.g. member@example.com"
              {...register("email")}
            />
          </div>

          <div>
            <Select
              label="Gender"
              {...register("gender")}
              options={[
                { value: "", label: "-- Unspecified --" },
                { value: "MALE", label: "Male" },
                { value: "FEMALE", label: "Female" },
                { value: "OTHER", label: "Other" },
              ]}
            />
          </div>

          <div>
            <Input label="Date of Birth" type="date" {...register("dateOfBirth")} />
          </div>

          <div>
            <Select
              label="Category"
              {...register("category")}
              options={[
                { value: "MEMBER", label: "Member" },
                { value: "VISITOR", label: "Visitor" },
                { value: "NEW_CONVERT", label: "New Convert" },
                { value: "WORKER", label: "Church Worker" },
                { value: "YOUTH", label: "Youth" },
                { value: "CHILD", label: "Child" },
              ]}
            />
          </div>

          <div>
            <Select
              label="Status"
              {...register("status")}
              options={[
                { value: "ACTIVE", label: "Active" },
                { value: "INACTIVE", label: "Inactive (Soft-deleted)" },
                { value: "TRANSFERRED", label: "Transferred" },
              ]}
            />
          </div>

          <div>
            <Input label="Village / Cell" placeholder="e.g. Cheptuya" {...register("village")} />
          </div>

          <div>
            <Input label="Parish" placeholder="e.g. Kapchesombe" {...register("parish")} />
          </div>

          <div>
            <Input label="Sub-County" placeholder="e.g. Kapchorwa Municipality" {...register("subCounty")} />
          </div>

          <div>
            <Input label="District" defaultValue="Kapchorwa" {...register("district")} />
          </div>

          <div>
            <Input label="Date Joined" type="date" {...register("dateJoined")} />
          </div>

          <div className="sm:col-span-2">
            <Textarea label="Administrative Notes" rows={2} {...register("notes")} />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" variant="default" isLoading={isSubmitting}>
            {person ? "Save Changes" : "Create Record"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
