import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';

function extractStat(list, titleKeyword, statLabelKeyword, fallback) {
  if (!list || list.length === 0) return fallback;
  for (const r of list) {
    const title = (r.title || r.titre || '').toLowerCase();
    if (title.includes(titleKeyword.toLowerCase())) {
      const statsArray = r.stats || [];
      for (const s of statsArray) {
        const label = (s.label || '').toLowerCase();
        if (label.includes(statLabelKeyword.toLowerCase())) {
          const cleaned = (s.value || '').replace(/[^\d]/g, '');
          const parsed = parseInt(cleaned, 10);
          if (!isNaN(parsed)) {
            return parsed;
          }
        }
      }
    }
  }
  return fallback;
}

export default function ImpactSection() {
  const { data: realisations = [] } = useQuery({
    queryKey: ['realisations'],
    queryFn: async () => {
      try {
        const res = await api.get('/realisations/');
        const list = Array.isArray(res.data) 
          ? res.data 
          : (Array.isArray(res.data?.results) 
              ? res.data.results 
              : (res.data?.data || []));
        return list;
      } catch (err) {
        return [];
      }
    },
    staleTime: 1000 * 60 * 5
  });

  const scolarises = extractStat(realisations, 'scolaris', 'bénéficiaire', 122);
  const sante = extractStat(realisations, 'sant', 'bénéficiaire', 232);
  const vivres = extractStat(realisations, 'vivres', 'bénéficiaire', 108);
  const noelEditions = extractStat(realisations, 'noël', 'édition', 6);
  const gnameyEditions = extractStat(realisations, 'gnamey', 'édition', 6);
  const coaches = extractStat(realisations, 'coach', 'jeune', 28);
  const actionYears = Math.max(6, new Date().getFullYear() - 2020);

  const impactStats = [
    {
      title: "Enfance indigente",
      description: "4 projets actifs depuis 2020 : scolarisation, vivres, santé & vêtements, Noël aux orphelins.",
      subItems: [
        { label: 'Orphelins scolarisés', value: `${scolarises}` },
        { label: 'Bénéficiaires santé & vêtements', value: `${sante}` },
        { label: 'Bénéficiaires vivres', value: `${vivres}` },
        { label: 'Noëls partagés', value: `${noelEditions} éd.` },
      ],
    },
    {
      title: "Excellence & Jeunesse",
      description: "Le Prix Gnamey récompense les meilleurs élèves du Bénin. Le coaching jeunesse ouvre de nouveaux horizons.",
      subItems: [
        { label: 'Éditions du Prix Gnamey', value: `${gnameyEditions}` },
        { label: 'Communes touchées', value: '4+' },
        { label: 'Enveloppes jusqu\'à', value: '200K FCFA' },
        { label: 'Jeunes coachés (Phase 1)', value: `${coaches}` },
      ],
    },
    {
      title: `${actionYears} ans d'engagement`,
      description: `Depuis 2020, la FAAZ agit avec régularité, transparence et une proximité absolue avec les bénéficiaires.`,
      subItems: [
        { label: "Membres actifs", value: "21" },
        { label: 'Centres partenaires', value: '4+' },
        { label: 'Communes atteintes', value: '8+' },
        { label: 'Projets actifs', value: '6' },
      ],
    },
  ];

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

              <div className="mt-auto space-y-0.5 pt-6">
                {stat.subItems.map((item, itemIdx) => (
                  <div key={itemIdx} className="flex items-center justify-between py-2.5 border-b border-slate-100/60 last:border-b-0 group/item">
                    <span className="text-sm text-slate-500 font-medium pr-4 transition-colors group-hover/item:text-slate-800">
                      {item.label}
                    </span>
                    <span className="text-base font-bold text-secondary-600 whitespace-nowrap">
                      {item.value}
                    </span>
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
