import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Booking Confirmed — Thank You",
  description: "Your booking has been confirmed.",
  // Keep conversion pages out of search results.
  robots: { index: false, follow: false },
};

// Dedicated conversion page. The booking flow at /book redirects here after
// payment is confirmed, carrying the booking details as URL params:
//   /thank-you?bookingId=ABC123&amount=9000&guestName=John%20Doe&nights=3&checkIn=2026-06-15&checkOut=2026-06-18
//
// HotelTrack detects the conversion from this page (URL = /thank-you) and reads
// the booking revenue from the data-ht-value attribute on the total below.
// KEEP these stable markers: the /thank-you path, the #booking-confirmation
// element, the data-conversion* attributes, and data-ht-value.

// Format a YYYY-MM-DD string as "15 Jun 2026" (UTC so the day never shifts).
function formatDate(iso?: string): string {
  if (!iso) return "—";
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!m) return iso;
  const d = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default function ThankYouPage({
  searchParams,
}: {
  searchParams: {
    bookingId?: string;
    amount?: string;
    guestName?: string;
    nights?: string;
    checkIn?: string;
    checkOut?: string;
    invoice?: string;
  };
}) {
  const guestName = searchParams.guestName?.trim() || "Guest";
  const bookingId = searchParams.bookingId?.trim() || "";
  const checkIn = searchParams.checkIn?.trim() || "";
  const checkOut = searchParams.checkOut?.trim() || "";
  const invoice = searchParams.invoice?.trim() || "";

  const nights = Number(searchParams.nights);
  const hasNights = Number.isFinite(nights) && nights > 0;

  // `amount` arrives as a plain rupee number (e.g. 9000 for ₹9,000) — NOT paise,
  // NOT a currency string. data-ht-value is fed this same plain number.
  const amount = Number(searchParams.amount);
  const hasAmount = Number.isFinite(amount) && amount > 0;

  return (
    <section className="container-x flex min-h-[60vh] items-center justify-center py-20">
      <div
        id="booking-confirmation"
        data-conversion="booking"
        data-conversion-type="booking-confirmed"
        data-conversion-page="thank-you"
        className="w-full max-w-xl rounded-sm bg-white p-8 text-center shadow-sm ring-1 ring-charcoal/5 sm:p-10"
      >
        {/* Hotel name */}
        <p className="font-serif text-sm uppercase tracking-[0.2em] text-gold-dark">
          {site.shortName}
        </p>

        {/* Success checkmark */}
        <div className="mx-auto mt-5 flex h-16 w-16 items-center justify-center rounded-full bg-forest/10 text-forest">
          <svg
            viewBox="0 0 24 24"
            width="32"
            height="32"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m5 13 4 4 10-10" />
          </svg>
        </div>

        <h1 className="mt-6 font-serif text-3xl text-charcoal">
          Booking Confirmed!
        </h1>
        <span className="mx-auto mt-3 block h-[3px] w-16 rounded bg-gold" />

        <p className="mt-6 leading-relaxed text-charcoal-light">
          Thank you, <strong className="text-charcoal">{guestName}</strong>.
          {hasAmount
            ? " Your payment is confirmed and your stay is booked."
            : " Your booking request has been received. Our team will contact you shortly to confirm the details of your stay."}
        </p>

        {/* Booking summary card — only when we have real booking params. */}
        {hasAmount && (
          <dl className="mx-auto mt-8 max-w-md space-y-3 rounded-sm bg-cream/40 p-6 text-left text-sm">
            {bookingId && <Row label="Booking ID" value={bookingId} mono />}
            {checkIn && <Row label="Check-in" value={formatDate(checkIn)} />}
            {checkOut && <Row label="Check-out" value={formatDate(checkOut)} />}
            {hasNights && (
              <Row
                label="Number of nights"
                value={`${nights} night${nights > 1 ? "s" : ""}`}
              />
            )}

            <div className="mt-2 flex items-center justify-between border-t border-charcoal/10 pt-4">
              <dt className="text-sm font-semibold text-charcoal">Total Paid</dt>
              <dd>
                {/*
                  data-ht-value MUST be the plain numeric amount in rupees with
                  no currency symbol and no commas (e.g. "9000"). HotelTrack
                  extracts the booking revenue from this attribute.
                */}
                <span
                  data-ht-value={amount}
                  className="text-2xl font-bold text-maroon sm:text-3xl"
                >
                  ₹{amount.toLocaleString("en-IN")}
                </span>
              </dd>
            </div>
          </dl>
        )}

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          {invoice && (
            <a
              href={invoice}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold"
            >
              View / Download Invoice
            </a>
          )}
          <Link href="/" className="btn-forest">
            Back to Home
          </Link>
          <Link href="/rooms" className="btn-outline">
            View Rooms
          </Link>
        </div>
      </div>
    </section>
  );
}

function Row({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-charcoal-light">{label}</dt>
      <dd className={`text-charcoal ${mono ? "font-mono" : "font-medium"}`}>
        {value}
      </dd>
    </div>
  );
}
