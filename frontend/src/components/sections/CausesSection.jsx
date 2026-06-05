import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, GraduationCap, Users, Clock, Handshake } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';

// Icônes Lucide par cause — style professionnel, cohérent
const CAUSE_ICONS = {
  enfance:  Heart,
  scolaire: GraduationCap,
  jeunesse: Users,
  ages:     Clock,
  conjugal: Handshake,
};

// Causes officielles FAAZ — ordre : actives en premier, perspectives en dernier
export const CAUSES = [
  {
    slug: 'enfance',
    title: "Aide à l'enfance indigente",
    description: "Scolarisation, alimentation, santé, vêtements et activités ludiques pour les orphelins. 4 projets actifs, 4 orphelinats partenaires, plus de 500 bénéficiaires depuis 2020.",
    statut: 'actif',
    chiffre: '500+',
    libelle_chiffre: 'bénéficiaires',
    to: '/projects?axe=enfance'
  },
  {
    slug: 'scolaire',
    title: "Excellence en milieu scolaire",
    description: "Le Prix Gnamey de l'Excellence récompense chaque année les meilleurs élèves du Bénin (CEP, BEPC, BAC), de Cotonou à Athiémé, Savalou et Kpomassè. 6 éditions, des dizaines de lauréats.",
    statut: 'actif',
    chiffre: '6',
    libelle_chiffre: 'éditions du Prix Gnamey',
    to: '/projects?axe=scolaire'
  },
  {
    slug: 'jeunesse',
    title: "Coaching de la jeunesse & leadership",
    description: "Programme de coaching transformationnel pour les jeunes : compétences de vie, orientation professionnelle, santé mentale, entrepreneuriat. Phase 1 réalisée (28 jeunes). Phase 2 en préparation.",
    statut: 'actif',
    chiffre: '28',
    libelle_chiffre: 'jeunes coachés (Phase 1)',
    to: '/projects?axe=jeunesse'
  },
  {
    slug: 'ages',
    title: "Assistance aux personnes du 3ᵉ âge",
    description: "Réduire l'isolement, améliorer la qualité de vie et apporter un soutien émotionnel aux personnes âgées. Ce programme est en cours de lancement — rejoignez-nous pour en faire une réalité.",
    statut: 'bientot',
    chiffre: null,
    libelle_chiffre: null,
    to: '/projects?axe=ages'
  },
  {
    slug: 'conjugal',
    title: "Coaching conjugal",
    description: "Communication de couple, gestion harmonieuse des conflits, épanouissement mutuel. Un programme en perspective pour renforcer les liens familiaux au sein de la communauté.",
    statut: 'bientot',
    chiffre: null,
    libelle_chiffre: null,
    to: '/projects?axe=conjugal'
  },
];

export default function CausesSection() {
  const { data: backendAxes = [] } = useQuery({
    queryKey: ['backend-axes'],
    queryFn: async () => {
      try {
        const res = await api.get('/axes/');
        return Array.isArray(res.data) ? res.data : [];
      } catch (err) {
        console.warn("Erreur lors de la récupération des axes depuis le backend", err);
        return [];
      }
    },
    staleTime: 1000 * 60 * 5 // 5 minutes
  });

  const dynamicCauses = CAUSES.map(cause => {
    // Trouver l'axe correspondant dans la base de données par titre
    const matchedAxe = backendAxes.find(axe => {
      const bName = axe.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      const cTitle = cause.title.toLowerCase().replace(/[^a-z0-9]/g, '');
      return bName === cTitle || bName.includes(cTitle) || cTitle.includes(bName);
    });

    if (matchedAxe) {
      // Dans le backend: status 'actif' ou 'a_venir'
      // Dans CAUSES: statut 'actif' ou 'bientot'
      const mappedStatut = matchedAxe.status === 'actif' ? 'actif' : 'bientot';
      return {
        ...cause,
        statut: mappedStatut
      };
    }
    return cause;
  });

  return (
    <section className="py-24 bg-[#0284c7]">
      <div className="mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-20">

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Carte éditoriale gauche */}
          <div className="lg:col-span-2 bg-gradient-to-br from-[#0c4a6e] to-[#0284c7] rounded-3xl p-8 md:p-10 text-white flex flex-col justify-between relative overflow-hidden shadow-xl min-h-[380px] lg:min-h-auto">
            <div className="absolute bottom-0 left-0 right-0 opacity-10 pointer-events-none">
              <svg viewBox="0 0 1440 320" className="w-full h-auto" preserveAspectRatio="none">
                <path fill="#fff" fillOpacity="1" d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
              </svg>
            </div>
            <div className="relative z-10">
              <span className="text-xs font-bold uppercase tracking-widest text-white/60 block mb-4">Nos causes</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl leading-[1.1] font-extrabold text-white tracking-tight font-heading mb-6">
                5 domaines,<br />une seule mission.
              </h2>
            </div>
            <div className="relative z-10 mt-auto">
              <p className="text-white/80 text-sm sm:text-base leading-relaxed font-body mb-6">
                « Engageons notre amitié au service des personnes vulnérables et de l'humanité. »
              </p>
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 bg-white text-[#0284c7] font-bold px-5 py-3 rounded-full text-sm hover:bg-blue-50 transition"
              >
                Voir tous les projets
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            </div>
          </div>

          {/* Grille 5 causes */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {dynamicCauses.map((cause, idx) => {
              const Icon = CAUSE_ICONS[cause.slug];
              return (
                <div
                  key={cause.slug}
                  className={`bg-white rounded-3xl p-5 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group relative ${
                    idx < 3 ? 'lg:col-span-2' : 'lg:col-span-3'
                  } ${cause.statut === 'bientot' ? 'opacity-80' : ''}`}
                >
                  {/* Badge bientôt */}
                  {cause.statut === 'bientot' && (
                    <span className="absolute top-4 right-4 text-xs font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200">
                      Bientôt
                    </span>
                  )}

                  <div>
                    {/* Icône Lucide */}
                    <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center mb-3">
                      <Icon size={20} className="text-primary-600" strokeWidth={1.75} />
                    </div>
                    <h3 className="text-base font-bold text-slate-800 mb-2 group-hover:text-primary-600 transition-colors leading-snug">
                      {cause.title}
                    </h3>
                    <p className="text-slate-500 leading-relaxed text-xs mb-4 line-clamp-3">
                      {cause.description}
                    </p>
                  </div>

                  <div className="mt-auto">
                    {cause.chiffre && (
                      <div className="mb-3">
                        <span className="text-xl font-extrabold text-primary-600">{cause.chiffre}</span>
                        <span className="text-xs text-slate-400 ml-1">{cause.libelle_chiffre}</span>
                      </div>
                    )}
                    <Link
                      to={cause.to}
                      className="block bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold px-4 py-2.5 rounded-full transition-all duration-200 hover:scale-[1.02] active:scale-95 text-center"
                    >
                      {cause.statut === 'bientot' ? 'Soutenir le lancement' : 'Découvrir'}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
