import type { Testimonial } from "@/data/testimonials";
import { StarIcon } from "@/components/icons";

export default function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <figure className="flex h-full flex-col rounded-sm bg-white p-6 shadow-sm ring-1 ring-charcoal/5">
      <div className="flex gap-0.5 text-gold">
        {Array.from({ length: 5 }).map((_, i) => (
          <StarIcon
            key={i}
            className={`h-4 w-4 ${i < t.rating ? "text-gold" : "text-charcoal/15"}`}
          />
        ))}
      </div>
      <blockquote className="mt-4 flex-1 font-serif text-lg italic leading-relaxed text-charcoal">
        “{t.quote}”
      </blockquote>
      <figcaption className="mt-5 border-t border-charcoal/10 pt-4">
        <span className="block text-sm font-semibold text-maroon">{t.name}</span>
        <span className="block text-xs uppercase tracking-wide text-charcoal-light">
          {t.location}
        </span>
      </figcaption>
    </figure>
  );
}
