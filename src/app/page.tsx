import Link from "next/link";
import { Shell } from "@/components/Shell";
import { PricingCards } from "@/components/PricingCards";

const engine = [
  ["Ingest", "The AI engine reads bedside conversations as they happen, from dictation or transcript, across every unit."],
  ["Structure", "It analyzes each encounter and drafts SOAP, SBAR, DAR or shift narrative documentation in seconds."],
  ["Prove", "Every line must cite the exact words it came from. The platform checks each citation against the transcript in code."],
  ["Decide", "Vitals are extracted by rules and flagged against reference ranges. Gaps are surfaced before the chart is signed."],
];

const outcomes = [
  ["Cost", "Return nursing hours to patient care. Documentation drafted by the engine replaces rewriting the same encounter by hand."],
  ["Speed", "A draft in seconds, a verification in minutes, and shift handoffs assembled automatically from verified notes."],
  ["Risk", "Unsupported statements are flagged, missing elements are listed, and nothing is marked verified without a nurse."],
];

const capabilities = [
  ["Ambient capture", "Dictate in the room or paste a transcript. The engine works from the words actually spoken."],
  ["Multi-format drafting", "SOAP, SBAR, DAR and shift narratives, generated from the same encounter on demand."],
  ["Citation checking", "Each line must quote its source. Quotes are verified against the transcript in code, not trusted."],
  ["Vitals intelligence", "Blood pressure, heart rate, respiratory rate, SpO2, temperature and pain scores extracted by rules and flagged against ranges."],
  ["Documentation gap detection", "The engine lists what an encounter did not cover so it can be completed before the record is signed."],
  ["I-PASS handoff automation", "Verified notes are synthesized into a structured shift handoff using only what those notes contain."],
];

const shift = [
  ["Bedside", "Capture the conversation", "The nurse speaks with the patient and dictates a short recap. No templates, no tab switching."],
  ["Minutes later", "Review a sourced draft", "The draft arrives with citations, flagged vitals and a list of gaps. The nurse edits and verifies."],
  ["End of shift", "Hand off with structure", "Verified notes become an I-PASS handoff, so the oncoming team starts from the same record."],
];

const audiences = [
  ["Health systems", "Standardize documentation quality across hospitals and units."],
  ["Nursing leadership", "See usage and keep handoffs consistent across shifts."],
  ["Home health agencies", "Document visits on any device and close gaps before leaving."],
  ["Nursing education", "Teach evidence-based documentation with visible sources."],
];

const governance = [
  ["Nurse verification required", "Notes stay in draft until a nurse verifies them. Editing a verified note returns it to draft."],
  ["Evidence on every line", "Lines without a matching source are flagged and cannot pass silently."],
  ["Tenant isolation", "Row-level security means one account can never read another account's records."],
  ["Server-enforced limits", "Plan limits, usage and billing state are controlled by the server, never the browser."],
];

const faqs = [
  ["Does the AI make clinical decisions?", "No. It drafts documentation from what was said and flags gaps. Nurses review, edit and verify every note."],
  ["How do you prevent fabricated content?", "The AI must quote its evidence, and each quote is checked against the transcript. Vitals come from deterministic extraction, not generation."],
  ["Which documentation formats are supported?", "SOAP, SBAR, DAR and shift narrative, plus I-PASS handoffs on the Pro plan."],
  ["Can we evaluate before committing?", "Yes. Every account includes five free drafted notes."],
  ["Is patient data safe to enter?", "Use neutral labels and avoid direct identifiers. The platform is not offered as a HIPAA business associate today."],
  ["How does billing work?", "Monthly plans, activated after payment is confirmed by our payment provider."],
];

