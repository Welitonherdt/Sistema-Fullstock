import PageHeader from "../components/ui/PageHeader";
import SimpleTable from "../components/ui/SimpleTable";

const criticalRows = [
  { produto: "Luva de proteção", saldo: "8", minimo: "10", status: "Abaixo do mínimo" }
];

export default function ReportsPage() {
  return (
    <>
      <PageHeader
        title="Relatórios"
        subtitle="Visão inicial do módulo de relatórios para validar o escopo."
      />

      <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <h3 className="text-lg font-bold text-slate-900">Relatórios previstos no MVP</h3>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-600">
          <li>Movimentações por período</li>
          <li>Estoque crítico</li>
          <li>Produtos com maior consumo</li>
          <li>Exportação CSV/PDF em fase futura</li>
        </ul>
      </div>

      <SimpleTable
        columns={[
          { key: "produto", label: "Produto" },
          { key: "saldo", label: "Saldo Atual" },
          { key: "minimo", label: "Mínimo" },
          { key: "status", label: "Status" }
        ]}
        rows={criticalRows}
      />
    </>
  );
}
