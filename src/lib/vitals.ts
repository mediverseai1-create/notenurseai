/**
 * Deterministic vitals extraction. Numbers shown as vitals come from here,
 * never from the language model. Reference bands are general adult ranges
 * used only to flag values for the nurse's review - they are not diagnoses.
 */
export interface Vital {
  key: "bp" | "hr" | "rr" | "temp" | "spo2" | "pain";
  label: string;
  value: string;
  unit: string;
  source: string;
  flag: "normal" | "review";
  note?: string;
}

const NUM = "(\\d{1,3}(?:\\.\\d)?)";

function snippet(text: string, index: number, len: number) {
  return text.slice(Math.max(0, index - 12), index + len + 12).replace(/\s+/g, " ").trim();
}

export function extractVitals(text: string): Vital[] {
  const out: Vital[] = [];

  const bp =
    /\b(?:bp|blood pressure)\D{0,12}?(\d{2,3})\s*(?:\/|over)\s*(\d{2,3})\b/i.exec(text) ||
    /\b(\d{2,3})\s*\/\s*(\d{2,3})\s*(?:mm\s?hg)\b/i.exec(text);
  if (bp) {
    const s = Number(bp[1]);
    const d = Number(bp[2]);
    const odd = s < 90 || s >= 140 || d < 60 || d >= 90;
    out.push({
      key: "bp", label: "Blood pressure", value: `${s}/${d}`, unit: "mmHg",
      source: snippet(text, bp.index, bp[0].length), flag: odd ? "review" : "normal",
      note: odd ? "Outside 90-139 / 60-89 reference band" : undefined,
    });
  }

  const hr = new RegExp(`\\b(?:hr|heart rate|pulse)\\D{0,10}?${NUM}\\b`, "i").exec(text);
  if (hr) {
    const v = Number(hr[1]);
    const odd = v < 60 || v > 100;
    out.push({
      key: "hr", label: "Heart rate", value: String(v), unit: "bpm",
      source: snippet(text, hr.index, hr[0].length), flag: odd ? "review" : "normal",
      note: odd ? "Outside 60-100 reference band" : undefined,
    });
  }

  const rr = new RegExp(`\\b(?:rr|resp(?:iratory|irations)?(?: rate)?)\\D{0,10}?${NUM}\\b`, "i").exec(text);
  if (rr) {
    const v = Number(rr[1]);
    const odd = v < 12 || v > 20;
    out.push({
      key: "rr", label: "Respiratory rate", value: String(v), unit: "/min",
      source: snippet(text, rr.index, rr[0].length), flag: odd ? "review" : "normal",
      note: odd ? "Outside 12-20 reference band" : undefined,
    });
  }

  const spo2 = new RegExp(`\\b(?:spo2|sp02|o2 sat(?:uration)?s?|oxygen sat(?:uration)?|sats?)\\D{0,10}?${NUM}\\s*%?`, "i").exec(text);
  if (spo2) {
    const v = Number(spo2[1]);
    const odd = v < 94;
    out.push({
      key: "spo2", label: "SpO2", value: String(v), unit: "%",
      source: snippet(text, spo2.index, spo2[0].length), flag: odd ? "review" : "normal",
      note: odd ? "Below 94%" : undefined,
    });
  }

  const temp = /\btemp(?:erature)?\D{0,10}?(\d{2,3}(?:\.\d)?)\s*(?:°|degrees)?\s*([cf])?\b/i.exec(text);
  if (temp) {
    const v = Number(temp[1]);
    const unit = (temp[2] || (v > 45 ? "F" : "C")).toUpperCase();
    const c = unit === "F" ? (v - 32) * (5 / 9) : v;
    const odd = c < 36 || c >= 38;
    out.push({
      key: "temp", label: "Temperature", value: String(v), unit: `°${unit}`,
      source: snippet(text, temp.index, temp[0].length), flag: odd ? "review" : "normal",
      note: odd ? "Outside 36.0-37.9 °C band" : undefined,
    });
  }

  const pain = /\bpain\D{0,12}?(\d{1,2})\s*(?:\/|out of)\s*10\b/i.exec(text);
  if (pain) {
    const v = Number(pain[1]);
    if (v >= 0 && v <= 10) {
      out.push({
        key: "pain", label: "Pain score", value: `${v}/10`, unit: "",
        source: snippet(text, pain.index, pain[0].length), flag: v >= 4 ? "review" : "normal",
        note: v >= 4 ? "Moderate or higher" : undefined,
      });
    }
  }

  return out;
}
