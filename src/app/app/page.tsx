import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getEntitlement } from "@/lib/entitlements";
import { FORMATS } from "@/lib/formats";
import type { NoteRow } from "@/lib/types";

export const metadata = { title: "Dashboard" };

export default async function Dashboard() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  const userId = auth.user!.id;
  const ent = await getEntitlement(supabase, userId);
  const { data: notes } = await supabase
    .from("notes").select("id,title,patient_label,format,status,created_at").order("created_at", { ascending: false }).limit(6);
  const recent = (notes ?? []) as Pick<NoteRow, "id" | "title" | "patient_label" | "format" | "status" | "created_at">[];
  const { count: drafts } = await supabase.from("notes").select("id", { count: "exact", head: true }).eq("status", "draft");
  const { count: verified } = await supabase.from("notes").select("id", { count: "exact", head: true }).eq("status", "verified");
  const pct = Math.min(100, Math.round((ent.usedNotes / ent.plan.noteLimit) * 100));

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-3xl font-medium tracking-tight">Dashboard</h1>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        <div className="card p-6">
          <p className="eyebrow">Plan</p>
          <p className="mt-2 text-2xl font-medium">{ent.plan.name}</p>
          <p className="mt-1 text-sm text-muted">{ent.status === "expired" ? "Your paid period ended" : ent.plan.period === "lifetime" ? "Lifetime trial allowance" : "Resets monthly"}</p>
          {ent.plan.id !== "pro" && <Link href="/app/billing" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-signal">Upgrade <ArrowRight className="h-3.5 w-3.5" /></Link>}
        </div>
        <div className="card p-6">
          <p className="eyebrow">Note usage</p>
          <p className="mt-2 text-2xl font-medium">{ent.usedNotes}<span className="text-base font-normal text-muted"> / {ent.plan.noteLimit}</span></p>
          <div className="mt-3 h-1.5 overflow-hidden rounded bg-mist" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Notes used">
            <div className={`h-full ${pct >= 90 ? "bg-signal" : "bg-ink"}`} style={{ width: `${pct}%` }} />
          </div>
        </div>
        <div className="card p-6">
          <p className="eyebrow">Your notes</p>
          <p className="mt-2 text-2xl font-medium">{verified ?? 0}<span className="text-base font-normal text-muted"> verified</span></p>
          <p className="mt-1 text-sm text-muted">{drafts ?? 0} awaiting review</p>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <h2 className="text-lg font-medium">Recent notes</h2>
        <Link href="/app/notes/new" className="btn-primary">New note</Link>
      </div>
      <div className="card mt-4 divide-y divide-line">
        {recent.length === 0 ? (
          <div className="p-10 text-center">
            <FileText className="mx-auto h-8 w-8 text-muted" aria-hidden />
            <p className="mt-3 font-medium">No notes yet</p>
            <p className="mt-1 text-sm text-muted">Paste or dictate a conversation and get your first draft in under a minute.</p>
            <Link href="/app/notes/new" className="btn-dark mt-5">Draft your first note</Link>
          </div>
        ) : (
          recent.map((n) => (
            <Link key={n.id} href={`/app/notes/${n.id}`} className="flex items-center justify-between gap-4 p-4 hover:bg-mist">
              <div className="min-w-0">
                <p className="truncate font-medium">{n.title}</p>
                <p className="text-xs text-muted">{FORMATS[n.format].name}{n.patient_label ? ` · ${n.patient_label}` : ""} · {new Date(n.created_at).toLocaleString()}</p>
              </div>
              <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${n.status === "verified" ? "bg-ok/10 text-ok" : "bg-warn/10 text-warn"}`}>{n.status === "verified" ? "Verified" : "Draft"}</span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
