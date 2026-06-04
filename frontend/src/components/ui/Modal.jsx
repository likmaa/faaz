import React from 'react';

export default function Modal({ open, onClose, title, children, actions }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-50 w-full max-w-lg bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="px-6 pt-5 pb-3 border-b flex items-start justify-between">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="Fermer">✕</button>
        </div>
        <div className="px-6 py-5 text-gray-700">{children}</div>
        {actions && (
          <div className="px-6 py-4 bg-gray-50 rounded-b-xl flex justify-end gap-3">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
