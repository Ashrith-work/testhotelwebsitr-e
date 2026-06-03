// Server-side data access for rooms + add-ons, mapping Prisma rows to the
// serializable view types consumed by both server components and the client
// BookingWizard. Server-only (imports lib/prisma).
import { prisma } from "@/lib/prisma";
import type { AddOnView, PricingType, RoomView } from "@/lib/pricing";

function toRoomView(room: {
  id: string;
  slug: string;
  name: string;
  description: string;
  basePrice: number;
  maxAdults: number;
  maxChildren: number;
  imageUrl: string;
  amenities: unknown;
}): RoomView {
  return {
    id: room.id,
    slug: room.slug,
    name: room.name,
    description: room.description,
    basePrice: room.basePrice,
    maxAdults: room.maxAdults,
    maxChildren: room.maxChildren,
    imageUrl: room.imageUrl,
    // amenities is a JSON column (SQLite); normalise to a string[].
    amenities: Array.isArray(room.amenities)
      ? (room.amenities as unknown[]).map(String)
      : [],
  };
}

export async function getActiveRooms(): Promise<RoomView[]> {
  const rooms = await prisma.room.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
  return rooms.map(toRoomView);
}

export async function getActiveAddOns(): Promise<AddOnView[]> {
  const addOns = await prisma.addOn.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "asc" },
  });
  return addOns.map((a) => ({
    id: a.id,
    name: a.name,
    description: a.description,
    price: a.price,
    pricingType: a.pricingType as PricingType,
    imageUrl: a.imageUrl,
  }));
}
