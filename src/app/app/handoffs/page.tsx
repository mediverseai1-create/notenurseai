import Link from "next/link";
import { Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getEntitlement } from "@/lib/entitlements";
import { HandoffBuilder } from "@/components/HandoffBuilder";

export const metadata = { title: "Handoffs" };

export default async function HandoffsPage() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  const ent = await getEntitlement(supabase, auth.user!.id);

  if (!ent.plan.handoffs) {
    return (
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-medium tracking-tight">Handoffs</h1>
        <div className="card mt-8 p-10 text-center">
          <Lock className="mx-auto h-8 w-8 text-muted" aria-hidden />
          <h2 className="mt-4 text-xl font-medium">I-PASS handoffs are part of Pro</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted">Select your verified notes and get a structured shift handoff built only from what those notes contain.</p>
          <Link href="/app/billing" className="btn-primary mt-6">View plans</Link>
        </div>
      </div>
    );
  }

  const [{ data: verified }, { data: handoffs }] = await Promise.all([
    supabase.from("notes").select("id,title,patient_label,created_at").eq("status", "verified").order("created_at", { ascending: false }).limit(50),
    supabase.from("handoffs").select("id,title,created_at,note_ids").order("created_at", { ascending: false }).limit(20),
  ]);

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <h1 className="text-3xl font-medium tracking-tight">Handoffs</h1>
      <HandoffBuilder notes={verified ?? []} />
      <div>
        <h2 className="text-lg font-medium">Previous handoffs</h2>
        <div className="card mt-4 divide-y divide-line">
          {(handoffs ?? []).length === 0 ? (
            <p className="p-8 text-center text-sm text-muted">No handoffs yet.</p>
          ) : (
            handoffs!.map((h) => (
              <Link key={h.id} href={`/app/handoffs/${h.id}`} className="flex items-center justify-between p-4 hover:bg-mist">
                <span className="font-medium">{h.title}</span>
                <span className="text-xs text-muted">{h.note_ids.length} notes · {new Date(h.created_at).toLocaleString()}</span>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
