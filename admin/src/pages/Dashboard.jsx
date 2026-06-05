import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import api from '../services/api';
import {
  Users,
  HandCoins,
  FileBadge,
  Send,
  Loader2,
  TrendingUp,
  Activity,
  Clock,
  PlusCircle,
  Settings,
  Newspaper,
  Heart,
  ChevronRight,
  UserCheck,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    totalMembers: 0,
    pendingMembers: 0,
    totalDonations: 0,
    activeProjects: 0,
    totalCandidatures: 0
  });
  const [recentDons, setRecentDons] = useState([]);
  const [recentMembers, setRecentMembers] = useState([]);
  const [activeProjectsList, setActiveProjectsList] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentDate = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

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
        const activeProjectsCount = projects.filter(p => p.status === 'collecte').length;
        const totalCandidatures = candidatures.filter(c => c.status === 'en_cours').length;

        setStats({
          totalMembers,
          pendingMembers,
          totalDonations,
          activeProjects: activeProjectsCount,
          totalCandidatures
        });

        // Set recent lists
        setRecentDons(donations.slice(0, 5));
        setRecentMembers(members.slice(0, 5));
        setActiveProjectsList(projects.filter(p => p.status === 'collecte').slice(0, 3));
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
        <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
        <p className="text-sm font-semibold text-slate-500">Calcul des données en cours…</p>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Membres inscrits',
      value: stats.totalMembers,
      subtitle: `${stats.pendingMembers} en attente de validation`,
      icon: Users,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      title: 'Dons collectés',
      value: `${stats.totalDonations.toLocaleString()} FCFA`,
      subtitle: 'Cumulé KKiaPay & PayPal',
      icon: HandCoins,
      color: 'bg-primary-50 text-primary-700 border-primary-200',
    },
    {
      title: 'Campagnes actives',
      value: stats.activeProjects,
      subtitle: 'Projets de dons en cours',
      icon: FileBadge,
      color: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      title: 'Candidatures en cours',
      value: stats.totalCandidatures,
      subtitle: 'Bénévoles, stages & emplois',
      icon: Send,
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-secondary-700 to-secondary-900 text-white rounded-3xl p-6 md:p-8 shadow-sm relative overflow-hidden z-0">
        {/* Subtle background glow effect using light blue */}
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-secondary-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2 space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold backdrop-blur-md">
              <Activity className="w-3.5 h-3.5 animate-pulse text-white" />
              Espace d'administration actif
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold font-title tracking-tight text-white">
              Bonjour, {user?.first_name || 'Administrateur'} 👋
            </h1>
            <p className="text-white/95 text-sm max-w-xl font-medium leading-relaxed">
              Ravi de vous revoir. Nous sommes le <span className="text-white font-bold">{currentDate}</span>. Voici un aperçu rapide de l'activité de la Fondation les Amis de A à Z.
            </p>
          </div>
          
          <div className="hidden md:flex justify-end pr-4">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center min-w-[180px] shadow-lg">
              <span className="text-[10px] uppercase font-bold tracking-widest text-white/80 block">Membres Actifs</span>
              <span className="text-3xl font-black font-title text-white block mt-1">{stats.totalMembers}</span>
              <span className="text-[10px] font-semibold text-white/70 block mt-0.5">{stats.pendingMembers} en attente</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">Actions rapides</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {['admin_principal', 'tresorier', 'editeur_contenu'].includes(user?.role) && (
            <Link
              to="/projects"
              className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-primary-200 hover:bg-primary-50/30 text-slate-700 hover:text-primary-700 font-bold text-sm transition"
            >
              <PlusCircle className="w-5 h-5 text-primary-600" />
              <span>Nouveau projet</span>
            </Link>
          )}
          {['admin_principal', 'gestionnaire_communaute'].includes(user?.role) && (
            <Link
              to="/members"
              className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-primary-200 hover:bg-primary-50/30 text-slate-700 hover:text-primary-700 font-bold text-sm transition"
            >
              <UserCheck className="w-5 h-5 text-primary-600" />
              <span>Valider membres</span>
            </Link>
          )}
          {['admin_principal', 'editeur_contenu'].includes(user?.role) && (
            <Link
              to="/realisations"
              className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-primary-200 hover:bg-primary-50/30 text-slate-700 hover:text-primary-700 font-bold text-sm transition"
            >
              <Newspaper className="w-5 h-5 text-primary-600" />
              <span>Éditer le CMS</span>
            </Link>
          )}
          {['admin_principal', 'gestionnaire_communaute', 'editeur_contenu'].includes(user?.role) && (
            <Link
              to="/recruitment"
              className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-primary-200 hover:bg-primary-50/30 text-slate-700 hover:text-primary-700 font-bold text-sm transition"
            >
              <Settings className="w-5 h-5 text-primary-600" />
              <span>Recrutements</span>
            </Link>
          )}
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map(({ title, value, subtitle, icon: Icon, color }) => (
          <div key={title} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition duration-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{title}</span>
              <div className={`p-2.5 rounded-2xl border ${color.split(' ')[0]} ${color.split(' ')[2]} ${color.split(' ')[1]}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight font-title">{value}</h2>
              <p className="text-xs text-slate-400 font-semibold mt-1.5 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-slate-400" />
                <span>{subtitle}</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column: Campaign progresses */}
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900 font-title">Campagnes de dons</h2>
              <Heart className="w-5 h-5 text-primary-500 fill-primary-500/10" />
            </div>

            {activeProjectsList.length === 0 ? (
              <div className="py-10 text-center text-slate-400 text-sm">
                <FileBadge className="w-10 h-10 mx-auto mb-2 opacity-45" />
                <span>Aucune campagne de don active.</span>
              </div>
            ) : (
              <div className="space-y-6">
                {activeProjectsList.map((project) => {
                  const target = parseFloat(project.target_amount) || 1;
                  const collected = parseFloat(project.collected_amount) || 0;
                  const percent = Math.min(Math.round((collected / target) * 100), 100);
                  
                  return (
                    <div key={project.id} className="space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="text-sm font-bold text-slate-800 line-clamp-1">{project.title}</span>
                        <span className="text-xs font-extrabold text-primary-700 bg-primary-50 px-2 py-0.5 rounded-md">{percent}%</span>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      
                      <div className="flex justify-between text-[11px] font-bold text-slate-400">
                        <span>{collected.toLocaleString()} FCFA</span>
                        <span>Objectif : {target.toLocaleString()} FCFA</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          {activeProjectsList.length > 0 && (
            <Link to="/projects" className="mt-6 flex items-center justify-center gap-1.5 py-3 border border-slate-100 bg-slate-50 hover:bg-slate-100/70 text-slate-600 hover:text-slate-900 text-xs font-bold rounded-2xl transition">
              <span>Gérer toutes les campagnes</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {/* Center column: Recent members requests */}
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900 font-title">Dernières adhésions</h2>
              <Clock className="w-5 h-5 text-slate-400" />
            </div>

            {recentMembers.length === 0 ? (
              <div className="py-10 text-center text-slate-400 text-sm">
                <Users className="w-10 h-10 mx-auto mb-2 opacity-45" />
                <span>Aucune demande d'adhésion.</span>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentMembers.map((member) => (
                  <div key={member.id} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-800 truncate">
                        {member.first_name} {member.last_name}
                      </p>
                      <p className="text-[11px] text-slate-400 font-semibold truncate mt-0.5">{member.email}</p>
                    </div>
                    <div>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
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

          {recentMembers.length > 0 && (
            <Link to="/members" className="mt-6 flex items-center justify-center gap-1.5 py-3 border border-slate-100 bg-slate-50 hover:bg-slate-100/70 text-slate-600 hover:text-slate-900 text-xs font-bold rounded-2xl transition">
              <span>Gérer les membres</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {/* Right column: Recent donations */}
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900 font-title">Flux des dons</h2>
              <TrendingUp className="w-5 h-5 text-slate-400" />
            </div>

            {recentDons.length === 0 ? (
              <div className="py-10 text-center text-slate-400 text-sm">
                <HandCoins className="w-10 h-10 mx-auto mb-2 opacity-45" />
                <span>Aucun don reçu pour le moment.</span>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentDons.map((don) => (
                  <div key={don.id} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-800 truncate">
                        {don.is_anonymous ? 'Donateur anonyme' : (don.donor_name || 'Invité')}
                      </p>
                      <p className="text-[11px] text-slate-400 font-semibold truncate mt-0.5">
                        {don.project_title || 'Soutien général'}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-slate-900">
                        {parseFloat(don.amount).toLocaleString()} {don.currency}
                      </p>
                      <span className="inline-flex items-center gap-1 mt-0.5">
                        {don.status === 'paye' ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        ) : don.status === 'echoue' ? (
                          <XCircle className="w-3 h-3 text-red-500" />
                        ) : (
                          <AlertCircle className="w-3 h-3 text-amber-500" />
                        )}
                        <span className="text-[9px] font-bold uppercase text-slate-400">
                          {don.status === 'paye' ? 'Payé' : don.status === 'echoue' ? 'Échoué' : 'Créé'}
                        </span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {recentDons.length > 0 && (
            <Link to="/donations" className="mt-6 flex items-center justify-center gap-1.5 py-3 border border-slate-100 bg-slate-50 hover:bg-slate-100/70 text-slate-600 hover:text-slate-900 text-xs font-bold rounded-2xl transition">
              <span>Voir tous les dons</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

      </div>
    </div>
  );
}
