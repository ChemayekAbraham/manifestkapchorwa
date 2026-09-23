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
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [devotionModalOpen, setDevotionModalOpen] = useState(false);
  const [selectedDevotion, setSelectedDevotion] = useState<any | null>(null);

  // Delete
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [devotionToDelete, setDevotionToDelete] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchDevotions = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      const res = await fetch(`/api/admin/devotions?${params.toString()}`);
      const json = await res.json();
      if (json.success && json.data) {
        setDevotions(json.data.items);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDevotions();
  }, []);

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
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-neutral-900">
            Devotionals & Ministry Articles
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Write, publish, and manage written messages for the church website.
          </p>
        </div>

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
                  <span className="font-bold text-xs text-neutral-900 block">{devotion.title}</span>
                  <span className="text-[10px] text-neutral-500 font-mono block">/{devotion.slug}</span>
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
