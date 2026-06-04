import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="text-center py-24">
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <p className="text-gray-600 mb-6">Page introuvable.</p>
      <Link className="text-primary-600 hover:underline" to="/">Retour à l'accueil</Link>
    </div>
  );
}
