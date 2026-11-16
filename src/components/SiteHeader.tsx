"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";

const links = [
  { href: "/product", label: "Platform" },
  { href: "/solutions", label: "Solutions" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
];

export function SiteHeader({ dark = false }: { dark?: boolean }) {
  const [open, setOpen] = useState(false);
  const text = dark ? "text-white" : "text-ink";
  return (
    <header className={`relative z-30 ${dark ? "bg-ink" : "border-b border-line bg-paper"}`}>
      <div className="container-x flex h-16 items-center justify-between">
        <Logo dark={dark} />
        <nav className={`hidden items-center gap-9 text-sm md:flex ${text}`} aria-label="Primary">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="opacity-80 transition hover:opacity-100">{l.label}</Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <Link href="/login" className={dark ? "btn-ghost-dark" : "btn-ghost"}>Log in</Link>
          <Link href="/signup" className="btn-primary">Sign up</Link>
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
            <Link href="/login" className="btn-ghost" onClick={() => setOpen(false)}>Log in</Link>
            <Link href="/signup" className="btn-primary" onClick={() => setOpen(false)}>Sign up</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
