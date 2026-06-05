import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Loader2, ImageIcon, X, PlusCircle, MinusCircle } from 'lucide-react';
import api from '../services/api';
import StatusBadge from '../components/ui/StatusBadge';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { toast } from '../store/toast';

const EMPTY_FORM = {
  title: '', story: '', date: '', project: '', status: 'brouillon',
  media_urls: [], stats: [{ label: '', value: '' }],
};

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
}

export default function Realisations() {
  const [items, setItems] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [drawer, setDrawer] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [mediaInput, setMediaInput] = useState('');

  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const [rRes, pRes] = await Promise.all([api.get('/realisations/'), api.get('/projects/')]);
      setItems(rRes.data);
      setProjects(pRes.data);
    } catch {
      toast.error('Impossible de charger les réalisations.');
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditing(null);
    setForm({ ...EMPTY_FORM, project: projects[0]?.id || '', stats: [{ label: '', value: '' }] });
    setMediaInput('');
    setDrawer(true);
  }

  function openEdit(r) {
    setEditing(r);
    setForm({
      title: r.title,
      story: r.story,
      date: r.date,
      project: r.project,
      status: r.status || 'brouillon',
      media_urls: r.media_urls || [],
      stats: (r.stats && r.stats.length > 0) ? r.stats : [{ label: '', value: '' }],
    });
    setMediaInput('');
    setDrawer(true);
  }

  function addMedia() {
    const url = mediaInput.trim();
    if (!url) return;
    setForm(f => ({ ...f, media_urls: [...f.media_urls, url] }));
    setMediaInput('');
  }

  function removeMedia(i) {
    setForm(f => ({ ...f, media_urls: f.media_urls.filter((_, idx) => idx !== i) }));
  }

  function updateStat(i, key, val) {
    setForm(f => {
      const stats = [...f.stats];
      stats[i] = { ...stats[i], [key]: val };
      return { ...f, stats };
    });
  }

  function addStat() { setForm(f => ({ ...f, stats: [...f.stats, { label: '', value: '' }] })); }
  function removeStat(i) { setForm(f => ({ ...f, stats: f.stats.filter((_, idx) => idx !== i) })); }

  async function handleSave() {
    if (!form.title.trim() || !form.date || !form.project) {
      toast.warning('Titre, date et projet sont obligatoires.');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        story: form.story,
        date: form.date,
        project: form.project,
        media_urls: form.media_urls,
        stats: form.stats.filter(s => s.label.trim()),
      };
      if (editing) {
        const res = await api.patch(`/realisations/${editing.id}/`, payload);
        setItems(prev => prev.map(r => r.id === editing.id ? res.data : r));
        toast.success('Réalisation mise à jour.');
      } else {
        const res = await api.post('/realisations/', payload);
        setItems(prev => [...prev, res.data]);
        toast.success('Réalisation créée.');
      }
      setDrawer(false);
    } catch {
      toast.error('Erreur lors de l\'enregistrement.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    try {
      await api.delete(`/realisations/${deleteTarget.id}/`);
      setItems(prev => prev.filter(r => r.id !== deleteTarget.id));
      toast.success('Réalisation supprimée.');
    } catch {
      toast.error('Erreur lors de la suppression.');
    } finally {
      setDeleteTarget(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight font-title">Réalisations & Activités</h1>
          <p className="text-slate-500 text-sm mt-1">Preuve d'impact publiée sur le site</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold transition shadow-sm">
          <Plus className="w-4 h-4" /> Nouvelle réalisation
        </button>
      </div>

      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-7 h-7 text-primary-600 animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
          <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 font-title">Aucune réalisation publiée</h3>
          <p className="text-slate-400 text-sm mt-1 mb-5">Ajoutez la preuve d'impact de vos projets.</p>
          <button onClick={openCreate} className="px-4 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-bold hover:bg-primary-700 transition">Ajouter</button>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-400">Titre</th>
                  <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-400">Projet lié</th>
                  <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-400">Date</th>
                  <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-400">Médias</th>
                  <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map(r => (
                  <tr key={r.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-5 py-4">
                      <p className="text-sm font-bold text-slate-800">{r.title}</p>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">{r.project_title || '—'}</td>
                    <td className="px-5 py-4 text-sm text-slate-600">{formatDate(r.date)}</td>
                    <td className="px-5 py-4 text-sm text-slate-500">{(r.media_urls || []).length} image{(r.media_urls || []).length !== 1 ? 's' : ''}</td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openEdit(r)} className="p-2 rounded-xl bg-sky-50 text-sky-600 hover:bg-sky-100 transition"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => setDeleteTarget(r)} className="p-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Drawer */}
      {drawer && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setDrawer(false)} />
          <div className="relative bg-white w-full max-w-lg h-full shadow-2xl flex flex-col">
            <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
              <h2 className="font-bold text-slate-900 text-base">{editing ? 'Modifier la réalisation' : 'Nouvelle réalisation'}</h2>
              <button onClick={() => setDrawer(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Titre <span className="text-red-500">*</span></label>
                <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition" />
              </div>

              {/* Project */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Projet lié <span className="text-red-500">*</span></label>
                <select value={form.project} onChange={e => setForm(f => ({ ...f, project: e.target.value }))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition">
                  {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Date <span className="text-red-500">*</span></label>
                <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition" />
              </div>

              {/* Story */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Récit / Description</label>
                <textarea value={form.story} onChange={e => setForm(f => ({ ...f, story: e.target.value }))} rows={5}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition resize-none" />
              </div>

              {/* Media URLs */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Images (URLs)</label>
                <div className="flex gap-2 mb-2">
                  <input type="text" value={mediaInput} onChange={e => setMediaInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addMedia())}
                    placeholder="https://…"
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition" />
                  <button onClick={addMedia} className="px-3 py-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition text-sm font-bold">Ajouter</button>
                </div>
                {form.media_urls.map((url, i) => (
                  <div key={i} className="flex items-center gap-2 mb-1">
                    <span className="flex-1 text-xs text-slate-500 truncate">{url}</span>
                    <button onClick={() => removeMedia(i)} className="text-red-400 hover:text-red-600"><X className="w-3.5 h-3.5" /></button>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-2">Statistiques clés</label>
                {form.stats.map((s, i) => (
                  <div key={i} className="flex gap-2 mb-2 items-center">
                    <input type="text" value={s.label} onChange={e => updateStat(i, 'label', e.target.value)}
                      placeholder="Libellé (ex: Bénéficiaires)"
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500 transition" />
                    <input type="text" value={s.value} onChange={e => updateStat(i, 'value', e.target.value)}
                      placeholder="Valeur (ex: 122)"
                      className="w-24 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500 transition" />
                    <button onClick={() => removeStat(i)} className="text-red-400 hover:text-red-600"><MinusCircle className="w-4 h-4" /></button>
                  </div>
                ))}
                <button onClick={addStat} className="flex items-center gap-1 text-xs font-bold text-primary-600 hover:text-primary-700 transition mt-1">
                  <PlusCircle className="w-3.5 h-3.5" /> Ajouter une statistique
                </button>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
              <button onClick={() => setDrawer(false)} className="px-4 py-2.5 rounded-xl text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition">Annuler</button>
              <button onClick={handleSave} disabled={saving} className="px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 transition disabled:opacity-60 flex items-center gap-2">
                {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {editing ? 'Enregistrer' : 'Créer'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title={`Supprimer "${deleteTarget?.title}" ?`}
        message="Cette réalisation sera définitivement supprimée."
        confirmLabel="Supprimer"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
