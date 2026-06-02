"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { site, navItems } from "@/data/site";
import {
  HomeIcon,
  SearchIcon,
  MenuIcon,
  CloseIcon,
} from "@/components/icons";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={`sticky top-0 z-50 bg-cream-light/95 backdrop-blur transition-shadow ${
        scrolled ? "shadow-md" : "shadow-sm"
      }`}
    >
      <nav className="container-x flex items-center justify-between gap-4 py-3">
        {/* Logo (left) — PLACEHOLDER at /public/logo.png, owners will replace */}
        <Link href="/" className="flex shrink-0 items-center gap-3" aria-label={site.name}>
          <Image
            src="/logo.png"
            alt={`${site.shortName} logo`}
            width={150}
            height={50}
            priority
            className="h-11 w-auto"
          />
          <span className="hidden flex-col leading-none lg:flex">
            <span className="font-serif text-base text-maroon">{site.shortName}</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-gold-dark">
              {site.tagline}
            </span>
          </span>
        </Link>

        {/* Menu (center) — desktop */}
        <ul className="hidden items-center gap-5 xl:flex">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={
                  item.cta
                    ? "btn-maroon !px-4 !py-2 !text-xs"
                    : `flex items-center gap-1 text-[13px] font-semibold uppercase tracking-wide transition-colors ${
                        isActive(item.href)
                          ? "text-maroon"
                          : "text-charcoal hover:text-maroon"
                      }`
                }
              >
                {item.home && <HomeIcon className="h-4 w-4" />}
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right side: search + mobile toggle */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Search"
            onClick={() => setSearchOpen((v) => !v)}
            className="rounded-full p-2 text-charcoal transition-colors hover:bg-maroon/10 hover:text-maroon"
          >
            <SearchIcon className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="rounded-full p-2 text-charcoal transition-colors hover:bg-maroon/10 hover:text-maroon xl:hidden"
          >
            {mobileOpen ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Search bar (toggle) */}
      {searchOpen && (
        <div className="border-t border-charcoal/10 bg-cream-light">
          <form
            className="container-x flex items-center gap-2 py-3"
            onSubmit={(e) => e.preventDefault()}
            role="search"
          >
            <SearchIcon className="h-5 w-5 text-charcoal-light" />
            <input
              autoFocus
              type="search"
              placeholder="Search the site…"
              className="input-field !py-2"
            />
          </form>
        </div>
      )}

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-charcoal/10 bg-cream-light xl:hidden">
          <ul className="container-x flex flex-col py-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-2 border-b border-charcoal/5 py-3 text-sm font-semibold uppercase tracking-wide ${
                    isActive(item.href) ? "text-maroon" : "text-charcoal"
                  }`}
                >
                  {item.home && <HomeIcon className="h-4 w-4" />}
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
