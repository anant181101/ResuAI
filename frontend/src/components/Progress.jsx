export default function Progress({ value = 0 }) {
  const v = Math.max(0, Math.min(100, Number(value) || 0));
  return (
    <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
      <div
        className="h-full bg-primary transition-all"
        style={{ width: `${v}%` }}
      />
    </div>
  );
}
