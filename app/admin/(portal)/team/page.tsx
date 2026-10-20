"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  UserCheck,
  Plus,
  Search,
  Phone,
  MessageCircle,
  MapPin,
  Edit2,
  Trash2,
  ArrowUpDown,
  Eye,
  EyeOff,
  Users,
  ShieldAlert,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MetricCard } from "@/components/admin/metric-card";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { TeamMemberModal, TeamMemberData } from "@/components/admin/team-member-modal";

export default function AdminTeamPage() {
  const [members, setMembers] = useState<TeamMemberData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "HIDDEN">("ALL");

  // Modals state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMemberData | null>(null);

  // Delete state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<TeamMemberData | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Status banner
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchMembers = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/team");
      const data = await res.json();
      if (res.ok && data.success) {
        setMembers(data.data || []);
      }
    } catch (error) {
      console.error("Failed to load team members:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const handleEdit = (member: TeamMemberData) => {
    setSelectedMember(member);
    setModalOpen(true);
  };

  const handleAddNew = () => {
    setSelectedMember(null);
    setModalOpen(true);
  };

  const handleDeletePrompt = (member: TeamMemberData) => {
    setMemberToDelete(member);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!memberToDelete?.id) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/team/${memberToDelete.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`${memberToDelete.name} was removed from the team.`);
        fetchMembers();
      } else {
        alert(data.message || "Failed to remove member");
      }
    } catch (err: any) {
      alert(err.message || "Error deleting member");
    } finally {
      setIsDeleting(false);
      setDeleteConfirmOpen(false);
      setMemberToDelete(null);
    }
  };

  const handleToggleActive = async (member: TeamMemberData) => {
    if (!member.id) return;
    try {
      const newActive = !member.active;
      const res = await fetch(`/api/admin/team/${member.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: newActive }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`${member.name} is now ${newActive ? "visible on" : "hidden from"} website.`);
        fetchMembers();
      }
    } catch (err) {
      console.error("Error toggling active state:", err);
    }
  };

  // Filtered list
  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.role.toLowerCase().includes(search.toLowerCase()) ||
      m.phone.includes(search);

    if (!matchesSearch) return false;
    if (statusFilter === "ACTIVE") return m.active !== false;
    if (statusFilter === "HIDDEN") return m.active === false;
    return true;
  });

  const totalCount = members.length;
  const activeCount = members.filter((m) => m.active !== false).length;
  const uniqueRoles = Array.from(new Set(members.map((m) => m.role))).length;

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="flex items-center gap-2 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold shadow-xs animate-in fade-in duration-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Title & Main Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-neutral-900">
              Kapchorwa Manifest Team
            </h1>
            <Badge variant="ochre">{totalCount} Leaders</Badge>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Add, edit, rename, and remove leaders and departmental directors serving Manifest Kapchorwa.
          </p>
        </div>

        <Button
          onClick={handleAddNew}
          variant="default"
          className="bg-highland-700 hover:bg-highland-800 shrink-0"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Add Team Member
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          title="Total Team Members"
          value={totalCount}
          subtitle="Ministry leadership and departmental heads"
          icon={<Users className="h-5 w-5" />}
        />
        <MetricCard
          title="Active on Public Site"
          value={activeCount}
          subtitle="Visible on About page leadership gallery"
          icon={<UserCheck className="h-5 w-5" />}
        />
        <MetricCard
          title="Ministry Departments"
          value={uniqueRoles}
          subtitle="Unique ministry leadership responsibilities"
          icon={<ArrowUpDown className="h-5 w-5" />}
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-neutral-200 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by leader name, role, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-highland-600/30 focus:border-highland-600"
          />
        </div>

        <div className="flex items-center gap-2">
          {(["ALL", "ACTIVE", "HIDDEN"] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                statusFilter === filter
                  ? "bg-highland-800 text-white shadow-xs"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              {filter === "ALL" && "All Records"}
              {filter === "ACTIVE" && `Active (${activeCount})`}
              {filter === "HIDDEN" && `Hidden (${totalCount - activeCount})`}
            </button>
          ))}
        </div>
      </div>

      {/* Team Members Grid / Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-80 rounded-2xl bg-neutral-100 border border-neutral-200 animate-pulse"
            />
          ))}
        </div>
      ) : filteredMembers.length === 0 ? (
        <EmptyState
          icon={<Users className="h-6 w-6 text-neutral-400" />}
          title="No Team Members Found"
          description={
            search
              ? "No leaders matched your search keyword. Try clearing filters."
              : "No team members configured yet. Click '+ Add Team Member' to create the first one."
          }
          action={
            search ? (
              <Button variant="outline" onClick={() => setSearch("")}>
                Clear Search
              </Button>
            ) : (
              <Button variant="default" onClick={handleAddNew}>
                <Plus className="h-4 w-4 mr-1.5" />
                Add First Member
              </Button>
            )
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => {
            const cleanPhone = member.phone.replace(/[^0-9]/g, "");
            const waNumber = cleanPhone.startsWith("0")
              ? `256${cleanPhone.slice(1)}`
              : cleanPhone;

            return (
              <div
                key={member.id}
                className={`group rounded-2xl bg-white border ${
                  member.active !== false
                    ? "border-neutral-200"
                    : "border-dashed border-neutral-300 opacity-75"
                } overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between`}
              >
                <div>
                  {/* Photo & Badge Header */}
                  <div className="relative h-64 sm:h-72 w-full bg-neutral-900 overflow-hidden">
                    {member.imageUrl ? (
                      <Image
                        src={member.imageUrl}
                        alt={member.name}
                        fill
                        unoptimized
                        priority
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-neutral-400 bg-neutral-800">
                        <Users className="h-16 w-16 text-neutral-500" />
                        <span className="text-xs mt-2 text-neutral-400">No portrait photo</span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/20 to-transparent pointer-events-none" />

                    {/* Order badge top-left */}
                    <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
                      <span className="h-6 px-2 rounded-md bg-neutral-900/90 backdrop-blur-xs text-white text-[11px] font-bold flex items-center justify-center border border-white/10 shadow-xs">
                        #{member.order ?? 0}
                      </span>
                      <Badge
                        variant={member.active !== false ? "success" : "secondary"}
                        className="shadow-xs"
                      >
                        {member.active !== false ? "Active" : "Hidden"}
                      </Badge>
                    </div>

                    {/* Role badge top-right */}
                    <div className="absolute top-3 right-3 z-10">
                      <Badge variant="ochre" className="bg-amber-500 text-neutral-950 font-bold shadow-xs">
                        {member.role}
                      </Badge>
                    </div>

                    {/* Leader Name overlay on photo */}
                    <div className="absolute bottom-3 left-3 right-3 z-10 text-white">
                      <h3 className="font-heading text-xl font-bold drop-shadow-md">
                        {member.name}
                      </h3>
                      {member.location && (
                        <p className="text-[11px] text-neutral-200 flex items-center gap-1 mt-0.5 drop-shadow-sm">
                          <MapPin className="h-3 w-3 text-amber-400 shrink-0" />
                          <span className="truncate">{member.location}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-3">
                    {member.bio ? (
                      <p className="text-xs text-neutral-600 line-clamp-3 leading-relaxed">
                        {member.bio}
                      </p>
                    ) : (
                      <p className="text-xs text-neutral-400 italic">
                        No bio provided yet.
                      </p>
                    )}

                    {/* Phone & WhatsApp links */}
                    <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs">
                      <a
                        href={`tel:${member.phone}`}
                        className="flex items-center gap-1.5 font-semibold text-neutral-800 hover:text-highland-700 transition"
                      >
                        <Phone className="h-3.5 w-3.5 text-highland-600" />
                        <span>{member.phone}</span>
                      </a>

                      <a
                        href={`https://wa.me/${waNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-[11px] transition"
                      >
                        <MessageCircle className="h-3 w-3" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="p-3 bg-neutral-50/80 border-t border-neutral-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleToggleActive(member)}
                    title={member.active !== false ? "Hide from website" : "Show on website"}
                    className="p-1.5 rounded-lg text-neutral-500 hover:bg-neutral-200 text-xs flex items-center gap-1"
                  >
                    {member.active !== false ? (
                      <>
                        <EyeOff className="h-3.5 w-3.5" />
                        <span className="text-[11px]">Hide</span>
                      </>
                    ) : (
                      <>
                        <Eye className="h-3.5 w-3.5" />
                        <span className="text-[11px]">Show</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-1.5">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(member)}
                      className="h-8 px-2.5 text-xs font-semibold"
                    >
                      <Edit2 className="h-3.5 w-3.5 mr-1 text-highland-700" />
                      Rename / Edit
                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeletePrompt(member)}
                      className="h-8 px-2 text-xs"
                      title="Remove member"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit / Add Modal */}
      <TeamMemberModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        member={selectedMember}
        onSuccess={() => {
          showToast(
            selectedMember
              ? `Changes to ${selectedMember.name} saved successfully.`
              : "New team member added successfully."
          );
          fetchMembers();
        }}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Remove Team Member?"
        description={`Are you sure you want to remove "${memberToDelete?.name}" (${memberToDelete?.role}) from the Manifest Kapchorwa team? This will remove them from the website leadership section.`}
        confirmText="Remove Member"
        variant="destructive"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
