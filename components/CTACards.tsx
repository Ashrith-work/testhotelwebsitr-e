import Link from "next/link";
import { ChevronRightIcon } from "@/components/icons";

const cards = [
  {
    eyebrow: "ACCOMODATION",
    title: "Rooms",
    href: "/rooms",
    // PLACEHOLDER IMAGE — replace with real photo
    image:
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1000&q=80",
  },
  {
    eyebrow: "TREKKING",
    title: "Adventures",
    href: "/recreation#trekking",
    // PLACEHOLDER IMAGE — replace with real photo
    image:
      "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1000&q=80",
  },
  {
    eyebrow: "PLACES TO VISIT",
    title: "Leisure",
    href: "/recreation#places",
    // PLACEHOLDER IMAGE — replace with real photo
    image:
      "https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=1000&q=80",
  },
];

// Three call-to-action cards that sit just below the hero, each with a
// semi-transparent dark overlay on a background image.
export default function CTACards() {
  return (
    <section className="relative z-10 -mt-20 px-5">
      <div className="mx-auto grid max-w-container gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.eyebrow}
            href={c.href}
            className="group relative flex h-48 items-end overflow-hidden rounded-sm shadow-xl"
            style={{ backgroundImage: `url(${c.image})`, backgroundSize: "cover", backgroundPosition: "center" }}
          >
            {/* semi-transparent dark overlay */}
            <div className="absolute inset-0 bg-charcoal/55 transition-colors duration-300 group-hover:bg-charcoal/40" />
            <div className="relative z-10 w-full p-6 text-cream-light">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-light">
                {c.eyebrow}
              </p>
              <h3 className="mt-1 flex items-center gap-2 font-serif text-2xl text-white">
                {c.title}
                <ChevronRightIcon className="h-5 w-5 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
