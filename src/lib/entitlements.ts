import type { SupabaseClient } from "@supabase/supabase-js";
import { PLANS, isPlanId, type Plan } from "./plans";

export interface Entitlement {
  plan: Plan;
  status: "active" | "inactive" | "canceled" | "expired";
  periodEnd: string | null;
  usedNotes: number;
  usedHandoffs: number;
  notesRemaining: number;
  since: string | null;
}

/** Resolves the effective plan and usage from server-trusted tables. */
export async function getEntitlement(supabase: SupabaseClient, userId: string): Promise<Entitlement> {
  const { data: sub } = await supabase
    .from("subscriptions")
    .select("plan,status,current_period_start,current_period_end")
    .eq("user_id", userId)
    .maybeSingle();

  let planId = isPlanId(sub?.plan) ? sub!.plan : "trial";
  let status: Entitlement["status"] = (sub?.status as Entitlement["status"]) ?? "active";
  const periodEnd: string | null = sub?.current_period_end ?? null;

  if (planId !== "trial") {
    const expired = periodEnd ? new Date(periodEnd).getTime() < Date.now() : false;
    if (status !== "active" || expired) {
      if (expired && status === "active") status = "expired";
      planId = "trial";
    }
  }
  const plan = PLANS[planId];

  let since: string | null = null;
  if (plan.period === "month") {
    const now = new Date();
    since = sub?.current_period_start ?? new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString();
  }

  const count = async (kind: "note" | "handoff") => {
    let q = supabase.from("usage_events").select("id", { count: "exact", head: true }).eq("user_id", userId).eq("kind", kind);
    if (since) q = q.gte("created_at", since);
    const { count: c } = await q;
    return c ?? 0;
  };
  const [usedNotes, usedHandoffs] = await Promise.all([count("note"), count("handoff")]);

  return {
    plan,
    status,
    periodEnd,
    usedNotes,
    usedHandoffs,
    notesRemaining: Math.max(0, plan.noteLimit - usedNotes),
    since,
  };
}
