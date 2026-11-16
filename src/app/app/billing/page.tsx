import { createClient } from "@/lib/supabase/server";
import { getEntitlement } from "@/lib/entitlements";
import { PricingCards } from "@/components/PricingCards";

export const metadata = { title: "Billing" };

export default async function BillingPage() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  const ent = await getEntitlement(supabase, auth.user!.id);
  const email = auth.user!.email;
  const pct = Math.min(100, Math.round((ent.usedNotes / ent.plan.noteLimit) * 100));

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <h1 className="text-3xl font-medium tracking-tight">Billing</h1>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="card p-6">
          <p className="eyebrow">Current plan</p>
          <p className="mt-2 text-2xl font-medium">{ent.plan.name}</p>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-muted">Status</dt><dd className="font-medium capitalize">{ent.status === "expired" ? "Expired (trial limits apply)" : ent.status}</dd></div>
            {ent.periodEnd && ent.plan.id !== "trial" && <div className="flex justify-between"><dt className="text-muted">Paid through</dt><dd className="font-medium">{new Date(ent.periodEnd).toLocaleDateString()}</dd></div>}
            <div className="flex justify-between"><dt className="text-muted">Handoffs</dt><dd className="font-medium">{ent.plan.handoffs ? "Included" : "Pro only"}</dd></div>
          </dl>
        </div>
        <div className="card p-6">
          <p className="eyebrow">Usage {ent.plan.period === "month" ? "this period" : "(lifetime)"}</p>
          <p className="mt-2 text-2xl font-medium">{ent.usedNotes}<span className="text-base font-normal text-muted"> / {ent.plan.noteLimit} notes</span></p>
          <div className="mt-3 h-1.5 overflow-hidden rounded bg-mist"><div className={`h-full ${pct >= 90 ? "bg-signal" : "bg-ink"}`} style={{ width: `${pct}%` }} /></div>
          {ent.plan.handoffs && <p className="mt-3 text-sm text-muted">{ent.usedHandoffs} handoffs built</p>}
        </div>
      </div>

      <div className="rounded-lg border border-line bg-paper p-5 text-sm">
        <p className="font-medium">How activation works</p>
        <p className="mt-1 text-muted">
          Subscribe using the same email as this account (<span className="font-medium text-ink">{email}</span>). Your plan is switched on once our payment provider confirms the payment, not when you return from checkout, so it can take a few minutes. If it has not updated after an hour, contact support with your receipt.
        </p>
      </div>

      <PricingCards currentPlan={ent.plan.id} signedIn />
    </div>
  );
}
