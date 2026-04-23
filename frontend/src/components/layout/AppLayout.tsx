import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

type NavItem = {
  to: string;
  label: string;
  roles: Array<"ADMIN" | "ALMOXARIFE" | "USUARIO">;
};

const navItems: NavItem[] = [
  { to: "/", label: "Dashboard", roles: ["ADMIN", "ALMOXARIFE", "USUARIO"] },
  { to: "/users", label: "Usuarios", roles: ["ADMIN"] },
  { to: "/products", label: "Produtos", roles: ["ADMIN", "ALMOXARIFE", "USUARIO"] },
  { to: "/movements", label: "Movimentacoes", roles: ["ADMIN", "ALMOXARIFE", "USUARIO"] },
  { to: "/inventory", label: "Estoque", roles: ["ADMIN", "ALMOXARIFE", "USUARIO"] },
  { to: "/reports", label: "Relatorios", roles: ["ADMIN", "ALMOXARIFE", "USUARIO"] }
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { logout, userName, role, email } = useAuth();
  const visibleItems = navItems.filter((item) => role && item.roles.includes(role));

  return (
    <div className="min-h-screen text-slate-800">
      <div className="mx-auto flex min-h-screen w-full max-w-[1600px] flex-col gap-4 p-4 lg:flex-row lg:gap-6 lg:p-6">
        <aside className="relative overflow-hidden rounded-3xl border border-slate-700/40 bg-slate-950/90 p-5 text-white shadow-[0_25px_70px_-35px_rgba(2,14,31,0.9)] backdrop-blur-xl lg:w-72">
          <div className="pointer-events-none absolute -left-20 -top-14 h-44 w-44 rounded-full bg-brand-500/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -right-16 h-48 w-48 rounded-full bg-cyan-300/10 blur-3xl" />

          <div className="relative mb-6 rounded-2xl border border-slate-700/70 bg-slate-900/70 p-4">
            <p className="text-[11px] uppercase tracking-[0.28em] text-slate-400">FullStock</p>
            <h1 className="mt-2 text-2xl font-bold text-white">Painel</h1>
            <p className="mt-3 truncate text-sm font-semibold text-slate-100">{userName}</p>
            <p className="truncate text-xs text-slate-400">{email}</p>
            <span className="mt-3 inline-flex rounded-full border border-brand-400/30 bg-brand-500/20 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-brand-200">
              {role}
            </span>
          </div>

          <nav className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-1">
            {visibleItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `group relative rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-lg shadow-brand-900/35"
                      : "bg-slate-800/80 text-slate-200 hover:-translate-y-0.5 hover:bg-slate-700/90"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <button
            onClick={logout}
            className="mt-6 w-full rounded-xl border border-slate-600/70 bg-slate-900/60 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:border-slate-500 hover:bg-slate-800/90"
          >
            Sair
          </button>
        </aside>

        <main className="relative flex-1 overflow-hidden rounded-3xl border border-[var(--app-card-border)] bg-[var(--app-card)] shadow-[0_26px_70px_-38px_rgba(16,42,69,0.45)] backdrop-blur-xl">
          <div className="pointer-events-none absolute -top-24 right-10 h-64 w-64 rounded-full bg-brand-300/20 blur-3xl" />
          <div className="relative h-full overflow-y-auto p-4 sm:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
