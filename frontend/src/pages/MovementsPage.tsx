import PageHeader from "../components/ui/PageHeader";
import SimpleTable from "../components/ui/SimpleTable";

const movements = [
  { tipo: "ENTRY", produto: "Rolamento 6205", quantidade: "20", responsavel: "Administrador" },
  { tipo: "EXIT", produto: "Luva de proteção", quantidade: "4", responsavel: "Almoxarife" },
  { tipo: "ENTRY", produto: "Parafuso 10mm", quantidade: "100", responsavel: "Administrador" }
];

export default function MovementsPage() {
  return (
    <>
      <PageHeader
        title="Movimentações"
        subtitle="Base para entradas, saídas e histórico do estoque."
      />

      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <h3 className="text-lg font-bold text-slate-900">Entrada</h3>
          <p className="mt-2 text-sm text-slate-500">
            Nesta versão base, esta área serve apenas para representar onde ficará o formulário de entrada.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <h3 className="text-lg font-bold text-slate-900">Saída</h3>
          <p className="mt-2 text-sm text-slate-500">
            Aqui ficará o formulário de saída com validação para impedir estoque negativo.
          </p>
        </div>
      </div>

      <SimpleTable
        columns={[
          { key: "tipo", label: "Tipo" },
          { key: "produto", label: "Produto" },
          { key: "quantidade", label: "Quantidade" },
          { key: "responsavel", label: "Responsável" }
        ]}
        rows={movements}
      />
    </>
  );
}
