import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageHero from '../components/ui/PageHero';
import { useOffer } from '../hooks/useRecruitment';
import Loading from '../components/ui/Loading';
import Modal from '../components/ui/Modal';

function ApplyModal({ open, onClose, offerTitle }) {
  const [sent, setSent] = useState(false);
  return (
    <Modal open={open} onClose={onClose} title="Postuler au stage">
      {sent ? (
        <div className="text-center py-4">
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <p className="font-semibold text-gray-900 mb-1">Candidature reçue !</p>
          <p className="text-sm text-gray-500">Nous vous répondrons dans les plus brefs délais.</p>
          <button onClick={onClose} className="mt-5 px-6 py-2 rounded-full bg-primary-600 text-white text-sm font-semibold">Fermer</button>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
          <p className="text-sm text-gray-500 -mt-2 mb-2">Stage : <strong>{offerTitle}</strong></p>
          {[['Nom complet','text'],['Email','email'],['Établissement / Université','text']].map(([label, type]) => (
            <div key={label}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input required type={type} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message de motivation</label>
            <textarea required rows={4} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div className="flex justify-end gap-3 pt-1">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm rounded-full border bg-white text-gray-600">Annuler</button>
            <button type="submit" className="px-6 py-2 text-sm rounded-full bg-primary-600 text-white font-semibold">Envoyer</button>
          </div>
        </form>
      )}
    </Modal>
  );
}

export default function InternshipDetail() {
  const { id } = useParams();
  const { data: stage, isLoading, error } = useOffer(id);
  const [open, setOpen] = useState(false);

  if (isLoading) return <Loading />;
  if (error) return <div className="text-center py-20"><Link to="/internships" className="text-primary-600 text-sm">← Retour aux stages</Link></div>;

  return (
    <div>
      <PageHero
        title={stage.titre}
        breadcrumbs={[{ label: 'Accueil', to: '/' }, { label: 'Stages', to: '/internships' }, { label: stage.titre }]}
      />
      <div className="mx-auto max-w-4xl px-6 sm:px-10 py-12">
        <div className="flex flex-wrap gap-3 mb-8">
          {stage.localisation && <span className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full">{stage.localisation}</span>}
          {stage.duree && <span className="bg-blue-50 text-blue-700 text-sm font-medium px-3 py-1 rounded-full">{stage.duree}</span>}
          {stage.indemnite && <span className="bg-green-50 text-green-700 text-sm px-3 py-1 rounded-full">{stage.indemnite}</span>}
          {stage.date_limite && <span className="bg-orange-50 text-orange-700 text-sm px-3 py-1 rounded-full">Clôture : {new Date(stage.date_limite).toLocaleDateString('fr-FR')}</span>}
        </div>
        <div className="text-gray-700 leading-relaxed whitespace-pre-line mb-10">{stage.description}</div>
        <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 bg-primary-600 text-white px-8 py-3.5 rounded-full font-semibold hover:bg-primary-700 transition">
          Postuler à ce stage
        </button>
        <ApplyModal open={open} onClose={() => setOpen(false)} offerTitle={stage.titre} />
      </div>
    </div>
  );
}
