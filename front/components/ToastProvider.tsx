"use client";

import { createContext, useCallback, useContext, useState, useEffect } from "react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue>({ toast: () => {} });

let nextId = 1;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = "error") => {
    const id = nextId++;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed right-4 top-4 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <ToastItem key={t.id} toast={t} onClose={() => setToasts(prev => prev.filter(x => x.id !== t.id))} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  const styles: Record<ToastType, string> = {
    error:   "bg-red-600 text-white",
    success: "bg-green-600 text-white",
    info:    "bg-[#2563eb] text-white",
  };
  const icons: Record<ToastType, string> = {
    error:   "✕",
    success: "✓",
    info:    "ℹ",
  };

  return (
    <div className={`pointer-events-auto flex items-start gap-3 rounded-xl px-4 py-3 shadow-lg max-w-sm animate-slide-in ${styles[toast.type]}`}>
      <span className="mt-0.5 shrink-0 text-sm font-bold">{icons[toast.type]}</span>
      <p className="text-sm leading-snug">{toast.message}</p>
      <button onClick={onClose} className="ml-auto shrink-0 opacity-70 hover:opacity-100 text-sm leading-none">✕</button>
    </div>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
