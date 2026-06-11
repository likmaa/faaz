import { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';
import api from '../../services/api';
import {
  LayoutDashboard, Users, ClipboardList, HandCoins, FolderHeart, Tag,
  Award, Newspaper, Building2, HelpCircle, Briefcase, Settings,
  LogOut, User as UserIcon, Menu, X, Loader2, ChevronDown, ChevronRight,
  Bell, FileText, Heart
} from 'lucide-react';

const ROLE_LABELS = {
  admin_principal: 'Admin principal',
  gestionnaire_communaute: 'Gestionnaire communauté',
  tresorier: 'Trésorier',
  editeur_contenu: 'Éditeur contenu',
};

const ITEM_ROLES = {
  '/': ['admin_principal', 'gestionnaire_communaute', 'tresorier', 'editeur_contenu'],
  '/members': ['admin_principal', 'gestionnaire_communaute', 'tresorier'],
  '/cotisations': ['admin_principal', 'gestionnaire_communaute', 'tresorier'],
  '/donations': ['admin_principal', 'gestionnaire_communaute', 'tresorier'],
  '/projects': ['admin_principal', 'tresorier', 'editeur_contenu'],
  '/axes': ['admin_principal', 'tresorier', 'editeur_contenu'],
  '/realisations': ['admin_principal', 'editeur_contenu'],
  '/actualites': ['admin_principal', 'editeur_contenu'],
  '/partenaires': ['admin_principal', 'editeur_contenu'],
  '/equipe': ['admin_principal', 'editeur_contenu'],
  '/temoignages': ['admin_principal', 'editeur_contenu'],
  '/faq': ['admin_principal', 'editeur_contenu'],
  '/recruitment': ['admin_principal', 'gestionnaire_communaute', 'editeur_contenu'],
  '/parametres': ['admin_principal', 'tresorier'],
};

const NAV_GROUPS = [
  {
    label: null,
    items: [{ label: 'Tableau de bord', to: '/', icon: LayoutDashboard, end: true }],
  },
  {
    label: 'Communauté',
    items: [
      { label: 'Membres',     to: '/members',     icon: Users },
      { label: 'Cotisations', to: '/cotisations', icon: ClipboardList },
    ],
  },
  {
    label: 'Collecte',
    items: [
      { label: 'Dons',            to: '/donations', icon: HandCoins },
      { label: 'Projets de dons', to: '/projects',  icon: FolderHeart },
      { label: 'Axes',            to: '/axes',       icon: Tag },
    ],
  },
  {
    label: 'Contenu',
    items: [
      { label: 'Réalisations', to: '/realisations', icon: Award },
      { label: 'Actualités',   to: '/actualites',   icon: Newspaper },
      { label: 'Partenaires',  to: '/partenaires',  icon: Building2 },
      { label: 'Équipe',       to: '/equipe',       icon: Users },
      { label: 'Témoignages',  to: '/temoignages',  icon: Heart },
      { label: 'FAQ',          to: '/faq',          icon: HelpCircle },
    ],
  },
  {
    label: 'Recrutement',
    items: [
      { label: 'Offres & Candidatures', to: '/recruitment', icon: Briefcase },
    ],
  },
  {
    label: null,
    items: [
      { label: 'Paramètres', to: '/parametres', icon: Settings },
    ],
  },
];

function Breadcrumb() {
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);

  const LABELS = {
    members: 'Membres', cotisations: 'Cotisations', donations: 'Dons',
    projects: 'Projets de dons', axes: 'Axes', realisations: 'Réalisations',
    actualites: 'Actualités', partenaires: 'Partenaires', faq: 'FAQ',
    recruitment: 'Recrutement', parametres: 'Paramètres',
    equipe: 'Équipe', temoignages: 'Témoignages',
  };

  if (segments.length === 0) return null;

  return (
    <nav className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mb-6">
      <Link to="/" className="hover:text-slate-600 transition">Accueil</Link>
      {segments.map((seg, i) => (
        <span key={seg} className="flex items-center gap-1.5">
          <ChevronRight className="w-3 h-3" />
          {i === segments.length - 1
            ? <span className="text-slate-600">{LABELS[seg] || seg}</span>
            : <Link to={'/' + segments.slice(0, i + 1).join('/')} className="hover:text-slate-600 transition">{LABELS[seg] || seg}</Link>
          }
        </span>
      ))}
    </nav>
  );
}

/* ── Logo component shared between sidebar and login ── */
export function SiteLogo({ className = '' }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img
        src="/assets/img/logo.png"
        alt="Fondation FAAZ"
        className="h-12 w-auto object-contain"
      />
    </div>
  );
}

