import { createContext, useContext, useMemo, useState } from "react";

type AuthContextType = {
  authenticated: boolean;
  userName: string;
  role: string;
  login: (email: string, password: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState<boolean>(() => Boolean(localStorage.getItem("fullstock_auth")));
  const [userName, setUserName] = useState<string>(() => localStorage.getItem("fullstock_user_name") || "Administrador");
  const [role, setRole] = useState<string>(() => localStorage.getItem("fullstock_role") || "ADMIN");

  const value = useMemo<AuthContextType>(() => ({
    authenticated,
    userName,
    role,
    login: (email: string) => {
      localStorage.setItem("fullstock_auth", "true");
      localStorage.setItem("fullstock_user_name", email.includes("almox") ? "Almoxarife" : "Administrador");
      localStorage.setItem("fullstock_role", email.includes("almox") ? "ALMOXARIFE" : "ADMIN");
      setUserName(email.includes("almox") ? "Almoxarife" : "Administrador");
      setRole(email.includes("almox") ? "ALMOXARIFE" : "ADMIN");
      setAuthenticated(true);
    },
    logout: () => {
      localStorage.removeItem("fullstock_auth");
      localStorage.removeItem("fullstock_user_name");
      localStorage.removeItem("fullstock_role");
      setAuthenticated(false);
      setUserName("");
      setRole("");
    }
  }), [authenticated, role, userName]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}
