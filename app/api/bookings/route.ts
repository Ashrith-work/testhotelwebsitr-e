import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { site } from "@/data/site";
import {
  buildAddOnLines,
  buildQuote,
  nightsBetween,
  type AddOnView,
} from "@/lib/pricing";

export const runtime = "nodejs";
// This route writes to the DB on every request — never cache it.
export const dynamic = "force-dynamic";

type CreateBookingBody = {
  roomSlug?: string;
  checkIn?: string; // YYYY-MM-DD
  checkOut?: string; // YYYY-MM-DD
  adults?: number;
  children?: number;
  fullName?: string;
  email?: string;
  phone?: string;
  specialRequests?: string;
  addOnIds?: string[];
};

// NLK-YYYYMMDD-XXXXX  (XXXXX = 5 random base36 chars, uppercased)
function generateBookingReference(checkIn: Date): string {
  const yyyymmdd = [
    checkIn.getUTCFullYear(),
    String(checkIn.getUTCMonth() + 1).padStart(2, "0"),
    String(checkIn.getUTCDate()).padStart(2, "0"),
  ].join("");
  let suffix = "";
  for (let i = 0; i < 5; i++) {
    suffix += Math.floor(Math.random() * 36)
      .toString(36)
      .toUpperCase();
  }
  return `NLK-${yyyymmdd}-${suffix}`;
}

function buildUpiUri(amountPaise: number, reference: string): string {
  const params = new URLSearchParams({
    pa: site.payment.upiVpa,
    pn: site.payment.payeeName,
    am: (amountPaise / 100).toFixed(2),
    cu: "INR",
    tn: `Booking ${reference}`,
  });
  return `upi://pay?${params.toString()}`;
}

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export async function POST(request: Request) {
  let body: CreateBookingBody;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid request body.");
  }

  const {
    roomSlug,
    checkIn,
    checkOut,
    adults,
    children = 0,
    fullName,
    email,
    phone,
    specialRequests,
    addOnIds = [],
  } = body;

  // --- Presence / shape validation -----------------------------------------
  if (!roomSlug || !checkIn || !checkOut) {
    return badRequest("Room and dates are required.");
  }
  if (!fullName?.trim() || !email?.trim() || !phone?.trim()) {
    return badRequest("Name, email and phone are required.");
  }
  const numAdults = Number(adults);
  const numChildren = Number(children);
  if (!Number.isInteger(numAdults) || numAdults < 1) {
    return badRequest("At least one adult is required.");
  }
  if (!Number.isInteger(numChildren) || numChildren < 0) {
    return badRequest("Invalid number of children.");
  }

  // --- Dates -----------------------------------------------------------------
  const numberOfNights = nightsBetween(checkIn, checkOut);
  if (numberOfNights < 1) {
    return badRequest("Check-out must be after check-in.");
  }
  const checkInDate = new Date(`${checkIn}T00:00:00.000Z`);
  const checkOutDate = new Date(`${checkOut}T00:00:00.000Z`);
  const todayUtc = new Date();
  todayUtc.setUTCHours(0, 0, 0, 0);
  if (checkInDate < todayUtc) {
    return badRequest("Check-in date cannot be in the past.");
  }

  // --- Room (authoritative price snapshot) -----------------------------------
  const room = await prisma.room.findUnique({ where: { slug: roomSlug } });
  if (!room || !room.isActive) {
    return badRequest("Selected room is not available.");
  }
  const guests = numAdults + numChildren;
  if (numAdults > room.maxAdults || numChildren > room.maxChildren) {
    return badRequest(
      `This room allows up to ${room.maxAdults} adults and ${room.maxChildren} children.`,
    );
  }

  // --- Add-ons (re-fetched from DB; client prices are never trusted) ---------
  const uniqueAddOnIds = Array.from(new Set(addOnIds)).filter(Boolean);
  const addOns = uniqueAddOnIds.length
    ? await prisma.addOn.findMany({
        where: { id: { in: uniqueAddOnIds }, isActive: true },
      })
    : [];
  if (addOns.length !== uniqueAddOnIds.length) {
    return badRequest("One or more selected add-ons are unavailable.");
  }
  const addOnViews: AddOnView[] = addOns.map((a) => ({
    id: a.id,
    name: a.name,
    description: a.description,
    price: a.price,
    pricingType: a.pricingType as AddOnView["pricingType"],
    imageUrl: a.imageUrl,
  }));

  // --- Quote (server is the source of truth) ---------------------------------
  const addOnLines = buildAddOnLines(addOnViews, guests);
  const quote = buildQuote({
    nightlyRate: room.basePrice,
    numberOfNights,
    addOnLines,
  });

  const bookingReference = generateBookingReference(checkInDate);

  const booking = await prisma.booking.create({
    data: {
      bookingReference,
      roomId: room.id,
      roomType: room.name,
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      checkInDate,
      checkOutDate,
      numberOfNights,
      numberOfAdults: numAdults,
      numberOfChildren: numChildren,
      specialRequests: specialRequests?.trim() || null,
      nightlyRate: room.basePrice,
      addOns: addOnLines,
      subtotal: quote.subtotal,
      gstRate: quote.gstRate,
      gstAmount: quote.gstAmount,
      totalAmount: quote.totalAmount,
      status: "pending_payment",
      paymentMethod: "upi_static",
    },
  });

  return NextResponse.json({
    bookingReference: booking.bookingReference,
    totalAmount: booking.totalAmount,
    upiUri: buildUpiUri(booking.totalAmount, booking.bookingReference),
    upiVpa: site.payment.upiVpa,
    payeeName: site.payment.payeeName,
    breakdown: {
      roomName: room.name,
      nightlyRate: room.basePrice,
      numberOfNights,
      roomTotal: quote.roomTotal,
      addOns: addOnLines,
      addOnTotal: quote.addOnTotal,
      subtotal: quote.subtotal,
      gstRate: quote.gstRate,
      gstAmount: quote.gstAmount,
      totalAmount: quote.totalAmount,
    },
  });
}
