"use client";

import React, { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Upload, FileSpreadsheet, CheckCircle2, AlertTriangle, XCircle, ArrowRight } from "lucide-react";

interface ImportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function ImportModal({ open, onOpenChange, onSuccess }: ImportModalProps) {
  const [csvText, setCsvText] = useState("");
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [previewData, setPreviewData] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [importSummary, setImportSummary] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setCsvText(content);
      handlePreview(content);
    };
    reader.readAsText(file);
  };

  const handlePreview = async (textToPreview?: string) => {
    const text = textToPreview || csvText;
    if (!text.trim()) {
      setErrorMessage("Please paste or upload a CSV file first");
      return;
    }

    setIsPreviewing(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/admin/people/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "preview", csv: text }),
      });

      const json = await res.json();
      if (!res.ok) {
        setErrorMessage(json.message || "Failed to parse CSV file");
        return;
      }

      setPreviewData(json.data);
    } catch {
      setErrorMessage("Error reading CSV data");
    } finally {
      setIsPreviewing(false);
    }
  };

  const handleExecuteImport = async () => {
    if (!previewData || !previewData.rows) return;

    const validRows = previewData.rows.filter((r: any) => r.isValid);
    if (validRows.length === 0) {
      setErrorMessage("No valid rows to import");
      return;
    }

    setIsExecuting(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/admin/people/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "execute", rows: validRows }),
      });

      const json = await res.json();
      if (!res.ok) {
        setErrorMessage(json.message || "Import execution failed");
        return;
      }

      setImportSummary(`Imported ${json.data.importedCount} members successfully!`);
      onSuccess();
    } catch {
      setErrorMessage("Network error during import execution");
    } finally {
      setIsExecuting(false);
    }
  };

  const resetState = () => {
    setCsvText("");
    setPreviewData(null);
    setErrorMessage(null);
    setImportSummary(null);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) resetState();
        onOpenChange(v);
      }}
      title="Import Church Members from CSV"
      description="Upload or paste CSV rows containing Full Name, Phone, Email, Village, Category, etc."
      maxWidth="max-w-4xl"
    >
      <div className="space-y-5">
        {errorMessage && (
          <Alert variant="destructive" title="Import Notice">
            {errorMessage}
          </Alert>
        )}

        {importSummary && (
          <Alert variant="success" title="Import Completed">
            {importSummary}
          </Alert>
        )}

        {!previewData && !importSummary && (
          <div className="space-y-4">
            <div className="rounded-2xl border-2 border-dashed border-neutral-300 bg-neutral-50/50 p-6 text-center">
              <Upload className="mx-auto h-8 w-8 text-neutral-400 mb-2" />
              <p className="text-xs font-semibold text-neutral-700">Upload a .csv file from your computer</p>
              <input
                type="file"
                accept=".csv,text/csv"
                onChange={handleFileUpload}
                className="mt-3 text-xs text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-highland-800 file:text-white hover:file:bg-highland-900 cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-700">Or Paste CSV Content Directly</label>
              <textarea
                rows={6}
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
                placeholder={`Full Name, Phone, Email, Gender, Village, Parish, Sub-County, Category\nJohn Chemutai, 0770123456, john@example.com, MALE, Cheptuya, Kapchesombe, Kapchorwa, MEMBER\nFaith Chebet, 0750987654, faith@example.com, FEMALE, Kawowo, Tegeres, Tegeres, WORKER`}
                className="w-full rounded-md border border-neutral-300 p-3 font-mono text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-highland-700"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                type="button"
                variant="default"
                isLoading={isPreviewing}
                onClick={() => handlePreview()}
                disabled={!csvText.trim()}
              >
                <FileSpreadsheet className="h-4 w-4 mr-1.5" />
                Validate & Preview Rows
              </Button>
            </div>
          </div>
        )}

        {previewData && !importSummary && (
          <div className="space-y-4">
            {/* Summary statistics strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-neutral-50 rounded-xl p-3 border border-neutral-200 text-center">
                <span className="text-[10px] uppercase font-bold text-neutral-500">Total Rows</span>
                <p className="text-lg font-bold text-neutral-900">{previewData.totalRows}</p>
              </div>
              <div className="bg-green-50 rounded-xl p-3 border border-green-200 text-center">
                <span className="text-[10px] uppercase font-bold text-green-700">Valid to Import</span>
                <p className="text-lg font-bold text-green-800">{previewData.validRows}</p>
              </div>
              <div className="bg-amber-50 rounded-xl p-3 border border-amber-200 text-center">
                <span className="text-[10px] uppercase font-bold text-amber-700">Duplicates</span>
                <p className="text-lg font-bold text-amber-800">{previewData.duplicateRows}</p>
              </div>
              <div className="bg-red-50 rounded-xl p-3 border border-red-200 text-center">
                <span className="text-[10px] uppercase font-bold text-red-700">Errors</span>
                <p className="text-lg font-bold text-red-800">{previewData.invalidRows}</p>
              </div>
            </div>

            {/* Preview table */}
            <div className="max-h-64 overflow-y-auto border border-neutral-200 rounded-xl">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Row</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Full Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Village</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Validation Note</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {previewData.rows.map((row: any) => (
                    <TableRow
                      key={row.rowNumber}
                      className={
                        row.isDuplicate
                          ? "bg-amber-50/60"
                          : !row.isValid
                          ? "bg-red-50/60"
                          : "hover:bg-neutral-50"
                      }
                    >
                      <TableCell className="font-mono text-xs">{row.rowNumber}</TableCell>
                      <TableCell>
                        {row.isValid ? (
                          <Badge variant="success" className="gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Valid
                          </Badge>
                        ) : row.isDuplicate ? (
                          <Badge variant="warning" className="gap-1">
                            <AlertTriangle className="h-3 w-3" /> Duplicate
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="gap-1">
                            <XCircle className="h-3 w-3" /> Invalid
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="font-semibold text-xs">{row.fullName}</TableCell>
                      <TableCell className="text-xs">{row.phone || "-"}</TableCell>
                      <TableCell className="text-xs">{row.village || "-"}</TableCell>
                      <TableCell className="text-xs">{row.category}</TableCell>
                      <TableCell className="text-xs text-neutral-600">
                        {row.errors.length > 0 ? row.errors.join("; ") : "Ready for import"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
              <Button type="button" variant="outline" onClick={() => setPreviewData(null)}>
                Back to CSV Editor
              </Button>
              <Button
                type="button"
                variant="clay"
                isLoading={isExecuting}
                disabled={previewData.validRows === 0}
                onClick={handleExecuteImport}
              >
                Confirm & Import {previewData.validRows} Records
              </Button>
            </div>
          </div>
        )}

        {importSummary && (
          <div className="flex justify-end pt-2">
            <Button
              type="button"
              variant="default"
              onClick={() => {
                resetState();
                onOpenChange(false);
              }}
            >
              Done
            </Button>
          </div>
        )}
      </div>
    </Dialog>
  );
}
