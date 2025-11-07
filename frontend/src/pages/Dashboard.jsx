import { useEffect, useState } from 'react';
import api from '../services/api';
import Progress from '../components/Progress.jsx';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/resumes/recent');
        setItems(data.items || []);
      } catch {}
    })();
  }, []);
  return (
    <section className="container py-10">
      <h2 className="text-2xl font-bold">Recent Analyses</h2>
      <div className="mt-6 grid gap-4">
        {items.map((it) => (
          <Link to={`/analysis/${it._id}`} key={it._id} className="p-4 rounded-lg border bg-white block hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{it.resumeName}</p>
                <p className="text-sm text-gray-500">{new Date(it.createdAt).toLocaleString()}</p>
              </div>
              <div className="text-primary font-extrabold">{it.score}%</div>
            </div>
            <div className="mt-3">
              <Progress value={it.score} />
            </div>
            {Array.isArray(it.improvements) && it.improvements.length > 0 && (
              <p className="mt-3 text-sm text-gray-700">• {it.improvements[0]}</p>
            )}
          </Link>
        ))}
        {items.length === 0 && <p className="text-gray-600">No analyses yet. Upload your first resume!</p>}
      </div>
    </section>
  );
}
