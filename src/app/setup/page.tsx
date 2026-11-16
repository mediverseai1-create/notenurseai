import { Logo } from "@/components/Logo";

export const metadata = { title: "Setup required" };

export default function SetupPage() {
  return (
    <div className="grid min-h-screen place-items-center bg-mist p-6">
      <div className="card max-w-lg p-8">
        <Logo />
        <h1 className="mt-6 text-2xl font-medium">Backend not configured</h1>
        <p className="mt-3 text-muted">
          Set <code className="font-mono text-sm">NEXT_PUBLIC_SUPABASE_URL</code> and <code className="font-mono text-sm">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, run <code className="font-mono text-sm">supabase/schema.sql</code>, then restart. See the README.
        </p>
      </div>
    </div>
  );
}
