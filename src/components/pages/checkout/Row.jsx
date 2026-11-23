export default function Row({ label, value, highlight }) {
  return (
    <div className="flex items-center justify-between text-[13px] gap-2">
      <span
        className={highlight ? "text-blue-600 font-medium" : "text-slate-500"}
      >
        {label}
      </span>
      <span
        className={`font-semibold max-w-50 sm:max-w-60 truncate text-right ${highlight ? "text-blue-700" : "text-slate-700"}`}
      >
        {value}
      </span>
    </div>
  );
}
