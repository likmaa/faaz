/**
 * Résout une URL d'image pour l'affichage dans l'admin.
 *
 * Les images peuvent être :
 * - Chemins relatifs du site public (/img/..., /video/...)  → préfixés avec VITE_PUBLIC_URL
 * - URLs de médias uploadés du backend (/media/...)          → préfixés avec VITE_API_URL (sans /api)
 * - URLs absolues (http/https)                               → utilisées telles quelles
 */

const PUBLIC_URL = import.meta.env.VITE_PUBLIC_URL || 'http://localhost:3000';
const API_BASE   = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace(/\/api$/, '');

export function getImageUrl(path) {
  if (!path) return null;

  // URL absolue → on ne touche pas
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // Fichier média uploadé via le backend Django (/media/...)
  if (path.startsWith('/media/')) {
    return `${API_BASE}${path}`;
  }

  // Chemin d'asset statique du site public (/img/, /video/, /favicon, etc.)
  return `${PUBLIC_URL}${path}`;
}

/**
 * Retourne les initiales d'un nom pour les avatars de fallback.
 */
export function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('');
}
