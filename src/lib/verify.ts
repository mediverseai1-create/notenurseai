export function normalize(s: string) {
  return s
    .toLowerCase()
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[^a-z0-9%/.' ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** True when the quoted evidence genuinely appears in the transcript. */
export function quoteInTranscript(quote: string, transcript: string): boolean {
  const q = normalize(quote);
  if (q.length < 4) return false;
  return normalize(transcript).includes(q);
}
