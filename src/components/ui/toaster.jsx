"use client";

import { useEffect } from "react";
import { useToast } from "./use-toast";

export function toaster() {
  const { toasts } = useToast();

  useEffect(() => {}, [toasts]);

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="px-4 py-3 bg-slate-900 text-white rounded-lg shadow-lg border border-slate-700"
        >
          {toast.title && <div className="font-semibold">{toast.title}</div>}
          {toast.description && <p className="text-sm">{toast.description}</p>}
        </div>
      ))}
    </div>
  );
}
