import { createSubscriptionOrder, verifyPaymentSignature } from '../services/payments.js';
import User from '../models/User.js';

export async function createOrder(req, res) {
  try {
    const plan = (req.body?.plan || 'starter').toLowerCase();
    const uid = req.user?.uid || null;
    const order = await createSubscriptionOrder(plan, uid);
    const keyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_stub';
    res.json({ ...order, keyId });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'failed_to_create_order' });
  }
}

export async function verifyPayment(req, res) {
  try {
    const uid = req.user?.uid;
    if (!uid) return res.status(401).json({ error: 'auth_required' });
    const { order_id, payment_id, signature, plan } = req.body || {};
    const ok = verifyPaymentSignature({ order_id, payment_id, signature });
    if (!ok) return res.status(400).json({ error: 'invalid_signature' });
    const chosen = (plan || 'starter').toLowerCase();
    const days = chosen === 'pro' ? 60 : 30;
    const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    await User.findOneAndUpdate({ uid }, { plan: chosen, planExpiresAt: expires }, { upsert: true });
    res.json({ ok: true, plan: chosen, planExpiresAt: expires });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'failed_to_verify_payment' });
  }
}
