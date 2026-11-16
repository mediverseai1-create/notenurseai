import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getEntitlement } from "@/lib/entitlements";
import { Logo } from "@/components/Logo";
import { AppNav } from "@/components/AppNav";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/login");
  const ent = await getEntitlement(supabase, data.user.id);
  const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", data.user.id).maybeSingle();

  return (
    <div className="min-h-screen bg-mist lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="no-print border-b border-line bg-paper p-4 lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r lg:p-5">
        <div className="mb-4 flex items-center justify-between lg:mb-8"><Logo href="/app" /></div>
        <AppNav />
        <div className="mt-6 hidden border-t border-line pt-5 text-sm lg:block">
          <p className="truncate font-medium">{profile?.full_name || data.user.email}</p>
          <p className="mt-0.5 text-xs text-muted">{ent.plan.name} plan · {ent.notesRemaining} notes left</p>
          <form action="/auth/signout" method="post" className="mt-3">
            <button className="flex items-center gap-2 text-muted hover:text-ink"><LogOut className="h-4 w-4" aria-hidden /> Log out</button>
          </form>
        </div>
      </aside>
      <div className="min-w-0 p-5 sm:p-8 lg:p-10">{children}</div>
    </div>
  );
}
