const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const authMiddleware = require("../middleware/authMiddleware");

// Lazy-init Razorpay so the server doesn't crash if keys are missing
let razorpay = null;
function getRazorpay() {
  if (razorpay) return razorpay;
  const Razorpay = require("razorpay");
  if (!process.env.RAZORPAY_KEY_ID) {
    return null; // keys not configured yet
  }
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
  return razorpay;
}

// ─── POST /api/payments/create-order ─────────────────────────────────────────
// Creates a Razorpay order for a paid event.
// If Razorpay keys are not yet configured, returns a 503 with a helpful message.
router.post("/create-order", authMiddleware, async (req, res) => {
  try {
    const rp = getRazorpay();
    if (!rp) {
      return res.status(503).json({
        message: "Payment gateway not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to server/.env",
        notConfigured: true,
      });
    }

    const { amount, currency = "INR", eventId, eventTitle } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const order = await rp.orders.create({
      amount: Math.round(amount * 100), // paise
      currency,
      receipt: `rcpt_${Date.now().toString(36)}_${eventId.substring(18)}`,
      notes: {
        eventId,
        eventTitle,
        userId: req.user.id,
      },
    });

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("Razorpay create-order error:", err);
    res.status(500).json({ message: err.message });
  }
});

// ─── POST /api/payments/verify ────────────────────────────────────────────────
// Verifies the Razorpay payment signature after checkout.
router.post("/verify", authMiddleware, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return res.status(503).json({ message: "Payment gateway not configured" });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expected = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    if (expected !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed — signature mismatch" });
    }

    res.json({ verified: true, paymentId: razorpay_payment_id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
