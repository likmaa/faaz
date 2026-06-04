import React, { useEffect, useState } from 'react';
import api from '../services/api';
import {
  Users,
  HandCoins,
  FileBadge,
  Send,
  Loader2,
  TrendingUp,
  Activity,
  CheckCircle2,
  Clock
} from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalMembers: 0,
    pendingMembers: 0,
    totalDonations: 0,
    activeProjects: 0,
    totalCandidatures: 0
  });
  const [recentDons, setRecentDons] = useState([]);
  const [recentMembers, setRecentMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [membersRes, projectsRes, donationsRes, candidaturesRes] = await Promise.all([
          api.get('/members/').catch(() => ({ data: [] })),
          api.get('/projects/').catch(() => ({ data: [] })),
          api.get('/donations/').catch(() => ({ data: [] })),
          api.get('/candidatures/').catch(() => ({ data: [] }))
        ]);

        const members = membersRes.data;
        const projects = projectsRes.data;
        const donations = donationsRes.data;
        const candidatures = candidaturesRes.data;

        // Compute metrics
        const totalMembers = members.length;
        const pendingMembers = members.filter(m => m.membership_status === 'en_attente').length;
        const totalDonations = donations
          .filter(d => d.status === 'paye')
          .reduce((sum, d) => sum + parseFloat(d.amount), 0);
        const activeProjects = projects.filter(p => p.status === 'collecte').length;
        const totalCandidatures = candidatures.filter(c => c.status === 'en_cours').length;

        setStats({
          totalMembers,
          pendingMembers,
          totalDonations,
          activeProjects,
          totalCandidatures
        });

        // Set recent lists
        setRecentDons(donations.slice(0, 5));
        setRecentMembers(members.slice(0, 5));
      } catch (err) {
        console.error("Erreur lors de la récupération des statistiques.", err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
        <span className="text-sm font-semibold text-slate-500">Calcul des données en cours…</span>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Membres inscrits',
      value: stats.totalMembers,
      subtitle: `${stats.pendingMembers} en attente de validation`,
      icon: Users,
      color: 'bg-blue-500/10 text-blue-600 border-blue-100',
    },
    {
      title: 'Dons collectés',
      value: `${stats.totalDonations.toLocaleString()} FCFA`,
      subtitle: 'Cumulé KKiaPay & PayPal',
      icon: HandCoins,
      color: 'bg-emerald-500/10 text-emerald-600 border-emerald-100',
    },
    {
      title: 'Campagnes actives',
      value: stats.activeProjects,
      subtitle: 'Projets de dons en cours',
      icon: FileBadge,
      color: 'bg-amber-500/10 text-amber-600 border-amber-100',
    },
    {
      title: 'Nouvelles candidatures',
      value: stats.totalCandidatures,
      subtitle: 'Recrutements, bénévoles, stages',
      icon: Send,
      color: 'bg-purple-500/10 text-purple-600 border-purple-100',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight font-title">Tableau de bord</h1>
        <p className="text-slate-500 text-sm mt-1">
          Aperçu global de l'activité, des adhésions et du statut des financements.
        </p>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map(({ title, value, subtitle, icon: Icon, color }) => (
          <div key={title} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-400">{title}</span>
              <div className={`p-2.5 rounded-2xl border ${color.split(' ')[0]} ${color.split(' ')[2]}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight font-title">{value}</h2>
              <p className="text-xs text-slate-400 font-semibold mt-1.5 flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-slate-400" />
                <span>{subtitle}</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Two columns layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Members */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900 font-title">Dernières adhésions</h2>
            <Clock className="w-5 h-5 text-slate-400" />
          </div>

          {recentMembers.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-10 text-slate-400 text-sm">
              <Users className="w-10 h-10 mb-2 opacity-45" />
              <span>Aucune demande d'adhésion enregistrée.</span>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 flex-1">
              {recentMembers.map((member) => (
                <div key={member.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      {member.first_name} {member.last_name}
                    </p>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">{member.email} · {member.profession}</p>
                  </div>
                  <div>
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
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Donations */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900 font-title">Dons récents</h2>
            <TrendingUp className="w-5 h-5 text-slate-400" />
          </div>

          {recentDons.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-10 text-slate-400 text-sm">
              <HandCoins className="w-10 h-10 mb-2 opacity-45" />
              <span>Aucun don reçu pour le moment.</span>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 flex-1">
              {recentDons.map((don) => (
                <div key={don.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      {don.is_anonymous ? 'Donateur anonyme' : (don.donor_name || 'Invité')}
                    </p>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">
                      {don.project_title || 'Soutien général'} · {don.payment_channel}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900">{parseFloat(don.amount).toLocaleString()} {don.currency}</p>
                    <span className="text-[10px] text-slate-400 font-bold block mt-0.5">
                      {new Date(don.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
