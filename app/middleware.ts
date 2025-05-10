import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/login_page", "/register_page", "/api/health"];

export function middleware(req: NextRequest) {
  const isPublic = PUBLIC_PATHS.some((path) => req.nextUrl.pathname.startsWith(path));

  const token = req.cookies.get("token")?.value;

  if (!token && !isPublic) {
    return NextResponse.redirect(new URL("/login_page", req.url));
  }

  return NextResponse.next();
}

export const config = {
    matcher: ["/build_page", "/my_builds_page", "/upload_page", "/gallery_page"],
  };
  