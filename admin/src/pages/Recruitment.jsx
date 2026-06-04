import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Briefcase, Plus, Trash2, Loader2, Download, Eye, X, Check, FileDown } from 'lucide-react';

export default function Recruitment() {
  const [offers, setOffers] = useState([]);
  const [candidatures, setCandidatures] = useState([]);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  // Form fields
  const [form, setForm] = useState({
    title: '',
    offer_type: 'emploi',
    status: 'ouvert'
  });
  const [pdfFile, setPdfFile] = useState(null);

  useEffect(() => {
    fetchRecruitmentData();
  }, []);

  async function fetchRecruitmentData() {
    setLoading(true);
    try {
      const [offerRes, candRes] = await Promise.all([
        api.get('/recruitment/'),
        api.get('/candidatures/').catch(() => ({ data: [] }))
      ]);
      setOffers(offerRes.data);
      setCandidatures(candRes.data);
      if (offerRes.data.length > 0) {
        setSelectedOffer(offerRes.data[0]);
      }
    } catch (err) {
      console.error("Erreur lors du chargement des recrutements.", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmitOffer(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('offer_type', form.offer_type);
    formData.append('status', form.status);
    if (pdfFile) {
      formData.append('pdf_file', pdfFile);
    }

    try {
      const res = await api.post('/recruitment/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setOffers([res.data, ...offers]);
      setSelectedOffer(res.data);
      setShowModal(false);
      setForm({ title: '', offer_type: 'emploi', status: 'ouvert' });
      setPdfFile(null);
    } catch (err) {
      alert("Erreur lors de la création de l'offre.");
    }
  }

  async function handleDeleteOffer(id) {
    if (!confirm("Voulez-vous vraiment supprimer cette offre et ses candidatures associées ?")) return;
    try {
      await api.delete(`/recruitment/${id}/`);
      const newOffers = offers.filter(o => o.id !== id);
      setOffers(newOffers);
      if (selectedOffer?.id === id) {
        setSelectedOffer(newOffers[0] || null);
      }
    } catch (err) {
      alert("Erreur lors de la suppression.");
    }
  }

  async function handleCandidatureStatus(id, newStatus) {
    try {
      const res = await api.patch(`/candidatures/${id}/`, { status: newStatus });
      setCandidatures(candidatures.map(c => c.id === id ? res.data : c));
    } catch (err) {
      alert("Erreur lors de la mise à jour du statut.");
    }
  }

  const activeCandidatures = candidatures.filter(c => c.offer === selectedOffer?.id);

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
        <span className="text-sm font-semibold text-slate-500">Chargement du module recrutement…</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight font-title">Offres & Candidatures</h1>
          <p className="text-slate-500 text-sm mt-1">Publiez des opportunités (emploi, bénévolat, stage) et suivez les candidatures.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-full font-bold text-sm shadow-md transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Nouvelle offre
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Offers List (Left) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col">
          <h2 className="text-base font-bold text-slate-900 font-title mb-4">Opportunités</h2>
          {offers.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm">
              <Briefcase className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <span>Aucune offre publiée.</span>
            </div>
          ) : (
            <div className="space-y-2 flex-1 overflow-y-auto max-h-[500px]">
              {offers.map(offer => (
                <div
                  key={offer.id}
                  onClick={() => setSelectedOffer(offer)}
                  className={`p-4 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                    selectedOffer?.id === offer.id
                      ? 'bg-primary-50 border-primary-200 text-primary-900'
                      : 'bg-white border-slate-100 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      {offer.offer_type === 'emploi' ? 'Emploi' : offer.offer_type === 'stage' ? 'Stage' : 'Bénévolat'}
                    </p>
                    <p className="text-sm font-bold mt-1 line-clamp-1">{offer.title}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteOffer(offer.id);
                    }}
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Candidatures matching selected offer (Right) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col min-h-[400px]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-bold text-slate-900 font-title">
              {selectedOffer ? `Candidats pour : ${selectedOffer.title}` : 'Sélectionnez une offre'}
            </h2>
            {selectedOffer && (
              <span className="text-xs text-slate-400 font-semibold">
                {activeCandidatures.length} candidature(s)
              </span>
            )}
          </div>

          {!selectedOffer ? (
            <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
              <span>Sélectionnez une opportunité à gauche pour afficher ses candidats.</span>
            </div>
          ) : activeCandidatures.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-12 text-slate-400 text-sm">
              <Eye className="w-10 h-10 mb-2 opacity-45" />
              <span>Aucune candidature reçue pour cette offre.</span>
            </div>
          ) : (
            <div className="space-y-4 overflow-y-auto max-h-[500px] flex-1">
              {activeCandidatures.map(cand => (
                <div key={cand.id} className="p-5 border border-slate-100 bg-slate-50/50 rounded-2xl flex flex-col sm:flex-row justify-between gap-4">
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">
                        {cand.first_name} {cand.last_name}
                      </h3>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">{cand.email} · {cand.phone}</p>
                    </div>

                    <div className="flex gap-2">
                      <a
                        href={cand.cv_file}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-50 transition"
                      >
                        <FileDown className="w-3.5 h-3.5" />
                        Télécharger le CV
                      </a>
                      {cand.cover_letter_file && (
                        <a
                          href={cand.cover_letter_file}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-50 transition"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Lettre de motivation
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-end justify-between sm:justify-start gap-3">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${
                        cand.status === 'retenu'
                          ? 'bg-emerald-50 text-emerald-700'
                          : cand.status === 'rejete'
                          ? 'bg-red-50 text-red-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {cand.status === 'retenu'
                        ? 'Retenu'
                        : cand.status === 'rejete'
                        ? 'Rejeté'
                        : 'En cours'}
                    </span>

                    {cand.status === 'en_cours' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleCandidatureStatus(cand.id, 'retenu')}
                          className="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition"
                          title="Retenir"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleCandidatureStatus(cand.id, 'rejete')}
                          className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition"
                          title="Rejeter"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal create Offer */}
      {showModal && (
        <div className="fixed inset-0 z-30 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-3xl p-8 shadow-2xl z-10 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-slate-900 font-title mb-6">Nouvelle opportunité</h2>

            <form onSubmit={handleSubmitOffer} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Titre du poste / Libellé *</label>
                <input
                  required
                  type="text"
                  placeholder="Ex: Secrétaire général, Bénévole terrain"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Type d'opportunité *</label>
                <select
                  value={form.offer_type}
                  onChange={(e) => setForm({ ...form, offer_type: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                >
                  <option value="emploi">Offre d'emploi</option>
                  <option value="bénévolat">Bénévolat / Volontariat</option>
                  <option value="stage">Offre de stage</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Fiche descriptive (PDF)</label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setPdfFile(e.target.files[0])}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-2xl text-sm transition mt-4 active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Créer l'offre</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
