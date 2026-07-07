import { createContext, useContext, useEffect, useState } from 'react';
import { loginRequest } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('recover-token'));
  const [username, setUsername] = useState(() => localStorage.getItem('recover-username'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token) localStorage.setItem('recover-token', token);
    else localStorage.removeItem('recover-token');
  }, [token]);

  const login = async (usernameInput, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await loginRequest(usernameInput, password);
      setToken(data.token);
      setUsername(data.username);
      localStorage.setItem('recover-username', data.username);
      return true;
    } catch (err) {
      setError(err.message || 'No se pudo iniciar sesion.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUsername(null);
    localStorage.removeItem('recover-token');
    localStorage.removeItem('recover-username');
    localStorage.removeItem('recover-operador');
  };

  return (
    <AuthContext.Provider
      value={{ token, username, isAuthenticated: !!token, login, logout, loading, error }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
