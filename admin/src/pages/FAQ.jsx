import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, GripVertical, Loader2, HelpCircle } from 'lucide-react';
import api from '../services/api';
import StatusBadge from '../components/ui/StatusBadge';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { toast } from '../store/toast';

const EMPTY_FORM = { question: '', answer: '', category: '', order: 0, status: 'publie' };

export default function FAQ() {
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
      const res = await api.get('/faq/');
      setItems(res.data);
    } catch {
      toast.error('Impossible de charger la FAQ.');
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditing(null);
    setForm({ ...EMPTY_FORM, order: items.length + 1 });
    setDrawer(true);
  }

  function openEdit(item) {
    setEditing(item);
    setForm({
      question: item.question,
      answer: item.answer,
      category: item.category || '',
      order: item.order,
      status: item.status || 'publie',
    });
    setDrawer(true);
  }

  async function handleSave() {
    if (!form.question.trim() || !form.answer.trim()) {
      toast.warning('La question et la réponse sont obligatoires.');
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        const res = await api.patch(`/faq/${editing.id}/`, form);
        setItems(prev => prev.map(f => f.id === editing.id ? res.data : f));
        toast.success('Question mise à jour.');
      } else {
        const res = await api.post('/faq/', form);
        setItems(prev => [...prev, res.data]);
        toast.success('Question ajoutée.');
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
      await api.delete(`/faq/${deleteTarget.id}/`);
      setItems(prev => prev.filter(f => f.id !== deleteTarget.id));
      toast.success('Question supprimée.');
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
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight font-title">FAQ</h1>
          <p className="text-slate-500 text-sm mt-1">Questions fréquemment posées — réordonnez par glisser-déposer</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold transition shadow-sm">
          <Plus className="w-4 h-4" /> Nouvelle question
        </button>
      </div>

      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-7 h-7 text-primary-600 animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
          <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 font-title">Aucune question dans la FAQ</h3>
          <p className="text-slate-400 text-sm mt-1 mb-5">Ajoutez les questions fréquentes.</p>
          <button onClick={openCreate} className="px-4 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-bold hover:bg-primary-700 transition">Ajouter</button>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item, i) => (
            <div
              key={item.id}
              draggable
              onDragStart={() => onDragStart(i)}
              onDragOver={e => onDragOver(e, i)}
              onDrop={e => onDrop(e, i)}
              onDragEnd={onDragEnd}
              className={`bg-white border rounded-2xl px-5 py-4 shadow-sm flex items-start gap-4 transition ${
                over === i && dragging !== i ? 'border-primary-400 bg-primary-50' : 'border-slate-200 hover:border-slate-300'
              } ${dragging === i ? 'opacity-50' : ''}`}
            >
              <GripVertical className="w-5 h-5 text-slate-300 cursor-grab active:cursor-grabbing flex-shrink-0 mt-0.5" />
              <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-500 text-xs font-bold flex items-center justify-center flex-shrink-0">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <p className="font-bold text-slate-800 text-sm">{item.question}</p>
                  {item.category && (
                    <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-lg font-semibold">{item.category}</span>
                  )}
                  <StatusBadge status={item.status || 'publie'} />
                </div>
                <p className="text-xs text-slate-500 line-clamp-2">{item.answer}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => openEdit(item)} className="p-2 rounded-xl bg-sky-50 text-sky-600 hover:bg-sky-100 transition"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => setDeleteTarget(item)} className="p-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Drawer */}
      {drawer && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setDrawer(false)} />
          <div className="relative bg-white w-full max-w-lg h-full shadow-2xl flex flex-col">
            <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
              <h2 className="font-bold text-slate-900 text-base">{editing ? 'Modifier la question' : 'Nouvelle question'}</h2>
              <button onClick={() => setDrawer(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Question <span className="text-red-500">*</span></label>
                <input type="text" value={form.question} onChange={e => setForm(f => ({ ...f, question: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Réponse <span className="text-red-500">*</span></label>
                <textarea value={form.answer} onChange={e => setForm(f => ({ ...f, answer: e.target.value }))} rows={6}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition resize-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Catégorie</label>
                <input type="text" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  placeholder="Ex: Adhésion, Dons, Général…"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Statut</label>
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition">
                  <option value="publie">Publié</option>
                  <option value="brouillon">Brouillon</option>
                </select>
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
        title="Supprimer cette question ?"
        message="La question sera définitivement retirée de la FAQ."
        confirmLabel="Supprimer"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
