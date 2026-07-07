import { useEffect, useRef, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { History, LogOut, Moon, Search, Sun, User, ChevronDown, Check } from 'lucide-react';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useOperator } from '../contexts/OperatorContext';
import { logoutRequest } from '../services/authService';
import { useToast } from '../contexts/ToastContext';
import { cn } from '../utils/cn';

const OPERADORES = [
  { value: 'IGNACIO', label: 'Ignacio' },
  { value: 'MARIANO', label: 'Mariano' },
  { value: 'TOBIAS', label: 'Tobias' },
  { value: 'ANTONELLA', label: 'Antonella' },
];

export function Navbar({ search, onSearchChange }) {
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const { operador, setOperador, clearOperador } = useOperator();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [operatorMenuOpen, setOperatorMenuOpen] = useState(false);
  const operatorMenuRef = useRef(null);

  useEffect(() => {
    if (!operatorMenuOpen) return;
    const handleClickOutside = (e) => {
      if (operatorMenuRef.current && !operatorMenuRef.current.contains(e.target)) {
        setOperatorMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [operatorMenuOpen]);

  const handleLogout = async () => {
    try {
      await logoutRequest(operador);
    } catch {
      // no bloquear el logout si falla el registro del historial
    }
    clearOperador();
    logout();
    showToast('Sesion cerrada correctamente.', 'info');
    navigate('/login');
  };

  const handleSelectOperador = (value) => {
    if (value !== operador) {
      setOperador(value);
      const label = OPERADORES.find((op) => op.value === value)?.label || value;
      showToast(`Ahora estas usando el sistema como ${label}.`, 'info');
    }
    setOperatorMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2.5">
          <img src="/logo-recover-icon.png" alt="RECOVER" className="h-9 w-9 rounded-md object-contain bg-white" />
          <div className="hidden sm:block">
            <p className="text-sm font-semibold leading-tight text-foreground">RECOVER</p>
            <p className="text-[11px] leading-tight text-muted-foreground">
              Rehabilitacion y Readaptacion Fisica
            </p>
          </div>
        </div>

        {onSearchChange && (
          <div className="relative ml-2 hidden max-w-sm flex-1 md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <Input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar paciente..."
              className="pl-9"
            />
          </div>
        )}

        <div className="ml-auto flex items-center gap-2">
          <Link
            to={location.pathname === '/historial' ? '/' : '/historial'}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-smooth hover:bg-muted hover:text-foreground"
          >
            <History size={16} />
            <span className="hidden sm:inline">{location.pathname === '/historial' ? 'Pacientes' : 'Historial'}</span>
          </Link>

          <Button variant="ghost" size="icon" onClick={toggleTheme} title="Cambiar tema">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </Button>

          {/* Selector de operador: clickeable, permite cambiar entre
              Ignacio y Juan sin cerrar sesion */}
          <div className="relative" ref={operatorMenuRef}>
            <button
              type="button"
              onClick={() => setOperatorMenuOpen((prev) => !prev)}
              className="flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 transition-smooth hover:bg-muted"
            >
              <User size={16} className="text-primary" />
              <span className="text-sm font-medium">
                {OPERADORES.find((op) => op.value === operador)?.label || operador}
              </span>
              <ChevronDown
                size={14}
                className={cn('text-muted-foreground transition-smooth', operatorMenuOpen && 'rotate-180')}
              />
            </button>

            {operatorMenuOpen && (
              <div className="absolute right-0 top-[calc(100%+6px)] w-44 overflow-hidden rounded-lg border border-border bg-card shadow-soft-lg animate-scale-in">
                <p className="px-3 pb-1 pt-2.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  Cambiar usuario
                </p>
                {OPERADORES.map((op) => (
                  <button
                    key={op.value}
                    onClick={() => handleSelectOperador(op.value)}
                    className="flex w-full items-center justify-between px-3 py-2 text-sm transition-smooth hover:bg-muted"
                  >
                    {op.label}
                    {operador === op.value && <Check size={14} className="text-primary" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Button variant="outline" size="icon" onClick={handleLogout} title="Cerrar sesion">
            <LogOut size={18} />
          </Button>
        </div>
      </div>
    </header>
  );
}
