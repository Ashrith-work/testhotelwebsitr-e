import type { Metadata } from "next";
import Image from "next/image";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Recreation",
  description:
    "Trekking, plantation walks, bird watching, spa, places to visit and proximal activities at Neelakurunji, Munnar.",
};

type Activity = {
  id: string;
  title: string;
  body: string;
  image: string;
};

const activities: Activity[] = [
  {
    id: "trekking",
    title: "Trekking & Adventures",
    body: "Set out on guided treks through misty shola forests and rolling tea slopes. Routes range from gentle morning walks to half-day climbs with sweeping valley views.",
    image:
      "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "walks",
    title: "Plantation Walks",
    body: "Stroll through fragrant cardamom and spice plantations with our hosts, learning how Munnar's famed produce is grown, harvested and cured.",
    image:
      "https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "birding",
    title: "Bird Watching",
    body: "The hillocks around the bungalow are alive with endemic Western Ghats species. Early mornings reward patient watchers with rare sightings.",
    image:
      "https://images.unsplash.com/photo-1452570053594-1b985d6ea890?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "spa",
    title: "SPA: Paradise Point",
    body: "Unwind with traditional Kerala therapies at Paradise Point — Ayurvedic massages and treatments designed to restore body and mind after a day in the hills.",
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "places",
    title: "Places to Visit",
    body: "Eravikulam National Park, Mattupetty Dam, Top Station, Tea Museum and the famed Neelakurinji blooms are all within easy reach of the property.",
    image:
      "https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "proximal",
    title: "Proximal Activities",
    body: "Streaming waterfalls, viewpoints and village experiences sit just a short drive away — perfect for unhurried day trips around the region.",
    image:
      "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80",
  },
];

export default function RecreationPage() {
  return (
    <>
      <PageHeader
        title="Recreation"
        subtitle="Adventures, leisure and quiet pleasures across the Munnar hills"
      />

      <section className="container-x py-20">
        <div className="grid gap-12">
          {activities.map((a, i) => (
            <article
              id={a.id}
              key={a.id}
              className={`grid scroll-mt-24 items-center gap-8 lg:grid-cols-2 ${
                i % 2 === 1 ? "lg:[&>div:first-child]:order-2" : ""
              }`}
            >
              <div className="relative h-72 overflow-hidden rounded-sm shadow-lg">
                {/* PLACEHOLDER image — replace with real activity photo */}
                <Image
                  src={a.image}
                  alt={a.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div>
                <h2 className="section-title">{a.title}</h2>
                <p className="mt-6 leading-relaxed text-charcoal-light">{a.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
