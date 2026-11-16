import type { Metadata } from "next";
import { Shell, PageHero } from "@/components/Shell";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <Shell>
      <PageHero eyebrow="About" title="Documentation should never outlast the shift." />
      <section className="container-x max-w-3xl space-y-6 py-20 text-lg text-muted">
        <p>Nursing organizations spend a large share of every shift on documentation. NoteNurse AI exists to shorten that gap without lowering the standard of the record.</p>
        <p>Our principle is simple: the AI drafts, the nurse decides. Every line must point back to something that was actually said, numbers come from deterministic extraction, and nothing is marked verified until a nurse verifies it.</p>
        <p>NoteNurse AI is an independent platform. It is not affiliated with, endorsed by, or a reseller of any other clinical documentation vendor.</p>
      </section>
    </Shell>
  );
}
