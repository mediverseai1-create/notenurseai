import type { Metadata } from "next";
import { Shell, PageHero } from "@/components/Shell";
import { PricingCards } from "@/components/PricingCards";

export const metadata: Metadata = { title: "Pricing", description: "Predictable monthly plans for nursing teams. Evaluate with five free notes." };

const faqs = [
  ["How is a paid plan activated?", "Create your account first, then subscribe using the same email address. The plan is activated after our payment provider confirms the payment."],
  ["What counts toward the monthly allowance?", "Each drafted note counts once, even if it is later deleted. Handoffs on the Pro plan are not limited separately."],
  ["How do plan changes and cancellations work?", "Subscribe to a different plan to switch. Paid access runs to the end of the paid period, then the account returns to the trial allowance."],
  ["Is NoteNurse a medical device?", "No. It drafts documentation for a licensed nurse to review. It does not diagnose or recommend treatment."],
];

export default function PricingPage() {
  return (
    <Shell>
      <PageHero eyebrow="Pricing" title="Pricing that scales with documentation volume.">
        Evaluate on five encounters, then move to a monthly plan sized to your team.
      </PageHero>
      <section className="container-x py-20"><PricingCards /></section>
      <section className="bg-mist">
        <div className="container-x py-20">
          <h2 className="text-3xl font-medium tracking-tight">Billing questions</h2>
          <dl className="mt-8 grid gap-8 md:grid-cols-2">
            {faqs.map(([q, a]) => (
              <div key={q}><dt className="font-medium">{q}</dt><dd className="mt-2 text-sm text-muted">{a}</dd></div>
            ))}
          </dl>
        </div>
      </section>
    </Shell>
  );
}
