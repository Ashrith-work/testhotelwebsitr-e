import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  buildInvoiceModel,
  renderInvoiceEmailHTML,
  type InvoiceBooking,
} from "@/lib/invoice";
import { sendMail } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Marks a booking as paid/confirmed and emails the invoice.
//
// NOTE: per the chosen flow this TRUSTS the guest's "I've completed the
// payment" tap — a static UPI QR gives the server no payment signal to verify
// against. Switch to a payment gateway (Razorpay etc.) if real verification is
// needed. Idempotent: re-confirming a confirmed booking is a no-op.
export async function POST(
  _request: Request,
  { params }: { params: { reference: string } },
) {
  const booking = await prisma.booking.findUnique({
    where: { bookingReference: params.reference },
  });

  if (!booking) {
    return NextResponse.json({ error: "Booking not found." }, { status: 404 });
  }

  const confirmed =
    booking.status === "confirmed"
      ? booking
      : await prisma.booking.update({
          where: { id: booking.id },
          data: { status: "confirmed", paidAt: booking.paidAt ?? new Date() },
        });

  // Build + email the invoice. Email failures don't fail the confirmation.
  const invoice = buildInvoiceModel(confirmed as InvoiceBooking);
  const emailResult = await sendMail({
    to: confirmed.email,
    subject: `Booking confirmed — ${confirmed.bookingReference} | Neelakurunji`,
    html: renderInvoiceEmailHTML(invoice),
  });

  return NextResponse.json({
    bookingReference: confirmed.bookingReference,
    status: confirmed.status,
    paidAt: confirmed.paidAt,
    invoiceUrl: `/invoice/${confirmed.bookingReference}`,
    invoiceNumber: invoice.invoiceNumber,
    emailSent: emailResult.sent,
    emailSkipped: emailResult.skipped ?? null,
  });
}
