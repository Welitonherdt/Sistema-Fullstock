import { useEffect, useState } from "react";
import PageHeader from "../components/ui/PageHeader";
import StatCard from "../components/ui/StatCard";
import { ApiError, getDashboardSummary, type DashboardSummary } from "../services/api";

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadSummary() {
    setLoading(true);
    setError("");
    try {
      const response = await getDashboardSummary();
      setSummary(response);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Não foi possível carregar o dashboard.");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadSummary();
  }, []);

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Visão geral do estoque e últimas movimentações." />

      {error ? (
        <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Produtos cadastrados" value={loading ? "..." : String(summary?.totalProducts ?? 0)} />
        <StatCard label="Itens críticos" value={loading ? "..." : String(summary?.criticalItems ?? 0)} />
        <StatCard label="Entradas hoje" value={loading ? "..." : String(summary?.entriesToday ?? 0)} />
        <StatCard label="Saídas hoje" value={loading ? "..." : String(summary?.exitsToday ?? 0)} />
      </div>

      <div className="mt-8">
        <PageHeader title="Últimas movimentações" subtitle="Histórico recente de entrada e saída." />
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Tipo</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Produto</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Quantidade</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-sm text-slate-500">
                    Carregando movimentações...
                  </td>
                </tr>
              ) : summary?.recentMovements?.length ? (
                summary.recentMovements.map((movement) => (
                  <tr key={movement.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm text-slate-700">{movement.type === "ENTRY" ? "Entrada" : "Saída"}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      {movement.productCode} - {movement.productName}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">{movement.quantity}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      {new Date(movement.movementDate).toLocaleString("pt-BR")}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-sm text-slate-500">
                    Nenhuma movimentação registrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
