import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Plus, Trash2, Loader2, Heart, Quote } from 'lucide-react';

export default function Temoignages() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  // Form states
  const [newTestimonial, setNewTestimonial] = useState({ nom: '', role: '', montant: '', message: '' });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  async function fetchTestimonials() {
    setLoading(true);
    try {
      const res = await api.get('/temoignages/');
      const list = Array.isArray(res.data) 
        ? res.data 
        : (Array.isArray(res.data?.results) 
            ? res.data.results 
            : (res.data?.data || []));
      setTestimonials(list);
    } catch (err) {
      console.error("Erreur lors de la récupération des témoignages.", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddTestimonial(e) {
    e.preventDefault();
    setAdding(true);
    try {
      const res = await api.post('/temoignages/', newTestimonial);
      setTestimonials([...testimonials, res.data]);
      setNewTestimonial({ nom: '', role: '', montant: '', message: '' });
    } catch (err) {
      alert("Erreur lors de l'ajout.");
    } finally {
      setAdding(false);
    }
  }

  async function handleDeleteTestimonial(id) {
    if (!window.confirm("Voulez-vous vraiment supprimer ce témoignage ?")) return;
    try {
      await api.delete(`/temoignages/${id}/`);
      setTestimonials(testimonials.filter(t => t.id !== id));
    } catch (err) {
      alert("Erreur lors de la suppression.");
    }
  }

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
        <span className="text-sm font-semibold text-slate-500">Chargement des témoignages…</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight font-title">Témoignages</h1>
        <p className="text-slate-500 text-sm mt-1">Gérez les témoignages de donateurs ou de bénéficiaires affichés sur la page d'accueil et d'à propos.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Testimonials list */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 font-title mb-6 flex items-center gap-2">
              <Quote className="w-5 h-5 text-primary-600" />
              Témoignages enregistrés
            </h2>

            {testimonials.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <Quote className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm font-medium">Aucun témoignage disponible.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {testimonials.map((item) => (
                  <div key={item.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-start justify-between gap-4 relative overflow-hidden group">
                    {/* Big Quote watermark */}
                    <Quote className="absolute right-4 bottom-[-10px] w-24 h-24 text-slate-200/40 pointer-events-none stroke-[1]" />
                    
                    <div className="flex-1 space-y-2 relative z-10">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-bold text-slate-800">{item.nom || item.name}</span>
                        {item.role && <span className="text-xs text-slate-400 font-semibold">({item.role})</span>}
                        {(item.montant || item.amount) && (
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold bg-primary-50 border border-primary-100 text-primary-700 px-2.5 py-0.5 rounded-full shadow-sm">
                            <Heart size={10} className="fill-primary-600 text-primary-600" />
                            Donateur · {item.montant || item.amount} FCFA
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed italic font-body">
                        "{item.message}"
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteTestimonial(item.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition flex-shrink-0 relative z-10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Add form */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm sticky top-24">
            <h2 className="text-lg font-bold text-slate-900 font-title mb-6">Ajouter un témoignage</h2>

            <form onSubmit={handleAddTestimonial} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-550 uppercase mb-2">Nom de l'auteur</label>
                <input
                  required
                  type="text"
                  placeholder="Ex: Ablavi G."
                  value={newTestimonial.nom}
                  onChange={(e) => setNewTestimonial({ ...newTestimonial, nom: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-550 uppercase mb-2">Rôle / Qualité</label>
                <input
                  type="text"
                  placeholder="Ex: Secrétaire Générale, Orphelinat..."
                  value={newTestimonial.role}
                  onChange={(e) => setNewTestimonial({ ...newTestimonial, role: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-550 uppercase mb-2">Montant du don (FCFA, Facultatif)</label>
                <input
                  type="text"
                  placeholder="Ex: 50 000"
                  value={newTestimonial.montant}
                  onChange={(e) => setNewTestimonial({ ...newTestimonial, montant: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-550 uppercase mb-2">Message</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Écrivez le message de soutien..."
                  value={newTestimonial.message}
                  onChange={(e) => setNewTestimonial({ ...newTestimonial, message: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                />
              </div>

              <button
                type="submit"
                disabled={adding}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-2xl text-sm transition disabled:opacity-60"
              >
                {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                <span>Publier le témoignage</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
