"use client";

import { useState } from "react";

export default function ContactForm() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // NOTE: No backend yet — wire this up to the owners' email/CRM service.
    setSent(true);
  };

  if (sent) {
    return (
      <div className="rounded-sm border border-forest/30 bg-forest/5 p-8 text-center">
        <h3 className="font-serif text-xl text-forest">Thank you!</h3>
        <p className="mt-2 text-sm text-charcoal-light">
          Your message has been received. We&apos;ll be in touch shortly.
        </p>
        <button type="button" onClick={() => setSent(false)} className="btn-outline mt-6">
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="c-name" className="input-label">Name</label>
        <input id="c-name" name="name" required className="input-field" placeholder="Your name" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="c-email" className="input-label">Email</label>
          <input id="c-email" name="email" type="email" required className="input-field" placeholder="you@example.com" />
        </div>
        <div>
          <label htmlFor="c-phone" className="input-label">Phone</label>
          <input id="c-phone" name="phone" type="tel" className="input-field" placeholder="+91 …" />
        </div>
      </div>
      <div>
        <label htmlFor="c-message" className="input-label">Message</label>
        <textarea id="c-message" name="message" rows={5} required className="input-field" placeholder="How can we help?" />
      </div>
      <button type="submit" className="btn-maroon w-full">Send Message</button>
    </form>
  );
}
