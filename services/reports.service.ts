import { prisma } from "@/lib/prisma";
import { ReportFilterInput, WHITELISTED_REPORT_FIELDS } from "@/validators/report";
import { Prisma } from "@prisma/client";

export interface ReportResult {
  title: string;
  type: string;
  generatedAt: string;
  dateRange?: { from?: string; to?: string };
  summary?: Record<string, number | string>;
  headers: string[];
  rows: Record<string, any>[];
  totalRecords: number;
}

export class ReportsService {
  /**
   * Helper to parse date boundaries safely
   */
  private static parseDateRange(dateFrom?: string, dateTo?: string) {
    let gte: Date | undefined;
    let lte: Date | undefined;

    if (dateFrom) {
      gte = new Date(dateFrom);
      gte.setHours(0, 0, 0, 0);
    }

    if (dateTo) {
      lte = new Date(dateTo);
      lte.setHours(23, 59, 59, 999);
    }

    return { gte, lte };
  }

  /**
   * 1. Membership Summary Report
   */
  static async getMembershipSummary(filters: ReportFilterInput): Promise<ReportResult> {
    const { gte, lte } = this.parseDateRange(filters.dateFrom, filters.dateTo);
    const where: Prisma.PersonWhereInput = {};
    if (gte || lte) {
      where.dateJoined = { ...(gte ? { gte } : {}), ...(lte ? { lte } : {}) };
    }
    if (filters.category) where.category = filters.category;
    if (filters.status) where.status = filters.status;
    if (filters.gender) where.gender = filters.gender;

    const people = await prisma.person.findMany({
      where,
      orderBy: { fullName: "asc" },
      select: {
        fullName: true,
        phone: true,
        email: true,
        gender: true,
        category: true,
        status: true,
        village: true,
        parish: true,
        subCounty: true,
        dateJoined: true,
      },
    });

    // Aggregations
    const byCategory: Record<string, number> = {};
    const byGender: Record<string, number> = {};
    const byStatus: Record<string, number> = {};

    for (const p of people) {
      byCategory[p.category] = (byCategory[p.category] || 0) + 1;
      const g = p.gender || "UNSPECIFIED";
      byGender[g] = (byGender[g] || 0) + 1;
      byStatus[p.status] = (byStatus[p.status] || 0) + 1;
    }

    const rows = people.map((p) => ({
      "Full Name": p.fullName,
      Phone: p.phone || "-",
      Email: p.email || "-",
      Gender: p.gender || "-",
      Category: p.category,
      Status: p.status,
      Village: p.village || "-",
      Parish: p.parish || "-",
      "Sub-County": p.subCounty || "-",
      "Date Joined": p.dateJoined.toISOString().split("T")[0],
    }));

    return {
      title: "Membership Summary Report",
      type: "membership-summary",
      generatedAt: new Date().toISOString(),
      dateRange: { from: filters.dateFrom, to: filters.dateTo },
      summary: {
        "Total People": people.length,
        "Active Members": byStatus["ACTIVE"] || 0,
        "New Converts": byCategory["NEW_CONVERT"] || 0,
        Workers: byCategory["WORKER"] || 0,
        Visitors: byCategory["VISITOR"] || 0,
        Youth: byCategory["YOUTH"] || 0,
      },
      headers: [
        "Full Name",
        "Phone",
        "Email",
        "Gender",
        "Category",
        "Status",
        "Village",
        "Parish",
        "Sub-County",
        "Date Joined",
      ],
      rows,
      totalRecords: rows.length,
    };
  }

  /**
   * 2. Growth Report (Monthly / Weekly Registrations)
   */
  static async getGrowthReport(filters: ReportFilterInput): Promise<ReportResult> {
    const { gte, lte } = this.parseDateRange(filters.dateFrom, filters.dateTo);
    const where: Prisma.PersonWhereInput = {};
    if (gte || lte) {
      where.dateJoined = { ...(gte ? { gte } : {}), ...(lte ? { lte } : {}) };
    }

    const people = await prisma.person.findMany({
      where,
      orderBy: { dateJoined: "asc" },
      select: {
        id: true,
        fullName: true,
        category: true,
        gender: true,
        dateJoined: true,
        village: true,
      },
    });

    const monthlyMap: Record<string, number> = {};
    for (const p of people) {
      const ym = p.dateJoined.toISOString().substring(0, 7); // YYYY-MM
      monthlyMap[ym] = (monthlyMap[ym] || 0) + 1;
    }

    const rows = Object.entries(monthlyMap).map(([month, count]) => ({
      Period: month,
      "New Registrations": count,
    }));

    return {
      title: "Church Growth Report",
      type: "growth",
      generatedAt: new Date().toISOString(),
      dateRange: { from: filters.dateFrom, to: filters.dateTo },
      summary: {
        "Total Growth in Period": people.length,
        "Active Periods": Object.keys(monthlyMap).length,
      },
      headers: ["Period", "New Registrations"],
      rows,
      totalRecords: people.length,
    };
  }

