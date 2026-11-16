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

      <section className="bg-mist">
        <div className="container-x py-24">
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
