// Builds a guest invoice (data model + HTML) from a confirmed booking. The same
// HTML body is reused for the on-page /invoice/[reference] view and the email.
import { site } from "@/data/site";
import { formatINR, type AddOnLine } from "@/lib/pricing";

export type InvoiceBooking = {
  bookingReference: string;
  fullName: string;
  email: string;
  phone: string;
  roomType: string;
  checkInDate: Date;
  checkOutDate: Date;
  numberOfNights: number;
  numberOfAdults: number;
  numberOfChildren: number;
  nightlyRate: number;
  addOns: unknown; // Json column — array of AddOnLine
  subtotal: number;
  gstRate: number;
  gstAmount: number;
  totalAmount: number;
  paymentMethod: string;
  paidAt: Date | null;
  status: string;
};

export type InvoiceModel = {
  invoiceNumber: string; // INV-<reference>
  issuedOn: string;
  status: string;
  paidVia: string;
  paidOn: string | null;
  seller: { name: string; address: string; phone: string };
  buyer: { name: string; email: string; phone: string };
  stay: {
    room: string;
    checkIn: string;
    checkOut: string;
    nights: number;
    guests: string;
  };
  lines: { label: string; detail: string; amount: number }[];
  subtotal: number;
  gstRate: number;
  gstAmount: number;
  total: number;
};

