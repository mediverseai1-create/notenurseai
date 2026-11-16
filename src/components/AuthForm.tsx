"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import { Logo } from "./Logo";

type Mode = "login" | "signup" | "forgot" | "reset";

const copy: Record<Mode, { title: string; cta: string }> = {
  login: { title: "Welcome back", cta: "Log in" },
  signup: { title: "Create your account", cta: "Create account" },
  forgot: { title: "Reset your password", cta: "Send reset link" },
  reset: { title: "Choose a new password", cta: "Update password" },
};

function Form({ mode }: { mode: Mode }) {
  const router = useRouter();
  const params = useSearchParams();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(params.get("error") === "link" ? "That link is invalid or has expired. Request a new one." : null);
  const [info, setInfo] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email") ?? "").trim();
    const password = String(f.get("password") ?? "");
    const name = String(f.get("name") ?? "").trim();

    if ((mode === "signup" || mode === "reset") && password.length < 8) return setError("Password must be at least 8 characters.");
    setBusy(true);
    const supabase = createClient();
    const origin = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        const next = params.get("next");
        router.replace(next && next.startsWith("/") && !next.startsWith("//") ? next : "/app");
        router.refresh();
      } else if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email, password,
          options: { data: { full_name: name }, emailRedirectTo: `${origin}/auth/callback` },
        });
        if (error) throw error;
        if (data.session) {
          router.replace("/app");
          router.refresh();
        } else {
          setInfo("Check your email to confirm your account, then log in.");
        }
      } else if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${origin}/auth/callback?next=/reset-password` });
        if (error) throw error;
        setInfo("If an account exists for that email, a reset link is on its way.");
      } else {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
        router.replace("/app");
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-ink p-12 text-white lg:flex">
        <Logo dark />
        <div>
          <p className="eyebrow !text-signal">NoteNurse AI</p>
          <p className="mt-4 max-w-md text-4xl font-medium leading-tight tracking-tight">AI that documents with evidence, not assumptions.</p>
        </div>
        <p className="text-sm text-white/50">Every draft is reviewed and verified by a licensed nurse.</p>
      </div>
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden"><Logo /></div>
          <h1 className="text-3xl font-medium tracking-tight">{copy[mode].title}</h1>
          <form onSubmit={onSubmit} method="post" action="#" className="mt-8 space-y-4" noValidate>
            {mode === "signup" && (
              <div><label className="label" htmlFor="name">Full name</label><input id="name" name="name" className="field" autoComplete="name" required /></div>
            )}
            {mode !== "reset" && (
              <div><label className="label" htmlFor="email">Email</label><input id="email" name="email" type="email" className="field" autoComplete="email" required /></div>
            )}
            {mode !== "forgot" && (
              <div>
                <label className="label" htmlFor="password">{mode === "reset" ? "New password" : "Password"}</label>
                <input id="password" name="password" type="password" className="field" autoComplete={mode === "login" ? "current-password" : "new-password"} minLength={mode === "login" ? undefined : 8} required />
              </div>
            )}
            {error && <p role="alert" className="rounded-md bg-signal-soft px-3 py-2 text-sm text-signal-dark">{error}</p>}
            {info && <p role="status" className="rounded-md bg-mist px-3 py-2 text-sm">{info}</p>}
            <button className="btn-primary w-full" disabled={busy}>{busy ? "Please wait…" : copy[mode].cta}</button>
          </form>
          <div className="mt-6 space-y-2 text-sm text-muted">
            {mode === "login" && (<><p><Link className="underline" href="/forgot-password">Forgot your password?</Link></p><p>New here? <Link className="underline" href="/signup">Create an account</Link></p></>)}
            {mode === "signup" && <p>Already have an account? <Link className="underline" href="/login">Log in</Link></p>}
            {mode === "forgot" && <p><Link className="underline" href="/login">Back to log in</Link></p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AuthForm({ mode }: { mode: Mode }) {
  return <Suspense><Form mode={mode} /></Suspense>;
}
