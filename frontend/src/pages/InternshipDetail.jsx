import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageHero from '../components/ui/PageHero';
import { useOffer } from '../hooks/useRecruitment';
import Loading from '../components/ui/Loading';
import Modal from '../components/ui/Modal';
import api from '../services/api';

function ApplyModal({ open, onClose, offerTitle, offerId }) {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    university: '',
    coverLetter: ''
  });
  const [cvFile, setCvFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const nameParts = form.fullName.trim().split(/\s+/);
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '.';

    const formData = new FormData();
    formData.append('offer', offerId);
    formData.append('first_name', firstName);
    formData.append('last_name', lastName);
    formData.append('email', form.email);
    formData.append('phone', form.phone);
    formData.append('status', 'en_cours');

    const fullMotivation = `Établissement : ${form.university}\n\nLettre de motivation :\n${form.coverLetter}`;
    const letterBlob = new Blob([fullMotivation], { type: 'text/plain' });
    formData.append('cover_letter_file', letterBlob, 'motivation_stage.txt');

    if (cvFile) {
      formData.append('cv_file', cvFile);
    }

    try {
      await api.post('/candidatures/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSent(true);
      setForm({ fullName: '', email: '', phone: '', university: '', coverLetter: '' });
      setCvFile(null);
    } catch (err) {
      console.error(err);
      setError("Une erreur est survenue lors de l'envoi de votre candidature. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Postuler au stage">
      {sent ? (
        <div className="text-center py-4">
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <p className="font-semibold text-gray-900 mb-1">Candidature reçue !</p>
          <p className="text-sm text-gray-500">Nous vous répondrons dans les plus brefs délais.</p>
          <button onClick={() => { setSent(false); onClose(); }} className="mt-5 px-6 py-2 rounded-full bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition">Fermer</button>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit}>
          <p className="text-sm text-gray-500 -mt-2 mb-2">Stage : <strong>{offerTitle}</strong></p>
          
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-150 rounded-xl text-xs text-red-600 font-semibold leading-relaxed">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet *</label>
            <input required type="text" placeholder="Votre prénom et nom" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input required type="email" placeholder="votre@email.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
              <input required type="tel" placeholder="+229 XX XX XX XX" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Établissement / Université *</label>
              <input required type="text" placeholder="Nom de votre école/université" value={form.university} onChange={e => setForm({...form, university: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Curriculum Vitae (CV) *</label>
              <input required type="file" accept=".pdf,.doc,.docx" onChange={e => setCvFile(e.target.files[0])} className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message de motivation *</label>
            <textarea required rows={4} placeholder="Dites-nous pourquoi vous souhaitez effectuer ce stage à la FAAZ…" value={form.coverLetter} onChange={e => setForm({...form, coverLetter: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>

          <div className="flex justify-end gap-3 pt-1">
            <button type="button" disabled={loading} onClick={onClose} className="px-4 py-2 text-sm rounded-full border bg-white text-gray-600 hover:bg-gray-50 transition">Annuler</button>
            <button type="submit" disabled={loading} className="px-6 py-2 text-sm rounded-full bg-primary-600 text-white font-semibold hover:bg-primary-700 transition flex items-center justify-center gap-2">
              {loading && <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>}
              Envoyer
            </button>
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

  let pdfUrl = stage.pdf_file || '';
  if (pdfUrl && !pdfUrl.startsWith('http')) {
    const apiBase = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace(/\/api$/, '');
    pdfUrl = `${apiBase}${pdfUrl}`;
  }

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
        
        {pdfUrl && (
          <div className="mb-10 bg-slate-50 border border-slate-200/60 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div>
              <p className="font-bold text-slate-800 text-sm">Fiche descriptive du stage (PDF)</p>
              <p className="text-xs text-slate-400 font-semibold mt-1">Consultez le document officiel pour en savoir plus sur les missions de stage.</p>
            </div>
            <a 
              href={pdfUrl}
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold shadow-sm transition"
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
              Télécharger le PDF
            </a>
          </div>
        )}

        <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 bg-primary-600 text-white px-8 py-3.5 rounded-full font-semibold hover:bg-primary-700 transition">
          Postuler à ce stage
        </button>
        <ApplyModal open={open} onClose={() => setOpen(false)} offerTitle={stage.titre} offerId={stage.id} />
      </div>
    </div>
  );
}
