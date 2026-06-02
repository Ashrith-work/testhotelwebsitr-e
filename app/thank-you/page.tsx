import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Booking Confirmed — Thank You",
  description: "Your booking request has been received.",
  // Keep conversion pages out of search results.
  robots: { index: false, follow: false },
};

// Dedicated conversion page. The booking flow at /book redirects here on submit.
// HotelTrack detects the conversion from this page — KEEP the stable markers
// below (the /thank-you path, the #booking-confirmation element, and the
// data-conversion* attributes) so booking conversions are tracked correctly.
export default function ThankYouPage({
  searchParams,
}: {
  searchParams: { name?: string };
}) {
  const name = searchParams.name?.trim() || "Guest";

  return (
    <section className="container-x flex min-h-[60vh] items-center justify-center py-20">
      <div
        id="booking-confirmation"
        data-conversion="booking"
        data-conversion-type="booking-confirmed"
        data-conversion-page="thank-you"
        className="w-full max-w-xl rounded-sm bg-white p-10 text-center shadow-sm ring-1 ring-charcoal/5"
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-forest/10 text-forest">
          <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="m5 13 4 4 10-10" />
          </svg>
        </div>

        <h1 className="mt-6 font-serif text-3xl text-charcoal">Booking Confirmed</h1>
        <span className="mx-auto mt-3 block h-[3px] w-16 rounded bg-gold" />

        <p className="mt-6 leading-relaxed text-charcoal-light">
          Thank you, <strong className="text-charcoal">{name}</strong>. Your
          booking request for Neelakurunji Luxury Plantation Bungalow has been
          received. Our team will contact you shortly to confirm availability and
          finalise the details of your stay.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className="btn-forest">Back to Home</Link>
          <Link href="/rooms" className="btn-outline">View Rooms</Link>
        </div>
      </div>
    </section>
  );
}
