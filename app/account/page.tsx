import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { site } from "@/data/site";
import { formatINR } from "@/lib/pricing";
import PageHeader from "@/components/PageHeader";
import PhoneForm from "@/components/account/PhoneForm";
import SignOutButton from "@/components/auth/SignOutButton";

export const metadata: Metadata = {
  title: "My Account",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const STATUS_STYLES: Record<string, string> = {
  confirmed: "bg-forest/10 text-forest",
  pending_payment: "bg-gold/15 text-gold-dark",
  cancelled: "bg-charcoal/10 text-charcoal-light",
  failed: "bg-maroon/10 text-maroon",
};

function statusLabel(status: string): string {
  return status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function fmtDate(d: Date): string {
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default async function AccountPage() {
  const session = await auth();
  // Authoritative check (middleware only does a cookie pre-check).
  if (!session?.user?.id) redirect("/signin?callbackUrl=/account");

  const user = session.user;
  const bookings = await prisma.booking.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <PageHeader title="My Account" subtitle="Your profile and bookings" />

      <section className="container-x py-16">
        <div className="mx-auto grid max-w-4xl gap-8 lg:grid-cols-[320px_1fr]">
          {/* Profile */}
          <div className="rounded-sm bg-white p-6 shadow-sm ring-1 ring-charcoal/5">
            <div className="flex items-center gap-4">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name || "Profile"}
                  width={64}
                  height={64}
                  className="h-16 w-16 rounded-full object-cover ring-1 ring-charcoal/10"
                />
              ) : (
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-maroon text-2xl font-semibold text-white">
                  {(user.name || user.email || "?").charAt(0).toUpperCase()}
                </span>
              )}
              <div className="min-w-0">
                <p className="truncate font-serif text-lg text-charcoal">
                  {user.name || "Guest"}
                </p>
                <p className="truncate text-sm text-charcoal-light">
                  {user.email}
                </p>
              </div>
            </div>

            <div className="mt-6 border-t border-charcoal/10 pt-5">
              <PhoneForm phone={user.phone ?? null} />
            </div>

            <div className="mt-6 border-t border-charcoal/10 pt-5">
              <SignOutButton />
            </div>
          </div>

          {/* Bookings */}
          <div id="bookings" className="scroll-mt-24">
            <h2 className="font-serif text-2xl text-charcoal">My Bookings</h2>
            <span className="mt-2 block h-[3px] w-16 rounded bg-maroon" />

            {bookings.length === 0 ? (
              <div className="mt-6 rounded-sm bg-white p-8 text-center shadow-sm ring-1 ring-charcoal/5">
                <p className="text-charcoal-light">
                  You don&apos;t have any bookings yet.
                </p>
                <Link href="/book" className="btn-gold mt-5 inline-flex">
                  Book Your Stay
                </Link>
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {bookings.map((b) => (
                  <div
                    key={b.id}
                    className="rounded-sm bg-white p-5 shadow-sm ring-1 ring-charcoal/5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-serif text-lg text-charcoal">
                          {site.shortName} · {b.roomType}
                        </p>
                        <p className="mt-1 text-sm text-charcoal-light">
                          {fmtDate(b.checkInDate)} → {fmtDate(b.checkOutDate)} ·{" "}
                          {b.numberOfNights} night
                          {b.numberOfNights > 1 ? "s" : ""}
                        </p>
                        <p className="mt-1 font-mono text-xs text-charcoal-light">
                          {b.bookingReference}
                        </p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`inline-block rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${
                            STATUS_STYLES[b.status] ??
                            "bg-charcoal/10 text-charcoal-light"
                          }`}
                        >
                          {statusLabel(b.status)}
                        </span>
                        <p className="mt-2 text-lg font-semibold text-maroon">
                          {formatINR(b.totalAmount)}
                        </p>
                      </div>
                    </div>
                    {b.status === "confirmed" && (
                      <div className="mt-3 border-t border-charcoal/10 pt-3">
                        <Link
                          href={`/invoice/${b.bookingReference}`}
                          className="text-xs font-semibold uppercase tracking-wide text-forest hover:underline"
                        >
                          View Invoice →
                        </Link>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
