import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import api from '../services/api';
import { ShieldAlert, Lock, Mail, Loader2 } from 'lucide-react';

export default function Login() {
  const { setToken, setUser } = useAuthStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      // 1. Authenticate with Django REST simplejwt
      const res = await api.post('/login', { email, password });
      const token = res.data.access_token;
      
      // Temporary token set to authenticate subsequent profile check request
      localStorage.setItem('admin_token', token);

      // 2. Fetch logged-in user details to check if they are staff
      const userRes = await api.get('/user');
      
      if (userRes.data.is_staff) {
        setToken(token);
        setUser(userRes.data);
        navigate('/');
      } else {
        // Discard token if not staff
        localStorage.removeItem('admin_token');
        setError("Accès refusé. Ce compte ne possède pas les droits d'administrateur.");
      }
    } catch (err) {
      localStorage.removeItem('admin_token');
      setError(err.response?.data?.message || err.response?.data?.detail || "E-mail ou mot de passe incorrect.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary-700/10 rounded-full blur-3xl" />

      <div className="w-full max-w-md z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-primary-600/10 border border-primary-500/20 rounded-2xl mb-4">
            <span className="text-primary-500 font-bold text-2xl tracking-wider font-title">FAAZ</span>
          </div>
          <h1 className="text-2xl font-bold text-white font-title">Espace Administration</h1>
          <p className="text-sm text-slate-400 mt-1.5">Gérez la fondation, ses membres et ses projets.</p>
        </div>

        <div className="bg-slate-950/60 backdrop-blur-md border border-slate-800/80 rounded-3xl p-8 shadow-2xl">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-4 py-3 rounded-2xl mb-6 flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Adresse e-mail</label>
              <div className="relative">
                <input
                  required
                  type="email"
                  placeholder="admin@lafaaz.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-white rounded-2xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Mot de passe</label>
              <div className="relative">
                <input
                  required
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-white rounded-2xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary-600 text-white font-bold rounded-2xl text-sm hover:bg-primary-700 active:scale-[0.98] transition flex items-center justify-center gap-2 mt-4 disabled:opacity-60 disabled:pointer-events-none"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Connexion en cours…</span>
                </>
              ) : (
                <span>Se connecter</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
