import React from 'react';
import { Link } from 'react-router-dom';

const columns = [
  {
    heading: 'La Fondation',
    links: [
      { to: '/about',        label: 'À propos' },
      { to: '/projects',     label: 'Nos projets' },
      { to: '/achievements', label: 'Réalisations' },
      { to: '/news',         label: 'Actualités' },
    ],
  },
  {
    heading: "S'impliquer",
    links: [
      { to: '/join-us',      label: 'Devenir membre' },
      { to: '/donate',       label: 'Faire un don' },
      { to: '/volunteering', label: 'Bénévolat' },
      { to: '/jobs',         label: "Offres d'emploi" },
      { to: '/internships',  label: 'Stages' },
    ],
  },
  {
    heading: 'Informations',
    links: [
      { to: '/faq',  label: 'FAQ' },
      { to: '/#contact', label: 'Contact' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="footer-root">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-20 py-14 lg:py-16">

        {/* Grille principale */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16">

          {/* Colonne identité */}
          <div className="sm:col-span-2 lg:col-span-1">
            <img
              src="/img/logo blanc.png"
              alt="FAAZ"
              className="h-14 w-auto object-contain object-left mb-4"
            />
            <p className="text-sm leading-relaxed text-slate-400 max-w-xs">
              Fondation les Amis de A à Z, ONG béninoise.
              Nous ne finançons pas seulement la solidarité : nous la structurons.
            </p>

            {/* Réseaux sociaux */}
            <div className="flex flex-wrap items-center gap-3 mt-6">
              {[
                {
                  label: 'Facebook',
                  href: '#',
                  hoverClass: 'hover:border-[#1877F2] hover:text-[#1877F2] hover:bg-[#1877F2]/10',
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                    </svg>
                  ),
                },
                {
                  label: 'Instagram',
                  href: '#',
                  hoverClass: 'hover:border-[#E4405F] hover:text-[#E4405F] hover:bg-[#E4405F]/10',
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                    </svg>
                  ),
                },
                {
                  label: 'X (Twitter)',
                  href: '#',
                  hoverClass: 'hover:border-[#ffffff] hover:text-[#ffffff] hover:bg-white/10',
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  ),
                },
                {
                  label: 'TikTok',
                  href: '#',
                  hoverClass: 'hover:border-[#00f2fe] hover:text-[#fe0979] hover:bg-white/10',
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M12.525.01c1.306-.022 2.616-.01 3.921-.018.068 1.409.63 2.73 1.537 3.714.973.996 2.355 1.559 3.779 1.637v3.51a8.6 8.6 0 0 1-5.228-1.78v9.429c.02 2.008-.68 3.97-1.93 5.507A9.011 9.011 0 0 1 9.87 25.13a9.07 9.07 0 0 1-7.85-2.32c-1.636-1.58-2.62-3.8-2.63-6.13-.01-2.316.92-4.53 2.51-6.16a9.022 9.022 0 0 1 7.21-2.73v3.49c-.072-.008-.146-.017-.219-.017a5.55 5.55 0 0 0-5.18 4.01c-.56 1.8.08 3.74 1.56 4.77a5.57 5.57 0 0 0 5.42-.08c1.39-1.01 2.1-2.73 2.11-4.46V0h2.004z"/>
                    </svg>
                  ),
                },
                {
                  label: 'YouTube',
                  href: '#',
                  hoverClass: 'hover:border-[#FF0000] hover:text-[#FF0000] hover:bg-[#FF0000]/10',
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/>
                      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="#0f172a"/>
                    </svg>
                  ),
                },
                {
                  label: 'LinkedIn',
                  href: '#',
                  hoverClass: 'hover:border-[#0A66C2] hover:text-[#0A66C2] hover:bg-[#0A66C2]/10',
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                      <rect x="2" y="9" width="4" height="12"/>
                      <circle cx="4" cy="4" r="2"/>
                    </svg>
                  ),
                },
              ].map(({ label, href, hoverClass, icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className={`w-9 h-9 rounded-full border border-slate-700 flex items-center justify-center text-slate-400 transition-all duration-300 ${hoverClass}`}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Colonnes nav */}
          {columns.map((col) => (
            <div key={col.heading}>
              <p className="footer-heading">{col.heading}</p>
              <ul>
                {col.links.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="footer-link">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Séparateur + bas de page */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Fondation les Amis de A à Z · ONG béninoise</p>
          <p>Fait avec ❤️ au Bénin</p>
        </div>
      </div>
    </footer>
  );
}
