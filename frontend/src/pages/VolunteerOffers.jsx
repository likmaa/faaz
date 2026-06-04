import React from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../components/ui/PageHero';
import { useVolunteering } from '../hooks/useRecruitment';
import Loading from '../components/ui/Loading';

export default function VolunteerOffers() {
  const { data: offers, isLoading } = useVolunteering();

  return (
    <div>
      <PageHero
        title="Bénévolat"
        subtitle="Donnez de votre temps. Chaque heure de bénévolat est un acte concret de solidarité."
        breadcrumbs={[{ label: 'Accueil', to: '/' }, { label: 'Contribuer' }, { label: 'Bénévolat' }]}
      />

      <div className="mx-auto max-w-4xl px-6 sm:px-10 py-12">
        <div className="bg-primary-50 border border-primary-100 rounded-2xl p-6 mb-10">
          <p className="text-primary-800 text-sm leading-relaxed">
            <strong>Engagement flexible :</strong> nos missions de bénévolat sont adaptées à votre emploi du temps. Que vous soyez disponible quelques heures par semaine ou pour des missions ponctuelles, nous avons un rôle pour vous.
          </p>
        </div>

        {isLoading ? <Loading text="Chargement…" /> : (
          <div className="space-y-4">
            {offers?.map(offer => (
              <Link key={offer.id} to={`/volunteering/${offer.id}`} className="group block bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary-600 transition-colors mb-1">{offer.titre}</h3>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        {offer.localisation}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        {offer.engagement}
                      </span>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-gray-300 group-hover:text-primary-500 transition-colors flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
