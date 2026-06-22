import { useEffect, useState } from "react";
import Modal from "../components/ui/Modal";
import PageHeader from "../components/ui/PageHeader";
import { useAuth } from "../contexts/AuthContext";
import {
  ApiError,
  createLocation,
  listLocations,
  updateLocation,
  updateLocationStatus,
  type Location
} from "../services/api";

type LocationFormState = {
  code: string;
  name: string;
  description: string;
  active: boolean;
};

const initialForm: LocationFormState = {
  code: "",
  name: "",
  description: "",
  active: true
};

export default function LocationsPage() {
  const { role } = useAuth();
  const canManage = role === "ADMIN" || role === "ALMOXARIFE";

  const [locations, setLocations] = useState<Location[]>([]);
  const [form, setForm] = useState<LocationFormState>(initialForm);
  const [search, setSearch] = useState("");
  const [showInactive, setShowInactive] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadLocations() {
    setLoading(true);
    setError("");
    try {
      const response = await listLocations({
        search,
        active: showInactive ? undefined : true
      });
      setLocations(response);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Não foi possível carregar as localizações.");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadLocations();
  }, [showInactive]);

  function openCreatePopup() {
    setEditingId(null);
    setForm(initialForm);
    setIsFormOpen(true);
  }

  function startEdit(location: Location) {
    setEditingId(location.id);
    setForm({
      code: location.code,
      name: location.name,
      description: location.description ?? "",
      active: location.active
    });
    setIsFormOpen(true);
  }

  function closeForm() {
    setIsFormOpen(false);
    setEditingId(null);
    setForm(initialForm);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canManage) {
      return;
    }

    setSaving(true);
    setError("");
    try {
      const payload = {
        code: form.code,
        name: form.name,
        description: form.description || null,
        active: form.active
      };

      if (editingId) {
        await updateLocation(editingId, payload);
      } else {
        await createLocation(payload);
      }

      closeForm();
      await loadLocations();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Não foi possível salvar a localização.");
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleActive(location: Location) {
    if (!canManage) {
      return;
    }

    try {
      await updateLocationStatus(location.id, !location.active);
      await loadLocations();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Não foi possível atualizar o status da localização.");
      }
    }
  }

  return (
    <>
      <PageHeader title="Localizações" subtitle="Cadastre e gerencie os locais físicos do almoxarifado." />

      {error ? (
        <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
      ) : null}

      <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-col gap-3 md:flex-row">
          <input
            className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
            placeholder="Pesquisar por código, nome ou descrição"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <button
            className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
            onClick={() => void loadLocations()}
            type="button"
          >
            Pesquisar
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <label className="inline-flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={showInactive}
              onChange={(event) => setShowInactive(event.target.checked)}
            />
            Mostrar localizações inativas
          </label>

          {canManage ? (
            <button
              type="button"
              onClick={openCreatePopup}
              className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
            >
              Novo cadastro
            </button>
          ) : null}
        </div>
      </div>

      {!canManage ? (
        <div className="mb-6 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-800">
          Seu perfil está em modo visualização para localizações.
        </div>
      ) : null}

      <Modal
        open={isFormOpen}
        title={editingId ? "Editar localização" : "Nova localização"}
        onClose={closeForm}
        closeOnEscape={false}
        closeOnBackdropClick={false}
        showHeaderCloseButton={false}
      >
        <form onSubmit={handleSubmit}>
          <div className="grid gap-3 md:grid-cols-2">
            <input
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
              placeholder="Código (ex.: PRAT-01)"
              value={form.code}
              onChange={(event) => setForm((prev) => ({ ...prev, code: event.target.value }))}
              required
            />
            <input
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
              placeholder="Nome da localização"
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              required
            />
          </div>

          <textarea
            className="mt-3 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
            placeholder="Descrição (opcional)"
            value={form.description}
            onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
            rows={3}
          />

          <label className="mt-3 inline-flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(event) => setForm((prev) => ({ ...prev, active: event.target.checked }))}
            />
            Localização ativa
          </label>

          <div className="mt-4 flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-brand-300"
            >
              {saving ? "Salvando..." : editingId ? "Salvar alterações" : "Cadastrar localização"}
            </button>
            <button
              type="button"
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              onClick={closeForm}
            >
              Cancelar
            </button>
          </div>
        </form>
      </Modal>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Código</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Nome</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Descrição</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-500">
                  Carregando localizações...
                </td>
              </tr>
            ) : locations.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-500">
                  Nenhuma localização encontrada.
                </td>
              </tr>
            ) : (
              locations.map((location) => (
                <tr key={location.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm text-slate-700">{location.code}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{location.name}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{location.description || "-"}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{location.active ? "Ativo" : "Inativo"}</td>
                  <td className="px-4 py-3 text-sm">
                    {canManage ? (
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          className="rounded-lg border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
                          onClick={() => startEdit(location)}
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          className="rounded-lg border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
                          onClick={() => void handleToggleActive(location)}
                        >
                          {location.active ? "Desativar" : "Ativar"}
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">Somente leitura</span>
                    )}
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

