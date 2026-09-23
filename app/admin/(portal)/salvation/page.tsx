"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Search,
  Plus,
  FileDown,
  Phone,
  Mail,
  MapPin,
  Calendar,
  UserCheck,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  Heart,
  Users,
  ArrowRight,
  Filter,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";
import { MetricCard } from "@/components/admin/metric-card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { formatDate } from "@/lib/utils";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function SalvationManagementPage() {
  const [items, setItems] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalConverts: 0, soulsWon: 0, receivedJesus: 0 });
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | "SOULS_WON" | "RECEIVED_JESUS">("ALL");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Modals & Details State
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedConvert, setSelectedConvert] = useState<any | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // New Convert Form State
  const [newType, setNewType] = useState<"SOULS_WON" | "RECEIVED_JESUS">("SOULS_WON");
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newVillage, setNewVillage] = useState("");
  const [newNotes, setNewNotes] = useState("");

  // Edit Convert Form State
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editVillage, setEditVillage] = useState("");
  const [editNotes, setEditNotes] = useState("");

  const fetchSalvationRecords = async (targetPage = page) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      if (filterType !== "ALL") params.set("type", filterType);
      params.set("page", targetPage.toString());
      params.set("pageSize", "25");

      const res = await fetch(`/api/admin/salvation?${params.toString()}`);
      const json = await res.json();
      if (json.success && json.data) {
        setItems(json.data.items);
        setStats(json.data.stats || { totalConverts: 0, soulsWon: 0, receivedJesus: 0 });
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
    fetchSalvationRecords(1);
  }, [search, filterType]);

  const handleCreateConvert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/salvation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: newName,
          phone: newPhone,
          email: newEmail,
          village: newVillage,
          convertType: newType,
          notes: newNotes,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setAddModalOpen(false);
        setNewName("");
        setNewPhone("");
        setNewEmail("");
        setNewVillage("");
        setNewNotes("");
        setStatusMessage(json.message);
        fetchSalvationRecords(1);
      } else {
        alert(json.message || "Failed to create salvation record");
      }
    } catch {
      alert("Network error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateConvert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConvert) return;

    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/salvation/${selectedConvert.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: editName,
          phone: editPhone,
          email: editEmail,
          village: editVillage,
          notes: editNotes,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setSelectedConvert(json.data);
        setIsEditMode(false);
        setStatusMessage("Salvation record successfully updated.");
        fetchSalvationRecords();
      } else {
        alert(json.message || "Failed to update record");
      }
    } catch {
      alert("Network error");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePromoteToMember = async () => {
    if (!selectedConvert) return;
    if (!confirm(`Are you sure you want to transition ${selectedConvert.fullName} to a full Church Member?`)) return;

    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/salvation/${selectedConvert.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: "MEMBER" }),
      });
      const json = await res.json();
      if (json.success) {
        setDetailsModalOpen(false);
        setStatusMessage(`${selectedConvert.fullName} has been transitioned to full Church Member!`);
        fetchSalvationRecords();
      }
    } catch {
      alert("Failed to update membership");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/salvation/${itemToDelete.id}`, { method: "DELETE" });
      if (res.ok) {
        setDeleteConfirmOpen(false);
        setItemToDelete(null);
        if (detailsModalOpen && selectedConvert?.id === itemToDelete.id) {
          setDetailsModalOpen(false);
        }
        setStatusMessage("Salvation record deleted successfully.");
        fetchSalvationRecords();
      }
    } catch {
      alert("Failed to delete record");
    } finally {
      setIsDeleting(false);
    }
  };

  const openDetails = (convert: any) => {
    setSelectedConvert(convert);
    setEditName(convert.fullName);
    setEditPhone(convert.phone || "");
    setEditEmail(convert.email || "");
    setEditVillage(convert.village || "");
    setEditNotes(convert.notes || "");
    setIsEditMode(false);
    setDetailsModalOpen(true);
  };

  const exportPDF = () => {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    doc.setFillColor(34, 76, 56);
    doc.rect(0, 0, doc.internal.pageSize.width, 24, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text("MANIFEST KAPCHORWA — SALVATION & SOULS WON", 14, 12);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(218, 235, 224);
    doc.text(`Generated on: ${new Date().toLocaleString()} | Filter: ${filterType}`, 14, 18);

    const tableRows = items.map((c, idx) => [
      idx + 1,
      c.fullName,
      c.phone || "—",
      c.village || "—",
      c.notes?.includes("Souls Won") ? "Souls Won (Outreach)" : "Received Jesus",
      formatDate(c.createdAt),
    ]);

    autoTable(doc, {
      startY: 28,
      head: [["#", "Full Name", "Phone", "Village", "Decision Type", "Date Recorded"]],
      body: tableRows,
      theme: "grid",
      headStyles: {
        fillColor: [34, 76, 56],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 9,
      },
      styles: { fontSize: 8.5, cellPadding: 3 },
      alternateRowStyles: { fillColor: [248, 250, 249] },
    });

    doc.save(`manifest-salvation-records-${new Date().toISOString().split("T")[0]}.pdf`);
  };

  const exportCSV = () => {
    const headers = ["Full Name", "Phone", "Email", "Village", "Notes", "Date Recorded"];
    const rows = items.map((c) => [
      `"${c.fullName.replace(/"/g, '""')}"`,
      `"${c.phone || ""}"`,
      `"${c.email || ""}"`,
      `"${c.village || ""}"`,
      `"${(c.notes || "").replace(/"/g, '""')}"`,
      `"${new Date(c.createdAt).toLocaleDateString()}"`,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `salvation-records-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Primary Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-neutral-900">
                Salvation & Souls Won
              </h1>
              <p className="text-xs text-neutral-500">
                Track new believers, outreach decisions, follow-up discipleship, and evangelism harvest.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={exportPDF}
            disabled={items.length === 0}
            className="gap-1.5 text-xs border-neutral-300"
          >
            <FileDown className="h-4 w-4" />
            <span>Export PDF</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={exportCSV}
            disabled={items.length === 0}
            className="gap-1.5 text-xs border-neutral-300"
          >
            <FileDown className="h-4 w-4" />
            <span>Export CSV</span>
          </Button>

          <Button
            size="sm"
            variant="clay"
            onClick={() => setAddModalOpen(true)}
            className="gap-1.5 shadow-sm text-xs font-bold"
          >
            <Plus className="h-4 w-4" />
            <span>Register New Soul</span>
          </Button>
        </div>
      </div>

      {statusMessage && (
        <div className="rounded-xl bg-highland-50 border border-highland-200 p-3.5 text-xs text-highland-900 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-highland-700 shrink-0" />
            <span>{statusMessage}</span>
          </div>
          <button onClick={() => setStatusMessage(null)} className="text-neutral-400 hover:text-neutral-700 font-bold">
            ✕
          </button>
        </div>
      )}

      {/* 2. Metric Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard
          title="Total Decisions"
          value={stats.totalConverts}
          subtitle="All new converts registered"
          icon={<Sparkles className="h-5 w-5" />}
          variant="clay"
        />
        <MetricCard
          title="Souls Won (Outreach)"
          value={stats.soulsWon}
          subtitle="Mobilization & Evangelism"
          icon={<Users className="h-5 w-5" />}
          variant="ochre"
        />
        <MetricCard
          title="Received Jesus"
          value={stats.receivedJesus}
          subtitle="Personal salvation decisions"
          icon={<Heart className="h-5 w-5" />}
          variant="success"
        />
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by name, phone, email, village, or notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-full rounded-lg border border-neutral-300 pl-9 pr-4 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-highland-700"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-neutral-100 rounded-xl w-full sm:w-auto overflow-x-auto">
            <button
              type="button"
              onClick={() => setFilterType("ALL")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                filterType === "ALL" ? "bg-white text-neutral-900 shadow-xs" : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              All Records ({stats.totalConverts})
            </button>
            <button
              type="button"
              onClick={() => setFilterType("SOULS_WON")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                filterType === "SOULS_WON" ? "bg-white text-neutral-900 shadow-xs" : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              Souls Won ({stats.soulsWon})
            </button>
            <button
              type="button"
              onClick={() => setFilterType("RECEIVED_JESUS")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                filterType === "RECEIVED_JESUS" ? "bg-white text-neutral-900 shadow-xs" : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              Received Jesus ({stats.receivedJesus})
            </button>
          </div>
        </div>
      </div>

      {/* 4. Table of Converts */}
      {isLoading ? (
        <div className="p-12 text-center text-xs text-neutral-500">Loading salvation records...</div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={<Sparkles className="h-8 w-8 text-neutral-400" />}
          title="No Salvation Records Found"
          description={
            search
              ? "No records matched your search query."
              : "No salvation or outreach records registered in this category yet."
          }
          action={
            <Button size="sm" variant="clay" onClick={() => setAddModalOpen(true)}>
              Register First Soul
            </Button>
          }
        />
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Full Name</TableHead>
                <TableHead>Contact (Phone / Email)</TableHead>
                <TableHead>Decision Type</TableHead>
                <TableHead>Location (Village)</TableHead>
                <TableHead>Date Recorded</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((person) => {
                const isSoulsWon = person.notes?.includes("Souls Won");
                return (
                  <TableRow
                    key={person.id}
                    className="cursor-pointer hover:bg-neutral-50/80 transition-colors"
                    onClick={() => openDetails(person)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700 font-bold text-xs border border-amber-200">
                          {person.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span className="font-bold text-xs text-neutral-900 block">{person.fullName}</span>
                          <span className="text-[10px] text-neutral-500 uppercase font-semibold block">
                            {person.category}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">
                      <div>{person.phone || "—"}</div>
                      {person.email && <div className="text-[11px] text-neutral-400">{person.email}</div>}
                    </TableCell>
                    <TableCell>
                      <Badge variant={isSoulsWon ? "clay" : "success"} className="text-[10px]">
                        {isSoulsWon ? "Souls Won (Outreach)" : "Received Jesus"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-neutral-600">{person.village || "—"}</TableCell>
                    <TableCell className="text-xs text-neutral-500">{formatDate(person.createdAt)}</TableCell>
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-neutral-600"
                          onClick={() => openDetails(person)}
                          title="View Details"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-red-600"
                          onClick={() => {
                            setItemToDelete(person);
                            setDeleteConfirmOpen(true);
                          }}
                          title="Delete Record"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-neutral-200 text-xs text-neutral-600">
              <div>
                Showing <span className="font-bold text-neutral-900">{items.length}</span> of{" "}
                <span className="font-bold text-neutral-900">{totalCount}</span> records (Page {page} of {totalPages})
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={page <= 1 || isLoading}
                  onClick={() => fetchSalvationRecords(page - 1)}
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
                  onClick={() => fetchSalvationRecords(page + 1)}
                  className="h-8 text-xs"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* 5. REGISTER NEW SOUL MODAL */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-neutral-200 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-neutral-900">Register Salvation Decision</h3>
                  <p className="text-xs text-neutral-500">Add a new convert or soul won into the database.</p>
                </div>
              </div>
              <button onClick={() => setAddModalOpen(false)} className="text-neutral-400 hover:text-neutral-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateConvert} className="space-y-4">
              {/* Type Selection */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setNewType("SOULS_WON")}
                  className={`p-3 rounded-2xl border-2 text-left transition-all ${
                    newType === "SOULS_WON"
                      ? "border-amber-600 bg-amber-50/50 text-amber-950"
                      : "border-neutral-200 hover:border-neutral-300 text-neutral-600"
                  }`}
                >
                  <Users className="h-4 w-4 text-amber-700 mb-1" />
                  <span className="font-bold text-xs block">Souls Won</span>
                  <span className="text-[10px] text-neutral-500 block">Outreach & Evangelism</span>
                </button>

                <button
                  type="button"
                  onClick={() => setNewType("RECEIVED_JESUS")}
                  className={`p-3 rounded-2xl border-2 text-left transition-all ${
                    newType === "RECEIVED_JESUS"
                      ? "border-highland-600 bg-highland-50/50 text-highland-950"
                      : "border-neutral-200 hover:border-neutral-300 text-neutral-600"
                  }`}
                >
                  <Heart className="h-4 w-4 text-highland-700 mb-1" />
                  <span className="font-bold text-xs block">Received Jesus</span>
                  <span className="text-[10px] text-neutral-500 block">Born Again Believer</span>
                </button>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <Input
                  required
                  placeholder="e.g. Chemutai Sarah"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="h-10 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">Phone Number</label>
                  <Input
                    placeholder="e.g. 0770 123456"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="h-10 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">Village / Town</label>
                  <Input
                    placeholder="e.g. Kapteret, Kapchorwa"
                    value={newVillage}
                    onChange={(e) => setNewVillage(e.target.value)}
                    className="h-10 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">Email Address</label>
                <Input
                  type="email"
                  placeholder="e.g. convert@gmail.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="h-10 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">Counselor / Follow-up Notes</label>
                <textarea
                  placeholder="Notes about outreach location, assigned discipleship leader, or prayer points..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  rows={2}
                  className="w-full rounded-lg border border-neutral-300 p-2.5 text-xs focus:ring-2 focus:ring-highland-600 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100">
                <Button type="button" variant="outline" size="sm" onClick={() => setAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="clay" size="sm" isLoading={isSaving}>
                  Save Record
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. CONVERT DETAILS & EDIT MODAL */}
      {detailsModalOpen && selectedConvert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl border border-neutral-200 space-y-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-900 font-bold">
                  {selectedConvert.fullName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-neutral-900">{selectedConvert.fullName}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge variant={selectedConvert.notes?.includes("Souls Won") ? "clay" : "success"} className="text-[10px]">
                      {selectedConvert.notes?.includes("Souls Won") ? "Souls Won (Outreach)" : "Received Jesus"}
                    </Badge>
                    <span className="text-[11px] text-neutral-400">
                      Recorded: {formatDate(selectedConvert.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
              <button onClick={() => setDetailsModalOpen(false)} className="text-neutral-400 hover:text-neutral-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            {!isEditMode ? (
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4 bg-neutral-50 rounded-2xl p-4 border border-neutral-200/70 text-xs">
                  <div>
                    <span className="text-neutral-400 block font-semibold">Phone Number</span>
                    <span className="font-bold text-neutral-800">{selectedConvert.phone || "Not provided"}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block font-semibold">Email Address</span>
                    <span className="font-bold text-neutral-800">{selectedConvert.email || "Not provided"}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block font-semibold">Village / Location</span>
                    <span className="font-bold text-neutral-800">{selectedConvert.village || "Not provided"}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block font-semibold">Current Category</span>
                    <span className="font-bold text-neutral-800">{selectedConvert.category}</span>
                  </div>
                </div>

                <div>
                  <span className="text-xs font-bold text-neutral-700 block mb-1">Administrative Notes</span>
                  <div className="bg-neutral-50 rounded-xl p-3 text-xs text-neutral-700 border border-neutral-200/70 whitespace-pre-wrap leading-relaxed">
                    {selectedConvert.notes || "No notes recorded."}
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handlePromoteToMember}
                    className="gap-1.5 text-xs border-highland-600 text-highland-800 hover:bg-highland-50 font-bold"
                  >
                    <UserCheck className="h-4 w-4" />
                    <span>Transition to Church Member</span>
                  </Button>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsEditMode(true)}
                      className="gap-1.5 text-xs"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                      <span>Edit Details</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        setItemToDelete(selectedConvert);
                        setDeleteConfirmOpen(true);
                      }}
                      className="gap-1.5 text-xs"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Delete</span>
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleUpdateConvert} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">Full Name</label>
                  <Input
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="h-10 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-neutral-700 block mb-1">Phone Number</label>
                    <Input
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="h-10 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-neutral-700 block mb-1">Village</label>
                    <Input
                      value={editVillage}
                      onChange={(e) => setEditVillage(e.target.value)}
                      className="h-10 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">Email</label>
                  <Input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="h-10 text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">Notes</label>
                  <textarea
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    rows={3}
                    className="w-full rounded-lg border border-neutral-300 p-2.5 text-xs focus:ring-2 focus:ring-highland-600 outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100">
                  <Button type="button" variant="outline" size="sm" onClick={() => setIsEditMode(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="default" size="sm" isLoading={isSaving}>
                    Save Changes
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 7. DELETE CONFIRMATION MODAL */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete Salvation Record?"
        description={`Are you sure you want to permanently delete the record for "${itemToDelete?.fullName}"? This action cannot be undone.`}
        confirmText="Delete Record"
        variant="destructive"
        isLoading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
