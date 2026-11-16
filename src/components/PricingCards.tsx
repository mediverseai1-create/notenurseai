import Link from "next/link";
import { Check } from "lucide-react";
import { PLANS, PAYMENT_LINKS } from "@/lib/plans";

export function PricingCards({ currentPlan, signedIn = false }: { currentPlan?: string; signedIn?: boolean }) {
  const tiers = [PLANS.trial, PLANS.starter, PLANS.pro];
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {tiers.map((p) => {
        const featured = p.id === "pro";
        const isCurrent = currentPlan === p.id;
        const btn = featured ? "btn-primary" : "btn-dark";
        return (
          <div key={p.id} className={`flex flex-col rounded-lg p-7 ${featured ? "bg-ink text-white" : "card"}`}>
            <p className={`eyebrow ${featured ? "!text-signal" : ""}`}>{p.name}</p>
            <p className="mt-4 text-4xl font-medium tracking-tight">
              {p.priceUsd === null ? "Free" : `$${p.priceUsd}`}
              {p.priceUsd !== null && <span className={`ml-1 text-base font-normal ${featured ? "text-white/60" : "text-muted"}`}>/ month</span>}
            </p>
            <p className={`mt-3 text-sm ${featured ? "text-white/70" : "text-muted"}`}>{p.blurb}</p>
            <ul className="mt-6 space-y-3 text-sm">
              {p.features.map((f) => (
                <li key={f} className="flex gap-2.5"><Check className="mt-0.5 h-4 w-4 shrink-0 text-signal" aria-hidden />{f}</li>
              ))}
            </ul>
            <div className="mt-auto pt-8">
              {isCurrent ? (
                <span className={`btn w-full border ${featured ? "border-white/30" : "border-line"}`}>Current plan</span>
              ) : p.id === "trial" ? (
                <Link href={signedIn ? "/app/notes/new" : "/signup"} className="btn-ghost w-full">{signedIn ? "New note" : "Sign up"}</Link>
              ) : (
                <a href={PAYMENT_LINKS[p.id as "starter" | "pro"]} target="_blank" rel="noopener noreferrer" className={`${btn} w-full`}>
                  {signedIn ? "Upgrade" : "Sign up"}
                </a>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
