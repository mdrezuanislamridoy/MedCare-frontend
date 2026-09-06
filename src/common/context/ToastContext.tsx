"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

interface ToastContextType {
  toasts: ToastItem[];
  showToast: (message: string, type?: ToastType, title?: string, duration?: number) => void;
  removeToast: (id: string) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

// Global event bus for non-hook usage (e.g. inside api client or event listeners)
export const toast = {
  show: (message: string, type: ToastType = "info", title?: string) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("medcare:toast", {
          detail: { message, type, title },
        }),
      );
    }
  },
  success: (message: string, title?: string) => toast.show(message, "success", title),
  error: (message: string, title?: string) => toast.show(message, "error", title),
  warning: (message: string, title?: string) => toast.show(message, "warning", title),
  info: (message: string, title?: string) => toast.show(message, "info", title),
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = "info", title?: string, duration: number = 4500) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const newToast: ToastItem = { id, type, title, message, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast],
  );

  const success = useCallback((msg: string, title?: string) => showToast(msg, "success", title), [showToast]);
  const error = useCallback((msg: string, title?: string) => showToast(msg, "error", title), [showToast]);
  const warning = useCallback((msg: string, title?: string) => showToast(msg, "warning", title), [showToast]);
  const info = useCallback((msg: string, title?: string) => showToast(msg, "info", title), [showToast]);

  // Listen for global custom events
  useEffect(() => {
    const handleCustomToast = (e: Event) => {
      const customEvent = e as CustomEvent<{ message: string; type?: ToastType; title?: string }>;
      if (customEvent.detail) {
        showToast(customEvent.detail.message, customEvent.detail.type || "info", customEvent.detail.title);
      }
    };

    window.addEventListener("medcare:toast", handleCustomToast);
    return () => {
      window.removeEventListener("medcare:toast", handleCustomToast);
    };
  }, [showToast]);

  return (
    <ToastContext.Provider
      value={{
        toasts,
        showToast,
        removeToast,
        success,
        error,
        warning,
        info,
      }}
    >
      {children}

      {/* Floating Toast Notification Container */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="pointer-events-none fixed top-4 right-4 z-[9999] flex w-full max-w-sm flex-col gap-2.5 sm:max-w-md px-4 sm:px-0"
      >
        {toasts.map((t) => {
          let bgStyle = "bg-white border-slate-200 text-slate-800 shadow-xl shadow-slate-900/10";
          let icon = <Info className="h-5 w-5 text-sky-600 shrink-0 mt-0.5" />;
          let titleColor = "text-slate-900";

          if (t.type === "error") {
            bgStyle = "bg-red-50/95 border-red-200 text-red-900 shadow-xl shadow-red-950/10";
            icon = <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />;
            titleColor = "text-red-950";
          } else if (t.type === "success") {
            bgStyle = "bg-teal-50/95 border-teal-200 text-teal-950 shadow-xl shadow-teal-950/10";
            icon = <CheckCircle2 className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />;
            titleColor = "text-teal-950";
          } else if (t.type === "warning") {
            bgStyle = "bg-amber-50/95 border-amber-200 text-amber-950 shadow-xl shadow-amber-950/10";
            icon = <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />;
            titleColor = "text-amber-950";
          }

          return (
            <div
              key={t.id}
              role="alert"
              className={`pointer-events-auto flex w-full items-start gap-3 rounded-xl border p-3.5 sm:p-4 text-xs sm:text-sm backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-top-3 ${bgStyle}`}
            >
              {icon}
              <div className="flex-1 min-w-0">
                {t.title && <div className={`font-bold text-xs uppercase tracking-wider mb-0.5 ${titleColor}`}>{t.title}</div>}
                <p className="leading-snug break-words">{t.message}</p>
              </div>
              <button
                type="button"
                onClick={() => removeToast(t.id)}
                aria-label="Close notification"
                className="shrink-0 rounded-lg p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    // Fallback to global event dispatcher if outside context
    return {
      toasts: [],
      showToast: toast.show,
      removeToast: () => {},
      success: toast.success,
      error: toast.error,
      warning: toast.warning,
      info: toast.info,
    };
  }
  return context;
}
