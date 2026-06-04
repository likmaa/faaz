import React, { useState } from 'react';
import PageHero from '../components/ui/PageHero';
import { useFaq } from '../hooks/useFaq';
import Loading from '../components/ui/Loading';
import { faqService } from '../services/faqService';

function AccordionItem({ item, isOpen, onToggle }) {
  return (
    <div className={`border rounded-2xl overflow-hidden transition-all ${isOpen ? 'border-primary-200 shadow-sm' : 'border-gray-100'}`}>
      <button
        className="w-full flex items-center justify-between px-6 py-5 text-left bg-white hover:bg-gray-50 transition"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className="font-semibold text-gray-900 pr-4">{item.question}</span>
        <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-transform ${isOpen ? 'bg-primary-600 text-white rotate-180' : 'bg-gray-100 text-gray-500'}`}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>
      {isOpen && (
        <div className="px-6 pb-6 bg-white">
          <div className="border-t border-gray-100 pt-4 text-gray-600 text-sm leading-relaxed whitespace-pre-line">
            {item.reponse}
          </div>
        </div>
      )}
    </div>
  );
}

export default function FAQ() {
  const { data: faqItems, isLoading } = useFaq();
  const [openId, setOpenId] = useState(null);
  const [activeCategorie, setActiveCategorie] = useState('Toutes');

  const categories = ['Toutes', ...faqService.getCategories()];

  const filtered = faqItems?.filter(f =>
    activeCategorie === 'Toutes' || f.categorie === activeCategorie
  ) ?? [];

  return (
    <div>
      <PageHero
        title="Foire aux questions"
        subtitle="Trouvez rapidement les réponses à vos questions sur la FAAZ, les dons, l'adhésion et le bénévolat."
        breadcrumbs={[{ label: 'Accueil', to: '/' }, { label: 'FAQ' }]}
      />

      <div className="mx-auto max-w-4xl px-6 sm:px-10 py-12">
        {/* Filtres catégories */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => { setActiveCategorie(cat); setOpenId(null); }}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all border ${
                activeCategorie === cat
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300 hover:text-primary-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {isLoading ? (
          <Loading text="Chargement des questions…" />
        ) : (
          <div className="space-y-3">
            {filtered.map(item => (
              <AccordionItem
                key={item.id}
                item={item}
                isOpen={openId === item.id}
                onToggle={() => setOpenId(openId === item.id ? null : item.id)}
              />
            ))}
          </div>
        )}

        {/* Contact CTA */}
        <div className="mt-12 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-8 text-center border border-primary-100">
          <p className="font-bold text-gray-900 mb-2">Vous n'avez pas trouvé votre réponse ?</p>
          <p className="text-sm text-gray-600 mb-4">Notre équipe est disponible pour vous répondre du lundi au vendredi, de 8h à 17h.</p>
          <a
            href="mailto:contact@faaz.org"
            className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-primary-700 transition"
          >
            Nous contacter
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
