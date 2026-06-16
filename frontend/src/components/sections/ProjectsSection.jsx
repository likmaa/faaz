import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProjects } from '../../hooks/useProjects';
import { getImageUrl } from '../../utils/imageUrl';

function ProgressBar({ cible, collecte }) {
  const pct = Math.min(Math.round((collecte / cible) * 100), 100);
  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-white/60">{collecte.toLocaleString('fr-FR')} FCFA</span>
        <span className="font-bold text-white">{pct}%</span>
      </div>
      <div className="w-full bg-white/15 rounded-full h-1.5 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="h-1.5 rounded-full bg-primary-400"
        />
      </div>
      <p className="text-white/40 text-xs mt-1">Objectif : {cible.toLocaleString('fr-FR')} FCFA</p>
    </div>
  );
}

function ProjectCard({ proj }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      className="flex flex-col bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:border-secondary-400/40 hover:shadow-[0_0_30px_rgba(56,189,248,0.15)] transition-all duration-300 group h-full"
    >
      {/* Image */}
      <div className="h-48 overflow-hidden relative bg-secondary-900/40">
        {proj.image ? (
          <img
            src={getImageUrl(proj.image)}
            alt={proj.titre}
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/15">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
            </svg>
          </div>
        )}
        {/* Voile sombre gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c4a6e]/50 to-transparent pointer-events-none" />

        {/* Badge axe */}
        <span className="absolute top-3 left-3 text-xs font-semibold bg-black/45 backdrop-blur-md text-white px-2.5 py-1 rounded-full border border-white/15">
          {proj.axe}
        </span>
      </div>

      {/* Contenu */}
      <div className="flex flex-col gap-4 p-5 flex-1">
        <div className="flex-1">
          <h3 className="text-base font-bold text-white leading-snug mb-2 line-clamp-2">
            {proj.titre}
          </h3>
          <p className="text-white/60 text-xs leading-relaxed line-clamp-3">
            {proj.description}
          </p>
        </div>

        {/* Stats */}
        <div className="flex gap-4 text-xs border-t border-white/5 pt-3">
          {proj.beneficiaires && (
            <div>
              <p className="text-sm font-extrabold text-white">{proj.beneficiaires}</p>
              <p className="text-white/40">bénéficiaires</p>
            </div>
          )}
          {proj.nb_editions && (
            <div>
              <p className="text-sm font-extrabold text-white">{proj.nb_editions}</p>
              <p className="text-white/40">édition{proj.nb_editions > 1 ? 's' : ''}</p>
            </div>
          )}
          {proj.localisation && (
            <div className="flex items-start gap-1 ml-auto max-w-[120px]">
              <MapPin size={11} className="text-secondary-400 mt-0.5 flex-shrink-0" />
              <p className="text-white/40 text-[10px] leading-tight line-clamp-2">
                {proj.localisation.split(',')[0]}
              </p>
            </div>
          )}
        </div>

        {/* Jauge */}
        <ProgressBar cible={proj.montant_cible} collecte={proj.montant_collecte} />

        {/* CTA */}
        <div className="flex gap-2 pt-2 border-t border-white/5">
          <Link
            to={`/donate/project/${proj.id}`}
            className="flex-1 text-center py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-full font-bold text-xs transition duration-200"
          >
            Faire un don
          </Link>
          <Link
            to={`/projects/${proj.id}`}
            className="px-4 py-2.5 border border-white/20 text-white rounded-full text-xs hover:bg-white/10 transition duration-200"
          >
            Détails
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function ProjectsSection() {
  const { data: projects } = useProjects();
  const [activeFilter, setActiveFilter] = useState('tous');

  const actifs = projects?.filter(p => p.statut === 'actif' || p.statut === 'collecte') ?? [];
  if (!actifs.length) return null;

  // Filtrer par axe_slug
  const filteredProjects = activeFilter === 'tous'
    ? actifs
    : actifs.filter(p => p.axe_slug === activeFilter);

  const filters = [
    { name: 'Tous', slug: 'tous' },
    { name: 'Enfance', slug: 'enfance' },
    { name: 'Excellence Scolaire', slug: 'scolaire' },
    { name: 'Coaching Jeunesse', slug: 'jeunesse' }
  ];

  return (
    <section className="relative py-24 overflow-hidden" style={{ background: 'linear-gradient(160deg, #0c4a6e 0%, #0369a1 100%)' }}>
      {/* Séparateur courbe fluide depuis CausesSection (#0284c7) */}
      <div className="absolute top-0 left-0 right-0 h-10 pointer-events-none z-10 select-none">
        <svg viewBox="0 0 1440 40" fill="none" preserveAspectRatio="none" className="w-full h-full">
          <path d="M0 0 H 1440 V 40 C 1080 15, 360 15, 0 40 Z" fill="#0284c7" />
        </svg>
      </div>

      <div className="mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-20">

        {/* Header de section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-secondary-300 block mb-4">
              Projets actifs
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl leading-[1.1] font-extrabold text-white tracking-tight font-heading">
              Soutenez nos actions<br />en cours de terrain.
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {filters.map((f) => (
              <button
                key={f.slug}
                onClick={() => setActiveFilter(f.slug)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition duration-200 border ${activeFilter === f.slug
                  ? 'bg-white text-secondary-900 border-white shadow-lg'
                  : 'bg-white/10 text-white/80 border-white/10 hover:bg-white/20'
                  }`}
              >
                {f.name}
              </button>
            ))}
            <Link
              to="/projects"
              className="ml-2 text-xs font-semibold text-white/60 hover:text-white underline underline-offset-4 transition"
            >
              Voir tous les projets
            </Link>
          </div>
        </div>

        {/* Grille de projets avec AnimatePresence pour le filtrage */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((proj) => (
              <motion.div
                key={proj.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <ProjectCard proj={proj} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* État vide si aucun projet ne correspond */}
        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-white/5 border border-white/10 rounded-2xl"
          >
            <p className="text-white/60 text-sm">Aucun projet actif dans cette catégorie pour le moment.</p>
          </motion.div>
        )}

      </div>
    </section>
  );
}
