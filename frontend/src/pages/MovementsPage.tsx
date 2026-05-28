import { useEffect, useState } from "react";
import Modal from "../components/ui/Modal";
import PageHeader from "../components/ui/PageHeader";
import { useAuth } from "../contexts/AuthContext";
import {
  ApiError,
  createEntry,
  createExit,
  createLoan,
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

type LoanForm = {
  productId: string;
  quantity: string;
  borrowerName: string;
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

const initialLoanForm: LoanForm = {
  productId: "",
  quantity: "",
  borrowerName: "",
  notes: ""
};

export default function MovementsPage() {
  const { role } = useAuth();
  const canManage = role === "ADMIN" || role === "ALMOXARIFE";

  const [products, setProducts] = useState<Product[]>([]);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [entryForm, setEntryForm] = useState<EntryForm>(initialEntryForm);
  const [exitForm, setExitForm] = useState<ExitForm>(initialExitForm);
  const [loanForm, setLoanForm] = useState<LoanForm>(initialLoanForm);
  const [isEntryOpen, setIsEntryOpen] = useState(false);
  const [isExitOpen, setIsExitOpen] = useState(false);
  const [isLoanOpen, setIsLoanOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const selectedEntryProduct = products.find((product) => String(product.id) === entryForm.productId);
  const selectedExitProduct = products.find((product) => String(product.id) === exitForm.productId);
  const selectedLoanProduct = products.find((product) => String(product.id) === loanForm.productId);

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
      const [productsResponse, movementsResponse] = await Promise.all([listProducts({ active: true }), listMovements()]);
      setProducts(productsResponse);
      setMovements(movementsResponse);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Nao foi possivel carregar movimentacoes.");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  function closeEntryModal() {
    setIsEntryOpen(false);
    setEntryForm(initialEntryForm);
  }

  function closeExitModal() {
    setIsExitOpen(false);
    setExitForm(initialExitForm);
  }

  function closeLoanModal() {
    setIsLoanOpen(false);
    setLoanForm(initialLoanForm);
  }

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
      closeEntryModal();
      await loadData();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Nao foi possivel registrar a entrada.");
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
      closeExitModal();
      await loadData();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Nao foi possivel registrar a saida.");
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleLoan(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canManage) {
      return;
    }

    const quantity = parsePositiveInteger(loanForm.quantity);
    if (quantity === null) {
      setError("Quantidade deve ser um numero inteiro maior que zero.");
      return;
    }
    if (!loanForm.borrowerName.trim()) {
      setError("Informe o nome da pessoa que pegou no emprestimo.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      await createLoan({
        productId: Number(loanForm.productId),
        quantity,
        borrowerName: loanForm.borrowerName.trim(),
        notes: loanForm.notes || undefined
      });
      closeLoanModal();
      await loadData();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Nao foi possivel registrar o emprestimo.");
      }
    } finally {
      setSaving(false);
    }
  }

  function movementTypeLabel(type: Movement["type"]) {
    if (type === "ENTRY") {
      return "Entrada";
    }
    if (type === "EXIT") {
      return "Saida";
    }
    return "Emprestimo";
  }

  return (
    <>
      <PageHeader title="Movimentacoes" subtitle="Entradas, saidas e emprestimos de ferramentas/pecas." />

      {error ? (
        <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
      ) : null}

      {canManage ? (
        <div className="mb-6 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={() => setIsEntryOpen(true)}
            className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Nova entrada
          </button>
          <button
            type="button"
            onClick={() => setIsExitOpen(true)}
            className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Nova saida
          </button>
          <button
            type="button"
            onClick={() => setIsLoanOpen(true)}
            className="rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700"
          >
            Novo emprestimo
          </button>
        </div>
      ) : (
        <div className="mb-6 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-800">
          Seu perfil esta em modo visualizacao para movimentacoes.
        </div>
      )}

      <Modal open={isEntryOpen} title="Registrar entrada" onClose={closeEntryModal}>
        <form onSubmit={handleEntry}>
          <div className="space-y-3">
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
              placeholder="Observacoes (opcional)"
              value={entryForm.notes}
              onChange={(event) => setEntryForm((prev) => ({ ...prev, notes: event.target.value }))}
              rows={2}
            />
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-brand-300"
              >
                Registrar entrada
              </button>
              <button
                type="button"
                onClick={closeEntryModal}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Cancelar
              </button>
            </div>
          </div>
        </form>
      </Modal>

      <Modal open={isExitOpen} title="Registrar saida" onClose={closeExitModal}>
        <form onSubmit={handleExit}>
          <div className="space-y-3">
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
              placeholder="Observacoes (opcional)"
              value={exitForm.notes}
              onChange={(event) => setExitForm((prev) => ({ ...prev, notes: event.target.value }))}
              rows={2}
            />
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-brand-300"
              >
                Registrar saida
              </button>
              <button
                type="button"
                onClick={closeExitModal}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Cancelar
              </button>
            </div>
          </div>
        </form>
      </Modal>

      <Modal open={isLoanOpen} title="Registrar emprestimo de ferramenta/peca" onClose={closeLoanModal}>
        <form onSubmit={handleLoan}>
          <div className="space-y-3">
            <select
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
              value={loanForm.productId}
              onChange={(event) => setLoanForm((prev) => ({ ...prev, productId: event.target.value }))}
              required
            >
              <option value="">Selecione o item emprestado</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.code} - {product.name}
                </option>
              ))}
            </select>
            {selectedLoanProduct ? (
              <p className="text-xs text-slate-500">
                Saldo atual: {selectedLoanProduct.currentQuantity} | Minimo de pecas: {selectedLoanProduct.minimumQuantity}
              </p>
            ) : null}
            <input
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
              placeholder="Quantidade emprestada"
              value={loanForm.quantity}
              onChange={(event) => setLoanForm((prev) => ({ ...prev, quantity: event.target.value }))}
              type="number"
              min="1"
              step="1"
              inputMode="numeric"
              required
            />
            <input
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
              placeholder="Nome da pessoa que pegou"
              value={loanForm.borrowerName}
              onChange={(event) => setLoanForm((prev) => ({ ...prev, borrowerName: event.target.value }))}
              required
            />
            <textarea
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
              placeholder="Observacoes (opcional)"
              value={loanForm.notes}
              onChange={(event) => setLoanForm((prev) => ({ ...prev, notes: event.target.value }))}
              rows={2}
            />
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700 disabled:cursor-not-allowed disabled:bg-amber-300"
              >
                Registrar emprestimo
              </button>
              <button
                type="button"
                onClick={closeLoanModal}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Cancelar
              </button>
            </div>
          </div>
        </form>
      </Modal>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Tipo</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Produto</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Quantidade</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Quem pegou</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Responsavel</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Data</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-500">
                  Carregando movimentacoes...
                </td>
              </tr>
            ) : movements.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-500">
                  Nenhuma movimentacao encontrada.
                </td>
              </tr>
            ) : (
              movements.map((movement) => (
                <tr key={movement.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm text-slate-700">{movementTypeLabel(movement.type)}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">
                    {movement.productCode} - {movement.productName}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700">{movement.quantity}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{movement.borrowerName || "-"}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{movement.createdByName}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{new Date(movement.movementDate).toLocaleString("pt-BR")}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
