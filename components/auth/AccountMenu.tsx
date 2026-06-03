"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";

export type NavUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

// Right-hand nav auth control: a "Sign In" button when logged out, or the
// Google profile picture with a dropdown (Account, My Bookings, Sign Out).
export default function AccountMenu({ user }: { user: NavUser | null }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  if (!user) {
    return (
      <Link
        href="/signin"
        className="hidden items-center gap-2 rounded-sm border border-charcoal/20 px-3 py-2 text-[13px] font-semibold uppercase tracking-wide text-charcoal transition-colors hover:border-maroon hover:text-maroon sm:inline-flex"
      >
        Sign In
      </Link>
    );
  }

  const initial = (user.name || user.email || "?").charAt(0).toUpperCase();

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Account menu"
        aria-expanded={open}
        className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full ring-1 ring-charcoal/15 transition hover:ring-maroon"
      >
        {user.image ? (
          <Image
            src={user.image}
            alt={user.name || "Profile"}
            width={36}
            height={36}
            className="h-9 w-9 object-cover"
          />
        ) : (
          <span className="flex h-9 w-9 items-center justify-center bg-maroon text-sm font-semibold text-white">
            {initial}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-sm bg-white shadow-lg ring-1 ring-charcoal/10">
          <div className="border-b border-charcoal/10 px-4 py-3">
            <p className="truncate text-sm font-semibold text-charcoal">
              {user.name || "Guest"}
            </p>
            {user.email && (
              <p className="truncate text-xs text-charcoal-light">{user.email}</p>
            )}
          </div>
          <Link
            href="/account"
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 text-sm text-charcoal hover:bg-cream"
          >
            Account
          </Link>
          <Link
            href="/account#bookings"
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 text-sm text-charcoal hover:bg-cream"
          >
            My Bookings
          </Link>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="block w-full border-t border-charcoal/10 px-4 py-2.5 text-left text-sm text-maroon hover:bg-maroon/5"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
