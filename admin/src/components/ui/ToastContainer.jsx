import React from 'react';
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useToastStore } from '../../store/toast';

const STYLES = {
  success: { icon: CheckCircle2, cls: 'bg-emerald-50 border-emerald-200 text-emerald-700', iconCls: 'text-emerald-500' },
  error:   { icon: XCircle,      cls: 'bg-red-50 border-red-200 text-red-700',             iconCls: 'text-red-500' },
  info:    { icon: Info,         cls: 'bg-sky-50 border-sky-200 text-sky-700',             iconCls: 'text-sky-500' },
  warning: { icon: AlertTriangle,cls: 'bg-amber-50 border-amber-200 text-amber-700',       iconCls: 'text-amber-500' },
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map(({ id, message, type }) => {
        const s = STYLES[type] ?? STYLES.info;
        const Icon = s.icon;
        return (
          <div
            key={id}
            className={`pointer-events-auto flex items-start gap-3 px-4 py-3.5 rounded-2xl border shadow-lg text-sm font-semibold animate-slide-in ${s.cls}`}
          >
            <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${s.iconCls}`} />
            <span className="flex-1 leading-snug">{message}</span>
            <button
              onClick={() => removeToast(id)}
              className="flex-shrink-0 opacity-50 hover:opacity-100 transition -mr-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
