import React from 'react';
import { Globe, Droplet, Sun, GraduationCap, Activity, Sprout, Handshake } from 'lucide-react';

// Partenaires réels / crédibles avec icônes Lucide et couleurs au survol dédiées
const partners = [
  { 
    id: 1, 
    name: 'UNICEF Bénin', 
    type: 'Institution', 
    Icon: Globe, 
    colorClass: 'text-sky-600',
    hoverClasses: 'hover:border-sky-300 hover:bg-sky-50/10 hover:shadow-[0_12px_24px_-8px_rgba(14,165,233,0.15)]',
    iconHoverClasses: 'group-hover:bg-sky-600 group-hover:text-white group-hover:border-sky-600'
  },
  { 
    id: 2, 
    name: 'Fondation Eau & Vie', 
    type: 'ONG internationale', 
    Icon: Droplet, 
    colorClass: 'text-blue-600',
    hoverClasses: 'hover:border-blue-300 hover:bg-blue-50/10 hover:shadow-[0_12px_24px_-8px_rgba(59,130,246,0.15)]',
    iconHoverClasses: 'group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600'
  },
  { 
    id: 3, 
    name: 'SolarVillage', 
    type: 'Entreprise sociale', 
    Icon: Sun, 
    colorClass: 'text-amber-500',
    hoverClasses: 'hover:border-amber-300 hover:bg-amber-50/10 hover:shadow-[0_12px_24px_-8px_rgba(245,158,11,0.15)]',
    iconHoverClasses: 'group-hover:bg-amber-500 group-hover:text-white group-hover:border-amber-500'
  },
  { 
    id: 4, 
    name: 'EduPlus', 
    type: 'Association éducation', 
    Icon: GraduationCap, 
    colorClass: 'text-emerald-600',
    hoverClasses: 'hover:border-emerald-300 hover:bg-emerald-50/10 hover:shadow-[0_12px_24px_-8px_rgba(16,185,129,0.15)]',
    iconHoverClasses: 'group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600'
  },
  { 
    id: 5, 
    name: 'HealthLink', 
    type: 'Programme de santé', 
    Icon: Activity, 
    colorClass: 'text-red-500',
    hoverClasses: 'hover:border-red-300 hover:bg-red-50/10 hover:shadow-[0_12px_24px_-8px_rgba(239,68,68,0.15)]',
    iconHoverClasses: 'group-hover:bg-red-500 group-hover:text-white group-hover:border-red-500'
  },
  { 
    id: 6, 
    name: 'AgriDev Bénin', 
    type: 'Partenaire local', 
    Icon: Sprout, 
    colorClass: 'text-green-600',
    hoverClasses: 'hover:border-green-300 hover:bg-green-50/10 hover:shadow-[0_12px_24px_-8px_rgba(34,197,94,0.15)]',
    iconHoverClasses: 'group-hover:bg-green-600 group-hover:text-white group-hover:border-green-600'
  }
];

export default function PartnersSection() {
  return (
    <section className="py-24 bg-white relative overflow-hidden" id="partners-section">
      {/* Motifs de fond (Dotted pattern) */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] opacity-60 pointer-events-none" />
      
      {/* Dégradés décoratifs de fond */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary-100/30 rounded-full blur-3xl opacity-75 pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-secondary-100/30 rounded-full blur-3xl opacity-75 pointer-events-none" />

      <div className="mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-20 relative z-10">
        
        {/* En-tête de section aligné */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-10">
          <div className="lg:w-1/2">
            <span className="text-xs font-bold uppercase tracking-widest text-primary-600 block mb-4">
              Partenariats
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl leading-[1.1] font-extrabold text-slate-900 tracking-tight font-heading">
              Nos partenaires<br />
              <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">de confiance.</span>
            </h2>
          </div>
          <div className="lg:w-1/3">
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed font-body">
              Un réseau engagé d'organisations certifiées qui nous soutiennent pour pérenniser chaque projet et maximiser l'impact direct sur le terrain.
            </p>
          </div>
        </div>

        {/* Grille de badges capsules */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 font-sans">
          {partners.map(p => {
            const Icon = p.Icon;
            return (
              <div 
                key={p.id} 
                id={`partner-card-${p.id}`}
                className={`group flex items-center gap-4 p-4 border border-slate-100 rounded-2xl bg-white/70 backdrop-blur-sm hover:-translate-y-1 hover:scale-[1.02] transition-all duration-500 ease-out cursor-pointer shadow-[0_4px_12px_-4px_rgba(0,0,0,0.02)] ${p.hoverClasses}`}
              >
                <div className={`w-12 h-12 rounded-xl bg-slate-50/80 border border-slate-100/80 flex items-center justify-center flex-shrink-0 shadow-sm transition-all duration-500 ${p.colorClass} ${p.iconHoverClasses}`}>
                  <Icon size={20} strokeWidth={2} className="transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 leading-snug transition-colors duration-300 group-hover:text-slate-900 font-body">{p.name}</p>
                  <p className="text-[9px] font-bold text-slate-400 mt-0.5 tracking-wider uppercase font-body">{p.type}</p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

