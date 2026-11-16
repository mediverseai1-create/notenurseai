import Link from "next/link";

export function Logo({ dark = false, href = "/" }: { dark?: boolean; href?: string }) {
  return (
    <Link href={href} className={`inline-flex items-baseline gap-1.5 text-[17px] tracking-[0.18em] ${dark ? "text-white" : "text-ink"}`} aria-label="NoteNurse AI home">
      <span className="font-medium">NOTENURSE</span>
      <span className="text-[11px] font-semibold tracking-[0.2em] text-signal">AI</span>
    </Link>
  );
}
