import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../components/ui/PageHero';
import { useProjects } from '../hooks/useProjects';
import Loading from '../components/ui/Loading';
import { Lock, User } from 'lucide-react';
import api from '../services/api';
import { useSeo } from '../hooks/useSeo';

const PRESETS = [5000, 10000, 25000, 50000];

export default function Donate() {
  useSeo({
    title: "Faire un Don",
    description: "Soutenez la Fondation FAAZ et nos projets sur le terrain en faisant un don en ligne sécurisé via KKiaPay."
  });
  const [tab, setTab] = useState('general'); // 'general' | 'project'
  const [amount, setAmount] = useState(10000);
  const [anonymous, setAnonymous] = useState(false);
  const [form, setForm] = useState({ prenom: '', nom: '', email: '', phone: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [kkiapayKey, setKkiapayKey] = useState('');
  
  const { data: projects } = useProjects();

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

    // Parse amount from URL if present
    const params = new URLSearchParams(window.location.search);
    if (params.has('amount')) {
      const urlAmount = parseInt(params.get('amount'), 10);
      if (!isNaN(urlAmount) && urlAmount > 0) {
        setAmount(urlAmount);
      }
    }

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (typeof window.openKkiapayWidget === 'undefined') {
      setError("Le service de paiement est en cours de chargement. Veuillez patienter.");
      setLoading(false);
      return;
    }

    if (!kkiapayKey) {
      setError("Le système de paiement n'est pas encore configuré par l'administrateur.");
      setLoading(false);
      return;
    }

    // Launch KKiaPay Widget
    window.openKkiapayWidget({
      amount: amount,
      position: "center",
      sandbox: false,
      key: kkiapayKey,
      phone: form.phone || "",
      email: form.email || "",
      name: anonymous ? "Donateur Anonyme" : `${form.prenom} ${form.nom}`.trim()
    });

    const handleSuccess = async (response) => {
      try {
        const payload = {
          project: null, // General donation
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
  };

  if (submitted) {
    return (
      <div>
        <PageHero title="Faire un don" breadcrumbs={[{ label: 'Accueil', to: '/' }, { label: 'Faire un don' }]} />
        <div className="mx-auto max-w-md px-6 py-20 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Merci pour votre don !</h2>
          <p className="text-gray-600 mb-2">Montant : <strong>{amount.toLocaleString('fr-FR')} FCFA</strong></p>
          {!anonymous && form.email && <p className="text-gray-500 text-sm mb-6">Un reçu a été envoyé à <strong>{form.email}</strong>.</p>}
          <p className="text-xs text-gray-400 mb-8">L'intégration KKiaPay / PayPal sera active prochainement.</p>
          <button onClick={() => { setSubmitted(false); setAmount(10000); }} className="text-primary-600 text-sm font-medium hover:underline">Faire un autre don</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHero
        title="Faire un don"
        subtitle="Chaque don, quel que soit son montant, finance directement nos projets sur le terrain."
        breadcrumbs={[{ label: 'Accueil', to: '/' }, { label: 'Faire un don' }]}
      />

      <div className="mx-auto max-w-2xl px-6 sm:px-10 py-12">
        {/* Tabs général / projet */}
        <div className="flex rounded-xl border border-gray-200 p-1 mb-8 bg-gray-50">
          <button onClick={() => setTab('general')} className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${tab === 'general' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
            Don général à la fondation
          </button>
          <button onClick={() => setTab('project')} className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${tab === 'project' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
            Soutenir un projet précis
          </button>
        </div>

        {tab === 'project' ? (
          <div>
            <p className="text-gray-600 text-sm mb-6">Choisissez le projet que vous souhaitez soutenir :</p>
            <div className="space-y-3">
              {projects?.map(p => (
                <Link key={p.id} to={`/donate/project/${p.id}`} className="flex items-center justify-between bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-shadow group">
                  <div>
                    <span className="text-xs text-primary-600 font-semibold">{p.axe_label || p.axe_name}</span>
                    <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors mt-0.5">{p.titre || p.title}</h3>
                    <div className="text-xs text-gray-400 mt-1">
                      {Math.round((parseFloat(p.montant_collecte || p.collected_amount || 0) / parseFloat(p.montant_cible || p.target_amount || 1)) * 100)}% financé
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-gray-300 group-hover:text-primary-500 transition-colors flex-shrink-0 ml-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Montant */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">Choisissez un montant (FCFA)</label>
              <div className="grid grid-cols-4 gap-3 mb-3">
                {PRESETS.map(v => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setAmount(v)}
                    className={`py-3 rounded-xl text-sm font-bold border transition-all ${
                      amount === v ? 'bg-primary-600 text-white border-primary-600 shadow-md' : 'bg-white border-gray-200 text-gray-700 hover:border-primary-300'
                    }`}
                  >
                    {v.toLocaleString('fr-FR')}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3">
                <span className="text-xs font-bold text-gray-400 whitespace-nowrap">FCFA</span>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={amount}
                  onChange={e => setAmount(Number(e.target.value))}
                  className="flex-1 text-sm font-bold text-gray-900 outline-none bg-transparent"
                  placeholder="Autre montant"
                />
              </div>
            </div>

            {/* Anonyme / Identifié */}
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-3">Type de don</label>
              <div className="flex gap-3">
                {[false, true].map(val => (
                  <button
                    key={String(val)}
                    type="button"
                    onClick={() => setAnonymous(val)}
                    className={`flex-1 py-3 rounded-xl text-sm font-semibold border transition-all flex items-center justify-center gap-2 ${
                      anonymous === val ? 'bg-primary-600 text-white border-primary-600' : 'bg-white border-slate-200 text-slate-600 hover:border-primary-300'
                    }`}
                  >
                    {val ? (
                      <>
                        <Lock size={16} />
                        <span>Don anonyme</span>
                      </>
                    ) : (
                      <>
                        <User size={16} />
                        <span>Don identifié</span>
                      </>
                    )}
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-2">
                {anonymous ? 'Aucune information personnelle enregistrée. Pas de reçu.' : 'Laissez vos coordonnées pour recevoir un reçu par e-mail.'}
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            {/* Infos si identifié */}
            {!anonymous && (
              <div className="grid sm:grid-cols-2 gap-4">
                {[['Prénom','prenom','text'],['Nom','nom','text']].map(([label, key, type]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                    <input required={!anonymous} type={type} value={form[key]} onChange={e => update(key, e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                  </div>
                ))}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">E-mail (pour recevoir le reçu)</label>
                  <input required={!anonymous} type="email" value={form.email} onChange={e => update('email', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Téléphone (Momo)</label>
                  <input required={!anonymous} type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Ex: +229 97 00 00 00" />
                </div>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-primary-600 text-white rounded-full font-bold text-base hover:bg-primary-700 transition shadow-md disabled:opacity-60"
            >
              {loading ? 'Redirection vers le paiement...' : `Donner ${amount.toLocaleString('fr-FR')} FCFA →`}
            </button>
            <p className="text-xs text-gray-400 text-center">Paiement sécurisé via KKiaPay (mobile money) ou cartes bancaires.</p>
          </form>
        )}
      </div>
    </div>
  );
}