export default function AdminLayout() {
  const { token, user, setUser, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState({});
  const [memberCount, setMemberCount] = useState(0);
  const [candCount, setCandCount] = useState(0);

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    if (!user) {
      api.get('/user')
        .then(res => {
          if (res.data.is_staff) { setUser(res.data); setLoading(false); }
          else { logout(); navigate('/login'); }
        })
        .catch(() => { logout(); navigate('/login'); });
    } else {
      setLoading(false);
    }
  }, [token, user, navigate, setUser, logout]);

  useEffect(() => { setSidebarOpen(false); }, [location]);

  useEffect(() => {
    if (token && user) {
      api.get('/members/')
        .then(res => {
          const list = Array.isArray(res.data) ? res.data : [];
          setMemberCount(list.filter(m => m.membership_status === 'en_attente').length);
        })
        .catch(() => {});
      api.get('/candidatures/')
        .then(res => {
          const list = Array.isArray(res.data) ? res.data : [];
          setCandCount(list.filter(c => c.status === 'en_cours').length);
        })
        .catch(() => {});
    }
  }, [token, user, location.pathname]);

  function handleLogout() { logout(); navigate('/login'); }

  function toggleGroup(label) {
    setCollapsed(prev => ({ ...prev, [label]: !prev[label] }));
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
        <span className="text-sm font-semibold text-slate-500">Chargement…</span>
      </div>
    );
  }

  const role = user?.role;
  const filteredNavGroups = NAV_GROUPS.map(group => {
    const items = group.items.filter(item => {
      const allowedRoles = ITEM_ROLES[item.to];
      return !allowedRoles || allowedRoles.includes(role);
    });
    return { ...group, items };
  }).filter(group => group.items.length > 0);

  const isAuthorized = !ITEM_ROLES[location.pathname] || ITEM_ROLES[location.pathname].includes(role);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* ── Logo ── */}
      <div className="h-20 px-5 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
        <SiteLogo />
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* ── Nav ── */}
      <nav className="flex-1 px-3 py-5 overflow-y-auto space-y-5">
        {filteredNavGroups.map((group, gi) => (
          <div key={gi}>
            {group.label && (
              <button
                onClick={() => toggleGroup(group.label)}
                className="w-full flex items-center justify-between px-2 mb-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-600 transition"
              >
                {group.label}
                {collapsed[group.label]
                  ? <ChevronRight className="w-3 h-3" />
                  : <ChevronDown className="w-3 h-3" />
                }
              </button>
            )}

            {!collapsed[group.label] && (
              <div className="space-y-0.5">
                {group.items.map(({ label, to, icon: Icon, end }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition ${
                        isActive
                          ? 'bg-primary-50 text-primary-700 border border-primary-200 shadow-sm'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="flex-1">{label}</span>
                    {to === '/members' && memberCount > 0 && (
                      <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0">
                        {memberCount}
                      </span>
                    )}
                    {to === '/recruitment' && candCount > 0 && (
                      <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0">
                        {candCount}
                      </span>
                    )}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* ── User + logout ── */}
      <div className="px-3 py-4 border-t border-slate-200 flex-shrink-0 space-y-1">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-lg bg-primary-50 border border-primary-200 flex items-center justify-center flex-shrink-0">
            <UserIcon className="w-4 h-4 text-primary-600" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-slate-800 truncate">{user?.first_name} {user?.last_name}</p>
            <p className="text-[10px] text-slate-500 font-bold truncate">{ROLE_LABELS[user?.role] || 'Administrateur'}</p>
            <p className="text-[9px] text-slate-400 font-medium truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm text-red-500 hover:bg-red-50 hover:text-red-600 transition"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 w-60 bg-white border-r border-slate-200 hidden lg:flex flex-col shadow-sm">
        <SidebarContent />
      </aside>

      {/* Sidebar mobile drawer */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-40 w-60 bg-white border-r border-slate-200 flex flex-col shadow-xl lg:hidden">
            <SidebarContent />
          </aside>
        </>
      )}

      {/* Main content */}
      <div className="flex-1 lg:pl-60 flex flex-col min-h-screen">
        {/* ── Topbar ── */}
        <header className="h-20 bg-white border-b border-slate-200 sticky top-0 z-20 px-5 flex items-center gap-4 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-xs relative">
            <input
              type="search"
              placeholder="Rechercher…"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
          </div>

          <div className="ml-auto flex items-center gap-2">
            {/* Notifications */}
            <button className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
            </button>

            {/* CMS shortcut */}
            {['admin_principal', 'editeur_contenu'].includes(user?.role) && (
              <NavLink
                to="/realisations"
                className={({ isActive }) =>
                  `p-2 rounded-xl transition ${isActive ? 'bg-primary-50 text-primary-700' : 'text-slate-500 hover:bg-slate-100'}`
                }
                title="Gestion CMS"
              >
                <FileText className="w-5 h-5" />
              </NavLink>
            )}

            {/* User chip */}
            <div className="flex items-center gap-2.5 pl-3 ml-1 border-l border-slate-200">
              <div className="w-8 h-8 bg-primary-50 rounded-xl flex items-center justify-center border border-primary-200">
                <UserIcon className="w-4 h-4 text-primary-600" />
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-bold text-slate-800 leading-tight">{user?.first_name} {user?.last_name}</p>
                <p className="text-[10px] text-slate-400 font-medium">
                  {ROLE_LABELS[user?.role] || 'Administrateur'}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-5 md:p-8 max-w-screen-2xl w-full mx-auto">
          <Breadcrumb />
          {isAuthorized ? (
            <Outlet />
          ) : (
            <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 text-center shadow-sm max-w-lg mx-auto mt-12 animate-in fade-in duration-200">
              <div className="w-16 h-16 bg-red-50 border border-red-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-slate-800 font-title">Accès Restreint</h2>
              <p className="text-slate-500 text-sm mt-2 mb-6">
                Vous n'avez pas les autorisations nécessaires pour accéder à cette rubrique. Si vous pensez qu'il s'agit d'une erreur, veuillez contacter l'administrateur principal.
              </p>
              <Link
                to="/"
                className="inline-flex items-center justify-center px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-sm transition"
              >
                Retour au tableau de bord
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
