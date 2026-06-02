import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import TestimonialCard from "@/components/TestimonialCard";
import { testimonials } from "@/data/testimonials";

export const metadata: Metadata = {
  title: "Testimonials",
  description:
    "Read what guests say about their stay at Neelakurunji Luxury Plantation Bungalow, Munnar.",
};

export default function TestimonialsPage() {
  return (
    <>
      <PageHeader
        title="Testimonials"
        subtitle="In the words of guests who found their paradise far from the crowd"
      />

      <section className="container-x py-20">
        {/* PLACEHOLDER reviews — replace with real guest testimonials */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <TestimonialCard key={t.name} t={t} />
          ))}
        </div>

        <div className="mt-16 rounded-sm bg-cream-dark/60 p-10 text-center">
          <h2 className="font-serif text-2xl text-charcoal">Stayed with us?</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-charcoal-light">
            We would love to hear about your experience. Share your story and
            help future travellers discover Neelakurunji.
          </p>
          <Link href="/contact" className="btn-maroon mt-6">Share Your Review</Link>
        </div>
      </section>
    </>
  );
}
