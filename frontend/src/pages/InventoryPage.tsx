import PageHeader from "../components/ui/PageHeader";
import SimpleTable from "../components/ui/SimpleTable";

const inventory = [
  { codigo: "ROL-001", nome: "Rolamento 6205", saldo: "12", minimo: "5", critico: "Não" },
  { codigo: "PAR-002", nome: "Parafuso 10mm", saldo: "120", minimo: "50", critico: "Não" },
  { codigo: "LUV-003", nome: "Luva de proteção", saldo: "8", minimo: "10", critico: "Sim" }
];

export default function InventoryPage() {
  return (
    <>
      <PageHeader
        title="Consulta de Estoque"
        subtitle="Tela para listar saldo atual e destacar itens abaixo do mínimo."
      />
      <SimpleTable
        columns={[
          { key: "codigo", label: "Código" },
          { key: "nome", label: "Produto" },
          { key: "saldo", label: "Saldo" },
          { key: "minimo", label: "Mínimo" },
          { key: "critico", label: "Crítico" }
        ]}
        rows={inventory}
      />
    </>
  );
}
