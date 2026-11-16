import type { Metadata } from "next";
import Link from "next/link";
import { Shell, PageHero } from "@/components/Shell";
import { FORMATS } from "@/lib/formats";

export const metadata: Metadata = { title: "Product", description: "How NoteNurse AI drafts, links and verifies nursing documentation." };

const modules = [
  ["Conversation capture", "Dictate with your browser's built-in speech recognition or paste a transcript. Audio is not stored; only the text you submit is saved."],
  ["Structured drafting", "Choose SOAP, SBAR, DAR or a shift narrative. The draft follows the format and leaves empty sections empty."],
  ["Linked sources", "Every line cites a quote from your transcript. The quote is verified in code, and lines without a real match are flagged."],
  ["Vitals, deterministically", "Blood pressure, heart rate, respiratory rate, SpO2, temperature and pain scores are read by rules and checked against reference bands."],
  ["Gap detection", "The draft lists what the conversation did not cover, such as a missing pain score or patient response, instead of filling it in."],
  ["Review and verify", "Edit any line, then verify the note. Changing a verified note returns it to draft."],
  ["I-PASS shift handoff (Pro)", "Select verified notes and assemble an I-PASS handoff using only what those notes contain."],
  ["Copy and print", "Export a clean note to paste into your charting system or print it."],
];

export default function ProductPage() {
  return (
    <Shell>
      <PageHero eyebrow="Product" title="One workflow from conversation to verified note.">
        NoteNurse is a focused documentation workspace: capture, draft, trace, verify.
      </PageHero>
      <section className="container-x grid gap-px py-20 sm:grid-cols-2">
        {modules.map(([t, d], i) => (
          <div key={t} className="border-t border-line py-8 pr-8">
            <p className="font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</p>
            <h3 className="mt-2 text-xl font-medium">{t}</h3>
            <p className="mt-2 text-muted">{d}</p>
          </div>
        ))}
      </section>
      <section className="bg-mist">
        <div className="container-x py-20">
          <p className="eyebrow">Note formats</p>
          <div className="mt-8 grid gap-5 md:grid-cols-4">
            {Object.values(FORMATS).map((f) => (
              <div key={f.id} className="card p-6">
                <h3 className="font-medium">{f.name}</h3>
                <p className="mt-1 text-sm text-muted">{f.description}</p>
                <ul className="mt-4 space-y-1 text-sm">{f.sections.map((s) => <li key={s.key}>{s.title}</li>)}</ul>
              </div>
            ))}
          </div>
          <div className="mt-12"><Link href="/signup" className="btn-primary">Start free trial</Link></div>
        </div>
      </section>
    </Shell>
  );
}
