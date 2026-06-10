import crypto from "crypto";

const KEY_ID = process.env.RAZORPAY_KEY_ID || "";
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "";

export function razorpayConfigured() {
  return Boolean(KEY_ID && KEY_SECRET);
}

export function publicKeyId() {
  return process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || KEY_ID;
}

export interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
}

// Create an order via the Razorpay REST API (no SDK dependency).
export async function createRazorpayOrder(
  amountRupees: number,
  receipt: string
): Promise<RazorpayOrder> {
  if (!razorpayConfigured()) throw new Error("Razorpay is not configured.");
  const auth = Buffer.from(`${KEY_ID}:${KEY_SECRET}`).toString("base64");
  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      amount: Math.round(amountRupees * 100), // paise
      currency: "INR",
      receipt,
      payment_capture: 1,
    }),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Razorpay order failed: ${res.status} ${txt}`);
  }
  const data = await res.json();
  return { id: data.id, amount: data.amount, currency: data.currency };
}

// Verify the checkout signature: HMAC_SHA256(order_id|payment_id, key_secret).
export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  if (!KEY_SECRET) return false;
  const expected = crypto
    .createHmac("sha256", KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature || ""));
}
