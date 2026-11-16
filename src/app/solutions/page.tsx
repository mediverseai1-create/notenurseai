import type { Metadata } from "next";
import Link from "next/link";
import { Shell, PageHero } from "@/components/Shell";

export const metadata: Metadata = { title: "Solutions", description: "NoteNurse AI for bedside nurses, charge nurses and nursing students." };

const items = [
  ["Bedside and floor nurses", "Turn a patient conversation or a quick dictated recap into a structured draft you can verify between tasks, then paste into your charting system."],
  ["Charge nurses and team leads", "Build an I-PASS handoff from the verified notes of your shift, so the oncoming nurse gets a consistent summary."],
  ["Home health and community nurses", "Capture visit notes from a conversation on a phone or laptop with browser dictation, with gaps flagged before you leave the visit."],
  ["Nursing students and educators", "Practice documentation formats with a tool that shows exactly where each line came from. Educators can see why a draft is or is not supported."],
];

export default function SolutionsPage() {
  return (
    <Shell>
      <PageHero eyebrow="Solutions" title="Built around how nursing work actually moves.">
        Different settings, the same principle: documentation that follows the care, with the nurse in control.
      </PageHero>
      <section className="container-x grid gap-5 py-20 md:grid-cols-2">
        {items.map(([t, d]) => (
          <div key={t} className="card p-8">
            <h3 className="text-xl font-medium">{t}</h3>
            <p className="mt-3 text-muted">{d}</p>
          </div>
        ))}
      </section>
      <section className="container-x pb-24">
        <Link href="/signup" className="btn-primary">Start free trial</Link>
      </section>
    </Shell>
  );
}
