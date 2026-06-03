import Image from "next/image";
import Link from "next/link";
import { formatINR, type RoomView } from "@/lib/pricing";

function capacityLabel(r: RoomView): string {
  const adults = `${r.maxAdults} Adult${r.maxAdults > 1 ? "s" : ""}`;
  if (!r.maxChildren) return adults;
  return `${adults} + ${r.maxChildren} Child${r.maxChildren > 1 ? "ren" : ""}`;
}

export default function RoomCard({ room }: { room: RoomView }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-sm bg-white shadow-sm ring-1 ring-charcoal/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-56 overflow-hidden">
        <Image
          src={room.imageUrl}
          alt={room.name}
          fill
          sizes="(max-width: 768px) 100vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute right-3 top-3 rounded-sm bg-maroon px-3 py-1 text-xs font-semibold text-white">
          {formatINR(room.basePrice)} / night
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-serif text-xl text-charcoal">{room.name}</h3>
        <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-gold-dark">
          {capacityLabel(room)}
        </p>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-charcoal-light">
          {room.description}
        </p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {room.amenities.map((f) => (
            <li
              key={f}
              className="rounded-full bg-cream-dark px-2.5 py-1 text-[11px] font-medium text-charcoal-light"
            >
              {f}
            </li>
          ))}
        </ul>
        <Link href={`/book?room=${room.slug}`} className="btn-forest mt-5 w-full">
          Book This Room
        </Link>
      </div>
    </article>
  );
}
