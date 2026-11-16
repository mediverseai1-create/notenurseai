import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { quoteInTranscript } from "@/lib/verify";

const item = z.object({ text: z.string().trim().min(1).max(600), source_quote: z.string().max(400) });
const patch = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  patient_label: z.string().trim().max(80).optional(),
  sections: z.array(z.object({ key: z.string(), title: z.string(), items: z.array(item).max(30) })).max(8).optional(),
  gaps: z.array(z.string().max(300)).max(12).optional(),
  verify: z.boolean().optional(),
});

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ error: "Please sign in." }, { status: 401 });

  const parsed = patch.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid input." }, { status: 400 });
  const p = parsed.data;

  const { data: note } = await supabase.from("notes").select("*").eq("id", id).eq("user_id", auth.user.id).maybeSingle();
  if (!note) return NextResponse.json({ error: "Note not found." }, { status: 404 });

  const update: Record<string, unknown> = {};
  if (p.title !== undefined) update.title = p.title;
  if (p.patient_label !== undefined) update.patient_label = p.patient_label || null;

  if (p.sections || p.gaps) {
    update.content = {
      ...note.content,
      sections: p.sections
        ? p.sections.map((s) => ({
            ...s,
            items: s.items.map((i) => ({ ...i, source_verified: quoteInTranscript(i.source_quote, note.transcript) })),
          }))
        : note.content.sections,
      gaps: p.gaps ?? note.content.gaps,
    };
    // Editing content reopens verification.
    update.status = "draft";
    update.verified_at = null;
  }
  if (p.verify === true) {
    update.status = "verified";
    update.verified_at = new Date().toISOString();
  } else if (p.verify === false) {
    update.status = "draft";
    update.verified_at = null;
  }

  const { error } = await supabase.from("notes").update(update).eq("id", id).eq("user_id", auth.user.id);
  if (error) return NextResponse.json({ error: "Could not update the note." }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  const { error } = await supabase.from("notes").delete().eq("id", id).eq("user_id", auth.user.id);
  if (error) return NextResponse.json({ error: "Could not delete the note." }, { status: 500 });
  return NextResponse.json({ ok: true });
}
