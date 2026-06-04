import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import api from '../services/api';
import PageHero from '../components/ui/PageHero';

export default function Login() {
  const { setToken } = useAuthStore();
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
      const res = await api.post('/login', { email, password });
      setToken(res.data.access_token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'E-mail ou mot de passe incorrect.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageHero
        title="Se connecter"
        subtitle="Accédez à votre espace membre FAAZ."
        breadcrumbs={[{ label: 'Accueil', to: '/' }, { label: 'Connexion' }]}
      />

      <div className="mx-auto max-w-md px-6 py-14">
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Bienvenue</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Adresse e-mail</label>
              <input
                required
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="votre@email.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Mot de passe</label>
              <input
                required
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-primary-600 text-white rounded-full font-bold text-sm hover:bg-primary-700 transition disabled:opacity-60"
            >
              {loading ? 'Connexion…' : 'Se connecter'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Pas encore membre ?{' '}
            <Link to="/join-us" className="text-primary-600 font-semibold hover:underline">Adhérer à la FAAZ</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
