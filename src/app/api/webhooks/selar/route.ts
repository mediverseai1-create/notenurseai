import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { activatePlan, findUserIdByEmail } from "@/lib/billing";
import { parsePurchase } from "@/lib/billing-parse";

function safeEqual(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

/**
 * Selar payment webhook. Plans are only activated when:
 *  1. the shared secret matches (header x-webhook-secret or ?secret=),
 *  2. the payload identifies a paid 47/97 purchase,
 *  3. the buyer email matches a registered NoteNurse account,
 *  4. the event has not been processed before (idempotent).
 * Returning from the payment link alone never activates anything.
 */
export async function POST(req: Request) {
  const secret = process.env.SELAR_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "Webhook not configured." }, { status: 503 });
  const given = req.headers.get("x-webhook-secret") ?? new URL(req.url).searchParams.get("secret") ?? "";
  if (!safeEqual(given, secret)) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const payload = await req.json().catch(() => null);
  if (!payload) return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });

  const admin = createAdminClient();
  const p = parsePurchase(payload);
  const eventId = p.ref ?? `hash_${Buffer.from(JSON.stringify(payload)).toString("base64").slice(0, 64)}`;

  const { error: dupErr } = await admin
    .from("payment_events")
    .insert({ provider: "selar", event_id: eventId, email: p.email, plan: p.plan, payload });
  if (dupErr) {
    // unique violation => already received
    return NextResponse.json({ ok: true, duplicate: true });
  }

  if (!p.paid || !p.plan || !p.email) {
    return NextResponse.json({ ok: true, applied: false, reason: "Not a recognised paid purchase." });
  }
  const userId = await findUserIdByEmail(admin, p.email);
  if (!userId) {
    return NextResponse.json({ ok: true, applied: false, reason: "No account with that email yet." });
  }
  await activatePlan(admin, userId, p.plan, eventId);
  await admin.from("payment_events").update({ applied: true }).eq("provider", "selar").eq("event_id", eventId);
  return NextResponse.json({ ok: true, applied: true });
}
