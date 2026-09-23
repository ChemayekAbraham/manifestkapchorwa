import { prisma } from "@/lib/prisma";
import { normalizeUgandanPhone } from "@/lib/phone";
import { MemberCategory, MemberStatus, Gender } from "@prisma/client";

export interface ParsedCsvRow {
  rowNumber: number;
  fullName: string;
  phone?: string | null;
  email?: string | null;
  gender?: string | null;
  village?: string | null;
  parish?: string | null;
  subCounty?: string | null;
  district?: string | null;
  category?: string | null;
  notes?: string | null;
  isValid: boolean;
  isDuplicate: boolean;
  errors: string[];
}

export interface ImportPreviewResult {
  totalRows: number;
  validRows: number;
  duplicateRows: number;
  invalidRows: number;
  rows: ParsedCsvRow[];
}

export class ImportService {
  /**
   * Parse simple CSV text into rows
   */
  private static parseCSV(csvContent: string): string[][] {
    const lines = csvContent.split(/\r?\n/).filter((l) => l.trim().length > 0);
    return lines.map((line) => {
      const result: string[] = [];
      let cur = "";
      let inQuotes = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          if (inQuotes && line[i + 1] === '"') {
            cur += '"';
            i++;
          } else {
            inQuotes = !inQuotes;
          }
        } else if (char === "," && !inQuotes) {
          result.push(cur.trim());
          cur = "";
        } else {
          cur += char;
        }
      }
      result.push(cur.trim());
      return result;
    });
  }

  /**
   * Preview and validate CSV data before database insertion
   */
  static async previewCSV(csvContent: string): Promise<ImportPreviewResult> {
    const parsed = this.parseCSV(csvContent);
    if (parsed.length < 2) {
      throw new Error("CSV file is empty or missing headers");
    }

    const headerRow = parsed[0].map((h) => h.toLowerCase().replace(/[\s_\-]/g, ""));
    const getColIdx = (aliases: string[]) => {
      return headerRow.findIndex((h) => aliases.some((a) => h.includes(a)));
    };

    const nameIdx = getColIdx(["fullname", "name", "member"]);
    const phoneIdx = getColIdx(["phone", "mobile", "contact", "tel"]);
    const emailIdx = getColIdx(["email", "mail"]);
    const genderIdx = getColIdx(["gender", "sex"]);
    const villageIdx = getColIdx(["village", "lc1", "cell", "zone"]);
    const parishIdx = getColIdx(["parish", "ward"]);
    const subCountyIdx = getColIdx(["subcounty", "division", "town"]);
    const districtIdx = getColIdx(["district"]);
    const categoryIdx = getColIdx(["category", "type", "role"]);
    const notesIdx = getColIdx(["note", "comment"]);

    if (nameIdx === -1) {
      throw new Error("CSV must have a 'Full Name' or 'Name' column header");
    }

    // Fetch existing phones & emails for duplicate detection
    const existingMembers = await prisma.person.findMany({
      select: { phone: true, email: true },
    });

    const existingPhones = new Set<string>();
    const existingEmails = new Set<string>();

    for (const m of existingMembers) {
      if (m.phone) existingPhones.add(m.phone);
      if (m.email) existingEmails.add(m.email.toLowerCase());
    }

    const rows: ParsedCsvRow[] = [];
    const seenBatchPhones = new Set<string>();
    const seenBatchEmails = new Set<string>();

    for (let i = 1; i < parsed.length; i++) {
      const row = parsed[i];
      if (row.length === 0 || row.every((c) => c === "")) continue;

      const rawName = row[nameIdx] || "";
      const rawPhone = phoneIdx !== -1 ? row[phoneIdx] : "";
      const rawEmail = emailIdx !== -1 ? row[emailIdx] : "";
      const rawGender = genderIdx !== -1 ? row[genderIdx]?.toUpperCase() : "";
      const rawCategory = categoryIdx !== -1 ? row[categoryIdx]?.toUpperCase().replace(/\s+/g, "_") : "";

      const normalizedPhone = normalizeUgandanPhone(rawPhone);
      const normalizedEmail = rawEmail.trim().toLowerCase() || null;

      const errors: string[] = [];
      let isDuplicate = false;

      if (!rawName || rawName.trim().length < 2) {
        errors.push("Full Name is required (minimum 2 characters)");
      }

      if (rawEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawEmail)) {
        errors.push("Invalid email format");
      }

      // Check duplicates in existing DB
      if (normalizedPhone && existingPhones.has(normalizedPhone)) {
        isDuplicate = true;
        errors.push(`Duplicate phone number already exists in church database: ${normalizedPhone}`);
      }
      if (normalizedEmail && existingEmails.has(normalizedEmail)) {
        isDuplicate = true;
        errors.push(`Duplicate email already exists in church database: ${normalizedEmail}`);
      }

      // Check duplicates within this batch
      if (normalizedPhone && seenBatchPhones.has(normalizedPhone)) {
        isDuplicate = true;
        errors.push(`Duplicate phone number found multiple times in this CSV file`);
      }
      if (normalizedEmail && seenBatchEmails.has(normalizedEmail)) {
        isDuplicate = true;
        errors.push(`Duplicate email found multiple times in this CSV file`);
      }

      if (normalizedPhone) seenBatchPhones.add(normalizedPhone);
      if (normalizedEmail) seenBatchEmails.add(normalizedEmail);

      const isValid = errors.length === 0;

      rows.push({
        rowNumber: i + 1,
        fullName: rawName.trim(),
        phone: normalizedPhone,
        email: normalizedEmail,
        gender: ["MALE", "FEMALE", "OTHER"].includes(rawGender) ? rawGender : null,
        village: villageIdx !== -1 ? row[villageIdx]?.trim() || null : null,
        parish: parishIdx !== -1 ? row[parishIdx]?.trim() || null : null,
        subCounty: subCountyIdx !== -1 ? row[subCountyIdx]?.trim() || null : null,
        district: districtIdx !== -1 ? row[districtIdx]?.trim() || "Kapchorwa" : "Kapchorwa",
        category: ["MEMBER", "VISITOR", "WORKER", "NEW_CONVERT", "YOUTH", "CHILD"].includes(rawCategory)
          ? rawCategory
          : "MEMBER",
        notes: notesIdx !== -1 ? row[notesIdx]?.trim() || null : null,
        isValid,
        isDuplicate,
        errors,
      });
    }

    const validRows = rows.filter((r) => r.isValid).length;
    const duplicateRows = rows.filter((r) => r.isDuplicate).length;
    const invalidRows = rows.filter((r) => !r.isValid && !r.isDuplicate).length;

    return {
      totalRows: rows.length,
      validRows,
      duplicateRows,
      invalidRows,
      rows,
    };
  }

  /**
   * Commit verified rows to database
   */
  static async executeImport(validRows: ParsedCsvRow[]) {
    const toInsert = validRows.filter((r) => r.isValid);

    if (toInsert.length === 0) {
      throw new Error("No valid rows to import");
    }

    return prisma.$transaction(
      toInsert.map((r) =>
        prisma.person.create({
          data: {
            fullName: r.fullName,
            phone: r.phone,
            email: r.email,
            gender: r.gender as Gender | null,
            village: r.village,
            parish: r.parish,
            subCounty: r.subCounty,
            district: r.district || "Kapchorwa",
            category: (r.category as MemberCategory) || "MEMBER",
            status: "ACTIVE" as MemberStatus,
            notes: r.notes ? `Imported via CSV. ${r.notes}` : "Imported via CSV",
            dateJoined: new Date(),
          },
        })
      )
    );
  }
}
