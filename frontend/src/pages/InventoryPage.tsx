import { useEffect, useState } from "react";
import PageHeader from "../components/ui/PageHeader";
import { ApiError, listInventory, type InventoryItem } from "../services/api";

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [search, setSearch] = useState("");
  const [criticalOnly, setCriticalOnly] = useState(false);
  const [includeInactive, setIncludeInactive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadInventory() {
    setLoading(true);
    setError("");
    try {
      const response = await listInventory({
        search,
        criticalOnly,
        includeInactive
      });
      setItems(response);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Não foi possível consultar o estoque.");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadInventory();
  }, [criticalOnly, includeInactive]);

  return (
    <>
      <PageHeader title="Consulta de Estoque" subtitle="Visualização e pesquisa de saldo atual dos produtos." />

      {error ? (
        <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
      ) : null}

      <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-col gap-3 md:flex-row">
          <input
            className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
            placeholder="Pesquisar por código, nome ou categoria"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <button
            className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
            type="button"
            onClick={() => void loadInventory()}
          >
            Pesquisar
          </button>
        </div>

        <div className="mt-3 flex flex-wrap gap-4">
          <label className="inline-flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={criticalOnly}
              onChange={(event) => setCriticalOnly(event.target.checked)}
            />
            Somente críticos
          </label>

          <label className="inline-flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={includeInactive}
              onChange={(event) => setIncludeInactive(event.target.checked)}
            />
            Incluir inativos
          </label>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Código</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Produto</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Categoria</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Saldo</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Mínimo</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Crítico</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-500">
                  Carregando estoque...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-500">
                  Nenhum item encontrado.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.productId} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm text-slate-700">{item.code}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{item.name}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{item.category || "-"}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{item.currentQuantity}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{item.minimumQuantity}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{item.critical ? "Sim" : "Não"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
