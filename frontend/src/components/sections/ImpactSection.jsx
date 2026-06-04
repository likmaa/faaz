import React from 'react';

// Vrais chiffres FAAZ — source : documentation officielle
const impactStats = [
  {
    title: "Enfance indigente",
    description: "4 projets actifs depuis 2020 : scolarisation, vivres, santé & vêtements, Noël aux orphelins.",
    subItems: [
      { label: 'Orphelins scolarisés', value: '122' },
      { label: 'Bénéficiaires santé & vêtements', value: '232' },
      { label: 'Bénéficiaires vivres', value: '108' },
      { label: 'Noëls partagés', value: '6 éd.' },
    ],
  },
  {
    title: "Excellence & Jeunesse",
    description: "Le Prix Gnamey récompense les meilleurs élèves du Bénin. Le coaching jeunesse ouvre de nouveaux horizons.",
    subItems: [
      { label: 'Éditions du Prix Gnamey', value: '6' },
      { label: 'Communes touchées', value: '4+' },
      { label: 'Enveloppes jusqu\'à', value: '200K FCFA' },
      { label: 'Jeunes coachés (Phase 1)', value: '28' },
    ],
  },
  {
    title: "6 ans d'engagement",
    description: "Depuis 2020, la FAAZ agit avec régularité, transparence et une proximité absolue avec les bénéficiaires.",
    subItems: [
      { label: "Années d'action continue", value: '6' },
      { label: 'Centres partenaires', value: '4+' },
      { label: 'Communes atteintes', value: '8+' },
      { label: 'Projets actifs', value: '6' },
    ],
  },
];

export default function ImpactSection() {
  return (
    <section id="impact" className="py-24 bg-[#fafbfc]">
      <div className="mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-20">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-10">
          <div className="lg:w-1/2">
            <span className="text-xs font-bold uppercase tracking-widest text-primary-600 block mb-4">
              Notre impact réel
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl leading-[1.1] font-extrabold text-primary-600 tracking-tight font-heading">
              Des chiffres<br />
              <span className="text-slate-400">qui parlent vrai.</span>
            </h2>
          </div>
          <div className="lg:w-1/3">
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed font-body">
              Pas de chiffres gonflés. Chaque statistique correspond à une action menée, un enfant aidé, une édition documentée.
            </p>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {impactStats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-[2.5rem] p-10 lg:p-12 shadow-[0_2px_40px_-12px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_60px_-12px_rgba(0,0,0,0.1)] transition-all duration-500 flex flex-col group border border-slate-100/50 hover:border-slate-200/80 hover:-translate-y-1"
            >
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-slate-800 mb-4 group-hover:text-[#16a34a] transition-colors duration-300">
                  {stat.title}
                </h3>
                <p className="text-slate-500 leading-relaxed text-sm font-medium">{stat.description}</p>
              </div>

              <div className="mt-auto space-y-3">
                {stat.subItems.map((item, itemIdx) => (
                  <div key={itemIdx} className="flex items-center justify-between py-3 border-t border-slate-50">
                    <div className="flex flex-col">
                      <span className="text-sm text-slate-400 font-medium mb-0.5">{item.label}</span>
                      <span className="text-xl font-bold text-secondary-600">{item.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
