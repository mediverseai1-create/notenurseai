import type { Metadata } from "next";
import { Shell, PageHero } from "@/components/Shell";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <Shell>
      <PageHero eyebrow="About" title="Documentation should not outlast the shift." />
      <section className="container-x max-w-3xl space-y-6 py-20 text-lg text-muted">
        <p>Nurses spend a large share of every shift documenting what they have already done. NoteNurse AI exists to shorten that gap without lowering the standard of the record.</p>
        <p>Our approach is simple. The model drafts; the nurse decides. Every line must point back to something that was actually said, numbers come from deterministic extraction, and nothing is marked verified until a nurse says so.</p>
        <p>NoteNurse AI is an independent product. It is not affiliated with, endorsed by, or a reseller of any other clinical documentation vendor.</p>
      </section>
    </Shell>
  );
}
