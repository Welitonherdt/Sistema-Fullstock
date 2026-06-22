import { useEffect, useState } from "react";
import Modal from "../components/ui/Modal";
import PageHeader from "../components/ui/PageHeader";
import { useAuth } from "../contexts/AuthContext";
import {
  ApiError,
  createProduct,
  deleteProduct,
  listLocations,
  listProducts,
  updateProduct,
  updateProductStatus,
  type Location,
  type Product
} from "../services/api";

type ProductFormState = {
  code: string;
  name: string;
  description: string;
  category: string;
  locationId: string;
  unitMeasure: string;
  currentQuantity: string;
  minimumQuantity: string;
  active: boolean;
};

const initialForm: ProductFormState = {
  code: "",
  name: "",
  description: "",
  category: "",
  locationId: "",
  unitMeasure: "UN",
  currentQuantity: "0",
  minimumQuantity: "0",
  active: true
};

export default function ProductsPage() {
  const { role } = useAuth();
  const canManage = role === "ADMIN" || role === "ALMOXARIFE";

  const [products, setProducts] = useState<Product[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [form, setForm] = useState<ProductFormState>(initialForm);
  const [search, setSearch] = useState("");
  const [showInactive, setShowInactive] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function parseNonNegativeInteger(value: string) {
    const quantity = Number(value);
    if (!Number.isInteger(quantity) || quantity < 0) {
      return null;
    }
    return quantity;
  }

  async function loadLocations() {
    try {
      const response = await listLocations({ active: true });
      setLocations(response);
    } catch {
      setLocations([]);
    }
  }

  async function loadProducts() {
    setLoading(true);
    setError("");
    try {
      const response = await listProducts({
        search,
        active: showInactive ? undefined : true
      });
      setProducts(response);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Não foi possível carregar os produtos.");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadProducts();
  }, [showInactive]);

  useEffect(() => {
    void loadLocations();
  }, []);

  function openCreatePopup() {
    setEditingId(null);
    setForm(initialForm);
    setIsFormOpen(true);
  }

  function startEdit(product: Product) {
    setEditingId(product.id);
    setForm({
      code: product.code,
      name: product.name,
      description: product.description ?? "",
      category: product.category ?? "",
      locationId: String(product.locationId),
      unitMeasure: product.unitMeasure,
      currentQuantity: String(product.currentQuantity),
      minimumQuantity: String(product.minimumQuantity),
      active: product.active
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

    const currentQuantity = parseNonNegativeInteger(form.currentQuantity);
    const minimumQuantity = parseNonNegativeInteger(form.minimumQuantity);
    const locationId = Number(form.locationId);
    if (currentQuantity === null || minimumQuantity === null) {
      setError("Saldo e quantidade mínima devem ser números inteiros (sem quebrados).");
      return;
    }
    if (!Number.isInteger(locationId) || locationId <= 0) {
      setError("Selecione uma localização válida para o produto.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const payload = {
        code: form.code,
        name: form.name,
        description: form.description || null,
        category: form.category || null,
        locationId,
        unitMeasure: form.unitMeasure,
        currentQuantity,
        minimumQuantity,
        active: form.active
      };

      if (editingId) {
        await updateProduct(editingId, payload);
      } else {
        await createProduct(payload);
      }

      closeForm();
      await loadProducts();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Não foi possível salvar o produto.");
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleActive(product: Product) {
    if (!canManage) {
      return;
    }
    try {
      await updateProductStatus(product.id, !product.active);
      await loadProducts();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Não foi possível atualizar o status do produto.");
      }
    }
  }

  async function handleDelete(product: Product) {
    if (!canManage) {
      return;
    }
    if (!window.confirm(`Remover o produto ${product.name}?`)) {
      return;
    }
    try {
      await deleteProduct(product.id);
      await loadProducts();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Não foi possível remover o produto.");
      }
    }
  }

  return (
    <>
      <PageHeader title="Produtos" subtitle="Cadastro e controle dos itens do almoxarifado." />

      {error ? (
        <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
      ) : null}

      <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-col gap-3 md:flex-row">
          <input
            className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
            placeholder="Pesquisar por código, nome, categoria ou local"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <button
            className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
            onClick={() => void loadProducts()}
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
            Mostrar produtos inativos
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
          Seu perfil está em modo visualização para produtos.
        </div>
      ) : null}

      <Modal
        open={isFormOpen}
        title={editingId ? "Editar produto" : "Novo produto"}
        onClose={closeForm}
        closeOnEscape={false}
        closeOnBackdropClick={false}
        showHeaderCloseButton={false}
      >
        <form onSubmit={handleSubmit}>
          <div className="grid gap-3 md:grid-cols-2">
            <label className="flex flex-col gap-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Código</span>
              <input
                className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
                placeholder="Ex.: PAR-002"
                value={form.code}
                onChange={(event) => setForm((prev) => ({ ...prev, code: event.target.value }))}
                required
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Nome</span>
              <input
                className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
                placeholder="Ex.: Parafuso 10mm"
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                required
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Categoria</span>
              <input
                className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
                placeholder="Ex.: Fixação"
                value={form.category}
                onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Localização</span>
              <select
                className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
                value={form.locationId}
                onChange={(event) => setForm((prev) => ({ ...prev, locationId: event.target.value }))}
                required
              >
                <option value="">Selecione uma localização</option>
                {locations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.code} - {location.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Unidade</span>
              <input
                className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
                placeholder="Ex.: UN"
                value={form.unitMeasure}
                onChange={(event) => setForm((prev) => ({ ...prev, unitMeasure: event.target.value }))}
                required
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Quantidade Atual</span>
              <input
                className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
                value={form.currentQuantity}
                onChange={(event) => setForm((prev) => ({ ...prev, currentQuantity: event.target.value }))}
                type="number"
                step="1"
                min="0"
                inputMode="numeric"
                required
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Quantidade Mínima</span>
              <input
                className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
                value={form.minimumQuantity}
                onChange={(event) => setForm((prev) => ({ ...prev, minimumQuantity: event.target.value }))}
                type="number"
                step="1"
                min="0"
                inputMode="numeric"
                required
              />
            </label>
          </div>

          <label className="mt-3 flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Descrição</span>
            <textarea
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
              placeholder="Descrição do produto (opcional)"
              value={form.description}
              onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
              rows={3}
            />
          </label>

          <label className="mt-3 inline-flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(event) => setForm((prev) => ({ ...prev, active: event.target.checked }))}
            />
            Produto ativo
          </label>

          <div className="mt-4 flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-brand-300"
            >
              {saving ? "Salvando..." : editingId ? "Salvar alterações" : "Cadastrar produto"}
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
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Categoria</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Localização</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Saldo</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Mínimo</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-sm text-slate-500">
                  Carregando produtos...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-sm text-slate-500">
                  Nenhum produto encontrado.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm text-slate-700">{product.code}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{product.name}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{product.category || "-"}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{product.locationCode} - {product.locationName}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{product.currentQuantity}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{product.minimumQuantity}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">
                    {product.active ? "Ativo" : "Inativo"} {product.critical ? "(Crítico)" : ""}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {canManage ? (
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          className="rounded-lg border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
                          onClick={() => startEdit(product)}
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          className="rounded-lg border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
                          onClick={() => void handleToggleActive(product)}
                        >
                          {product.active ? "Desativar" : "Ativar"}
                        </button>
                        <button
                          type="button"
                          className="rounded-lg border border-rose-300 px-3 py-1 text-xs font-medium text-rose-700 hover:bg-rose-50"
                          onClick={() => void handleDelete(product)}
                        >
                          Excluir
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

