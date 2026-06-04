import React from 'react';

export default function Pagination({ page=1, totalPages=1, onChange }) {
  if (totalPages <= 1) return null;
  const pages = [];
  for (let i=1;i<=totalPages;i++) pages.push(i);
  return (
    <div className="flex flex-wrap gap-2 justify-center mt-8">
      {pages.map(p => (
        <button
          key={p}
          onClick={() => onChange && onChange(p)}
          className={`px-3 py-1 rounded border text-sm ${p===page ? 'bg-primary-600 text-white border-primary-600' : 'bg-white hover:bg-primary-50 border-gray-300'}`}
        >
          {p}
        </button>
      ))}
    </div>
  );
}
