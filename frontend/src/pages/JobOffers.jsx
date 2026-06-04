import React from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../components/ui/PageHero';
import { useJobs } from '../hooks/useRecruitment';
import Loading from '../components/ui/Loading';

export default function JobOffers() {
  const { data: jobs, isLoading } = useJobs();

  return (
    <div>
      <PageHero
        title="Offres d'emploi"
        subtitle="Rejoignez une équipe engagée et contribuez à construire un Bénin plus solidaire."
        breadcrumbs={[{ label: 'Accueil', to: '/' }, { label: "Contribuer" }, { label: "Offres d'emploi" }]}
      />

      <div className="mx-auto max-w-4xl px-6 sm:px-10 py-12">
        {isLoading ? <Loading text="Chargement…" /> : (
          <div className="space-y-4">
            {jobs?.map(job => (
              <Link key={job.id} to={`/jobs/${job.id}`} className="group block bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary-600 transition-colors mb-1">{job.titre}</h3>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        {job.localisation}
                      </span>
                      {job.date_limite && (
                        <span className="flex items-center gap-1">
                          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                          Clôture : {new Date(job.date_limite).toLocaleDateString('fr-FR')}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold bg-primary-50 text-primary-700 px-3 py-1 rounded-full">{job.type_contrat}</span>
                    <svg className="w-5 h-5 text-gray-300 group-hover:text-primary-500 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        {!isLoading && jobs?.length === 0 && (
          <p className="text-center text-gray-400 py-16">Aucune offre d'emploi en ce moment. Revenez bientôt !</p>
        )}
      </div>
    </div>
  );
}
