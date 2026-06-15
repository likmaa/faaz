import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../components/ui/PageHero';
import { useNews } from '../hooks/useNews';
import Loading from '../components/ui/Loading';
import { newsService } from '../services/newsService';
import Pagination from '../components/ui/Pagination';
import { useSeo } from '../hooks/useSeo';
import { getImageUrl } from '../utils/imageUrl';

const formatDate = (d) =>
  new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

const CATEGORIE_COLORS = {
  'Éducation':       'bg-blue-50 text-blue-700',
  'Santé':           'bg-green-50 text-green-700',
  'Vie associative': 'bg-purple-50 text-purple-700',
  'Urgence':         'bg-red-50 text-red-700',
  'Partenariats':    'bg-yellow-50 text-yellow-700',
};

export default function News() {
  useSeo({
    title: "Actualités",
    description: "Restez informé des dernières actualités, activités et événements de la Fondation FAAZ au Bénin."
  });
  const [categorie, setCategorie] = useState('toutes');
  const [page, setPage] = useState(1);
  const { data: articles, isLoading } = useNews({ categorie });
  const categories = newsService.getCategories();

  const featured = articles?.[0];
  const rest = articles?.slice(1) ?? [];

  useEffect(() => {
    setPage(1);
  }, [categorie]);

  const displayArticles = (categorie === 'toutes' ? rest : articles) ?? [];
  const articlesPerPage = 6;
  const totalPages = Math.ceil(displayArticles.length / articlesPerPage);
  const paginatedArticles = displayArticles.slice((page - 1) * articlesPerPage, page * articlesPerPage);

  return (
    <div>
      <PageHero
        title="Actualités"
        subtitle="Suivez nos actions, nos événements et les avancées de nos projets sur le terrain."
        breadcrumbs={[{ label: 'Accueil', to: '/' }, { label: 'Actualités' }]}
      />

      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-20 py-12">
        {/* Filtres */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategorie(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold capitalize transition-all border ${
                categorie === cat
                  ? 'bg-primary-600 text-white border-primary-600 shadow-md'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300 hover:text-primary-600'
              }`}
            >
              {cat === 'toutes' ? 'Toutes' : cat}
            </button>
          ))}
        </div>

        {isLoading ? (
          <Loading text="Chargement des actualités…" />
        ) : (
          <>
            {/* Article à la une */}
            {featured && categorie === 'toutes' && (
              <Link to={`/news/${featured.id}`} className="group block mb-10">
                <div className="grid lg:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-shadow">
                  <div className="aspect-video lg:aspect-auto bg-gray-100 overflow-hidden">
                    {featured.image
                      ? <img src={getImageUrl(featured.image)} alt={featured.titre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      : <div className="w-full h-full bg-gradient-to-br from-primary-100 to-secondary-100" />
                    }
                  </div>
                  <div className="p-8 lg:p-10 bg-white flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-4">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${CATEGORIE_COLORS[featured.categorie] || 'bg-gray-100 text-gray-600'}`}>
                        {featured.categorie}
                      </span>
                      <span className="text-xs text-gray-400">{formatDate(featured.created_at)}</span>
                    </div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 group-hover:text-primary-600 transition-colors leading-tight">
                      {featured.titre}
                    </h2>
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-6">
                      {featured.contenu}
                    </p>
                    <span className="inline-flex items-center gap-1 text-primary-600 font-semibold text-sm">
                      Lire l'article
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </span>
                  </div>
                </div>
              </Link>
            )}

            {/* Grille articles */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedArticles.map(a => (
                <Link key={a.id} to={`/news/${a.id}`} className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow overflow-hidden flex flex-col">
                  <div className="aspect-video bg-gray-100 overflow-hidden">
                    {a.image
                      ? <img src={getImageUrl(a.image)} alt={a.titre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      : <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" />
                    }
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${CATEGORIE_COLORS[a.categorie] || 'bg-gray-100 text-gray-600'}`}>{a.categorie}</span>
                      <span className="text-xs text-gray-400">{formatDate(a.created_at)}</span>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 leading-snug group-hover:text-primary-600 transition-colors">{a.titre}</h3>
                    <p className="text-sm text-gray-500 line-clamp-3 flex-1 mb-4">{a.contenu}</p>
                    <span className="inline-flex items-center gap-1 text-primary-600 font-semibold text-xs mt-auto">
                      Lire l'article →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
}
