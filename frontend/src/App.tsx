import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import UsersPage from "./pages/UsersPage";
import ProductsPage from "./pages/ProductsPage";
import MovementsPage from "./pages/MovementsPage";
import InventoryPage from "./pages/InventoryPage";
import ReportsPage from "./pages/ReportsPage";
import AppLayout from "./components/layout/AppLayout";

function ProtectedArea() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/movements" element={<MovementsPage />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/reports" element={<ReportsPage />} />
      </Routes>
    </AppLayout>
  );
}

export default function App() {
  const { authenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={authenticated ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route path="/*" element={authenticated ? <ProtectedArea /> : <Navigate to="/login" replace />} />
    </Routes>
  );
}
