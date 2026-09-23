"use client";

import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Search,
  Eye,
  CheckCircle2,
  Clock,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { DevotionModal } from "@/components/admin/devotion-modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export default function DevotionsManagementPage() {
  const [devotions, setDevotions] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMode, setSyncMode] = useState<"latest" | "all">("latest");
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  // Modals
  const [devotionModalOpen, setDevotionModalOpen] = useState(false);
  const [selectedDevotion, setSelectedDevotion] = useState<any | null>(null);

  // Delete
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [devotionToDelete, setDevotionToDelete] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchDevotions = async (targetPage = page) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      params.set("page", targetPage.toString());
      params.set("pageSize", pageSize.toString());
      const res = await fetch(`/api/admin/devotions?${params.toString()}`);
      const json = await res.json();
      if (json.success && json.data) {
        setDevotions(json.data.items);
        setTotalPages(json.data.pagination?.totalPages || 1);
        setTotalCount(json.data.pagination?.total || json.data.items.length);
        setPage(targetPage);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDevotions(1);
  }, [search, pageSize]);

  const handleSyncPhaneroo = async (fetchAll = false) => {
    setIsSyncing(true);
    setSyncMode(fetchAll ? "all" : "latest");
    setSyncStatus(null);
    try {
      const res = await fetch("/api/admin/devotions/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          syncAll: fetchAll,
          maxPages: fetchAll ? 25 : 8,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setSyncStatus(json.message);
        fetchDevotions(1);
      } else {
        setSyncStatus(json.message || "Failed to sync devotions.");
      }
    } catch {
      setSyncStatus("Network error syncing devotions.");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleTogglePublish = async (devotion: any) => {
    try {
      await fetch(`/api/admin/devotions/${devotion.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !devotion.published }),
      });
      fetchDevotions();
    } catch {
      alert("Failed to update status");
    }
  };

  const handleDelete = async () => {
    if (!devotionToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/devotions/${devotionToDelete.id}`, { method: "DELETE" });
      if (res.ok) {
        setDeleteConfirmOpen(false);
        setDevotionToDelete(null);
        fetchDevotions();
      }
    } catch {
      alert("Failed to delete devotional");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-neutral-900">
              Devotionals & Sermons
            </h1>
            <Badge variant="outline" className="text-xs font-semibold">
              {totalCount} Total
            </Badge>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Write, publish, or sync all daily sermons and devotions directly from Phaneroo.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Sync */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleSyncPhaneroo(false)}
            isLoading={isSyncing && syncMode === "latest"}
            disabled={isSyncing}
            className="gap-1.5 text-xs border-highland-300 text-highland-800 hover:bg-highland-50 font-semibold"
            title="Fetches the latest sermons & devotions"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isSyncing && syncMode === "latest" ? "animate-spin" : ""}`} />
            <span>Sync Latest</span>
          </Button>

          {/* Fetch All Bulk Sync */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleSyncPhaneroo(true)}
            isLoading={isSyncing && syncMode === "all"}
            disabled={isSyncing}
            className="gap-1.5 text-xs border-amber-400 bg-amber-50/50 text-amber-900 hover:bg-amber-100/70 font-semibold"
            title="Fetches all available sermon and devotion pages from Phaneroo"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isSyncing && syncMode === "all" ? "animate-spin" : ""}`} />
            <span>Fetch All Sermons</span>
          </Button>

          <Button
            size="sm"
            variant="clay"
            onClick={() => {
              setSelectedDevotion(null);
              setDevotionModalOpen(true);
            }}
            className="gap-1.5 shadow-sm text-xs"
          >
            <Plus className="h-4 w-4" />
            <span>Write Devotional</span>
          </Button>
        </div>
      </div>

      {syncStatus && (
        <div className="rounded-xl bg-highland-50 border border-highland-200 p-3.5 text-xs text-highland-900 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-highland-700 shrink-0" />
            <span>{syncStatus}</span>
          </div>
          <button
            onClick={() => setSyncStatus(null)}
            className="text-neutral-400 hover:text-neutral-700 font-bold text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* Search Bar */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-xs">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchDevotions();
          }}
          className="flex gap-3"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search devotionals by title or author..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-full rounded-lg border border-neutral-300 pl-9 pr-4 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-highland-700"
            />
          </div>
          <Button type="submit" size="sm" variant="default" className="text-xs">
            Search
          </Button>
        </form>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-xs text-neutral-500">Loading devotionals...</div>
      ) : devotions.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="h-8 w-8 text-neutral-400" />}
          title="No Devotionals Found"
          description="Share spiritual messages, scripture reading, and prayers with your church congregation."
          action={
            <Button
              size="sm"
              variant="default"
              onClick={() => {
                setSelectedDevotion(null);
                setDevotionModalOpen(true);
              }}
            >
              Write First Devotional
            </Button>
          }
        />
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Published Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {devotions.map((devotion) => (
                <TableRow key={devotion.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {devotion.imageUrl ? (
                        <img
                          src={devotion.imageUrl}
                          alt={devotion.title}
                          className="h-11 w-11 rounded-xl object-cover bg-neutral-900 shrink-0 border border-neutral-200 shadow-xs"
                        />
                      ) : (
                        <div className="h-11 w-11 rounded-xl bg-highland-50 text-highland-700 flex items-center justify-center shrink-0 border border-highland-200">
                          <BookOpen className="h-5 w-5" />
                        </div>
                      )}
                      <div>
                        <span className="font-bold text-xs text-neutral-900 block">{devotion.title}</span>
                        <span className="text-[10px] text-neutral-500 font-mono block">/{devotion.slug}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">{devotion.author}</TableCell>
                  <TableCell>
                    <Badge variant={devotion.published ? "success" : "secondary"} className="text-[10px]">
                      {devotion.published ? "Published" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-neutral-500">
                    {formatDate(devotion.publishedAt || devotion.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {devotion.published && (
                        <Link href={`/devotions/${devotion.slug}`} target="_blank">
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-neutral-600" title="View on Website">
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                      )}

                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs px-2.5"
                        onClick={() => handleTogglePublish(devotion)}
                      >
                        {devotion.published ? "Unpublish" : "Publish"}
                      </Button>

                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-neutral-600"
                        onClick={() => {
                          setSelectedDevotion(devotion);
                          setDevotionModalOpen(true);
                        }}
                        title="Edit Devotional"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>

                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-red-600"
                        onClick={() => {
                          setDevotionToDelete(devotion);
                          setDeleteConfirmOpen(true);
                        }}
                        title="Delete Devotional"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination Bar */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-neutral-200 text-xs text-neutral-600">
              <div>
                Showing <span className="font-bold text-neutral-900">{devotions.length}</span> of{" "}
                <span className="font-bold text-neutral-900">{totalCount}</span> devotionals (Page {page} of {totalPages})
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={page <= 1 || isLoading}
                  onClick={() => fetchDevotions(page - 1)}
                  className="h-8 text-xs"
                >
                  Previous
                </Button>
                <div className="flex items-center gap-1 px-2 font-semibold text-neutral-800">
                  {page} / {totalPages}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={page >= totalPages || isLoading}
                  onClick={() => fetchDevotions(page + 1)}
                  className="h-8 text-xs"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modals */}
      <DevotionModal
        open={devotionModalOpen}
        onOpenChange={setDevotionModalOpen}
        devotion={selectedDevotion}
        onSuccess={fetchDevotions}
      />

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete Devotional?"
        description={`Are you sure you want to delete "${devotionToDelete?.title}"? This cannot be undone.`}
        confirmText="Delete"
        variant="destructive"
        isLoading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
