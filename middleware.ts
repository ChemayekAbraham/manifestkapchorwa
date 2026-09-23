import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(
  process.env.AUTH_SECRET || "manifest_kapchorwa_super_secret_jwt_key_2026_uganda_highlands_key"
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Security Headers
  const response = NextResponse.next();
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "origin-when-cross-origin");

  // Allow admin login page
  if (pathname === "/admin/login") {
    const token = request.cookies.get("mk_session")?.value;
    if (token) {
      try {
        await jwtVerify(token, SECRET_KEY);
        // Already logged in, redirect to dashboard
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      } catch {
        // Token invalid, proceed to login
      }
    }
    return response;
  }

  // Protect /admin and /api/admin routes
  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");

  if (isAdminPage || isAdminApi) {
    const token = request.cookies.get("mk_session")?.value;

    if (!token) {
      if (isAdminApi) {
        return NextResponse.json(
          { success: false, message: "Authentication required" },
          { status: 401 }
        );
      }
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const { payload } = await jwtVerify(token, SECRET_KEY);

      // Super admin only routes protection
      const isSuperAdminRoute =
        pathname.startsWith("/admin/users") ||
        pathname.startsWith("/admin/audit-logs") ||
        pathname.startsWith("/api/admin/users") ||
        pathname.startsWith("/api/admin/audit-logs");

      if (isSuperAdminRoute && payload.role !== "SUPER_ADMIN") {
        if (isAdminApi) {
          return NextResponse.json(
            { success: false, message: "Insufficient permissions. Super Administrator required." },
            { status: 403 }
          );
        }
        return NextResponse.redirect(new URL("/admin/dashboard?error=forbidden", request.url));
      }

      return response;
    } catch {
      // Invalid or expired token
      if (isAdminApi) {
        return NextResponse.json(
          { success: false, message: "Invalid or expired session" },
          { status: 401 }
        );
      }
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
