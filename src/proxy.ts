import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ||
    "dev-fallback-secret-change-me-at-least-32-characters-long"
);

const PUBLIC_PATHS = ["/login", "/signup", "/forgot"];

async function isAuthed(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get("bn_session")?.value;
  if (!token) return false;
  try {
    await jwtVerify(token, SECRET);
    return true;
  } catch {
    return false;
  }
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip static assets and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") // files like favicon.ico
  ) {
    return NextResponse.next();
  }

  const authed = await isAuthed(req);

  // Redirect authed users away from auth pages
  if (authed && PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Redirect unauthed users to login
  if (!authed && !PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
