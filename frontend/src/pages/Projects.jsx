import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useProjects } from '../hooks/useProjects';
import PageHero from '../components/ui/PageHero';
import Loading from '../components/ui/Loading';

const AXES = [
  { slug: 'tous',      label: 'Tous les projets' },
  { slug: 'enfance',   label: "Enfance indigente" },
  { slug: 'scolaire',  label: 'Excellence scolaire' },
  { slug: 'jeunesse',  label: 'Coaching jeunesse' },
  { slug: 'ages',      label: '3ᵉ âge' },
  { slug: 'conjugal',  label: 'Coaching conjugal' },
];

function ProgressBar({ cible, collecte }) {
  const pct = Math.min(Math.round((collecte / cible) * 100), 100);
  return (
    <div>
      <div className="flex justify-between items-center text-xs mb-1.5">
        <span className="text-slate-500 font-medium font-body">Collecté : <span className="text-slate-800 font-bold">{collecte.toLocaleString('fr-FR')} FCFA</span></span>
        <span className="font-bold text-secondary-600 bg-secondary-50 px-2 py-0.5 rounded-md">{pct}%</span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between items-center mt-1.5 text-[11px] text-slate-400 font-body">
        <span>Objectif : {cible.toLocaleString('fr-FR')} FCFA</span>
        {cible - collecte > 0 ? (
          <span>Reste : {(cible - collecte).toLocaleString('fr-FR')} FCFA</span>
        ) : (
          <span className="text-primary-600 font-semibold">Objectif atteint !</span>
        )}
      </div>
    </div>
  );
}

export default function Projects() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [axe, setAxe] = useState(searchParams.get('axe') || 'tous');
  const { data: projects, isLoading } = useProjects({ axe });

  // Sync axe depuis l'URL (liens depuis CausesSection)
  useEffect(() => {
    const urlAxe = searchParams.get('axe');
    if (urlAxe && urlAxe !== axe) setAxe(urlAxe);
  }, [searchParams]);

  return (
    <div className="bg-slate-50/30 min-h-screen">
      <PageHero
        title="Nos projets"
        subtitle="Découvrez les initiatives que nous portons sur le terrain. Chaque projet est une promesse de changement concret."
        breadcrumbs={[{ label: 'Accueil', to: '/' }, { label: 'Nos projets' }]}
      />

      <div className="mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-20 py-16">
        {/* Filtres par axe */}
        <div className="flex flex-wrap gap-2.5 mb-12 bg-white/60 backdrop-blur-sm p-2 rounded-[2rem] border border-slate-150 w-fit max-w-full shadow-sm">
          {AXES.map(a => (
            <button
              key={a.slug}
              onClick={() => setAxe(a.slug)}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 ${
                axe === a.slug
                  ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-md'
                  : 'bg-transparent text-slate-600 hover:text-primary-600'
              }`}
            >
              {a.label}
            </button>
          ))}
        </div>

        {/* Grille */}
        {isLoading ? (
          <Loading text="Chargement des projets…" />
        ) : projects?.length === 0 ? (
          <div className="text-center py-20 text-slate-400 font-body border border-dashed border-slate-200 rounded-3xl bg-white/50 w-full">
            Aucun projet pour cet axe pour le moment.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map(p => (
              <div key={p.id} className="bg-white border border-slate-100/80 rounded-3xl overflow-hidden shadow-[0_8px_30px_rgba(15,23,42,0.02)] hover:shadow-xl hover:border-primary-100/80 hover:-translate-y-1.5 transition-all duration-500 ease-out flex flex-col group relative">
                {/* Cadre de l'image */}
                <div className="aspect-[16/10] bg-slate-50 overflow-hidden relative border-b border-slate-100">
                  {p.image ? (
                    <img 
                      src={p.image} 
                      alt={p.titre} 
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  {/* Badge de l'axe absolu sur l'image */}
                  <span className="absolute top-4 left-4 text-[10px] font-extrabold uppercase tracking-wider bg-white/90 backdrop-blur-sm text-secondary-600 px-3 py-1 rounded-full shadow-sm z-10">
                    {p.axe}
                  </span>
                </div>

                {/* Corps de la carte */}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-extrabold font-heading text-lg text-slate-800 mb-2.5 line-clamp-2 leading-snug group-hover:text-primary-600 transition-colors duration-300">
                    {p.titre}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed line-clamp-3 mb-5 flex-1 font-body">
                    {p.description}
                  </p>
                  
                  {/* Barre de progression */}
                  <div className="mb-6">
                    <ProgressBar cible={p.montant_cible} collecte={p.montant_collecte} />
                  </div>

                  {/* Boutons d'actions */}
                  <div className="flex items-center gap-3 mt-auto">
                    <Link 
                      to={`/projects/${p.id}`} 
                      className="flex-1 text-center py-2.5 border border-slate-200 text-slate-600 hover:text-primary-600 hover:border-primary-600 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 hover:bg-primary-50/10"
                    >
                      En savoir plus
                    </Link>
                    <Link 
                      to={`/donate/project/${p.id}`} 
                      className="flex-1 text-center py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-full text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all duration-300 active:scale-98"
                    >
                      Soutenir
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
