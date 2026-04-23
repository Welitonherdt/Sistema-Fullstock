import { useEffect, useState } from "react";
import PageHeader from "../components/ui/PageHeader";
import {
  ApiError,
  createUser,
  listUsers,
  updateUser,
  updateUserStatus,
  type Role,
  type User
} from "../services/api";

type UserFormState = {
  name: string;
  email: string;
  password: string;
  role: Role;
  active: boolean;
};

const initialForm: UserFormState = {
  name: "",
  email: "",
  password: "",
  role: "USUARIO",
  active: true
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState<UserFormState>(initialForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadUsers() {
    setLoading(true);
    setError("");
    try {
      const response = await listUsers();
      setUsers(response);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Não foi possível carregar os usuários.");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadUsers();
  }, []);

  function startEdit(user: User) {
    setEditingId(user.id);
    setForm({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      active: user.active
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editingId) {
        await updateUser(editingId, {
          name: form.name,
          email: form.email,
          password: form.password || undefined,
          role: form.role,
          active: form.active
        });
      } else {
        await createUser({
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
          active: form.active
        });
      }
      setForm(initialForm);
      setEditingId(null);
      await loadUsers();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Não foi possível salvar o usuário.");
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleActive(user: User) {
    try {
      await updateUserStatus(user.id, !user.active);
      await loadUsers();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Não foi possível atualizar o status do usuário.");
      }
    }
  }

  return (
    <>
      <PageHeader title="Usuários" subtitle="Gerencie contas de acesso e perfis do sistema." />

      {error ? (
        <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
      ) : null}

      <form onSubmit={handleSubmit} className="mb-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <h3 className="mb-4 text-lg font-bold text-slate-900">{editingId ? "Editar usuário" : "Novo usuário"}</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <input
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
            placeholder="Nome completo"
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            required
          />
          <input
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
            placeholder="E-mail"
            type="email"
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            required
          />
          <input
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
            placeholder={editingId ? "Senha (opcional para manter)" : "Senha"}
            type="password"
            value={form.password}
            onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
            required={!editingId}
            minLength={6}
          />
          <select
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
            value={form.role}
            onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value as Role }))}
          >
            <option value="ADMIN">ADMIN</option>
            <option value="ALMOXARIFE">ALMOXARIFE</option>
            <option value="USUARIO">USUARIO</option>
          </select>
        </div>

        <label className="mt-3 inline-flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(event) => setForm((prev) => ({ ...prev, active: event.target.checked }))}
          />
          Usuário ativo
        </label>

        <div className="mt-4 flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-brand-300"
          >
            {saving ? "Salvando..." : editingId ? "Salvar alterações" : "Cadastrar usuário"}
          </button>

          {editingId ? (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm(initialForm);
              }}
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Cancelar edição
            </button>
          ) : null}
        </div>
      </form>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Nome</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">E-mail</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Perfil</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Ativo</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-500">
                  Carregando usuários...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-500">
                  Nenhum usuário cadastrado.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm text-slate-700">{user.name}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{user.email}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{user.role}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{user.active ? "Sim" : "Não"}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex flex-wrap gap-2">
                      <button
                        className="rounded-lg border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
                        onClick={() => startEdit(user)}
                        type="button"
                      >
                        Editar
                      </button>
                      <button
                        className="rounded-lg border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
                        onClick={() => void handleToggleActive(user)}
                        type="button"
                      >
                        {user.active ? "Desativar" : "Ativar"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
