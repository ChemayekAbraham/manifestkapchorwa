"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  UserCheck,
  UserPlus,
  Sparkles,
  Calendar,
  Send,
  MessageSquare,
  FileBarChart2,
  AlertTriangle,
  ArrowRight,
  Shield,
  Plus,
} from "lucide-react";
import { MetricCard } from "@/components/admin/metric-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { MemberModal } from "@/components/admin/member-modal";
import { EventModal } from "@/components/admin/event-modal";
import { DevotionModal } from "@/components/admin/devotion-modal";
import { formatDate } from "@/lib/utils";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [recentPeople, setRecentPeople] = useState<any[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [pendingCounts, setPendingCounts] = useState<{ prayers: number; testimonies: number }>({
    prayers: 0,
    testimonies: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isDevotionModalOpen, setIsDevotionModalOpen] = useState(false);

  const fetchDashboardData = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/dashboard");
      const json = await res.json();

      if (json.success && json.data) {
        setStats(json.data.stats);
        setPendingCounts(json.data.pendingCounts);
        setRecentPeople(json.data.recentPeople || []);
        setUpcomingEvents(json.data.upcomingEvents || []);
      }
    } catch (e) {
      console.error("Failed to load dashboard data", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return (
    <div className="space-y-8">
      {/* Top Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200/80 pb-5">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-neutral-900">
            Ministry Dashboard
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Overview of congregation growth, upcoming events, and ministry moderation.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" variant="clay" onClick={() => setIsMemberModalOpen(true)} className="gap-1.5 shadow-sm text-xs">
            <UserPlus className="h-4 w-4" />
            <span>Add Member</span>
          </Button>
          <Button size="sm" variant="default" onClick={() => setIsEventModalOpen(true)} className="gap-1.5 shadow-sm text-xs">
            <Calendar className="h-4 w-4" />
            <span>Create Event</span>
          </Button>
          <Button size="sm" variant="outline" onClick={() => setIsDevotionModalOpen(true)} className="gap-1.5 text-xs">
            <Plus className="h-4 w-4" />
            <span>Write Devotional</span>
          </Button>
          <Link href="/admin/reports">
            <Button size="sm" variant="secondary" className="gap-1.5 text-xs">
              <FileBarChart2 className="h-4 w-4" />
              <span>Run Report</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Moderation Alert Banner if items pending */}
      {pendingCounts.testimonies > 0 && (
        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
            <span>
              <strong>Action Required:</strong> You have {pendingCounts.testimonies} pending testimony/testimonies awaiting review.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/admin/testimonies">
              <Button size="sm" variant="clay" className="h-7 text-xs">
                Review Testimonies
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <MetricCard
          title="Total People"
          value={stats?.["Total People"] ?? (isLoading ? "-" : 0)}
          subtitle="All registered records"
          icon={<Users className="h-5 w-5" />}
          variant="default"
        />
        <MetricCard
          title="Active Members"
          value={stats?.["Active Members"] ?? (isLoading ? "-" : 0)}
          subtitle="Currently active in ministry"
          icon={<UserCheck className="h-5 w-5" />}
          variant="success"
        />
        <MetricCard
          title="New Converts"
          value={stats?.["New Converts"] ?? (isLoading ? "-" : 0)}
          subtitle="Follow-up discipleship"
          icon={<Sparkles className="h-5 w-5" />}
          variant="clay"
        />
        <MetricCard
          title="Church Workers"
          value={stats?.["Workers"] ?? (isLoading ? "-" : 0)}
          subtitle="Ministry teams & volunteers"
          icon={<Shield className="h-5 w-5" />}
          variant="ochre"
        />
      </div>

      {/* Main Content: Recent Registrations & Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Recent Registrations */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-bold text-neutral-900">
              Recent Member Registrations
            </h2>
            <Link href="/admin/people" className="text-xs font-semibold text-highland-800 hover:underline flex items-center gap-1">
              <span>View All People</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {recentPeople.length === 0 ? (
            <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center text-neutral-500 text-xs">
              No recent member registrations recorded.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Village</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentPeople.map((person) => (
                  <TableRow key={person.id}>
                    <TableCell className="font-semibold text-xs text-neutral-900">
                      {person.fullName}
                    </TableCell>
                    <TableCell className="text-xs">{person.phone || "-"}</TableCell>
                    <TableCell className="text-xs">{person.village || "-"}</TableCell>
                    <TableCell>
                      <Badge variant={person.category === "NEW_CONVERT" ? "clay" : "outline"} className="text-[10px]">
                        {person.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-neutral-500">{formatDate(person.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Right Column: Upcoming Events */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-bold text-neutral-900">
              Upcoming Events
            </h2>
            <Link href="/admin/events" className="text-xs font-semibold text-highland-800 hover:underline">
              Manage →
            </Link>
          </div>

          {upcomingEvents.length === 0 ? (
            <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center text-neutral-500 text-xs">
              No upcoming events scheduled.
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingEvents.map((ev) => (
                <div key={ev.id} className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-clay-700">{formatDate(ev.date)}</span>
                    <Badge variant={ev.published ? "success" : "secondary"} className="text-[10px]">
                      {ev.published ? "Published" : "Draft"}
                    </Badge>
                  </div>
                  <h3 className="font-heading text-sm font-bold text-neutral-900">{ev.name}</h3>
                  <p className="text-xs text-neutral-500 line-clamp-1">{ev.location}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <MemberModal
        open={isMemberModalOpen}
        onOpenChange={setIsMemberModalOpen}
        onSuccess={fetchDashboardData}
      />
      <EventModal
        open={isEventModalOpen}
        onOpenChange={setIsEventModalOpen}
        onSuccess={fetchDashboardData}
      />
      <DevotionModal
        open={isDevotionModalOpen}
        onOpenChange={setIsDevotionModalOpen}
        onSuccess={fetchDashboardData}
      />
    </div>
  );
}
