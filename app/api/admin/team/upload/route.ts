import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || !hasPermission(session.role, "content:manage")) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
  }

  try {
    const contentType = req.headers.get("content-type") || "";

    // 1. Handle JSON payload (e.g. client-optimized base64 image)
    if (contentType.includes("application/json")) {
      const body = await req.json();
      const { image } = body;

      if (!image || typeof image !== "string") {
        return NextResponse.json({ success: false, message: "No image data provided" }, { status: 400 });
      }

      if (!image.startsWith("data:image/") && !image.startsWith("http://") && !image.startsWith("https://")) {
        return NextResponse.json({ success: false, message: "Invalid image format" }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        url: image,
        message: "Photo processed successfully",
      });
    }

    // 2. Handle multipart form data
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, message: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const mimeType = file.type || "image/jpeg";

    // In serverless environments (Vercel, AWS Lambda), the filesystem is read-only.
    // Saving to /var/task/public throws 'EROFS: read-only file system'.
    // We fall back directly to base64 Data URLs stored in PostgreSQL.
    const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);

    if (!isServerless && process.env.NODE_ENV === "development") {
      try {
        const origName = file.name.toLowerCase().replace(/[^a-z0-9.]/g, "-");
        const ext = path.extname(origName) || ".jpg";
        const baseName = path.basename(origName, ext);
        const uniqueFilename = `${baseName}-${Date.now()}${ext}`;

        const uploadDir = path.join(process.cwd(), "public", "images", "team");
        await mkdir(uploadDir, { recursive: true });

        const filePath = path.join(uploadDir, uniqueFilename);
        await writeFile(filePath, buffer);

        return NextResponse.json({
          success: true,
          url: `/images/team/${uniqueFilename}`,
          message: "Photo uploaded successfully",
        });
      } catch (fsErr: any) {
        console.warn("Local filesystem write failed, using data URL fallback:", fsErr?.message);
      }
    }

    // Return base64 Data URL for serverless / production / fallback
    const base64 = buffer.toString("base64");
    const dataUrl = `data:${mimeType};base64,${base64}`;

    return NextResponse.json({
      success: true,
      url: dataUrl,
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