function fmtDate(d: Date): string {
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

function parseAddOnLines(value: unknown): AddOnLine[] {
  if (!Array.isArray(value)) return [];
  return value as AddOnLine[];
}

export function buildInvoiceModel(b: InvoiceBooking): InvoiceModel {
  const addOnLines = parseAddOnLines(b.addOns);

  const guests = `${b.numberOfAdults} adult${b.numberOfAdults > 1 ? "s" : ""}${
    b.numberOfChildren
      ? `, ${b.numberOfChildren} child${b.numberOfChildren > 1 ? "ren" : ""}`
      : ""
  }`;

  const lines: InvoiceModel["lines"] = [
    {
      label: b.roomType,
      detail: `${b.numberOfNights} night${b.numberOfNights > 1 ? "s" : ""} × ${formatINR(b.nightlyRate)}`,
      amount: b.nightlyRate * b.numberOfNights,
    },
    ...addOnLines.map((l) => ({
      label: l.name,
      detail: l.quantity > 1 ? `${l.quantity} × ${formatINR(l.price)}` : "1 × stay",
      amount: l.price * l.quantity,
    })),
  ];

  return {
    invoiceNumber: `INV-${b.bookingReference}`,
    issuedOn: fmtDate(b.paidAt ?? new Date()),
    status: b.status,
    paidVia: b.paymentMethod === "upi_static" ? "UPI" : b.paymentMethod,
    paidOn: b.paidAt ? fmtDate(b.paidAt) : null,
    seller: {
      name: site.name,
      address: site.address,
      phone: site.phones[0],
    },
    buyer: { name: b.fullName, email: b.email, phone: b.phone },
    stay: {
      room: b.roomType,
      checkIn: fmtDate(b.checkInDate),
      checkOut: fmtDate(b.checkOutDate),
      nights: b.numberOfNights,
      guests,
    },
    lines,
    subtotal: b.subtotal,
    gstRate: b.gstRate,
    gstAmount: b.gstAmount,
    total: b.totalAmount,
  };
}

// Inner invoice markup (no <html> wrapper) — used by both the /invoice page
// (injected) and the email (wrapped in a full document). Inline styles only, so
// it renders the same in an email client and in the browser.
export function renderInvoiceBody(m: InvoiceModel): string {
  const row = (label: string, detail: string, amount: string) => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #eee;">
        <div style="color:#2b2b2b;font-weight:600;">${label}</div>
        <div style="color:#777;font-size:13px;">${detail}</div>
      </td>
      <td style="padding:10px 0;border-bottom:1px solid #eee;text-align:right;color:#2b2b2b;white-space:nowrap;">${amount}</td>
    </tr>`;

  const totalRow = (label: string, amount: string, strong = false) => `
    <tr>
      <td style="padding:6px 0;color:${strong ? "#2b2b2b" : "#777"};${strong ? "font-weight:700;font-size:16px;" : ""}">${label}</td>
      <td style="padding:6px 0;text-align:right;color:${strong ? "#7a1f2b" : "#2b2b2b"};${strong ? "font-weight:700;font-size:16px;" : ""}">${amount}</td>
    </tr>`;

  return `
  <div style="max-width:640px;margin:0 auto;background:#fff;color:#2b2b2b;font-family:Arial,Helvetica,sans-serif;">
    <div style="border-bottom:3px solid #7a1f2b;padding-bottom:16px;margin-bottom:20px;">
      <h1 style="margin:0;font-size:22px;color:#1f4d3a;">${m.seller.name}</h1>
      <div style="color:#777;font-size:13px;margin-top:4px;">${m.seller.address}</div>
      <div style="color:#777;font-size:13px;">${m.seller.phone}</div>
    </div>

    <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
      <tr>
        <td style="vertical-align:top;">
          <div style="font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#999;">Invoice</div>
          <div style="font-weight:700;font-size:18px;">${m.invoiceNumber}</div>
          <div style="color:#777;font-size:13px;">Issued ${m.issuedOn}</div>
        </td>
        <td style="vertical-align:top;text-align:right;">
          <div style="display:inline-block;background:#1f4d3a;color:#fff;font-size:12px;font-weight:700;letter-spacing:1px;padding:4px 12px;border-radius:3px;text-transform:uppercase;">
            ${m.status === "confirmed" ? "Paid" : m.status}
          </div>
          ${m.paidOn ? `<div style="color:#777;font-size:13px;margin-top:6px;">${m.paidVia} · ${m.paidOn}</div>` : ""}
        </td>
      </tr>
    </table>

    <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
      <tr>
        <td style="vertical-align:top;width:50%;">
          <div style="font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#999;margin-bottom:4px;">Billed To</div>
          <div style="font-weight:600;">${m.buyer.name}</div>
          <div style="color:#777;font-size:13px;">${m.buyer.email}</div>
          <div style="color:#777;font-size:13px;">${m.buyer.phone}</div>
        </td>
        <td style="vertical-align:top;width:50%;">
          <div style="font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#999;margin-bottom:4px;">Stay</div>
          <div style="color:#2b2b2b;font-size:14px;">${m.stay.room}</div>
          <div style="color:#777;font-size:13px;">${m.stay.checkIn} → ${m.stay.checkOut} (${m.stay.nights} night${m.stay.nights > 1 ? "s" : ""})</div>
          <div style="color:#777;font-size:13px;">${m.stay.guests}</div>
        </td>
      </tr>
    </table>

    <table style="width:100%;border-collapse:collapse;">
      <thead>
        <tr>
          <th style="text-align:left;padding-bottom:8px;border-bottom:2px solid #2b2b2b;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#999;">Description</th>
          <th style="text-align:right;padding-bottom:8px;border-bottom:2px solid #2b2b2b;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#999;">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${m.lines.map((l) => row(l.label, l.detail, formatINR(l.amount))).join("")}
      </tbody>
    </table>

    <table style="width:100%;border-collapse:collapse;margin-top:12px;">
      ${totalRow("Subtotal", formatINR(m.subtotal))}
      ${totalRow(`GST (${m.gstRate}%)`, formatINR(m.gstAmount))}
      ${totalRow("Total Paid", formatINR(m.total), true)}
    </table>

    <p style="margin-top:28px;color:#999;font-size:12px;text-align:center;">
      Thank you for booking with ${m.seller.name}. This is a computer-generated invoice.
    </p>
  </div>`;
}

export function renderInvoiceEmailHTML(m: InvoiceModel): string {
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
  <body style="margin:0;padding:24px;background:#f4f1ea;">${renderInvoiceBody(m)}</body></html>`;
}
