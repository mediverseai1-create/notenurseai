import test from "node:test";
import assert from "node:assert/strict";
import { extractVitals } from "../src/lib/vitals";
import { quoteInTranscript } from "../src/lib/verify";
import { parsePurchase } from "../src/lib/billing-parse";

const T = "Nurse: BP 152/94, heart rate 112, RR 18, SpO2 91%, temp 38.4 C. Patient: pain is 6/10 in my right calf.";

test("extracts vitals deterministically and flags out-of-range", () => {
  const v = Object.fromEntries(extractVitals(T).map((x) => [x.key, x]));
  assert.equal(v.bp.value, "152/94");
  assert.equal(v.bp.flag, "review");
  assert.equal(v.hr.value, "112");
  assert.equal(v.hr.flag, "review");
  assert.equal(v.rr.flag, "normal");
  assert.equal(v.spo2.value, "91");
  assert.equal(v.spo2.flag, "review");
  assert.equal(v.temp.flag, "review");
  assert.equal(v.pain.value, "6/10");
});

test("normal vitals are not flagged", () => {
  const v = extractVitals("BP 120/80, pulse 72, SpO2 98%");
  assert.ok(v.every((x) => x.flag === "normal"));
});

test("no vitals in text yields none", () => {
  assert.deepEqual(extractVitals("The patient is resting comfortably."), []);
});

test("source quote verification", () => {
  assert.equal(quoteInTranscript("my RIGHT calf", "Patient: pain in my right calf."), true);
  assert.equal(quoteInTranscript("left calf swelling", "Patient: pain in my right calf."), false);
  assert.equal(quoteInTranscript("", "anything"), false);
});

test("payment webhook parsing maps 47/97 and ignores unknowns", () => {
  assert.equal(parsePurchase({ data: { customer: { email: "a@b.co" }, amount: 97, reference: "r1" } }).plan, "pro");
  assert.equal(parsePurchase({ email: "a@b.co", amount: 47, id: "x" }).plan, "starter");
  assert.equal(parsePurchase({ email: "a@b.co", amount: 12 }).plan, null);
  assert.equal(parsePurchase({ email: "a@b.co", amount: 97, status: "refunded" }).paid, false);
  assert.equal(parsePurchase({ product: "Our product page", amount: 5 }).plan, null);
});
