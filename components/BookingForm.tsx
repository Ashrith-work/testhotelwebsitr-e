"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { rooms } from "@/data/rooms";

type Mode = "redirect" | "inline";

export default function BookingForm({
  mode = "redirect",
  defaultRoom,
}: {
  mode?: Mode;
  defaultRoom?: string;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState<null | { name: string }>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("fullName") || "Guest");

    // NOTE: This demo does not POST anywhere — wire up to the owners' booking
    // backend / email service when available. The two modes exist to exercise
    // both HotelTrack conversion-detection styles:
    //   • redirect  -> navigates to /thank-you (dedicated conversion page)
    //   • inline    -> shows same-page confirmation markup
    if (mode === "redirect") {
      setSubmitting(true);
      const params = new URLSearchParams({ name });
      router.push(`/thank-you?${params.toString()}`);
      return;
    }
    setConfirmed({ name });
  };

  if (mode === "inline" && confirmed) {
    return (
      // Conversion-detection-friendly markup (same shape as /thank-you) so
      // HotelTrack can detect an in-page booking confirmation.
      <div
        id="booking-confirmation"
        data-conversion="booking"
        data-conversion-type="booking-confirmed"
        className="rounded-sm border border-forest/30 bg-forest/5 p-8 text-center"
      >
        <h2 className="font-serif text-2xl text-forest">Booking Confirmed</h2>
        <p className="mt-3 text-charcoal-light">
          Thank you, <strong>{confirmed.name}</strong>. Your booking request has
          been received. Our team will reach out shortly to confirm the details.
        </p>
        <button
          type="button"
          onClick={() => setConfirmed(null)}
          className="btn-outline mt-6"
        >
          Make Another Booking
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label htmlFor="fullName" className="input-label">Full Name</label>
        <input id="fullName" name="fullName" required className="input-field" placeholder="Your full name" />
      </div>

      <div>
        <label htmlFor="email" className="input-label">Email</label>
        <input id="email" name="email" type="email" required className="input-field" placeholder="you@example.com" />
      </div>
      <div>
        <label htmlFor="phone" className="input-label">Phone</label>
        <input id="phone" name="phone" type="tel" required className="input-field" placeholder="+91 …" />
      </div>

      <div>
        <label htmlFor="checkin" className="input-label">Check-in Date</label>
        <input id="checkin" name="checkin" type="date" required className="input-field" />
      </div>
      <div>
        <label htmlFor="checkout" className="input-label">Check-out Date</label>
        <input id="checkout" name="checkout" type="date" required className="input-field" />
      </div>

      <div>
        <label htmlFor="adults" className="input-label">Number of Adults</label>
        <input id="adults" name="adults" type="number" min={1} defaultValue={2} required className="input-field" />
      </div>
      <div>
        <label htmlFor="children" className="input-label">Number of Children</label>
        <input id="children" name="children" type="number" min={0} defaultValue={0} required className="input-field" />
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="roomType" className="input-label">Room Type</label>
        <select id="roomType" name="roomType" defaultValue={defaultRoom ?? ""} className="input-field" required>
          <option value="" disabled>Select a room type…</option>
          {rooms.map((r) => (
            <option key={r.slug} value={r.slug}>
              {r.name} — ₹{r.price.toLocaleString("en-IN")} / night
            </option>
          ))}
        </select>
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="requests" className="input-label">Special Requests</label>
        <textarea id="requests" name="requests" rows={4} className="input-field" placeholder="Anniversary, dietary needs, early check-in, etc." />
      </div>

      <div className="sm:col-span-2">
        <button type="submit" disabled={submitting} className="btn-gold w-full disabled:opacity-60">
          {submitting ? "Submitting…" : "Submit Booking Request"}
        </button>
      </div>
    </form>
  );
}
