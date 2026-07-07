import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { SelectOperatorPage } from './pages/SelectOperatorPage';
import { DashboardPage } from './pages/DashboardPage';
import { HistoryPage } from './pages/HistoryPage';
import { ProtectedRoute } from './layouts/ProtectedRoute';
import { useAuth } from './contexts/AuthContext';

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/seleccionar-usuario" /> : <LoginPage />} />
      <Route
        path="/seleccionar-usuario"
        element={isAuthenticated ? <SelectOperatorPage /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/historial"
        element={
          <ProtectedRoute>
            <HistoryPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
