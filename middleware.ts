import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Browsing is fully public — sign-in is optional. Only /account/* requires a
// session.
//
// We use the DATABASE session strategy, and Next.js middleware runs in the Edge
// runtime where Prisma can't run — so we can't validate the session against the
// DB here. Instead we do a cheap presence check on the Auth.js session cookie
// and redirect to /signin if it's missing. The /account page itself performs
// the authoritative `auth()` check (and redirect), so a stale/forged cookie
// can't actually reach protected data.
const SESSION_COOKIES = [
  "authjs.session-token", // dev (http)
  "__Secure-authjs.session-token", // prod (https)
];

export function middleware(req: NextRequest) {
  const hasSession = SESSION_COOKIES.some((name) => req.cookies.has(name));
  if (!hasSession) {
    const url = new URL("/signin", req.url);
    url.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*"],
};
