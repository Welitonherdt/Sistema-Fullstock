import { useEffect, useState } from "react";
import PageHeader from "../components/ui/PageHeader";
import {
  ApiError,
  exportStockReport,
  listStockReport,
  type StockReportItem
} from "../services/api";

export default function ReportsPage() {
  const [rows, setRows] = useState<StockReportItem[]>([]);
  const [search, setSearch] = useState("");
  const [criticalOnly, setCriticalOnly] = useState(false);
  const [includeInactive, setIncludeInactive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");

  async function loadReport() {
    setLoading(true);
    setError("");
    try {
      const response = await listStockReport({
        search,
        criticalOnly,
        includeInactive
      });
      setRows(response);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Não foi possível gerar a visualização do relatório.");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadReport();
  }, [criticalOnly, includeInactive]);

  async function handleExport(format: "csv" | "xml" | "pdf") {
    setExporting(true);
    setError("");
    try {
      const { blob, fileName } = await exportStockReport(format, {
        search,
        criticalOnly,
        includeInactive
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Não foi possível exportar o relatório.");
      }
    } finally {
      setExporting(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Relatórios de Estoque"
        subtitle="Geração, visualização e exportação para impressão em CSV, XML e PDF."
      />

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
            onClick={() => void loadReport()}
            type="button"
          >
            Gerar visualização
          </button>
        </div>

        <div className="mt-3 flex flex-wrap gap-4">
          <label className="inline-flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={criticalOnly}
              onChange={(event) => setCriticalOnly(event.target.checked)}
            />
            Somente itens críticos
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

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => void handleExport("csv")}
            disabled={exporting}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-70"
          >
            Exportar CSV
          </button>
          <button
            type="button"
            onClick={() => void handleExport("xml")}
            disabled={exporting}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-70"
          >
            Exportar XML
          </button>
          <button
            type="button"
            onClick={() => void handleExport("pdf")}
            disabled={exporting}
            className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-brand-300"
          >
            Exportar PDF
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
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
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-500">
                  Gerando relatório...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-500">
                  Nenhum dado para o relatório.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={`${row.code}-${row.name}`} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm text-slate-700">
                    {row.code} - {row.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700">{row.category || "-"}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{row.currentQuantity}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{row.minimumQuantity}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{row.critical ? "Sim" : "Não"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
