import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const EVENTS = [
  {
    year: '2020',
    items: [
      '1ʳᵉ édition du Prix Gnamey de l\'Excellence — CEG K/Vêdoko, Cotonou',
      '1ʳᵉ édition Noël aux orphelins',
    ],
  },
  {
    year: '2021',
    items: [
      '1ʳᵉ édition Santé & dons de vêtements',
      '1ʳᵉ édition Chaque orphelin à l\'école — Orphelinat Saint Dominique, Adjohoun',
    ],
  },
  {
    year: '2022',
    items: [
      '2ʳᵉ édition Chaque orphelin à l\'école — Adjohoun',
      '1ʳᵉ édition Dons de vivres aux orphelins — Adjohoun',
      'Coaching jeunesse Phase 1 — 28 jeunes · Royal Space Hôtel, Abomey-Calavi',
      'Prix Gnamey étendu à Athiémé',
    ],
  },
  {
    year: '2023',
    items: [
      'AG du 27 août — Décision d\'étendre le Prix Gnamey à de nouvelles communes',
      'Prix Gnamey — Cotonou + Savalou',
      '3ʳᵉ édition Santé & vêtements',
    ],
  },
  {
    year: '2024',
    items: [
      '3ʳᵉ édition Chaque orphelin à l\'école — Cité des Anges, Abomey-Calavi (35 enfants)',
      '2ʳᵉ édition Dons de vivres — Adjohoun (38 bénéficiaires)',
      '4ʳᵉ & 5ᵉ éditions Santé & vêtements',
      'Prix Gnamey — Cotonou + Kpomassè',
    ],
  },
  {
    year: '2025',
    items: [
      '4ʳᵉ édition Chaque orphelin à l\'école — Grand-Popo & Toviclin (29 enfants)',
      '6ᵉ édition Prix Gnamey — Cotonou + 3 communes',
      '6ᵉ édition Noël aux orphelins',
      'Coaching jeunesse Phase 2 en préparation',
    ],
  },
  {
    year: '2026',
    items: [
      '3ʳᵉ édition Dons de vivres — Adjohoun (36 bénéficiaires)',
      '6ᵉ édition Santé & dons de vêtements (40 enfants · 2 mai)',
      'Programmes 3ᵉ âge & coaching conjugal en lancement',
    ],
  },
];

export default function TimelineSection() {
  return (
    <section className="bg-white py-24 overflow-hidden" id="timeline-section">
      <div className="mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-20">

        {/* Header */}
        <div className="mb-20">
          <span className="text-xs font-bold uppercase tracking-widest text-primary-600 block mb-4">
            6 ans d'engagement
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl leading-[1.1] font-extrabold text-gray-900 tracking-tight font-heading">
            Notre parcours,<br />
            <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">édition après édition.</span>
          </h2>
        </div>

        {/* Frise verticale staggered */}
        <div className="relative max-w-5xl mx-auto py-12">
          
          {/* Ligne verticale de fond (dégradé) */}
          <div className="absolute left-4 lg:left-1/2 top-0 bottom-0 w-[3px] bg-gradient-to-b from-primary-500 to-secondary-500 transform lg:-translate-x-1/2 z-0" />

          <div className="space-y-16">
            {EVENTS.map((ev, idx) => {
              const isCurrent = ev.year === '2026';
              const isEven = idx % 2 === 0;
              
              return (
                <div 
                  key={ev.year} 
                  className={`relative flex flex-col lg:flex-row items-stretch w-full ${
                    isEven ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  {/* Point marqueur central */}
                  {isCurrent ? (
                    <div className="absolute left-4 lg:left-1/2 top-7 w-6 h-6 rounded-full bg-primary-600 border-4 border-white shadow-[0_0_15px_rgba(22,163,74,0.6)] transform -translate-x-1/2 z-10 flex items-center justify-center">
                      <span className="absolute inset-0 rounded-full bg-primary-600 animate-ping opacity-75"></span>
                    </div>
                  ) : (
                    <div className="absolute left-4 lg:left-1/2 top-7 w-5 h-5 rounded-full bg-white border-4 border-primary-500 shadow-sm transform -translate-x-1/2 z-10" />
                  )}

                  {/* Espaceur de gauche pour staggered sur desktop */}
                  <div className="hidden lg:block lg:w-[calc(50%-2rem)]" />

                  {/* Contenu carte de droite/gauche */}
                  <div className="pl-12 lg:pl-0 w-full lg:w-[calc(50%-2rem)] relative z-10">
                    <div className="bg-white border border-slate-100/80 rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgba(15,23,42,0.02)] hover:shadow-xl hover:border-primary-100 hover:-translate-y-1 transition-all duration-500 ease-out group cursor-pointer relative overflow-hidden">
                      
                      {/* Filigrane d'année géant */}
                      <div className="absolute -right-4 -bottom-6 text-slate-50 font-extrabold text-7xl select-none pointer-events-none group-hover:scale-105 group-hover:text-primary-50/50 transition-all duration-500">
                        {ev.year}
                      </div>

                      {/* En-tête de carte */}
                      <div className="flex items-center gap-3 mb-5 relative z-10">
                        <span className={`text-2xl font-extrabold font-heading ${
                          isCurrent ? 'text-primary-600' : 'text-slate-800'
                        }`}>
                          {ev.year}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] font-extrabold tracking-wider bg-primary-600 text-white px-2.5 py-0.5 rounded-full uppercase animate-pulse">
                            En cours
                          </span>
                        )}
                      </div>

                      {/* Événements */}
                      <ul className="space-y-3.5 pl-0 relative z-10">
                        {ev.items.map((item, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <CheckCircle2 size={16} className="text-primary-500 mt-0.5 flex-shrink-0" strokeWidth={2.5} />
                            <span className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed font-body">{item}</span>
                          </li>
                        ))}
                      </ul>

                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
