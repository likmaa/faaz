import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, GripVertical, Loader2, Tag } from 'lucide-react';
import api from '../services/api';
import StatusBadge from '../components/ui/StatusBadge';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { toast } from '../store/toast';

const EMPTY_FORM = { name: '', description: '', status: 'actif' };

export default function Axes() {
  const [axes, setAxes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dragging, setDragging] = useState(null);  // index being dragged
  const [over, setOver] = useState(null);           // index hovered over

  // Drawer
  const [drawer, setDrawer] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => { fetchAxes(); }, []);

  async function fetchAxes() {
    setLoading(true);
    try {
      const res = await api.get('/axes/');
      setAxes(res.data);
    } catch {
      toast.error('Impossible de charger les axes.');
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setDrawer(true);
  }

  function openEdit(axe) {
    setEditing(axe);
    setForm({ name: axe.name, description: axe.description || '', status: axe.status });
    setDrawer(true);
  }

  async function handleSave() {
    if (!form.name.trim()) { toast.warning('Le nom est obligatoire.'); return; }
    setSaving(true);
    try {
      if (editing) {
        const res = await api.patch(`/axes/${editing.id}/`, form);
        setAxes(prev => prev.map(a => a.id === editing.id ? res.data : a));
        toast.success('Axe mis à jour.');
      } else {
        const res = await api.post('/axes/', form);
        setAxes(prev => [...prev, res.data]);
        toast.success('Axe créé.');
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
      await api.delete(`/axes/${deleteTarget.id}/`);
      setAxes(prev => prev.filter(a => a.id !== deleteTarget.id));
      toast.success(`Axe "${deleteTarget.name}" supprimé.`);
    } catch {
      toast.error('Impossible de supprimer cet axe (des projets y sont rattachés ?).');
    } finally {
      setDeleteTarget(null);
    }
  }

  // Drag-and-drop reorder (local only — persist via PATCH order if backend supports it)
  function onDragStart(i) { setDragging(i); }
  function onDragOver(e, i) { e.preventDefault(); setOver(i); }
  function onDrop(e, i) {
    e.preventDefault();
    if (dragging === null || dragging === i) return;
    const next = [...axes];
    const [moved] = next.splice(dragging, 1);
    next.splice(i, 0, moved);
    setAxes(next);
    setDragging(null);
    setOver(null);
    toast.info('Ordre mis à jour localement.');
  }
  function onDragEnd() { setDragging(null); setOver(null); }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight font-title">Axes d'intervention</h1>
          <p className="text-slate-500 text-sm mt-1">Causes et domaines d'action de la fondation — réordonnez par glisser-déposer</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold transition shadow-sm"
        >
          <Plus className="w-4 h-4" /> Nouvel axe
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-7 h-7 text-primary-600 animate-spin" />
          <span className="text-sm font-semibold text-slate-500">Chargement…</span>
        </div>
      ) : axes.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
          <Tag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 font-title">Aucun axe défini</h3>
          <p className="text-slate-400 text-sm mt-1 mb-5">Créez les domaines d'intervention de la fondation.</p>
          <button onClick={openCreate} className="px-4 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-bold hover:bg-primary-700 transition">
            Créer le premier axe
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {axes.map((axe, i) => (
            <div
              key={axe.id}
              draggable
              onDragStart={() => onDragStart(i)}
              onDragOver={e => onDragOver(e, i)}
              onDrop={e => onDrop(e, i)}
              onDragEnd={onDragEnd}
              className={`bg-white border rounded-2xl px-5 py-4 shadow-sm flex items-center gap-4 transition ${
                over === i && dragging !== i ? 'border-primary-400 bg-primary-50' : 'border-slate-200 hover:border-slate-300'
              } ${dragging === i ? 'opacity-50' : ''}`}
            >
              {/* Drag handle */}
              <GripVertical className="w-5 h-5 text-slate-300 cursor-grab active:cursor-grabbing flex-shrink-0" />

              {/* Order badge */}
              <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-500 text-xs font-bold flex items-center justify-center flex-shrink-0">
                {i + 1}
              </span>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <p className="font-bold text-slate-800 text-sm">{axe.name}</p>
                  <StatusBadge status={axe.status} />
                  {axe.projects_count !== undefined && (
                    <span className="text-xs text-slate-400 font-semibold">{axe.projects_count} projet{axe.projects_count !== 1 ? 's' : ''}</span>
                  )}
                </div>
                {axe.description && (
                  <p className="text-xs text-slate-500 mt-0.5 truncate">{axe.description}</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => openEdit(axe)}
                  className="p-2 rounded-xl bg-sky-50 text-sky-600 hover:bg-sky-100 transition"
                  title="Modifier"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteTarget(axe)}
                  className="p-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
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
              <h2 className="font-bold text-slate-900 text-base">{editing ? 'Modifier l\'axe' : 'Nouvel axe'}</h2>
              <button onClick={() => setDrawer(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Nom <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Ex: Excellence scolaire"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={4}
                  placeholder="Brève description du domaine d'intervention…"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Statut</label>
                <select
                  value={form.status}
                  onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
                >
                  <option value="actif">Actif</option>
                  <option value="a_venir">À venir</option>
                </select>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => setDrawer(false)}
                className="px-4 py-2.5 rounded-xl text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 transition disabled:opacity-60 flex items-center gap-2"
              >
                {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {editing ? 'Enregistrer' : 'Créer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        title={`Supprimer "${deleteTarget?.name}" ?`}
        message="Cette action est irréversible. Les projets rattachés à cet axe ne pourront plus être supprimés s'ils existent."
        confirmLabel="Supprimer"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
