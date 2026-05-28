export default function PageHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-6 rounded-2xl border border-slate-200/80 bg-white/70 px-5 py-4 shadow-[0_18px_40px_-35px_rgba(15,42,70,0.65)] backdrop-blur-sm">
      <h2 className="text-3xl font-bold text-slate-900">{title}</h2>
      <p className="mt-2 text-sm text-slate-600">{subtitle}</p>
    </div>
  );
}
