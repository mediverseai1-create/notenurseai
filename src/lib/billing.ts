import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { PlanId } from "./plans";

const DAY = 86_400_000;

/** Grants (or renews) a paid plan for 31 days. A same-plan renewal while still active extends from the current end date. */
export async function activatePlan(admin: SupabaseClient, userId: string, plan: Exclude<PlanId, "trial">, ref: string) {
  const { data: sub } = await admin.from("subscriptions").select("plan,status,current_period_end").eq("user_id", userId).maybeSingle();
  const now = Date.now();
  const currentEnd = sub?.current_period_end ? new Date(sub.current_period_end).getTime() : 0;
  const renewing = sub?.plan === plan && sub?.status === "active" && currentEnd > now;
  const base = renewing ? currentEnd : now;
  const { error } = await admin.from("subscriptions").upsert({
    user_id: userId,
    plan,
    status: "active",
    current_period_start: new Date(now).toISOString(),
    current_period_end: new Date(base + 31 * DAY).toISOString(),
    external_ref: ref,
    updated_at: new Date().toISOString(),
  });
  if (error) throw new Error(error.message);
}

export async function findUserIdByEmail(admin: SupabaseClient, email: string): Promise<string | null> {
  const { data } = await admin.from("profiles").select("id").eq("email", email.trim().toLowerCase()).maybeSingle();
  return data?.id ?? null;
}
