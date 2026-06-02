// PLACEHOLDER testimonials — replace with the owners' real guest reviews.
export type Testimonial = {
  name: string;
  location: string;
  rating: number;
  quote: string;
};

export const testimonials: Testimonial[] = [
  {
    name: "Ananya & Rohit",
    location: "Bengaluru, India",
    rating: 5,
    quote:
      "Waking up to mist rolling over the tea gardens was unforgettable. The bungalow feels worlds away from the crowds — exactly what we needed.",
  },
  {
    name: "James Whitfield",
    location: "London, UK",
    rating: 5,
    quote:
      "Impeccable hospitality and a setting that genuinely takes your breath away. The plantation walks were a highlight of our Kerala trip.",
  },
  {
    name: "Meera Nair",
    location: "Kochi, India",
    rating: 5,
    quote:
      "Spotless rooms, warm hosts and home-style Kerala food. The location is peaceful yet close to all the major Munnar attractions.",
  },
  {
    name: "The Fernandes Family",
    location: "Mumbai, India",
    rating: 4,
    quote:
      "Our kids loved the open spaces and the trek to the nearby waterfall. A perfect family getaway in the hills.",
  },
  {
    name: "Sophie Laurent",
    location: "Lyon, France",
    rating: 5,
    quote:
      "A rare blue-flower kind of place — quiet, elegant and surrounded by nature. We are already planning our next stay.",
  },
  {
    name: "Arjun Pillai",
    location: "Chennai, India",
    rating: 5,
    quote:
      "From the cardamom-scented air to the starlit nights, every detail felt curated. Truly far from the maddening crowd.",
  },
];
