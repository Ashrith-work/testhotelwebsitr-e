import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import ContactForm from "@/components/ContactForm";
import { site } from "@/data/site";
import {
  PhoneIcon,
  MapPinIcon,
  MailIcon,
  FacebookIcon,
  YoutubeIcon,
} from "@/components/icons";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Neelakurunji Luxury Plantation Bungalow, Munnar — address, phone numbers and enquiry form.",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        title="Contact"
        subtitle="We would be delighted to help plan your stay in Munnar"
      />

      <section className="container-x grid gap-12 py-20 lg:grid-cols-2">
        {/* Contact details */}
        <div>
          <h2 className="section-title">Get In Touch</h2>

          <div className="mt-8 space-y-6">
            <div className="flex gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-maroon/10 text-maroon">
                <MapPinIcon className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold text-charcoal">Address</p>
                <p className="text-sm leading-relaxed text-charcoal-light">{site.address}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-maroon/10 text-maroon">
                <PhoneIcon className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold text-charcoal">Phone</p>
                <ul className="text-sm text-charcoal-light">
                  {site.phones.map((p) => (
                    <li key={p}>
                      <a href={`tel:${p.replace(/\s/g, "")}`} className="hover:text-maroon">
                        {p}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-maroon/10 text-maroon">
                <MailIcon className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold text-charcoal">Follow Us</p>
                <div className="mt-2 flex gap-3">
                  {/* PLACEHOLDER social links — update in data/site.ts */}
                  <a
                    href={site.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-maroon text-white transition-colors hover:bg-maroon-dark"
                  >
                    <FacebookIcon />
                  </a>
                  <a
                    href={site.social.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="YouTube"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-maroon text-white transition-colors hover:bg-maroon-dark"
                  >
                    <YoutubeIcon />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Embedded map placeholder */}
          {/* PLACEHOLDER — replace with a real Google Maps <iframe> embed.
              Example:
              <iframe src="https://www.google.com/maps/embed?pb=..." ... />
          */}
          <div className="mt-8 flex h-56 items-center justify-center rounded-sm border border-dashed border-charcoal/25 bg-cream-dark/40 text-center text-sm text-charcoal-light">
            <span>
              📍 Google Maps embed placeholder
              <br />
              (Replace with the property&apos;s Google Maps iframe)
            </span>
          </div>
        </div>

        {/* Enquiry form */}
        <div>
          <h2 className="section-title">Send a Message</h2>
          <div className="mt-8">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
