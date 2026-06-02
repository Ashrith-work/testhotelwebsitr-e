import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "The story, family heritage and ecological commitment behind Neelakurunji Luxury Plantation Bungalow in Munnar, Kerala.",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="About Us"
        subtitle="The story behind a rare blue-flower kind of paradise"
      />

      <section className="container-x grid items-center gap-12 py-20 lg:grid-cols-2">
        <div>
          <h2 className="section-title">Our Story</h2>
          <div className="mt-6 space-y-4 leading-relaxed text-charcoal-light">
            <p>
              {/* PLACEHOLDER copy — refine with owner-provided history */}
              Named after the rare Neelakurinji bloom that paints the Munnar
              hillocks blue once every twelve years, our plantation bungalow was
              born from a simple belief: that true luxury lies in rarity, quiet
              and a deep connection to the land.
            </p>
            <p>
              What began as a family plantation home has grown into an intimate
              luxury retreat — yet it remains, at heart, a family endeavour.
              Generations of care for these cardamom and tea slopes shape the
              warmth of the hospitality you will find here.
            </p>
          </div>
        </div>
        <div className="relative h-80 overflow-hidden rounded-sm shadow-lg">
          {/* PLACEHOLDER image — replace with a real property/family photo */}
          <Image
            src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80"
            alt="Plantation landscape near the bungalow"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </section>

      <section className="bg-cream-dark/50 py-20">
        <div className="container-x grid gap-10 md:grid-cols-3">
          {[
            {
              title: "Family Heritage",
              body: "Run by a family with deep roots in Munnar's plantations, every stay is hosted with the personal warmth of a home rather than the formality of a hotel.",
            },
            {
              title: "Ecological Commitment",
              body: "The property is designed to tread lightly — preserving the boulders, native flora and water sources, and built to blend into the landscape it sits within.",
            },
            {
              title: "Aesthetic Philosophy",
              body: "Interiors draw on the browns, greens and blues of Munnar, pairing plantation-style charm with the comforts of contemporary luxury.",
            },
          ].map((c) => (
            <div key={c.title} className="rounded-sm bg-white p-7 shadow-sm ring-1 ring-charcoal/5">
              <h3 className="font-serif text-xl text-maroon">{c.title}</h3>
              <span className="mt-2 block h-[2px] w-10 bg-gold" />
              <p className="mt-4 text-sm leading-relaxed text-charcoal-light">{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-x py-20 text-center">
        <h2 className="section-title-center">Stay With Us</h2>
        <p className="mx-auto mt-6 max-w-2xl leading-relaxed text-charcoal-light">
          Experience {site.shortName} — far from the maddening crowd, yet close
          to everything that makes Munnar unforgettable.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/rooms" className="btn-forest">View Rooms</Link>
          <Link href="/book" className="btn-gold">Book Online</Link>
        </div>
      </section>
    </>
  );
}
