import { NextRequest, NextResponse } from "next/server";
import { DevotionsService } from "@/services/devotions.service";

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await props.params;
    const devotion = await DevotionsService.getBySlug(slug, true);

    if (!devotion) {
      return NextResponse.json({ success: false, message: "Devotion not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: devotion });
  } catch {
    return NextResponse.json({ success: false, message: "Error loading devotion" }, { status: 500 });
  }
}
