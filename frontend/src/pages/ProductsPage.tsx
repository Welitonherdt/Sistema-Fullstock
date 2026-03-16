import PageHeader from "../components/ui/PageHeader";
import SimpleTable from "../components/ui/SimpleTable";

const products = [
  { codigo: "ROL-001", nome: "Rolamento 6205", categoria: "Mecânica", saldo: "12", minimo: "5" },
  { codigo: "PAR-002", nome: "Parafuso 10mm", categoria: "Fixação", saldo: "120", minimo: "50" },
  { codigo: "LUV-003", nome: "Luva de proteção", categoria: "EPI", saldo: "8", minimo: "10" }
];

export default function ProductsPage() {
  return (
    <>
      <PageHeader
        title="Produtos"
        subtitle="Catálogo base de materiais/peças do almoxarifado."
      />
      <SimpleTable
        columns={[
          { key: "codigo", label: "Código" },
          { key: "nome", label: "Produto" },
          { key: "categoria", label: "Categoria" },
          { key: "saldo", label: "Saldo Atual" },
          { key: "minimo", label: "Mínimo" }
        ]}
        rows={products}
      />
    </>
  );
}