  /**
   * 3. New Converts Report
   */
  static async getNewConvertsReport(filters: ReportFilterInput): Promise<ReportResult> {
    const { gte, lte } = this.parseDateRange(filters.dateFrom, filters.dateTo);
    const where: Prisma.PersonWhereInput = {
      category: "NEW_CONVERT",
    };
    if (gte || lte) {
      where.dateJoined = { ...(gte ? { gte } : {}), ...(lte ? { lte } : {}) };
    }
    if (filters.status) where.status = filters.status;
    if (filters.village) where.village = { contains: filters.village, mode: "insensitive" };

    const converts = await prisma.person.findMany({
      where,
      orderBy: { dateJoined: "desc" },
    });

    const rows = converts.map((c) => ({
      "Full Name": c.fullName,
      Phone: c.phone || "-",
      Gender: c.gender || "-",
      Village: c.village || "-",
      Parish: c.parish || "-",
      "Sub-County": c.subCounty || "-",
      Status: c.status,
      "Date Joined": c.dateJoined.toISOString().split("T")[0],
      Notes: c.notes || "-",
    }));

    return {
      title: "New Converts Follow-up Report",
      type: "new-converts",
      generatedAt: new Date().toISOString(),
      dateRange: { from: filters.dateFrom, to: filters.dateTo },
      summary: {
        "Total New Converts": converts.length,
        Active: converts.filter((c) => c.status === "ACTIVE").length,
      },
      headers: [
        "Full Name",
        "Phone",
        "Gender",
        "Village",
        "Parish",
        "Sub-County",
        "Status",
        "Date Joined",
        "Notes",
      ],
      rows,
      totalRecords: rows.length,
    };
  }

  /**
   * 4. Attendance Report
   */
  static async getAttendanceReport(filters: ReportFilterInput): Promise<ReportResult> {
    const { gte, lte } = this.parseDateRange(filters.dateFrom, filters.dateTo);
    const where: Prisma.EventWhereInput = {};
    if (gte || lte) {
      where.date = { ...(gte ? { gte } : {}), ...(lte ? { lte } : {}) };
    }
    if (filters.eventId) {
      where.id = filters.eventId;
    }

    const events = await prisma.event.findMany({
      where,
      include: {
        attendance: true,
      },
      orderBy: { date: "desc" },
    });

    const rows = events.map((ev) => {
      const total = ev.attendance.length;
      const present = ev.attendance.filter((a) => a.status === "PRESENT").length;
      const absent = total - present;
      const rate = total > 0 ? `${Math.round((present / total) * 100)}%` : "0%";

      return {
        "Event Name": ev.name,
        "Event Date": ev.date.toISOString().split("T")[0],
        Location: ev.location,
        "Total Marked": total,
        Present: present,
        Absent: absent,
        "Attendance Rate": rate,
      };
    });

    const totalEvents = events.length;
    const totalPresentSum = rows.reduce((sum, r) => sum + (r["Present"] as number), 0);

    return {
      title: "Event Attendance Summary Report",
      type: "attendance",
      generatedAt: new Date().toISOString(),
      dateRange: { from: filters.dateFrom, to: filters.dateTo },
      summary: {
        "Total Events": totalEvents,
        "Total Present Records": totalPresentSum,
      },
      headers: [
        "Event Name",
        "Event Date",
        "Location",
        "Total Marked",
        "Present",
        "Absent",
        "Attendance Rate",
      ],
      rows,
      totalRecords: rows.length,
    };
  }

  /**
   * 5. Location Distribution Report
   */
  static async getLocationReport(filters: ReportFilterInput): Promise<ReportResult> {
    const where: Prisma.PersonWhereInput = {
      status: "ACTIVE",
    };
    if (filters.district) where.district = filters.district;
    if (filters.subCounty) where.subCounty = filters.subCounty;

    const people = await prisma.person.findMany({
      where,
      select: {
        village: true,
        parish: true,
        subCounty: true,
        district: true,
      },
    });

    const locationMap: Record<string, { village: string; parish: string; subCounty: string; district: string; count: number }> =
      {};

    for (const p of people) {
      const v = p.village?.trim() || "Unknown Village";
      const pr = p.parish?.trim() || "Unknown Parish";
      const sc = p.subCounty?.trim() || "Unknown Sub-County";
      const d = p.district?.trim() || "Kapchorwa";
      const key = `${d}__${sc}__${pr}__${v}`;

      if (!locationMap[key]) {
        locationMap[key] = { village: v, parish: pr, subCounty: sc, district: d, count: 0 };
      }
      locationMap[key].count += 1;
    }

    const rows = Object.values(locationMap)
      .sort((a, b) => b.count - a.count)
      .map((item) => ({
        Village: item.village,
        Parish: item.parish,
        "Sub-County": item.subCounty,
        District: item.district,
        "Active Members": item.count,
      }));

    return {
      title: "Member Location & Demographic Distribution",
      type: "location",
      generatedAt: new Date().toISOString(),
      summary: {
        "Total Active Members": people.length,
        "Distinct Communities": rows.length,
      },
      headers: ["Village", "Parish", "Sub-County", "District", "Active Members"],
      rows,
      totalRecords: rows.length,
    };
  }

