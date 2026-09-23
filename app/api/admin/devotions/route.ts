import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { DevotionsService } from "@/services/devotions.service";
import { DevotionSchema } from "@/validators/devotion";
import { logAudit } from "@/lib/audit";
import { getClientIp } from "@/lib/rate-limit";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session || !hasPermission(session.role, "devotions:view")) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || undefined;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "20", 10);

  try {
    const data = await DevotionsService.listAdmin(search, page, pageSize);
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ success: false, message: "Error loading devotions" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || !hasPermission(session.role, "devotions:manage")) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const validated = DevotionSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, message: "Validation error", errors: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const devotion = await DevotionsService.create(validated.data);

    await logAudit({
      userId: session.userId,
      userEmail: session.email,
      action: "DEVOTION_CREATED",
      entity: "Devotion",
      entityId: devotion.id,
      metadata: { title: devotion.title, slug: devotion.slug, published: devotion.published },
      ipAddress: getClientIp(req),
    });

    return NextResponse.json({ success: true, message: "Devotion created", data: devotion });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message || "Failed to create devotion" }, { status: 400 });
  }
}
