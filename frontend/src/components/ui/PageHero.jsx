import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

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
      className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-600"
      style={{
        paddingTop: 'var(--header-h, 80px)',
      }}
    >
      {/* ── Background: Animated Glow Orbs ── */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-white/10 blur-[80px] pointer-events-none" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-white/10 blur-[100px] pointer-events-none" 
      />
      
      {/* ── Subtle pattern overlay ── */}
      <div className="absolute inset-0 bg-[url('/assets/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-[0.05] pointer-events-none" />

      <div className="relative mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-20 py-16 lg:py-20 z-10">
        
        {/* Breadcrumb (Glassmorphism) */}
        {breadcrumbs.length > 0 && (
          <motion.nav 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-8 inline-flex" 
            aria-label="Fil d'Ariane"
          >
            <ol className="flex items-center px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md shadow-sm text-xs sm:text-sm font-medium">
              {breadcrumbs.map((item, idx) => {
                const isLast = idx === breadcrumbs.length - 1;
                return (
                  <li key={idx} className="flex items-center">
                    {isLast ? (
                      <span className="text-white font-bold drop-shadow-sm">{item.label}</span>
                    ) : (
                      <Link to={item.to || '/'} className="text-white/80 hover:text-white transition-colors duration-300">
                        {item.label}
                      </Link>
                    )}
                    {!isLast && <span className="mx-2.5 text-white/50">/</span>}
                  </li>
                );
              })}
            </ol>
          </motion.nav>
        )}

        {/* Tag */}
        {tag && (
          <motion.span 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-block mb-4 px-4 py-1.5 rounded-full bg-white/20 text-white text-xs font-extrabold tracking-widest uppercase border border-white/30 backdrop-blur-sm"
          >
            {tag}
          </motion.span>
        )}

        {/* Title */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] max-w-4xl drop-shadow-md font-heading"
        >
          {title}
        </motion.h1>

        {/* Subtitle */}
        {subtitle && (
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
            className="mt-6 text-white/90 text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl font-body drop-shadow-sm"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </div>
  );
}
