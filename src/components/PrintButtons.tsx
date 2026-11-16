"use client";
import { useState } from "react";
import { Check, Copy, Printer } from "lucide-react";

export function PrintButtons({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="no-print flex gap-3">
      <button className="btn-ghost" onClick={async () => { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1800); }}>
        {copied ? <><Check className="h-4 w-4" /> Copied</> : <><Copy className="h-4 w-4" /> Copy</>}
      </button>
      <button className="btn-ghost" onClick={() => window.print()}><Printer className="h-4 w-4" /> Print</button>
    </div>
  );
}
