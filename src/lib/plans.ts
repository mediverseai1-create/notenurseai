export type PlanId = "trial" | "starter" | "pro";

export interface Plan {
  id: PlanId;
  name: string;
  priceUsd: number | null;
  /** Note generations allowed per period. Trial is a lifetime allowance. */
  noteLimit: number;
  handoffs: boolean;
  period: "lifetime" | "month";
  blurb: string;
  features: string[];
}

// Limits are product defaults - adjust here, they are enforced server-side.
export const PLANS: Record<PlanId, Plan> = {
  trial: {
    id: "trial",
    name: "Trial",
    priceUsd: null,
    noteLimit: 5,
    handoffs: false,
    period: "lifetime",
    blurb: "Evaluate the full documentation engine on five real encounters.",
    features: ["5 AI-drafted notes with source tracing", "SOAP, SBAR, DAR and narrative formats", "Source-linked review", "Copy and print"],
  },
  starter: {
    id: "starter",
    name: "Starter",
    priceUsd: 47,
    noteLimit: 150,
    handoffs: false,
    period: "month",
    blurb: "For nursing teams putting AI documentation into daily operations.",
    features: [
      "150 AI-drafted notes / month",
      "All note formats",
      "Source-linked review and verification",
      "Vitals extraction and range flags",
      "Complete audit history of every note",
    ],
  },
  pro: {
    id: "pro",
    name: "Pro",
    priceUsd: 97,
    noteLimit: 600,
    handoffs: true,
    period: "month",
    blurb: "For high-acuity units that run shift handoffs at scale.",
    features: [
      "600 AI-drafted notes / month",
      "Everything in Starter",
      "I-PASS shift handoff builder",
      "Usage reporting for unit leaders",
      "Automated I-PASS handoff synthesis",
    ],
  },
};

export const PAYMENT_LINKS: Record<"starter" | "pro", string> = {
  starter: process.env.NEXT_PUBLIC_PAYMENT_LINK_STARTER || "https://selar.com/47plan?currency=USD",
  pro: process.env.NEXT_PUBLIC_PAYMENT_LINK_PRO || "https://selar.com/97plan?currency=USD",
};

export function isPlanId(v: unknown): v is PlanId {
  return v === "trial" || v === "starter" || v === "pro";
}
