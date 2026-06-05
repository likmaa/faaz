import { useState, useEffect } from 'react';
import { Save, Loader2, Building2, CreditCard, Users2, UserCog } from 'lucide-react';
import { toast } from '../store/toast';
import api from '../services/api';

const TABS = [
  { id: 'fondation', label: 'Fondation', icon: Building2 },
  { id: 'paiement', label: 'Paiement', icon: CreditCard },
  { id: 'adhesion', label: 'Adhésion & Cotisation', icon: Users2 },
  { id: 'utilisateurs', label: 'Utilisateurs & Rôles', icon: UserCog },
];

function Field({ label, required, children }) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-600 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

const INPUT = 'w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition';

export default function Parametres() {
  const [tab, setTab] = useState('fondation');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fondation form
  const [fondation, setFondation] = useState({
    name: 'Fondation les Amis de A à Z',
    slogan: "Engageons notre amitié\nau service des personnes\nvulnérables.",
    mission: "Promouvoir le bien-être des personnes les plus vulnérables à travers des actions solidaires, structurées et à impact mesurable.",
    vision: "Épanouissement durable de l'humanité — un Bénin où chaque personne vulnérable est accompagnée avec dignité.",
    about_text: "La FAAZ — Fondation les Amis de A à Z — est une ONG béninoise à membres fondée sur un engagement simple : promouvoir le bien-être des personnes les plus vulnérables. Orphelins, élèves méritants, jeunes en quête de repères, personnes âgées isolées : chaque action de la FAAZ part d'une conviction, celle que l'amitié peut changer des vies.",
    phone: '97 60 38 05',
    email: 'info@lafaaz.org',
    address: 'Cotonou, Bénin',
    facebook: '',
    instagram: '',
    twitter: '',
    tiktok: '',
    youtube: '',
  });

  // Paiement form
  const [paiement, setPaiement] = useState({
    kkiapay_key: '',
    kkiapay_limit: 300000,
    paypal_client_id: '',
    momo_number: '',
    bank_name: '',
    bank_iban: '',
    fee_note: '~3 % de frais de transaction (KKiaPay / PayPal)',
  });

  // Adhésion form
  const [adhesion, setAdhesion] = useState({
    adhesion_fee: 10000,
    annual_fee: 25000,
    deadline_day: 30,
    deadline_month: 6,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    setLoading(true);
    try {
      const res = await api.get('/cms/');
      const list = Array.isArray(res.data) 
        ? res.data 
        : (Array.isArray(res.data?.results) 
            ? res.data.results 
            : (res.data?.data || []));

      const map = {};
      list.forEach(item => {
        map[item.key] = item.value;
      });

      // Update fondation state
      setFondation(f => ({
        ...f,
        name: map.name || f.name,
        slogan: map.slogan || f.slogan,
        mission: map.mission || f.mission,
        vision: map.vision || f.vision,
        about_text: map.about_text || f.about_text,
        phone: map.phone || f.phone,
        email: map.email || f.email,
        address: map.address || f.address,
        facebook: map.facebook || f.facebook,
        instagram: map.instagram || f.instagram,
        twitter: map.twitter || f.twitter,
        tiktok: map.tiktok || f.tiktok,
        youtube: map.youtube || f.youtube,
      }));

      // Update paiement state
      setPaiement(p => ({
        ...p,
        kkiapay_key: map.kkiapay_key || p.kkiapay_key,
        kkiapay_limit: map.kkiapay_limit ? parseInt(map.kkiapay_limit, 10) : p.kkiapay_limit,
        paypal_client_id: map.paypal_client_id || p.paypal_client_id,
        momo_number: map.momo_number || p.momo_number,
        bank_name: map.bank_name || p.bank_name,
        bank_iban: map.bank_iban || p.bank_iban,
        fee_note: map.fee_note || p.fee_note,
      }));

      // Update adhesion state
      setAdhesion(a => ({
        ...a,
        adhesion_fee: map.adhesion_fee ? parseInt(map.adhesion_fee, 10) : a.adhesion_fee,
        annual_fee: map.annual_fee ? parseInt(map.annual_fee, 10) : a.annual_fee,
        deadline_day: map.deadline_day ? parseInt(map.deadline_day, 10) : a.deadline_day,
        deadline_month: map.deadline_month ? parseInt(map.deadline_month, 10) : a.deadline_month,
      }));

    } catch (err) {
      console.error(err);
      toast.error('Erreur lors du chargement des paramètres.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      const payload = tab === 'fondation' 
        ? fondation 
        : (tab === 'paiement' ? paiement : adhesion);
        
      await Promise.all(
        Object.entries(payload).map(([key, value]) =>
          api.put(`/cms/${key}/`, { key, value: String(value) }).catch(() =>
            api.post('/cms/', { key, value: String(value) })
          )
        )
      );
      toast.success('Paramètres enregistrés avec succès.');
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de l'enregistrement des paramètres.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
        <span className="text-sm font-semibold text-slate-500">Chargement des paramètres…</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight font-title">Paramètres</h1>
        <p className="text-slate-500 text-sm mt-1">Configuration de la fondation, des paiements et des accès</p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-2xl w-fit flex-wrap">
        {TABS.map(t => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition ${
                tab === t.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 md:p-8">
        {/* ── FONDATION ── */}
        {tab === 'fondation' && (
          <div className="space-y-5 max-w-2xl">
            <h2 className="text-base font-bold text-slate-900">Informations de la fondation</h2>

            <Field label="Nom de la fondation" required>
              <input type="text" value={fondation.name} onChange={e => setFondation(f => ({ ...f, name: e.target.value }))} className={INPUT} />
            </Field>
            <Field label="Slogan">
              <input type="text" value={fondation.slogan} onChange={e => setFondation(f => ({ ...f, slogan: e.target.value }))} className={INPUT} />
            </Field>
            <Field label="Mission">
              <textarea value={fondation.mission} onChange={e => setFondation(f => ({ ...f, mission: e.target.value }))} rows={3} className={`${INPUT} resize-none`} />
            </Field>
            <Field label="Vision">
              <textarea value={fondation.vision} onChange={e => setFondation(f => ({ ...f, vision: e.target.value }))} rows={3} className={`${INPUT} resize-none`} />
            </Field>
            <Field label="Présentation générale (Section À propos)">
              <textarea value={fondation.about_text} onChange={e => setFondation(f => ({ ...f, about_text: e.target.value }))} rows={4} className={`${INPUT} resize-none`} />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Téléphone">
                <input type="tel" value={fondation.phone} onChange={e => setFondation(f => ({ ...f, phone: e.target.value }))} className={INPUT} />
              </Field>
              <Field label="E-mail">
                <input type="email" value={fondation.email} onChange={e => setFondation(f => ({ ...f, email: e.target.value }))} className={INPUT} />
              </Field>
            </div>
            <Field label="Adresse">
              <input type="text" value={fondation.address} onChange={e => setFondation(f => ({ ...f, address: e.target.value }))} className={INPUT} />
            </Field>

            <h3 className="text-sm font-bold text-slate-700 pt-2 border-t border-slate-100">Réseaux sociaux</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { key: 'facebook', label: 'Facebook' },
                { key: 'instagram', label: 'Instagram' },
                { key: 'twitter', label: 'X (Twitter)' },
                { key: 'tiktok', label: 'TikTok' },
                { key: 'youtube', label: 'YouTube' },
              ].map(({ key, label }) => (
                <Field key={key} label={label}>
                  <input type="url" value={fondation[key]} onChange={e => setFondation(f => ({ ...f, [key]: e.target.value }))}
                    placeholder="https://…" className={INPUT} />
                </Field>
              ))}
            </div>
          </div>
        )}

        {/* ── PAIEMENT ── */}
        {tab === 'paiement' && (
          <div className="space-y-5 max-w-2xl">
            <h2 className="text-base font-bold text-slate-900">Paramètres de paiement</h2>

            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-700 font-semibold">
              Aucune donnée de carte n'est saisie ici. Les clés API sont transmises de façon sécurisée au serveur.
            </div>

            <h3 className="text-sm font-bold text-slate-700">KKiaPay</h3>
            <Field label="Clé publique KKiaPay">
              <input type="text" value={paiement.kkiapay_key} onChange={e => setPaiement(f => ({ ...f, kkiapay_key: e.target.value }))}
                placeholder="kkiapay_pub_…" className={INPUT} />
            </Field>
            <Field label="Plafond par transaction (FCFA)">
              <input type="number" value={paiement.kkiapay_limit} step={10000} min={0}
                onChange={e => setPaiement(f => ({ ...f, kkiapay_limit: e.target.value }))} className={INPUT} />
              <p className="text-xs text-slate-400 mt-1">Actuellement fixé à 300 000 FCFA par transaction.</p>
            </Field>

            <h3 className="text-sm font-bold text-slate-700 pt-2 border-t border-slate-100">PayPal</h3>
            <Field label="Client ID PayPal">
              <input type="text" value={paiement.paypal_client_id} onChange={e => setPaiement(f => ({ ...f, paypal_client_id: e.target.value }))}
                placeholder="AXxx…" className={INPUT} />
            </Field>

            <h3 className="text-sm font-bold text-slate-700 pt-2 border-t border-slate-100">MoMo Pay & Banque</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Numéro MoMo Pay">
                <input type="tel" value={paiement.momo_number} onChange={e => setPaiement(f => ({ ...f, momo_number: e.target.value }))} className={INPUT} />
              </Field>
              <Field label="Nom de la banque">
                <input type="text" value={paiement.bank_name} onChange={e => setPaiement(f => ({ ...f, bank_name: e.target.value }))} className={INPUT} />
              </Field>
              <Field label="IBAN / RIB">
                <input type="text" value={paiement.bank_iban} onChange={e => setPaiement(f => ({ ...f, bank_iban: e.target.value }))} className={INPUT} />
              </Field>
            </div>
            <Field label="Note sur les frais">
              <input type="text" value={paiement.fee_note} onChange={e => setPaiement(f => ({ ...f, fee_note: e.target.value }))} className={INPUT} />
            </Field>
          </div>
        )}

        {/* ── ADHÉSION & COTISATION ── */}
        {tab === 'adhesion' && (
          <div className="space-y-5 max-w-lg">
            <h2 className="text-base font-bold text-slate-900">Adhésion & Cotisation annuelle</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Droit d'adhésion (FCFA)" required>
                <input type="number" value={adhesion.adhesion_fee} step={500} min={0}
                  onChange={e => setAdhesion(f => ({ ...f, adhesion_fee: e.target.value }))} className={INPUT} />
                <p className="text-xs text-slate-400 mt-1">Versement unique à l'inscription.</p>
              </Field>
              <Field label="Cotisation annuelle (FCFA)" required>
                <input type="number" value={adhesion.annual_fee} step={500} min={0}
                  onChange={e => setAdhesion(f => ({ ...f, annual_fee: e.target.value }))} className={INPUT} />
                <p className="text-xs text-slate-400 mt-1">Renouvelée chaque année.</p>
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Jour d'échéance" required>
                <input type="number" value={adhesion.deadline_day} min={1} max={31}
                  onChange={e => setAdhesion(f => ({ ...f, deadline_day: e.target.value }))} className={INPUT} />
              </Field>
              <Field label="Mois d'échéance" required>
                <select value={adhesion.deadline_month} onChange={e => setAdhesion(f => ({ ...f, deadline_month: e.target.value }))} className={INPUT}>
                  {['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'].map((m, i) => (
                    <option key={i+1} value={i+1}>{m}</option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="bg-sky-50 border border-sky-200 rounded-xl px-4 py-3 text-sm text-sky-700">
              <strong>Échéance actuelle :</strong> {adhesion.deadline_day} {['','janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'][adhesion.deadline_month]} de chaque année.
            </div>
          </div>
        )}

        {/* ── UTILISATEURS ── */}
        {tab === 'utilisateurs' && (
          <div className="space-y-5 max-w-2xl">
            <h2 className="text-base font-bold text-slate-900">Utilisateurs & Rôles</h2>
            <div className="bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-sm text-slate-600">
              La gestion des comptes staff et l'attribution des rôles se font ici. Cette section sera connectée à l'API Django Admin.
            </div>
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-400">Utilisateur</th>
                    <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-400">Rôle</th>
                    <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-400">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="px-5 py-4 text-sm font-semibold text-slate-700">admin@lafaaz.org</td>
                    <td className="px-5 py-4"><span className="text-xs font-bold bg-primary-50 text-primary-700 px-2.5 py-1 rounded-full border border-primary-200">Admin principal</span></td>
                    <td className="px-5 py-4"><span className="text-xs font-bold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-200">Actif</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-slate-400">Pour ajouter ou modifier des comptes, utilisez l'interface Django Admin (/admin) ou l'API dédiée.</p>
          </div>
        )}

        {/* Save button */}
        {tab !== 'utilisateurs' && (
          <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 transition disabled:opacity-60 shadow-sm"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Enregistrer les paramètres
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
