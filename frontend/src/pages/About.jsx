import React from 'react';
import PageHero from '../components/ui/PageHero';
import StatsSection from '../components/sections/StatsSection';
import TimelineSection from '../components/sections/TimelineSection';
import TestimonialsSection from '../components/sections/TestimonialsSection';
import PartnersSection from '../components/sections/PartnersSection';
import { ShieldCheck, MapPin, BarChart3, Users, Leaf, Lightbulb, Heart, BookOpen, Star, Clock, Handshake, Quote } from 'lucide-react';

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
  { nom: 'Dr. Koffi Gnamey', role: 'Président de la fondation', image: '/assets/img/president.png', initiales: 'KG' },
  { nom: 'Mme Sika Adjovi', role: 'Secrétaire Générale', image: '/assets/img/secretaire.png', initiales: 'SA' },
  { nom: 'M. Bruno Soglo', role: 'Trésorier Général', image: '/assets/img/tresorier.png', initiales: 'BS' },
  { nom: 'M. Damien Dossou', role: 'Directeur Exécutif', image: '/assets/img/directeur.png', initiales: 'DD' },
];

export default function About() {
  return (
    <div className="bg-white">
      <PageHero
        title="À propos de la FAAZ"
        subtitle="Fondation les Amis de A à Z — ONG béninoise à membres, engagée depuis 2020 pour le bien-être des personnes les plus vulnérables."
        breadcrumbs={[{ label: 'Accueil', to: '/' }, { label: 'À propos' }]}
      />

      {/* ── Vision / Mission ── */}
      <section className="bg-white py-24 relative overflow-hidden">
        {/* Soft background glow accents */}
        <div className="absolute top-1/4 left-10 w-96 h-96 rounded-full bg-emerald-50/40 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 rounded-full bg-sky-50/40 blur-3xl pointer-events-none" />
        
        <div className="mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-primary-600 mb-4 block">Notre identité</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl leading-[1.1] font-extrabold text-slate-900 tracking-tight font-heading mb-6">
                Engageons notre amitié<br />
                <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">au service des vulnérables.</span>
              </h2>
              <p className="text-slate-500 text-sm sm:text-base leading-relaxed mb-4 font-body">
                La FAAZ — Fondation les Amis de A à Z — est une ONG béninoise à membres fondée sur un engagement simple : promouvoir le bien-être des personnes les plus vulnérables. Orphelins, élèves méritants, jeunes en quête de repères, personnes âgées isolées : chaque action de la FAAZ part d'une conviction, celle que l'amitié peut changer des vies.
              </p>
              <p className="text-slate-500 text-sm sm:text-base leading-relaxed font-body">
                Notre slogan — « Engageons notre amitié au service des personnes vulnérables et de l'humanité » — n'est pas un vœu pieux. Il traduit 6 ans d'actions concrètes, documentées, et chiffrées.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Vision card */}
              <div className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50/20 to-white p-6 shadow-[0_8px_30px_rgba(22,163,74,0.02)] hover:shadow-[0_12px_30px_rgba(22,163,74,0.06)] hover:border-emerald-200 transition-all duration-500">
                <h3 className="font-bold text-base mb-2 text-slate-800 font-body">Vision</h3>
                <p className="text-sm text-slate-500 leading-relaxed font-body">
                  Épanouissement durable de l'humanité — un Bénin où chaque personne vulnérable est accompagnée avec dignité.
                </p>
              </div>
              
              {/* Mission card */}
              <div className="rounded-3xl border border-sky-100 bg-gradient-to-br from-sky-50/20 to-white p-6 shadow-[0_8px_30px_rgba(2,132,199,0.02)] hover:shadow-[0_12px_30px_rgba(2,132,199,0.06)] hover:border-sky-200 transition-all duration-500">
                <h3 className="font-bold text-base mb-2 text-slate-800 font-body">Mission</h3>
                <p className="text-sm text-slate-500 leading-relaxed font-body">
                  Promouvoir le bien-être des personnes les plus vulnérables à travers des actions solidaires, structurées et à impact mesurable.
                </p>
              </div>

              {/* Slogan card */}
              <div className="sm:col-span-2 rounded-3xl border border-slate-100/80 bg-gradient-to-r from-primary-50/40 to-secondary-50/40 p-6 shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-500">
                {/* Giant quote watermark */}
                <Quote size={90} className="absolute right-4 bottom-[-15px] text-primary-200/20 stroke-[1] pointer-events-none group-hover:scale-110 group-hover:text-primary-300/20 transition-all duration-500" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-2 font-body">Slogan</h3>
                <p className="text-sm sm:text-base text-secondary-700 italic font-bold leading-relaxed font-body relative z-10">
                  « Engageons notre amitié au service des personnes vulnérables et de l'humanité. »
                </p>
              </div>
            </div>
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
            {EQUIPE.map(m => (
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
