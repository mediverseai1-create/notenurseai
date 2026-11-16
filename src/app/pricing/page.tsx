import type { Metadata } from "next";
import { Shell, PageHero } from "@/components/Shell";
import { PricingCards } from "@/components/PricingCards";

export const metadata: Metadata = { title: "Pricing", description: "Simple monthly plans for nurses. Start with five free notes." };

const faqs = [
  ["How do I activate a paid plan?", "Create your account first, then subscribe using the same email address. Your plan is activated after the payment is confirmed by our payment provider, which is usually within minutes."],
  ["What counts toward my note allowance?", "Each drafted note counts once, even if you later delete it. Handoffs (Pro) are not limited separately."],
  ["Can I change or cancel my plan?", "Yes. Subscribe to a different plan to switch. Paid access runs to the end of the period you paid for, then your account returns to the trial allowance."],
  ["Is NoteNurse a medical device?", "No. It drafts documentation for a licensed nurse to review. It does not diagnose or recommend treatment."],
];

export default function PricingPage() {
  return (
    <Shell>
      <PageHero eyebrow="Pricing" title="Pay for the notes you draft.">Start with five free notes. Move to a monthly plan when it becomes part of your shift.</PageHero>
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
