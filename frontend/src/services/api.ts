export type Role = "ADMIN" | "ALMOXARIFE" | "USUARIO";

export type LoginResponse = {
  token: string;
  userId: number;
  name: string;
  email: string;
  role: Role;
};

export type User = {
  id: number;
  name: string;
  email: string;
  role: Role;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Product = {
  id: number;
  code: string;
  name: string;
  description: string | null;
  category: string | null;
  unitMeasure: string;
  currentQuantity: number;
  minimumQuantity: number;
  critical: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type MovementType = "ENTRY" | "EXIT";

export type Movement = {
  id: number;
  type: MovementType;
  productId: number;
  productCode: string;
  productName: string;
  quantity: number;
  movementDate: string;
  supplier: string | null;
  destination: string | null;
  notes: string | null;
  createdById: number;
  createdByName: string;
  createdAt: string;
};

export type InventoryItem = {
  productId: number;
  code: string;
  name: string;
  category: string | null;
  unitMeasure: string;
  currentQuantity: number;
  minimumQuantity: number;
  critical: boolean;
  active: boolean;
};

export type StockReportItem = {
  code: string;
  name: string;
  category: string | null;
  unitMeasure: string;
  currentQuantity: number;
  minimumQuantity: number;
  critical: boolean;
  active: boolean;
};

export type DashboardSummary = {
  totalProducts: number;
  criticalItems: number;
  entriesToday: number;
  exitsToday: number;
  recentMovements: Movement[];
};

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

const API_BASE_URL = "http://localhost:8080/api";

function getToken() {
  return localStorage.getItem("fullstock_token");
}

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json"
  };

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: options.method ?? "GET",
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body)
    });
  } catch {
    throw new ApiError(
      "Não foi possível conectar à API. Verifique se o backend está ativo em http://localhost:8080.",
      0
    );
  }

  if (!response.ok) {
    const errorPayload = await parseJsonSafely(response);
    const message = extractErrorMessage(errorPayload) || `Erro HTTP ${response.status}`;
    throw new ApiError(message, response.status, errorPayload);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

async function parseJsonSafely(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) {
    return null;
  }
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

function extractErrorMessage(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    return null;
  }
  if ("message" in payload && typeof payload.message === "string") {
    return payload.message;
  }
  return null;
}

function toQueryString(params: Record<string, string | number | boolean | undefined | null>) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }
    query.append(key, String(value));
  });
  const asString = query.toString();
  return asString ? `?${asString}` : "";
}

export async function login(email: string, password: string) {
  return request<LoginResponse>("/auth/login", {
    method: "POST",
    body: { email, password }
  });
}

export async function getDashboardSummary() {
  return request<DashboardSummary>("/dashboard/summary");
}

export async function listUsers() {
  return request<User[]>("/users");
}

export async function createUser(payload: {
  name: string;
  email: string;
  password: string;
  role: Role;
  active?: boolean;
}) {
  return request<User>("/users", { method: "POST", body: payload });
}

export async function updateUser(
  id: number,
  payload: { name: string; email: string; password?: string; role: Role; active: boolean }
) {
  return request<User>(`/users/${id}`, { method: "PUT", body: payload });
}

export async function updateUserStatus(id: number, active: boolean) {
  return request<User>(`/users/${id}/status`, { method: "PATCH", body: { active } });
}

export async function listProducts(params: {
  search?: string;
  active?: boolean;
  critical?: boolean;
} = {}) {
  const query = toQueryString(params);
  return request<Product[]>(`/products${query}`);
}

export async function createProduct(payload: {
  code: string;
  name: string;
  description?: string | null;
  category?: string | null;
  unitMeasure: string;
  currentQuantity: number;
  minimumQuantity: number;
  active?: boolean;
}) {
  return request<Product>("/products", { method: "POST", body: payload });
}

export async function updateProduct(
  id: number,
  payload: {
    code: string;
    name: string;
    description?: string | null;
    category?: string | null;
    unitMeasure: string;
    currentQuantity: number;
    minimumQuantity: number;
    active?: boolean;
  }
) {
  return request<Product>(`/products/${id}`, { method: "PUT", body: payload });
}

export async function updateProductStatus(id: number, active: boolean) {
  return request<Product>(`/products/${id}/status`, { method: "PATCH", body: { active } });
}

export async function deleteProduct(id: number) {
  return request<{ message: string }>(`/products/${id}`, { method: "DELETE" });
}

export async function listMovements(params: {
  type?: MovementType;
  productId?: number;
  startDate?: string;
  endDate?: string;
} = {}) {
  const query = toQueryString(params);
  return request<Movement[]>(`/movements${query}`);
}

export async function createEntry(payload: {
  productId: number;
  quantity: number;
  supplier?: string;
  notes?: string;
}) {
  return request<Movement>("/movements/entry", { method: "POST", body: payload });
}

export async function createExit(payload: {
  productId: number;
  quantity: number;
  destination?: string;
  notes?: string;
}) {
  return request<Movement>("/movements/exit", { method: "POST", body: payload });
}

export async function listInventory(params: {
  search?: string;
  criticalOnly?: boolean;
  includeInactive?: boolean;
} = {}) {
  const query = toQueryString(params);
  return request<InventoryItem[]>(`/inventory${query}`);
}

export async function listStockReport(params: {
  search?: string;
  criticalOnly?: boolean;
  includeInactive?: boolean;
} = {}) {
  const query = toQueryString(params);
  return request<StockReportItem[]>(`/reports/stock${query}`);
}

export async function exportStockReport(
  format: "csv" | "xml" | "pdf",
  params: {
    search?: string;
    criticalOnly?: boolean;
    includeInactive?: boolean;
  } = {}
) {
  const query = toQueryString({ format, ...params });
  const token = getToken();

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/reports/stock/export${query}`, {
      method: "GET",
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
  } catch {
    throw new ApiError(
      "Não foi possível conectar à API. Verifique se o backend está ativo em http://localhost:8080.",
      0
    );
  }

  if (!response.ok) {
    const errorPayload = await parseJsonSafely(response);
    const message = extractErrorMessage(errorPayload) || `Erro HTTP ${response.status}`;
    throw new ApiError(message, response.status, errorPayload);
  }

  const contentDisposition = response.headers.get("Content-Disposition") ?? "";
  const fileNameMatch = contentDisposition.match(/filename="?([^"]+)"?/i);
  const fileName = fileNameMatch ? fileNameMatch[1] : `relatorio-estoque.${format}`;

  return {
    blob: await response.blob(),
    fileName
  };
}
