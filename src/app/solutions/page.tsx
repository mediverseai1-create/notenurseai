import type { Metadata } from "next";
import Link from "next/link";
import { Shell, PageHero } from "@/components/Shell";

export const metadata: Metadata = { title: "Solutions", description: "NoteNurse AI for health systems, nursing leaders, home health agencies and nursing education." };

const items = [
  ["Health systems and hospitals", "Standardize nursing documentation across units. Every note carries its evidence, so quality and compliance teams can audit the record without re-interviewing staff."],
  ["Nursing leaders and charge nurses", "Automate shift handoffs. The engine builds an I-PASS summary from verified notes, giving every oncoming team the same structure."],
  ["Home health and community care agencies", "Capture visit documentation from a conversation on any device, with gaps flagged before the nurse leaves the visit."],
  ["Nursing schools and training programs", "Teach documentation standards with a system that shows exactly where each line came from and why a draft is or is not supported."],
];

export default function SolutionsPage() {
  return (
    <Shell>
      <PageHero eyebrow="Solutions" title="Built for the organizations that run nursing care.">
        The same engine and the same evidence standard across every care setting.
      </PageHero>
      <section className="container-x grid gap-5 py-20 md:grid-cols-2">
        {items.map(([t, d]) => (
          <div key={t} className="card p-8">
            <h3 className="text-xl font-medium">{t}</h3>
            <p className="mt-3 text-muted">{d}</p>
          </div>
        ))}
      </section>
      <section className="container-x pb-24"><Link href="/signup" className="btn-primary">Sign up</Link></section>
    </Shell>
  );
}
