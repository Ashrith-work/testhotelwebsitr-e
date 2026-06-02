import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import BookingForm from "@/components/BookingForm";

export const metadata: Metadata = {
  title: "Book Online (Alternate)",
  description:
    "Alternate booking form for Neelakurunji — confirms on the same page (used to test HotelTrack in-page conversion detection).",
};

// Same booking form, but confirmation renders in-place (no redirect). This
// exists to exercise HotelTrack's same-page conversion detection alongside the
// redirect-based /book → /thank-you flow.
export default function BookAltPage({
  searchParams,
}: {
  searchParams: { room?: string };
}) {
  return (
    <>
      <PageHeader
        title="Book Online"
        subtitle="Same-page confirmation booking form"
      />

      <section className="container-x py-20">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-sm bg-white p-8 shadow-sm ring-1 ring-charcoal/5 sm:p-10">
            <h2 className="section-title">Booking Request</h2>
            <p className="mt-4 text-sm text-charcoal-light">
              Fill in your details below. Your confirmation will appear right
              here on submit.
            </p>
            <div className="mt-8">
              <BookingForm mode="inline" defaultRoom={searchParams.room} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
