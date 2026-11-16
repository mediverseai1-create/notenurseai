import { createClient } from "@/lib/supabase/server";
import { getEntitlement } from "@/lib/entitlements";
import { aiConfigured } from "@/lib/env";
import { NewNoteForm } from "@/components/NewNoteForm";

export const metadata = { title: "New note" };

export default async function NewNotePage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const ent = await getEntitlement(supabase, data.user!.id);
  return <NewNoteForm remaining={ent.notesRemaining} aiReady={aiConfigured} />;
}
