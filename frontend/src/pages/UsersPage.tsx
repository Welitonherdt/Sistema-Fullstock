import PageHeader from "../components/ui/PageHeader";
import SimpleTable from "../components/ui/SimpleTable";

const users = [
  { nome: "Administrador", email: "admin@fullstock.local", perfil: "ADMIN", ativo: "Sim" },
  { nome: "Almoxarife", email: "almox@fullstock.local", perfil: "ALMOXARIFE", ativo: "Sim" },
  { nome: "Usuário Consulta", email: "usuario@fullstock.local", perfil: "USUARIO", ativo: "Sim" }
];

export default function UsersPage() {
  return (
    <>
      <PageHeader
        title="Usuários"
        subtitle="Tela base para futura gestão de usuários e perfis."
      />
      <SimpleTable
        columns={[
          { key: "nome", label: "Nome" },
          { key: "email", label: "E-mail" },
          { key: "perfil", label: "Perfil" },
          { key: "ativo", label: "Ativo" }
        ]}
        rows={users}
      />
    </>
  );
}
