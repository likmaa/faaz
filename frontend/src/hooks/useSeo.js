import { useEffect } from 'react';

export function useSeo({ title, description, keywords } = {}) {
  useEffect(() => {
    // Page Title
    if (title) {
      document.title = `${title} - Fondation FAAZ`;
    } else {
      document.title = "Fondation FAAZ - les Amis de A à Z";
    }

    // Description Meta
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute(
      'content',
      description || "Fondation les Amis de A à Z (FAAZ) — Aide à l'enfance indigente, excellence scolaire, coaching de la jeunesse au Bénin."
    );

    // Keywords Meta
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute(
      'content',
      keywords || "faaz, fondation faaz, ong benin, aides orphelins, dons benin, coaching jeunesse, excellence scolaire"
    );
  }, [title, description, keywords]);
}
