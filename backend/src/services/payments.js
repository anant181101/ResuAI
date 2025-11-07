import Razorpay from 'razorpay';
import crypto from 'crypto';

let razor = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razor = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

export async function createSubscriptionOrder(plan, uid) {
  const plans = { starter: 4900, pro: 9900 };
  const amount = plans[plan] || 4900;
  const currency = 'INR';
  if (!razor) {
    return { id: `order_stub_${plan}_1`, amount, currency, status: 'created', notes: { uid, plan } };
  }
  const order = await razor.orders.create({ amount, currency, receipt: `resuai_${plan}_${Date.now()}`, notes: { uid, plan } });
  return order;
}

export function verifyPaymentSignature({ order_id, payment_id, signature }) {
  if (!process.env.RAZORPAY_KEY_SECRET) return true;
  const payload = `${order_id}|${payment_id}`;
  const expected = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(payload).digest('hex');
  return expected === signature;
}
