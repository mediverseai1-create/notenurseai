import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "@/components/ProfileForm";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user!;
  const { data: p } = await supabase.from("profiles").select("full_name,role_title,unit").eq("id", user.id).maybeSingle();
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-3xl font-medium tracking-tight">Settings</h1>
      <div className="card p-6"><p className="eyebrow">Account email</p><p className="mt-1 font-medium">{user.email}</p></div>
      <ProfileForm userId={user.id} initial={{ full_name: p?.full_name ?? "", role_title: p?.role_title ?? "", unit: p?.unit ?? "" }} />
      <form action="/auth/signout" method="post"><button className="btn-ghost">Log out</button></form>
    </div>
  );
}
