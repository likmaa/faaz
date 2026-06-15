import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useNewsItem } from '../hooks/useNews';
import PageHero from '../components/ui/PageHero';
import Loading from '../components/ui/Loading';
import { useSeo } from '../hooks/useSeo';

const formatDate = (d) =>
  new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

const CATEGORIE_COLORS = {
  'Éducation':       'bg-blue-50 text-blue-700',
  'Santé':           'bg-green-50 text-green-700',
  'Vie associative': 'bg-purple-50 text-purple-700',
  'Urgence':         'bg-red-50 text-red-700',
  'Partenariats':    'bg-yellow-50 text-yellow-700',
};

export default function NewsDetail() {
  const { id } = useParams();
  const { data: article, isLoading, error } = useNewsItem(id);

  useSeo({
    title: article?.titre || "Chargement de l'actualité...",
    description: article?.contenu || "Détails de l'article d'actualité de la Fondation FAAZ.",
    image: article ? getImageUrl(article.image) : undefined
  });

  if (isLoading) return <Loading text="Chargement de l'article…" />;
  if (error) return (
    <div className="text-center py-20">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Article introuvable</h2>
      <Link to="/news" className="text-primary-600 text-sm">← Retour aux actualités</Link>
    </div>
  );

  return (
    <div>
      <PageHero
        title={article.titre}
        tag={article.categorie}
        breadcrumbs={[{ label: 'Accueil', to: '/' }, { label: 'Actualités', to: '/news' }, { label: article.titre }]}
      />

      <div className="mx-auto max-w-3xl px-6 sm:px-10 py-12">
        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          {article.categorie && (
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${CATEGORIE_COLORS[article.categorie] || 'bg-gray-100 text-gray-600'}`}>
              {article.categorie}
            </span>
          )}
          {article.created_at && <span className="text-sm text-gray-400">{formatDate(article.created_at)}</span>}
          {article.auteur && <span className="text-sm text-gray-500">Par <strong>{article.auteur}</strong></span>}
        </div>

        {/* Image */}
        {article.image && (
          <div className="aspect-video rounded-2xl overflow-hidden bg-gray-100 mb-10">
            <img src={getImageUrl(article.image)} alt={article.titre} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Contenu */}
        <div className="text-gray-700 leading-relaxed whitespace-pre-line text-base mb-12">
          {article.contenu}
        </div>

        {/* Nav prev / next */}
        {(article.previous || article.next) && (
          <div className="flex items-center justify-between py-8 border-t border-b border-gray-100 mb-12 gap-4">
            {article.previous ? (
              <Link to={`/news/${article.previous.id}`} className="flex items-center gap-2 text-primary-600 hover:text-primary-700 group max-w-xs">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 19l-7-7 7-7"/></svg>
                <div>
                  <div className="text-xs text-gray-400 mb-0.5">Article précédent</div>
                  <div className="text-sm font-medium line-clamp-1 group-hover:underline">{article.previous.titre}</div>
                </div>
              </Link>
            ) : <div />}
            {article.next ? (
              <Link to={`/news/${article.next.id}`} className="flex items-center gap-2 text-primary-600 hover:text-primary-700 group max-w-xs text-right ml-auto">
                <div>
                  <div className="text-xs text-gray-400 mb-0.5">Article suivant</div>
                  <div className="text-sm font-medium line-clamp-1 group-hover:underline">{article.next.titre}</div>
                </div>
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5l7 7-7 7"/></svg>
              </Link>
            ) : <div />}
          </div>
        )}

        <Link to="/news" className="inline-flex items-center gap-2 text-primary-600 text-sm font-semibold hover:underline">
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M15 19l-7-7 7-7"/></svg>
          Toutes les actualités
        </Link>
      </div>
    </div>
  );
}
