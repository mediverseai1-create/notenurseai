import Link from "next/link";
import { ArrowRight, FileCheck2, Link2, Mic, ShieldCheck, Stethoscope, Waypoints } from "lucide-react";
import { Shell } from "@/components/Shell";
import { PricingCards } from "@/components/PricingCards";

const steps = [
  { icon: Mic, t: "Capture", d: "Dictate at the bedside or paste the conversation. Nothing is charted yet." },
  { icon: Waypoints, t: "Draft", d: "NoteNurse structures the encounter into SOAP, SBAR, DAR or a shift narrative." },
  { icon: Link2, t: "Trace", d: "Each line carries the exact words it came from, checked against your transcript." },
  { icon: FileCheck2, t: "Verify", d: "Edit, flag gaps, and sign off. Only verified notes leave the app." },
];

export default function Home() {
  return (
    <Shell dark>
      <section className="bg-ink text-white">
        <div className="container-x pb-24 pt-16 md:pb-32 md:pt-24">
          <p className="eyebrow !text-signal">Documentation for nurses, by design</p>
          <h1 className="mt-5 max-w-4xl text-5xl font-medium leading-[1.02] tracking-tight sm:text-7xl">
            Chart the care.<br />Not the clicks.
          </h1>
          <p className="mt-7 max-w-xl text-lg text-white/70">
            NoteNurse AI turns a bedside conversation into a draft nursing note, with every line linked to what was actually said, so you can verify it in a minute instead of rewriting it for twenty.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/signup" className="btn-primary">Start free trial <ArrowRight className="h-4 w-4" /></Link>
            <Link href="/product" className="btn-ghost-dark">See how it works</Link>
          </div>
          <p className="mt-4 text-sm text-white/50">5 free drafted notes. No card required.</p>
        </div>
      </section>

      <section className="border-b border-line">
        <div className="container-x grid gap-px py-0 md:grid-cols-4">
          {steps.map((s, i) => (
            <div key={s.t} className="py-10 md:pr-8">
              <p className="font-mono text-xs text-muted">0{i + 1}</p>
              <s.icon className="mt-4 h-6 w-6 text-signal" aria-hidden />
              <h3 className="mt-4 text-lg font-medium">{s.t}</h3>
              <p className="mt-2 text-sm text-muted">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-x grid items-center gap-12 py-24 md:grid-cols-2">
        <div>
          <p className="eyebrow">Linked sources</p>
          <h2 className="mt-3 text-4xl font-medium leading-tight tracking-tight">Trust the draft because you can check it.</h2>
          <p className="mt-5 text-muted">
            Language models can phrase things that were never said. NoteNurse asks the model to quote its evidence, then checks every quote against your transcript in code. A line with no matching source is flagged for you, never silently accepted.
          </p>
          <p className="mt-4 text-muted">
            Vital signs are read from the transcript by deterministic rules, not generated, and out-of-range values are marked for your attention.
          </p>
        </div>
        <div className="card overflow-hidden" aria-label="Illustrative example">
          <div className="border-b border-line bg-mist px-5 py-3 text-xs text-muted">Illustrative example, not patient data</div>
          <div className="space-y-4 p-5 text-sm">
            <div>
              <p className="eyebrow">Objective</p>
              <p className="mt-1.5">Patient reports calf tenderness on the right leg.</p>
              <p className="mt-2 rounded border-l-2 border-ok bg-mist px-3 py-2 font-mono text-xs text-muted">
                <span className="mr-2 text-ok">source verified</span>“my right calf is really tender when I stand”
              </p>
            </div>
            <div>
              <p className="eyebrow">Gap flagged</p>
              <p className="mt-1.5 flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-warn" />No pain score was recorded in this encounter.</p>
            </div>
            <div className="flex items-center gap-2 rounded bg-signal-soft px-3 py-2 text-signal-dark">
              <ShieldCheck className="h-4 w-4" aria-hidden /> BP 152/94 mmHg: outside reference band, review
            </div>
          </div>
        </div>
      </section>

      <section className="bg-mist">
        <div className="container-x py-24">
          <p className="eyebrow">Built for clinical trust</p>
          <h2 className="mt-3 max-w-2xl text-4xl font-medium leading-tight tracking-tight">AI drafts. Nurses decide.</h2>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              ["Drafted for review", "Notes start as drafts. Editing a verified note reopens it for verification."],
              ["Grounded in the conversation", "The assistant is instructed to document only what was said, and to list what is missing rather than guess."],
              ["Private by default", "Your notes sit behind row-level security: no one else's account can read them."],
            ].map(([t, d]) => (
              <div key={t} className="card p-7">
                <Stethoscope className="h-5 w-5 text-signal" aria-hidden />
                <h3 className="mt-4 font-medium">{t}</h3>
                <p className="mt-2 text-sm text-muted">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x py-24">
        <p className="eyebrow">Pricing</p>
        <h2 className="mb-12 mt-3 text-4xl font-medium tracking-tight">Start free. Upgrade when it earns it.</h2>
        <PricingCards />
      </section>

      <section className="bg-ink text-white">
        <div className="container-x flex flex-col items-start justify-between gap-6 py-16 md:flex-row md:items-center">
          <h2 className="max-w-xl text-3xl font-medium tracking-tight sm:text-4xl">Give your next shift its minutes back.</h2>
          <Link href="/signup" className="btn-primary">Start free trial <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>
    </Shell>
  );
}
