"use client";

import React, { useState, useEffect } from "react";
import { History, Search, Shield, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDateTime } from "@/lib/utils";

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(30);
  const [actionSearch, setActionSearch] = useState("");
  const [entitySearch, setEntitySearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchLogs = async (targetPage = page) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", targetPage.toString());
      params.set("pageSize", pageSize.toString());
      if (actionSearch.trim()) params.set("action", actionSearch.trim());
      if (entitySearch.trim()) params.set("entity", entitySearch.trim());

      const res = await fetch(`/api/admin/audit-logs?${params.toString()}`);
      const json = await res.json();
      if (json.success && json.data) {
        setLogs(json.data.items);
        setTotal(json.data.total);
        setPage(json.data.page);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(1);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200/80 pb-5">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-neutral-900">
            System Audit Trail
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Immutable log of administrative operations, report exports, record creations, and updates.
          </p>
        </div>

        <Button size="sm" variant="outline" onClick={() => fetchLogs(1)} className="gap-1.5 text-xs">
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Refresh Logs</span>
        </Button>
      </div>

      {/* Filter inputs */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-xs flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Filter by action (e.g. REPORT_EXPORTED, PERSON_CREATED)..."
          value={actionSearch}
          onChange={(e) => setActionSearch(e.target.value)}
          className="h-9 flex-1 rounded-lg border border-neutral-300 px-3 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-highland-700"
        />
        <input
          type="text"
          placeholder="Filter by entity (e.g. Person, Event, User)..."
          value={entitySearch}
          onChange={(e) => setEntitySearch(e.target.value)}
          className="h-9 flex-1 rounded-lg border border-neutral-300 px-3 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-highland-700"
        />
        <Button size="sm" variant="default" onClick={() => fetchLogs(1)} className="text-xs">
          Search Logs
        </Button>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-xs text-neutral-500">Loading audit history...</div>
      ) : logs.length === 0 ? (
        <EmptyState
          icon={<History className="h-8 w-8 text-neutral-400" />}
          title="No Audit Logs Found"
          description="Actions performed by administrators will appear here in chronological order."
        />
      ) : (
        <div className="border border-neutral-200 rounded-2xl bg-white shadow-xs overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Admin User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Target Entity</TableHead>
                <TableHead>Metadata / Details</TableHead>
                <TableHead>IP Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-mono text-xs text-neutral-600 whitespace-nowrap">
                    {formatDateTime(log.createdAt)}
                  </TableCell>
                  <TableCell className="text-xs font-semibold text-neutral-900">
                    {log.userEmail || "System / Public"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono text-[10px] bg-neutral-50">
                      {log.action}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs font-medium">
                    {log.entity} {log.entityId && <span className="text-neutral-400 font-mono text-[10px]">({log.entityId.slice(0, 8)}...)</span>}
                  </TableCell>
                  <TableCell className="text-xs text-neutral-600 max-w-xs truncate font-mono text-[11px]">
                    {log.metadata || "-"}
                  </TableCell>
                  <TableCell className="text-xs font-mono text-neutral-400">{log.ipAddress || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
