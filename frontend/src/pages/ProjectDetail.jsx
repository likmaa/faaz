import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProject, useRelatedProjects } from '../hooks/useProjects';
import PageHero from '../components/ui/PageHero';
import Loading from '../components/ui/Loading';
import { useSeo } from '../hooks/useSeo';
import { getImageUrl } from '../utils/imageUrl';

function ProgressBar({ cible, collecte }) {
  const pct = Math.min(Math.round((collecte / cible) * 100), 100);
  return (
    <div>
      <div className="flex justify-between items-center text-xs mb-2">
        <span className="text-slate-500 font-medium font-body">Collecté : <span className="text-slate-800 font-bold">{collecte.toLocaleString('fr-FR')} FCFA</span></span>
        <span className="font-bold text-secondary-600 bg-secondary-50 px-2 py-0.5 rounded-md">{pct}%</span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
        <div className="h-full rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-700 ease-out" style={{ width: `${pct}%` }} />
      </div>
      <div className="flex justify-between items-center mt-2 text-[11px] text-slate-400 font-body">
        <span>Objectif : {cible.toLocaleString('fr-FR')} FCFA</span>
        {cible - collecte > 0 ? (
          <span>Reste : {(cible - collecte).toLocaleString('fr-FR')} FCFA</span>
        ) : (
          <span className="text-primary-600 font-semibold">Objectif atteint !</span>
        )}
      </div>
    </div>
  );
}

export default function ProjectDetail() {
  const { id } = useParams();
  const { data: project, isLoading, error } = useProject(id);
  const { data: related } = useRelatedProjects(id);

  useSeo({
    title: project?.titre || "Chargement du projet...",
    description: project?.description || "Détails du projet soutenu par la Fondation FAAZ."
  });

  if (isLoading) return <Loading text="Chargement du projet…" />;
  if (error) return (
    <div className="text-center py-20 bg-slate-50/30 min-h-screen flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold text-slate-900 font-heading mb-4">Projet introuvable</h2>
      <Link to="/projects" className="bg-primary-600 hover:bg-primary-700 text-white font-bold px-6 py-3 rounded-full text-sm transition">
        ← Retour aux projets
      </Link>
    </div>
  );

  return (
    <div className="bg-slate-50/30 min-h-screen">
      <PageHero
        title={project.titre}
        tag={project.axe}
        breadcrumbs={[{ label: 'Accueil', to: '/' }, { label: 'Nos projets', to: '/projects' }, { label: project.titre }]}
      />

      <div className="mx-auto max-w-[1200px] px-6 sm:px-10 lg:px-20 py-16">
        <div className="grid lg:grid-cols-3 gap-10">
          
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-8">
            {project.image && (
              <div className="aspect-[16/9] md:aspect-[21/10] w-full rounded-3xl overflow-hidden shadow-md border border-slate-100 bg-slate-50">
                <img src={getImageUrl(project.image)} alt={project.titre} className="w-full h-full object-cover" />
              </div>
            )}
            
            <div className="flex flex-wrap gap-3 items-center">
              {project.localisation && (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 bg-white border border-slate-150 px-3.5 py-1.5 rounded-full shadow-sm">
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="text-secondary-500"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  {project.localisation}
                </span>
              )}
              <span className={`text-xs font-extrabold uppercase tracking-widest px-3.5 py-1.5 rounded-full shadow-sm ${
                project.statut === 'actif' || project.statut === 'collecte'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                  : 'bg-slate-100 text-slate-600 border border-slate-200'
              }`}>
                {project.statut === 'actif' || project.statut === 'collecte' ? 'En cours' : 'Terminé'}
              </span>
            </div>
            
            <div className="bg-white border border-slate-100/80 rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgba(15,23,42,0.02)]">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 font-heading mb-5">À propos du projet</h2>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base font-body whitespace-pre-line">{project.description}</p>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="bg-white border border-slate-100/80 rounded-3xl shadow-[0_8px_30px_rgba(15,23,42,0.02)] p-6 md:p-8 sticky top-24">
              <h3 className="font-extrabold font-heading text-slate-800 text-lg mb-5 pb-3 border-b border-slate-100">Financement</h3>
              <ProgressBar cible={project.montant_cible} collecte={project.montant_collecte} />
              
              <div className="mt-8 space-y-3">
                <Link 
                  to={`/donate/project/${project.id}`} 
                  className="block w-full text-center py-3.5 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-full font-bold shadow-md hover:shadow-lg transition-all duration-300 active:scale-98"
                >
                  Soutenir ce projet
                </Link>
                <Link 
                  to="/projects" 
                  className="block w-full text-center py-3 border border-slate-200 text-slate-600 hover:text-primary-600 hover:border-primary-600 rounded-full text-sm font-bold transition-all duration-300 hover:bg-primary-50/10"
                >
                  Voir tous les projets
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Projets similaires */}
        {related?.length > 0 && (
          <div className="mt-20 pt-12 border-t border-slate-100">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 font-heading mb-8">Autres projets</h2>
            <div className="grid sm:grid-cols-3 gap-6">
              {related.slice(0, 3).map(p => (
                <Link 
                  key={p.id} 
                  to={`/projects/${p.id}`} 
                  className="group bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-[0_8px_30px_rgba(15,23,42,0.02)] hover:shadow-xl hover:border-primary-100/80 hover:-translate-y-1 transition-all duration-500 ease-out flex flex-col"
                >
                  {p.image && (
                    <div className="aspect-[16/10] bg-slate-50 overflow-hidden border-b border-slate-100">
                      <img src={getImageUrl(p.image)} alt={p.titre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                    </div>
                  )}
                  <div className="p-5 flex flex-col flex-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-secondary-500 mb-1.5">{p.axe}</span>
                    <h3 className="font-bold text-slate-800 text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-primary-600 transition-colors duration-300">{p.titre}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
