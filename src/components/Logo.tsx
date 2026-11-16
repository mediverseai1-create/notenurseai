import Link from "next/link";

/** Uses the supplied logo file unchanged. On dark backgrounds it sits on a white plate so it stays readable. */
export function Logo({ dark = false, href = "/" }: { dark?: boolean; href?: string }) {
  return (
    <Link href={href} aria-label="NoteNurse home" className={`inline-flex items-center ${dark ? "rounded-md bg-white px-3 py-1.5" : ""}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.png" alt="NoteNurse" width={1230} height={328} className="h-8 w-auto sm:h-9" />
    </Link>
  );
}
