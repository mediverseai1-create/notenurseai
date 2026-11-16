import { AuthForm } from "@/components/AuthForm";
import { supabaseConfigured } from "@/lib/env";
import { redirect } from "next/navigation";

export const metadata = { title: "Log in" };

export default function Page() {
  if (!supabaseConfigured) redirect("/setup");
  return <AuthForm mode="login" />;
}
