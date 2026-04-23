export default function PageHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-6 rounded-2xl border border-slate-200/80 bg-white/70 px-5 py-4 shadow-[0_18px_40px_-35px_rgba(15,42,70,0.65)] backdrop-blur-sm">
      <span className="inline-flex rounded-full border border-brand-200 bg-brand-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-700">
        FullStock
      </span>
      <h2 className="mt-3 text-3xl font-bold text-slate-900">{title}</h2>
      <p className="mt-2 text-sm text-slate-600">{subtitle}</p>
    </div>
  );
}
