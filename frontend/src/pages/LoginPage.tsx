import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { ApiError } from "../services/api";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("admin@fullstock.local");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin() {
    setLoading(true);
    setError("");
    try {
      await login(email, password);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Nao foi possivel autenticar. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-brand-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 right-0 h-80 w-80 rounded-full bg-cyan-300/25 blur-3xl" />

      <div className="relative w-full max-w-md rounded-3xl border border-slate-200/80 bg-white/85 p-8 shadow-[0_30px_70px_-42px_rgba(12,38,67,0.62)] backdrop-blur-xl">
        <p className="text-xs uppercase tracking-[0.32em] text-brand-600">FullStock</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">Entrar no sistema</h1>
        <p className="mt-2 text-sm text-slate-600">Use os usuarios cadastrados no banco para acessar o sistema.</p>

        <div className="mt-8 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">E-mail</label>
            <input
              className="w-full rounded-xl border border-slate-300/90 bg-white px-4 py-3 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200/70"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@fullstock.local"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Senha</label>
            <input
              type="password"
              className="w-full rounded-xl border border-slate-300/90 bg-white px-4 py-3 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200/70"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="123456"
            />
          </div>

          {error ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
          ) : null}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-brand-700 to-brand-500 px-4 py-3 font-semibold text-white shadow-lg shadow-brand-800/30 transition hover:brightness-105 disabled:cursor-not-allowed disabled:from-brand-300 disabled:to-brand-300 disabled:shadow-none"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200/80 bg-slate-50/90 p-4 text-xs text-slate-600">
          <p><strong>Usuarios de teste:</strong></p>
          <p>admin@fullstock.local (ADMIN)</p>
          <p>almox@fullstock.com (ALMOXARIFE)</p>
          <p>usuario@fullstock.local (USUARIO)</p>
          <p>Senha padrao inicial: 123456</p>
        </div>
      </div>
    </div>
  );
}
