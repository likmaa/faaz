import React, { useState } from 'react';
import PageHero from '../components/ui/PageHero';
import { Vote, BarChart3, Handshake } from 'lucide-react';
import api from '../services/api';
import { useSeo } from '../hooks/useSeo';

const FIELDS = [
  { name: 'prenom',       label: 'Prénom',          type: 'text',  required: true,  col: 1 },
  { name: 'nom',          label: 'Nom',              type: 'text',  required: true,  col: 1 },
  { name: 'email',        label: 'Adresse e-mail',   type: 'email', required: true,  col: 2 },
  { name: 'telephone',    label: 'Téléphone',        type: 'tel',   required: true,  col: 1, pattern: '[+0-9 -]{6,20}', placeholder: 'Ex: +229 97 60 38 05' },
  { name: 'date_naissance', label: 'Date de naissance', type: 'date', required: true, col: 1 },
  { name: 'profession',   label: 'Profession',       type: 'text',  required: false, col: 2 },
  { name: 'adresse',      label: 'Adresse',          type: 'text',  required: false, col: 2 },
  { name: 'ville',        label: 'Ville',            type: 'text',  required: true,  col: 1 },
  { name: 'code_postal',  label: 'Code postal',      type: 'text',  required: false, col: 1 },
  { name: 'pays',         label: 'Pays',             type: 'text',  required: true,  col: 2, defaultValue: 'Bénin' },
];

const CONTACT_MODES = ['E-mail', 'Téléphone', 'WhatsApp'];

export default function JoinUs() {
  const [form, setForm] = useState({ pays: 'Bénin' });
  const [contactMode, setContactMode] = useState('E-mail');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  useSeo({
    title: 'Devenir membre',
    description: "Adhérez à la Fondation FAAZ et participez activement à notre mission au Bénin : aide à l'enfance, excellence scolaire et coaching de la jeunesse.",
    keywords: 'adhésion faaz, devenir membre ong, cotisation fondation bénin, rejoindre faaz'
  });

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      first_name: form.prenom || '',
      last_name: form.nom || '',
      email: form.email || '',
      phone: form.telephone || '',
      birth_date: form.date_naissance || '',
      profession: form.profession || '',
      address: form.adresse || '',
      city: form.ville || '',
      zip_code: form.code_postal || '',
      country: form.pays || 'Bénin',
      contact_method: contactMode === 'E-mail' ? 'email' : (contactMode === 'Téléphone' ? 'phone' : 'whatsapp')
    };

    try {
      await api.post('/members/', payload);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.email?.[0] || 
        err.response?.data?.message || 
        "Une erreur est survenue lors de la soumission de votre demande d'adhésion. Veuillez réessayer."
      );
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div>
        <PageHero title="Demande d'adhésion" breadcrumbs={[{ label: 'Accueil', to: '/' }, { label: 'Devenir membre' }]} />
        <div className="mx-auto max-w-xl px-6 py-20 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Demande reçue !</h2>
          <p className="text-gray-600 leading-relaxed mb-8">
            Merci, {form.prenom} ! Votre demande d'adhésion a bien été enregistrée. Notre équipe l'examinera et vous contactera par <strong>{contactMode.toLowerCase()}</strong> dans les meilleurs délais pour finaliser votre inscription.
          </p>
          <button onClick={() => { setSubmitted(false); setForm({ pays: 'Bénin' }); }} className="text-primary-600 text-sm font-medium hover:underline">
            Soumettre une autre demande
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHero
        title="Devenir membre"
        subtitle="Rejoignez la communauté FAAZ. Adhérez, cotisez et participez à la vie d'une fondation qui structure la solidarité."
        breadcrumbs={[{ label: 'Accueil', to: '/' }, { label: 'Devenir membre' }]}
      />

      <div className="mx-auto max-w-3xl px-6 sm:px-10 py-12">
        {/* Avantages membres */}
        <div className="grid sm:grid-cols-3 gap-6 mb-12">
          {[
            { Icon: Vote, titre: 'Droit de vote', texte: 'Participez aux assemblées générales et aux décisions de la fondation.' },
            { Icon: BarChart3, titre: 'Rapports exclusifs', texte: "Accès à nos rapports d'impact détaillés et aux bilans financiers." },
            { Icon: Handshake, titre: 'Réseau FAAZ', texte: 'Faites partie d\'une communauté engagée au Bénin et en diaspora.' },
          ].map(a => (
            <div key={a.titre} className="bg-primary-50/50 border border-primary-100/50 rounded-2xl p-5 text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-white border border-primary-100/50 flex items-center justify-center mb-4 text-primary-600 shadow-sm">
                <a.Icon size={22} strokeWidth={2} />
              </div>
              <p className="font-semibold text-slate-800 text-sm mb-1 font-body">{a.titre}</p>
              <p className="text-xs text-slate-500 leading-relaxed font-body">{a.texte}</p>
            </div>
          ))}
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900">Informations personnelles</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-5">
            {FIELDS.map(f => (
              <div key={f.name} className={f.col === 2 ? 'sm:col-span-2' : ''}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {f.label} {f.required && <span className="text-red-500">*</span>}
                </label>
                <input
                  type={f.type}
                  required={f.required}
                  pattern={f.pattern}
                  placeholder={f.placeholder}
                  value={form[f.name] || f.defaultValue || ''}
                  onChange={e => update(f.name, e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            ))}
          </div>

          {/* Mode de contact */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Comment préférez-vous être contacté(e) ? <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-3">
              {CONTACT_MODES.map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setContactMode(m)}
                  className={`px-4 py-2.5 rounded-full text-sm font-semibold border transition-all ${
                    contactMode === m
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Consentement */}
          <div className="flex items-start gap-3 bg-gray-50 rounded-2xl p-4 border border-gray-100">
            <input required type="checkbox" id="consent" className="mt-0.5 w-4 h-4 accent-primary-600 cursor-pointer" />
            <label htmlFor="consent" className="text-xs text-gray-600 leading-relaxed cursor-pointer">
              J'accepte que la Fondation les Amis de A à Z conserve mes données personnelles aux fins de gestion de mon adhésion.
              Ces données ne seront ni vendues, ni partagées avec des tiers sans mon consentement. J'ai le droit de les modifier ou de demander leur suppression à tout moment.
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-primary-600 text-white rounded-full font-bold text-base hover:bg-primary-700 transition shadow-md disabled:opacity-60"
          >
            {loading ? 'Soumission...' : 'Soumettre ma demande d\'adhésion →'}
          </button>
          <p className="text-xs text-gray-400 text-center">Votre adhésion sera activée après validation de votre dossier et règlement de la cotisation.</p>
        </form>
      </div>
    </div>
  );
}
