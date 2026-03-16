import PageHeader from "../components/ui/PageHeader";
import StatCard from "../components/ui/StatCard";
import SimpleTable from "../components/ui/SimpleTable";

const recentMovements = [
  { tipo: "Entrada", produto: "Rolamento 6205", quantidade: 20, data: "15/03/2026 08:00" },
  { tipo: "Saída", produto: "Luva de proteção", quantidade: 4, data: "15/03/2026 10:15" },
  { tipo: "Entrada", produto: "Parafuso 10mm", quantidade: 100, data: "14/03/2026 17:30" }
];

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Visão inicial para validar a direção do projeto FullStock."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Produtos cadastrados" value="3" helper="Apenas dados simulados" />
        <StatCard label="Itens críticos" value="1" helper="current_quantity <= minimum_quantity" />
        <StatCard label="Entradas hoje" value="2" helper="Movimentações simuladas" />
        <StatCard label="Saídas hoje" value="1" helper="Movimentações simuladas" />
      </div>

      <div className="mt-8">
        <PageHeader
          title="Últimas movimentações"
          subtitle="Tabela visual para testar se o fluxo de estoque faz sentido."
        />
        <SimpleTable
          columns={[
            { key: "tipo", label: "Tipo" },
            { key: "produto", label: "Produto" },
            { key: "quantidade", label: "Quantidade" },
            { key: "data", label: "Data" }
          ]}
          rows={recentMovements}
        />
      </div>
    </>
  );
}
