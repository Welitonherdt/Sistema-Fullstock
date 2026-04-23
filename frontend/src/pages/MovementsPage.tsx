import { useEffect, useState } from "react";
import PageHeader from "../components/ui/PageHeader";
import { useAuth } from "../contexts/AuthContext";
import {
  ApiError,
  createEntry,
  createExit,
  listMovements,
  listProducts,
  type Movement,
  type Product
} from "../services/api";

type EntryForm = {
  productId: string;
  quantity: string;
  supplier: string;
  notes: string;
};

type ExitForm = {
  productId: string;
  quantity: string;
  destination: string;
  notes: string;
};

const initialEntryForm: EntryForm = {
  productId: "",
  quantity: "",
  supplier: "",
  notes: ""
};

const initialExitForm: ExitForm = {
  productId: "",
  quantity: "",
  destination: "",
  notes: ""
};

export default function MovementsPage() {
  const { role } = useAuth();
  const canManage = role === "ADMIN" || role === "ALMOXARIFE";

  const [products, setProducts] = useState<Product[]>([]);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [entryForm, setEntryForm] = useState<EntryForm>(initialEntryForm);
  const [exitForm, setExitForm] = useState<ExitForm>(initialExitForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const selectedEntryProduct = products.find((product) => String(product.id) === entryForm.productId);
  const selectedExitProduct = products.find((product) => String(product.id) === exitForm.productId);

  function parsePositiveInteger(value: string) {
    const quantity = Number(value);
    if (!Number.isInteger(quantity) || quantity <= 0) {
      return null;
    }
    return quantity;
  }

  async function loadData() {
    setLoading(true);
    setError("");
    try {
      const [productsResponse, movementsResponse] = await Promise.all([
        listProducts({ active: true }),
        listMovements()
      ]);
      setProducts(productsResponse);
      setMovements(movementsResponse);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Não foi possível carregar movimentações.");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  async function handleEntry(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canManage) {
      return;
    }

    const quantity = parsePositiveInteger(entryForm.quantity);
    if (quantity === null) {
      setError("Quantidade deve ser um numero inteiro maior que zero.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      await createEntry({
        productId: Number(entryForm.productId),
        quantity,
        supplier: entryForm.supplier || undefined,
        notes: entryForm.notes || undefined
      });
      setEntryForm(initialEntryForm);
      await loadData();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Não foi possível registrar a entrada.");
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleExit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canManage) {
      return;
    }

    const quantity = parsePositiveInteger(exitForm.quantity);
    if (quantity === null) {
      setError("Quantidade deve ser um numero inteiro maior que zero.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      await createExit({
        productId: Number(exitForm.productId),
        quantity,
        destination: exitForm.destination || undefined,
        notes: exitForm.notes || undefined
      });
      setExitForm(initialExitForm);
      await loadData();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Não foi possível registrar a saída.");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <PageHeader title="Movimentações" subtitle="Entradas e saídas de estoque com histórico completo." />

      {error ? (
        <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
      ) : null}

      {canManage ? (
        <div className="mb-6 grid gap-4 md:grid-cols-2">
          <form onSubmit={handleEntry} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <h3 className="text-lg font-bold text-slate-900">Entrada</h3>
            <div className="mt-3 space-y-3">
              <select
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
                value={entryForm.productId}
                onChange={(event) => setEntryForm((prev) => ({ ...prev, productId: event.target.value }))}
                required
              >
                <option value="">Selecione o produto</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.code} - {product.name}
                  </option>
                ))}
              </select>
              {selectedEntryProduct ? (
                <p className="text-xs text-slate-500">
                  Saldo atual: {selectedEntryProduct.currentQuantity} | Minimo de pecas: {selectedEntryProduct.minimumQuantity}
                </p>
              ) : null}
              <input
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
                placeholder="Quantidade"
                value={entryForm.quantity}
                onChange={(event) => setEntryForm((prev) => ({ ...prev, quantity: event.target.value }))}
                type="number"
                min="1"
                step="1"
                inputMode="numeric"
                required
              />
              <input
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
                placeholder="Fornecedor (opcional)"
                value={entryForm.supplier}
                onChange={(event) => setEntryForm((prev) => ({ ...prev, supplier: event.target.value }))}
              />
              <textarea
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
                placeholder="Observações (opcional)"
                value={entryForm.notes}
                onChange={(event) => setEntryForm((prev) => ({ ...prev, notes: event.target.value }))}
                rows={2}
              />
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-brand-300"
              >
                Registrar entrada
              </button>
            </div>
          </form>

          <form onSubmit={handleExit} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <h3 className="text-lg font-bold text-slate-900">Saída</h3>
            <div className="mt-3 space-y-3">
              <select
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
                value={exitForm.productId}
                onChange={(event) => setExitForm((prev) => ({ ...prev, productId: event.target.value }))}
                required
              >
                <option value="">Selecione o produto</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.code} - {product.name}
                  </option>
                ))}
              </select>
              {selectedExitProduct ? (
                <p className="text-xs text-slate-500">
                  Saldo atual: {selectedExitProduct.currentQuantity} | Minimo de pecas: {selectedExitProduct.minimumQuantity}
                </p>
              ) : null}
              <input
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
                placeholder="Quantidade"
                value={exitForm.quantity}
                onChange={(event) => setExitForm((prev) => ({ ...prev, quantity: event.target.value }))}
                type="number"
                min="1"
                step="1"
                inputMode="numeric"
                required
              />
              <input
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
                placeholder="Destino (opcional)"
                value={exitForm.destination}
                onChange={(event) => setExitForm((prev) => ({ ...prev, destination: event.target.value }))}
              />
              <textarea
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
                placeholder="Observações (opcional)"
                value={exitForm.notes}
                onChange={(event) => setExitForm((prev) => ({ ...prev, notes: event.target.value }))}
                rows={2}
              />
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-brand-300"
              >
                Registrar saída
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="mb-6 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-800">
          Seu perfil está em modo visualização para movimentações.
        </div>
      )}

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Tipo</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Produto</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Quantidade</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Responsável</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Data</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-500">
                  Carregando movimentações...
                </td>
              </tr>
            ) : movements.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-500">
                  Nenhuma movimentação encontrada.
                </td>
              </tr>
            ) : (
              movements.map((movement) => (
                <tr key={movement.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm text-slate-700">{movement.type === "ENTRY" ? "Entrada" : "Saída"}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">
                    {movement.productCode} - {movement.productName}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700">{movement.quantity}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{movement.createdByName}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">
                    {new Date(movement.movementDate).toLocaleString("pt-BR")}
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
