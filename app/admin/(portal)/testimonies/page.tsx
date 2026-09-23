"use client";

import React, { useState, useEffect } from "react";
import { MessageSquare, CheckCircle2, XCircle, Archive, Trash2, Quote, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDateTime } from "@/lib/utils";

export default function TestimoniesAdminPage() {
  const [testimonies, setTestimonies] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("PENDING");
  const [isLoading, setIsLoading] = useState(true);

  // Delete
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [testimonyToDelete, setTestimonyToDelete] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchTestimonies = async () => {
    setIsLoading(true);
    try {
      const url = statusFilter ? `/api/admin/testimonies?status=${statusFilter}` : "/api/admin/testimonies";
      const res = await fetch(url);
      const json = await res.json();
      if (json.success && json.data) {
        setTestimonies(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonies();
  }, [statusFilter]);

  const handleUpdateStatus = async (id: string, status: "APPROVED" | "REJECTED" | "ARCHIVED") => {
    try {
      await fetch(`/api/admin/testimonies/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      fetchTestimonies();
    } catch {
      alert("Failed to update status");
    }
  };

  const handleDelete = async () => {
    if (!testimonyToDelete) return;
    setIsDeleting(true);
    try {
      await fetch(`/api/admin/testimonies/${testimonyToDelete.id}`, { method: "DELETE" });
      setDeleteConfirmOpen(false);
      setTestimonyToDelete(null);
      fetchTestimonies();
    } catch {
      alert("Failed to delete testimony");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200/80 pb-5">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-neutral-900">
            Testimonies Moderation
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Review user-submitted praise reports and approve them for public display.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1.5 bg-neutral-200/60 p-1 rounded-xl">
          <Button
            size="sm"
            variant={statusFilter === "PENDING" ? "clay" : "ghost"}
            className="h-8 text-xs font-semibold"
            onClick={() => setStatusFilter("PENDING")}
          >
            Pending Review
          </Button>
          <Button
            size="sm"
            variant={statusFilter === "APPROVED" ? "default" : "ghost"}
            className="h-8 text-xs font-semibold"
            onClick={() => setStatusFilter("APPROVED")}
          >
            Approved (Live)
          </Button>
          <Button
            size="sm"
            variant={statusFilter === "REJECTED" ? "default" : "ghost"}
            className="h-8 text-xs"
            onClick={() => setStatusFilter("REJECTED")}
          >
            Rejected
          </Button>
          <Button
            size="sm"
            variant={statusFilter === "ARCHIVED" ? "default" : "ghost"}
            className="h-8 text-xs"
            onClick={() => setStatusFilter("ARCHIVED")}
          >
            Archived
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-xs text-neutral-500">Loading testimonies...</div>
      ) : testimonies.length === 0 ? (
        <EmptyState
          icon={<MessageSquare className="h-8 w-8 text-neutral-400" />}
          title={`No ${statusFilter.toLowerCase()} testimonies`}
          description="All submissions in this category have been processed."
        />
      ) : (
        <div className="space-y-4">
          {testimonies.map((testimony) => (
            <div
              key={testimony.id}
              className={`rounded-2xl border bg-white p-5 shadow-xs space-y-3 transition-all ${
                testimony.status === "PENDING" ? "border-amber-300 bg-amber-50/20" : "border-neutral-200"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="font-heading font-bold text-sm sm:text-base text-neutral-900">
                    {testimony.name}
                  </span>
                  {testimony.contact && (
                    <span className="text-xs text-neutral-500 font-mono">({testimony.contact})</span>
                  )}
                  <Badge
                    variant={
                      testimony.status === "APPROVED"
                        ? "success"
                        : testimony.status === "PENDING"
                        ? "warning"
                        : "secondary"
                    }
                    className="text-[10px]"
                  >
                    {testimony.status}
                  </Badge>
                </div>

                <div className="text-xs text-neutral-400">
                  {formatDateTime(testimony.createdAt)}
                </div>
              </div>

              <div className="flex items-start gap-2 bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                <Quote className="h-5 w-5 text-clay-400 shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-neutral-800 leading-relaxed font-serif italic whitespace-pre-wrap">
                  "{testimony.content}"
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                <div className="flex items-center gap-2">
                  {testimony.status !== "APPROVED" && (
                    <Button
                      size="sm"
                      variant="default"
                      className="h-8 text-xs bg-green-700 hover:bg-green-800 text-white gap-1.5"
                      onClick={() => handleUpdateStatus(testimony.id, "APPROVED")}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Approve for Website</span>
                    </Button>
                  )}

                  {testimony.status !== "REJECTED" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs text-red-600 border-red-200 hover:bg-red-50 gap-1.5"
                      onClick={() => handleUpdateStatus(testimony.id, "REJECTED")}
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      <span>Reject</span>
                    </Button>
                  )}

                  {testimony.status !== "ARCHIVED" && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 text-xs text-neutral-600 gap-1.5"
                      onClick={() => handleUpdateStatus(testimony.id, "ARCHIVED")}
                    >
                      <Archive className="h-3.5 w-3.5" />
                      <span>Archive</span>
                    </Button>
                  )}
                </div>

                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-red-600"
                  onClick={() => {
                    setTestimonyToDelete(testimony);
                    setDeleteConfirmOpen(true);
                  }}
                  title="Delete Testimony"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete Testimony?"
        description="Are you sure you want to permanently delete this testimony record?"
        confirmText="Delete"
        variant="destructive"
        isLoading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
