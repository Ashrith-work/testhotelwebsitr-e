import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import BookingForm from "@/components/BookingForm";

export const metadata: Metadata = {
  title: "Book Online",
  description:
    "Reserve your stay at Neelakurunji Luxury Plantation Bungalow, Munnar — check availability and book online.",
};

// Server component: reads the optional ?room= query param to preselect a room,
// then hands it to the client BookingForm.
export default function BookPage({
  searchParams,
}: {
  searchParams: { room?: string };
}) {
  return (
    <>
      <PageHeader
        title="Book Online"
        subtitle="Reserve your plantation retreat — we'll confirm the details with you"
      />

      <section className="container-x py-20">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-sm bg-white p-8 shadow-sm ring-1 ring-charcoal/5 sm:p-10">
            <h2 className="section-title">Booking Request</h2>
            <p className="mt-4 text-sm text-charcoal-light">
              Fill in your details below. On submit you&apos;ll be taken to a
              confirmation page.
            </p>
            <div className="mt-8">
              <BookingForm mode="redirect" defaultRoom={searchParams.room} />
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-charcoal-light">
            Prefer same-page confirmation? Try the{" "}
            <Link href="/book-alt" className="font-semibold text-maroon hover:underline">
              alternate booking form
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
