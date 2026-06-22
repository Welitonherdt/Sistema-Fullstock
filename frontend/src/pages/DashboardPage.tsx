import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/ui/PageHeader";
import StatCard from "../components/ui/StatCard";
import {
  ApiError,
  getDashboardSummary,
  listInventory,
  type DashboardSummary,
  type InventoryItem
} from "../services/api";

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [criticalItems, setCriticalItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadSummary() {
    setLoading(true);
    setError("");
    try {
      const [summaryResponse, criticalResponse] = await Promise.all([
        getDashboardSummary(),
        listInventory({ criticalOnly: true, includeInactive: false })
      ]);
      setSummary(summaryResponse);
      setCriticalItems(criticalResponse);
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

      <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50/80 p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-amber-900">Aviso de estoque baixo</h3>
            <p className="mt-1 text-sm text-amber-800">
              {loading
                ? "Verificando níveis de estoque..."
                : criticalItems.length > 0
                  ? `${criticalItems.length} item(ns) estão no limite mínimo ou abaixo.`
                  : "Nenhum item com nível baixo no momento."}
            </p>
          </div>
          <Link
            to="/inventory"
            className="rounded-xl border border-amber-300 bg-white px-4 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-100"
          >
            Ver estoque
          </Link>
        </div>

        {!loading && criticalItems.length > 0 ? (
          <div className="mt-4 overflow-hidden rounded-xl border border-amber-200 bg-white">
            <table className="min-w-full divide-y divide-amber-100">
              <thead className="bg-amber-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-amber-800">Produto</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-amber-800">Local</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-amber-800">Saldo</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-amber-800">Mínimo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-100">
                {criticalItems.slice(0, 5).map((item) => (
                  <tr key={item.productId}>
                    <td className="px-4 py-2 text-sm text-slate-700">
                      {item.code} - {item.name}
                    </td>
                    <td className="px-4 py-2 text-sm text-slate-700">
                      {item.locationCode} - {item.locationName}
                    </td>
                    <td className="px-4 py-2 text-sm font-semibold text-rose-700">{item.currentQuantity}</td>
                    <td className="px-4 py-2 text-sm text-slate-700">{item.minimumQuantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>

      <div className="mt-8">
        <PageHeader title="Últimas movimentações" subtitle="Histórico recente de entrada, saída e empréstimo." />
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
                    <td className="px-4 py-3 text-sm text-slate-700">
                      {movement.type === "ENTRY" ? "Entrada" : movement.type === "EXIT" ? "Saída" : "Empréstimo"}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      {movement.productCode} - {movement.productName}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">{movement.quantity}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{new Date(movement.movementDate).toLocaleString("pt-BR")}</td>
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

