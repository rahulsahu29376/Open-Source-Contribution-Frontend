import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(({ title, message, type = 'info', duration = 4000 }) => {
    const id = Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
    const newToast = { id, title, message, type };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const showSuccess = (message, title = 'Success') => addToast({ message, title, type: 'success' });
  const showError = (message, title = 'Error') => addToast({ message, title, type: 'error', duration: 6000 });
  const showWarning = (message, title = 'Warning') => addToast({ message, title, type: 'warning' });
  const showInfo = (message, title = 'Info') => addToast({ message, title, type: 'info' });

  return (
    <ToastContext.Provider value={{ addToast, removeToast, showSuccess, showError, showWarning, showInfo }}>
      {children}
      {/* Toast Notification Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full px-4 pointer-events-none">
        {toasts.map((toast) => {
          let bg = 'bg-white dark:bg-surface-cardDark border-surface-borderLight dark:border-surface-borderDark text-textMain-light dark:text-textMain-dark';
          let icon = <Info className="w-5 h-5 text-primary" />;

          if (toast.type === 'success') {
            bg = 'bg-success-light dark:bg-surface-cardDark border-success/30 text-textMain-light dark:text-textMain-dark';
            icon = <CheckCircle2 className="w-5 h-5 text-success" />;
          } else if (toast.type === 'error') {
            bg = 'bg-error-light dark:bg-surface-cardDark border-error/30 text-textMain-light dark:text-textMain-dark';
            icon = <AlertCircle className="w-5 h-5 text-error" />;
          } else if (toast.type === 'warning') {
            bg = 'bg-warning-light dark:bg-surface-cardDark border-warning/30 text-textMain-light dark:text-textMain-dark';
            icon = <AlertTriangle className="w-5 h-5 text-warning" />;
          }

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg animate-fade-in transition-all ${bg}`}
            >
              <div className="shrink-0 mt-0.5">{icon}</div>
              <div className="flex-1 min-w-0">
                {toast.title && <h4 className="font-semibold text-sm">{toast.title}</h4>}
                <p className="text-xs text-textMain-mutedLight dark:text-textMain-mutedDark mt-0.5 break-words">
                  {toast.message}
                </p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="shrink-0 text-textMain-mutedLight dark:text-textMain-mutedDark hover:text-textMain-light dark:hover:text-textMain-dark p-1 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
