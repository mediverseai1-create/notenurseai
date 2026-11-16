import { AuthForm } from "@/components/AuthForm";
import { supabaseConfigured } from "@/lib/env";
import { redirect } from "next/navigation";

export const metadata = { title: "Sign up" };

export default function Page() {
  if (!supabaseConfigured) redirect("/setup");
  return <AuthForm mode="signup" />;
}
