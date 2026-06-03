"use client";

// Print / save-as-PDF action for the invoice page. Hidden when printing.
export default function InvoiceActions() {
  return (
    <div className="no-print mb-6 flex justify-end gap-3">
      <button type="button" onClick={() => window.print()} className="btn-gold">
        Download / Print
      </button>
    </div>
  );
}
