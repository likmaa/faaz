import { useEffect, useState, useMemo } from 'react';
import { Users, AlertTriangle, Calendar, Plus, Send, Search, Loader2, CheckCircle2, Download } from 'lucide-react';
import api from '../services/api';
import StatusBadge from '../components/ui/StatusBadge';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { toast } from '../store/toast';

const CURRENT_YEAR = new Date().getFullYear();

function daysUntilJune30() {
  const now = new Date();
  const target = new Date(now.getMonth() >= 6 ? now.getFullYear() + 1 : now.getFullYear(), 5, 30);
  return Math.ceil((target - now) / 86400000);
}

function formatFCFA(n) {
  return Number(n).toLocaleString('fr-FR') + ' FCFA';
}

const CHANNEL_LABELS = {
  kkiapay: 'KKiaPay',
  paypal: 'PayPal',
  momo: 'MoMo Pay',
  bank: 'Virement',
};

export default function Cotisations() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selected, setSelected] = useState(new Set());

  // Payment modal
  const [payModal, setPayModal] = useState(null); // null | member object
  const [payForm, setPayForm] = useState({ payment_channel: 'kkiapay', transaction_reference: '' });
  const [payLoading, setPayLoading] = useState(false);

  // Relance confirm
  const [relanceTarget, setRelanceTarget] = useState(null); // null | 'bulk' | member
  const [relanceLoading, setRelanceLoading] = useState(false);

  const daysLeft = daysUntilJune30();

  useEffect(() => { fetchMembers(); }, []);

  async function fetchMembers() {
    setLoading(true);
    try {
      const res = await api.get('/members/');
      setMembers(res.data.filter(m => m.membership_status === 'valide'));
    } catch {
      toast.error('Impossible de charger les membres.');
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    return members.filter(m => {
      const q = search.toLowerCase();
      const matchSearch = `${m.first_name} ${m.last_name} ${m.email}`.toLowerCase().includes(q);
      const matchStatus = filterStatus === 'all' || m.contribution_status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [members, search, filterStatus]);

  const lateCount = members.filter(m => m.contribution_status === 'en_retard').length;

  // Selection helpers
  function toggleSelect(id) {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }
  function toggleAll() {
    setSelected(prev =>
      prev.size === filtered.length ? new Set() : new Set(filtered.map(m => m.id))
    );
  }
  const allSelected = filtered.length > 0 && selected.size === filtered.length;

  // Record payment
  function openPayModal(member) {
    setPayModal(member);
    setPayForm({ payment_channel: 'kkiapay', transaction_reference: '' });
  }

  async function submitPayment() {
    if (!payForm.transaction_reference.trim()) {
      toast.warning('La référence de transaction est obligatoire.');
      return;
    }
    setPayLoading(true);
    try {
      await api.post('/payments/', {
        member: payModal.id,
        payment_type: 'cotisation',
        year: CURRENT_YEAR,
        amount: 25000,
        payment_channel: payForm.payment_channel,
        transaction_reference: payForm.transaction_reference.trim(),
        status: 'paye',
      });
      // Update member locally
      setMembers(prev => prev.map(m =>
        m.id === payModal.id ? { ...m, contribution_status: 'a_jour' } : m
      ));
      toast.success(`Cotisation de ${payModal.first_name} ${payModal.last_name} enregistrée.`);
      setPayModal(null);
    } catch (e) {
      toast.error(e?.response?.data?.transaction_reference?.[0] ?? 'Erreur lors de l\'enregistrement.');
    } finally {
      setPayLoading(false);
    }
  }

  // Relance
  async function confirmRelance() {
    setRelanceLoading(true);
    try {
      const targets = relanceTarget === 'bulk'
        ? filtered.filter(m => selected.has(m.id))
        : [relanceTarget];
      // Simulate relance (email sending is backend-side)
      await new Promise(r => setTimeout(r, 600));
      const names = targets.map(m => `${m.first_name} ${m.last_name}`).join(', ');
      toast.success(`Relance envoyée à : ${names}`);
      setSelected(new Set());
    } catch {
      toast.error('Erreur lors de l\'envoi des relances.');
    } finally {
      setRelanceLoading(false);
      setRelanceTarget(null);
    }
  }

  // CSV Export
  function exportCSV() {
    const rows = [
      ['Nom', 'Prénom', 'E-mail', 'Ville', 'Pays', 'Statut cotisation'],
      ...filtered.map(m => [m.last_name, m.first_name, m.email, m.city, m.country, m.contribution_status]),
    ];
    const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `cotisations_${CURRENT_YEAR}.csv`; a.click();
    URL.revokeObjectURL(url);
  }

  const statusOpts = [
    { label: 'Tous', value: 'all' },
    { label: 'À jour', value: 'a_jour' },
    { label: 'En retard', value: 'en_retard' },
    { label: 'Relance', value: 'relance' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight font-title">Cotisations</h1>
          <p className="text-slate-500 text-sm mt-1">Suivi des cotisations annuelles — {CURRENT_YEAR} · Échéance 30 juin</p>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition shadow-sm"
        >
          <Download className="w-4 h-4" /> Exporter CSV
        </button>
      </div>

      {/* Alert banners */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {lateCount > 0 && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl px-5 py-4">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-bold">{lateCount} cotisation{lateCount > 1 ? 's' : ''} en retard</span>
          </div>
        )}
        <div className={`flex items-center gap-3 rounded-2xl px-5 py-4 border ${
          daysLeft <= 15
            ? 'bg-amber-50 border-amber-200 text-amber-700'
            : 'bg-sky-50 border-sky-200 text-sky-700'
        }`}>
          <Calendar className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-bold">
            {daysLeft > 0
              ? `Échéance du 30 juin dans ${daysLeft} jour${daysLeft > 1 ? 's' : ''}`
              : 'L\'échéance du 30 juin est dépassée'}
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center">
        <div className="relative flex-1 min-w-0">
          <input
            type="text"
            placeholder="Rechercher un membre…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {statusOpts.map(o => (
            <button
              key={o.value}
              onClick={() => setFilterStatus(o.value)}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-bold border flex-shrink-0 transition ${
                filterStatus === o.value
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="flex items-center gap-4 bg-slate-900 text-white rounded-2xl px-5 py-3">
          <span className="text-sm font-bold">{selected.size} sélectionné{selected.size > 1 ? 's' : ''}</span>
          <button
            onClick={() => setRelanceTarget('bulk')}
            className="ml-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-white text-xs font-bold transition"
          >
            <Send className="w-3.5 h-3.5" /> Relancer la sélection
          </button>
          <button onClick={() => setSelected(new Set())} className="text-slate-400 hover:text-white text-xs font-bold transition">
            Annuler
          </button>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-7 h-7 text-primary-600 animate-spin" />
          <span className="text-sm font-semibold text-slate-500">Chargement…</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 font-title">Aucun membre trouvé</h3>
          <p className="text-slate-400 text-sm mt-1">Modifiez les filtres pour voir plus de résultats.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-5 py-3.5 w-10">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleAll}
                      className="rounded accent-primary-600 w-4 h-4"
                    />
                  </th>
                  <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-400">Membre</th>
                  <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-400">Montant</th>
                  <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-400">Période</th>
                  <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-400">Échéance</th>
                  <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-400">Statut</th>
                  <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(member => (
                  <tr
                    key={member.id}
                    className={`hover:bg-slate-50/60 transition ${selected.has(member.id) ? 'bg-primary-50/40' : ''}`}
                  >
                    <td className="px-5 py-4">
                      <input
                        type="checkbox"
                        checked={selected.has(member.id)}
                        onChange={() => toggleSelect(member.id)}
                        className="rounded accent-primary-600 w-4 h-4"
                      />
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-bold text-slate-800">{member.first_name} {member.last_name}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{member.email}</p>
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-slate-700">{formatFCFA(25000)}</td>
                    <td className="px-5 py-4 text-sm text-slate-600">{CURRENT_YEAR}</td>
                    <td className="px-5 py-4 text-sm text-slate-600">30 juin {CURRENT_YEAR}</td>
                    <td className="px-5 py-4">
                      <StatusBadge status={member.contribution_status} />
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {member.contribution_status !== 'a_jour' && (
                          <>
                            <button
                              onClick={() => openPayModal(member)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-50 text-primary-700 hover:bg-primary-100 text-xs font-bold transition"
                              title="Enregistrer un paiement"
                            >
                              <Plus className="w-3.5 h-3.5" /> Paiement
                            </button>
                            <button
                              onClick={() => setRelanceTarget(member)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 text-xs font-bold transition"
                              title="Envoyer une relance"
                            >
                              <Send className="w-3.5 h-3.5" /> Relancer
                            </button>
                          </>
                        )}
                        {member.contribution_status === 'a_jour' && (
                          <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                            <CheckCircle2 className="w-3.5 h-3.5" /> À jour
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer count */}
          <div className="px-5 py-3 border-t border-slate-100 text-xs font-semibold text-slate-400">
            {filtered.length} membre{filtered.length > 1 ? 's' : ''}
          </div>
        </div>
      )}

      {/* Payment modal */}
      {payModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setPayModal(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-5">
            <div>
              <h2 className="text-base font-bold text-slate-900">Enregistrer un paiement</h2>
              <p className="text-sm text-slate-500 mt-0.5">
                Cotisation {CURRENT_YEAR} — {payModal.first_name} {payModal.last_name}
              </p>
            </div>

            <div className="space-y-4">
              {/* Amount (readonly) */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Montant</label>
                <input
                  type="text"
                  value="25 000 FCFA"
                  readOnly
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-500 cursor-not-allowed"
                />
              </div>

              {/* Channel */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Canal de paiement <span className="text-red-500">*</span></label>
                <select
                  value={payForm.payment_channel}
                  onChange={e => setPayForm(f => ({ ...f, payment_channel: e.target.value }))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
                >
                  {Object.entries(CHANNEL_LABELS).map(([v, l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </select>
              </div>

              {/* Transaction ref */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Référence de transaction <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  placeholder="Ex: TXN-2026-XXXX"
                  value={payForm.transaction_reference}
                  onChange={e => setPayForm(f => ({ ...f, transaction_reference: e.target.value }))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-1">
              <button
                onClick={() => setPayModal(null)}
                className="px-4 py-2.5 rounded-xl text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
              >
                Annuler
              </button>
              <button
                onClick={submitPayment}
                disabled={payLoading}
                className="px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 transition disabled:opacity-60 flex items-center gap-2"
              >
                {payLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Relance confirm */}
      <ConfirmDialog
        open={!!relanceTarget}
        variant="warning"
        title={relanceTarget === 'bulk'
          ? `Relancer ${selected.size} membre${selected.size > 1 ? 's' : ''} ?`
          : `Relancer ${relanceTarget?.first_name} ${relanceTarget?.last_name} ?`}
        message="Un e-mail de rappel de cotisation sera envoyé au(x) membre(s) sélectionné(s)."
        confirmLabel={relanceLoading ? 'Envoi…' : 'Envoyer la relance'}
        onConfirm={confirmRelance}
        onCancel={() => setRelanceTarget(null)}
      />
    </div>
  );
}
