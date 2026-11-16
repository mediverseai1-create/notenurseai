import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getEntitlement } from "@/lib/entitlements";
import { generateNote, AiError } from "@/lib/ai";
import { supabaseConfigured } from "@/lib/env";

export const maxDuration = 60;

const body = z.object({
  title: z.string().trim().min(1).max(200),
  patient_label: z.string().trim().max(80).optional().default(""),
  unit: z.string().trim().max(80).optional().default(""),
  format: z.enum(["soap", "sbar", "dar", "narrative"]),
  transcript: z.string().trim().min(20, "Add at least a couple of sentences of conversation.").max(30000),
});

export async function POST(req: Request) {
  if (!supabaseConfigured) return NextResponse.json({ error: "Backend is not configured." }, { status: 503 });
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ error: "Please sign in." }, { status: 401 });

  const parsed = body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input." }, { status: 400 });
  const input = parsed.data;

  const ent = await getEntitlement(supabase, auth.user.id);
  if (ent.notesRemaining <= 0) {
    return NextResponse.json(
      { error: `You have used all ${ent.plan.noteLimit} notes on the ${ent.plan.name} plan. Upgrade to continue.`, code: "limit" },
      { status: 402 },
    );
  }

  let content;
  try {
    content = await generateNote(input.transcript, input.format);
  } catch (e) {
    if (e instanceof AiError) return NextResponse.json({ error: e.message }, { status: e.status });
    return NextResponse.json({ error: "Unexpected error while drafting the note." }, { status: 500 });
  }

  // Count the credit only once a draft actually exists.
  try {
    await createAdminClient().from("usage_events").insert({ user_id: auth.user.id, kind: "note" });
  } catch {
    return NextResponse.json({ error: "Usage tracking is not configured (SUPABASE_SERVICE_ROLE_KEY)." }, { status: 503 });
  }

  const { data, error } = await supabase
    .from("notes")
    .insert({
      user_id: auth.user.id,
      title: input.title,
      patient_label: input.patient_label || null,
      unit: input.unit || null,
      format: input.format,
      transcript: input.transcript,
      content,
    })
    .select("id")
    .single();
  if (error) return NextResponse.json({ error: "Could not save the note." }, { status: 500 });
  return NextResponse.json({ id: data.id });
}
