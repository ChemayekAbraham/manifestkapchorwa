"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Tag,
  FileText,
  Edit2,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Clock,
  Shield,
  Cake,
} from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { PersonInput } from "@/validators/person";

interface MemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  person?: any | null;
  initialMode?: "view" | "edit";
  onSuccess: () => void;
}

export function MemberModal({
  open,
  onOpenChange,
  person,
  initialMode = "view",
  onSuccess,
}: MemberModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    formState: { errors },
  } = useForm<PersonInput>();

  useEffect(() => {
    if (person) {
      setIsEditing(initialMode === "edit");
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
      setIsEditing(true); // Creating a new person is always editing mode
      reset({
        fullName: "",
        phone: "",
        email: "",
        gender: undefined,
        dateOfBirth: "",
        village: "",
        parish: "",
        subCounty: "",
        category: "MEMBER",
        status: "ACTIVE",
        district: "Kapchorwa",
        notes: "",
        dateJoined: new Date().toISOString().split("T")[0],
      });
    }
    setErrorMessage(null);
  }, [person, open, initialMode, reset, setValue]);

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
        const msg = json.message || "Failed to save person record";
        setErrorMessage(msg);
        if (msg.toLowerCase().includes("email")) {
          setError("email", { message: msg });
        } else if (msg.toLowerCase().includes("phone")) {
          setError("phone", { message: msg });
        }
        return;
      }

      onSuccess();
      if (person) {
        setIsEditing(false);
      } else {
        onOpenChange(false);
      }
    } catch {
      setErrorMessage("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 1. READ-ONLY MEMBER DETAILS VIEW (When clicking on a member without clicking edit)
  if (person && !isEditing) {
    return (
      <Dialog
        open={open}
        onOpenChange={onOpenChange}
        title="Member Profile Details"
        description="Comprehensive membership record and contact information."
        maxWidth="max-w-2xl"
      >
        <div className="space-y-5">
          {/* Member Header Banner */}
          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80">
            <div className="flex h-13 w-13 rounded-2xl bg-highland-700 text-white font-heading text-xl font-bold items-center justify-center shadow-md shrink-0">
              {person.fullName ? person.fullName.charAt(0).toUpperCase() : "M"}
            </div>
            <div className="space-y-1">
              <h3 className="font-heading text-lg font-bold text-neutral-900 leading-tight">
                {person.fullName}
              </h3>
              <div className="flex flex-wrap items-center gap-1.5">
                <Badge variant={person.category === "NEW_CONVERT" ? "clay" : "outline"} className="text-[11px]">
                  {person.category}
                </Badge>
                <Badge
                  variant={
                    person.status === "ACTIVE"
                      ? "success"
                      : person.status === "INACTIVE"
                      ? "destructive"
                      : "secondary"
                  }
                  className="text-[11px]"
                >
                  {person.status}
                </Badge>
                {person.gender && (
                  <span className="text-[11px] font-medium text-neutral-500 bg-white px-2 py-0.5 rounded-md border border-neutral-200">
                    {person.gender}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Contact Details Card */}
            <div className="rounded-2xl border border-neutral-200 p-4 space-y-3 bg-white">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-700 border-b border-neutral-100 pb-2">
                <Phone className="h-3.5 w-3.5 text-highland-700" />
                <span>Contact Details</span>
              </div>
              <div className="space-y-2.5 text-xs">
                <div>
                  <span className="text-neutral-500 block text-[11px]">Phone Number</span>
                  {person.phone ? (
                    <a
                      href={`tel:${person.phone}`}
                      className="font-mono font-medium text-highland-700 hover:underline"
                    >
                      {person.phone}
                    </a>
                  ) : (
                    <span className="text-neutral-400 italic">Not provided</span>
                  )}
                </div>

                <div>
                  <span className="text-neutral-500 block text-[11px]">Email Address</span>
                  {person.email ? (
                    <a
                      href={`mailto:${person.email}`}
                      className="font-medium text-highland-700 hover:underline break-all"
                    >
                      {person.email}
                    </a>
                  ) : (
                    <span className="text-neutral-400 italic">Not provided</span>
                  )}
                </div>
              </div>
            </div>

            {/* Residence & Location Card */}
            <div className="rounded-2xl border border-neutral-200 p-4 space-y-3 bg-white">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-700 border-b border-neutral-100 pb-2">
                <MapPin className="h-3.5 w-3.5 text-highland-700" />
                <span>Residence & Location</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-neutral-500 block text-[11px]">Village / Cell</span>
                  <span className="font-semibold text-neutral-800">{person.village || "-"}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[11px]">Parish</span>
                  <span className="font-semibold text-neutral-800">{person.parish || "-"}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[11px]">Sub-County</span>
                  <span className="font-semibold text-neutral-800">{person.subCounty || "-"}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[11px]">District</span>
                  <span className="font-semibold text-neutral-800">{person.district || "Kapchorwa"}</span>
                </div>
              </div>
            </div>

            {/* Membership Info Card */}
            <div className="rounded-2xl border border-neutral-200 p-4 space-y-3 bg-white">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-700 border-b border-neutral-100 pb-2">
                <Calendar className="h-3.5 w-3.5 text-highland-700" />
                <span>Membership Timeline</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-neutral-500 block text-[11px]">Date Joined</span>
                  <span className="font-semibold text-neutral-800">{formatDate(person.dateJoined)}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[11px]">Date of Birth</span>
                  <span className="font-semibold text-neutral-800">{formatDate(person.dateOfBirth)}</span>
                </div>
              </div>
            </div>

            {/* Administrative Notes Card */}
            <div className="rounded-2xl border border-neutral-200 p-4 space-y-3 bg-white">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-700 border-b border-neutral-100 pb-2">
                <FileText className="h-3.5 w-3.5 text-highland-700" />
                <span>Administrative Notes</span>
              </div>
              <p className="text-xs text-neutral-700 whitespace-pre-wrap leading-relaxed">
                {person.notes ? person.notes : <span className="text-neutral-400 italic">No notes recorded for this member.</span>}
              </p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
            <span className="text-[11px] text-neutral-400">
              ID: {person.id}
            </span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
                Close
              </Button>
              <Button variant="default" size="sm" onClick={() => setIsEditing(true)} className="gap-1.5">
                <Edit2 className="h-3.5 w-3.5" />
                <span>Edit Details</span>
              </Button>
            </div>
          </div>
        </div>
      </Dialog>
    );
  }

  // 2. EDIT / CREATE FORM MODE
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={person ? "Edit Church Member" : "Add New Person / Member"}
      description={
        person
          ? "Update membership, contact, and residential information."
          : "Record new member information into the congregation database."
      }
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {errorMessage && (
          <Alert variant="destructive" title="Notice">
            {errorMessage}
          </Alert>
        )}

        {person && (
          <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="inline-flex items-center gap-1.5 text-xs text-highland-700 hover:text-highland-800 font-semibold cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Member Profile</span>
            </button>
            <span className="text-xs text-neutral-500 font-medium">Editing: {person.fullName}</span>
          </div>
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
          {person ? (
            <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          ) : (
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          )}
          <Button type="submit" variant="default" isLoading={isSubmitting}>
            {person ? "Save Changes" : "Create Record"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

