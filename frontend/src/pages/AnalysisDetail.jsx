import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import Progress from '../components/Progress.jsx';

export default function AnalysisDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(true);
  const [bioLoading, setBioLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/resumes/${id}`);
        setItem(data.item);
      } catch {}
      setLoading(false);
    })();
  }, [id]);

  const genBio = async () => {
    if (!item) return;
    setBioLoading(true);
    try {
      const { data } = await api.post('/analysis/bio', { text: item.rawText || '' });
      setBio(data.linkedinBio || '');
    } catch {
      alert('Failed to generate bio');
    } finally { setBioLoading(false); }
  };

  if (loading) {
    return (
      <section className="container py-10">
        <p className="text-gray-600">Loading...</p>
      </section>
    );
  }
  if (!item) {
    return (
      <section className="container py-10">
        <p className="text-gray-600">Not found</p>
      </section>
    );
  }

  return (
    <section className="container py-10 grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="p-6 rounded-xl border bg-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">{item.resumeName}</h2>
              <p className="text-sm text-gray-500">{new Date(item.createdAt).toLocaleString()}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-extrabold text-primary">{item.score}%</div>
              <div className="mt-2 w-48"><Progress value={item.score} /></div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold">AI Improvements</h3>
            <ul className="mt-2 list-disc pl-5 text-gray-700 space-y-1">
              {(item.improvements||[]).map((it, i)=> <li key={i}>{it}</li>)}
            </ul>
          </div>

          {(item.matched?.length || item.missing?.length) ? (
            <div className="mt-6 grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Matched keywords</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(item.matched||[]).map(k=> <span key={k} className="px-2 py-1 rounded-full text-xs bg-green-50 text-green-700 border border-green-200">{k}</span>)}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium">Missing keywords</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(item.missing||[]).map(k=> <span key={k} className="px-2 py-1 rounded-full text-xs bg-amber-50 text-amber-700 border border-amber-200">{k}</span>)}
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <div className="mt-6 p-6 rounded-xl border bg-white">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">LinkedIn Bio</h3>
            <button onClick={genBio} disabled={bioLoading} className="rounded-md bg-primary text-white px-4 py-2 disabled:opacity-50">
              {bioLoading ? 'Generating…' : 'Generate'}
            </button>
          </div>
          <textarea className="mt-3 w-full h-36 border rounded-md p-3" readOnly value={bio || item.linkedinBio || ''} />
        </div>
      </div>

      <div className="p-6 rounded-xl border bg-white">
        <h3 className="font-semibold">Extracted Text</h3>
        <pre className="mt-3 whitespace-pre-wrap text-sm text-gray-700 max-h-[480px] overflow-auto">{item.rawText || '(no text extracted)'}</pre>
      </div>
    </section>
  );
}
