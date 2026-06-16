import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import PageHero from '../components/ui/PageHero';
import api from '../services/api';
import StatsSection from '../components/sections/StatsSection';
import TimelineSection from '../components/sections/TimelineSection';
import TestimonialsSection from '../components/sections/TestimonialsSection';
import PartnersSection from '../components/sections/PartnersSection';
import { ShieldCheck, MapPin, BarChart3, Users, Leaf, Lightbulb, Heart, BookOpen, Star, Clock, Handshake, Quote, Target, Eye } from 'lucide-react';
import { useSeo } from '../hooks/useSeo';

const VALEURS = [
  { Icon: ShieldCheck,  titre: 'Intégrité',        texte: 'Chaque FCFA collecté est traçable. Nos comptes sont audités chaque année par un cabinet indépendant.' },
  { Icon: MapPin,       titre: 'Proximité',         texte: 'Nos équipes sont sur le terrain, au plus près des bénéficiaires. Nous connaissons leur réalité.' },
  { Icon: BarChart3,    titre: 'Impact mesurable',  texte: "Nous ne finançons que des projets dont l'impact est quantifiable et documenté." },
  { Icon: Users,        titre: 'Inclusion',         texte: 'Nos programmes ciblent prioritairement les populations les plus vulnérables et exclues.' },
  { Icon: Leaf,         titre: 'Durabilité',        texte: "Nos interventions visent l'autonomisation, pas la dépendance à l'aide extérieure." },
  { Icon: Lightbulb,    titre: 'Innovation',        texte: "Nous cherchons constamment de nouvelles façons d'amplifier notre impact avec des ressources limitées." },
];

const AXES_ICONS = [
  { Icon: Heart,      label: "Enfance indigente" },
  { Icon: BookOpen,   label: "Excellence scolaire" },
  { Icon: Star,       label: "Coaching jeunesse" },
  { Icon: Clock,      label: "Personnes âgées" },
  { Icon: Handshake,  label: "Coaching conjugal" },
];

// Organigramme des 4 organes officiels FAAZ
const ORGANES = [
  {
    sigle: 'AG',
    nom: 'Assemblée Générale',
    role: 'Organe suprême',
    detail: 'Session annuelle obligatoire avant la fin du 1ᵉʳ semestre. Valide les comptes, le plan d\'action et les grandes orientations.',
    level: 0,
  },
  {
    sigle: 'CA',
    nom: 'Conseil d\'Administration',
    role: '5 membres · Mandat 5 ans',
    detail: 'Administre la fondation entre les sessions de l\'AG. Valide les adhésions et supervise la direction exécutive.',
    level: 1,
  },
  {
    sigle: 'CS',
    nom: 'Comité de Suivi',
    role: '2 membres · Mandat 3 ans',
    detail: 'Contrôle interne de la gestion administrative, financière et technique de la fondation.',
    level: 1,
  },
  {
    sigle: 'DE',
    nom: 'Direction Exécutive',
    role: 'Chargé de Programmes',
    detail: 'Assure la gestion opérationnelle quotidienne, coordonne les projets terrain et représente la fondation auprès des partenaires.',
    level: 2,
  },
];

const EQUIPE = [
  { nom: 'Dr. Koffi Gnamey', role: 'Président de la fondation', image: '/img/president.png', initiales: 'KG' },
  { nom: 'Mme Sika Adjovi', role: 'Secrétaire Générale', image: '/img/secretaire.png', initiales: 'SA' },
  { nom: 'M. Bruno Soglo', role: 'Trésorier Général', image: '/img/tresorier.png', initiales: 'BS' },
  { nom: 'M. Damien Dossou', role: 'Directeur Exécutif', image: '/img/directeur.png', initiales: 'DD' },
];

