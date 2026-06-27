import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/", "/access"];

function roleAllowed(pathname: string, role: string | undefined) {
  if (pathname.startsWith("/admin")) return role === "admin";
  if (pathname.startsWith("/founder")) return role === "founder";
  if (pathname.startsWith("/investor")) return role === "investor";
  return true;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    PUBLIC_ROUTES.includes(pathname) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  const isAuthenticated = request.cookies.get("monarch_auth")?.value === "1";
  const role = request.cookies.get("monarch_role")?.value;

  if (!isAuthenticated) {
    return NextResponse.redirect(new URL("/access", request.url));
  }

  if (!roleAllowed(pathname, role)) {
    return NextResponse.redirect(new URL("/access", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
