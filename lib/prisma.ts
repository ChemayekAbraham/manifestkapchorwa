import { PrismaClient } from "@prisma/client";

// Provide a safe placeholder so Prisma generation and build-time prerendering
// do not crash if DATABASE_URL is not yet configured in the hosting environment.
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "postgresql://placeholder:placeholder@localhost:5432/placeholder?schema=public";
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const client = new PrismaClient({
    log: [
      { emit: "event", level: "error" },
      { emit: "stdout", level: "warn" },
    ],
  });

  // Handle errors from Neon serverless pooler gracefully
  client.$on("error" as never, (event: { message?: string }) => {
    const msg = event?.message || "";
    // Neon PgBouncer closes idle pooled sockets when serverless compute scales to zero.
    // Prisma will re-establish the connection on the next user query automatically.
    // Suppress harmless 'kind: Closed' notices from flooding the console.
    if (msg.includes("kind: Closed") || msg.includes("kind: ConnectionReset") || msg.includes("Closed")) {
      return;
    }
    console.error("Prisma Database Error:", msg || event);
  });

  return client;
}

export const prisma =
  globalForPrisma.prisma && "teamMember" in (globalForPrisma.prisma as any)
    ? globalForPrisma.prisma
    : createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
