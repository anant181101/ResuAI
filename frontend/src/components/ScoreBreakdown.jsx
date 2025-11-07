import Progress from './Progress.jsx';

export default function ScoreBreakdown({ breakdown = {}, coverage }) {
  const items = [
    { key: 'keywords', label: 'Keywords' },
    { key: 'readability', label: 'Readability' },
    { key: 'format', label: 'Format/ATS' },
    { key: 'impact', label: 'Impact' },
  ];
  return (
    <div className="mt-4 grid gap-3">
      {coverage != null && (
        <div>
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Parse Coverage</span>
            <span className="text-gray-600">{Math.round(coverage)}%</span>
          </div>
          <div className="mt-1"><Progress value={coverage} /></div>
        </div>
      )}
      {items.map(({ key, label }) => (
        <div key={key}>
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">{label}</span>
            <span className="text-gray-600">{Math.round(breakdown?.[key] ?? 0)}%</span>
          </div>
          <div className="mt-1"><Progress value={breakdown?.[key] ?? 0} /></div>
        </div>
      ))}
    </div>
  );
}
