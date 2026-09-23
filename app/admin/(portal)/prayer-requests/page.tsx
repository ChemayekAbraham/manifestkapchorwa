"use client";

import React, { useState, useEffect } from "react";
import { Send, CheckCircle2, Archive, Trash2, Phone, Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDate, formatDateTime } from "@/lib/utils";

export default function PrayerRequestsAdminPage() {
  const [prayers, setPrayers] = useState<any[]>([]);
  const [filter, setFilter] = useState<"all" | "unreviewed" | "archived">("unreviewed");
  const [isLoading, setIsLoading] = useState(true);

  // Delete
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchPrayers = async () => {
    setIsLoading(true);
    try {
      let url = "/api/admin/prayer-requests";
      if (filter === "unreviewed") url += "?reviewed=false&archived=false";
      if (filter === "archived") url += "?archived=true";

      const res = await fetch(url);
      const json = await res.json();
      if (json.success && json.data) {
        setPrayers(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrayers();
  }, [filter]);

  const handleToggleReviewed = async (prayer: any) => {
    try {
      await fetch(`/api/admin/prayer-requests/${prayer.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isReviewed: !prayer.isReviewed }),
      });
      fetchPrayers();
    } catch {
      alert("Failed to update status");
    }
  };

  const handleToggleArchived = async (prayer: any) => {
    try {
      await fetch(`/api/admin/prayer-requests/${prayer.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isArchived: !prayer.isArchived }),
      });
      fetchPrayers();
    } catch {
      alert("Failed to archive prayer request");
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      await fetch(`/api/admin/prayer-requests/${itemToDelete.id}`, { method: "DELETE" });
      setDeleteConfirmOpen(false);
      setItemToDelete(null);
      fetchPrayers();
    } catch {
      alert("Failed to delete request");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200/80 pb-5">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-neutral-900">
            Prayer Requests & Intercession
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Review prayer burdens submitted by church members and online visitors.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-neutral-200/60 p-1 rounded-xl">
          <Button
            size="sm"
            variant={filter === "unreviewed" ? "default" : "ghost"}
            className="h-8 text-xs"
            onClick={() => setFilter("unreviewed")}
          >
            Unreviewed
          </Button>
          <Button
            size="sm"
            variant={filter === "all" ? "default" : "ghost"}
            className="h-8 text-xs"
            onClick={() => setFilter("all")}
          >
            All Active
          </Button>
          <Button
            size="sm"
            variant={filter === "archived" ? "default" : "ghost"}
            className="h-8 text-xs"
            onClick={() => setFilter("archived")}
          >
            Archived
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-xs text-neutral-500">Loading prayer requests...</div>
      ) : prayers.length === 0 ? (
        <EmptyState
          icon={<Send className="h-8 w-8 text-neutral-400" />}
          title="No Prayer Requests in this view"
          description="All caught up with intercession burdens."
        />
      ) : (
        <div className="space-y-4">
          {prayers.map((prayer) => (
            <div
              key={prayer.id}
              className={`rounded-2xl border bg-white p-5 shadow-xs space-y-3 transition-all ${
                !prayer.isReviewed ? "border-amber-300 bg-amber-50/20" : "border-neutral-200"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="font-heading font-bold text-sm sm:text-base text-neutral-900">
                    {prayer.name}
                  </span>
                  {prayer.contact && (
                    <span className="text-xs text-neutral-500 font-mono">({prayer.contact})</span>
                  )}
                  {!prayer.isReviewed ? (
                    <Badge variant="warning" className="text-[10px]">
                      Pending Review
                    </Badge>
                  ) : (
                    <Badge variant="success" className="text-[10px]">
                      Reviewed & Prayed
                    </Badge>
                  )}
                </div>

                <div className="text-xs text-neutral-400">
                  {formatDateTime(prayer.createdAt)}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed bg-neutral-50 p-3.5 rounded-xl border border-neutral-100 whitespace-pre-wrap">
                "{prayer.request}"
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant={prayer.isReviewed ? "outline" : "default"}
                    className="h-8 text-xs gap-1.5"
                    onClick={() => handleToggleReviewed(prayer)}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>{prayer.isReviewed ? "Mark Unreviewed" : "Mark as Prayed / Reviewed"}</span>
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 text-xs text-neutral-600 gap-1.5"
                    onClick={() => handleToggleArchived(prayer)}
                  >
                    <Archive className="h-3.5 w-3.5" />
                    <span>{prayer.isArchived ? "Unarchive" : "Archive"}</span>
                  </Button>
                </div>

                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-red-600"
                  onClick={() => {
                    setItemToDelete(prayer);
                    setDeleteConfirmOpen(true);
                  }}
                  title="Delete Request"
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
        title="Delete Prayer Request?"
        description="Are you sure you want to permanently remove this prayer request?"
        confirmText="Delete"
        variant="destructive"
        isLoading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
