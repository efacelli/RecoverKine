import { createContext, useCallback, useContext, useState } from 'react';
import { CheckCircle2, Info, XCircle } from 'lucide-react';
import { cn } from '../utils/cn';

const ToastContext = createContext(null);

const ICONS = {
  success: CheckCircle2,
  info: Info,
  error: XCircle,
};

const STYLES = {
  success: 'bg-success text-success-foreground',
  info: 'bg-info text-white',
  error: 'bg-destructive text-destructive-foreground',
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success', duration = 3500) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
    return id;
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, dismissToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => {
          const Icon = ICONS[toast.type] || Info;
          return (
            <div
              key={toast.id}
              className={cn(
                'pointer-events-auto flex items-center gap-2 rounded-xl px-4 py-3 shadow-soft-lg animate-slide-up min-w-[280px]',
                STYLES[toast.type]
              )}
            >
              <Icon size={18} />
              <span className="text-sm font-medium">{toast.message}</span>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
