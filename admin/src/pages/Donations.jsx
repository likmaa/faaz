import { useEffect, useState, useMemo } from 'react';
import {
  HandCoins, Search, Download, Loader2, ChevronUp, ChevronDown, Filter
} from 'lucide-react';
import api from '../services/api';
import StatusBadge from '../components/ui/StatusBadge';
import { toast } from '../store/toast';
import { useAuthStore } from '../store/auth';

function formatFCFA(n) {
  return Number(n).toLocaleString('fr-FR') + ' FCFA';
}

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
}

const CHANNEL_LABELS = { feexpay: 'FeexPay', paypal: 'PayPal', momo: 'MoMo Pay', bank: 'Virement' };

export default function Donations() {
  const { user } = useAuthStore();
  const isReadOnly = user?.role === 'gestionnaire_communaute';
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterChannel, setFilterChannel] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [sortField, setSortField] = useState('created_at');
  const [sortDir, setSortDir] = useState('desc');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 20;

  useEffect(() => { fetchDonations(); }, []);

  async function fetchDonations() {
    setLoading(true);
    try {
      const res = await api.get('/donations/');
      setDonations(res.data);
    } catch {
      toast.error('Impossible de charger les dons.');
    } finally {
      setLoading(false);
    }
  }

  // Filtered + sorted
  const filtered = useMemo(() => {
    let list = donations.filter(d => {
      const name = d.is_anonymous ? 'anonyme' : `${d.donor_name || ''} ${d.member_name || ''}`.toLowerCase();
      const q = search.toLowerCase();
      const matchSearch = !q || name.includes(q) || (d.transaction_reference || '').toLowerCase().includes(q) || (d.project_title || '').toLowerCase().includes(q);
      const matchStatus = filterStatus === 'all' || d.status === filterStatus;
      const matchChannel = filterChannel === 'all' || d.payment_channel === filterChannel;
      const matchFrom = !dateFrom || new Date(d.created_at) >= new Date(dateFrom);
      const matchTo = !dateTo || new Date(d.created_at) <= new Date(dateTo + 'T23:59:59');
      return matchSearch && matchStatus && matchChannel && matchFrom && matchTo;
    });

    list = [...list].sort((a, b) => {
      let va = a[sortField], vb = b[sortField];
      if (sortField === 'amount') { va = parseFloat(va); vb = parseFloat(vb); }
      if (sortField === 'created_at') { va = new Date(va); vb = new Date(vb); }
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return list;
  }, [donations, search, filterStatus, filterChannel, dateFrom, dateTo, sortField, sortDir]);

  // Totaux
  const totals = useMemo(() => {
    const confirmed = filtered.filter(d => d.status === 'paye');
    const byChannel = {};
    confirmed.forEach(d => {
      byChannel[d.payment_channel] = (byChannel[d.payment_channel] || 0) + parseFloat(d.amount);
    });
    return {
      total: confirmed.reduce((s, d) => s + parseFloat(d.amount), 0),
      byChannel,
    };
  }, [filtered]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleSort(field) {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('desc'); }
    setPage(1);
  }

  function SortIcon({ field }) {
    if (sortField !== field) return null;
    return sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />;
  }

  function resetFilters() {
    setSearch(''); setFilterStatus('all'); setFilterChannel('all');
    setDateFrom(''); setDateTo(''); setPage(1);
  }

  function exportCSV() {
    const rows = [
      ['Date', 'Donateur', 'Montant (FCFA)', 'Canal', 'Projet', 'Statut', 'Référence'],
      ...filtered.map(d => [
        formatDate(d.created_at),
        d.is_anonymous ? 'Anonyme' : (d.donor_name || d.member_name || 'N/A'),
        d.amount,
        CHANNEL_LABELS[d.payment_channel] || d.payment_channel,
        d.project_title || 'Don général',
        d.status,
        d.transaction_reference,
      ]),
    ];
    const csv = rows.map(r => r.map(c => `"${c ?? ''}"`).join(',')).join('\n');
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'dons.csv'; a.click();
    URL.revokeObjectURL(url);
  }

  const hasActiveFilters = filterStatus !== 'all' || filterChannel !== 'all' || dateFrom || dateTo || search;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight font-title">Dons</h1>
          <p className="text-slate-500 text-sm mt-1">Tableau de bord de transparence — toutes les donations reçues</p>
        </div>
        {!isReadOnly && (
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition shadow-sm"
          >
            <Download className="w-4 h-4" /> Exporter CSV
          </button>
        )}
      </div>

      {/* Totaux KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total confirmé</p>
          <p className="text-2xl font-bold text-slate-900 font-title mt-1">{formatFCFA(totals.total)}</p>
          <p className="text-xs text-slate-400 mt-1">{filtered.filter(d => d.status === 'paye').length} dons confirmés</p>
        </div>
        {Object.entries(totals.byChannel).map(([ch, amt]) => (
          <div key={ch} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{CHANNEL_LABELS[ch] || ch}</p>
            <p className="text-2xl font-bold text-slate-900 font-title mt-1">{formatFCFA(amt)}</p>
            <p className="text-xs text-slate-400 mt-1">
              {filtered.filter(d => d.payment_channel === ch && d.status === 'paye').length} dons
            </p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Nom du donateur, projet, référence…"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>

          {/* Status */}
          <select
            value={filterStatus}
            onChange={e => { setFilterStatus(e.target.value); setPage(1); }}
            className="bg-white border border-slate-200 text-slate-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
          >
            <option value="all">Tous les statuts</option>
            <option value="paye">Confirmé</option>
            <option value="echoue">Échoué</option>
          </select>

          {/* Channel */}
          <select
            value={filterChannel}
            onChange={e => { setFilterChannel(e.target.value); setPage(1); }}
            className="bg-white border border-slate-200 text-slate-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
          >
            <option value="all">Tous les canaux</option>
            {Object.entries(CHANNEL_LABELS).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </div>

        {/* Date range */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Filter className="w-4 h-4" />
            <span className="font-semibold">Période :</span>
          </div>
          <input
            type="date"
            value={dateFrom}
            onChange={e => { setDateFrom(e.target.value); setPage(1); }}
            className="bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
          />
          <span className="text-slate-400 text-sm">→</span>
          <input
            type="date"
            value={dateTo}
            onChange={e => { setDateTo(e.target.value); setPage(1); }}
            className="bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
          />
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 transition underline underline-offset-2"
            >
              Réinitialiser
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-7 h-7 text-primary-600 animate-spin" />
          <span className="text-sm font-semibold text-slate-500">Chargement…</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
          <HandCoins className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 font-title">Aucun don trouvé</h3>
          <p className="text-slate-400 text-sm mt-1">Modifiez les filtres pour voir plus de résultats.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  {[
                    { label: 'Date', field: 'created_at' },
                    { label: 'Donateur', field: 'donor_name' },
                    { label: 'Montant', field: 'amount' },
                    { label: 'Canal', field: 'payment_channel' },
                    { label: 'Projet / Cible', field: 'project_title' },
                    { label: 'Statut', field: 'status' },
                    { label: 'Référence', field: null },
                  ].map(({ label, field }) => (
                    <th
                      key={label}
                      onClick={() => field && handleSort(field)}
                      className={`px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-400 select-none ${field ? 'cursor-pointer hover:text-slate-600' : ''}`}
                    >
                      <span className="flex items-center gap-1">
                        {label}
                        {field && <SortIcon field={field} />}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginated.map(d => (
                  <tr key={d.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-5 py-4 text-sm text-slate-600 whitespace-nowrap">{formatDate(d.created_at)}</td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-bold text-slate-800">
                        {d.is_anonymous ? 'Anonyme' : (d.donor_name || d.member_name || 'N/A')}
                      </p>
                      {!d.is_anonymous && d.donor_email && (
                        <p className="text-xs text-slate-400 mt-0.5">{d.donor_email}</p>
                      )}
                    </td>
                    <td className="px-5 py-4 text-sm font-bold text-slate-900 whitespace-nowrap">
                      {formatFCFA(d.amount)}
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg">
                        {CHANNEL_LABELS[d.payment_channel] || d.payment_channel}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {d.project_title || <span className="text-slate-400 italic">Don général</span>}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={d.status} />
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-400 font-mono">
                      {d.transaction_reference || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-between gap-3">
            <span className="text-xs font-semibold text-slate-400">
              {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} sur {filtered.length} dons
            </span>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-40 transition"
              >
                ← Préc.
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(p => p + 1)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-40 transition"
              >
                Suiv. →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
