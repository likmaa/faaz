import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Users, Check, X, Search, Loader2, Phone, Mail, UserCheck } from 'lucide-react';

export default function Members() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // all, en_attente, valide, rejete

  useEffect(() => {
    fetchMembers();
  }, []);

  async function fetchMembers() {
    setLoading(true);
    try {
      const res = await api.get('/members/');
      setMembers(res.data);
    } catch (err) {
      console.error("Erreur lors de la récupération des membres.", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAction(id, actionType) {
    try {
      // Calls MemberViewSet.validate_adhesion detail action
      const res = await api.post(`/members/${id}/validate_adhesion/`, { action: actionType });
      // Update local state
      setMembers(members.map(m => m.id === id ? res.data : m));
    } catch (err) {
      alert("Erreur lors du traitement de l'adhésion.");
    }
  }

  const filteredMembers = members.filter(m => {
    const matchesSearch = `${m.first_name} ${m.last_name} ${m.email} ${m.profession}`
      .toLowerCase()
      .includes(search.toLowerCase());
    
    const matchesFilter = filter === 'all' || m.membership_status === filter;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight font-title">Membres & Adhésions</h1>
          <p className="text-slate-500 text-sm mt-1">Validez les demandes d'adhésion et suivez le paiement des cotisations.</p>
        </div>
      </div>

      {/* Filters and search */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <input
            type="text"
            placeholder="Rechercher un membre (nom, e-mail, profession)…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-2xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        </div>

        <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
          {[
            { label: 'Tous', value: 'all' },
            { label: 'En attente', value: 'en_attente' },
            { label: 'Validés', value: 'valide' },
            { label: 'Rejetés', value: 'rejete' },
          ].map(opt => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs transition border flex-shrink-0 ${
                filter === opt.value
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main content table */}
      {loading ? (
        <div className="h-[40vh] flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
          <span className="text-sm font-semibold text-slate-500">Chargement des membres…</span>
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-sm">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800 font-title">Aucun membre trouvé</h3>
          <p className="text-slate-400 text-sm mt-1">Aucun enregistrement ne correspond aux critères actuels.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Nom & Infos</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Profession & Pays</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Adhésion</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Cotisation</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-5">
                      <div>
                        <p className="font-bold text-slate-800 text-sm">
                          {member.first_name} {member.last_name}
                        </p>
                        <div className="flex flex-col gap-0.5 mt-1">
                          <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5" />
                            {member.email}
                          </span>
                          <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5" />
                            {member.phone}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-semibold text-slate-700">{member.profession}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{member.city}, {member.country}</p>
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                          member.membership_status === 'valide'
                            ? 'bg-emerald-50 text-emerald-700'
                            : member.membership_status === 'rejete'
                            ? 'bg-red-50 text-red-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {member.membership_status === 'valide'
                          ? 'Validé'
                          : member.membership_status === 'rejete'
                          ? 'Rejeté'
                          : 'En attente'}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                          member.contribution_status === 'a_jour'
                            ? 'bg-emerald-50 text-emerald-700'
                            : member.contribution_status === 'relance'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-red-50 text-red-700'
                        }`}
                      >
                        {member.contribution_status === 'a_jour'
                          ? 'À jour'
                          : member.contribution_status === 'relance'
                          ? 'Relance'
                          : 'En retard'}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      {member.membership_status === 'en_attente' ? (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleAction(member.id, 'valide')}
                            className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-xl transition"
                            title="Valider l'adhésion"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleAction(member.id, 'rejete')}
                            className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition"
                            title="Rejeter"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs font-bold text-slate-300 flex items-center justify-end gap-1">
                          <UserCheck className="w-3.5 h-3.5" />
                          Traité
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
