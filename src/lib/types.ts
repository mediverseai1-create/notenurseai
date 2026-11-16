import type { NoteFormat } from "./formats";
import type { Vital } from "./vitals";

export interface NoteItem {
  text: string;
  source_quote: string;
  /** Computed on the server: does source_quote exist in the transcript? */
  source_verified: boolean;
}
export interface NoteSection {
  key: string;
  title: string;
  items: NoteItem[];
}
export interface NoteContent {
  sections: NoteSection[];
  gaps: string[];
  vitals: Vital[];
}
export interface NoteRow {
  id: string;
  user_id: string;
  title: string;
  patient_label: string | null;
  unit: string | null;
  format: NoteFormat;
  transcript: string;
  content: NoteContent;
  status: "draft" | "verified";
  verified_at: string | null;
  created_at: string;
  updated_at: string;
}
export interface HandoffRow {
  id: string;
  user_id: string;
  title: string;
  note_ids: string[];
  content: { sections: { key: string; title: string; text: string }[] };
  created_at: string;
}
export interface SubscriptionRow {
  user_id: string;
  plan: "trial" | "starter" | "pro";
  status: "active" | "inactive" | "canceled";
  current_period_start: string | null;
  current_period_end: string | null;
  external_ref: string | null;
}
