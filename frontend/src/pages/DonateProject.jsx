import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageHero from '../components/ui/PageHero';
import { useProject } from '../hooks/useProjects';
import Loading from '../components/ui/Loading';
import { Lock, User } from 'lucide-react';
import api from '../services/api';
import { useSeo } from '../hooks/useSeo';

const PRESETS = [5000, 10000, 25000, 50000];

export default function DonateProject() {
  const { id } = useParams();
  const { data: project, isLoading, error: projectError } = useProject(id);
  const [amount, setAmount] = useState(10000);
  const [anonymous, setAnonymous] = useState(false);
  const [form, setForm] = useState({ prenom: '', nom: '', email: '', phone: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [kkiapayKey, setKkiapayKey] = useState('');

  useSeo({
    title: project ? `Soutenir ${project.titre}` : "Soutenir un projet",
    description: project ? `Faire un don pour soutenir le projet : ${project.titre}.` : "Soutenir un projet de la Fondation FAAZ."
  });

  useEffect(() => {
    // Inject KKiaPay script
    const script = document.createElement('script');
    script.src = "https://cdn.kkiapay.me/k.js";
    script.async = true;
    document.body.appendChild(script);

    // Fetch public KKiaPay key from backend settings
    api.get('/cms/')
      .then(res => {
        const list = Array.isArray(res.data) ? res.data : (res.data?.results || []);
        const keySetting = list.find(item => item.key === 'kkiapay_key');
        if (keySetting && keySetting.value) {
          setKkiapayKey(keySetting.value);
        }
      })
      .catch(err => console.warn("Could not load KKiaPay key from settings", err));

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  if (isLoading) return <Loading />;
  if (projectError) return (
    <div className="text-center py-20">
      <p className="text-gray-500 mb-4">Projet introuvable.</p>
      <Link to="/projects" className="text-primary-600 text-sm">← Retour aux projets</Link>
    </div>
  );

  const pct = Math.min(Math.round((project.montant_collecte / project.montant_cible) * 100), 100);

  if (submitted) {
    return (
      <div>
        <PageHero title="Don confirmé" breadcrumbs={[{ label: 'Accueil', to: '/' }, { label: project.titre, to: `/projects/${id}` }, { label: 'Don' }]} />
        <div className="mx-auto max-w-md px-6 py-20 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Merci pour votre soutien !</h2>
          <p className="text-gray-600 mb-6">Votre don de <strong>{amount.toLocaleString('fr-FR')} FCFA</strong> pour le projet <strong>« {project.titre} »</strong> a bien été enregistré.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to={`/projects/${id}`} className="px-6 py-3 border border-primary-600 text-primary-600 rounded-full text-sm font-semibold hover:bg-primary-50">
              Voir le projet
            </Link>
            <Link to="/projects" className="px-6 py-3 bg-primary-600 text-white rounded-full text-sm font-semibold hover:bg-primary-700">
              Autres projets
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHero
        title={`Soutenir : ${project.titre}`}
        breadcrumbs={[{ label: 'Accueil', to: '/' }, { label: 'Projets', to: '/projects' }, { label: project.titre, to: `/projects/${id}` }, { label: 'Faire un don' }]}
      />

      <div className="mx-auto max-w-2xl px-6 sm:px-10 py-12">
        {/* Résumé projet */}
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 mb-10">
          <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-1 rounded-full">{project.axe}</span>
          <h2 className="font-bold text-gray-900 mt-2 mb-3">{project.titre}</h2>
          <div className="mb-1 flex justify-between text-xs text-gray-500">
            <span>{project.montant_collecte.toLocaleString('fr-FR')} FCFA collectés</span>
            <span className="font-semibold text-primary-600">{pct}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
            <div className="h-2 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500" style={{ width: `${pct}%` }} />
          </div>
          <p className="text-xs text-gray-400">Objectif : {project.montant_cible.toLocaleString('fr-FR')} FCFA</p>
        </div>

        <form onSubmit={(e) => {
          e.preventDefault();
          setLoading(true);
          setError(null);

          if (typeof window.openKkiapayWidget === 'undefined') {
            setError("Le service de paiement est en cours de chargement. Veuillez patienter.");
            setLoading(false);
            return;
          }

          // Launch KKiaPay Widget
          window.openKkiapayWidget({
            amount: amount,
            position: "center",
            sandbox: import.meta.env.VITE_KKIAPAY_SANDBOX !== 'false',
            key: kkiapayKey || "dd4b92b67f10b25e1c01e6e969d2f2db6bbcf79c",
            phone: form.phone || "",
            email: form.email || "",
            name: anonymous ? "Donateur Anonyme" : `${form.prenom} ${form.nom}`.trim()
          });

          const handleSuccess = async (response) => {
            try {
              const payload = {
                project: project.id, // Linked project
                amount: amount,
                payment_channel: "kkiapay",
                transaction_reference: response.transactionId,
                status: "paye",
                is_anonymous: anonymous,
                donor_name: anonymous ? "" : `${form.prenom} ${form.nom}`.trim(),
                donor_email: anonymous ? "" : form.email,
                donor_phone: anonymous ? "" : form.phone
              };

              await api.post('/donations/', payload);
              setSubmitted(true);
            } catch (err) {
              console.error(err);
              setError("Erreur lors de l'enregistrement du don. Veuillez contacter le support.");
            } finally {
              setLoading(false);
            }
          };

          const handleClose = () => {
            setLoading(false);
          };

          window.addKkiapayListener('success', handleSuccess);
          window.addKkiapayListener('close', handleClose);
        }} className="space-y-6">
          {/* Montant */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-3">Votre contribution (FCFA)</label>
            <div className="grid grid-cols-4 gap-3 mb-3">
              {PRESETS.map(v => (
                <button key={v} type="button" onClick={() => setAmount(v)}
                  className={`py-3 rounded-xl text-sm font-bold border transition-all ${amount === v ? 'bg-primary-600 text-white border-primary-600' : 'bg-white border-gray-200 text-gray-700 hover:border-primary-300'}`}>
                  {v.toLocaleString('fr-FR')}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3">
              <span className="text-xs font-bold text-gray-400">FCFA</span>
              <input type="number" min="0" step="100" value={amount} onChange={e => setAmount(Number(e.target.value))}
                className="flex-1 text-sm font-bold text-gray-900 outline-none bg-transparent" />
            </div>
          </div>

          {/* Anonymat */}
          <div>
            <div className="flex gap-3">
              {[false, true].map(val => (
                <button key={String(val)} type="button" onClick={() => setAnonymous(val)}
                  className={`flex-1 py-3 rounded-xl text-sm font-semibold border transition-all flex items-center justify-center gap-2 ${anonymous === val ? 'bg-primary-600 text-white border-primary-600' : 'bg-white border-slate-200 text-slate-650 hover:border-primary-300'}`}>
                  {val ? (
                    <>
                      <Lock size={16} />
                      <span>Anonyme</span>
                    </>
                  ) : (
                    <>
                      <User size={16} />
                      <span>Identifié</span>
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          {/* Infos si identifié */}
          {!anonymous && (
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Prénom</label>
                <input required type="text" value={form.prenom} onChange={e => update('prenom', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nom</label>
                <input required type="text" value={form.nom} onChange={e => update('nom', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">E-mail (reçu)</label>
                <input required type="email" value={form.email} onChange={e => update('email', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Téléphone (Momo)</label>
                <input required type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Ex: +229 97 00 00 00" />
              </div>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-primary-600 text-white rounded-full font-bold text-base hover:bg-primary-700 transition shadow-md disabled:opacity-60"
          >
            {loading ? 'Redirection vers le paiement...' : `Donner ${amount.toLocaleString('fr-FR')} FCFA pour ce projet →`}
          </button>
          <p className="text-xs text-gray-400 text-center">Paiement sécurisé via KKiaPay (mobile money) ou cartes bancaires.</p>
        </form>
      </div>
    </div>
  );
}
