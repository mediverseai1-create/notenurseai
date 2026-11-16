import type { Metadata } from "next";
import Link from "next/link";
import { Shell, PageHero } from "@/components/Shell";
import { FORMATS } from "@/lib/formats";

export const metadata: Metadata = { title: "Platform", description: "The NoteNurse AI platform: capture, draft, trace and verify nursing documentation." };

const modules = [
  ["Conversation capture", "Dictate with the browser's built-in speech recognition or paste a transcript. Audio is never stored. Only the submitted text is saved."],
  ["Structured drafting", "The AI engine analyzes the encounter and drafts SOAP, SBAR, DAR or a shift narrative. Sections with no evidence stay empty."],
  ["Linked sources", "Every line cites a quote from the transcript. The platform verifies each quote in code and flags any line without a real match."],
  ["Deterministic vitals", "Blood pressure, heart rate, respiratory rate, SpO2, temperature and pain scores are extracted by rules and compared with reference bands."],
  ["Gap detection", "The engine lists what the encounter did not cover, such as a missing pain score or patient response, instead of inventing it."],
  ["Nurse verification", "Each note is edited and verified by a nurse. Changing a verified note returns it to draft, preserving an honest audit trail."],
  ["I-PASS handoff automation", "On the Pro plan, the engine synthesizes verified notes into an I-PASS handoff using only the content those notes contain."],
  ["Usage control", "Plan limits and usage are enforced server-side and visible to the account owner at all times."],
];

export default function ProductPage() {
  return (
    <Shell>
      <PageHero eyebrow="Platform" title="One AI pipeline from conversation to verified note.">
        Capture, draft, trace and verify, with a nurse in control of every record.
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
          <p className="eyebrow">Supported formats</p>
          <div className="mt-8 grid gap-5 md:grid-cols-4">
            {Object.values(FORMATS).map((f) => (
              <div key={f.id} className="card p-6">
                <h3 className="font-medium">{f.name}</h3>
                <p className="mt-1 text-sm text-muted">{f.description}</p>
                <ul className="mt-4 space-y-1 text-sm">{f.sections.map((s) => <li key={s.key}>{s.title}</li>)}</ul>
              </div>
            ))}
          </div>
          <div className="mt-12"><Link href="/signup" className="btn-primary">Sign up</Link></div>
        </div>
      </section>
    </Shell>
  );
}
