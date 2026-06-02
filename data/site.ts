// Central place for hotel contact details + navigation so every page/footer
// stays in sync. Edit here to update site-wide.
export const site = {
  name: "Neelakurunji Luxury Plantation Bungalow",
  shortName: "Neelakurunji",
  tagline: "Blossoming Paradise",
  secondaryTagline: "…far from the maddening crowd",
  location: "MUNNAR, KERALA",
  address:
    "Venadu, Muttukad-Periakanal Road, Chinnakkanal P.O., Munnar, Kerala - 685 618",
  phones: ["+91 8330001414", "+91 8086491414", "+91 9946451558"],
  social: {
    facebook: "https://facebook.com", // PLACEHOLDER — replace with real page
    youtube: "https://youtube.com", // PLACEHOLDER — replace with real channel
  },
};

export const navItems = [
  { label: "HOME", href: "/", home: true },
  { label: "ABOUT US", href: "/about" },
  { label: "RECREATION", href: "/recreation" },
  { label: "ACCOMODATION", href: "/rooms" },
  { label: "TESTIMONIALS", href: "/testimonials" },
  { label: "GALLERY", href: "/gallery" },
  { label: "CONTACT", href: "/contact" },
  { label: "BOOK ONLINE", href: "/book", cta: true },
];
