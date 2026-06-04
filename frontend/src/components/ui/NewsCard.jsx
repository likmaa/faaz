import React from 'react';
import Card from './Card';
import { Link } from 'react-router-dom';

export default function NewsCard({ news }) {
  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card>
      <Card.Image src={news.image || news.photo} alt={news.titre || news.title} />
      <Card.Body>
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
          <span>{formatDate(news.created_at)}</span>
          {news.categorie && (
            <>
              <span>•</span>
              <span className="text-primary-600">{news.categorie}</span>
            </>
          )}
        </div>
        <Card.Title>{news.titre || news.title || 'Actualité sans titre'}</Card.Title>
        <Card.Text lines={3}>
          {news.contenu || news.body || news.description || 'Aucun contenu disponible.'}
        </Card.Text>
      </Card.Body>
      <Card.Footer>
        <Link
          to={`/news/${news.id}`}
          className="text-sm text-primary-600 hover:text-primary-700 font-medium inline-flex items-center gap-1"
        >
          Lire l'article
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </Card.Footer>
    </Card>
  );
}
