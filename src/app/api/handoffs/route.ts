import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getEntitlement } from "@/lib/entitlements";
import { generateHandoff, AiError } from "@/lib/ai";
import type { NoteRow } from "@/lib/types";

export const maxDuration = 60;

const body = z.object({
  title: z.string().trim().min(1).max(200),
  note_ids: z.array(z.string().uuid()).min(1).max(15),
});

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ error: "Please sign in." }, { status: 401 });

  const parsed = body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Choose a title and at least one verified note." }, { status: 400 });

  const ent = await getEntitlement(supabase, auth.user.id);
  if (!ent.plan.handoffs) {
    return NextResponse.json({ error: "Shift handoffs are included in the Pro plan.", code: "plan" }, { status: 402 });
  }

  const { data: notes } = await supabase
    .from("notes")
    .select("*")
    .in("id", parsed.data.note_ids)
    .eq("user_id", auth.user.id)
    .eq("status", "verified");
  const rows = (notes ?? []) as NoteRow[];
  if (rows.length === 0) return NextResponse.json({ error: "Only verified notes can be used in a handoff." }, { status: 400 });

  const notesText = rows
    .map((n) => {
      const lines = n.content.sections.flatMap((s) => s.items.map((i) => `  [${s.title}] ${i.text}`));
      const vit = n.content.vitals.map((v) => `${v.label} ${v.value}${v.unit ? " " + v.unit : ""}`).join("; ");
      return `NOTE: ${n.title} (patient: ${n.patient_label || "unlabelled"}, unit: ${n.unit || "n/a"})\n${lines.join("\n")}${vit ? `\n  Vitals: ${vit}` : ""}`;
    })
    .join("\n\n");

  let content;
  try {
    content = await generateHandoff(notesText);
  } catch (e) {
    if (e instanceof AiError) return NextResponse.json({ error: e.message }, { status: e.status });
    return NextResponse.json({ error: "Unexpected error while building the handoff." }, { status: 500 });
  }

  await createAdminClient().from("usage_events").insert({ user_id: auth.user.id, kind: "handoff" });
  const { data, error } = await createAdminClient()
    .from("handoffs")
    .insert({ user_id: auth.user.id, title: parsed.data.title, note_ids: rows.map((r) => r.id), content })
    .select("id")
    .single();
  if (error) return NextResponse.json({ error: "Could not save the handoff." }, { status: 500 });
  return NextResponse.json({ id: data.id });
}
