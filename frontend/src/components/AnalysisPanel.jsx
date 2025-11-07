import { useMemo } from 'react';
import Progress from './Progress.jsx';

const stepsBase = [
  { key: 'connect', label: 'Connecting to AI' },
  { key: 'extract', label: 'Extracting resume text' },
  { key: 'analyze', label: 'Analyzing keywords & structure' },
  { key: 'summarize', label: 'Generating improvements' },
];

export default function AnalysisPanel({ active, done, result }) {
  const steps = stepsBase;

  // compute progress percentage when done/result exists
  const progress = useMemo(() => {
    if (result?.score != null) return result.score;
    if (done) return 100;
    return 35; // idle placeholder
  }, [done, result]);

  return (
    <div className="relative p-6 rounded-2xl border bg-white overflow-hidden">
      {/* pseudo-3D gradient card */}
      <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 blur-3xl opacity-70" />
      <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-tr from-accent/20 to-primary/20 blur-3xl opacity-70" />

      <div className="relative">
        <h3 className="font-semibold text-lg">AI Scan</h3>
        <p className="text-sm text-gray-600">Securely processing your resume with AI</p>

        <div className="mt-5 grid gap-3">
          {steps.map((s, i) => {
            const status = done ? 'done' : active ? (i === 0 ? 'active' : 'pending') : 'idle';
            // If not done and active, show first step active only: purely visual
            return (
              <div key={s.key} className="flex items-center gap-3">
                <span className={`h-2.5 w-2.5 rounded-full ${done || status==='active' ? 'bg-primary' : 'bg-gray-300'}`} />
                <span className={`text-sm ${done || status==='active' ? 'text-gray-900' : 'text-gray-500'}`}>{s.label}</span>
              </div>
            );
          })}
        </div>

        <div className="mt-6">
          <Progress value={progress} />
        </div>

        {result && (
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">Improvements</h4>
              <span className="text-primary font-extrabold">{result.score}%</span>
            </div>
            <ul className="mt-2 list-disc pl-5 text-gray-700 space-y-1">
              {result.improvements?.map((it, idx) => (
                <li key={idx}>{it}</li>
              ))}
            </ul>
            {(result.matched || result.missing) && (
              <div className="mt-4 grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Matched keywords</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(result.matched || []).map((k) => (
                      <span key={k} className="px-2 py-1 rounded-full text-xs bg-green-50 text-green-700 border border-green-200">{k}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium">Missing keywords</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(result.missing || []).map((k) => (
                      <span key={k} className="px-2 py-1 rounded-full text-xs bg-amber-50 text-amber-700 border border-amber-200">{k}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
