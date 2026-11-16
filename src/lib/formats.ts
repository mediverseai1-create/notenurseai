export type NoteFormat = "soap" | "sbar" | "dar" | "narrative";

export interface FormatDef {
  id: NoteFormat;
  name: string;
  description: string;
  sections: { key: string; title: string; hint: string }[];
}

export const FORMATS: Record<NoteFormat, FormatDef> = {
  soap: {
    id: "soap",
    name: "SOAP",
    description: "Subjective, objective, assessment, plan.",
    sections: [
      { key: "subjective", title: "Subjective", hint: "What the patient or family reports" },
      { key: "objective", title: "Objective", hint: "Observed findings, measurements, procedures performed" },
      { key: "assessment", title: "Assessment", hint: "Nursing assessment explicitly stated in the conversation" },
      { key: "plan", title: "Plan", hint: "Interventions, monitoring and follow-up stated" },
    ],
  },
  sbar: {
    id: "sbar",
    name: "SBAR",
    description: "Situation, background, assessment, recommendation.",
    sections: [
      { key: "situation", title: "Situation", hint: "Why the communication is happening" },
      { key: "background", title: "Background", hint: "Relevant history and context" },
      { key: "assessment", title: "Assessment", hint: "Current findings" },
      { key: "recommendation", title: "Recommendation", hint: "Requests, orders or actions proposed" },
    ],
  },
  dar: {
    id: "dar",
    name: "DAR",
    description: "Data, action, response (focus charting).",
    sections: [
      { key: "data", title: "Data", hint: "Findings supporting the focus" },
      { key: "action", title: "Action", hint: "Nursing actions taken" },
      { key: "response", title: "Response", hint: "Patient response to actions" },
    ],
  },
  narrative: {
    id: "narrative",
    name: "Shift narrative",
    description: "Chronological narrative of the encounter.",
    sections: [
      { key: "events", title: "Events", hint: "What happened, in order" },
      { key: "interventions", title: "Interventions", hint: "Care delivered" },
      { key: "patient_response", title: "Patient response", hint: "Response and education provided" },
    ],
  },
};

export function isFormat(v: unknown): v is NoteFormat {
  return v === "soap" || v === "sbar" || v === "dar" || v === "narrative";
}
