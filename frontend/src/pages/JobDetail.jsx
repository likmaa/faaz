import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageHero from '../components/ui/PageHero';
import { useOffer } from '../hooks/useRecruitment';
import Loading from '../components/ui/Loading';
import Modal from '../components/ui/Modal';

function ApplyModal({ open, onClose, offerTitle }) {
  const [sent, setSent] = useState(false);
  const handleSubmit = (e) => { e.preventDefault(); setSent(true); };
  return (
    <Modal open={open} onClose={onClose} title="Postuler">
      {sent ? (
        <div className="text-center py-4">
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <p className="font-semibold text-gray-900 mb-1">Candidature envoyée !</p>
          <p className="text-sm text-gray-500">Notre équipe vous contactera sous 2 semaines.</p>
          <button onClick={onClose} className="mt-5 px-6 py-2 rounded-full bg-primary-600 text-white text-sm font-semibold">Fermer</button>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit}>
          <p className="text-sm text-gray-500 -mt-2 mb-2">Poste : <strong>{offerTitle}</strong></p>
          {[['Nom complet','text','Votre nom'],['Email','email','votre@email.com'],['Téléphone','tel','+229 XX XX XX XX']].map(([label, type, ph]) => (
            <div key={label}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input required type={type} placeholder={ph} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lettre de motivation</label>
            <textarea required rows={4} placeholder="Dites-nous pourquoi vous souhaitez rejoindre la FAAZ…" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div className="flex justify-end gap-3 pt-1">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm rounded-full border bg-white text-gray-600">Annuler</button>
            <button type="submit" className="px-6 py-2 text-sm rounded-full bg-primary-600 text-white font-semibold hover:bg-primary-700">Envoyer</button>
          </div>
        </form>
      )}
    </Modal>
  );
}

export default function JobDetail() {
  const { id } = useParams();
  const { data: job, isLoading, error } = useOffer(id);
  const [applyOpen, setApplyOpen] = useState(false);

  if (isLoading) return <Loading />;
  if (error) return <div className="text-center py-20"><p className="text-gray-500">Offre introuvable.</p><Link to="/jobs" className="text-primary-600 text-sm mt-2 block">← Retour aux offres</Link></div>;

  return (
    <div>
      <PageHero
        title={job.titre}
        breadcrumbs={[{ label: 'Accueil', to: '/' }, { label: "Offres d'emploi", to: '/jobs' }, { label: job.titre }]}
      />
      <div className="mx-auto max-w-4xl px-6 sm:px-10 py-12">
        <div className="flex flex-wrap gap-3 mb-8">
          {job.type_contrat && <span className="bg-primary-50 text-primary-700 text-sm font-semibold px-3 py-1 rounded-full">{job.type_contrat}</span>}
          {job.localisation && <span className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full">{job.localisation}</span>}
          {job.date_limite && <span className="bg-red-50 text-red-600 text-sm px-3 py-1 rounded-full">Clôture : {new Date(job.date_limite).toLocaleDateString('fr-FR')}</span>}
        </div>
        <div className="prose max-w-none mb-10">
          <div className="text-gray-700 leading-relaxed whitespace-pre-line">{job.description}</div>
        </div>
        <button onClick={() => setApplyOpen(true)} className="inline-flex items-center gap-2 bg-primary-600 text-white px-8 py-3.5 rounded-full font-semibold hover:bg-primary-700 transition">
          Postuler maintenant
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
        <ApplyModal open={applyOpen} onClose={() => setApplyOpen(false)} offerTitle={job.titre} />
      </div>
    </div>
  );
}
