import { createContext, useContext, useMemo, useState } from "react";
import { login as loginRequest, type Role } from "../services/api";

type AuthContextType = {
  authenticated: boolean;
  userId: number | null;
  userName: string;
  email: string;
  role: Role | "";
  token: string;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
  token: "fullstock_token",
  userId: "fullstock_user_id",
  userName: "fullstock_user_name",
  email: "fullstock_user_email",
  role: "fullstock_role"
};

function normalizeRole(value: unknown): Role | "" {
  if (value === "ADMIN" || value === "ALMOXARIFE" || value === "USUARIO") {
    return value;
  }
  return "";
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) {
      return null;
    }

    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    const json = atob(padded);
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string>(() => localStorage.getItem(STORAGE_KEYS.token) || "");
  const [userId, setUserId] = useState<number | null>(() => {
    const raw = localStorage.getItem(STORAGE_KEYS.userId);
    if (!raw) {
      return null;
    }
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : null;
  });
  const [userName, setUserName] = useState<string>(() => localStorage.getItem(STORAGE_KEYS.userName) || "");
  const [email, setEmail] = useState<string>(() => localStorage.getItem(STORAGE_KEYS.email) || "");
  const [role, setRole] = useState<Role | "">(() => {
    const stored = normalizeRole(localStorage.getItem(STORAGE_KEYS.role));
    if (stored) {
      return stored;
    }

    const currentToken = localStorage.getItem(STORAGE_KEYS.token) || "";
    if (!currentToken) {
      return "";
    }

    const payload = decodeJwtPayload(currentToken);
    const roleFromToken = normalizeRole(payload?.role);
    if (roleFromToken) {
      localStorage.setItem(STORAGE_KEYS.role, roleFromToken);
      return roleFromToken;
    }

    return "";
  });

  const value = useMemo<AuthContextType>(() => ({
    authenticated: Boolean(token),
    userId,
    userName,
    email,
    role,
    token,
    login: async (userEmail: string, password: string) => {
      const response = await loginRequest(userEmail, password);

      localStorage.setItem(STORAGE_KEYS.token, response.token);
      localStorage.setItem(STORAGE_KEYS.userId, String(response.userId));
      localStorage.setItem(STORAGE_KEYS.userName, response.name);
      localStorage.setItem(STORAGE_KEYS.email, response.email);
      localStorage.setItem(STORAGE_KEYS.role, response.role);

      setToken(response.token);
      setUserId(response.userId);
      setUserName(response.name);
      setEmail(response.email);
      setRole(response.role);
    },
    logout: () => {
      localStorage.removeItem(STORAGE_KEYS.token);
      localStorage.removeItem(STORAGE_KEYS.userId);
      localStorage.removeItem(STORAGE_KEYS.userName);
      localStorage.removeItem(STORAGE_KEYS.email);
      localStorage.removeItem(STORAGE_KEYS.role);

      setToken("");
      setUserId(null);
      setUserName("");
      setEmail("");
      setRole("");
    }
  }), [email, role, token, userId, userName]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return ctx;
}
