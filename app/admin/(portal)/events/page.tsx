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
  Download,
  UserCheck,
  UserPlus,
  Mail,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { EventModal } from "@/components/admin/event-modal";
import { Dialog } from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDate, formatDateTime } from "@/lib/utils";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export default function EventsManagementPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

  // Attendance Sheet Modal
  const [attendanceModalOpen, setAttendanceModalOpen] = useState(false);
  const [attendanceTab, setAttendanceTab] = useState<"attendees" | "mark_members">("attendees");
  const [currentEventDetail, setCurrentEventDetail] = useState<any | null>(null);
  const [allPeopleList, setAllPeopleList] = useState<any[]>([]);
  const [attendanceFilterSearch, setAttendanceFilterSearch] = useState("");
  const [isSavingAttendance, setIsSavingAttendance] = useState(false);

  // Delete
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleExportPDF = (eventDetail: any) => {
    if (!eventDetail) return;
    const attendees = (eventDetail.attendance || []).filter((a: any) => a.status === "PRESENT");
    if (attendees.length === 0) {
      alert("No confirmed attendees to export for this service.");
      return;
    }

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });

    // Deep Highland Green Header Bar
    doc.setFillColor(39, 66, 37);
    doc.rect(0, 0, doc.internal.pageSize.width, 55, "F");

    // Brand Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("MANIFEST KAPCHORWA", 40, 26);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("Official Service Attendance Register — Kapchorwa, Uganda", 40, 42);

    // Event & Service Details
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text(eventDetail.name || "Church Service Gathering", 40, 80);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(90, 90, 90);
    doc.text(`Venue: ${eventDetail.location || "Main Sanctuary, Manifest Kapchorwa"}`, 40, 95);
    doc.text(
      `Service Date: ${new Date(eventDetail.date).toLocaleDateString("en-UG", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })}`,
      40,
      108
    );
    doc.text(`Total Confirmed Present: ${attendees.length} Attendee(s)`, 40, 121);
    doc.text(
      `Generated: ${new Date().toLocaleString("en-UG", { timeZone: "Africa/Kampala" })}`,
      doc.internal.pageSize.width - 40,
      121,
      { align: "right" }
    );

    // AutoTable for Attendees
    const headers = [
      "#",
      "Attendee Name",
      "Email Address",
      "Phone Number",
      "Category",
      "Village / Cell",
      "Check-in Time",
    ];
    const rows = attendees.map((a: any, idx: number) => [
      String(idx + 1),
      a.person?.fullName || "Member",
      a.person?.email || "-",
      a.person?.phone || "-",
      a.person?.category || "MEMBER",
      a.person?.village || "-",
      a.markedAt
        ? new Date(a.markedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : "Present",
    ]);

    autoTable(doc, {
      startY: 135,
      head: [headers],
      body: rows,
      theme: "striped",
      headStyles: {
        fillColor: [58, 95, 55],
        textColor: 255,
        fontStyle: "bold",
        fontSize: 8.5,
      },
      bodyStyles: {
        fontSize: 8,
        textColor: 30,
      },
      alternateRowStyles: {
        fillColor: [248, 245, 237],
      },
      margin: { left: 40, right: 40 },
      didDrawPage: (data) => {
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(
          `Page ${data.pageNumber} | Manifest Kapchorwa — Official Service Attendance Register`,
          doc.internal.pageSize.width / 2,
          doc.internal.pageSize.height - 20,
          { align: "center" }
        );
      },
    });

    const sanitizedName = (eventDetail.name || "Service").replace(/\s+/g, "_");
    const dateStamp = new Date().toISOString().split("T")[0];
    doc.save(`Attendance_${sanitizedName}_${dateStamp}.pdf`);
  };

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
          maxWidth="max-w-4xl"
        >
          <div className="space-y-4">
            {/* Stats strip */}
            <div className="grid grid-cols-3 gap-3 text-center bg-neutral-50 p-3 rounded-xl border border-neutral-200">
              <div>
                <span className="text-[10px] uppercase text-neutral-500 font-bold">Confirmed Attendees</span>
                <p className="text-xl font-bold text-green-800">
                  {(currentEventDetail.attendance || []).filter((a: any) => a.status === "PRESENT").length}
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase text-neutral-500 font-bold">Venue</span>
                <p className="text-xs font-semibold text-neutral-800 truncate mt-1">{currentEventDetail.location}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase text-neutral-500 font-bold">Service Date</span>
                <p className="text-xs font-semibold text-neutral-800 mt-1">{formatDate(currentEventDetail.date)}</p>
              </div>
            </div>

            {/* View Tab Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-200 pb-2">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setAttendanceTab("attendees");
                    setAttendanceFilterSearch("");
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                    attendanceTab === "attendees"
                      ? "bg-highland-800 text-white shadow-sm"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                  }`}
                >
                  <UserCheck className="h-3.5 w-3.5" />
                  <span>
                    Service Attendees (
                    {(currentEventDetail.attendance || []).filter((a: any) => a.status === "PRESENT").length})
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAttendanceTab("mark_members");
                    setAttendanceFilterSearch("");
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                    attendanceTab === "mark_members"
                      ? "bg-highland-800 text-white shadow-sm"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                  }`}
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  <span>+ Check In More Members</span>
                </button>
              </div>

              {attendanceTab === "attendees" &&
                (currentEventDetail.attendance || []).filter((a: any) => a.status === "PRESENT").length > 0 && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleExportPDF(currentEventDetail)}
                    className="text-xs gap-1.5 border-neutral-300 font-semibold text-neutral-800 hover:bg-neutral-50 shadow-xs"
                  >
                    <Download className="h-3.5 w-3.5 text-highland-700" />
                    <span>Export PDF</span>
                  </Button>
                )}
            </div>

            {/* TAB 1: CONFIRMED ATTENDEES FOR THIS SPECIFIC SERVICE */}
            {attendanceTab === "attendees" && (
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search attendees in this service by name, email, or phone..."
                    value={attendanceFilterSearch}
                    onChange={(e) => setAttendanceFilterSearch(e.target.value)}
                    className="h-9 w-full rounded-lg border border-neutral-300 pl-9 pr-3 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-highland-700"
                  />
                </div>

                {(currentEventDetail.attendance || []).filter((a: any) => a.status === "PRESENT").length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-neutral-300 p-8 text-center space-y-3 bg-neutral-50/50">
                    <UserCheck className="h-10 w-10 text-neutral-400 mx-auto" />
                    <div className="space-y-1">
                      <h4 className="font-heading text-base font-bold text-neutral-800">
                        No Attendees Recorded For This Service Yet
                      </h4>
                      <p className="text-xs text-neutral-500 max-w-md mx-auto">
                        Members who check in on the website Services page or are marked by administrators will appear here.
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="clay"
                      onClick={() => setAttendanceTab("mark_members")}
                      className="text-xs font-bold"
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      Check In Members Now
                    </Button>
                  </div>
                ) : (
                  <div className="max-h-80 overflow-y-auto border border-neutral-200 rounded-xl">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Attendee Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Check-in Time</TableHead>
                          <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(currentEventDetail.attendance || [])
                          .filter((a: any) => a.status === "PRESENT")
                          .filter((a: any) => {
                            if (!attendanceFilterSearch) return true;
                            const q = attendanceFilterSearch.toLowerCase();
                            return (
                              (a.person?.fullName && a.person.fullName.toLowerCase().includes(q)) ||
                              (a.person?.email && a.person.email.toLowerCase().includes(q)) ||
                              (a.person?.phone && a.person.phone.includes(q))
                            );
                          })
                          .map((item: any) => (
                            <TableRow key={item.id || item.personId}>
                              <TableCell className="font-bold text-xs text-neutral-900">
                                {item.person?.fullName || "Member"}
                              </TableCell>
                              <TableCell className="text-xs text-neutral-600">
                                {item.person?.email || "-"}
                              </TableCell>
                              <TableCell className="text-xs text-neutral-600">
                                {item.person?.phone || "-"}
                              </TableCell>
                              <TableCell className="text-xs">
                                <Badge variant="secondary">{item.person?.category || "MEMBER"}</Badge>
                              </TableCell>
                              <TableCell className="text-[11px] text-neutral-500">
                                {item.markedAt ? formatDateTime(item.markedAt) : "Today"}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 text-xs text-red-600 hover:bg-red-50"
                                  disabled={isSavingAttendance}
                                  onClick={() => handleToggleAttendance(item.personId, "PRESENT")}
                                >
                                  Remove
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: CHECK IN / MARK MORE MEMBERS */}
            {attendanceTab === "mark_members" && (
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search registered church members to check in..."
                    value={attendanceFilterSearch}
                    onChange={(e) => setAttendanceFilterSearch(e.target.value)}
                    className="h-9 w-full rounded-lg border border-neutral-300 pl-9 pr-3 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-highland-700"
                  />
                </div>

                <div className="max-h-80 overflow-y-auto border border-neutral-200 rounded-xl">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Member Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allPeopleList
                        .filter(
                          (p) =>
                            !attendanceFilterSearch ||
                            p.fullName.toLowerCase().includes(attendanceFilterSearch.toLowerCase()) ||
                            (p.email && p.email.toLowerCase().includes(attendanceFilterSearch.toLowerCase())) ||
                            (p.phone && p.phone.includes(attendanceFilterSearch))
                        )
                        .map((person) => {
                          const marked = currentEventDetail.attendance?.find(
                            (a: any) => a.personId === person.id
                          );
                          const isPresent = marked?.status === "PRESENT";

                          return (
                            <TableRow key={person.id}>
                              <TableCell className="font-semibold text-xs text-neutral-900">
                                {person.fullName}
                              </TableCell>
                              <TableCell className="text-xs text-neutral-600">{person.email || "-"}</TableCell>
                              <TableCell className="text-xs">{person.category}</TableCell>
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
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
              <span className="text-xs text-neutral-500">
                {(currentEventDetail.attendance || []).filter((a: any) => a.status === "PRESENT").length} attendee(s) confirmed
              </span>
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
