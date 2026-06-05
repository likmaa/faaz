import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import api from '../services/api';
import { ShieldAlert, Lock, Mail, Loader2, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const { setToken, setUser } = useAuthStore();
  const navigate = useNavigate();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState(null);
  const [loading, setLoading]   = useState(false);
  const [showPwd, setShowPwd]   = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api.post('/login', { email, password });
      const token = res.data.access_token;
      localStorage.setItem('admin_token', token);

      const userRes = await api.get('/user');
      if (userRes.data.is_staff) {
        setToken(token);
        setUser(userRes.data);
        navigate('/');
      } else {
        localStorage.removeItem('admin_token');
        setError("Accès refusé. Ce compte ne possède pas les droits d'administrateur.");
      }
    } catch (err) {
      localStorage.removeItem('admin_token');
      setError(
        err.response?.data?.message ||
        err.response?.data?.detail ||
        'E-mail ou mot de passe incorrect.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-white border-r border-slate-200 flex-col items-center justify-center p-16 gap-10">
        <img
          src="/assets/img/logo.png"
          alt="Fondation les Amis de A à Z"
          className="h-20 w-auto object-contain"
        />
        <div className="max-w-xs text-center space-y-3">
          <h2 className="text-2xl font-bold text-slate-900 font-heading leading-tight">
            Fondation les Amis de A à Z
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            Espace d'administration réservé au staff de la fondation.
            Gérez les membres, les projets et le contenu du site public.
          </p>
        </div>

        {/* Small brand stripe */}
        <div className="flex items-center gap-3">
          <span className="h-1 w-8 rounded-full bg-primary-600" />
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-widest">Depuis 2020</span>
          <span className="h-1 w-8 rounded-full bg-secondary-700" />
        </div>
      </div>

      {/* Right login panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Mobile logo */}
        <div className="lg:hidden mb-8 flex flex-col items-center gap-3">
          <img src="/assets/img/logo.png" alt="FAAZ" className="h-14 w-auto object-contain" />
        </div>

        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 font-heading">Connexion</h1>
            <p className="text-slate-500 text-sm mt-1.5">
              Espace réservé au staff
              <span className="inline-flex items-center ml-2 px-2 py-0.5 rounded-md bg-primary-50 border border-primary-200 text-primary-700 text-[10px] font-bold tracking-wider uppercase">
                Admin
              </span>
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-6 flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">
                Adresse e-mail
              </label>
              <div className="relative">
                <input
                  required
                  type="email"
                  placeholder="admin@lafaaz.org"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition shadow-sm"
                />
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  required
                  type={showPwd ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl pl-10 pr-11 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition shadow-sm"
                />
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <button
                  type="button"
                  onClick={() => setShowPwd(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                  tabIndex={-1}
                  aria-label={showPwd ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 bg-primary-600 text-white font-bold rounded-xl text-sm hover:bg-primary-700 active:scale-[0.98] transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:pointer-events-none shadow-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Connexion en cours…
                </>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-8">
            Accès réservé · <span className="font-semibold">info@lafaaz.org</span>
          </p>
        </div>
      </div>
    </div>
  );
}
