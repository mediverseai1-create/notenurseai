import type { Metadata } from "next";
import { Shell, PageHero } from "@/components/Shell";

export const metadata: Metadata = { title: "Contact" };
const email = process.env.NEXT_PUBLIC_SUPPORT_EMAIL;

export default function ContactPage() {
  return (
    <Shell>
      <PageHero eyebrow="Contact" title="Talk to a human." />
      <section className="container-x max-w-2xl space-y-6 py-20">
        <p className="text-lg text-muted">Questions about plans, billing, or how NoteNurse fits your unit? Email us and include the address you signed up with.</p>
        {email ? (
          <a href={`mailto:${email}`} className="btn-primary">{email}</a>
        ) : (
          <p className="rounded-md border border-line bg-mist p-4 text-sm">Support email coming soon. (Set NEXT_PUBLIC_SUPPORT_EMAIL to show it here.)</p>
        )}
        <p className="text-sm text-muted">Please do not email patient information. NoteNurse support never needs it.</p>
      </section>
    </Shell>
  );
}
