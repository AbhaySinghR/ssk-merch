"use server";

import { randomUUID, createHmac, timingSafeEqual } from "crypto";
import Razorpay from "razorpay";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { revalidatePath } from "next/cache";
import { sql } from "@/lib/db";
import { redis } from "@/lib/redis";
import { getProductBySlug } from "@/lib/products";
import { captureException } from "@/lib/monitoring";
import { Ratelimit } from "@upstash/ratelimit";
import type { CartItem } from "@/components/cart/CartContext";

async function getLoggedInUserId(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;
    if (!token || !process.env.JWT_ACCESS_SECRET) return null;
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_ACCESS_SECRET),
    );
    return payload.sub ?? null;
  } catch {
    return null;
  }
}

const razorpay =
  process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
    ? new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      })
    : null;

export type AddressFields = {
  customerName: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  notes: string;
};

const MAX_ITEM_QUANTITY = 20;

export async function initOrder(
  address: AddressFields,
  cartItems: CartItem[],
): Promise<
  | { success: true; razorpayOrderId: string; amount: number; keyId: string }
  | { success: false; error: string }
> {
  if (!sql) return { success: false, error: "Database not configured." };
  // Local non-null alias: TypeScript can't narrow a module-level variable
  // across closure boundaries even after a null guard, so we capture it here.
  const db = sql;

  if (!razorpay || !process.env.RAZORPAY_KEY_ID)
    return { success: false, error: "Payment not configured." };
  if (!cartItems.length) return { success: false, error: "Cart is empty." };

  const userId = await getLoggedInUserId();
  if (!userId) return { success: false, error: "You must be logged in to place an order." };

  if (redis) {
    const limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "10 m"),
      prefix: "ratelimit:init_order",
    });
    const { success: allowed } = await limiter.limit(userId);
    if (!allowed)
      return { success: false, error: "Too many attempts. Please wait a few minutes." };
  }

  const required = [
    "customerName", "phone", "email",
    "addressLine1", "city", "state", "pincode",
  ] as const;
  for (const field of required) {
    if (!address[field]?.trim())
      return { success: false, error: `${field} is required.` };
  }

  if (!/^\d{6}$/.test(address.pincode))
    return { success: false, error: "Pincode must be 6 digits." };

  let total = 0;
  const validatedItems: Array<CartItem & { serverPrice: number }> = [];
  for (const item of cartItems) {
    const product = getProductBySlug(item.slug);
    if (!product)
      return { success: false, error: `Product not found: ${item.slug}` };
    if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > MAX_ITEM_QUANTITY)
      return { success: false, error: `Quantity for ${item.name} must be between 1 and ${MAX_ITEM_QUANTITY}.` };
    total += product.price * item.quantity;
    validatedItems.push({ ...item, serverPrice: product.price });
  }

  const orderId = randomUUID();

  // ── Step 1: Write order + all items atomically ─────────────────────────────
  // DB-first: nothing is committed to Razorpay until the DB has a consistent
  // record. All inserts run in a single HTTP transaction (Neon HTTP driver).
  try {
    await db.transaction([
      db`
        INSERT INTO orders (
          id, user_id, customer_name, phone, email,
          address_line1, address_line2, city, state, pincode, notes,
          status, total_amount, razorpay_order_id
        ) VALUES (
          ${orderId}, ${userId}, ${address.customerName}, ${address.phone}, ${address.email},
          ${address.addressLine1}, ${address.addressLine2 || null}, ${address.city},
          ${address.state}, ${address.pincode}, ${address.notes || null},
          'pending', ${total}, NULL
        )
      `,
      ...validatedItems.map(
        (item) => db`
          INSERT INTO order_items (order_id, product_slug, product_name, color, size, quantity, unit_price)
          VALUES (
            ${orderId}, ${item.slug}, ${item.name},
            ${item.color ?? null}, ${item.size}, ${item.quantity}, ${item.serverPrice}
          )
        `,
      ),
    ]);
  } catch (err) {
    captureException(err, { action: "initOrder_db_transaction", orderId, userId });
    return { success: false, error: "Failed to save order. Please try again." };
  }

  // ── Step 2: Create Razorpay order ──────────────────────────────────────────
  // Money is only initiated after the DB has committed.
  let rzpOrder: { id: string };
  try {
    rzpOrder = (await razorpay.orders.create({
      amount: total * 100,
      currency: "INR",
      receipt: orderId,
    })) as { id: string };
  } catch (err) {
    // DB row exists but Razorpay failed — delete it cleanly. No money committed.
    captureException(err, { action: "initOrder_razorpay", orderId, userId });
    try {
      await db`DELETE FROM orders WHERE id = ${orderId}`;
    } catch (delErr) {
      captureException(delErr, { action: "initOrder_cleanup_delete", orderId });
    }
    return { success: false, error: "Could not start payment. Please try again." };
  }

  // ── Step 3: Attach Razorpay order id ───────────────────────────────────────
  try {
    await db`UPDATE orders SET razorpay_order_id = ${rzpOrder.id} WHERE id = ${orderId}`;
  } catch (err) {
    // Non-fatal: webhook will still match via razorpay_order_id on payment.captured
    captureException(err, { action: "initOrder_attach_rzp_id", orderId });
  }

  return {
    success: true,
    razorpayOrderId: rzpOrder.id,
    amount: total,
    keyId: process.env.RAZORPAY_KEY_ID,
  };
}

export async function verifyPayment(params: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}): Promise<{ success: true } | { success: false; error: string }> {
  if (!sql) return { success: false, error: "Database not configured." };
  const db = sql; // non-null alias (same reasoning as initOrder)

  if (!process.env.RAZORPAY_KEY_SECRET)
    return { success: false, error: "Payment not configured." };

  // Auth check — Server Actions are public POST endpoints
  const userId = await getLoggedInUserId();
  if (!userId) return { success: false, error: "Unauthorized." };

  // Rate limit: 10 attempts per user per 10 minutes
  if (redis) {
    const limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, "10 m"),
      prefix: "ratelimit:verify_payment",
    });
    const { success: allowed } = await limiter.limit(userId);
    if (!allowed) return { success: false, error: "Too many attempts. Please wait." };
  }

  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = params;

  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature)
    return { success: false, error: "Missing payment parameters." };

  // Timing-safe HMAC-SHA256 signature verification
  const body = `${razorpayOrderId}|${razorpayPaymentId}`;
  const expectedSignature = createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  const expected = Buffer.from(expectedSignature, "hex");
  const received = Buffer.from(razorpaySignature, "hex");
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) {
    console.warn("[verifyPayment] Signature mismatch for order:", razorpayOrderId);
    return { success: false, error: "Payment verification failed." };
  }

  try {
    await db`
      UPDATE orders
      SET
        status = 'paid',
        razorpay_payment_id = ${razorpayPaymentId},
        paid_at = now()
      WHERE razorpay_order_id = ${razorpayOrderId}
        AND user_id = ${userId}
        AND status = 'pending'
    `;
  } catch (err) {
    captureException(err, { action: "verifyPayment_db", razorpayOrderId });
    return { success: false, error: "Failed to record payment. Please contact support." };
  }

  if (redis) await redis.del("admin:orders");

  revalidatePath("/account");
  revalidatePath("/admin");

  return { success: true };
}
