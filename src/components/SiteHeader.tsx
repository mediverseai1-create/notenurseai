"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";

const links = [
  { href: "/product", label: "Product" },
  { href: "/solutions", label: "Solutions" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader({ dark = false }: { dark?: boolean }) {
  const [open, setOpen] = useState(false);
  const text = dark ? "text-white" : "text-ink";
  return (
    <header className={`relative z-30 ${dark ? "bg-ink" : "bg-paper border-b border-line"}`}>
      <div className="container-x flex h-16 items-center justify-between">
        <Logo dark={dark} />
        <nav className={`hidden items-center gap-8 text-sm md:flex ${text}`} aria-label="Primary">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="opacity-80 transition hover:opacity-100">{l.label}</Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <Link href="/login" className={`text-sm ${text} opacity-80 hover:opacity-100`}>Log in</Link>
          <Link href="/signup" className="btn-primary">Start free trial</Link>
        </div>
        <button className={`md:hidden ${text}`} onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open}>
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="absolute inset-x-0 top-16 border-t border-line bg-paper p-5 shadow-lg md:hidden">
          <nav className="flex flex-col gap-4 text-ink" aria-label="Mobile">
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}</Link>
            ))}
            <Link href="/login" onClick={() => setOpen(false)}>Log in</Link>
            <Link href="/signup" className="btn-primary" onClick={() => setOpen(false)}>Start free trial</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
