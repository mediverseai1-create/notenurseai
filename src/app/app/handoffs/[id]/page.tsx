import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PrintButtons } from "@/components/PrintButtons";
import type { HandoffRow } from "@/lib/types";

export const metadata = { title: "Handoff" };

export default async function HandoffPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const supabase = await createClient();
  const { data } = await supabase.from("handoffs").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const h = data as HandoffRow;
  const text = [h.title, "", ...h.content.sections.flatMap((s) => [s.title.toUpperCase(), s.text, ""])].join("\n");
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-medium tracking-tight">{h.title}</h1>
          <p className="mt-1 text-sm text-muted">Built from {h.note_ids.length} verified note{h.note_ids.length === 1 ? "" : "s"} · {new Date(h.created_at).toLocaleString()}</p>
        </div>
        <PrintButtons text={text} />
      </div>
      <p className="no-print rounded-md bg-warn/5 p-3 text-sm text-warn">AI-assembled from your verified notes. Read it through and confirm it before handing off.</p>
      {h.content.sections.map((s) => (
        <section key={s.key} className="card p-5">
          <h2 className="eyebrow">{s.title}</h2>
          <p className="mt-2 whitespace-pre-wrap">{s.text}</p>
        </section>
      ))}
    </div>
  );
}
