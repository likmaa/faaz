import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

const VARIANT = {
  danger:  { btn: 'bg-red-600 hover:bg-red-700 text-white', icon: Trash2,        iconCls: 'text-red-600 bg-red-50' },
  warning: { btn: 'bg-amber-500 hover:bg-amber-600 text-white', icon: AlertTriangle, iconCls: 'text-amber-600 bg-amber-50' },
  primary: { btn: 'bg-primary-600 hover:bg-primary-700 text-white', icon: AlertTriangle, iconCls: 'text-primary-600 bg-primary-50' },
};

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirmer',
  cancelLabel  = 'Annuler',
  variant      = 'danger',
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  const v = VARIANT[variant] ?? VARIANT.danger;
  const Icon = v.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Dialog */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 flex flex-col gap-5">
        {/* Close button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon + texts */}
        <div className="flex items-start gap-4">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${v.iconCls}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">{title}</h2>
            {message && <p className="text-sm text-slate-500 mt-1 leading-relaxed">{message}</p>}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-1">
          <button
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2.5 rounded-xl text-sm font-bold transition ${v.btn}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
