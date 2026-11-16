"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface Opt { id: string; title: string; patient_label: string | null; created_at: string }

export function HandoffBuilder({ notes }: { notes: Opt[] }) {
  const router = useRouter();
  const [sel, setSel] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function build() {
    setError(null);
    if (!title.trim()) return setError("Give the handoff a title, e.g. “Day to night, 4 West”.");
    if (sel.length === 0) return setError("Select at least one verified note.");
    setBusy(true);
    const res = await fetch("/api/handoffs", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ title, note_ids: sel }) });
    const d = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) return setError(d.error ?? "Could not build the handoff.");
    router.push(`/app/handoffs/${d.id}`);
  }

  return (
    <div className="card p-6">
      <h2 className="text-lg font-medium">Build a handoff</h2>
      <p className="mt-1 text-sm text-muted">Only verified notes are available. The handoff uses nothing outside the notes you select.</p>
      <label className="label mt-5" htmlFor="ht">Title</label>
      <input id="ht" className="field" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={200} placeholder="Day to night, 4 West" />
      <fieldset className="mt-5">
        <legend className="label">Notes ({sel.length} selected)</legend>
        {notes.length === 0 ? (
          <p className="rounded-md bg-mist p-4 text-sm text-muted">No verified notes yet. Verify a note first.</p>
        ) : (
          <ul className="max-h-72 divide-y divide-line overflow-auto rounded-md border border-line">
            {notes.map((n) => (
              <li key={n.id}>
                <label className="flex cursor-pointer items-center gap-3 p-3 hover:bg-mist">
                  <input type="checkbox" className="h-4 w-4 accent-[#EA2C00]" checked={sel.includes(n.id)} onChange={(e) => setSel((s) => (e.target.checked ? [...s, n.id].slice(0, 15) : s.filter((x) => x !== n.id)))} />
                  <span className="min-w-0 flex-1 truncate text-sm">{n.title}{n.patient_label ? ` · ${n.patient_label}` : ""}</span>
                  <span className="text-xs text-muted">{new Date(n.created_at).toLocaleDateString()}</span>
                </label>
              </li>
            ))}
          </ul>
        )}
      </fieldset>
      {error && <p role="alert" className="mt-4 rounded-md bg-signal-soft px-3 py-2 text-sm text-signal-dark">{error}</p>}
      <button onClick={build} disabled={busy} className="btn-primary mt-5">{busy ? <><Loader2 className="h-4 w-4 animate-spin" /> Building…</> : "Build I-PASS handoff"}</button>
    </div>
  );
}
