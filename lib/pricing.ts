// Pure pricing helpers + serializable view types, shared by the server
// (authoritative, in app/api/bookings) and the client (display only, in the
// BookingWizard). All money is in PAISE (100 paise = 1 INR) to avoid float
// rounding. Keep this module free of imports from server-only code so the
// client bundle can use it too.

export type PricingType = "per_person" | "per_booking";

// Plain, JSON-serializable shape of a Room passed from server components to the
// client wizard (mapped from the Prisma Room — Dates dropped, amenities typed).
export type RoomView = {
  id: string;
  slug: string;
  name: string;
  description: string;
  basePrice: number; // paise per night
  maxAdults: number;
  maxChildren: number;
  imageUrl: string;
  amenities: string[];
};

export type AddOnView = {
  id: string;
  name: string;
  description: string;
  price: number; // paise (unit price)
  pricingType: PricingType;
  imageUrl: string;
};

// One add-on as stored on the booking (and used to compute the quote).
// `price` is the UNIT price in paise; the line total is `price * quantity`.
export type AddOnLine = {
  addOnId: string;
  name: string;
  quantity: number;
  price: number;
};

export type Quote = {
  roomTotal: number; // nightlyRate * numberOfNights
  addOnTotal: number; // sum of line totals
  subtotal: number; // roomTotal + addOnTotal
  gstRate: number; // whole percent: 12 or 18
  gstAmount: number; // round(subtotal * gstRate / 100)
  totalAmount: number; // subtotal + gstAmount
};

// Indian hotel GST: tariff (per-night rate) below ₹7,500 → 12%, otherwise 18%.
export const GST_THRESHOLD_PAISE = 7500 * 100; // ₹7,500/night

export function gstPercentFor(nightlyRatePaise: number): number {
  return nightlyRatePaise < GST_THRESHOLD_PAISE ? 12 : 18;
}

// Whole nights between two YYYY-MM-DD strings (or Dates), computed in UTC so a
// timezone offset can never shift the day count. Returns 0 if check-out is not
// strictly after check-in (callers validate for >= 1).
export function nightsBetween(
  checkIn: string | Date,
  checkOut: string | Date,
): number {
  const inMs = toUtcMidnight(checkIn);
  const outMs = toUtcMidnight(checkOut);
  if (inMs === null || outMs === null) return 0;
  const diff = Math.round((outMs - inMs) / 86_400_000);
  return diff > 0 ? diff : 0;
}

function toUtcMidnight(value: string | Date): number | null {
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return null;
    return Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate());
  }
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (!m) return null;
  return Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
}

// Build add-on line items from the selected add-ons. per_person add-ons are
// multiplied by the number of guests; per_booking add-ons are charged once.
export function buildAddOnLines(
  selected: AddOnView[],
  guests: number,
): AddOnLine[] {
  return selected.map((a) => ({
    addOnId: a.id,
    name: a.name,
    quantity: a.pricingType === "per_person" ? Math.max(1, guests) : 1,
    price: a.price,
  }));
}

export function buildQuote(input: {
  nightlyRate: number;
  numberOfNights: number;
  addOnLines: AddOnLine[];
}): Quote {
  const roomTotal = input.nightlyRate * input.numberOfNights;
  const addOnTotal = input.addOnLines.reduce(
    (sum, line) => sum + line.price * line.quantity,
    0,
  );
  const subtotal = roomTotal + addOnTotal;
  const gstRate = gstPercentFor(input.nightlyRate);
  const gstAmount = Math.round((subtotal * gstRate) / 100);
  return {
    roomTotal,
    addOnTotal,
    subtotal,
    gstRate,
    gstAmount,
    totalAmount: subtotal + gstAmount,
  };
}

// Format paise as an INR currency string, e.g. 752000 -> "₹7,520.00".
export function formatINR(paise: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(paise / 100);
}
