import { NextRequest, NextResponse } from "next/server";
import { DevotionsService } from "@/services/devotions.service";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);

    const result = await DevotionsService.listPublic(page, pageSize);
    return NextResponse.json({ success: true, data: result });
  } catch {
    return NextResponse.json({ success: false, message: "Error fetching devotions" }, { status: 500 });
  }
}
