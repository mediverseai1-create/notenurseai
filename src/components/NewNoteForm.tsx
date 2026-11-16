"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Loader2, Mic, Square } from "lucide-react";
import { FORMATS, type NoteFormat } from "@/lib/formats";

/* eslint-disable @typescript-eslint/no-explicit-any */
export function NewNoteForm({ remaining, aiReady }: { remaining: number; aiReady: boolean }) {
  const router = useRouter();
  const [format, setFormat] = useState<NoteFormat>("soap");
  const [transcript, setTranscript] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<{ msg: string; limit?: boolean } | null>(null);
  const [listening, setListening] = useState(false);
  const [canDictate, setCanDictate] = useState(false);
  const recRef = useRef<any>(null);

  useEffect(() => {
    const w = window as any;
    setCanDictate(Boolean(w.SpeechRecognition || w.webkitSpeechRecognition));
    return () => recRef.current?.stop?.();
  }, []);

  function toggleDictation() {
    const w = window as any;
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SR) return;
    if (listening) {
      recRef.current?.stop();
      return;
    }
    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = false;
    rec.lang = "en-US";
    rec.onresult = (e: any) => {
      let add = "";
      for (let i = e.resultIndex; i < e.results.length; i++) if (e.results[i].isFinal) add += e.results[i][0].transcript + " ";
      if (add) setTranscript((t) => (t ? t.replace(/\s*$/, " ") : "") + add);
    };
    rec.onerror = (e: any) => {
      setListening(false);
      setError({ msg: e.error === "not-allowed" ? "Microphone permission was denied. Allow it in your browser, or paste the transcript instead." : "Dictation stopped unexpectedly. You can keep typing or try again." });
    };
    rec.onend = () => setListening(false);
    recRef.current = rec;
    setError(null);
    rec.start();
    setListening(true);
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const f = new FormData(e.currentTarget);
    const title = String(f.get("title") ?? "").trim();
    if (!title) return setError({ msg: "Give the note a short title." });
    if (transcript.trim().length < 20) return setError({ msg: "Add at least a couple of sentences of conversation." });
    recRef.current?.stop?.();
    setBusy(true);
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          title,
          patient_label: String(f.get("patient_label") ?? ""),
          unit: String(f.get("unit") ?? ""),
          format,
          transcript,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) return setError({ msg: data.error ?? "Could not draft the note.", limit: data.code === "limit" });
      router.push(`/app/notes/${data.id}`);
    } catch {
      setError({ msg: "Network error. Check your connection and try again." });
    } finally {
      setBusy(false);
    }
  }

  const blocked = remaining <= 0;

  return (
    <form onSubmit={submit} className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-medium tracking-tight">New note</h1>
        <p className="mt-2 text-sm text-muted">{remaining} draft{remaining === 1 ? "" : "s"} remaining on your plan.</p>
      </div>

      {!aiReady && <p className="rounded-md bg-signal-soft p-3 text-sm text-signal-dark">The AI provider is not configured on this deployment (GEMINI_API_KEY). Drafting is unavailable.</p>}
      {blocked && <p className="rounded-md bg-signal-soft p-3 text-sm text-signal-dark">You have used your allowance. <Link href="/app/billing" className="font-medium underline">Upgrade your plan</Link> to keep drafting.</p>}

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="sm:col-span-3"><label className="label" htmlFor="title">Title</label><input id="title" name="title" className="field" maxLength={200} placeholder="e.g. Post-op check, 14:00" required /></div>
        <div><label className="label" htmlFor="patient_label">Patient label</label><input id="patient_label" name="patient_label" className="field" maxLength={80} placeholder="Bed 12" /></div>
        <div><label className="label" htmlFor="unit">Unit</label><input id="unit" name="unit" className="field" maxLength={80} placeholder="Med-surg 4" /></div>
      </div>
      <p className="-mt-3 text-xs text-muted">Use a neutral label. Avoid names, dates of birth or record numbers.</p>

      <fieldset>
        <legend className="label">Note format</legend>
        <div className="grid gap-3 sm:grid-cols-4">
          {Object.values(FORMATS).map((f) => (
            <label key={f.id} className={`cursor-pointer rounded-md border p-3 text-sm transition ${format === f.id ? "border-ink bg-ink text-white" : "border-line bg-paper hover:bg-mist"}`}>
              <input type="radio" name="format" value={f.id} checked={format === f.id} onChange={() => setFormat(f.id)} className="sr-only" />
              <span className="font-medium">{f.name}</span>
              <span className={`mt-1 block text-xs ${format === f.id ? "text-white/70" : "text-muted"}`}>{f.description}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label className="label !mb-0" htmlFor="transcript">Conversation</label>
          {canDictate && (
            <button type="button" onClick={toggleDictation} className={listening ? "btn-primary !py-1.5" : "btn-ghost !py-1.5"} aria-pressed={listening}>
              {listening ? <><Square className="h-3.5 w-3.5" /> Stop dictation</> : <><Mic className="h-3.5 w-3.5" /> Dictate</>}
            </button>
          )}
        </div>
        <textarea
          id="transcript" value={transcript} onChange={(e) => setTranscript(e.target.value)} rows={12} maxLength={30000}
          className="field font-mono !text-[13px] leading-relaxed"
          placeholder={'Nurse: How is the pain this afternoon?\nPatient: About a 5 out of 10, mostly my right calf...\nNurse: BP is 128/82, HR 76, SpO2 97 percent...'}
        />
        <p className="mt-1.5 text-xs text-muted">{transcript.length.toLocaleString()} / 30,000 characters{listening ? " · listening…" : ""}</p>
      </div>

      {error && (
        <p role="alert" className="rounded-md bg-signal-soft px-3 py-2 text-sm text-signal-dark">
          {error.msg} {error.limit && <Link href="/app/billing" className="font-medium underline">See plans</Link>}
        </p>
      )}
      <button className="btn-primary" disabled={busy || blocked || !aiReady}>
        {busy ? <><Loader2 className="h-4 w-4 animate-spin" /> Drafting and checking sources…</> : "Draft note"}
      </button>
    </form>
  );
}
