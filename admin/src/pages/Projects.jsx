import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { FolderHeart, Plus, Trash2, Edit, Loader2, DollarSign, X, Check, ImageIcon } from 'lucide-react';
import { getImageUrl } from '../utils/imageUrl';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [axes, setAxes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  
  // Form fields
  const [form, setForm] = useState({
    title: '',
    description: '',
    axe: '',
    target_amount: '',
    collected_amount: '0',
    status: 'collecte',
  });
  const [imageFile, setImageFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);

  useEffect(() => {
    fetchProjectsAndAxes();
  }, []);

  async function fetchProjectsAndAxes() {
    setLoading(true);
    try {
      const [projRes, axeRes] = await Promise.all([
        api.get('/projects/'),
        api.get('/axes/')
      ]);
      setProjects(projRes.data);
      setAxes(axeRes.data);
    } catch (err) {
      console.error("Erreur lors de la récupération des projets.", err);
    } finally {
      setLoading(false);
    }
  }

  function handleOpenCreate() {
    setEditingProject(null);
    setForm({
      title: '',
      description: '',
      axe: axes[0]?.id || '',
      target_amount: '',
      collected_amount: '0',
      status: 'collecte',
    });
    setImageFile(null);
    setPdfFile(null);
    setShowModal(true);
  }

  function handleOpenEdit(proj) {
    setEditingProject(proj);
    setForm({
      title: proj.title,
      description: proj.description,
      axe: proj.axe,
      target_amount: proj.target_amount,
      collected_amount: proj.collected_amount,
      status: proj.status,
    });
    setImageFile(null);
    setPdfFile(null);
    setShowModal(true);
  }

  async function handleDelete(id) {
    if (!confirm("Voulez-vous vraiment supprimer ce projet ?")) return;
    try {
      await api.delete(`/projects/${id}/`);
      setProjects(projects.filter(p => p.id !== id));
    } catch (err) {
      alert("Erreur lors de la suppression du projet.");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    // We must send multipart/form-data for image and PDF files
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('axe', form.axe);
    formData.append('target_amount', form.target_amount);
    formData.append('collected_amount', form.collected_amount);
    formData.append('status', form.status);
    
    if (imageFile) formData.append('image', imageFile);
    if (pdfFile) formData.append('pdf_file', pdfFile);

    try {
      let res;
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      
      if (editingProject) {
        res = await api.put(`/projects/${editingProject.id}/`, formData, config);
        setProjects(projects.map(p => p.id === editingProject.id ? res.data : p));
      } else {
        res = await api.post('/projects/', formData, config);
        setProjects([res.data, ...projects]);
      }
      setShowModal(false);
    } catch (err) {
      alert("Erreur lors de l'enregistrement du projet.");
    }
  }

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight font-title">Projets de dons</h1>
          <p className="text-slate-500 text-sm mt-1">Créez et modifiez les campagnes de dons de la fondation.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-full font-bold text-sm shadow-md shadow-primary-600/15 active:scale-[0.98] transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Nouveau projet
        </button>
      </div>

      {/* Grid Projects */}
      {loading ? (
        <div className="h-[40vh] flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
          <span className="text-sm font-semibold text-slate-500">Chargement des campagnes…</span>
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-sm">
          <FolderHeart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800 font-title">Aucune campagne en cours</h3>
          <p className="text-slate-400 text-sm mt-1">Cliquez sur "Nouveau projet" pour en ajouter un.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj) => {
            const percent = Math.min(100, Math.round((parseFloat(proj.collected_amount) / parseFloat(proj.target_amount)) * 100)) || 0;
            return (
              <div key={proj.id} className="bg-white border border-slate-200 rounded-3xl shadow-sm flex flex-col justify-between hover:shadow-md transition relative overflow-hidden">
                {/* Image du projet */}
                {getImageUrl(proj.image) ? (
                  <div className="h-40 overflow-hidden">
                    <img
                      src={getImageUrl(proj.image)}
                      alt={proj.title}
                      className="w-full h-full object-cover"
                      onError={e => { e.target.parentElement.classList.add('hidden'); e.target.parentElement.nextSibling.classList.remove('hidden'); }}
                    />
                  </div>
                ) : null}
                <div className={`h-40 bg-gradient-to-br from-primary-50 to-blue-100 flex items-center justify-center ${getImageUrl(proj.image) ? 'hidden' : ''}`}>
                  <ImageIcon className="w-10 h-10 text-primary-200" />
                </div>
                <div className="p-6 space-y-4">
                  {/* Badge */}
                  <div className="flex justify-between items-start">
                    <span className="inline-flex px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full font-bold text-[10px] uppercase tracking-wider">
                      {proj.axe_name}
                    </span>
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider ${
                        proj.status === 'collecte'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {proj.status === 'collecte' ? 'En collecte' : 'Réalisé'}
                    </span>
                  </div>

                  <div>
                    <h2 className="text-base font-bold text-slate-900 font-title line-clamp-1">{proj.title}</h2>
                    <p className="text-slate-400 text-xs mt-1.5 line-clamp-3 leading-relaxed">{proj.description}</p>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between text-xs font-bold text-slate-500">
                      <span>{parseFloat(proj.collected_amount).toLocaleString()} FCFA</span>
                      <span>{percent}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div className="bg-primary-600 h-full rounded-full transition-all duration-500" style={{ width: `${percent}%` }} />
                    </div>
                    <div className="text-[10px] text-slate-400 font-semibold flex items-center justify-between">
                      <span>Cible : {parseFloat(proj.target_amount).toLocaleString()} FCFA</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-6 py-4">
                  <button
                    onClick={() => handleOpenEdit(proj)}
                    className="p-2 border border-slate-200 text-slate-500 hover:bg-slate-50 rounded-xl transition"
                    title="Modifier"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(proj.id)}
                    className="p-2 border border-red-100 text-red-600 hover:bg-red-50 rounded-xl transition"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 z-30 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="bg-white border border-slate-200 w-full max-w-lg rounded-3xl p-8 shadow-2xl z-10 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-slate-900 font-title mb-6">
              {editingProject ? 'Modifier la campagne' : 'Créer une nouvelle campagne'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Titre du projet *</label>
                <input
                  required
                  type="text"
                  placeholder="Ex: Fournitures scolaires pour orphelins"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Description *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Objectifs de la campagne, impact attendu..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Axe associé *</label>
                  <select
                    value={form.axe}
                    onChange={(e) => setForm({ ...form, axe: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                  >
                    {axes.map(axe => (
                      <option key={axe.id} value={axe.id}>{axe.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Montant cible (FCFA) *</label>
                  <input
                    required
                    type="number"
                    placeholder="1500000"
                    value={form.target_amount}
                    onChange={(e) => setForm({ ...form, target_amount: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Montant collecté (FCFA) *</label>
                  <input
                    required
                    type="number"
                    placeholder="0"
                    value={form.collected_amount}
                    onChange={(e) => setForm({ ...form, collected_amount: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Statut *</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                  >
                    <option value="collecte">En collecte</option>
                    <option value="realise">Réalisé / Terminé</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Flyer / Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    className="w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Fiche Projet (PDF)</label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setPdfFile(e.target.files[0])}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-2xl text-sm transition mt-6 active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>{editingProject ? 'Sauvegarder les modifications' : 'Créer la campagne'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
