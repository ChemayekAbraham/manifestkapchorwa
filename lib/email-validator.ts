import dns from "dns";

const DISALLOWED_DOMAINS = new Set([
  "tempmail.com",
  "10minutemail.com",
  "guerrillamail.com",
  "mailinator.com",
  "throwawaymail.com",
  "trashmail.com",
  "fakeinbox.com",
]);

const COMMON_TYPOS: Record<string, string> = {
  "gmaill.com": "gmail.com",
  "gmai.com": "gmail.com",
  "gmial.com": "gmail.com",
  "gmail.con": "gmail.com",
  "gamil.com": "gmail.com",
  "yaho.com": "yahoo.com",
  "yahooo.com": "yahoo.com",
  "hotmial.com": "hotmail.com",
  "outlok.com": "outlook.com",
};

export interface EmailValidationResult {
  isValid: boolean;
  error?: string;
  normalizedEmail: string;
  isGoogleAccount?: boolean;
}

/**
 * Validate email format, domain MX records, and Google/Gmail account rules
 */
export async function validateEmailAddress(rawEmail: string): Promise<EmailValidationResult> {
  const email = (rawEmail || "").trim().toLowerCase();

  if (!email) {
    return {
      isValid: false,
      error: "Email address is compulsory. Please enter your email address.",
      normalizedEmail: "",
    };
  }

  // Basic regex validation
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      error: "Please enter a valid email address format (e.g. name@gmail.com).",
      normalizedEmail: email,
    };
  }

  const [username, domain] = email.split("@");

  if (!username || !domain) {
    return {
      isValid: false,
      error: "Please enter a complete email address.",
      normalizedEmail: email,
    };
  }

  // Check common typos (e.g. gmail.con -> gmail.com)
  if (COMMON_TYPOS[domain]) {
    return {
      isValid: false,
      error: `Did you mean @${COMMON_TYPOS[domain]} instead of @${domain}?`,
      normalizedEmail: email,
    };
  }

  // Check disposable domains
  if (DISALLOWED_DOMAINS.has(domain)) {
    return {
      isValid: false,
      error: "Temporary or disposable email addresses are not allowed. Please use a permanent email.",
      normalizedEmail: email,
    };
  }

  const isGoogleAccount = domain === "gmail.com" || domain === "googlemail.com";

  // Google account specific rules
  if (isGoogleAccount) {
    // Gmail usernames are between 6 and 30 characters (excluding @gmail.com)
    // Note: Gmail ignores dots in usernames, but raw length without dots must be >= 6
    const cleanUser = username.replace(/\./g, "");
    if (cleanUser.length < 6 || cleanUser.length > 30) {
      return {
        isValid: false,
        error: "Google accounts must have a username between 6 and 30 characters.",
        normalizedEmail: email,
        isGoogleAccount: true,
      };
    }

    // Gmail usernames can only contain letters, numbers, and periods
    if (!/^[a-z0-9.]+$/.test(username)) {
      return {
        isValid: false,
        error: "Google account usernames can only contain letters (a-z), numbers (0-9), and periods (.).",
        normalizedEmail: email,
        isGoogleAccount: true,
      };
    }

    if (username.startsWith(".") || username.endsWith(".")) {
      return {
        isValid: false,
        error: "Google email address cannot start or end with a period.",
        normalizedEmail: email,
        isGoogleAccount: true,
      };
    }

    if (username.includes("..")) {
      return {
        isValid: false,
        error: "Google email address cannot have consecutive periods.",
        normalizedEmail: email,
        isGoogleAccount: true,
      };
    }
  }

  // Check DNS MX records for non-local testing
  if (process.env.NODE_ENV === "production" || !["localhost", "example.com", "test.com"].includes(domain)) {
    try {
      const resolveMxPromise = dns.promises.resolveMx(domain);
      const timeoutPromise = new Promise<dns.MxRecord[]>((_, reject) =>
        setTimeout(() => reject(new Error("DNS timeout")), 2000)
      );
      const records = await Promise.race([resolveMxPromise, timeoutPromise]);

      if (!records || records.length === 0) {
        return {
          isValid: false,
          error: `The email domain "@${domain}" does not appear to accept mail. Please check for typos.`,
          normalizedEmail: email,
        };
      }
    } catch (err: any) {
      // If DNS resolution explicitly returns ENOTFOUND / ENODATA, domain doesn't exist
      if (err.code === "ENOTFOUND" || err.code === "ENODATA" || err.code === "NXDOMAIN") {
        return {
          isValid: false,
          error: `The email domain "@${domain}" does not exist. Please check your email spelling.`,
          normalizedEmail: email,
        };
      }
      // On DNS timeouts or network errors, let valid syntax pass to avoid blocking users offline
    }
  }

  return {
    isValid: true,
    normalizedEmail: email,
    isGoogleAccount,
  };
}
