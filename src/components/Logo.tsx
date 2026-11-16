import Link from "next/link";

export function Logo({ dark = false, href = "/" }: { dark?: boolean; href?: string }) {
  return (
    <Link href={href} className={`inline-flex items-center gap-2 text-[15px] font-semibold tracking-[0.12em] ${dark ? "text-white" : "text-ink"}`} aria-label="NoteNurse AI home">
      <span className="grid h-6 w-6 place-items-center rounded-[5px] bg-signal text-[13px] font-bold text-white" aria-hidden>N</span>
      NOTENURSE<span className="font-normal opacity-60">AI</span>
    </Link>
  );
}
