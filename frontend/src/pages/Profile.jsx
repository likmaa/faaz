import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import api from '../services/api';
import PageHero from '../components/ui/PageHero';
import { User, Mail, Phone, MapPin, Briefcase, Calendar, CreditCard, ShieldCheck, AlertTriangle, LogOut, CheckCircle2, Loader2 } from 'lucide-react';

export default function Profile() {
  const { token, logout } = useAuthStore();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [kkiapayKey, setKkiapayKey] = useState('');
  const [annualFee, setAnnualFee] = useState(25000);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  useEffect(() => {
    if (!token) return;

    // Load user profile
    api.get('/user')
      .then(res => {
        setProfile(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Impossible de charger votre profil. Veuillez vous reconnecter.");
        setLoading(false);
      });

    // Inject KKiaPay script
    const script = document.createElement('script');
    script.src = "https://cdn.kkiapay.me/k.js";
    script.async = true;
    document.body.appendChild(script);

    // Load KKiaPay public key + annual fee from CMS settings
    api.get('/cms/')
      .then(res => {
        const list = Array.isArray(res.data) ? res.data : (res.data?.results || []);
        const keySetting = list.find(item => item.key === 'kkiapay_key');
        const feeSetting = list.find(item => item.key === 'annual_fee');
        if (keySetting?.value) setKkiapayKey(keySetting.value);
        if (feeSetting?.value) setAnnualFee(parseInt(feeSetting.value, 10) || 25000);
      })
      .catch(err => console.warn('Could not load CMS settings', err));

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [token]);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  function handlePayCotisation() {
    if (!profile || !profile.member_profile) return;
    setError(null);

    if (typeof window.openKkiapayWidget === 'undefined') {
      setError("Le service de paiement est en cours de chargement. Veuillez patienter.");
      return;
    }

    setPaymentLoading(true);

    const member = profile.member_profile;
    const currentYear = new Date().getFullYear();

    window.openKkiapayWidget({
      amount: annualFee,
      position: "center",
      sandbox: false,
      key: kkiapayKey || "1283ee43a7e00476a6c179aa602b83f234d4a934",
      phone: member.phone || "",
      email: profile.email || "",
      name: `${member.first_name} ${member.last_name}`.trim()
    });

    const handleSuccess = async (response) => {
      try {
        const payload = {
          payment_type: "cotisation",
          year: currentYear,
          amount: annualFee,
          payment_channel: "kkiapay",
          transaction_reference: response.transactionId,
          status: "paye"
        };

        const payRes = await api.post('/payments/', payload);

        // Update profile in state with the new payment and status
        setProfile(prev => {
          const updatedMember = {
            ...prev.member_profile,
            contribution_status: 'a_jour',
            payments: [payRes.data, ...(prev.member_profile.payments || [])]
          };
          return {
            ...prev,
            member_profile: updatedMember
          };
        });

        setPaymentSuccess(true);
      } catch (err) {
        console.error(err);
        setError("Erreur lors de la validation de votre paiement. Veuillez contacter le support.");
      } finally {
        setPaymentLoading(false);
      }
    };

    const handleClose = () => {
      setPaymentLoading(false);
    };

    window.addKkiapayListener('success', handleSuccess);
    window.addKkiapayListener('close', handleClose);
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
        <span className="text-sm font-semibold text-slate-500">Chargement de votre espace membre…</span>
      </div>
    );
  }

  const member = profile?.member_profile;

  return (
    <div>
      <PageHero
        title="Mon Espace Membre"
        subtitle="Consultez vos informations d'adhésion et réglez vos cotisations annuelles."
        breadcrumbs={[{ label: 'Accueil', to: '/' }, { label: 'Espace Membre' }]}
      />

      <div className="mx-auto max-w-6xl px-6 py-12">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-6 flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {paymentSuccess && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm px-5 py-4 rounded-xl mb-6 flex items-start gap-3 shadow-sm">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            <div>
              <h4 className="font-bold text-base mb-1">Paiement effectué avec succès !</h4>
              <p className="opacity-90">Merci pour le paiement de votre cotisation annuelle de 25 000 FCFA. Votre statut est désormais à jour.</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: COORDINATES */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary-50 rounded-full -mr-8 -mt-8 opacity-40 blur-lg"></div>
              
              <div className="flex flex-col items-center text-center pb-6 border-b border-gray-100">
                <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold text-2xl mb-3 shadow-inner">
                  {profile.first_name?.[0]?.toUpperCase() || profile.username?.[0]?.toUpperCase()}
                </div>
                <h3 className="font-bold text-gray-900 text-lg">{profile.first_name} {profile.last_name}</h3>
                <p className="text-sm text-gray-400 font-medium">{profile.is_staff ? "Administrateur" : "Membre"}</p>
              </div>

              {member ? (
                <div className="py-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-400 font-semibold uppercase">E-mail</p>
                      <p className="text-sm text-gray-700 font-medium">{profile.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-400 font-semibold uppercase">Téléphone</p>
                      <p className="text-sm text-gray-700 font-medium">{member.phone || 'Non renseigné'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-400 font-semibold uppercase">Ville / Pays</p>
                      <p className="text-sm text-gray-700 font-medium">
                        {member.city || 'Non renseignée'}{member.country ? `, ${member.country}` : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-400 font-semibold uppercase">Profession</p>
                      <p className="text-sm text-gray-700 font-medium">{member.profession || 'Non renseignée'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-400 font-semibold uppercase">Membre depuis</p>
                      <p className="text-sm text-gray-700 font-medium">
                        {member.created_at ? new Date(member.created_at).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-6 text-center text-sm text-gray-400">
                  <p>Aucun profil membre lié à cet utilisateur.</p>
                  <p className="mt-2">Si vous êtes membre, veuillez contacter l'administration.</p>
                </div>
              )}

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-3 border border-gray-200 hover:border-red-200 hover:text-red-600 rounded-full font-bold text-sm text-gray-600 transition"
              >
                <LogOut className="w-4 h-4" />
                Se déconnecter
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: COTISATION & PAYMENTS */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* COTISATION STATUS CARD */}
            {member && (
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 md:p-8">
                <h3 className="font-bold text-gray-900 text-lg mb-6 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary-600" />
                  Statut de cotisation
                </h3>

                {member.contribution_status === 'a_jour' ? (
                  <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-6 flex flex-col md:flex-row items-center md:items-start gap-4">
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-7 h-7" />
                    </div>
                    <div className="text-center md:text-left space-y-2">
                      <h4 className="font-bold text-emerald-950 text-base">Votre cotisation est à jour</h4>
                      <p className="text-sm text-emerald-800">
                        Merci pour votre soutien continu à la Fondation FAAZ. Votre cotisation annuelle de {annualFee.toLocaleString('fr-FR')} FCFA est réglée. Vos contributions aident à soutenir nos axes stratégiques pour l'enfance, la jeunesse, et l'excellence.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex flex-col md:flex-row items-center md:items-start gap-4">
                      <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center shrink-0">
                        <AlertTriangle className="w-7 h-7" />
                      </div>
                      <div className="text-center md:text-left space-y-2">
                        <h4 className="font-bold text-amber-950 text-base">Cotisation annuelle en retard</h4>
                        <p className="text-sm text-amber-800">
                          Votre cotisation annuelle pour l'année en cours ({new Date().getFullYear()}) n'a pas encore été validée ou reçue. Pour rester membre actif, veuillez régler votre cotisation.
                        </p>
                      </div>
                    </div>

                    <div className="border border-gray-100 rounded-2xl p-6 bg-slate-50 flex flex-col md:flex-row justify-between items-center gap-5">
                      <div>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Montant annuel</p>
                        <p className="text-2xl font-black text-gray-900">{annualFee.toLocaleString('fr-FR')} FCFA</p>
                        <p className="text-xs text-gray-500 mt-1">Paiement sécurisé via Mobile Money (MoMo) ou Carte</p>
                      </div>
                      <button
                        onClick={handlePayCotisation}
                        disabled={paymentLoading}
                        className="w-full md:w-auto px-8 py-4 bg-primary-600 text-white rounded-full font-bold text-sm hover:bg-primary-700 transition shadow-sm hover:shadow-md disabled:opacity-60 flex items-center justify-center gap-2"
                      >
                        {paymentLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Traitement…
                          </>
                        ) : (
                          "Payer ma cotisation en ligne"
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* PAYMENT HISTORY */}
            {member && (
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
                <h3 className="font-bold text-gray-900 text-lg mb-5 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary-600" />
                  Historique des versements
                </h3>

                {member.payments && member.payments.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-gray-100 text-xs font-bold uppercase text-gray-400 tracking-wider">
                          <th className="pb-3 pr-4">Type</th>
                          <th className="pb-3 pr-4">Année</th>
                          <th className="pb-3 pr-4">Montant</th>
                          <th className="pb-3 pr-4">Canal</th>
                          <th className="pb-3 pr-4">Statut</th>
                          <th className="pb-3">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {member.payments.map((p) => (
                          <tr key={p.id} className="text-sm text-gray-700">
                            <td className="py-3.5 pr-4 font-semibold capitalize">
                              {p.payment_type === 'adhésion' ? 'Droit d\'adhésion' : 'Cotisation annuelle'}
                            </td>
                            <td className="py-3.5 pr-4 font-medium">{p.year}</td>
                            <td className="py-3.5 pr-4 font-bold text-gray-900">{parseInt(p.amount, 10).toLocaleString('fr-FR')} FCFA</td>
                            <td className="py-3.5 pr-4 font-medium uppercase text-xs">{p.payment_channel}</td>
                            <td className="py-3.5 pr-4">
                              <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-bold border ${
                                p.status === 'paye' 
                                  ? 'bg-green-50 border-green-200 text-green-700' 
                                  : 'bg-red-50 border-red-200 text-red-700'
                              }`}>
                                {p.status === 'paye' ? 'Payé' : 'Échoué'}
                              </span>
                            </td>
                            <td className="py-3.5 text-gray-400 text-xs">
                              {new Date(p.created_at).toLocaleDateString('fr-FR')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-sm text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    Aucun versement enregistré pour le moment.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
