import { site } from "@/data/site";
import { MapPinIcon, PhoneIcon } from "@/components/icons";

// Slim maroon strip above the navigation: location on the left, phones on the right.
export default function TopStrip() {
  return (
    <div className="bg-maroon text-cream-light">
      <div className="container-x flex h-9 items-center justify-between text-[11px] font-medium uppercase tracking-[0.15em]">
        <span className="flex items-center gap-1.5">
          <MapPinIcon className="h-3.5 w-3.5" />
          {site.location}
        </span>
        <a
          href={`tel:${site.phones[0].replace(/\s/g, "")}`}
          className="hidden items-center gap-1.5 transition-colors hover:text-white sm:flex"
        >
          <PhoneIcon className="h-3.5 w-3.5" />
          {site.phones[0]}
        </a>
      </div>
    </div>
  );
}
