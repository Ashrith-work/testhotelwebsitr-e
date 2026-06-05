"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import {
  buildAddOnLines,
  buildQuote,
  formatINR,
  nightsBetween,
  type AddOnLine,
  type AddOnView,
  type RoomView,
} from "@/lib/pricing";

// The six steps of the direct-booking flow.
const STEPS = [
  "Room",
  "Dates",
  "Guest",
  "Review",
  "Payment",
  "Confirmation",
] as const;

type CreateResult = {
  bookingReference: string;
  totalAmount: number;
  upiUri: string;
  upiVpa: string;
  payeeName: string;
  breakdown: {
    roomName: string;
    nightlyRate: number;
    numberOfNights: number;
    roomTotal: number;
    addOns: AddOnLine[];
    addOnTotal: number;
    subtotal: number;
    gstRate: number;
    gstAmount: number;
    totalAmount: number;
  };
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function addDaysISO(iso: string, days: number): string {
  const d = new Date(`${iso}T00:00:00.000Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function formatDateLong(iso: string): string {
  if (!iso) return "—";
  return new Date(`${iso}T00:00:00.000Z`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

type DefaultGuest = { fullName: string; email: string; phone: string };

export default function BookingWizard({
  rooms,
  addOns,
  preselectSlug,
  defaultGuest = null,
  isSignedIn = false,
}: {
  rooms: RoomView[];
  addOns: AddOnView[];
  preselectSlug?: string;
  defaultGuest?: DefaultGuest | null;
  isSignedIn?: boolean;
}) {
  const [step, setStep] = useState(0);

  const initialSlug =
    preselectSlug && rooms.some((r) => r.slug === preselectSlug)
      ? preselectSlug
      : null;
  const [roomSlug, setRoomSlug] = useState<string | null>(initialSlug);

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  // Pre-fill guest details from the signed-in user's profile (if any).
  const [fullName, setFullName] = useState(defaultGuest?.fullName ?? "");
  const [email, setEmail] = useState(defaultGuest?.email ?? "");
  const [phone, setPhone] = useState(defaultGuest?.phone ?? "");
  const [specialRequests, setSpecialRequests] = useState("");

  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>([]);

  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CreateResult | null>(null);

  const [confirming, setConfirming] = useState(false);
  const [confirmInfo, setConfirmInfo] = useState<{
    status: string;
    invoiceUrl: string;
    emailSent: boolean;
    emailSkipped: string | null;
  } | null>(null);

  const room = useMemo(
    () => rooms.find((r) => r.slug === roomSlug) ?? null,
    [rooms, roomSlug],
  );

  const nights = nightsBetween(checkIn, checkOut);
  const guests = adults + children;

  const selectedAddOns = useMemo(
    () => addOns.filter((a) => selectedAddOnIds.includes(a.id)),
    [addOns, selectedAddOnIds],
  );

  const quote = useMemo(() => {
    if (!room) return null;
    const lines = buildAddOnLines(selectedAddOns, guests);
    return buildQuote({
      nightlyRate: room.basePrice,
      numberOfNights: Math.max(nights, 1),
      addOnLines: lines,
    });
  }, [room, selectedAddOns, guests, nights]);

  // Pick a room and clamp the guest counts to its capacity.
  function chooseRoom(r: RoomView) {
    setRoomSlug(r.slug);
    setAdults((a) => Math.min(Math.max(1, a), r.maxAdults));
    setChildren((c) => Math.min(c, r.maxChildren));
  }

  function toggleAddOn(id: string) {
    setSelectedAddOnIds((ids) =>
      ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id],
    );
  }

  // Per-step gate for the Next button.
  const datesValid =
    !!checkIn &&
    !!checkOut &&
    nights >= 1 &&
    checkIn >= todayISO() &&
    !!room &&
    adults >= 1 &&
    adults <= room.maxAdults &&
    children >= 0 &&
    children <= room.maxChildren;

  const guestValid =
    fullName.trim().length > 1 && EMAIL_RE.test(email) && phone.trim().length >= 6;

  function next() {
    setError(null);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }
  function back() {
    setError(null);
    setStep((s) => Math.max(s - 1, 0));
  }

  async function createBooking() {
    if (!room) return;
    setCreating(true);
    setError(null);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomSlug: room.slug,
          checkIn,
          checkOut,
          adults,
          children,
          fullName,
          email,
          phone,
          specialRequests,
          addOnIds: selectedAddOnIds,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Could not create your booking.");
      }
      setResult(data as CreateResult);
      setStep(4); // Payment
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setCreating(false);
    }
  }

  // Trust the guest's "I've paid" tap: confirm the booking + email the invoice,
  // then advance to the confirmation step.
  async function confirmPayment() {
    if (!result) return;
    setConfirming(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/bookings/${encodeURIComponent(result.bookingReference)}/confirm`,
        { method: "POST" },
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Could not confirm your booking.");
      }
      setConfirmInfo({
        status: data.status,
        invoiceUrl: data.invoiceUrl,
        emailSent: !!data.emailSent,
        emailSkipped: data.emailSkipped ?? null,
      });
      setStep(5); // Confirmation
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setConfirming(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Stepper current={step} />

      {/* Subtle prompt for guests — sign-in is optional, not required. */}
      {!isSignedIn && step < 4 && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-sm bg-cream-dark/50 px-4 py-2.5 text-center text-sm text-charcoal-light">
          <span>Booking as a guest.</span>
          <Link
            href="/signin?callbackUrl=/book"
            className="font-semibold text-maroon hover:underline"
          >
            Sign in with Google
          </Link>
          <span>to track your bookings.</span>
        </div>
      )}

      <div className="mt-6 rounded-sm bg-white p-6 shadow-sm ring-1 ring-charcoal/5 sm:p-8">
        {error && (
          <div className="mb-6 rounded-sm border border-maroon/30 bg-maroon/5 px-4 py-3 text-sm text-maroon">
            {error}
          </div>
        )}

        {/* STEP 0 — ROOM SELECTION */}
        {step === 0 && (
          <div>
            <StepHeading
              title="Choose your room"
              subtitle="Select the accommodation for your stay."
            />
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {rooms.map((r) => (
                <button
                  key={r.slug}
                  type="button"
                  onClick={() => chooseRoom(r)}
                  className={`group flex flex-col overflow-hidden rounded-sm text-left ring-1 transition-all ${
                    roomSlug === r.slug
                      ? "ring-2 ring-forest"
                      : "ring-charcoal/10 hover:ring-maroon/40"
                  }`}
                >
                  <div className="relative h-40 w-full overflow-hidden">
                    <Image
                      src={r.imageUrl}
                      alt={r.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute right-3 top-3 rounded-sm bg-maroon px-2.5 py-1 text-xs font-semibold text-white">
                      {formatINR(r.basePrice)} / night
                    </span>
                    {roomSlug === r.slug && (
                      <span className="absolute left-3 top-3 rounded-full bg-forest px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                        Selected
                      </span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="font-serif text-lg text-charcoal">{r.name}</h3>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-gold-dark">
                      {capacityLabel(r)}
                    </p>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-charcoal-light">
                      {r.description}
                    </p>
                    <ul className="mt-3 flex flex-wrap gap-1.5">
                      {r.amenities.map((f) => (
                        <li
                          key={f}
                          className="rounded-full bg-cream-dark px-2 py-0.5 text-[11px] font-medium text-charcoal-light"
                        >
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </button>
              ))}
            </div>
            <NavRow
              onNext={next}
              nextDisabled={!room}
              nextLabel="Continue to Dates"
            />
          </div>
        )}

        {/* STEP 1 — DATES & GUESTS */}
        {step === 1 && room && (
          <div>
            <StepHeading
              title="Dates & guests"
              subtitle={`${room.name} · up to ${room.maxAdults} adults${
                room.maxChildren ? ` + ${room.maxChildren} children` : ""
              }`}
            />
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="checkin" className="input-label">
                  Check-in Date
                </label>
                <input
                  id="checkin"
                  type="date"
                  className="input-field"
                  min={todayISO()}
                  value={checkIn}
                  onChange={(e) => {
                    const v = e.target.value;
                    setCheckIn(v);
                    // Keep check-out strictly after check-in.
                    if (v && (!checkOut || checkOut <= v)) {
                      setCheckOut(addDaysISO(v, 1));
                    }
                  }}
                />
              </div>
              <div>
                <label htmlFor="checkout" className="input-label">
                  Check-out Date
                </label>
                <input
                  id="checkout"
                  type="date"
                  className="input-field"
                  min={checkIn ? addDaysISO(checkIn, 1) : addDaysISO(todayISO(), 1)}
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                />
              </div>

              <NumberStepper
                label="Adults"
                value={adults}
                min={1}
                max={room.maxAdults}
                onChange={setAdults}
              />
              <NumberStepper
                label="Children"
                value={children}
                min={0}
                max={room.maxChildren}
                onChange={setChildren}
                disabled={room.maxChildren === 0}
              />
            </div>

            <p className="mt-4 text-sm text-charcoal-light">
              {nights >= 1 ? (
                <>
                  <strong className="text-charcoal">{nights}</strong> night
                  {nights > 1 ? "s" : ""} · {formatINR(room.basePrice)} / night
                </>
              ) : (
                "Select your check-in and check-out dates."
              )}
            </p>

            <PriceSummary room={room} nights={nights} quote={quote} lines={[]} />

            <NavRow
              onBack={back}
              onNext={next}
              nextDisabled={!datesValid}
              nextLabel="Continue to Details"
            />
          </div>
        )}

        {/* STEP 2 — GUEST DETAILS */}
        {step === 2 && room && (
          <div>
            <StepHeading
              title="Guest details"
              subtitle="Who should we prepare the stay for?"
            />
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="fullName" className="input-label">
                  Full Name
                </label>
                <input
                  id="fullName"
                  className="input-field"
                  placeholder="Your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="email" className="input-label">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="input-field"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="phone" className="input-label">
                  Phone
                </label>
                <input
                  id="phone"
                  type="tel"
                  className="input-field"
                  placeholder="+91 …"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="requests" className="input-label">
                  Special Requests
                </label>
                <textarea
                  id="requests"
                  rows={3}
                  className="input-field"
                  placeholder="Anniversary, dietary needs, early check-in, etc."
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                />
              </div>
            </div>
            <NavRow
              onBack={back}
              onNext={next}
              nextDisabled={!guestValid}
              nextLabel="Continue to Review"
            />
          </div>
        )}

        {/* STEP 3 — REVIEW & ADD-ONS */}
        {step === 3 && room && quote && (
          <div>
            <StepHeading
              title="Review & add-ons"
              subtitle="Confirm your details and enhance your stay."
            />

            <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 rounded-sm bg-cream/40 p-5 text-sm">
              <SummaryRow label="Room" value={room.name} />
              <SummaryRow label="Guest" value={fullName} />
              <SummaryRow label="Check-in" value={formatDateLong(checkIn)} />
              <SummaryRow label="Check-out" value={formatDateLong(checkOut)} />
              <SummaryRow
                label="Guests"
                value={`${adults} adult${adults > 1 ? "s" : ""}${
                  children ? `, ${children} child${children > 1 ? "ren" : ""}` : ""
                }`}
              />
              <SummaryRow
                label="Nights"
                value={`${nights} × ${formatINR(room.basePrice)}`}
              />
            </dl>

            {addOns.length > 0 && (
              <div className="mt-8">
                <h4 className="font-serif text-lg text-charcoal">
                  Enhance your stay
                </h4>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {addOns.map((a) => {
                    const checked = selectedAddOnIds.includes(a.id);
                    return (
                      <label
                        key={a.id}
                        className={`flex cursor-pointer items-start gap-3 rounded-sm border p-4 transition ${
                          checked
                            ? "border-forest bg-forest/5"
                            : "border-charcoal/15 hover:border-maroon/40"
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="mt-1 h-4 w-4 accent-forest"
                          checked={checked}
                          onChange={() => toggleAddOn(a.id)}
                        />
                        <span className="flex-1">
                          <span className="flex items-baseline justify-between gap-2">
                            <span className="font-semibold text-charcoal">
                              {a.name}
                            </span>
                            <span className="whitespace-nowrap text-sm font-semibold text-maroon">
                              {formatINR(a.price)}
                              <span className="text-[11px] font-normal text-charcoal-light">
                                {a.pricingType === "per_person"
                                  ? " / guest"
                                  : " / stay"}
                              </span>
                            </span>
                          </span>
                          <span className="mt-1 block text-xs leading-relaxed text-charcoal-light">
                            {a.description}
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            <PriceSummary
              room={room}
              nights={nights}
              quote={quote}
              lines={buildAddOnLines(selectedAddOns, guests)}
            />

            <NavRow
              onBack={back}
              onNext={createBooking}
              nextDisabled={creating}
              nextLabel={creating ? "Preparing payment…" : "Proceed to Payment"}
            />
          </div>
        )}

        {/* STEP 4 — PAYMENT (UPI QR) */}
        {step === 4 && result && (
          <div className="text-center">
            <StepHeading
              title="Scan to pay"
              subtitle="Use any UPI app to pay the total below, then confirm."
              center
            />

            <div className="mt-6 inline-flex flex-col items-center rounded-sm border border-charcoal/10 bg-white p-6">
              <QRCodeSVG value={result.upiUri} size={220} level="M" />
              <p className="mt-4 text-2xl font-semibold text-charcoal">
                {formatINR(result.totalAmount)}
              </p>
              <p className="mt-1 text-xs text-charcoal-light">
                Paying to <strong>{result.upiVpa}</strong>
              </p>
              <p className="mt-1 text-xs text-charcoal-light">
                Ref: <span className="font-mono">{result.bookingReference}</span>
              </p>
            </div>

            <div className="mx-auto mt-6 max-w-md text-sm text-charcoal-light">
              <a href={result.upiUri} className="btn-outline w-full sm:hidden">
                Open in UPI app
              </a>
              <p className="mt-4">
                After paying, tap below. We&apos;ll verify the payment and email
                your confirmation. Your reference is{" "}
                <strong className="text-charcoal">
                  {result.bookingReference}
                </strong>
                .
              </p>
            </div>

            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={confirmPayment}
                disabled={confirming}
                className="btn-gold disabled:cursor-not-allowed disabled:opacity-50"
              >
                {confirming ? "Confirming…" : "I've completed the payment"}
              </button>
            </div>
          </div>
        )}

        {/* STEP 5 — CONFIRMATION */}
        {step === 5 && result && (
          // Keep these stable markers so HotelTrack detects the booking
          // conversion (same shape as /thank-you).
          <div
            id="booking-confirmation"
            data-conversion="booking"
            data-conversion-type="booking-confirmed"
            data-conversion-page="book"
            // HotelTrack reads the booking value from data-ht-value.
            data-ht-value={result.breakdown.totalAmount}
            className="text-center"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-forest/10 text-forest">
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
            <h2 className="mt-6 font-serif text-3xl text-charcoal">
              Booking Confirmed
            </h2>
            <span className="mx-auto mt-3 block h-[3px] w-16 rounded bg-gold" />
            <p className="mt-6 leading-relaxed text-charcoal-light">
              Thank you, <strong className="text-charcoal">{fullName}</strong>.
              Your payment is confirmed and your booking reference is{" "}
              <strong className="text-charcoal">{result.bookingReference}</strong>
              .{" "}
              {confirmInfo?.emailSent ? (
                <>
                  An invoice has been emailed to{" "}
                  <strong className="text-charcoal">{email}</strong>.
                </>
              ) : (
                <>
                  Your invoice is ready below
                  {confirmInfo?.emailSkipped
                    ? " (email delivery isn't configured yet)"
                    : ""}
                  .
                </>
              )}
            </p>

            <dl className="mx-auto mt-8 max-w-md space-y-2 rounded-sm bg-cream/40 p-5 text-left text-sm">
              <SummaryLine label="Room" value={result.breakdown.roomName} />
              <SummaryLine
                label="Stay"
                value={`${formatDateLong(checkIn)} → ${formatDateLong(checkOut)} (${
                  result.breakdown.numberOfNights
                } night${result.breakdown.numberOfNights > 1 ? "s" : ""})`}
              />
              <SummaryLine
                label="Subtotal"
                value={formatINR(result.breakdown.subtotal)}
              />
              <SummaryLine
                label={`GST (${result.breakdown.gstRate}%)`}
                value={formatINR(result.breakdown.gstAmount)}
              />
              <div className="border-t border-charcoal/10 pt-2">
                <SummaryLine
                  label="Total Paid"
                  value={formatINR(result.breakdown.totalAmount)}
                  emphasise
                />
              </div>
            </dl>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              {confirmInfo?.invoiceUrl && (
                <a
                  href={confirmInfo.invoiceUrl}
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
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Sub-components                                                              */
/* -------------------------------------------------------------------------- */

function capacityLabel(r: RoomView): string {
  const a = `${r.maxAdults} Adult${r.maxAdults > 1 ? "s" : ""}`;
  if (!r.maxChildren) return a;
  return `${a} + ${r.maxChildren} Child${r.maxChildren > 1 ? "ren" : ""}`;
}

function Stepper({ current }: { current: number }) {
  return (
    <ol className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-xs font-semibold uppercase tracking-wide">
      {STEPS.map((label, i) => {
        const state =
          i < current ? "done" : i === current ? "active" : "todo";
        return (
          <li key={label} className="flex items-center gap-2">
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] ${
                state === "active"
                  ? "bg-maroon text-white"
                  : state === "done"
                    ? "bg-forest text-white"
                    : "bg-cream-dark text-charcoal-light"
              }`}
            >
              {state === "done" ? "✓" : i + 1}
            </span>
            <span
              className={
                state === "todo" ? "text-charcoal-light" : "text-charcoal"
              }
            >
              {label}
            </span>
            {i < STEPS.length - 1 && (
              <span className="mx-1 hidden h-px w-5 bg-charcoal/20 sm:block" />
            )}
          </li>
        );
      })}
    </ol>
  );
}

function StepHeading({
  title,
  subtitle,
  center,
}: {
  title: string;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "text-center" : ""}>
      <h3 className="font-serif text-2xl text-charcoal">{title}</h3>
      {subtitle && (
        <p className="mt-1 text-sm text-charcoal-light">{subtitle}</p>
      )}
    </div>
  );
}

function NavRow({
  onBack,
  onNext,
  nextDisabled,
  nextLabel,
}: {
  onBack?: () => void;
  onNext: () => void;
  nextDisabled?: boolean;
  nextLabel: string;
}) {
  return (
    <div className="mt-8 flex items-center justify-between gap-3">
      {onBack ? (
        <button type="button" onClick={onBack} className="btn-outline">
          Back
        </button>
      ) : (
        <span />
      )}
      <button
        type="button"
        onClick={onNext}
        disabled={nextDisabled}
        className="btn-gold disabled:cursor-not-allowed disabled:opacity-50"
      >
        {nextLabel}
      </button>
    </div>
  );
}

function NumberStepper({
  label,
  value,
  min,
  max,
  onChange,
  disabled,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  disabled?: boolean;
}) {
  const dec = () => onChange(Math.max(min, value - 1));
  const inc = () => onChange(Math.min(max, value + 1));
  return (
    <div>
      <span className="input-label">
        {label}
        <span className="ml-1 font-normal normal-case text-charcoal-light/70">
          (max {max})
        </span>
      </span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={dec}
          disabled={disabled || value <= min}
          className="flex h-10 w-10 items-center justify-center rounded-sm border border-charcoal/20 text-lg text-charcoal disabled:opacity-40"
          aria-label={`Decrease ${label}`}
        >
          −
        </button>
        <span className="w-8 text-center text-base font-semibold text-charcoal">
          {value}
        </span>
        <button
          type="button"
          onClick={inc}
          disabled={disabled || value >= max}
          className="flex h-10 w-10 items-center justify-center rounded-sm border border-charcoal/20 text-lg text-charcoal disabled:opacity-40"
          aria-label={`Increase ${label}`}
        >
          +
        </button>
      </div>
    </div>
  );
}

function PriceSummary({
  room,
  nights,
  quote,
  lines,
}: {
  room: RoomView;
  nights: number;
  quote: ReturnType<typeof buildQuote> | null;
  lines: AddOnLine[];
}) {
  if (!quote || nights < 1) return null;
  return (
    <div className="mt-6 rounded-sm border border-charcoal/10 bg-cream/30 p-5 text-sm">
      <div className="flex justify-between text-charcoal-light">
        <span>
          {room.name} · {nights} night{nights > 1 ? "s" : ""}
        </span>
        <span className="text-charcoal">{formatINR(quote.roomTotal)}</span>
      </div>
      {lines.map((l) => (
        <div
          key={l.addOnId}
          className="mt-1 flex justify-between text-charcoal-light"
        >
          <span>
            {l.name}
            {l.quantity > 1 ? ` × ${l.quantity}` : ""}
          </span>
          <span className="text-charcoal">
            {formatINR(l.price * l.quantity)}
          </span>
        </div>
      ))}
      <div className="mt-2 flex justify-between border-t border-charcoal/10 pt-2 text-charcoal-light">
        <span>Subtotal</span>
        <span className="text-charcoal">{formatINR(quote.subtotal)}</span>
      </div>
      <div className="mt-1 flex justify-between text-charcoal-light">
        <span>GST ({quote.gstRate}%)</span>
        <span className="text-charcoal">{formatINR(quote.gstAmount)}</span>
      </div>
      <div className="mt-2 flex justify-between border-t border-charcoal/10 pt-2 text-base font-semibold">
        <span className="text-charcoal">Total</span>
        <span className="text-maroon">{formatINR(quote.totalAmount)}</span>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] font-semibold uppercase tracking-wide text-charcoal-light">
        {label}
      </dt>
      <dd className="mt-0.5 text-charcoal">{value}</dd>
    </div>
  );
}

function SummaryLine({
  label,
  value,
  emphasise,
}: {
  label: string;
  value: string;
  emphasise?: boolean;
}) {
  return (
    <div className="flex justify-between">
      <span className="text-charcoal-light">{label}</span>
      <span
        className={
          emphasise ? "font-semibold text-maroon" : "font-medium text-charcoal"
        }
      >
        {value}
      </span>
    </div>
  );
}
