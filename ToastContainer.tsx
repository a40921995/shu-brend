import React from 'react';
import { useStore } from '../context/StoreContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-18 sm:bottom-6 right-4 sm:right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto p-3.5 rounded-2xl shadow-xl flex items-center justify-between gap-3 border text-xs sm:text-sm animate-fadeIn transition-all ${
            toast.type === 'success'
              ? 'bg-[#111111] text-white border-stone-800'
              : toast.type === 'warning'
              ? 'bg-amber-900 text-amber-50 border-amber-800'
              : toast.type === 'error'
              ? 'bg-red-900 text-red-50 border-red-800'
              : 'bg-[#EDE2D0] text-stone-900 border-[#DECDB7]'
          }`}
        >
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            {toast.type === 'success' ? (
              <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
            ) : toast.type === 'warning' || toast.type === 'error' ? (
              <AlertCircle size={18} className="text-amber-400 shrink-0" />
            ) : (
              <Info size={18} className="text-stone-700 shrink-0" />
            )}
            <span className="font-medium leading-snug">{toast.message}</span>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="p-1 rounded-lg opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
            aria-label="Yopish"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};
