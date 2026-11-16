import type { Metadata } from "next";
import { Shell, PageHero } from "@/components/Shell";

export const metadata: Metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <Shell>
      <PageHero eyebrow="Legal" title="Privacy" />
      <section className="container-x max-w-3xl space-y-5 py-16 text-muted">
        <p><strong className="text-ink">Draft policy for review by counsel before launch.</strong> This summary describes how the app is built.</p>
        <p>Your account, notes and handoffs are stored in a Supabase database with row-level security so they are only readable by your account. Transcripts you submit are sent to our AI provider to produce a draft.</p>
        <p>Do not enter direct patient identifiers (names, dates of birth, record numbers). Use a neutral label such as &quot;Bed 12&quot;. NoteNurse is not currently a HIPAA business associate offering; do not use it with protected health information unless you have a signed agreement with us and with the AI provider.</p>
        <p>Dictation uses your browser&apos;s speech recognition, which may send audio to your browser vendor. NoteNurse does not store audio.</p>
        <p>You can delete any note at any time. Account deletion is available on request through the email address you signed up with.</p>
      </section>
    </Shell>
  );
}