export default function About() {
  useSeo({
    title: "Qui sommes-nous ?",
    description: "Découvrez l'histoire, la mission, la vision, les valeurs et les membres fondateurs de la Fondation FAAZ au Bénin."
  });
  const [team, setTeam] = useState(EQUIPE);

  const { data: cmsSettings = {} } = useQuery({
    queryKey: ['cms-settings'],
    queryFn: async () => {
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
        return map;
      } catch (err) {
        return {};
      }
    },
    staleTime: 1000 * 65 * 10
  });

  const slogan = cmsSettings.slogan || "Engageons notre amitié au service des personnes vulnérables et de l'humanité.";
  const mission = cmsSettings.mission || "Promouvoir le bien-être des personnes les plus vulnérables à travers des actions solidaires, structurées et à impact mesurable.";
  const vision = cmsSettings.vision || "Épanouissement durable de l'humanité, un Bénin où chaque personne vulnérable est accompagnée avec dignité.";
  const aboutText = cmsSettings.about_text || "Fondation béninoise à 21 membres actifs. Créée depuis le 11 octobre 2020 et enregistrée au ministère de l'intérieur le 19 février 2021 sous le numéro 2021/N°069/MISP/DC/SGM/DAIC/SAAP-ASSOC/SA, nous sommes engagées pour l'enfance indigente, l'excellence en milieu scolaire et le développement de la jeunesse.";


  useEffect(() => {
    async function fetchTeam() {
      try {
        const res = await api.get('/team/');
        const list = Array.isArray(res.data) 
          ? res.data 
          : (Array.isArray(res.data?.results) 
              ? res.data.results 
              : (res.data?.data || []));
        if (list && list.length > 0) {
          const sorted = [...list].sort((a, b) => (a.order || 0) - (b.order || 0));
          const mapped = sorted.map(m => {
            const first = m.first_name || '';
            const last = m.last_name || '';
            const initials = (first[0] || '') + (last[0] || '');
            
            // If the photo path starts with /media/, resolve it to absolute backend URL
            let photoUrl = m.photo || '';
            if (photoUrl && !photoUrl.startsWith('http')) {
              const apiBase = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace(/\/api$/, '');
              photoUrl = `${apiBase}${photoUrl}`;
            }

            return {
              nom: `${first} ${last}`.trim(),
              role: m.role || '',
              image: photoUrl,
              initiales: initials.toUpperCase() || 'KG'
            };
          });
          setTeam(mapped);
        }
      } catch (err) {
        console.warn("Using fallback team members", err);
      }
    }
    fetchTeam();
  }, []);

  return (
    <div className="bg-white">
      <PageHero
        title="À propos de la FAAZ"
        subtitle="Fondation les Amis de A à Z, ONG béninoise à 21 membres actifs, engagée depuis 2020 pour le bien-être des personnes les plus vulnérables."
        breadcrumbs={[{ label: 'Accueil', to: '/' }, { label: 'À propos' }]}
      />

      {/* ── Vision / Mission ── */}
      <section className="bg-slate-50 py-32 relative overflow-hidden">
        {/* Soft background glow accents */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-primary-100/50 via-emerald-50/20 to-transparent rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-secondary-100/50 via-sky-50/20 to-transparent rounded-full blur-[120px] pointer-events-none" />
        
        <div className="mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-20 relative z-10">
          
          {/* Section Header */}
          <div className="max-w-3xl mb-20">
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xs font-bold uppercase tracking-[0.2em] text-primary-600 block mb-5"
            >
              Notre identité
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl leading-[1.05] font-black text-slate-900 tracking-tight font-heading mb-8"
            >
              Engageons notre amitié<br />
              <span className="bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">au service des vulnérables et de l'humanité.</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-slate-600 text-lg leading-relaxed font-body whitespace-pre-line"
            >
              {aboutText}
            </motion.p>
          </div>
          
          {/* Bento Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            
            {/* Vision card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="rounded-3xl bg-white border border-slate-100 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 group relative overflow-hidden flex flex-col"
            >
              <div className="absolute -right-10 -top-10 text-emerald-500/5 group-hover:text-emerald-500/10 transition-colors duration-700 pointer-events-none">
                <Eye size={200} strokeWidth={1} />
              </div>
              <div className="relative z-10 flex-1">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 border border-emerald-100 shadow-sm group-hover:scale-110 transition-transform duration-500">
                  <Eye size={24} strokeWidth={2.5} />
                </div>
                <h3 className="font-extrabold text-xl text-slate-800 font-heading mb-3">Notre Vision</h3>
                <p className="text-base text-slate-500 leading-relaxed font-body">
                  {vision}
                </p>
              </div>
            </motion.div>
            
            {/* Mission card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="rounded-3xl bg-gradient-to-br from-primary-600 to-primary-700 text-white p-8 shadow-[0_12px_40px_-8px_rgba(22,163,74,0.3)] hover:-translate-y-2 hover:shadow-[0_20px_40px_-8px_rgba(22,163,74,0.4)] transition-all duration-500 relative overflow-hidden group flex flex-col"
            >
              <div className="absolute right-0 bottom-0 opacity-10 group-hover:scale-125 transition-transform duration-700 pointer-events-none origin-bottom-right">
                <Target size={150} strokeWidth={1} />
              </div>
              <div className="relative z-10 flex-1">
                <div className="w-12 h-12 rounded-xl bg-white/10 text-white flex items-center justify-center mb-6 border border-white/20 backdrop-blur-md shadow-sm group-hover:scale-110 transition-transform duration-500">
                  <Target size={24} strokeWidth={2.5} />
                </div>
                <h3 className="font-extrabold text-xl mb-3 font-heading">Notre Mission</h3>
                <p className="text-primary-50 text-base leading-relaxed font-body">
                  {mission}
                </p>
              </div>
            </motion.div>

            {/* Slogan card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="lg:col-span-2 rounded-3xl bg-white border border-slate-100 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 relative overflow-hidden group flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left"
            >
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-secondary-50 text-secondary-500 flex items-center justify-center border border-secondary-100 shadow-sm group-hover:rotate-12 transition-transform duration-500">
                <Quote size={28} strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="font-bold text-xs uppercase tracking-widest text-slate-400 font-body mb-2">Notre Slogan</h3>
                <p className="text-lg sm:text-xl text-slate-800 italic font-black leading-tight font-heading">
                  « {slogan} »
                </p>
                <p className="text-slate-500 mt-3 text-sm font-body">
                  Ce n'est pas un vœu pieux. Il traduit des actions concrètes, documentées, et chiffrées au quotidien.
                </p>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── 5 axes ── */}
      <section className="bg-[#0284c7] py-24 relative overflow-hidden">
        {/* Vague blanche en filigrane en arrière-plan */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg viewBox="0 0 1440 320" className="w-full h-full object-cover" preserveAspectRatio="none">
            <path fill="#fff" fillOpacity="1" d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
          </svg>
        </div>
        
        <div className="mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-20 relative z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-white/70 mb-4 block">Nos 5 axes d'intervention</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl leading-[1.1] font-extrabold text-white tracking-tight font-heading mb-10">Là où nous agissons</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {AXES_ICONS.map(({ Icon, label }) => (
              <div key={label} className="flex flex-col items-center text-center bg-white border border-slate-100 rounded-2xl p-6 shadow-md hover:shadow-2xl hover:border-secondary-200 hover:-translate-y-1.5 transition-all duration-500 group cursor-pointer">
                <div className="w-14 h-14 rounded-xl bg-secondary-50 border border-secondary-100/50 flex items-center justify-center mb-4 transition-all duration-500 group-hover:bg-secondary-600 group-hover:text-white group-hover:border-secondary-600">
                  <Icon size={22} className="text-secondary-600 transition-all duration-500 group-hover:text-white group-hover:scale-110" strokeWidth={2} />
                </div>
                <p className="font-bold text-slate-800 text-sm font-body tracking-tight leading-snug group-hover:text-secondary-600 transition-colors duration-300">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bandeau compteurs animés ── */}
      <StatsSection />

      {/* ── Organigramme ── */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-20">
          <span className="text-xs font-bold uppercase tracking-widest text-primary-600 mb-4 block">Gouvernance</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl leading-[1.1] font-extrabold text-slate-900 tracking-tight font-heading mb-12">Nos 4 organes</h2>

          {/* Schéma hiérarchique */}
          <div className="flex flex-col items-center gap-0">
            {/* AG — niveau 0 */}
            <div className="w-full max-w-sm">
              <div className="bg-gradient-to-br from-primary-600 to-secondary-600 text-white rounded-3xl p-6 text-center shadow-[0_12px_40px_-8px_rgba(22,197,94,0.25)] hover:-translate-y-1 hover:shadow-[0_16px_40px_-8px_rgba(22,197,94,0.35)] transition-all duration-500 ease-out cursor-pointer relative overflow-hidden group">
                {/* AG Watermark */}
                <div className="absolute -right-4 -bottom-4 text-white/10 font-extrabold text-8xl pointer-events-none group-hover:scale-110 transition-transform duration-500">AG</div>
                
                <p className="text-2xl font-extrabold mb-1 font-heading tracking-tight relative z-10">AG</p>
                <p className="font-bold text-sm mb-1 font-body relative z-10">{ORGANES[0].nom}</p>
                <p className="text-primary-100 text-xs font-medium relative z-10">{ORGANES[0].role}</p>
                <p className="text-white/80 text-xs mt-3 leading-relaxed font-body relative z-10">{ORGANES[0].detail}</p>
              </div>
            </div>

            {/* Ligne verticale */}
            <div className="w-0.5 h-10 bg-gradient-to-b from-primary-500 to-secondary-500" />

            {/* CA + CS — niveau 1 */}
            <div className="w-full flex flex-col lg:flex-row items-center lg:items-start justify-center gap-0 lg:gap-6 relative">
              {/* Ligne horizontale sur desktop */}
              <div className="hidden lg:block absolute w-72 h-0.5 bg-secondary-400" style={{ transform: 'translateY(36px)' }} />

              <div className="flex flex-col lg:flex-row gap-6 w-full max-w-3xl">
                {[ORGANES[1], ORGANES[2]].map(org => (
                  <div key={org.sigle} className="flex-1 flex flex-col items-center">
                    <div className="w-0.5 h-10 bg-secondary-400 lg:block hidden" />
                    <div className="bg-white/90 backdrop-blur-sm border border-slate-150 rounded-3xl p-6 text-center w-full shadow-[0_8px_30px_rgba(15,23,42,0.02)] hover:-translate-y-1 hover:border-primary-200 hover:shadow-lg transition-all duration-500 ease-out cursor-pointer relative overflow-hidden group">
                      {/* Watermark */}
                      <div className="absolute -right-4 -bottom-4 text-slate-100/50 font-extrabold text-7xl pointer-events-none group-hover:scale-110 transition-transform duration-500">{org.sigle}</div>
                      
                      <p className="text-xl font-extrabold text-primary-600 mb-1 font-heading tracking-tight relative z-10">{org.sigle}</p>
                      <p className="font-bold text-slate-800 text-sm mb-1 font-body relative z-10">{org.nom}</p>
                      <p className="text-secondary-500 text-xs font-semibold mb-3 font-body relative z-10">{org.role}</p>
                      <p className="text-slate-500 text-xs leading-relaxed font-body relative z-10">{org.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ligne verticale */}
            <div className="w-0.5 h-10 bg-secondary-400" />

            {/* DE — niveau 2 */}
            <div className="w-full max-w-sm">
              <div className="bg-slate-50/60 backdrop-blur-sm border border-slate-200 rounded-3xl p-6 text-center shadow-[0_8px_30px_rgba(15,23,42,0.02)] hover:-translate-y-1 hover:shadow-lg transition-all duration-500 ease-out cursor-pointer relative overflow-hidden group">
                {/* Watermark */}
                <div className="absolute -right-4 -bottom-4 text-slate-200/50 font-extrabold text-7xl pointer-events-none group-hover:scale-110 transition-transform duration-500">{ORGANES[3].sigle}</div>
                
                <p className="text-2xl font-extrabold text-slate-700 mb-1 font-heading tracking-tight relative z-10">DE</p>
                <p className="font-bold text-slate-800 text-sm mb-1 font-body relative z-10">{ORGANES[3].nom}</p>
                <p className="text-secondary-500 text-xs font-semibold mb-3 font-body relative z-10">{ORGANES[3].role}</p>
                <p className="text-slate-500 text-xs leading-relaxed font-body relative z-10">{ORGANES[3].detail}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Valeurs ── */}
      <section className="bg-gradient-to-b from-secondary-50/70 to-white py-24 border-t border-secondary-100/50">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-20">
          <span className="text-xs font-bold uppercase tracking-widest text-secondary-600 mb-4 block">Ce qui nous guide</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl leading-[1.1] font-extrabold text-slate-900 tracking-tight font-heading mb-10">Nos valeurs</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {VALEURS.map(({ Icon, titre, texte }) => (
              <div key={titre} className="bg-white border border-slate-100/80 rounded-3xl p-6 shadow-[0_8px_30px_rgba(15,23,42,0.02)] hover:shadow-xl hover:border-secondary-200 hover:-translate-y-1.5 transition-all duration-500 group">
                <div className="w-12 h-12 rounded-xl bg-secondary-50 border border-secondary-100 flex items-center justify-center mb-5 transition-all duration-500 group-hover:bg-secondary-600 group-hover:text-white group-hover:border-secondary-600 shadow-sm">
                  <Icon size={20} className="text-secondary-600 transition-all duration-500 group-hover:text-white group-hover:scale-110" strokeWidth={2} />
                </div>
                <h3 className="font-bold text-slate-800 mb-2 font-body text-base group-hover:text-secondary-600 transition-colors duration-300">{titre}</h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-body">{texte}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Équipe ── */}
      <section className="bg-gradient-to-br from-secondary-50/60 via-white to-secondary-100/40 py-24 border-y border-secondary-100 relative overflow-hidden">
        {/* Soft decorative background blurs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-secondary-200/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-primary-100/10 blur-3xl pointer-events-none" />
        
        <div className="mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-20 relative z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-secondary-600 mb-4 block">Les personnes derrière la fondation</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl leading-[1.1] font-extrabold text-slate-900 tracking-tight font-heading mb-10">Notre équipe</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map(m => (
              <div key={m.role} className="bg-white border border-slate-100/80 rounded-3xl p-3 shadow-[0_8px_30px_rgba(15,23,42,0.02)] hover:shadow-xl hover:border-secondary-200 hover:-translate-y-1.5 transition-all duration-500 group cursor-pointer relative overflow-hidden">
                {/* Cadre de photo */}
                <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden mb-4 bg-slate-50 border border-slate-100">
                  {m.image ? (
                    <img 
                      src={m.image} 
                      alt={m.nom} 
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    style={{ display: m.image ? 'none' : 'flex' }}
                    className="w-full h-full bg-gradient-to-br from-primary-500 to-secondary-500 items-center justify-center text-white font-extrabold text-2xl"
                  >
                    {m.initiales}
                  </div>
                  
                  {/* Overlay dégradé discret au survol */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                
                {/* Informations de profil */}
                <div className="px-3 pb-3">
                  <p className="font-bold text-slate-800 font-heading text-lg group-hover:text-secondary-600 transition-colors duration-300 leading-snug">
                    {m.nom}
                  </p>
                  <p className="text-xs font-semibold text-secondary-500 mt-1 uppercase tracking-wider font-body">
                    {m.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-slate-400 mt-6 italic font-body">Les profils détaillés seront disponibles prochainement.</p>
        </div>
      </section>

      {/* ── Frise chronologique ── */}
      <TimelineSection />

      <TestimonialsSection />
      <PartnersSection />
    </div>
  );
}
