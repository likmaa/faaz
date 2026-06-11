import React from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../components/ui/PageHero';
import { useInternships } from '../hooks/useRecruitment';
import Loading from '../components/ui/Loading';
import { useSeo } from '../hooks/useSeo';

export default function InternshipOffers() {
  const { data: internships, isLoading } = useInternships();
  useSeo({
    title: 'Offres de stage',
    description: "Découvrez les offres de stage de la Fondation FAAZ au Bénin. Développez vos compétences dans le secteur associatif et contribuez à des projets à fort impact.",
    keywords: 'stage bénin, stage ong, stage fondation faaz, stage humanitaire afrique'
  });

  return (
    <div>
      <PageHero
        title="Stages"
        subtitle="Développez vos compétences dans le secteur associatif tout en contribuant à des projets à fort impact."
        breadcrumbs={[{ label: 'Accueil', to: '/' }, { label: 'Contribuer' }, { label: 'Stages' }]}
      />

      <div className="mx-auto max-w-4xl px-6 sm:px-10 py-12">
        {isLoading ? <Loading text="Chargement…" /> : (
          <div className="grid sm:grid-cols-2 gap-6">
            {internships?.map(stage => (
              <Link key={stage.id} to={`/internships/${stage.id}`} className="group bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow flex flex-col">
                <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary-600 transition-colors mb-3">{stage.titre}</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full flex items-center gap-1">
                    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    {stage.localisation}
                  </span>
                  <span className="text-xs bg-primary-50 text-primary-700 px-2 py-1 rounded-full">{stage.duree}</span>
                </div>
                <p className="text-sm text-gray-500 flex-1 mb-4 line-clamp-2">{stage.description}</p>
                {stage.date_limite && (
                  <p className="text-xs text-gray-400 mt-auto">
                    Date limite : {new Date(stage.date_limite).toLocaleDateString('fr-FR')}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
