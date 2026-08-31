"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/CartContext";

function WireSquiggle() {
  return (
    <svg viewBox="0 0 100 10" preserveAspectRatio="none">
      <path
        d="M0,5 C10,0 15,10 25,5 C35,0 40,10 50,5 C60,0 65,10 75,5 C85,0 90,10 100,5"
        fill="none"
        stroke="#C99A4B"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

const links = [
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/checkout", label: "Custom Order" },
];

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
      {open ? (
        <path
          d="M6 6l12 12M18 6L6 18"
          stroke="#3D5A45"
          strokeWidth="2"
          strokeLinecap="round"
        />
      ) : (
        <>
          <path d="M4 7h16" stroke="#3D5A45" strokeWidth="2" strokeLinecap="round" />
          <path d="M4 12h16" stroke="#3D5A45" strokeWidth="2" strokeLinecap="round" />
          <path d="M4 17h16" stroke="#3D5A45" strokeWidth="2" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

export default function Header() {
  const { itemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-green/10 bg-bg/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="wire-underline group" onClick={() => setMenuOpen(false)}>
          <span className="font-display text-2xl text-green">Blume</span>
          <span className="font-hand ml-1 text-xl text-rose">by Binu</span>
          <WireSquiggle />
        </Link>

        <nav className="hidden gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="wire-underline font-body text-sm uppercase tracking-wide text-ink"
            >
              {link.label}
              <WireSquiggle />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/cart"
            className="relative font-body text-sm font-medium text-green"
            aria-label={`Cart, ${itemCount} item${itemCount === 1 ? "" : "s"}`}
          >
            Cart
            {itemCount > 0 && (
              <span className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-rose text-xs text-white">
                {itemCount}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            <MenuIcon open={menuOpen} />
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="flex flex-col gap-1 border-t border-green/10 bg-bg px-6 py-4 md:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-2 py-3 font-body text-sm uppercase tracking-wide text-ink hover:bg-green/5"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
