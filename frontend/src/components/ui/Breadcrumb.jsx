import React from 'react';
import { Link } from 'react-router-dom';

// items: [{label: 'Accueil', to: '/'}, {label: 'Projets', to: '/projects'}, {label: 'Eau potable'}]
export default function Breadcrumb({ items = [] }) {
  return (
    <nav className="text-sm mb-6" aria-label="Fil d'Ariane">
      <ol className="flex flex-wrap items-center gap-1 text-gray-600">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={idx} className="flex items-center">
              {isLast ? (
                <span className="font-medium text-gray-800">{item.label}</span>
              ) : (
                <Link to={item.to || '#'} className="hover:text-primary-600 transition-colors">{item.label}</Link>
              )}
              {!isLast && <span className="mx-2 text-gray-400">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
