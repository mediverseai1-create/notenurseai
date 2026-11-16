import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { activatePlan, findUserIdByEmail } from "@/lib/billing";

const body = z.object({ email: z.string().email(), plan: z.enum(["starter", "pro"]) });

/** Trusted administrative activation, e.g. after confirming a payment in the Selar dashboard. */
export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  const admins = (process.env.ADMIN_EMAILS ?? "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
  if (!auth.user?.email || !admins.includes(auth.user.email.toLowerCase())) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }
  const parsed = body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Provide a valid email and plan." }, { status: 400 });
  const admin = createAdminClient();
  const userId = await findUserIdByEmail(admin, parsed.data.email);
  if (!userId) return NextResponse.json({ error: "No account with that email." }, { status: 404 });
  await activatePlan(admin, userId, parsed.data.plan, `admin:${auth.user.email}:${Date.now()}`);
  return NextResponse.json({ ok: true });
}
