/**
 * Ugandan Phone Number Normalization & Validation Utility
 *
 * Handles common Ugandan prefixes (+256, 256, 07xx, 03xx, 02xx, 04xx),
 * strips whitespaces, hyphens, and parentheses, and converts to a normalized
 * international format (+256XXXXXXXXX) suitable for database deduplication.
 */

export function normalizeUgandanPhone(rawPhone?: string | null): string | null {
  if (!rawPhone) return null;

  // Remove all non-numeric characters except leading +
  let cleaned = rawPhone.trim().replace(/[\s\-().]/g, "");

  if (!cleaned) return null;

  // If starts with +, strip it for uniform processing
  if (cleaned.startsWith("+")) {
    cleaned = cleaned.substring(1);
  }

  // Case 1: Starts with 256 (e.g. 256770123456)
  if (cleaned.startsWith("256") && cleaned.length === 12) {
    return `+${cleaned}`;
  }

  // Case 2: Starts with 0 (e.g. 0770123456 or 0390123456)
  if (cleaned.startsWith("0") && cleaned.length === 10) {
    return `+256${cleaned.substring(1)}`;
  }

  // Case 3: 9 digits starting with 7, 3, 4, 2 (e.g. 770123456)
  if (cleaned.length === 9 && /^[2347]/.test(cleaned)) {
    return `+256${cleaned}`;
  }

  // If already standard 12 digits (like +256770123456)
  if (cleaned.length === 12 && cleaned.startsWith("256")) {
    return `+${cleaned}`;
  }

  // Return normalized with + if digits only
  if (/^\d{9,15}$/.test(cleaned)) {
    return `+${cleaned}`;
  }

  return rawPhone.trim();
}

export function isValidUgandanPhone(rawPhone?: string | null): boolean {
  if (!rawPhone) return false;
  const normalized = normalizeUgandanPhone(rawPhone);
  if (!normalized) return false;

  // Valid Ugandan format: +256 followed by 9 digits (usually 7XX, 3XX, 4XX)
  return /^\+256(7\d|3\d|4\d|2\d)\d{7}$/.test(normalized);
}

export function formatUgandanPhoneDisplay(rawPhone?: string | null): string {
  const norm = normalizeUgandanPhone(rawPhone);
  if (!norm) return "-";
  if (norm.startsWith("+256") && norm.length === 13) {
    // +256 770 123456
    return `${norm.substring(0, 4)} ${norm.substring(4, 7)} ${norm.substring(7)}`;
  }
  return norm;
}
