import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Public routes that don't need auth
const PUBLIC_ROUTES = ["/", "/access", "/login"];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. Check if route is public
    // if (PUBLIC_ROUTES.includes(pathname)) {
    //     return NextResponse.next();
    // }

    // 2. Check for auth token (Bypassed for MVP View)
    // const token = request.cookies.get("monarch_token")?.value;

    // if (!token) {
    //     if (pathname.startsWith("/api")) {
    //         return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    //     }
    // }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};
