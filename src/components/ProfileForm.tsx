"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/browser";

export function ProfileForm({ userId, initial }: { userId: string; initial: { full_name: string; role_title: string; unit: string } }) {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true);
    setMsg(null);
    const { error } = await createClient()
      .from("profiles")
      .update({ full_name: String(f.get("full_name")).trim(), role_title: String(f.get("role_title")).trim(), unit: String(f.get("unit")).trim() })
      .eq("id", userId);
    setBusy(false);
    setMsg(error ? { ok: false, text: "Could not save your profile." } : { ok: true, text: "Profile saved." });
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-4 p-6">
      <div><label className="label" htmlFor="fn">Full name</label><input id="fn" name="full_name" defaultValue={initial.full_name} className="field" maxLength={120} /></div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="label" htmlFor="rt">Role</label><input id="rt" name="role_title" defaultValue={initial.role_title} className="field" maxLength={80} placeholder="RN, charge nurse…" /></div>
        <div><label className="label" htmlFor="un">Default unit</label><input id="un" name="unit" defaultValue={initial.unit} className="field" maxLength={80} /></div>
      </div>
      {msg && <p role="status" className={`text-sm ${msg.ok ? "text-ok" : "text-signal-dark"}`}>{msg.text}</p>}
      <button className="btn-dark" disabled={busy}>{busy ? "Saving…" : "Save profile"}</button>
    </form>
  );
}
