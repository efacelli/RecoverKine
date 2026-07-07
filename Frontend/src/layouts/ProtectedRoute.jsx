import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useOperator } from '../contexts/OperatorContext';

export function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const { operador } = useOperator();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!operador) return <Navigate to="/seleccionar-usuario" replace />;

  return children;
}
