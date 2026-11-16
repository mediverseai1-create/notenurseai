import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { FORMATS } from "@/lib/formats";
import type { NoteRow } from "@/lib/types";

export const metadata = { title: "Notes" };

export default async function NotesPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const supabase = await createClient();
  let q = supabase.from("notes").select("id,title,patient_label,unit,format,status,created_at").order("created_at", { ascending: false }).limit(100);
  if (status === "draft" || status === "verified") q = q.eq("status", status);
  const { data } = await q;
  const notes = (data ?? []) as Pick<NoteRow, "id" | "title" | "patient_label" | "unit" | "format" | "status" | "created_at">[];
  const tabs = [["", "All"], ["draft", "Drafts"], ["verified", "Verified"]];

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-medium tracking-tight">Notes</h1>
        <Link href="/app/notes/new" className="btn-primary">New note</Link>
      </div>
      <div className="mt-6 flex gap-2" role="tablist">
        {tabs.map(([v, l]) => (
          <Link key={l} href={v ? `/app/notes?status=${v}` : "/app/notes"} className={`rounded-full px-4 py-1.5 text-sm ${(status ?? "") === v ? "bg-ink text-white" : "bg-paper text-ink/70 hover:bg-white"}`}>{l}</Link>
        ))}
      </div>
      <div className="card mt-5 divide-y divide-line">
        {notes.length === 0 ? (
          <p className="p-10 text-center text-sm text-muted">{status ? `No ${status} notes.` : "No notes yet. Start with a new note."}</p>
        ) : (
          notes.map((n) => (
            <Link key={n.id} href={`/app/notes/${n.id}`} className="flex items-center justify-between gap-4 p-4 hover:bg-mist">
              <div className="min-w-0">
                <p className="truncate font-medium">{n.title}</p>
                <p className="text-xs text-muted">{FORMATS[n.format].name}{n.patient_label ? ` · ${n.patient_label}` : ""}{n.unit ? ` · ${n.unit}` : ""} · {new Date(n.created_at).toLocaleString()}</p>
              </div>
              <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${n.status === "verified" ? "bg-ok/10 text-ok" : "bg-warn/10 text-warn"}`}>{n.status === "verified" ? "Verified" : "Draft"}</span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
