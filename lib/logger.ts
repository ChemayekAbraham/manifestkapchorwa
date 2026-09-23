type LogLevel = "info" | "warn" | "error" | "debug";

interface LogContext {
  userId?: string;
  action?: string;
  ip?: string;
  path?: string;
  error?: unknown;
  [key: string]: unknown;
}

function sanitizeData(data: Record<string, unknown>): Record<string, unknown> {
  const sensitiveKeys = ["password", "token", "secret", "authorization", "cookie", "passwordhash"];
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data)) {
    if (sensitiveKeys.some((s) => key.toLowerCase().includes(s))) {
      sanitized[key] = "[REDACTED]";
    } else if (value && typeof value === "object" && !Array.isArray(value)) {
      sanitized[key] = sanitizeData(value as Record<string, unknown>);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

export const logger = {
  log(level: LogLevel, message: string, context: LogContext = {}) {
    const timestamp = new Date().toISOString();
    const sanitizedContext = sanitizeData(context as Record<string, unknown>);
    const logEntry = {
      timestamp,
      level,
      message,
      ...sanitizedContext,
    };

    if (level === "error") {
      console.error(JSON.stringify(logEntry));
    } else if (level === "warn") {
      console.warn(JSON.stringify(logEntry));
    } else {
      console.log(JSON.stringify(logEntry));
    }
  },

  info(message: string, context?: LogContext) {
    this.log("info", message, context);
  },

  warn(message: string, context?: LogContext) {
    this.log("warn", message, context);
  },

  error(message: string, error?: unknown, context?: LogContext) {
    this.log("error", message, {
      ...context,
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: process.env.NODE_ENV === "development" && error instanceof Error ? error.stack : undefined,
    });
  },
};
