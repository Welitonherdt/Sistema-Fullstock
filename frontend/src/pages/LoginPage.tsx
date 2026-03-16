import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("admin@fullstock.local");
  const [password, setPassword] = useState("123456");

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-200">
        <p className="text-sm uppercase tracking-[0.3em] text-brand-600">FullStock</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">Entrar no sistema</h1>
        <p className="mt-2 text-sm text-slate-500">
          Esta tela usa login simulado para você validar o fluxo inicial da aplicação.
        </p>

        <div className="mt-8 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">E-mail</label>
            <input
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-brand-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@fullstock.local"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Senha</label>
            <input
              type="password"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-brand-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="123456"
            />
          </div>

          <button
            onClick={() => login(email, password)}
            className="w-full rounded-xl bg-brand-600 px-4 py-3 font-semibold text-white hover:bg-brand-700"
          >
            Entrar
          </button>
        </div>

        <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-xs text-slate-500">
          <p><strong>Teste rápido:</strong></p>
          <p>admin@fullstock.local → ADMIN</p>
          <p>almox@fullstock.local → ALMOXARIFE</p>
        </div>
      </div>
    </div>
  );
}
