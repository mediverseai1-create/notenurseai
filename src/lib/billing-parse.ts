function dig(obj: unknown, paths: string[]): unknown {
  for (const p of paths) {
    let cur: unknown = obj;
    for (const k of p.split(".")) {
      if (cur && typeof cur === "object") cur = (cur as Record<string, unknown>)[k];
      else {
        cur = undefined;
        break;
      }
    }
    if (cur !== undefined && cur !== null && cur !== "") return cur;
  }
  return undefined;
}

/**
 * Tolerant extraction of purchase facts from a payment webhook body.
 * Field names must be confirmed against Selar's real payload before go-live
 * (see README "Payments"). Unknown shapes resolve to nulls and are NOT applied.
 */
export function parsePurchase(payload: unknown) {
  const email = dig(payload, ["data.customer.email", "customer.email", "data.email", "email", "customer_email", "buyer.email"]);
  const amount = dig(payload, ["data.amount", "amount", "data.price", "price", "data.total", "total"]);
  const productText = String(
    dig(payload, ["data.product.name", "product.name", "data.product_name", "product_name", "data.product.url", "product.url", "data.product", "product"]) ?? "",
  ).toLowerCase();
  const ref = dig(payload, ["data.reference", "reference", "data.id", "id", "data.order_id", "order_id", "data.transaction_id", "transaction_id"]);
  const status = String(dig(payload, ["data.status", "status", "event", "type"]) ?? "").toLowerCase();

  let plan: "starter" | "pro" | null = null;
  const amt = Number(amount);
  if (productText.includes("97plan") || /\bpro\b/.test(productText)) plan = "pro";
  else if (productText.includes("47plan") || /\bstarter\b/.test(productText)) plan = "starter";
  else if (amt === 97) plan = "pro";
  else if (amt === 47) plan = "starter";

  const failed = /fail|cancel|refund|declin|pending|abandon/.test(status);
  return {
    email: typeof email === "string" ? email : null,
    plan,
    ref: ref !== undefined ? String(ref) : null,
    paid: !failed,
  };
}
