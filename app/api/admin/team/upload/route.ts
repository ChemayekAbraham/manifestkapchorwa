import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || !hasPermission(session.role, "content:manage")) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, message: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename
    const origName = file.name.toLowerCase().replace(/[^a-z0-9.]/g, "-");
    const ext = path.extname(origName) || ".jpg";
    const baseName = path.basename(origName, ext);
    const uniqueFilename = `${baseName}-${Date.now()}${ext}`;

    const uploadDir = path.join(process.cwd(), "public", "images", "team");
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, uniqueFilename);
    await writeFile(filePath, buffer);

    const publicUrl = `/images/team/${uniqueFilename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      message: "Photo uploaded successfully",
    });
  } catch (error: any) {
    console.error("Team photo upload error:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to upload photo" },
      { status: 500 }
    );
  }
}
