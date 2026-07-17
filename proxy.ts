import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/", "/access", "/request-access", "/login", "/verify", "/founder/onboarding", "/investor/onboarding"];
const PUBLIC_PREFIXES = ["/api"];

type SessionClaims = {
  role?: string;
  exp?: number;
};

function decodeBase64Url(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  return Uint8Array.from(atob(padded), (character) => character.charCodeAt(0));
}

async function verifySessionToken(token: string): Promise<SessionClaims | null> {
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  try {
    const secret = process.env.JWT_SECRET || "fallback-secret-for-dev-only";
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"],
    );
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      decodeBase64Url(parts[2]),
      new TextEncoder().encode(`${parts[0]}.${parts[1]}`),
    );
    if (!valid) return null;

    const claims = JSON.parse(new TextDecoder().decode(decodeBase64Url(parts[1]))) as SessionClaims;
    if (claims.exp && claims.exp * 1000 <= Date.now()) return null;
    return claims;
  } catch {
    return null;
  }
}

function roleAllowed(pathname: string, role: string | undefined) {
  const normalizedRole = role?.toUpperCase();
  if (pathname.startsWith("/admin")) return normalizedRole === "ADMIN";
  if (pathname.startsWith("/founder")) return normalizedRole === "FOUNDER";
  if (pathname.startsWith("/investor")) return normalizedRole === "INVESTOR";
  if (pathname.startsWith("/boardroom")) return normalizedRole === "INVESTOR";
  if (pathname.startsWith("/dealroom")) {
    return normalizedRole === "FOUNDER" || normalizedRole === "INVESTOR";
  }
  return true;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    PUBLIC_ROUTES.includes(pathname) ||
    PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix)) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get("monarch_token")?.value;
  const claims = token ? await verifySessionToken(token) : null;

  if (!claims) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (!roleAllowed(pathname, claims.role)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
