import React from 'react';
import { Link } from 'react-router-dom';
import { useNews } from '../../hooks/useNews';
import { motion } from 'framer-motion';
import SectionHeader from '../ui/SectionHeader';
import { ArrowRight, Calendar, Tag } from 'lucide-react';
import { getImageUrl } from '../../utils/imageUrl';

const CATEGORIE_COLORS = {
  'Éducation':       'bg-blue-50 text-blue-700',
  'Santé':           'bg-green-50 text-green-700',
  'Vie associative': 'bg-purple-50 text-purple-700',
  'Urgence':         'bg-red-50 text-red-700',
  'Partenariats':    'bg-yellow-50 text-yellow-700',
};

const formatDate = (d) => {
  if (!d) return '';
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
};

export default function NewsSection() {
  const { data: articles, isLoading } = useNews();

  // On ne prend que les 3 derniers articles
  const recentArticles = articles?.slice(0, 3) || [];

  if (isLoading) return null;
  if (recentArticles.length === 0) return null;

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-primary-50/30 rounded-full blur-3xl pointer-events-none" />
      
      <div className="mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-20 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <SectionHeader
            title="Dernières actualités"
            subtitle="Découvrez nos récentes interventions, récits et événements sur le terrain."
            align="left"
            className="mb-0 flex-1"
          />
          <Link
            to="/news"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-bold text-sm transition-all duration-300 group flex-shrink-0 self-start md:self-end"
          >
            Voir toute l'actualité
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {recentArticles.map((article, idx) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group bg-white border border-slate-100/80 rounded-3xl overflow-hidden shadow-[0_8px_30px_rgba(15,23,42,0.02)] hover:shadow-2xl hover:border-primary-100 transition-all duration-500 flex flex-col"
            >
              {/* Image de couverture */}
              <div className="aspect-video w-full bg-slate-50 overflow-hidden relative border-b border-slate-100">
                {article.image ? (
                  <img
                    src={getImageUrl(article.image)}
                    alt={article.titre}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary-500 to-secondary-500" />
                )}
                {article.categorie && (
                  <span className={`absolute top-4 left-4 text-[10px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm ${CATEGORIE_COLORS[article.categorie] || 'bg-slate-900 text-white'}`}>
                    {article.categorie}
                  </span>
                )}
              </div>

              {/* Contenu */}
              <div className="p-6 flex flex-col flex-grow space-y-4">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{formatDate(article.date || article.created_at)}</span>
                </div>

                <div className="space-y-2 flex-grow">
                  <h3 className="font-bold text-slate-800 text-lg group-hover:text-primary-600 transition-colors line-clamp-2 leading-snug">
                    {article.titre}
                  </h3>
                  <p className="text-slate-500 text-xs sm:text-sm leading-relaxed line-clamp-3">
                    {article.contenu}
                  </p>
                </div>

                <div className="pt-2">
                  <Link
                    to={`/news/${article.id}`}
                    className="inline-flex items-center gap-1.5 text-primary-600 font-bold text-xs group-hover:underline"
                  >
                    <span>Lire l'article</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
