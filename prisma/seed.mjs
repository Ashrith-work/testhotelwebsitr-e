// Seeds the Room and AddOn tables. Idempotent — re-runnable via `npm run db:seed`
// (or `npx prisma db seed`). Rooms are upserted on their unique `slug`.
//
// NOTE: Room + add-on prices below are the REAL tariffs (stored in PAISE).
// They were temporarily lowered to ₹1–₹3 for UPI payment testing and have now
// been restored.
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// rupees → paise
const inr = (rupees) => Math.round(rupees * 100);

const rooms = [
  {
    slug: "deluxe-cottage",
    name: "Deluxe Cottage",
    description:
      "A cosy plantation cottage with private sit-out overlooking the cardamom slopes — warm interiors and uninterrupted hill views.",
    basePrice: inr(7500),
    maxAdults: 2,
    maxChildren: 0,
    imageUrl:
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80",
    amenities: ["Hill view", "Private sit-out", "King bed", "Hot water"],
    sortOrder: 1,
  },
  {
    slug: "premium-suite",
    name: "Premium Suite",
    description:
      "A spacious suite with a separate lounge, large windows framing the boulders and tea gardens, and premium plantation-style furnishing.",
    basePrice: inr(11500),
    maxAdults: 2,
    maxChildren: 1,
    imageUrl:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
    amenities: ["Panoramic view", "Lounge area", "Mini bar", "Premium linen"],
    sortOrder: 2,
  },
  {
    slug: "family-villa",
    name: "Family Villa",
    description:
      "A two-bedroom villa ideal for families, with a shared living space and a generous verandah to soak in the open Munnar sky.",
    basePrice: inr(15500),
    maxAdults: 4,
    maxChildren: 2,
    imageUrl:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    amenities: ["2 Bedrooms", "Living room", "Verandah", "Family friendly"],
    sortOrder: 3,
  },
  {
    slug: "plantation-suite",
    name: "Plantation Suite",
    description:
      "Our signature suite — the most private retreat on the property, surrounded by spice plantations with a luxurious soaking experience.",
    basePrice: inr(18500),
    maxAdults: 2,
    maxChildren: 0,
    imageUrl:
      "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80",
    amenities: ["Most private", "Plantation view", "Luxury bath", "Butler service"],
    sortOrder: 4,
  },
];

const addOns = [
  {
    name: "Ayurvedic Spa Package",
    description:
      "A rejuvenating traditional Kerala Ayurvedic massage and therapy session, per guest.",
    price: inr(2500),
    pricingType: "per_person",
    imageUrl:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Candlelight Dinner",
    description:
      "A private candlelight dinner for the room, set amidst the plantation under the Munnar sky.",
    price: inr(3500),
    pricingType: "per_booking",
    imageUrl:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Plantation Jeep Safari",
    description:
      "A guided off-road jeep safari through the surrounding tea and cardamom estates, per guest.",
    price: inr(1800),
    pricingType: "per_person",
    imageUrl:
      "https://images.unsplash.com/photo-1533873984035-25970ab07461?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Airport Pickup & Drop",
    description:
      "Comfortable private transfer between Cochin International Airport and the property.",
    price: inr(4500),
    pricingType: "per_booking",
    imageUrl:
      "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1200&q=80",
  },
];

async function main() {
  for (const room of rooms) {
    await prisma.room.upsert({
      where: { slug: room.slug },
      update: room,
      create: room,
    });
  }
  console.log(`Seeded ${rooms.length} rooms.`);

  // AddOns have no natural unique key; reset and re-create so seeding stays
  // idempotent (safe here — add-ons are reference data, not user records).
  await prisma.addOn.deleteMany();
  await prisma.addOn.createMany({ data: addOns });
  console.log(`Seeded ${addOns.length} add-ons.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
