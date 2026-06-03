import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import RoomCard from "@/components/RoomCard";
import { getActiveRooms } from "@/lib/rooms";
import { formatINR } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Accommodation",
  description:
    "Explore the rooms, suites and villas at Neelakurunji Luxury Plantation Bungalow, Munnar — with tariffs and online booking.",
};

export const dynamic = "force-dynamic";

function capacityLabel(r: { maxAdults: number; maxChildren: number }): string {
  const adults = `${r.maxAdults} Adult${r.maxAdults > 1 ? "s" : ""}`;
  if (!r.maxChildren) return adults;
  return `${adults} + ${r.maxChildren} Child${r.maxChildren > 1 ? "ren" : ""}`;
}

export default async function RoomsPage() {
  const rooms = await getActiveRooms();
  return (
    <>
      <PageHeader
        title="Accommodation"
        subtitle="Supremely comfortable plantation-style rooms, suites and villas"
      />

      <section className="container-x py-20">
        <h2 className="section-title-center">Our Rooms</h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      </section>

      {/* Tariff table */}
      <section id="tariff" className="scroll-mt-24 bg-cream-dark/50 py-20">
        <div className="container-x">
          <h2 className="section-title-center">Tariff</h2>
          <p className="mt-4 text-center text-sm text-charcoal-light">
            {/* PLACEHOLDER pricing — confirm seasonal rates with the owners */}
            Indicative rates per night. Taxes extra. Seasonal &amp; festival
            rates may vary.
          </p>
          <div className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-sm bg-white shadow-sm ring-1 ring-charcoal/5">
            <table className="w-full text-left text-sm">
              <thead className="bg-maroon text-cream-light">
                <tr>
                  <th className="px-5 py-3 font-semibold">Room Type</th>
                  <th className="px-5 py-3 font-semibold">Occupancy</th>
                  <th className="px-5 py-3 text-right font-semibold">Rate / Night</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {rooms.map((r, i) => (
                  <tr key={r.slug} className={i % 2 ? "bg-cream/40" : "bg-white"}>
                    <td className="px-5 py-4 font-medium text-charcoal">{r.name}</td>
                    <td className="px-5 py-4 text-charcoal-light">{capacityLabel(r)}</td>
                    <td className="px-5 py-4 text-right font-semibold text-maroon">
                      {formatINR(r.basePrice)}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/book?room=${r.slug}`}
                        className="text-xs font-semibold uppercase tracking-wide text-forest hover:underline"
                      >
                        Book →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-10 text-center">
            <Link href="/book" className="btn-gold">Book Online</Link>
          </div>
        </div>
      </section>
    </>
  );
}
