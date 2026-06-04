import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';
import api from '../../services/api';
import {
  LayoutDashboard,
  Users,
  FolderHeart,
  FileText,
  Briefcase,
  LogOut,
  User as UserIcon,
  Menu,
  X,
  Loader2
} from 'lucide-react';

export default function AdminLayout() {
  const { token, user, setUser, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If not authenticated, redirect to /login
    if (!token) {
      navigate('/login');
      return;
    }

    // Fetch user details if not loaded
    if (!user) {
      api.get('/user')
        .then((res) => {
          if (res.data.is_staff) {
            setUser(res.data);
            setLoading(false);
          } else {
            logout();
            navigate('/login');
          }
        })
        .catch(() => {
          logout();
          navigate('/login');
        });
    } else {
      setLoading(false);
    }
  }, [token, user, navigate, setUser, logout]);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
        <span className="text-sm font-semibold text-slate-500">Chargement du panneau d'administration…</span>
      </div>
    );
  }

  const menuItems = [
    { label: 'Tableau de bord', to: '/', icon: LayoutDashboard },
    { label: 'Membres & Adhésions', to: '/members', icon: Users },
    { label: 'Projets de dons', to: '/projects', icon: FolderHeart },
    { label: 'Gestion CMS', to: '/cms', icon: FileText },
    { label: 'Offres & Candidats', to: '/recruitment', icon: Briefcase },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar for desktop */}
      <aside className={`fixed inset-y-0 left-0 z-20 w-64 bg-slate-900 text-slate-400 border-r border-slate-800 flex flex-col transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 px-6 border-b border-slate-800 flex items-center justify-between">
          <span className="text-white font-bold font-title text-xl tracking-wider">FAAZ ADMIN</span>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {menuItems.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-4 py-3 rounded-xl font-semibold text-sm transition ${
                  isActive
                    ? 'bg-primary-600 text-white shadow-md shadow-primary-600/15'
                    : 'hover:bg-slate-800 hover:text-slate-200'
                }`
              }
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-semibold text-sm hover:bg-red-500/10 text-red-400 hover:text-red-300 transition"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-10 bg-black/40 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Main content wrapper */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-10 px-6 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-1 rounded-lg text-slate-500 hover:bg-slate-100">
            <Menu className="w-6 h-6" />
          </button>

          <div className="ml-auto flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-primary-50 rounded-xl flex items-center justify-center border border-primary-100">
                <UserIcon className="w-4 h-4 text-primary-600" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-bold text-slate-800 leading-tight">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-xs text-slate-400 font-medium">Administrateur</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
