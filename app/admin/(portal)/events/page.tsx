"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Users,
  MapPin,
  Clock,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { EventModal } from "@/components/admin/event-modal";
import { Dialog } from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDate, formatDateTime } from "@/lib/utils";

export default function EventsManagementPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

  // Attendance Sheet Modal
  const [attendanceModalOpen, setAttendanceModalOpen] = useState(false);
  const [currentEventDetail, setCurrentEventDetail] = useState<any | null>(null);
  const [allPeopleList, setAllPeopleList] = useState<any[]>([]);
  const [attendanceFilterSearch, setAttendanceFilterSearch] = useState("");
  const [isSavingAttendance, setIsSavingAttendance] = useState(false);

  // Delete
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/events?pageSize=50");
      const json = await res.json();
      if (json.success && json.data) {
        setEvents(json.data.items);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const openAttendanceSheet = async (event: any) => {
    try {
      const [eventRes, peopleRes] = await Promise.all([
        fetch(`/api/admin/events/${event.id}`),
        fetch("/api/admin/people?pageSize=100&status=ACTIVE"),
      ]);
      const [eventJson, peopleJson] = await Promise.all([eventRes.json(), peopleRes.json()]);

      if (eventJson.success && eventJson.data) {
        setCurrentEventDetail(eventJson.data);
      }
      if (peopleJson.success && peopleJson.data) {
        setAllPeopleList(peopleJson.data.items);
      }
      setAttendanceFilterSearch("");
      setAttendanceModalOpen(true);
    } catch {
      alert("Error loading event attendance data");
    }
  };

  const handleToggleAttendance = async (personId: string, currentStatus?: string) => {
    if (!currentEventDetail) return;
    setIsSavingAttendance(true);

    const newStatus = currentStatus === "PRESENT" ? "ABSENT" : "PRESENT";

    // Optimistically update local attendance list
    const updatedAttendance = [...(currentEventDetail.attendance || [])];
    const existingIndex = updatedAttendance.findIndex((a) => a.personId === personId);
    if (existingIndex >= 0) {
      updatedAttendance[existingIndex] = { ...updatedAttendance[existingIndex], status: newStatus };
    } else {
      const personObj = allPeopleList.find((p) => p.id === personId);
      updatedAttendance.push({
        id: `temp-${Date.now()}`,
        personId,
        status: newStatus,
        markedAt: new Date().toISOString(),
        person: personObj || { id: personId, fullName: "Member" },
      });
    }

    const presentCount = updatedAttendance.filter((a) => a.status === "PRESENT").length;
    const totalMarked = updatedAttendance.length;

    setCurrentEventDetail({
      ...currentEventDetail,
      attendance: updatedAttendance,
      stats: {
        totalMarked,
        presentCount,
        absentCount: totalMarked - presentCount,
        attendanceRate: totalMarked > 0 ? Math.round((presentCount / totalMarked) * 100) : 0,
      },
    });

    try {
      await fetch(`/api/admin/events/${currentEventDetail.id}/attendance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          personId,
          status: newStatus,
        }),
      });
    } catch {
      alert("Failed to update attendance on server");
    } finally {
      setIsSavingAttendance(false);
    }
  };

  const handleDeleteEvent = async () => {
    if (!eventToDelete) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/admin/events/${eventToDelete.id}`, { method: "DELETE" });
      if (res.ok) {
        setDeleteConfirmOpen(false);
        setEventToDelete(null);
        fetchEvents();
      }
    } catch {
      alert("Failed to delete event");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200/80 pb-5">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-neutral-900">
            Events & Attendance Tracking
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Manage services, prayer summits, and mark church member attendance.
          </p>
        </div>

        <Button
          size="sm"
          variant="clay"
          onClick={() => {
            setSelectedEvent(null);
            setEventModalOpen(true);
          }}
          className="gap-1.5 shadow-sm text-xs"
        >
          <Plus className="h-4 w-4" />
          <span>Create Event</span>
        </Button>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-xs text-neutral-500">Loading events...</div>
      ) : events.length === 0 ? (
        <EmptyState
          icon={<Calendar className="h-8 w-8 text-neutral-400" />}
          title="No Events Created"
          description="Create your first church service or conference to start tracking attendance."
          action={
            <Button
              size="sm"
              variant="default"
              onClick={() => {
                setSelectedEvent(null);
                setEventModalOpen(true);
              }}
            >
              Create First Event
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-sm transition-shadow"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-clay-700">{formatDate(event.date)}</span>
                  <Badge variant={event.published ? "success" : "secondary"} className="text-[10px]">
                    {event.published ? "Public Calendar" : "Draft"}
                  </Badge>
                </div>

                <h3 className="font-heading text-lg font-bold text-neutral-900">{event.name}</h3>
                <p className="text-xs text-neutral-500 flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  <span>{event.location}</span>
                </p>

                {event.description && (
                  <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed pt-1">
                    {event.description}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                <Button
                  size="sm"
                  variant="default"
                  className="gap-1.5 text-xs h-8"
                  onClick={() => openAttendanceSheet(event)}
                >
                  <Users className="h-3.5 w-3.5" />
                  <span>Attendance Sheet</span>
                </Button>

                <div className="flex items-center gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-neutral-600"
                    onClick={() => {
                      setSelectedEvent(event);
                      setEventModalOpen(true);
                    }}
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-red-600"
                    onClick={() => {
                      setEventToDelete(event);
                      setDeleteConfirmOpen(true);
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Attendance Modal Sheet */}
      {currentEventDetail && (
        <Dialog
          open={attendanceModalOpen}
          onOpenChange={setAttendanceModalOpen}
          title={`Attendance Sheet — ${currentEventDetail.name}`}
          description={`Date: ${formatDateTime(currentEventDetail.date)} | Venue: ${currentEventDetail.location}`}
          maxWidth="max-w-3xl"
        >
          <div className="space-y-4">
            {/* Stats strip */}
            <div className="grid grid-cols-4 gap-2 text-center bg-neutral-50 p-3 rounded-xl border border-neutral-200">
              <div>
                <span className="text-[10px] uppercase text-neutral-500 font-bold">Total Marked</span>
                <p className="text-base font-bold text-neutral-900">{currentEventDetail.stats?.totalMarked || 0}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase text-green-700 font-bold">Present</span>
                <p className="text-base font-bold text-green-800">{currentEventDetail.stats?.presentCount || 0}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase text-red-700 font-bold">Absent</span>
                <p className="text-base font-bold text-red-800">{currentEventDetail.stats?.absentCount || 0}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase text-highland-800 font-bold">Rate</span>
                <p className="text-base font-bold text-highland-900">{currentEventDetail.stats?.attendanceRate || 0}%</p>
              </div>
            </div>

            {/* Member search inside attendance sheet */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search member name or phone to mark attendance..."
                value={attendanceFilterSearch}
                onChange={(e) => setAttendanceFilterSearch(e.target.value)}
                className="h-9 w-full rounded-lg border border-neutral-300 pl-9 pr-3 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-highland-700"
              />
            </div>

            {/* People attendance list */}
            <div className="max-h-80 overflow-y-auto border border-neutral-200 rounded-xl">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Village</TableHead>
                    <TableHead className="text-right">Attendance Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allPeopleList
                    .filter(
                      (p) =>
                        !attendanceFilterSearch ||
                        p.fullName.toLowerCase().includes(attendanceFilterSearch.toLowerCase()) ||
                        (p.phone && p.phone.includes(attendanceFilterSearch))
                    )
                    .map((person) => {
                      const marked = currentEventDetail.attendance?.find(
                        (a: any) => a.personId === person.id
                      );
                      const isPresent = marked?.status === "PRESENT";
                      const isAbsent = marked?.status === "ABSENT";

                      return (
                        <TableRow key={person.id}>
                          <TableCell className="font-semibold text-xs text-neutral-900">
                            {person.fullName}
                          </TableCell>
                          <TableCell className="text-xs">{person.category}</TableCell>
                          <TableCell className="text-xs text-neutral-500">{person.village || "-"}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant={isPresent ? "default" : "outline"}
                              className={`h-7 px-3 text-xs gap-1.5 ${
                                isPresent ? "bg-green-700 hover:bg-green-800 text-white" : ""
                              }`}
                              disabled={isSavingAttendance}
                              onClick={() => handleToggleAttendance(person.id, marked?.status)}
                            >
                              {isPresent ? (
                                <>
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                  <span>Present</span>
                                </>
                              ) : (
                                <span>Mark Present</span>
                              )}
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-end pt-2 border-t border-neutral-100">
              <Button variant="default" onClick={() => setAttendanceModalOpen(false)}>
                Done
              </Button>
            </div>
          </div>
        </Dialog>
      )}

      {/* Modals */}
      <EventModal
        open={eventModalOpen}
        onOpenChange={setEventModalOpen}
        event={selectedEvent}
        onSuccess={fetchEvents}
      />

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete Church Event?"
        description={`Are you sure you want to delete "${eventToDelete?.name}"? All marked attendance records for this event will also be removed.`}
        confirmText="Delete Event"
        variant="destructive"
        isLoading={isDeleting}
        onConfirm={handleDeleteEvent}
      />
    </div>
  );
}
