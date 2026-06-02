import Link from "next/link";
import { site } from "@/data/site";
import {
  FacebookIcon,
  YoutubeIcon,
  TwitterIcon,
  PinterestIcon,
  RssIcon,
  PhoneIcon,
  MapPinIcon,
} from "@/components/icons";

const importantLinks = [
  { label: "About Us", href: "/about" },
  { label: "Recreation", href: "/recreation" },
  { label: "Proximal Activities", href: "/recreation#proximal" },
  { label: "Trekking", href: "/recreation#trekking" },
  { label: "Places to Visit", href: "/recreation#places" },
  { label: "SPA: Paradise Point", href: "/recreation#spa" },
  { label: "Accommodation", href: "/rooms" },
  { label: "Rooms", href: "/rooms" },
  { label: "Tariff", href: "/rooms#tariff" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
  { label: "Book Online", href: "/book" },
];

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="relative mb-5 font-serif text-lg text-cream-light after:mt-2 after:block after:h-[2px] after:w-10 after:bg-gold">
      {children}
    </h3>
  );
}

// Reusable badge placeholder for awards (Booking.com / TripAdvisor / etc.)
function AwardBadge({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    // PLACEHOLDER award badge — replace with the real award image when provided
    <div className="flex items-center gap-3 rounded-sm border border-cream-light/15 bg-white/5 px-3 py-2">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold font-serif text-sm font-bold text-charcoal">
        {title}
      </div>
      <span className="text-xs leading-tight text-cream-light/80">{subtitle}</span>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-charcoal text-cream-light/80">
      <div className="container-x grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        {/* Column 1: Important Links */}
        <div>
          <FooterHeading>Important Links</FooterHeading>
          <ul className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2 lg:grid-cols-1">
            {importantLinks.map((l) => (
              <li key={l.label}>
                <Link
                  href={l.href}
                  className="transition-colors hover:text-gold"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 2: About Us */}
        <div>
          <FooterHeading>About Us</FooterHeading>
          <p className="text-sm leading-relaxed text-cream-light/75">
            The Neelakurunji Luxury Plantation Bungalow is designed around an
            ecological and aesthetic philosophy — built to tread lightly on the
            land, blending into the boulders, cardamom slopes and open skies of
            Munnar while offering supremely comfortable, sustainable luxury.
          </p>
          <div className="mt-6 space-y-3">
            <FooterHeading>Awards</FooterHeading>
            <AwardBadge title="8.9" subtitle="Booking.com — Rated by guests" />
            <AwardBadge title="TA" subtitle="TripAdvisor — Top-Rated On" />
            <AwardBadge title="2018" subtitle="Certificate of Excellence" />
          </div>
        </div>

        {/* Column 3: Contact info */}
        <div>
          <FooterHeading>Contact</FooterHeading>
          <p className="flex gap-2 text-sm leading-relaxed">
            <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
            <span>{site.address}</span>
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            {site.phones.map((p) => (
              <li key={p}>
                <a
                  href={`tel:${p.replace(/\s/g, "")}`}
                  className="flex items-center gap-2 transition-colors hover:text-gold"
                >
                  <PhoneIcon className="h-4 w-4 text-gold" />
                  {p}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: Follow Us */}
        <div>
          <FooterHeading>Follow Us</FooterHeading>
          <div className="flex gap-3">
            {/* PLACEHOLDER social links — replace hrefs in data/site.ts */}
            <a
              href={site.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-cream-light transition-colors hover:bg-gold hover:text-charcoal"
            >
              <FacebookIcon />
            </a>
            <a
              href={site.social.youtube}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-cream-light transition-colors hover:bg-gold hover:text-charcoal"
            >
              <YoutubeIcon />
            </a>
          </div>
          <p className="mt-6 text-sm leading-relaxed text-cream-light/60">
            Stay in touch for seasonal offers, the Neelakurinji bloom calendar
            and travel tips for your Munnar getaway.
          </p>
        </div>
      </div>

      {/* Bottom strip */}
      <div className="border-t border-cream-light/10 bg-charcoal-light/30">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-4 text-xs text-cream-light/60 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            <a href="#" aria-label="RSS" className="transition-colors hover:text-gold">
              <RssIcon />
            </a>
            <a href="#" aria-label="Pinterest" className="transition-colors hover:text-gold">
              <PinterestIcon />
            </a>
            <a
              href={site.social.facebook}
              aria-label="Facebook"
              className="transition-colors hover:text-gold"
            >
              <FacebookIcon />
            </a>
            <a href="#" aria-label="Twitter" className="transition-colors hover:text-gold">
              <TwitterIcon />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
