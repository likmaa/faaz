import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Bandeau hero pour les pages intérieures
 * Props:
 *  - title       : string  — titre principal (obligatoire)
 *  - subtitle    : string  — sous-titre optionnel
 *  - breadcrumbs : [{label, to?}]  — fil d'Ariane
 *  - tag         : string  — badge coloré au-dessus du titre
 */
export default function PageHero({ title, subtitle, breadcrumbs = [], tag }) {
  return (
    <div
      className="relative overflow-hidden"
      style={{
        paddingTop: 'var(--header-h, 80px)',
        background: 'linear-gradient(135deg, #16a34a 0%, #0284c7 100%)',
      }}
    >
      {/* Motif décoratif */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full border border-white/30" />
        <div className="absolute -bottom-10 -left-10 w-72 h-72 rounded-full border border-white/20" />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-20 py-12 lg:py-16">
        {/* Breadcrumb */}
        {breadcrumbs.length > 0 && (
          <nav className="mb-4" aria-label="Fil d'Ariane">
            <ol className="flex flex-wrap items-center gap-1 text-sm text-white/70">
              {breadcrumbs.map((item, idx) => {
                const isLast = idx === breadcrumbs.length - 1;
                return (
                  <li key={idx} className="flex items-center">
                    {isLast ? (
                      <span className="text-white/90 font-medium">{item.label}</span>
                    ) : (
                      <Link to={item.to || '/'} className="hover:text-white transition-colors">
                        {item.label}
                      </Link>
                    )}
                    {!isLast && <span className="mx-2 text-white/40">/</span>}
                  </li>
                );
              })}
            </ol>
          </nav>
        )}

        {/* Tag */}
        {tag && (
          <span className="inline-block mb-3 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold tracking-wider uppercase border border-white/20">
            {tag}
          </span>
        )}

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-3xl">
          {title}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p className="mt-4 text-white/85 text-base sm:text-lg leading-relaxed max-w-2xl">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
