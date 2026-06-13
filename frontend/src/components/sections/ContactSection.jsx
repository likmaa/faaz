import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, ShieldAlert, Loader2 } from 'lucide-react';
import api from '../../services/api';

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
      await api.post('/contact/', formData);
      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setError("Une erreur est survenue lors de l'envoi de votre message. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="contact" className="relative py-24 lg:py-32 bg-slate-50 overflow-hidden scroll-mt-20">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-100/40 rounded-full blur-[120px] mix-blend-multiply opacity-70" />
        <div className="absolute bottom-0 left-[-200px] w-[600px] h-[600px] bg-secondary-100/40 rounded-full blur-[120px] mix-blend-multiply opacity-70" />
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.15]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-slate-800 text-[11px] font-bold uppercase tracking-wider mb-6 shadow-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
            Nous sommes à votre écoute
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight font-heading leading-[1.1]"
          >
            Démarrons une <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
              belle collaboration.
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-slate-500 text-base sm:text-lg leading-relaxed font-body max-w-2xl mx-auto"
          >
            Une question sur nos actions ? Envie de devenir partenaire ou bénévole ?
            Notre équipe est prête à vous accompagner dans vos démarches d'engagement.
          </motion.p>
        </div>

        {/* Split Card Container */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white rounded-[2.5rem] lg:rounded-[3rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden"
        >
          <div className="flex flex-col lg:flex-row">
            
            {/* Left Side: Dark Contact Info Block */}
            <div className="relative w-full lg:w-2/5 bg-slate-900 p-10 sm:p-14 lg:p-16 overflow-hidden flex flex-col justify-between">
              {/* Decorative background elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500 rounded-full blur-[100px] opacity-20 transform translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary-500 rounded-full blur-[100px] opacity-20 transform -translate-x-1/2 translate-y-1/2" />

              <div className="relative z-10">
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                  Informations de contact
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-12 max-w-sm">
                  Remplissez le formulaire et notre équipe vous répondra sous 24 heures. Vous pouvez aussi nous joindre directement via nos coordonnées.
                </p>

                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-primary-400 flex-shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Adresse</p>
                      <p className="text-base font-medium text-white mt-1">Cotonou, Bénin</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="mt-1 w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-primary-400 flex-shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Téléphone</p>
                      <a href="tel:+22997603805" className="text-base font-medium text-white hover:text-primary-400 transition mt-1 block">
                        +229 97 60 38 05
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="mt-1 w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-primary-400 flex-shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">E-mail</p>
                      <a href="mailto:contact@lafaaz.org" className="text-base font-medium text-white hover:text-primary-400 transition mt-1 block">
                        contact@lafaaz.org
                      </a>
                      <a href="mailto:info@lafaaz.org" className="text-sm font-medium text-slate-400 hover:text-primary-400 transition mt-0.5 block">
                        info@lafaaz.org
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="mt-1 w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-primary-400 flex-shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Horaires</p>
                      <p className="text-base font-medium text-white mt-1">Lundi – Vendredi : 8h00 – 17h00</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative circles */}
              <div className="relative z-10 mt-16 flex gap-4">
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-primary-500/50" />
                </div>
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-secondary-500/50" />
                </div>
              </div>
            </div>

            {/* Right Side: Contact Form */}
            <div className="w-full lg:w-3/5 p-10 sm:p-14 lg:p-16 bg-white relative">
              {success ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center space-y-6 min-h-[400px]"
                >
                  <div className="w-20 h-20 bg-emerald-50 border border-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Message envoyé !</h3>
                    <p className="text-slate-500 max-w-sm mx-auto leading-relaxed">
                      Merci de nous avoir contactés. Notre équipe étudiera votre message et vous répondra dans les plus brefs délais.
                    </p>
                  </div>
                  <button
                    onClick={() => setSuccess(false)}
                    className="mt-4 inline-flex items-center justify-center px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-full text-sm uppercase tracking-wider transition shadow-lg shadow-slate-900/20"
                  >
                    Envoyer un autre message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8 flex flex-col h-full justify-center">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-50 border border-red-100 text-red-600 px-5 py-4 rounded-2xl text-sm flex items-center gap-3"
                    >
                      <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                      <span className="font-medium">{error}</span>
                    </motion.div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-2.5">
                      <label className="block text-xs font-black text-slate-700 uppercase tracking-widest">Nom complet <span className="text-primary-600">*</span></label>
                      <input
                        required
                        type="text"
                        placeholder="Ex: Jean Dupont"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-transparent border-b-2 border-slate-300 text-slate-900 px-0 py-3 text-base placeholder:text-slate-400 focus:outline-none focus:border-primary-600 transition-colors font-medium rounded-none"
                      />
                    </div>

                    <div className="space-y-2.5">
                      <label className="block text-xs font-black text-slate-700 uppercase tracking-widest">Adresse e-mail <span className="text-primary-600">*</span></label>
                      <input
                        required
                        type="email"
                        placeholder="Ex: jean@exemple.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-transparent border-b-2 border-slate-300 text-slate-900 px-0 py-3 text-base placeholder:text-slate-400 focus:outline-none focus:border-primary-600 transition-colors font-medium rounded-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-widest">Sujet <span className="text-primary-600">*</span></label>
                    <input
                      required
                      type="text"
                      placeholder="Ex: Demande de partenariat"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-transparent border-b-2 border-slate-300 text-slate-900 px-0 py-3 text-base placeholder:text-slate-400 focus:outline-none focus:border-primary-600 transition-colors font-medium rounded-none"
                    />
                  </div>

                  <div className="space-y-2.5">
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-widest">Votre message <span className="text-primary-600">*</span></label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Dites-nous tout..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-2xl px-5 py-4 text-base placeholder:text-slate-400 focus:outline-none focus:ring-0 focus:border-primary-600 transition-colors resize-none font-medium mt-2"
                    />
                  </div>

                  <div className="pt-6 flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="group relative inline-flex items-center justify-center gap-3 bg-slate-900 hover:bg-primary-600 text-white font-bold px-10 py-4 rounded-full text-base transition-all duration-300 shadow-lg shadow-slate-900/20 hover:shadow-primary-600/30 disabled:opacity-60 overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                      <span className="relative z-10 flex items-center gap-2">
                        {loading ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Envoi en cours…
                          </>
                        ) : (
                          <>
                            Envoyer le message
                            <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
