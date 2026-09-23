import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Light database check without exposing details
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json({
      status: "ok",
      app: "Manifest Kapchorwa",
      timestamp: new Date().toISOString(),
      database: "connected",
    });
  } catch {
    return NextResponse.json(
      {
        status: "degraded",
        app: "Manifest Kapchorwa",
        timestamp: new Date().toISOString(),
        database: "disconnected",
      },
      { status: 503 }
    );
  }
}
