import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import BookingWizard from "@/components/booking/BookingWizard";
import { getActiveAddOns, getActiveRooms } from "@/lib/rooms";

export const metadata: Metadata = {
  title: "Book Online",
  description:
    "Reserve your stay at Neelakurunji Luxury Plantation Bungalow, Munnar — choose a room, pick your dates, add extras and pay securely online.",
};

// Reads rooms + add-ons from the DB at request time, so this page is dynamic.
export const dynamic = "force-dynamic";

export default async function BookPage({
  searchParams,
}: {
  searchParams: { room?: string };
}) {
  const [rooms, addOns] = await Promise.all([
    getActiveRooms(),
    getActiveAddOns(),
  ]);

  return (
    <>
      <PageHeader
        title="Book Online"
        subtitle="Choose a room, pick your dates, and confirm your plantation retreat"
      />

      <section className="container-x py-16">
        <BookingWizard
          rooms={rooms}
          addOns={addOns}
          preselectSlug={searchParams.room}
        />
      </section>
    </>
  );
}
