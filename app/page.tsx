import Link from "next/link";
import CTACards from "@/components/CTACards";
import RoomCard from "@/components/RoomCard";
import TestimonialCard from "@/components/TestimonialCard";
import { site } from "@/data/site";
import { getActiveRooms } from "@/lib/rooms";
import { testimonials } from "@/data/testimonials";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const rooms = await getActiveRooms();
  return (
    <>
      {/* ---------------------------------------------------------------- */}
      {/* HERO */}
      {/* PLACEHOLDER hero background — swap with a real Munnar/plantation photo */}
      {/* ---------------------------------------------------------------- */}
      <section
        className="relative flex min-h-[88vh] items-center justify-center"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?auto=format&fit=crop&w=1920&q=80)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/50 via-charcoal/40 to-charcoal/70" />
        <div className="relative z-10 animate-fade-up px-5 text-center text-cream-light">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gold-light">
            {site.location}
          </p>
          <h1 className="mt-4 font-serif text-4xl leading-tight text-white drop-shadow sm:text-6xl">
            {site.name}
          </h1>
          <p className="mt-4 font-serif text-2xl italic text-gold-light sm:text-3xl">
            {site.tagline}
          </p>
          <p className="mx-auto mt-2 max-w-xl text-base text-cream-light/85">
            {site.secondaryTagline}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/book" className="btn-gold">Book Online</Link>
            <Link href="/rooms" className="btn-outline !border-cream-light/60 !text-cream-light hover:!border-gold hover:!text-gold">
              Explore Rooms
            </Link>
          </div>
        </div>
      </section>

      {/* Three CTA cards overlapping the hero */}
      <CTACards />

      {/* ---------------------------------------------------------------- */}
      {/* INTRO / ABOUT */}
      {/* ---------------------------------------------------------------- */}
      <section className="container-x py-20">
        <h2 className="section-title-center">{site.name}</h2>
        <p className="mx-auto mt-6 max-w-3xl text-center font-serif text-xl italic text-charcoal-light">
          {site.secondaryTagline}
        </p>
        <div className="mx-auto mt-8 max-w-3xl space-y-6 text-center leading-relaxed text-charcoal-light">
          <p>
            The Neelakurinji is a rare blue flower which blooms once in 12 years
            along the hillocks of Munnar. Its rarity makes it a precious sight.
            At The Neelakurinji Plantation Bungalows, we believe in bringing such
            rarity to the kind of hospitality served in Kerala&apos;s most
            beautiful hill station. Set amidst the browns, greens and blues of
            massive boulders, invigorating hillocks and an open sky, the
            plantation home is your ticket to experience the rare pleasures of
            Munnar from the comfort of a supremely luxurious travel address.
          </p>
          <p>
            A perfect spot of virgin paradise, the plantation home is situated in
            a tourist-friendly stretch of Munnar against the backdrop of hills,
            boulders and cardamom plantations. This helps it radiate the kind of
            millennia old charm which has made Munnar a paradise of sorts among
            travellers worldwide. The property is conveniently located away from
            the town centre, yet is close to several key tourist spots, streaming
            waterfalls and numerous trekking routes. One can spot sprawling fields
            of spice &amp; tea plantations enroute the plantation home.
          </p>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* OUR ROOMS */}
      {/* ---------------------------------------------------------------- */}
      <section className="bg-cream-dark/50 py-20">
        <div className="container-x">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <h2 className="section-title">Our Rooms</h2>
            <Link href="/rooms" className="text-sm font-semibold uppercase tracking-wide text-maroon hover:underline">
              View all accommodation →
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {rooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* TESTIMONIALS PREVIEW */}
      {/* ---------------------------------------------------------------- */}
      <section className="container-x py-20">
        <h2 className="section-title-center">What Our Guests Say</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {testimonials.slice(0, 3).map((t) => (
            <TestimonialCard key={t.name} t={t} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/testimonials" className="btn-outline">Read More Reviews</Link>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* AWARDS / RATINGS */}
      {/* PLACEHOLDER badges — replace with real award artwork when provided */}
      {/* ---------------------------------------------------------------- */}
      <section className="bg-charcoal py-16 text-cream-light">
        <div className="container-x">
          <h2 className="text-center font-serif text-3xl text-white">
            Recognised &amp; Loved
          </h2>
          <span className="mx-auto mt-3 block h-[3px] w-16 rounded bg-gold" />
          <div className="mx-auto mt-10 flex max-w-3xl flex-col items-stretch justify-center gap-6 sm:flex-row">
            {/* Booking.com rating badge — placeholder */}
            <div className="flex flex-1 items-center gap-4 rounded-sm bg-white/5 p-6 ring-1 ring-white/10">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md bg-[#003580] font-serif text-2xl font-bold text-white">
                8.9
              </div>
              <div>
                <p className="font-semibold text-white">Booking.com</p>
                <p className="text-sm text-cream-light/70">Rated 8.9 by our guests</p>
              </div>
            </div>
            {/* 2018 Guest Review Award — placeholder */}
            <div className="flex flex-1 items-center gap-4 rounded-sm bg-white/5 p-6 ring-1 ring-white/10">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gold font-serif text-lg font-bold text-charcoal">
                2018
              </div>
              <div>
                <p className="font-semibold text-white">Guest Review Award</p>
                <p className="text-sm text-cream-light/70">Winner — 2018</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
