"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  UserPlus,
  Upload,
  Download,
  Search,
  Filter,
  Trash2,
  Edit2,
  RefreshCw,
  Eye,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { MemberModal } from "@/components/admin/member-modal";
import { ImportModal } from "@/components/admin/import-modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDate } from "@/lib/utils";

import { useAdminUser } from "@/components/admin/admin-user-context";

export default function PeopleManagementPage() {
  const { user: adminUser } = useAdminUser();
  const [people, setPeople] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [gender, setGender] = useState("");
  const [village, setVillage] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Current user info for RBAC checks
  const currentUserRole = adminUser.role;

  // Modals state
  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<any | null>(null);
  const [importModalOpen, setImportModalOpen] = useState(false);

  // Delete Confirm Dialog state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [isPermanentDelete, setIsPermanentDelete] = useState(false);
  const [personToDelete, setPersonToDelete] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchPeople = async (targetPage = page) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", targetPage.toString());
      params.set("pageSize", pageSize.toString());
      if (search.trim()) params.set("search", search.trim());
      if (category) params.set("category", category);
      if (status) params.set("status", status);
      if (gender) params.set("gender", gender);
      if (village) params.set("village", village);

      const res = await fetch(`/api/admin/people?${params.toString()}`);
      const json = await res.json();

      if (json.success && json.data) {
        setPeople(json.data.items);
        setTotal(json.data.total);
        setPage(json.data.page);
        setTotalPages(json.data.totalPages || 1);
      }
    } catch (e) {
      console.error("Error loading people", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPeople(1);
  }, [category, status, gender, village, pageSize]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPeople(1);
  };

  const handleExportCSV = async () => {
    const params: any = {
      type: "custom",
      format: "csv",
      category: category || undefined,
      status: status || undefined,
      gender: gender || undefined,
      village: village || undefined,
      fields: ["fullName", "phone", "email", "gender", "village", "parish", "subCounty", "category", "status", "dateJoined"],
    };

    const res = await fetch("/api/admin/reports/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });

    if (res.ok) {
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `manifest-kapchorwa-members-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  };

  const handleDelete = async () => {
    if (!personToDelete) return;
    setIsDeleting(true);

    try {
      const url = `/api/admin/people/${personToDelete.id}${isPermanentDelete ? "?permanent=true" : ""}`;
      const res = await fetch(url, { method: "DELETE" });

      if (res.ok) {
        setDeleteConfirmOpen(false);
        setPersonToDelete(null);
        fetchPeople(page);
      }
    } catch {
      alert("Failed to process deletion");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200/80 pb-5">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-neutral-900">
            People & Congregation Management
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Total {total} people recorded • Search, filter, edit, or import members.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant="clay"
            onClick={() => {
              setSelectedPerson(null);
              setMemberModalOpen(true);
            }}
            className="gap-1.5 shadow-sm text-xs"
          >
            <UserPlus className="h-4 w-4" />
            <span>Add Member</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setImportModalOpen(true)}
            className="gap-1.5 text-xs"
          >
            <Upload className="h-4 w-4" />
            <span>Import CSV</span>
          </Button>

          <Button
            size="sm"
            variant="secondary"
            onClick={handleExportCSV}
            className="gap-1.5 text-xs"
          >
            <Download className="h-4 w-4" />
            <span>Export CSV</span>
          </Button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-xs space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by full name, phone number, email, or village..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-full rounded-lg border border-neutral-300 bg-neutral-50/60 pl-9 pr-4 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-highland-700 focus-visible:bg-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button type="submit" size="sm" variant="default" className="text-xs">
              Search
            </Button>
            <Button
              type="button"
              size="sm"
              variant={showFilters ? "secondary" : "outline"}
              onClick={() => setShowFilters(!showFilters)}
              className="gap-1.5 text-xs"
            >
              <Filter className="h-3.5 w-3.5" />
              <span>Filters {showFilters && "▲"}</span>
            </Button>
            {(search || category || status || gender || village) && (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => {
                  setSearch("");
                  setCategory("");
                  setStatus("");
                  setGender("");
                  setVillage("");
                  fetchPeople(1);
                }}
                className="text-xs text-neutral-500"
              >
                Reset
              </Button>
            )}
          </div>
        </form>

        {/* Collapsible Filter Dropdowns */}
        {showFilters && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-neutral-100">
            <Select
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={[
                { value: "", label: "All Categories" },
                { value: "MEMBER", label: "Member" },
                { value: "VISITOR", label: "Visitor" },
                { value: "NEW_CONVERT", label: "New Convert" },
                { value: "WORKER", label: "Worker" },
                { value: "YOUTH", label: "Youth" },
                { value: "CHILD", label: "Child" },
              ]}
            />
            <Select
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              options={[
                { value: "", label: "All Statuses" },
                { value: "ACTIVE", label: "Active" },
                { value: "INACTIVE", label: "Inactive (Soft-deleted)" },
                { value: "TRANSFERRED", label: "Transferred" },
              ]}
            />
            <Select
              label="Gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              options={[
                { value: "", label: "All Genders" },
                { value: "MALE", label: "Male" },
                { value: "FEMALE", label: "Female" },
              ]}
            />
            <Input
              label="Village / Cell"
              placeholder="e.g. Cheptuya"
              value={village}
              onChange={(e) => setVillage(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* People Data Table */}
      {isLoading ? (
        <div className="rounded-2xl border border-neutral-200 bg-white p-12 text-center text-xs text-neutral-500">
          Loading congregation members...
        </div>
      ) : people.length === 0 ? (
        <EmptyState
          icon={<Users className="h-8 w-8 text-neutral-400" />}
          title="No Members Found"
          description="No members match your current filter and search criteria."
          action={
            <Button
              size="sm"
              variant="default"
              onClick={() => {
                setSelectedPerson(null);
                setMemberModalOpen(true);
              }}
            >
              Add First Member
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Full Name</TableHead>
                <TableHead>Contact (Phone / Email)</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Location (Village)</TableHead>
                <TableHead>Date Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {people.map((person) => (
                <TableRow key={person.id} className={person.status === "INACTIVE" ? "opacity-60 bg-neutral-50/50" : ""}>
                  <TableCell>
                    <span className="font-bold text-xs text-neutral-900 block">{person.fullName}</span>
                    {person.gender && <span className="text-[10px] text-neutral-500">{person.gender}</span>}
                  </TableCell>
                  <TableCell className="text-xs">
                    <span className="font-mono text-neutral-900 block">{person.phone || "-"}</span>
                    <span className="text-[10px] text-neutral-500 block">{person.email || ""}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={person.category === "NEW_CONVERT" ? "clay" : "outline"} className="text-[10px]">
                      {person.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        person.status === "ACTIVE"
                          ? "success"
                          : person.status === "INACTIVE"
                          ? "destructive"
                          : "secondary"
                      }
                      className="text-[10px]"
                    >
                      {person.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs">
                    <span className="text-neutral-900 block">{person.village || "-"}</span>
                    <span className="text-[10px] text-neutral-500 block">{person.subCounty || ""}</span>
                  </TableCell>
                  <TableCell className="text-xs text-neutral-500">{formatDate(person.dateJoined)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-neutral-600 hover:text-neutral-900"
                        onClick={() => {
                          setSelectedPerson(person);
                          setMemberModalOpen(true);
                        }}
                        title="Edit Member"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>

                      {/* Soft Delete (Deactivate) */}
                      {person.status === "ACTIVE" && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-amber-600 hover:bg-amber-50"
                          onClick={() => {
                            setPersonToDelete(person);
                            setIsPermanentDelete(false);
                            setDeleteConfirmOpen(true);
                          }}
                          title="Deactivate (Soft-delete)"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}

                      {/* Permanent Delete for SUPER_ADMIN only */}
                      {currentUserRole === "SUPER_ADMIN" && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-red-600 hover:bg-red-50"
                          onClick={() => {
                            setPersonToDelete(person);
                            setIsPermanentDelete(true);
                            setDeleteConfirmOpen(true);
                          }}
                          title="Permanently Delete (Super Admin)"
                        >
                          <ShieldAlert className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between text-xs text-neutral-500 px-2">
            <span>
              Showing {people.length} of {total} records (Page {page} of {totalPages})
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => fetchPeople(page - 1)}
                className="h-8 px-2.5"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Prev</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => fetchPeople(page + 1)}
                className="h-8 px-2.5"
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modals & Dialogs */}
      <MemberModal
        open={memberModalOpen}
        onOpenChange={setMemberModalOpen}
        person={selectedPerson}
        onSuccess={() => fetchPeople(page)}
      />

      <ImportModal
        open={importModalOpen}
        onOpenChange={setImportModalOpen}
        onSuccess={() => fetchPeople(1)}
      />

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title={isPermanentDelete ? "Permanently Delete Member Record?" : "Deactivate Church Member?"}
        description={
          isPermanentDelete
            ? `Are you sure you want to permanently delete "${personToDelete?.fullName}"? This action cannot be undone and will delete all associated attendance history.`
            : `Are you sure you want to mark "${personToDelete?.fullName}" as inactive? Their record and attendance history will be safely preserved.`
        }
        confirmText={isPermanentDelete ? "Permanent Delete" : "Deactivate"}
        variant="destructive"
        isLoading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
