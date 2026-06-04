import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import api from '../services/api';
import PageHero from '../components/ui/PageHero';

export default function Register() {
  const { setToken } = useAuthStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    if (form.password !== form.password_confirmation) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/register', form);
      setToken(res.data.access_token);
      navigate('/');
    } catch (err) {
      const msgs = err.response?.data?.errors
        ? Object.values(err.response.data.errors).flat().join(' ')
        : 'Erreur lors de l\'inscription.';
      setError(msgs);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageHero
        title="Créer un compte"
        subtitle="Créez votre compte pour accéder à l'espace membre FAAZ."
        breadcrumbs={[{ label: 'Accueil', to: '/' }, { label: 'Inscription' }]}
      />

      <div className="mx-auto max-w-md px-6 py-14">
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Créer un compte</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: 'Nom complet', key: 'name', type: 'text', ph: 'Votre nom' },
              { label: 'Adresse e-mail', key: 'email', type: 'email', ph: 'votre@email.com' },
              { label: 'Mot de passe', key: 'password', type: 'password', ph: '8 caractères minimum' },
              { label: 'Confirmer le mot de passe', key: 'password_confirmation', type: 'password', ph: '' },
            ].map(({ label, key, type, ph }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                <input
                  required
                  type={type}
                  placeholder={ph}
                  value={form[key]}
                  onChange={e => update(key, e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            ))}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-primary-600 text-white rounded-full font-bold text-sm hover:bg-primary-700 transition mt-2 disabled:opacity-60"
            >
              {loading ? 'Création…' : 'Créer mon compte'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Déjà membre ?{' '}
            <Link to="/login" className="text-primary-600 font-semibold hover:underline">Se connecter</Link>
          </p>
          <p className="text-center text-xs text-gray-400 mt-3">
            Vous souhaitez adhérer formellement à la fondation ?{' '}
            <Link to="/join-us" className="text-primary-600 hover:underline">Formulaire d'adhésion →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
