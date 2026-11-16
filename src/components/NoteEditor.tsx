"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AlertTriangle, BadgeCheck, Check, Copy, Plus, Printer, Trash2, X } from "lucide-react";
import type { NoteRow, NoteSection } from "@/lib/types";
import { FORMATS } from "@/lib/formats";

export function NoteEditor({ note }: { note: NoteRow }) {
  const router = useRouter();
  const [sections, setSections] = useState<NoteSection[]>(note.content.sections);
  const [gaps, setGaps] = useState<string[]>(note.content.gaps);
  const [title, setTitle] = useState(note.title);
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const verified = note.status === "verified" && !dirty;
  const unverifiedLines = sections.flatMap((s) => s.items).filter((i) => !i.source_verified).length;

  function edit(si: number, ii: number, patch: Partial<{ text: string }>) {
    setSections((s) => s.map((sec, a) => (a !== si ? sec : { ...sec, items: sec.items.map((it, b) => (b === ii ? { ...it, ...patch } : it)) })));
    setDirty(true);
  }
  function remove(si: number, ii: number) {
    setSections((s) => s.map((sec, a) => (a !== si ? sec : { ...sec, items: sec.items.filter((_, b) => b !== ii) })));
    setDirty(true);
  }
  function add(si: number) {
    setSections((s) => s.map((sec, a) => (a !== si ? sec : { ...sec, items: [...sec.items, { text: "", source_quote: "", source_verified: false }] })));
    setDirty(true);
  }

  async function call(body: object, okText: string) {
    setBusy(true);
    setMsg(null);
    const res = await fetch(`/api/notes/${note.id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    setBusy(false);
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setMsg({ type: "err", text: d.error ?? "Something went wrong." });
      return false;
    }
    setMsg({ type: "ok", text: okText });
    return true;
  }

  async function save(thenVerify = false) {
    const clean = sections.map((s) => ({ ...s, items: s.items.filter((i) => i.text.trim()) }));
    const ok = await call({ title, sections: clean, gaps, ...(thenVerify ? { verify: true } : {}) }, thenVerify ? "Note verified." : "Changes saved. Verify the note when you are ready.");
    if (ok) {
      setDirty(false);
      router.refresh();
    }
  }
  async function unverify() {
    if (await call({ verify: false }, "Note returned to draft.")) router.refresh();
  }
  async function del() {
    if (!confirm("Delete this note permanently? This cannot be undone. It will still count toward your usage.")) return;
    const res = await fetch(`/api/notes/${note.id}`, { method: "DELETE" });
    if (res.ok) router.replace("/app/notes");
    else setMsg({ type: "err", text: "Could not delete the note." });
  }

  const plain = () =>
    [`${title}`, note.patient_label ? `Patient: ${note.patient_label}` : "", note.unit ? `Unit: ${note.unit}` : "", ""]
      .concat(sections.flatMap((s) => [s.title.toUpperCase(), ...(s.items.length ? s.items.map((i) => `- ${i.text}`) : ["- (nothing documented)"]), ""]))
      .concat(note.content.vitals.length ? ["VITALS", ...note.content.vitals.map((v) => `- ${v.label}: ${v.value} ${v.unit}`.trim()), ""] : [])
      .concat([verified ? `Verified by nurse on ${new Date(note.verified_at ?? Date.now()).toLocaleString()}` : "DRAFT - not verified"])
      .filter((l, i, a) => !(l === "" && a[i - 1] === ""))
      .join("\n");

  async function copy() {
    await navigator.clipboard.writeText(plain());
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="no-print flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <input value={title} onChange={(e) => { setTitle(e.target.value); setDirty(true); }} className="w-full bg-transparent text-3xl font-medium tracking-tight focus:outline-none focus:ring-2 focus:ring-ink/10" aria-label="Note title" maxLength={200} />
          <p className="mt-1 text-sm text-muted">{FORMATS[note.format].name}{note.patient_label ? ` · ${note.patient_label}` : ""}{note.unit ? ` · ${note.unit}` : ""} · {new Date(note.created_at).toLocaleString()}</p>
        </div>
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${verified ? "bg-ok/10 text-ok" : "bg-warn/10 text-warn"}`}>
          {verified ? <><BadgeCheck className="h-4 w-4" /> Verified</> : "Draft: review required"}
        </span>
      </div>
      <h1 className="hidden print:block text-2xl font-semibold">{title}</h1>

      {unverifiedLines > 0 && (
        <div className="no-print flex gap-3 rounded-md border border-warn/30 bg-warn/5 p-4 text-sm">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warn" aria-hidden />
          <p><strong>{unverifiedLines} line{unverifiedLines > 1 ? "s" : ""} could not be matched to the transcript.</strong> Check or delete them before verifying.</p>
        </div>
      )}

      {note.content.vitals.length > 0 && (
        <section className="card p-5" aria-label="Vitals">
          <p className="eyebrow">Vitals found in the conversation</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {note.content.vitals.map((v) => (
              <div key={v.key} className={`rounded-md border p-3 ${v.flag === "review" ? "border-signal/40 bg-signal-soft" : "border-line"}`}>
                <p className="text-xs text-muted">{v.label}</p>
                <p className="text-lg font-medium">{v.value} <span className="text-sm font-normal text-muted">{v.unit}</span></p>
                {v.note && <p className="mt-1 text-xs text-signal-dark">{v.note}: review</p>}
                <p className="mt-1 truncate font-mono text-[11px] text-muted" title={v.source}>“{v.source}”</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {sections.map((s, si) => (
        <section key={s.key} className="card p-5">
          <h2 className="text-lg font-medium">{s.title}</h2>
          <ul className="mt-3 space-y-3">
            {s.items.length === 0 && <li className="text-sm text-muted">Nothing documented in the conversation for this section.</li>}
            {s.items.map((it, ii) => (
              <li key={ii} className="group">
                <div className="flex gap-2">
                  <textarea value={it.text} rows={2} onChange={(e) => edit(si, ii, { text: e.target.value })} className="field !py-2" aria-label={`${s.title} line ${ii + 1}`} maxLength={600} />
                  <button onClick={() => remove(si, ii)} className="no-print self-start rounded p-2 text-muted hover:bg-mist hover:text-signal" aria-label="Remove line"><X className="h-4 w-4" /></button>
                </div>
                {it.source_quote ? (
                  <p className={`mt-1.5 flex items-start gap-1.5 font-mono text-xs ${it.source_verified ? "text-ok" : "text-warn"}`}>
                    {it.source_verified ? <Check className="mt-0.5 h-3.5 w-3.5 shrink-0" /> : <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />}
                    <span><span className="font-sans font-medium">{it.source_verified ? "Source verified" : "No matching source found"}:</span> “{it.source_quote}”</span>
                  </p>
                ) : (
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs text-warn"><AlertTriangle className="h-3.5 w-3.5" /> Added by you. No source linked.</p>
                )}
              </li>
            ))}
          </ul>
          <button onClick={() => add(si)} className="no-print mt-3 inline-flex items-center gap-1 text-sm text-muted hover:text-ink"><Plus className="h-4 w-4" /> Add line</button>
        </section>
      ))}

      {gaps.length > 0 && (
        <section className="card p-5">
          <p className="eyebrow">Not covered in the conversation</p>
          <ul className="mt-3 space-y-2 text-sm">
            {gaps.map((g, i) => (
              <li key={i} className="flex items-start justify-between gap-3">
                <span className="flex gap-2"><span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-warn" />{g}</span>
                <button className="no-print text-muted hover:text-ink" aria-label="Dismiss" onClick={() => { setGaps(gaps.filter((_, x) => x !== i)); setDirty(true); }}><X className="h-4 w-4" /></button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <details className="no-print card p-5">
        <summary className="cursor-pointer text-sm font-medium">Source transcript</summary>
        <pre className="mt-3 whitespace-pre-wrap font-mono text-xs leading-relaxed text-muted">{note.transcript}</pre>
      </details>

      <div className="no-print sticky bottom-4 flex flex-wrap items-center gap-3 rounded-lg border border-line bg-paper p-3 shadow-lg">
        {dirty && <button onClick={() => save(false)} disabled={busy} className="btn-ghost">Save changes</button>}
        {!verified || dirty ? (
          <button onClick={() => save(true)} disabled={busy} className="btn-primary"><BadgeCheck className="h-4 w-4" /> Verify note</button>
        ) : (
          <button onClick={unverify} disabled={busy} className="btn-ghost">Return to draft</button>
        )}
        <button onClick={copy} className="btn-ghost">{copied ? <><Check className="h-4 w-4" /> Copied</> : <><Copy className="h-4 w-4" /> Copy</>}</button>
        <button onClick={() => window.print()} className="btn-ghost"><Printer className="h-4 w-4" /> Print</button>
        <button onClick={del} className="btn-ghost ml-auto text-signal"><Trash2 className="h-4 w-4" /> Delete</button>
        {msg && <p role="status" className={`w-full text-sm ${msg.type === "ok" ? "text-ok" : "text-signal-dark"}`}>{msg.text}</p>}
      </div>
    </div>
  );
}
