import React, { useState } from 'react';
import PageHero from '../components/ui/PageHero';
import { useAchievements } from '../hooks/useFaq';
import Loading from '../components/ui/Loading';
import { useSeo } from '../hooks/useSeo';

const AXES = [
  { slug: 'tous',     label: 'Toutes' },
  { slug: 'enfance',  label: "Enfance indigente" },
  { slug: 'scolaire', label: 'Excellence scolaire' },
  { slug: 'jeunesse', label: 'Coaching jeunesse' },
  { slug: 'ages',     label: '3ᵉ âge' },
];

const formatDate = (d) =>
  new Date(d).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' });

export default function Achievements() {
  const [axe, setAxe] = useState('tous');
  const { data: items, isLoading } = useAchievements({ axe });
  useSeo({
    title: 'Nos Réalisations',
    description: "Découvrez les actions concrètes menées par la Fondation FAAZ pour l'enfance, l'excellence scolaire et le coaching de la jeunesse au Bénin.",
    keywords: 'réalisations faaz, projets bénin, aide enfance, excellence scolaire, coaching jeunesse'
  });

  return (
    <div>
      <PageHero
        title="Réalisations & activités"
        subtitle="La preuve de notre impact sur le terrain. Chaque réalisation publiée ici correspond à un projet mené à bien avec votre soutien."
        breadcrumbs={[{ label: 'Accueil', to: '/' }, { label: 'Réalisations & activités' }]}
      />

      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-20 py-12">
        {/* Filtres */}
        <div className="flex flex-wrap gap-2 mb-10">
          {AXES.map(a => (
            <button
              key={a.slug}
              onClick={() => setAxe(a.slug)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all border ${
                axe === a.slug
                  ? 'bg-primary-600 text-white border-primary-600 shadow-md'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300 hover:text-primary-600'
              }`}
            >
              {a.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <Loading text="Chargement…" />
        ) : (
          <div className="space-y-10">
            {items?.map((item, idx) => (
              <div
                key={item.id}
                className={`flex flex-col lg:flex-row gap-8 items-start bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden ${idx % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
              >
                {/* Image */}
                <div className="lg:w-2/5 flex-shrink-0 aspect-video bg-gray-100 overflow-hidden">
                  {item.image
                    ? <img src={item.image} alt={item.titre} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" /></svg>
                      </div>
                  }
                </div>

                {/* Contenu */}
                <div className="p-6 lg:p-8 flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-1 rounded-full">{item.axe}</span>
                    <span className="text-xs text-gray-400">{formatDate(item.date)}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.titre}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-5">{item.recit}</p>

                  {/* Chiffres clés */}
                  <div className="flex flex-wrap gap-3">
                    {item.chiffres.map((c, i) => (
                      <span key={i} className="inline-flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-full px-3 py-1 text-xs font-semibold text-gray-700">
                        <svg className="w-3 h-3 text-primary-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                        {c}
                      </span>
                    ))}
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
