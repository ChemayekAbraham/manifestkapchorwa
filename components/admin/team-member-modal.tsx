"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import { Upload, Phone, User, Briefcase, MapPin, Sparkles, Image as ImageIcon } from "lucide-react";

export interface TeamMemberData {
  id?: string;
  name: string;
  role: string;
  phone: string;
  imageUrl?: string | null;
  bio?: string | null;
  location?: string | null;
  order?: number;
  active?: boolean;
}

interface TeamMemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member?: TeamMemberData | null;
  onSuccess: () => void;
}

export function TeamMemberModal({
  open,
  onOpenChange,
  member,
  onSuccess,
}: TeamMemberModalProps) {
  const isEditing = Boolean(member?.id);

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [phone, setPhone] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("Kapchorwa Town, Uganda");
  const [order, setOrder] = useState<number>(1);
  const [active, setActive] = useState(true);

  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (member) {
      setName(member.name || "");
      setRole(member.role || "");
      setPhone(member.phone || "");
      setImageUrl(member.imageUrl || "");
      setBio(member.bio || "");
      setLocation(member.location || "Kapchorwa Town, Uganda");
      setOrder(member.order ?? 1);
      setActive(member.active ?? true);
    } else {
      setName("");
      setRole("");
      setPhone("");
      setImageUrl("");
      setBio("");
      setLocation("Kapchorwa Town, Uganda");
      setOrder(1);
      setActive(true);
    }
    setError(null);
  }, [member, open]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/team/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to upload photo");
      }

      setImageUrl(data.url);
    } catch (err: any) {
      setError(err?.message || "Error uploading image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter the leader's full name");
      return;
    }
    if (!role.trim()) {
      setError("Please enter their ministry role or title");
      return;
    }
    if (!phone.trim()) {
      setError("Please enter a contact phone number");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        name: name.trim(),
        role: role.trim(),
        phone: phone.trim(),
        imageUrl: imageUrl.trim() || null,
        bio: bio.trim() || null,
        location: location.trim() || "Kapchorwa Town, Uganda",
        order: Number(order) || 0,
        active,
      };

      const url = isEditing ? `/api/admin/team/${member?.id}` : "/api/admin/team";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || "Failed to save team member");
      }

      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? `Edit / Rename: ${member?.name}` : "Add Ministry Team Member"}
      description={
        isEditing
          ? "Update details, change title, edit phone number, or replace portrait photo."
          : "Add a new leader to the Manifest Kapchorwa ministry leadership team."
      }
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6 pt-2">
        {error && (
          <Alert variant="destructive">
            {error}
          </Alert>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Input
              label="Full Name"
              required
              placeholder="e.g. Kiplangat Louis"
              value={name}
              onChange={(e) => setName(e.target.value)}
              helperText="The name displayed on the website and directory"
            />
          </div>

          <div>
            <Input
              label="Ministry Role / Title"
              required
              placeholder="e.g. Team Leader, Media, Finance"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </div>

          <div>
            <Input
              label="Phone Number (Uganda)"
              required
              placeholder="e.g. 0766026044 or +256 766..."
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              helperText="Used for direct call & WhatsApp links"
            />
          </div>
        </div>

        {/* Photo Upload Section */}
        <div className="space-y-2 rounded-2xl border border-neutral-200 bg-neutral-50/70 p-4">
          <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider block">
            Portrait Photo
          </label>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative h-24 w-20 shrink-0 rounded-xl overflow-hidden bg-neutral-200 border border-neutral-300">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={name || "Preview"}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-neutral-400">
                  <User className="h-8 w-8" />
                  <span className="text-[10px] mt-1">No photo</span>
                </div>
              )}
            </div>

            <div className="flex-1 space-y-2 w-full">
              <div className="flex items-center gap-2">
                <label className="cursor-pointer inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white border border-neutral-300 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 transition shadow-xs">
                  <Upload className="h-3.5 w-3.5 text-highland-700" />
                  <span>{isUploading ? "Uploading..." : "Upload Photo From Device"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={isUploading}
                    onChange={handleFileUpload}
                  />
                </label>
                {imageUrl && (
                  <button
                    type="button"
                    onClick={() => setImageUrl("")}
                    className="text-xs text-rose-600 hover:underline"
                  >
                    Remove
                  </button>
                )}
              </div>

              <Input
                placeholder="Or paste image URL (e.g. /images/team/name.jpg)"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Bio & Details */}
        <div className="space-y-4">
          <Textarea
            label="Ministry Bio / Responsibilities"
            rows={3}
            placeholder="Brief description of their servant leadership, duties, and ministry focus..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Location"
              placeholder="Kapchorwa Town, Uganda"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />

            <Input
              label="Display Order"
              type="number"
              min={1}
              value={order}
              onChange={(e) => setOrder(parseInt(e.target.value, 10) || 1)}
              helperText="Lower numbers appear first (e.g. 1 = Top)"
            />
          </div>
        </div>

        {/* Active Toggle */}
        <div className="flex items-center justify-between p-3.5 rounded-xl border border-neutral-200 bg-white">
          <div>
            <span className="text-xs font-bold text-neutral-900 block">
              Display on Public Website
            </span>
            <span className="text-[11px] text-neutral-500">
              When checked, this leader appears on the About page leadership section.
            </span>
          </div>
          <input
            type="checkbox"
            id="team-active"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
            className="h-5 w-5 rounded border-neutral-300 text-highland-700 focus:ring-highland-600 cursor-pointer"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="default"
            isLoading={isSubmitting}
          >
            {isEditing ? "Save Changes" : "Add Leader"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
