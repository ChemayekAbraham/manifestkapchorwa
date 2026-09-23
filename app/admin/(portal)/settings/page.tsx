"use client";

import React, { useState, useEffect } from "react";
import { Settings, Save, CheckCircle2, Globe, Heart, Phone, Clock, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function SettingsAdminPage() {
  const [sections, setSections] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("HOME_HERO");
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form states per section
  const [editForm, setEditForm] = useState<{ title: string; content: string }>({
    title: "",
    content: "",
  });

  const fetchContentSections = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/content");
      const json = await res.json();
      if (json.success && json.data) {
        setSections(json.data);
        const current = json.data.find((s: any) => s.key === activeTab) || json.data[0];
        if (current) {
          setActiveTab(current.key);
          setEditForm({ title: current.title, content: current.content });
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContentSections();
  }, []);

  const handleSelectTab = (key: string) => {
    setActiveTab(key);
    setSuccessMessage(null);
    const item = sections.find((s) => s.key === key);
    if (item) {
      setEditForm({ title: item.title, content: item.content });
    }
  };

  const handleSaveSection = async () => {
    setSavingKey(activeTab);
    setSuccessMessage(null);

    try {
      const res = await fetch("/api/admin/content", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: activeTab,
          title: editForm.title,
          content: editForm.content,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setSuccessMessage("Content section updated successfully! The public website reflects these changes immediately.");
        fetchContentSections();
      } else {
        alert(json.message || "Failed to update content");
      }
    } catch {
      alert("Error saving section content");
    } finally {
      setSavingKey(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200/80 pb-5">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-neutral-900">
            Website Content & Church Settings
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Update public church information, vision statement, service schedules, and giving details without changing code.
          </p>
        </div>
      </div>

      {successMessage && (
        <Alert variant="success" title="Settings Saved">
          {successMessage}
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left navigation column */}
        <div className="lg:col-span-4 space-y-1 bg-white p-3 rounded-2xl border border-neutral-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 px-3 py-1.5 block">
            Content Sections
          </span>
          {sections.map((section) => {
            const isSelected = activeTab === section.key;
            return (
              <button
                key={section.key}
                type="button"
                onClick={() => handleSelectTab(section.key)}
                className={`w-full text-left rounded-xl px-3 py-2.5 text-xs font-semibold transition-colors flex items-center justify-between ${
                  isSelected
                    ? "bg-highland-800 text-white shadow-xs"
                    : "text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                <span>{section.title}</span>
                <span className="text-[10px] font-mono opacity-60">/{section.key}</span>
              </button>
            );
          })}
        </div>

        {/* Right editor column */}
        <div className="lg:col-span-8">
          <Card className="border-t-4 border-t-highland-800 bg-white shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Edit: {activeTab}</CardTitle>
                <Badge variant="outline" className="font-mono text-[10px]">
                  {activeTab}
                </Badge>
              </div>
              <CardDescription>
                Changes made here will instantly take effect across the public church website.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <Input
                label="Section Header / Title"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              />

              <Textarea
                label="Section Content / Data"
                rows={activeTab.includes("SCHEDULE") || activeTab.includes("GIVING") ? 10 : 6}
                value={editForm.content}
                onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                helperText={
                  activeTab.includes("SCHEDULE") || activeTab.includes("GIVING") || activeTab.includes("CONTACT")
                    ? "Stored as structured JSON data for formatted presentation on the public website."
                    : "Plain text or markdown content."
                }
              />

              <div className="flex justify-end pt-3 border-t border-neutral-100">
                <Button
                  variant="default"
                  isLoading={savingKey === activeTab}
                  onClick={handleSaveSection}
                  className="gap-2 font-semibold shadow-sm"
                >
                  <Save className="h-4 w-4" />
                  <span>Save & Publish Changes</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
