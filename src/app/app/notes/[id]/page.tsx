import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { NoteEditor } from "@/components/NoteEditor";
import type { NoteRow } from "@/lib/types";

export const metadata = { title: "Review note" };

export default async function NotePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const supabase = await createClient();
  const { data } = await supabase.from("notes").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  return <NoteEditor key={`${data.id}-${data.updated_at}`} note={data as NoteRow} />;
}
