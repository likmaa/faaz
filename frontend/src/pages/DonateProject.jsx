import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageHero from '../components/ui/PageHero';
import { useProject } from '../hooks/useProjects';
import Loading from '../components/ui/Loading';
import { Lock, User } from 'lucide-react';
import api from '../services/api';
import { useSeo } from '../hooks/useSeo';
import { FeexPayButton } from '@feexpay/react-sdk';

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
  const [feexpayConfig, setFeexpayConfig] = useState({ id: '', token: '', mode: 'SANDBOX' });
  const [customId, setCustomId] = useState('');
  const feexpayRef = useRef(null);

  useSeo({
    title: project ? `Soutenir ${project.titre}` : "Soutenir un projet",
    description: project ? `Faire un don pour soutenir le projet : ${project.titre}.` : "Soutenir un projet de la Fondation FAAZ."
  });

  useEffect(() => {
    // Générer un identifiant de transaction unique
    setCustomId(`DON-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`);

    // Charger les clés FeexPay depuis les paramètres du CMS
    api.get('/cms/')
      .then(res => {
        const list = Array.isArray(res.data) ? res.data : (res.data?.results || []);
        const idSetting = list.find(item => item.key === 'feexpay_id');
        const tokenSetting = list.find(item => item.key === 'feexpay_token');
        const modeSetting = list.find(item => item.key === 'feexpay_mode');
        if (idSetting && tokenSetting) {
          setFeexpayConfig({
            id: idSetting.value,
            token: tokenSetting.value,
            mode: modeSetting?.value || 'SANDBOX'
          });
        }
      })
      .catch(err => console.warn("Could not load FeexPay key from settings", err));
  }, [project]);

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
          
          if (!anonymous && (!form.prenom || !form.nom || !form.email || !form.phone)) {
            setError("Veuillez remplir vos informations personnelles avant de continuer.");
            return;
          }

          if (!feexpayConfig.id || !feexpayConfig.token) {
            setError("Le système de paiement n'est pas encore configuré par l'administrateur.");
            return;
          }

          setLoading(true);
          setError(null);

          // Déclencher FeexPay de manière programmatique
          if (feexpayRef.current) {
            const innerDiv = feexpayRef.current.firstChild;
            if (innerDiv) {
              innerDiv.dispatchEvent(new CustomEvent("feexpay:trigger"));
              // Réinitialiser le chargement après 3 secondes au cas où
              setTimeout(() => setLoading(false), 3000);
            } else {
              setError("Erreur d'initialisation de la modale FeexPay.");
              setLoading(false);
            }
          } else {
            setError("Service FeexPay non prêt.");
            setLoading(false);
          }
        }} className="space-y-6">

          {/* Wrapper caché de FeexPayButton */}
          <div ref={feexpayRef} style={{ display: 'none' }}>
            {feexpayConfig.id && feexpayConfig.token && (
              <FeexPayButton
                amount={amount}
                description={`Don projet - ${project.titre}`}
                id={feexpayConfig.id}
                token={feexpayConfig.token}
                customId={customId}
                callback_url={window.location.href}
                callback_info={{
                  description: `Don projet: ${project.titre}`,
                  fullname: anonymous ? "Donateur Anonyme" : `${form.prenom} ${form.nom}`.trim(),
                  email: anonymous ? "anonymous@lafaaz.org" : form.email,
                  phone: form.phone || "00000000"
                }}
                mode={feexpayConfig.mode}
                callback={async (response) => {
                  if (response && response.status === "FAILED") {
                    setError(response.message || "Le paiement a échoué.");
                    setLoading(false);
                    return;
                  }
                  
                  try {
                    const payload = {
                      project: project.id,
                      amount: amount,
                      payment_channel: "feexpay",
                      transaction_reference: response.reference || response.transaction_id || customId,
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
                }}
              />
            )}
          </div>
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
            {loading ? 'Initialisation du paiement...' : `Donner ${amount.toLocaleString('fr-FR')} FCFA pour ce projet →`}
          </button>
          <p className="text-xs text-gray-400 text-center">Paiement sécurisé via FeexPay (mobile money) ou cartes bancaires.</p>
        </form>

        {/* Note de virement bancaire */}
        <div className="mt-8 pt-6 border-t border-slate-100/50">
          <div className="bg-slate-50/50 rounded-2xl p-5 border border-slate-100 flex gap-4 items-start">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <rect x="2" y="5" width="20" height="14" rx="2"/>
                <line x1="2" y1="10" x2="22" y2="10"/>
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm mb-1">Virement bancaire direct</h4>
              <p className="text-sm text-slate-600">
                Vous pouvez également faire un don par dépôt ou virement bancaire sur le compte de l'association :<br/>
                <strong className="text-slate-800">NSIA Banque : 380004537013</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
