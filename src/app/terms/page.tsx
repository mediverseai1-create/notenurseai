import type { Metadata } from "next";
import { Shell, PageHero } from "@/components/Shell";

export const metadata: Metadata = { title: "Terms" };

export default function TermsPage() {
  return (
    <Shell>
      <PageHero eyebrow="Legal" title="Terms of use" />
      <section className="container-x max-w-3xl space-y-5 py-16 text-muted">
        <p><strong className="text-ink">Draft terms for review by counsel before launch.</strong></p>
        <p>NoteNurse AI produces draft documentation to assist licensed nurses. It does not provide medical advice, diagnosis or treatment. You are responsible for reviewing, correcting and verifying every note before using it in any clinical record.</p>
        <p>Paid plans are monthly, processed by our payment provider, and activated after the provider confirms payment. Plan limits are shown on the pricing page and enforced by the service.</p>
        <p>You must not submit content you are not permitted to share, and you must follow your employer&apos;s policies on patient information and AI tools.</p>
      </section>
    </Shell>
  );
}
