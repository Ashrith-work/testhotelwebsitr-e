import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  buildInvoiceModel,
  renderInvoiceBody,
  type InvoiceBooking,
} from "@/lib/invoice";
import InvoiceActions from "@/components/InvoiceActions";

export const metadata: Metadata = {
  title: "Invoice",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function InvoicePage({
  params,
}: {
  params: { reference: string };
}) {
  const booking = await prisma.booking.findUnique({
    where: { bookingReference: params.reference },
  });

  if (!booking) notFound();

  const model = buildInvoiceModel(booking as InvoiceBooking);
  const body = renderInvoiceBody(model);

  return (
    <section className="container-x py-12">
      <div className="mx-auto max-w-2xl">
        <InvoiceActions />
        <div
          className="rounded-sm bg-white p-6 shadow-sm ring-1 ring-charcoal/5 sm:p-10 print:p-0 print:shadow-none print:ring-0"
          // Invoice markup is generated server-side from our own data (no user
          // HTML), so injecting it here is safe.
          dangerouslySetInnerHTML={{ __html: body }}
        />
      </div>
    </section>
  );
}
