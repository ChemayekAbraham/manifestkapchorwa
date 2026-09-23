"use client";

import React, { useState, useEffect } from "react";
import {
  FileBarChart2,
  Download,
  Filter,
  Calendar,
  Layers,
  FileSpreadsheet,
  FileText,
  RefreshCw,
  CheckCircle2,
  Table as TableIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";
import { WHITELISTED_REPORT_FIELDS } from "@/validators/report";

export default function ReportsManagementPage() {
  const [reportType, setReportType] = useState<string>("membership-summary");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [gender, setGender] = useState("");
  const [village, setVillage] = useState("");

  // Custom Builder Fields
  const [selectedFields, setSelectedFields] = useState<string[]>([
    "fullName",
    "phone",
    "email",
    "gender",
    "village",
    "category",
    "status",
    "dateJoined",
  ]);

  const [reportResult, setReportResult] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState<"csv" | "xlsx" | "pdf" | null>(null);

  const runCurrentReport = async () => {
    setIsLoading(true);
    try {
      const payload: any = {
        type: reportType,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
        category: category || undefined,
        status: status || undefined,
        gender: gender || undefined,
        village: village || undefined,
      };

      if (reportType === "custom") {
        payload.fields = selectedFields;
      }

      const res = await fetch("/api/admin/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setReportResult(json.data);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to run report");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runCurrentReport();
  }, [reportType]);

  const handleExport = async (format: "csv" | "xlsx" | "pdf") => {
    setIsExporting(format);
    try {
      const payload: any = {
        type: reportType,
        format,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
        category: category || undefined,
        status: status || undefined,
        gender: gender || undefined,
        village: village || undefined,
      };

      if (reportType === "custom") {
        payload.fields = selectedFields;
      }

      const res = await fetch("/api/admin/reports/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        alert("Failed to export report");
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const extension = format === "xlsx" ? "xlsx" : format === "pdf" ? "pdf" : "csv";
      a.download = `manifest-kapchorwa-${reportType}-${new Date().toISOString().split("T")[0]}.${extension}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch {
      alert("Error generating export file");
    } finally {
      setIsExporting(null);
    }
  };

  const toggleField = (f: string) => {
    if (selectedFields.includes(f)) {
      if (selectedFields.length > 1) {
        setSelectedFields(selectedFields.filter((item) => item !== f));
      }
    } else {
      setSelectedFields([...selectedFields, f]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200/80 pb-5">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-neutral-900">
            Church Reports & Export Engine
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Generate analytics, attendance trends, growth summaries, and custom export datasets.
          </p>
        </div>

        {/* Export Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={!reportResult || isLoading || isExporting !== null}
            isLoading={isExporting === "csv"}
            onClick={() => handleExport("csv")}
            className="gap-1.5 text-xs"
          >
            <Download className="h-3.5 w-3.5" />
            <span>CSV</span>
          </Button>

          <Button
            size="sm"
            variant="default"
            disabled={!reportResult || isLoading || isExporting !== null}
            isLoading={isExporting === "xlsx"}
            onClick={() => handleExport("xlsx")}
            className="gap-1.5 text-xs bg-green-700 hover:bg-green-800 text-white"
          >
            <FileSpreadsheet className="h-3.5 w-3.5" />
            <span>Excel (.xlsx)</span>
          </Button>

          <Button
            size="sm"
            variant="clay"
            disabled={!reportResult || isLoading || isExporting !== null}
            isLoading={isExporting === "pdf"}
            onClick={() => handleExport("pdf")}
            className="gap-1.5 text-xs"
          >
            <FileText className="h-3.5 w-3.5" />
            <span>PDF</span>
          </Button>
        </div>
      </div>

      {/* Report Type Selector Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-neutral-200">
        {[
          { id: "membership-summary", label: "Membership Summary" },
          { id: "growth", label: "Church Growth" },
          { id: "new-converts", label: "New Converts" },
          { id: "attendance", label: "Event Attendance" },
          { id: "location", label: "Location & Demographics" },
          { id: "inactive", label: "Inactive / Transferred" },
          { id: "custom", label: "Custom Builder" },
        ].map((t) => (
          <Button
            key={t.id}
            size="sm"
            variant={reportType === t.id ? "default" : "outline"}
            className={`text-xs whitespace-nowrap rounded-xl ${
              reportType === t.id ? "bg-highland-800 text-white shadow-sm" : "text-neutral-700 bg-white"
            }`}
            onClick={() => setReportType(t.id)}
          >
            {t.label}
          </Button>
        ))}
      </div>

      {/* Filter Options Panel */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            label="Date From"
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
          <Input
            label="Date To"
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
          <Select
            label="Filter Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={[
              { value: "", label: "All Categories" },
              { value: "MEMBER", label: "Member" },
              { value: "VISITOR", label: "Visitor" },
              { value: "NEW_CONVERT", label: "New Convert" },
              { value: "WORKER", label: "Worker" },
              { value: "YOUTH", label: "Youth" },
            ]}
          />
          <Select
            label="Filter Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={[
              { value: "", label: "All Statuses" },
              { value: "ACTIVE", label: "Active" },
              { value: "INACTIVE", label: "Inactive" },
              { value: "TRANSFERRED", label: "Transferred" },
            ]}
          />
        </div>

        {/* Custom Field Selector (When in Custom Builder Mode) */}
        {reportType === "custom" && (
          <div className="pt-3 border-t border-neutral-100 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-700 block">
              Select Columns to Include (Whitelisted Fields)
            </span>
            <div className="flex flex-wrap gap-2">
              {WHITELISTED_REPORT_FIELDS.map((f) => {
                const selected = selectedFields.includes(f);
                return (
                  <button
                    key={f}
                    type="button"
                    onClick={() => toggleField(f)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                      selected
                        ? "bg-highland-800 text-white border-highland-800"
                        : "bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100"
                    }`}
                  >
                    {f}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="text-xs text-neutral-500"
            onClick={() => {
              setDateFrom("");
              setDateTo("");
              setCategory("");
              setStatus("");
              setGender("");
              setVillage("");
            }}
          >
            Clear Filters
          </Button>

          <Button
            type="button"
            size="sm"
            variant="clay"
            isLoading={isLoading}
            onClick={runCurrentReport}
            className="text-xs font-semibold"
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
            Generate Report Preview
          </Button>
        </div>
      </div>

      {/* Report Preview Display */}
      {isLoading ? (
        <div className="p-12 text-center text-xs text-neutral-500">Calculating report metrics...</div>
      ) : !reportResult ? (
        <EmptyState
          icon={<FileBarChart2 className="h-8 w-8 text-neutral-400" />}
          title="No Report Generated"
          description="Click 'Generate Report Preview' to compute table."
        />
      ) : (
        <div className="space-y-4">
          {/* Summary Strip */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 pb-3">
              <div>
                <h3 className="font-heading text-lg font-bold text-neutral-900">{reportResult.title}</h3>
                <p className="text-xs text-neutral-500">
                  Total Records: {reportResult.totalRecords} • Generated on {new Date(reportResult.generatedAt).toLocaleString()}
                </p>
              </div>
              <Badge variant="outline" className="text-xs">
                Preview Mode
              </Badge>
            </div>

            {reportResult.summary && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {Object.entries(reportResult.summary).map(([key, val]) => (
                  <div key={key} className="rounded-xl bg-neutral-50 p-3 border border-neutral-200 text-center">
                    <span className="text-[10px] uppercase font-bold text-neutral-500 block truncate">{key}</span>
                    <span className="text-base font-bold text-neutral-900">{String(val)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Preview Table */}
          <div className="max-h-[500px] overflow-y-auto border border-neutral-200 rounded-2xl bg-white shadow-xs">
            <Table>
              <TableHeader>
                <TableRow>
                  {reportResult.headers.map((h: string) => (
                    <TableHead key={h}>{h}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportResult.rows.map((row: any, idx: number) => (
                  <TableRow key={idx}>
                    {reportResult.headers.map((h: string) => (
                      <TableCell key={h} className="text-xs">
                        {row[h] !== null && row[h] !== undefined ? String(row[h]) : "-"}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
