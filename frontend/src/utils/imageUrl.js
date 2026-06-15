/**
 * Résout une URL d'image pour l'affichage sur le site public.
 *
 * Les images peuvent être :
 * - Chemins relatifs du site public (/img/..., /video/...)  → préfixés avec VITE_PUBLIC_URL
 * - URLs de médias uploadés du backend (/media/...)          → préfixés avec VITE_API_URL (sans /api)
 * - URLs absolues (http/https)                               → utilisées telles quelles
 */

const PUBLIC_URL = import.meta.env.VITE_PUBLIC_URL || '';
const API_BASE   = (import.meta.env.VITE_API_URL || 'https://api.lafaaz.org/api').replace(/\/api\/?$/, '');

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
