import api from '../services/api';
import { openRazorpayCheckout } from '../services/payment';
import { Link } from 'react-router-dom';

export default function PricingSection() {
  const handleUpgrade = async (plan) => {
    try {
      const { data } = await api.post('/payments/order', { plan });
      await openRazorpayCheckout(data);
    } catch (e) {
      console.error(e);
      alert('Unable to start checkout');
    }
  };

  return (
    <section className="container py-16">
      <h2 className="text-3xl font-bold text-center">Choose your plan</h2>
      <div className="mt-10 grid md:grid-cols-3 gap-6">
        <div className="group relative overflow-hidden p-6 rounded-2xl border bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
          <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 blur-3xl opacity-70" />
          <div className="relative">
            <h3 className="text-xl font-semibold">Free</h3>
            <p className="text-gray-600">1 analysis/day</p>
            <p className="mt-4 text-3xl font-extrabold">₹0</p>
            <ul className="mt-4 text-sm text-gray-700 space-y-1">
              <li>• ATS score & breakdown</li>
              <li>• 3–5 feedback bullets</li>
              <li>• Basic JD match</li>
            </ul>
            <Link to="/upload" className="mt-6 w-full inline-flex items-center justify-center rounded-md border px-4 py-2 hover:bg-gray-50">Get Started</Link>
          </div>
        </div>
        <div className="group relative overflow-hidden p-6 rounded-2xl border bg-white shadow-sm ring-2 ring-primary hover:shadow-2xl hover:-translate-y-1 transition-all">
          <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 blur-3xl opacity-80" />
          <div className="relative">
            <div className="absolute -top-4 right-0 text-xs bg-primary text-white px-2 py-1 rounded">Most popular</div>
            <h3 className="text-xl font-semibold">Starter</h3>
            <p className="text-gray-600">For regular users</p>
            <p className="mt-4 text-3xl font-extrabold">₹49<span className="text-base font-normal">/mo</span></p>
            <ul className="mt-4 text-sm text-gray-700 space-y-1">
              <li>• Everything in Free</li>
              <li>• Unlimited analyses</li>
              <li>• AI Templates</li>
            </ul>
            <button onClick={() => handleUpgrade('starter')} className="mt-6 w-full rounded-md bg-primary text-white px-4 py-2 hover:brightness-110">Upgrade</button>
          </div>
        </div>
        <div className="group relative overflow-hidden p-6 rounded-2xl border bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
          <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 blur-3xl opacity-70" />
          <div className="relative">
            <h3 className="text-xl font-semibold">Pro</h3>
            <p className="text-gray-600">For power users</p>
            <p className="mt-4 text-3xl font-extrabold">₹99<span className="text-base font-normal">/mo</span></p>
            <ul className="mt-4 text-sm text-gray-700 space-y-1">
              <li>• Everything in Starter</li>
              <li>• Priority processing</li>
              <li>• Early features access</li>
            </ul>
            <button onClick={() => handleUpgrade('pro')} className="mt-6 w-full rounded-md bg-primary text-white px-4 py-2 hover:brightness-110">Upgrade</button>
          </div>
        </div>
      </div>
    </section>
  );
}
