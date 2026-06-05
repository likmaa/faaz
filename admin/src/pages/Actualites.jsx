import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Loader2, Newspaper, Star, ImageIcon } from 'lucide-react';
import api from '../services/api';
import StatusBadge from '../components/ui/StatusBadge';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { toast } from '../store/toast';
import { getImageUrl } from '../utils/imageUrl';

const EMPTY_FORM = {
  title: '', content: '', category: '', cover_image: '', date: '', featured: false, status: 'brouillon',
};

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
}

export default function Actualites() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [drawer, setDrawer] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => { fetchItems(); }, []);

  async function fetchItems() {
    setLoading(true);
    try {
      const res = await api.get('/news/');
      setItems(res.data);
    } catch {
      toast.error('Impossible de charger les actualités.');
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditing(null);
    setForm({ ...EMPTY_FORM, date: new Date().toISOString().slice(0, 10) });
    setDrawer(true);
  }

  function openEdit(item) {
    setEditing(item);
    setForm({
      title: item.title,
      content: item.content || '',
      category: item.category || '',
      cover_image: item.cover_image || '',
      date: item.date || '',
      featured: item.featured || false,
      status: item.status || 'brouillon',
    });
    setDrawer(true);
  }

  async function handleSave() {
    if (!form.title.trim()) { toast.warning('Le titre est obligatoire.'); return; }
    setSaving(true);
    try {
      if (editing) {
        const res = await api.patch(`/news/${editing.id}/`, form);
        setItems(prev => prev.map(n => n.id === editing.id ? res.data : n));
        toast.success('Actualité mise à jour.');
      } else {
        const res = await api.post('/news/', form);
        setItems(prev => [res.data, ...prev]);
        toast.success('Actualité créée.');
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
      await api.delete(`/news/${deleteTarget.id}/`);
      setItems(prev => prev.filter(n => n.id !== deleteTarget.id));
      toast.success('Actualité supprimée.');
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
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight font-title">Actualités</h1>
          <p className="text-slate-500 text-sm mt-1">Articles et nouvelles de la fondation</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold transition shadow-sm">
          <Plus className="w-4 h-4" /> Nouvel article
        </button>
      </div>

      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-7 h-7 text-primary-600 animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
          <Newspaper className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 font-title">Aucune actualité publiée</h3>
          <p className="text-slate-400 text-sm mt-1 mb-5">Publiez vos premières nouvelles.</p>
          <button onClick={openCreate} className="px-4 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-bold hover:bg-primary-700 transition">Créer</button>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-400">Aperçu</th>
                  <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-400">Titre</th>
                  <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-400">Catégorie</th>
                  <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-400">Date</th>
                  <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-400">À la une</th>
                  <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-400">Statut</th>
                  <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-5 py-4">
                      {getImageUrl(item.cover_image) ? (
                        <img
                          src={getImageUrl(item.cover_image)}
                          alt={item.title}
                          className="w-14 h-14 object-cover rounded-xl border border-slate-200 shadow-sm"
                          onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}
                        />
                      ) : null}
                      <div className={`w-14 h-14 rounded-xl bg-slate-100 border border-slate-200 items-center justify-center ${getImageUrl(item.cover_image) ? 'hidden' : 'flex'}`}>
                        <ImageIcon className="w-5 h-5 text-slate-300" />
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-bold text-slate-800 truncate max-w-xs">{item.title}</p>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-500">{item.category || '—'}</td>
                    <td className="px-5 py-4 text-sm text-slate-600">{formatDate(item.date)}</td>
                    <td className="px-5 py-4">
                      {item.featured && <Star className="w-4 h-4 text-amber-400 fill-amber-400" />}
                    </td>
                    <td className="px-5 py-4"><StatusBadge status={item.status || 'brouillon'} /></td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openEdit(item)} className="p-2 rounded-xl bg-sky-50 text-sky-600 hover:bg-sky-100 transition"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => setDeleteTarget(item)} className="p-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition"><Trash2 className="w-4 h-4" /></button>
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
              <h2 className="font-bold text-slate-900 text-base">{editing ? 'Modifier l\'article' : 'Nouvel article'}</h2>
              <button onClick={() => setDrawer(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Titre <span className="text-red-500">*</span></label>
                <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Catégorie</label>
                <input type="text" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  placeholder="Ex: Événement, Annonce…"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Image de couverture (URL ou chemin)</label>
                <input type="text" value={form.cover_image} onChange={e => setForm(f => ({ ...f, cover_image: e.target.value }))}
                  placeholder="Ex: /img/about1.png ou https://..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition" />
                {form.cover_image && getImageUrl(form.cover_image) && (
                  <div className="mt-2 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 h-40">
                    <img
                      src={getImageUrl(form.cover_image)}
                      alt="Aperçu"
                      className="w-full h-full object-cover"
                      onError={e => { e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-slate-400 text-xs">Image introuvable</div>'; }}
                    />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Date</label>
                <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Contenu</label>
                <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} rows={8}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition resize-none" />
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="featured" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))}
                  className="rounded accent-primary-600 w-4 h-4" />
                <label htmlFor="featured" className="text-sm font-semibold text-slate-700">À la une (slider d'accueil)</label>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Statut</label>
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition">
                  <option value="brouillon">Brouillon</option>
                  <option value="publie">Publié</option>
                </select>
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
        message="Cet article sera définitivement supprimé."
        confirmLabel="Supprimer"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
