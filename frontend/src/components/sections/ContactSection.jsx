import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Simulate sending API request
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setError("Une erreur est survenue lors de l'envoi de votre message. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="contact" className="py-24 bg-white scroll-mt-20">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-20">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary-600 text-xs sm:text-sm font-bold uppercase tracking-[0.2em] block mb-3">
            Contactez-nous
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight font-heading leading-tight">
            Une question ? Un projet de partenariat ? <br className="hidden sm:inline" />
            Écrivez-nous
          </h2>
          <div className="w-12 h-1.5 bg-primary-500 mx-auto mt-6 rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Info */}
          <div className="lg:col-span-2 space-y-8 bg-slate-50 border border-slate-100 rounded-3xl p-8 lg:p-10 shadow-sm">
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Informations de contact</h3>
              <p className="text-sm text-slate-500">Notre équipe est disponible pour répondre à vos questions et vous guider dans vos démarches d'engagement.</p>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-11 h-11 bg-primary-50 border border-primary-100 rounded-xl flex items-center justify-center text-primary-600 flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Adresse</p>
                  <p className="text-sm font-bold text-slate-800 mt-1">Cotonou, Bénin</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-11 h-11 bg-primary-50 border border-primary-100 rounded-xl flex items-center justify-center text-primary-600 flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Téléphone</p>
                  <a href="tel:+22997603805" className="text-sm font-bold text-slate-800 hover:text-primary-600 transition mt-1 block">
                    +229 97 60 38 05
                  </a>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-11 h-11 bg-primary-50 border border-primary-100 rounded-xl flex items-center justify-center text-primary-600 flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">E-mail</p>
                  <a href="mailto:contact@lafaaz.org" className="text-sm font-bold text-slate-800 hover:text-primary-600 transition mt-1 block">
                    contact@lafaaz.org
                  </a>
                  <a href="mailto:info@lafaaz.org" className="text-xs text-slate-400 font-medium hover:text-primary-600 transition mt-0.5 block">
                    info@lafaaz.org
                  </a>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-11 h-11 bg-primary-50 border border-primary-100 rounded-xl flex items-center justify-center text-primary-600 flex-shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Horaires</p>
                  <p className="text-sm font-bold text-slate-800 mt-1">Lundi – Vendredi : 8h00 – 17h00</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="lg:col-span-3">
            {success ? (
              <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-8 text-center space-y-4 shadow-sm animate-fade-in">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-emerald-800">Message envoyé avec succès !</h3>
                <p className="text-sm text-emerald-700 max-w-md mx-auto leading-relaxed">
                  Merci de nous avoir contactés. Notre équipe étudiera votre message et vous répondra à l'adresse e-mail fournie dans les plus brefs délais.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="inline-flex items-center justify-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-full text-xs transition shadow-md"
                >
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl text-xs flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Nom complet *</label>
                    <input
                      required
                      type="text"
                      placeholder="Ex: Jean Dupont"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Adresse e-mail *</label>
                    <input
                      required
                      type="email"
                      placeholder="Ex: jean.dupont@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Sujet *</label>
                  <input
                    required
                    type="text"
                    placeholder="Ex: Demande de partenariat / Question sur les dons"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Votre message *</label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Écrivez votre message ici..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition resize-none"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold px-8 py-4 rounded-full text-xs transition shadow-md disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Envoi en cours…</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Envoyer le message</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
