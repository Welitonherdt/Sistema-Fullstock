import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const navItems = [
  { to: "/", label: "Dashboard" },
  { to: "/users", label: "Usuários" },
  { to: "/products", label: "Produtos" },
  { to: "/movements", label: "Movimentações" },
  { to: "/inventory", label: "Estoque" },
  { to: "/reports", label: "Relatórios" }
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { logout, userName, role } = useAuth();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <div className="flex min-h-screen">
        <aside className="w-72 bg-slate-900 text-white p-6">
          <div className="mb-10">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">FullStock</p>
            <h1 className="mt-2 text-2xl font-bold">Painel Inicial</h1>
            <p className="mt-3 text-sm text-slate-300">{userName}</p>
            <p className="text-xs text-slate-400">{role}</p>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `block rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive ? "bg-brand-600 text-white" : "bg-slate-800 text-slate-200 hover:bg-slate-700"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <button
            onClick={logout}
            className="mt-10 w-full rounded-xl border border-slate-700 px-4 py-3 text-sm font-medium text-slate-100 hover:bg-slate-800"
          >
            Sair
          </button>
        </aside>

        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
