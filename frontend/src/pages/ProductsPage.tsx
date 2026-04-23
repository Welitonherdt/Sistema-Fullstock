import { useEffect, useState } from "react";
import PageHeader from "../components/ui/PageHeader";
import { useAuth } from "../contexts/AuthContext";
import {
  ApiError,
  createProduct,
  deleteProduct,
  listProducts,
  updateProduct,
  updateProductStatus,
  type Product
} from "../services/api";

type ProductFormState = {
  code: string;
  name: string;
  description: string;
  category: string;
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
  unitMeasure: "UN",
  currentQuantity: "0",
  minimumQuantity: "0",
  active: true
};

export default function ProductsPage() {
  const { role } = useAuth();
  const canManage = role === "ADMIN" || role === "ALMOXARIFE";

  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<ProductFormState>(initialForm);
  const [search, setSearch] = useState("");
  const [showInactive, setShowInactive] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
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
        setError("Nao foi possivel carregar os produtos.");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadProducts();
  }, [showInactive]);

  function startEdit(product: Product) {
    setEditingId(product.id);
    setForm({
      code: product.code,
      name: product.name,
      description: product.description ?? "",
      category: product.category ?? "",
      unitMeasure: product.unitMeasure,
      currentQuantity: String(product.currentQuantity),
      minimumQuantity: String(product.minimumQuantity),
      active: product.active
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canManage) {
      return;
    }

    const currentQuantity = parseNonNegativeInteger(form.currentQuantity);
    const minimumQuantity = parseNonNegativeInteger(form.minimumQuantity);
    if (currentQuantity === null || minimumQuantity === null) {
      setError("Saldo e quantidade minima devem ser numeros inteiros (sem quebrados).");
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

      setEditingId(null);
      setForm(initialForm);
      await loadProducts();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Nao foi possivel salvar o produto.");
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
        setError("Nao foi possivel atualizar o status do produto.");
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
        setError("Nao foi possivel remover o produto.");
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
            placeholder="Pesquisar por codigo, nome ou categoria"
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

        <label className="mt-3 inline-flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={showInactive}
            onChange={(event) => setShowInactive(event.target.checked)}
          />
          Mostrar produtos inativos
        </label>
      </div>

      {canManage ? (
        <form onSubmit={handleSubmit} className="mb-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <h3 className="mb-4 text-lg font-bold text-slate-900">{editingId ? "Editar produto" : "Novo produto"}</h3>
          <div className="grid gap-3 md:grid-cols-2">
            <label className="flex flex-col gap-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Codigo</span>
              <span className="text-xs text-slate-500">Identificador unico do produto.</span>
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
              <span className="text-xs text-slate-500">Nome principal exibido no estoque e relatorios.</span>
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
              <span className="text-xs text-slate-500">Agrupamento para facilitar busca e filtro.</span>
              <input
                className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
                placeholder="Ex.: Fixacao"
                value={form.category}
                onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Unidade</span>
              <span className="text-xs text-slate-500">Formato de contagem (UN, CX, PAR etc.).</span>
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
              <span className="text-xs text-slate-500">Saldo atual disponivel em estoque (somente inteiro).</span>
              <input
                className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
                placeholder="Ex.: 120"
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
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Quantidade Minima</span>
              <span className="text-xs text-slate-500">Limite minimo de pecas antes de ficar critico.</span>
              <input
                className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
                placeholder="Ex.: 50"
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
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Descricao</span>
            <span className="text-xs text-slate-500">Detalhes tecnicos ou observacoes do item (opcional).</span>
            <textarea
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
              placeholder="Descricao do produto (opcional)"
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
              {saving ? "Salvando..." : editingId ? "Salvar alteracoes" : "Cadastrar produto"}
            </button>
            {editingId ? (
              <button
                type="button"
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                onClick={() => {
                  setEditingId(null);
                  setForm(initialForm);
                }}
              >
                Cancelar edicao
              </button>
            ) : null}
          </div>
        </form>
      ) : (
        <div className="mb-6 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-800">
          Seu perfil esta em modo visualizacao para produtos.
        </div>
      )}

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Codigo</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Nome</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Categoria</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Saldo</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Minimo</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Acoes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-sm text-slate-500">
                  Carregando produtos...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-sm text-slate-500">
                  Nenhum produto encontrado.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm text-slate-700">{product.code}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{product.name}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{product.category || "-"}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{product.currentQuantity}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{product.minimumQuantity}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">
                    {product.active ? "Ativo" : "Inativo"} {product.critical ? "(Critico)" : ""}
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
