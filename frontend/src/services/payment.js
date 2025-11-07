import api from './api';

async function loadScript(src) {
  if (document.querySelector(`script[src="${src}"]`)) return true;
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = () => resolve(true);
    s.onerror = () => reject(new Error('script_load_failed'));
    document.body.appendChild(s);
  });
}

export async function openRazorpayCheckout(order) {
  await loadScript('https://checkout.razorpay.com/v1/checkout.js');
  const plan = order?.notes?.plan || 'starter';
  if (order?.keyId === 'rzp_test_stub') {
    try {
      await api.post('/payments/verify', {
        order_id: order.id,
        payment_id: 'stub_payment',
        signature: 'stub',
        plan,
      });
      alert('Subscription activated (local stub)');
      return;
    } catch {
      alert('Payment verification failed');
      return;
    }
  }
  const options = {
    key: order.keyId,
    amount: order.amount,
    currency: order.currency,
    name: 'ResuAI',
    description: `Subscription: ${plan}`,
    order_id: order.id,
    handler: async function (response) {
      try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = response;
        await api.post('/payments/verify', {
          order_id: razorpay_order_id,
          payment_id: razorpay_payment_id,
          signature: razorpay_signature,
          plan,
        });
        alert('Subscription activated');
      } catch {
        alert('Payment verification failed');
      }
    },
    theme: { color: '#4f46e5' },
  };
  const rzp = new window.Razorpay(options);
  rzp.open();
}
