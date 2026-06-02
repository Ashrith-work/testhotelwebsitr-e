import type { Metadata } from "next";
import Image from "next/image";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "A glimpse of Neelakurunji Luxury Plantation Bungalow — rooms, plantations and the Munnar landscape.",
};

// PLACEHOLDER gallery — replace these Unsplash URLs with real photos.
// Each item can also be a local /public path once photos are provided.
const photos = [
  { src: "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?auto=format&fit=crop&w=900&q=80", alt: "Munnar tea hills" },
  { src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80", alt: "Misty valley" },
  { src: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=900&q=80", alt: "Luxury room interior" },
  { src: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80", alt: "Suite with a view" },
  { src: "https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=900&q=80", alt: "Hill viewpoint" },
  { src: "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=900&q=80", alt: "Trekking trail" },
  { src: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=900&q=80", alt: "Waterfall" },
  { src: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80", alt: "Family villa" },
  { src: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=900&q=80", alt: "Spa treatment" },
  { src: "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=900&q=80", alt: "Plantation suite" },
  { src: "https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?auto=format&fit=crop&w=900&q=80", alt: "Cardamom plantation" },
  { src: "https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=900&q=80", alt: "Sunrise over the hills" },
];

export default function GalleryPage() {
  return (
    <>
      <PageHeader
        title="Gallery"
        subtitle="Moments from the plantation, the rooms and the hills around us"
      />

      <section className="container-x py-20">
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {photos.map((p, i) => (
            <div
              key={i}
              className="group relative mb-4 break-inside-avoid overflow-hidden rounded-sm shadow-sm ring-1 ring-charcoal/5"
            >
              <Image
                src={p.src}
                alt={p.alt}
                width={900}
                height={i % 3 === 0 ? 1100 : 700}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 bg-charcoal/0 transition-colors duration-300 group-hover:bg-charcoal/20" />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
