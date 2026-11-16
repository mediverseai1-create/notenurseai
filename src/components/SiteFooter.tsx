import Link from "next/link";
import { Logo } from "./Logo";

const links = [
  ["/product", "Platform"],
  ["/solutions", "Solutions"],
  ["/pricing", "Pricing"],
  ["/about", "About"],
  ["/privacy", "Privacy"],
  ["/terms", "Terms"],
];

export function SiteFooter() {
  return (
    <footer className="bg-ink text-white">
      <div className="container-x flex flex-col gap-8 py-12 md:flex-row md:items-center md:justify-between">
        <Logo dark />
        <nav className="flex flex-wrap gap-x-7 gap-y-3 text-sm text-white/70" aria-label="Footer">
          {links.map(([h, l]) => <Link key={h} href={h} className="hover:text-white">{l}</Link>)}
        </nav>
      </div>
      <div className="border-t border-white/10">
        <p className="container-x py-5 text-xs text-white/50">
          © {new Date().getFullYear()} NoteNurse AI. An independent platform, not affiliated with any other documentation vendor. AI-generated drafts require review and verification by a licensed nurse before entering any record.
        </p>
      </div>
    </footer>
  );
}
