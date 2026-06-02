// Room data. NOTE: names, prices and descriptions are PLACEHOLDERS using the
// generic names requested. Swap in the real room details + photos when the
// owners provide them (replace `image` with a local /public path).
export type Room = {
  slug: string;
  name: string;
  price: number; // INR per night
  capacity: string;
  description: string;
  features: string[];
  image: string;
};

export const rooms: Room[] = [
  {
    slug: "deluxe-cottage",
    name: "Deluxe Cottage",
    price: 7500,
    capacity: "2 Adults",
    description:
      "A cosy plantation cottage with private sit-out overlooking the cardamom slopes — warm interiors and uninterrupted hill views.",
    features: ["Hill view", "Private sit-out", "King bed", "Hot water"],
    // PLACEHOLDER IMAGE — replace with real room photo
    image:
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "premium-suite",
    name: "Premium Suite",
    price: 11500,
    capacity: "2 Adults + 1 Child",
    description:
      "A spacious suite with a separate lounge, large windows framing the boulders and tea gardens, and premium plantation-style furnishing.",
    features: ["Panoramic view", "Lounge area", "Mini bar", "Premium linen"],
    // PLACEHOLDER IMAGE — replace with real room photo
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "family-villa",
    name: "Family Villa",
    price: 15500,
    capacity: "4 Adults + 2 Children",
    description:
      "A two-bedroom villa ideal for families, with a shared living space and a generous verandah to soak in the open Munnar sky.",
    features: ["2 Bedrooms", "Living room", "Verandah", "Family friendly"],
    // PLACEHOLDER IMAGE — replace with real room photo
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "plantation-suite",
    name: "Plantation Suite",
    price: 18500,
    capacity: "2 Adults",
    description:
      "Our signature suite — the most private retreat on the property, surrounded by spice plantations with a luxurious soaking experience.",
    features: ["Most private", "Plantation view", "Luxury bath", "Butler service"],
    // PLACEHOLDER IMAGE — replace with real room photo
    image:
      "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80",
  },
];
