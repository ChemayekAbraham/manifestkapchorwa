import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { ContentService } from "@/services/content.service";
import { logAudit } from "@/lib/audit";
import { getClientIp } from "@/lib/rate-limit";

export async function GET() {
  try {
    const contents = await ContentService.getAllContent();
    return NextResponse.json({ success: true, data: contents });
  } catch {
    return NextResponse.json({ success: false, message: "Error loading website content" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session || !hasPermission(session.role, "content:manage")) {
    return NextResponse.json({ success: false, message: "Unauthorized to edit website content" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { key, title, content, imageUrl } = body;

    if (!key) {
      return NextResponse.json({ success: false, message: "Section key is required" }, { status: 400 });
    }

    const updated = await ContentService.updateContent(key, { title, content, imageUrl });

    await logAudit({
      userId: session.userId,
      userEmail: session.email,
      action: "CONTENT_UPDATED",
      entity: "WebsiteContent",
      entityId: key,
      metadata: { title },
      ipAddress: getClientIp(req),
    });

    return NextResponse.json({ success: true, message: "Content section saved successfully", data: updated });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to update content" }, { status: 500 });
  }
}
