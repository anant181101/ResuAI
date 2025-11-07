import UploadCard from '../components/UploadCard.jsx';
import ResultCard from '../components/ResultCard.jsx';
import AnalysisPanel from '../components/AnalysisPanel.jsx';
import { useState } from 'react';

export default function Upload() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [jd, setJd] = useState('');
  return (
    <section className="container py-10 grid lg:grid-cols-3 gap-6 items-start">
      <div className="lg:col-span-2 grid gap-6">
        <div className="p-6 rounded-xl border bg-white">
          <label className="block text-sm text-gray-600">Job Description (optional)</label>
          <textarea value={jd} onChange={e=>setJd(e.target.value)} className="mt-2 w-full h-28 border rounded-md p-3" placeholder="Paste the JD to improve keyword match" />
        </div>
        <UploadCard jd={jd} onResult={setResult} onLoading={setLoading} />
        <ResultCard result={result} />
      </div>
      <AnalysisPanel active={loading} done={!!result} result={result} />
    </section>
  );
}