  /**
   * 6. Inactive / Transferred Members Report
   */
  static async getInactiveReport(filters: ReportFilterInput): Promise<ReportResult> {
    const where: Prisma.PersonWhereInput = {
      status: { in: ["INACTIVE", "TRANSFERRED"] },
    };
    if (filters.category) where.category = filters.category;

    const people = await prisma.person.findMany({
      where,
      orderBy: { updatedAt: "desc" },
    });

    const rows = people.map((p) => ({
      "Full Name": p.fullName,
      Phone: p.phone || "-",
      Email: p.email || "-",
      Status: p.status,
      Category: p.category,
      Village: p.village || "-",
      "Sub-County": p.subCounty || "-",
      "Last Updated": p.updatedAt.toISOString().split("T")[0],
      Notes: p.notes || "-",
    }));

    return {
      title: "Inactive & Transferred Members Report",
      type: "inactive",
      generatedAt: new Date().toISOString(),
      summary: {
        "Total Inactive/Transferred": people.length,
        Inactive: people.filter((p) => p.status === "INACTIVE").length,
        Transferred: people.filter((p) => p.status === "TRANSFERRED").length,
      },
      headers: [
        "Full Name",
        "Phone",
        "Email",
        "Status",
        "Category",
        "Village",
        "Sub-County",
        "Last Updated",
        "Notes",
      ],
      rows,
      totalRecords: rows.length,
    };
  }

  /**
   * 7. Custom Report Builder with strict field whitelist
   */
  static async getCustomReport(filters: ReportFilterInput): Promise<ReportResult> {
    const { gte, lte } = this.parseDateRange(filters.dateFrom, filters.dateTo);
    const where: Prisma.PersonWhereInput = {};

    if (gte || lte) {
      where.dateJoined = { ...(gte ? { gte } : {}), ...(lte ? { lte } : {}) };
    }
    if (filters.category) where.category = filters.category;
    if (filters.status) where.status = filters.status;
    if (filters.gender) where.gender = filters.gender;
    if (filters.village) where.village = { contains: filters.village, mode: "insensitive" };
    if (filters.subCounty) where.subCounty = { contains: filters.subCounty, mode: "insensitive" };
    if (filters.district) where.district = { contains: filters.district, mode: "insensitive" };

    // Strict field whitelist validation
    const requestedFields =
      filters.fields && filters.fields.length > 0
        ? filters.fields.filter((f) => WHITELISTED_REPORT_FIELDS.includes(f as any))
        : ["fullName", "phone", "category", "status", "village", "dateJoined"];

    const sortBy = filters.sortBy && WHITELISTED_REPORT_FIELDS.includes(filters.sortBy as any)
      ? filters.sortBy
      : "dateJoined";
    const sortOrder = filters.sortOrder === "asc" ? "asc" : "desc";

    const people = await prisma.person.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
    });

    const fieldLabels: Record<string, string> = {
      fullName: "Full Name",
      phone: "Phone",
      email: "Email",
      gender: "Gender",
      dateOfBirth: "Date of Birth",
      village: "Village",
      parish: "Parish",
      subCounty: "Sub-County",
      district: "District",
      category: "Category",
      status: "Status",
      notes: "Notes",
      dateJoined: "Date Joined",
      createdAt: "Created At",
    };

    const headers = requestedFields.map((f) => fieldLabels[f] || f);

    const rows = people.map((p: any) => {
      const row: Record<string, any> = {};
      for (const f of requestedFields) {
        const val = p[f];
        if (val instanceof Date) {
          row[fieldLabels[f] || f] = val.toISOString().split("T")[0];
        } else {
          row[fieldLabels[f] || f] = val !== null && val !== undefined ? String(val) : "-";
        }
      }
      return row;
    });

    return {
      title: "Custom Membership Query Report",
      type: "custom",
      generatedAt: new Date().toISOString(),
      dateRange: { from: filters.dateFrom, to: filters.dateTo },
      summary: {
        "Total Matches": rows.length,
      },
      headers,
      rows,
      totalRecords: rows.length,
    };
  }

  /**
   * Router to run any report by type
   */
  static async runReport(filters: ReportFilterInput): Promise<ReportResult> {
    switch (filters.type) {
      case "membership-summary":
        return this.getMembershipSummary(filters);
      case "growth":
        return this.getGrowthReport(filters);
      case "new-converts":
        return this.getNewConvertsReport(filters);
      case "attendance":
        return this.getAttendanceReport(filters);
      case "location":
        return this.getLocationReport(filters);
      case "inactive":
        return this.getInactiveReport(filters);
      case "custom":
        return this.getCustomReport(filters);
      default:
        return this.getMembershipSummary(filters);
    }
  }
}
