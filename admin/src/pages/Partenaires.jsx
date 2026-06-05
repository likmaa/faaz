import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, GripVertical, Loader2, Building2, ExternalLink } from 'lucide-react';
import api from '../services/api';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { toast } from '../store/toast';
import { getImageUrl } from '../utils/imageUrl';

const EMPTY_FORM = { name: '', link: '', logo: '', description: '' };

export default function Partenaires() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dragging, setDragging] = useState(null);
  const [over, setOver] = useState(null);

  const [drawer, setDrawer] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => { fetchItems(); }, []);

  async function fetchItems() {
    setLoading(true);
    try {
      const res = await api.get('/partners/');
      setItems(res.data);
    } catch {
      toast.error('Impossible de charger les partenaires.');
    } finally {
      setLoading(false);
    }
  }

  function openCreate() { setEditing(null); setForm(EMPTY_FORM); setDrawer(true); }
  function openEdit(p) { setEditing(p); setForm({ name: p.name, link: p.link || '', logo: p.logo || '', description: p.description || '' }); setDrawer(true); }

  async function handleSave() {
    if (!form.name.trim()) { toast.warning('Le nom est obligatoire.'); return; }
    setSaving(true);
    try {
      if (editing) {
        const res = await api.patch(`/partners/${editing.id}/`, form);
        setItems(prev => prev.map(p => p.id === editing.id ? res.data : p));
        toast.success('Partenaire mis à jour.');
      } else {
        const res = await api.post('/partners/', form);
        setItems(prev => [...prev, res.data]);
        toast.success('Partenaire ajouté.');
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
      await api.delete(`/partners/${deleteTarget.id}/`);
      setItems(prev => prev.filter(p => p.id !== deleteTarget.id));
      toast.success(`"${deleteTarget.name}" supprimé.`);
    } catch {
      toast.error('Erreur lors de la suppression.');
    } finally {
      setDeleteTarget(null);
    }
  }

  function onDragStart(i) { setDragging(i); }
  function onDragOver(e, i) { e.preventDefault(); setOver(i); }
  function onDrop(e, i) {
    e.preventDefault();
    if (dragging === null || dragging === i) return;
    const next = [...items];
    const [moved] = next.splice(dragging, 1);
    next.splice(i, 0, moved);
    setItems(next);
    setDragging(null); setOver(null);
    toast.info('Ordre mis à jour.');
  }
  function onDragEnd() { setDragging(null); setOver(null); }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight font-title">Partenaires</h1>
          <p className="text-slate-500 text-sm mt-1">Organismes et entités partenaires de la fondation</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold transition shadow-sm">
          <Plus className="w-4 h-4" /> Ajouter un partenaire
        </button>
      </div>

      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-7 h-7 text-primary-600 animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 font-title">Aucun partenaire</h3>
          <p className="text-slate-400 text-sm mt-1 mb-5">Ajoutez les partenaires de la fondation.</p>
          <button onClick={openCreate} className="px-4 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-bold hover:bg-primary-700 transition">Ajouter</button>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((p, i) => (
            <div
              key={p.id}
              draggable
              onDragStart={() => onDragStart(i)}
              onDragOver={e => onDragOver(e, i)}
              onDrop={e => onDrop(e, i)}
              onDragEnd={onDragEnd}
              className={`bg-white border rounded-2xl px-5 py-4 shadow-sm flex items-center gap-4 transition ${
                over === i && dragging !== i ? 'border-primary-400 bg-primary-50' : 'border-slate-200 hover:border-slate-300'
              } ${dragging === i ? 'opacity-50' : ''}`}
            >
              <GripVertical className="w-5 h-5 text-slate-300 cursor-grab active:cursor-grabbing flex-shrink-0" />

              {/* Logo */}
              {getImageUrl(p.logo) ? (
                <img src={getImageUrl(p.logo)} alt={p.name} className="w-12 h-10 object-contain rounded-lg border border-slate-100 bg-white flex-shrink-0" />
              ) : (
                <div className="w-12 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-5 h-5 text-slate-400" />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-800 text-sm">{p.name}</p>
                {p.description && <p className="text-xs text-slate-500 mt-0.5 truncate">{p.description}</p>}
                {p.link && (
                  <a href={p.link} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-sky-600 hover:underline flex items-center gap-0.5 mt-0.5">
                    <ExternalLink className="w-3 h-3" /> {p.link}
                  </a>
                )}
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => openEdit(p)} className="p-2 rounded-xl bg-sky-50 text-sky-600 hover:bg-sky-100 transition"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => setDeleteTarget(p)} className="p-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Drawer */}
      {drawer && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setDrawer(false)} />
          <div className="relative bg-white w-full max-w-md h-full shadow-2xl flex flex-col">
            <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
              <h2 className="font-bold text-slate-900 text-base">{editing ? 'Modifier le partenaire' : 'Ajouter un partenaire'}</h2>
              <button onClick={() => setDrawer(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Nom <span className="text-red-500">*</span></label>
                <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Logo (URL)</label>
                <input type="text" value={form.logo} onChange={e => setForm(f => ({ ...f, logo: e.target.value }))}
                  placeholder="https://… ou /img/…"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition mb-2" />
                {getImageUrl(form.logo) && (
                  <div className="w-20 h-16 rounded-xl border border-slate-200 bg-white flex items-center justify-center p-2 shadow-sm">
                    <img src={getImageUrl(form.logo)} alt="Aperçu logo" className="max-w-full max-h-full object-contain" onError={e => e.target.style.display = 'none'} />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Lien (URL)</label>
                <input type="url" value={form.link} onChange={e => setForm(f => ({ ...f, link: e.target.value }))}
                  placeholder="https://…"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Description courte</label>
                <input type="text" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition" />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
              <button onClick={() => setDrawer(false)} className="px-4 py-2.5 rounded-xl text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition">Annuler</button>
              <button onClick={handleSave} disabled={saving} className="px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 transition disabled:opacity-60 flex items-center gap-2">
                {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {editing ? 'Enregistrer' : 'Ajouter'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title={`Supprimer "${deleteTarget?.name}" ?`}
        message="Ce partenaire sera retiré du site."
        confirmLabel="Supprimer"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
