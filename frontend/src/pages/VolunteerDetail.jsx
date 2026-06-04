import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageHero from '../components/ui/PageHero';
import { useOffer } from '../hooks/useRecruitment';
import Loading from '../components/ui/Loading';
import Modal from '../components/ui/Modal';

function ParticipateModal({ open, onClose, offerTitle }) {
  const [sent, setSent] = useState(false);
  return (
    <Modal open={open} onClose={onClose} title="Je veux participer">
      {sent ? (
        <div className="text-center py-4">
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <p className="font-semibold text-gray-900 mb-1">Merci pour votre engagement !</p>
          <p className="text-sm text-gray-500">Nous vous contacterons rapidement pour les prochaines étapes.</p>
          <button onClick={onClose} className="mt-5 px-6 py-2 rounded-full bg-primary-600 text-white text-sm font-semibold">Fermer</button>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
          <p className="text-sm text-gray-500 -mt-2 mb-2">Mission : <strong>{offerTitle}</strong></p>
          {[['Nom complet','text'],['Email','email'],['Téléphone','tel']].map(([label, type]) => (
            <div key={label}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input required type={type} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pourquoi voulez-vous participer ?</label>
            <textarea required rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
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

export default function VolunteerDetail() {
  const { id } = useParams();
  const { data: offer, isLoading, error } = useOffer(id);
  const [open, setOpen] = useState(false);

  if (isLoading) return <Loading />;
  if (error) return <div className="text-center py-20"><Link to="/volunteering" className="text-primary-600 text-sm">← Retour</Link></div>;

  return (
    <div>
      <PageHero
        title={offer.titre}
        breadcrumbs={[{ label: 'Accueil', to: '/' }, { label: 'Bénévolat', to: '/volunteering' }, { label: offer.titre }]}
      />
      <div className="mx-auto max-w-4xl px-6 sm:px-10 py-12">
        <div className="flex flex-wrap gap-3 mb-8">
          {offer.localisation && <span className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full">{offer.localisation}</span>}
          {offer.engagement && <span className="bg-green-50 text-green-700 text-sm font-medium px-3 py-1 rounded-full">{offer.engagement}</span>}
        </div>
        <div className="text-gray-700 leading-relaxed whitespace-pre-line mb-10">{offer.description}</div>
        <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 bg-primary-600 text-white px-8 py-3.5 rounded-full font-semibold hover:bg-primary-700 transition">
          Je veux participer
        </button>
        <ParticipateModal open={open} onClose={() => setOpen(false)} offerTitle={offer.titre} />
      </div>
    </div>
  );
}
