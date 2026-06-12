"use client";

import { usePathname } from "next/navigation";

type Stage = "awareness" | "consideration" | "intent" | "booking";

/**
 * Maps the current route to a HotelTrack funnel stage.
 *
 *   /, /about, /blog/*          → awareness
 *   /rooms, /rooms/*, /amenities → consideration
 *   /book, /booking/*           → intent
 *   /thank-you, /booking-confirmed → booking
 *   anything else               → awareness (default)
 *
 * Order matters: the exact "booking" routes are checked before the "intent"
 * prefixes so that /booking-confirmed resolves to "booking" rather than being
 * swallowed by a /booking* match.
 */
function stageForPath(pathname: string): Stage {
  if (pathname === "/thank-you" || pathname === "/booking-confirmed") {
    return "booking";
  }
  if (pathname === "/book" || pathname.startsWith("/booking/")) {
    return "intent";
  }
  if (
    pathname === "/rooms" ||
    pathname.startsWith("/rooms/") ||
    pathname === "/amenities"
  ) {
    return "consideration";
  }
  if (
    pathname === "/" ||
    pathname === "/about" ||
    pathname.startsWith("/blog")
  ) {
    return "awareness";
  }
  return "awareness";
}

/**
 * Renders the document <body> and stamps it with a data-ht-stage attribute for
 * HotelTrack funnel tracking. This is a client component so it can read the
 * current pathname, but usePathname() resolves during SSR too — so the
 * attribute is present in the server-rendered HTML and there's no hydration
 * mismatch. The async server RootLayout passes its already-rendered tree
 * (TopStrip, Navbar with session, main, Footer, tracking script) as children.
 */
export default function BodyWithStage({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const stage = stageForPath(pathname);

  return <body data-ht-stage={stage}>{children}</body>;
}
