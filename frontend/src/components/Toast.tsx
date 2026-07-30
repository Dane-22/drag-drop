import React, { useEffect } from 'react';
import { AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
}

interface ToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  if (!toast) return null;

  const isError = toast.type === 'error' || toast.type === 'warning';
  const isInfo = toast.type === 'info';

  return (
    <div className="fixed top-20 right-6 z-50 animate-bounce max-w-md select-none">
      <div
        className={`p-4 rounded-xl border shadow-2xl flex items-start gap-3 text-sm transition-all ${
          isError
            ? 'bg-rose-950/90 border-rose-600/50 text-rose-100 shadow-rose-900/30'
            : isInfo
            ? 'bg-sky-950/90 border-sky-600/50 text-sky-100 shadow-sky-900/30'
            : 'bg-emerald-950/90 border-emerald-600/50 text-emerald-100 shadow-emerald-900/30'
        } backdrop-blur-md`}
      >
        {isError ? (
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
        ) : isInfo ? (
          <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
        ) : (
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        )}
        <div className="flex-1">
          <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-0.5">
            {toast.title}
          </h4>
          <p className="text-xs leading-relaxed opacity-95">{toast.message}</p>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/10 rounded transition-colors text-white/70 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
