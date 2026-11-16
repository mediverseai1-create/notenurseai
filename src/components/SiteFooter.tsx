import Link from "next/link";
import { Logo } from "./Logo";

export function SiteFooter() {
  return (
    <footer className="bg-ink text-white">
      <div className="container-x grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo dark />
          <p className="mt-4 max-w-sm text-sm text-white/60">
            Draft nursing documentation from the conversation. Every line linked to its source, every note verified by a nurse.
          </p>
        </div>
        <div>
          <p className="eyebrow !text-white/50">Product</p>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            <li><Link href="/product">How it works</Link></li>
            <li><Link href="/solutions">Solutions</Link></li>
            <li><Link href="/pricing">Pricing</Link></li>
          </ul>
        </div>
        <div>
          <p className="eyebrow !text-white/50">Company</p>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            <li><Link href="/about">About</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/privacy">Privacy</Link></li>
            <li><Link href="/terms">Terms</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="container-x py-5 text-xs text-white/50">
          © {new Date().getFullYear()} NoteNurse AI. NoteNurse AI is an independent product and is not affiliated with any other documentation vendor. Drafts are not medical advice and must be reviewed by a licensed nurse before use in any record.
        </p>
      </div>
    </footer>
  );
}
