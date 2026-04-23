export default function StatCard({
  label,
  value,
  helper
}: {
  label: string;
  value: string;
  helper?: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/85 p-5 shadow-[0_22px_45px_-35px_rgba(15,42,70,0.55)] transition hover:-translate-y-0.5 hover:shadow-[0_30px_50px_-32px_rgba(15,42,70,0.65)]">
      <div className="pointer-events-none absolute -right-9 -top-8 h-16 w-16 rounded-full bg-brand-200/60 blur-xl transition group-hover:bg-brand-300/70" />
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-bold text-slate-900">{value}</p>
      {helper && <p className="mt-2 text-xs text-slate-500">{helper}</p>}
    </div>
  );
}
