import { Link } from 'react-router-dom';

export default function FeatureCard({ icon: Icon, title, desc, to, cta }) {
  return (
    <div className="group relative overflow-hidden p-6 rounded-2xl border bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
      <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 blur-3xl opacity-70" />
      <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-gradient-to-tr from-accent/15 to-primary/15 blur-3xl opacity-70" />
      <div className="relative">
        <div className="h-10 w-10 rounded-md bg-primary/10 text-primary flex items-center justify-center">
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="mt-4 font-semibold text-lg">{title}</h3>
        <p className="mt-2 text-gray-600">{desc}</p>
        {to && (
          <Link to={to} className="mt-5 inline-flex items-center rounded-md bg-primary text-white px-4 py-2 shadow hover:brightness-110">
            {cta || 'Explore'}
          </Link>
        )}
      </div>
    </div>
  );
}