export default function Home() {
  return (
    <Shell dark>
      <section className="bg-gradient-to-b from-ink from-60% to-white text-white">
        <div className="container-x pb-40 pt-20 md:pb-56 md:pt-28">
          <p className="eyebrow !text-white/60">AI-native clinical documentation</p>
          <h1 className="mt-5 max-w-4xl text-5xl font-medium leading-[1.02] tracking-tight sm:text-7xl">
            The intelligence layer for nursing documentation.
          </h1>
          <p className="mt-7 max-w-2xl text-lg text-white/75">
            NoteNurse AI analyzes every bedside conversation, drafts the note, proves each line against its source, and automates the handoff. Built for nursing organizations that need documentation cost down and record quality up.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/signup" className="btn-primary">Sign up</Link>
            <Link href="/login" className="btn-ghost-dark">Log in</Link>
          </div>
        </div>
      </section>

      <section className="container-x -mt-10 pb-24">
        <p className="eyebrow">How the engine works</p>
        <h2 className="mt-3 max-w-3xl text-4xl font-medium leading-tight tracking-tight">One AI pipeline from conversation to verified record.</h2>
        <div className="mt-12 grid gap-px sm:grid-cols-2 lg:grid-cols-4">
          {engine.map(([t, d], i) => (
            <div key={t} className="border-t border-ink py-6 pr-6">
              <p className="font-mono text-xs text-muted">0{i + 1}</p>
              <h3 className="mt-3 text-xl font-medium">{t}</h3>
              <p className="mt-2 text-sm text-muted">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-mist">
        <div className="container-x grid items-center gap-12 py-24 md:grid-cols-2">
          <div>
            <p className="eyebrow">Linked sources</p>
            <h2 className="mt-3 text-4xl font-medium leading-tight tracking-tight">Documentation your risk team can audit.</h2>
            <p className="mt-5 text-muted">
              Language models can phrase things that were never said. NoteNurse requires the AI to quote its evidence, then verifies every quote against the transcript. A line without a matching source is flagged, never silently accepted.
            </p>
            <p className="mt-4 text-muted">
              Vital signs are read from the conversation by deterministic rules, not generated, and out-of-range values are marked for clinical review.
            </p>
          </div>
          <div className="card overflow-hidden bg-paper" aria-label="Illustrative example">
            <div className="border-b border-line px-5 py-3 text-xs text-muted">Illustrative example. Not patient data.</div>
            <div className="space-y-4 p-5 text-sm">
              <div>
                <p className="eyebrow">Objective</p>
                <p className="mt-1.5">Patient reports calf tenderness on the right leg.</p>
                <p className="mt-2 rounded border-l-2 border-ok bg-mist px-3 py-2 font-mono text-xs text-muted">
                  <span className="mr-2 text-ok">Source verified</span>“my right calf is really tender when I stand”
                </p>
              </div>
              <div>
                <p className="eyebrow">Gap flagged</p>
                <p className="mt-1.5 flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-warn" />No pain score was recorded in this encounter.</p>
              </div>
              <div className="rounded bg-signal-soft px-3 py-2 text-signal-dark">Blood pressure 152/94 mmHg is outside the reference band. Review required.</div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-x py-24">
        <p className="eyebrow">Business outcomes</p>
        <h2 className="mt-3 max-w-3xl text-4xl font-medium leading-tight tracking-tight">Lower documentation cost. Faster handoffs. Controlled risk.</h2>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {outcomes.map(([t, d]) => (
            <div key={t} className="card p-7">
              <p className="text-2xl font-medium">{t}</p>
              <p className="mt-3 text-sm text-muted">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-ink text-white">
        <div className="container-x py-24">
          <p className="eyebrow !text-white/60">Platform capabilities</p>
          <h2 className="mt-3 max-w-3xl text-4xl font-medium leading-tight tracking-tight">Every layer of the documentation workflow, run by AI and governed by nurses.</h2>
          <div className="mt-14 grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map(([t, d]) => (
              <div key={t} className="bg-ink p-8">
                <h3 className="text-lg font-medium">{t}</h3>
                <p className="mt-3 text-sm text-white/65">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x py-24">
        <p className="eyebrow">From encounter to record</p>
        <h2 className="mt-3 max-w-3xl text-4xl font-medium leading-tight tracking-tight">A shift on NoteNurse AI.</h2>
        <ol className="mt-12 grid gap-10 md:grid-cols-3">
          {shift.map(([time, t, d]) => (
            <li key={t} className="border-l border-ink pl-6">
              <p className="font-mono text-xs text-signal">{time}</p>
              <h3 className="mt-2 text-xl font-medium">{t}</h3>
              <p className="mt-2 text-sm text-muted">{d}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-mist">
        <div className="container-x py-24">
          <p className="eyebrow">Who it serves</p>
          <h2 className="mt-3 max-w-3xl text-4xl font-medium leading-tight tracking-tight">One platform for every team that owns the nursing record.</h2>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {audiences.map(([t, d]) => (
              <div key={t} className="card bg-paper p-6">
                <h3 className="font-medium">{t}</h3>
                <p className="mt-2 text-sm text-muted">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x grid gap-12 py-24 md:grid-cols-2">
        <div>
          <p className="eyebrow">Governance</p>
          <h2 className="mt-3 text-4xl font-medium leading-tight tracking-tight">Built so that compliance can say yes.</h2>
          <p className="mt-5 text-muted">Clinical AI earns adoption when it can be inspected. NoteNurse AI keeps a human decision and a visible source behind every line that reaches a record.</p>
        </div>
        <ul className="divide-y divide-line border-y border-line">
          {governance.map(([t, d]) => (
            <li key={t} className="py-5">
              <p className="font-medium">{t}</p>
              <p className="mt-1 text-sm text-muted">{d}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-mist">
        <div className="container-x py-24">
          <p className="eyebrow">Questions</p>
          <h2 className="mt-3 text-4xl font-medium tracking-tight">What operators ask before rollout.</h2>
          <dl className="mt-12 grid gap-x-12 gap-y-8 md:grid-cols-2">
            {faqs.map(([q, a]) => (
              <div key={q}>
                <dt className="font-medium">{q}</dt>
                <dd className="mt-2 text-sm text-muted">{a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="container-x py-24">
        <div className="bg-paper">
          <p className="eyebrow">Pricing</p>
          <h2 className="mb-12 mt-3 text-4xl font-medium tracking-tight">Predictable pricing for every stage of rollout.</h2>
          <PricingCards />
        </div>
      </section>

      <section className="bg-ink text-white">
        <div className="container-x flex flex-col items-start justify-between gap-6 py-16 md:flex-row md:items-center">
          <h2 className="max-w-xl text-3xl font-medium tracking-tight sm:text-4xl">Put AI at the center of your nursing documentation.</h2>
          <Link href="/signup" className="btn-primary">Sign up</Link>
        </div>
      </section>
    </Shell>
  );
}
