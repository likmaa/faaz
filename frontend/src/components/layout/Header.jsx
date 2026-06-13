import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../store/auth';

// Navigation alignée sur le PRD FAAZ
const nav = [
  {
    label: 'La Fondation',
    children: [
      { to: '/about',        label: 'À propos' },
      { to: '/projects',     label: 'Nos projets' },
      { to: '/achievements', label: 'Réalisations & activités' },
    ],
  },
  { to: '/news', label: 'Actualités' },
  {
    label: 'Contribuer',
    children: [
      { to: '/join-us',      label: 'Devenir membre' },
      { to: '/donate',       label: 'Faire un don' },
      { to: '/jobs',         label: "Offres d'emploi" },
      { to: '/volunteering', label: 'Bénévolat' },
      { to: '/internships',  label: 'Stages' },
      { to: '/faq',          label: 'FAQ' },
    ],
  },
  { to: '/#contact', label: 'Contact' },
];

const DONATE_PRESETS = [5000, 10000, 25000];


export default function Header() {
  const { token } = useAuthStore();
  const [scrolled,       setScrolled]       = useState(false);
  const [openIndex,      setOpenIndex]      = useState(null);
  const [hovered,        setHovered]        = useState(false);
  const [donateOpen,     setDonateOpen]     = useState(false);
  const [donatePlan,     setDonatePlan]     = useState('once');
  const [donateAmount,   setDonateAmount]   = useState(10000);
  const [mobileOpen,     setMobileOpen]     = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(null);

  const headerRef = useRef(null);
  const subRef    = useRef(null);

  /* ── Scroll ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── CSS var --header-h pour positionner le subheader et le panel ── */
  useEffect(() => {
    const sync = () => {
      const h = headerRef.current?.clientHeight ?? 72;
      document.documentElement.style.setProperty('--header-h', h + 'px');
    };
    sync();
    window.addEventListener('resize', sync);
    return () => window.removeEventListener('resize', sync);
  }, []);

  /* ── Fermeture sur clic extérieur / Escape ── */
  useEffect(() => {
    const onDocClick = (e) => {
      if (
        !headerRef.current?.contains(e.target) &&
        !subRef.current?.contains(e.target)
      ) setOpenIndex(null);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpenIndex(null);
        setDonateOpen(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  /* ── Bloquer le scroll du body quand le menu mobile est ouvert ── */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const hasSolidBg = scrolled || hovered || openIndex !== null || mobileOpen;

  const closeMobile = () => {
    setMobileOpen(false);
    setMobileExpanded(null);
  };

  return (
    <>
      {/* ══════════════════════ HEADER BAR ══════════════════════ */}
      <header
        ref={headerRef}
        className={`header-root ${hasSolidBg ? 'header-solid' : 'header-transparent'}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="mx-auto px-5 sm:px-8 lg:px-16 xl:px-20 py-3 lg:py-4 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link
            to="/"
            className="relative flex-shrink-0 h-14 w-36 sm:h-16 sm:w-44 lg:h-20 lg:w-52"
            onClick={closeMobile}
          >
            <img
              src="/img/logo blanc.png"
              alt="FAAZ"
              loading="eager"
              className={`absolute inset-0 w-full h-full object-contain object-left transition-opacity duration-500 ${hasSolidBg ? 'opacity-0' : 'opacity-100'}`}
            />
            <img
              src="/img/logo.png"
              alt="FAAZ"
              loading="eager"
              className={`absolute inset-0 w-full h-full object-contain object-left transition-opacity duration-500 ${hasSolidBg ? 'opacity-100' : 'opacity-0'}`}
            />
          </Link>

          {/* ── Nav desktop (≥ lg) ── */}
          <nav className="hidden lg:flex absolute left-1/2 -translate-x-1/2">
            <ul className="flex items-center gap-1">
              {nav.map((item, idx) => (
                <li key={idx} className="relative">
                  {item.children ? (
                    <button
                      className={`nav-link ${hasSolidBg ? 'nav-on-solid' : 'nav-on-transparent'} ${openIndex === idx ? 'nav-active' : ''} inline-flex items-center gap-1`}
                      onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                    >
                      {item.label}
                      <svg
                        className={`nav-caret ${openIndex === idx ? 'caret-open' : ''}`}
                        width="16" height="16" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" strokeWidth="2"
                        aria-hidden="true"
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>
                  ) : (
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        `nav-link ${hasSolidBg ? 'nav-on-solid' : 'nav-on-transparent'} ${isActive ? 'nav-active' : ''}`
                      }
                      onClick={() => setOpenIndex(null)}
                    >
                      {item.label}
                    </NavLink>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* ── Actions desktop (≥ lg) ── */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            <NavLink
              to={token ? "/profile" : "/login"}
              className={`btn-icon relative ${hasSolidBg ? 'btn-icon-solid' : 'btn-icon-transparent'} ${token ? 'text-primary-600 border-primary-500' : ''}`}
              title={token ? "Mon Espace Membre" : "Se connecter"}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              {token && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-green-500 rounded-full border border-white animate-pulse"></span>}
            </NavLink>
            <NavLink
              to="/join-us"
              className={`btn-filled ${hasSolidBg ? 'btn-filled-solid' : 'btn-filled-transparent'} text-sm`}
            >
              Devenir membre
            </NavLink>
          </div>

          {/* ── Actions mobile / tablet (< lg) ── */}
          <div className="flex lg:hidden items-center gap-2 flex-shrink-0">
            {/* Wrapper div gère le show/hide — évite le conflit avec display:inline-flex de btn-filled */}
            <div className="hidden sm:block">
              <NavLink
                to="/join-us"
                className={`btn-filled btn-filled-transparent text-sm px-4 py-2`}
                onClick={closeMobile}
              >
                Devenir membre
              </NavLink>
            </div>

            {/* Hamburger */}
            <button
              className={`btn-icon ${hasSolidBg ? 'btn-icon-solid' : 'btn-icon-transparent'}`}
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <line x1="3" y1="12" x2="21" y2="12"/>
                  <line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ══════════════════════ SUBHEADER DESKTOP ══════════════════════ */}
      {openIndex !== null && nav[openIndex]?.children && (
        <div ref={subRef} className="subheader-root hidden lg:block">
          <div className="mx-auto px-16 xl:px-20 subheader-inner">
            <div className="flex items-start gap-12">
              <div className="min-w-[180px]">
                <p className="text-xs uppercase tracking-widest text-slate-400 mb-2 font-semibold">
                  {nav[openIndex].label}
                </p>
                <div className="h-px bg-slate-200" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-1 w-full">
                {nav[openIndex].children.map((child) => (
                  <NavLink
                    key={child.label}
                    to={child.to}
                    className="subheader-link"
                    onClick={() => setOpenIndex(null)}
                  >
                    {child.label}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════ MENU MOBILE ══════════════════════ */}
      {mobileOpen && (
        <div
          className="mobile-overlay lg:hidden"
          onClick={closeMobile}
          aria-hidden="true"
        />
      )}

      <div
        className={`mobile-panel lg:hidden ${mobileOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navigation"
      >
        {/* Liens nav */}
        <nav className="flex-1 overflow-y-auto px-6 py-4">
          {nav.map((item, idx) => (
            <div key={idx} className="mobile-nav-item">
              {item.children ? (
                <>
                  <button
                    className="mobile-nav-link"
                    onClick={() =>
                      setMobileExpanded(mobileExpanded === idx ? null : idx)
                    }
                  >
                    <span>{item.label}</span>
                    <svg
                      className={`nav-caret ${mobileExpanded === idx ? 'caret-open' : ''}`}
                      width="18" height="18" viewBox="0 0 24 24"
                      fill="none" stroke="currentColor" strokeWidth="2"
                      aria-hidden="true"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                  {mobileExpanded === idx && (
                    <div className="mobile-submenu">
                      {item.children.map((child) => (
                        <NavLink
                          key={child.label}
                          to={child.to}
                          className="mobile-submenu-link"
                          onClick={closeMobile}
                        >
                          {child.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `mobile-nav-link ${isActive ? 'active' : ''}`
                  }
                  onClick={closeMobile}
                >
                  {item.label}
                </NavLink>
              )}
            </div>
          ))}
        </nav>

        {/* Actions en bas du panel */}
        <div className="p-6 border-t border-slate-100 space-y-3">
          <NavLink
            to={token ? "/profile" : "/login"}
            className="flex items-center gap-3 text-slate-700 font-semibold py-2 hover:text-primary-600 transition-colors"
            onClick={closeMobile}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            {token ? "Mon Espace Membre" : "Se connecter"}
          </NavLink>
          <NavLink
            to="/join-us"
            className="btn-filled btn-filled-solid w-full justify-center py-3 rounded-full font-bold text-sm"
            onClick={closeMobile}
          >
            Devenir membre →
          </NavLink>
        </div>
      </div>

      {/* ══════════════════════ BOUTON DONATE FLOTTANT ══════════════════════ */}
      <button
        type="button"
        className={`donate-fab ${donateOpen ? 'active' : ''}`}
        aria-expanded={donateOpen}
        aria-controls="donate-drawer"
        onClick={() => setDonateOpen((v) => !v)}
        title="Faire un don"
      >
        DONATE
        <svg
          className={`donate-caret ${donateOpen ? 'open' : ''}`}
          width="14" height="14" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* ══════════════════════ DONATE DRAWER ══════════════════════ */}
      <AnimatePresence>
        {donateOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm" 
              onClick={() => setDonateOpen(false)} 
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              id="donate-drawer"
              className="fixed top-0 right-0 z-[101] h-full w-full max-w-[420px] bg-white shadow-2xl flex flex-col"
              role="dialog"
              aria-label="Faire un don"
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="font-heading font-extrabold text-xl text-slate-800">Faire un don</h3>
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors"
                  aria-label="Fermer"
                  onClick={() => setDonateOpen(false)}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8">
                
                {/* Type de don */}
                <div>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 font-body">Type de soutien</p>
                  <div className="flex p-1 bg-slate-100 rounded-xl">
                    <button
                      className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all duration-300 ${donatePlan === 'once' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                      onClick={() => setDonatePlan('once')}
                    >
                      Don unique
                    </button>
                    <button
                      className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all duration-300 ${donatePlan === 'monthly' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                      onClick={() => setDonatePlan('monthly')}
                    >
                      Mensuel
                    </button>
                  </div>
                </div>

                {/* Montant (Presets) */}
                <div>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 font-body">Montant</p>
                  <div className="grid grid-cols-2 gap-3">
                    {DONATE_PRESETS.map((v) => (
                      <button
                        key={v}
                        className={`py-3 px-4 rounded-xl font-bold border-2 transition-all duration-300 ${donateAmount === v ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-slate-100 bg-white text-slate-600 hover:border-slate-200 hover:bg-slate-50'}`}
                        onClick={() => setDonateAmount(v)}
                      >
                        {v.toLocaleString('fr-FR')} FCFA
                      </button>
                    ))}
                    <button
                      className={`py-3 px-4 rounded-xl font-bold border-2 transition-all duration-300 ${!DONATE_PRESETS.includes(donateAmount) ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-slate-100 bg-white text-slate-600 hover:border-slate-200 hover:bg-slate-50'}`}
                      onClick={() => setDonateAmount(0)}
                    >
                      Autre montant
                    </button>
                  </div>
                </div>

                {/* Saisie libre */}
                <motion.div 
                  initial={false}
                  animate={{ 
                    height: !DONATE_PRESETS.includes(donateAmount) ? 'auto' : 0, 
                    opacity: !DONATE_PRESETS.includes(donateAmount) ? 1 : 0 
                  }}
                  className="overflow-hidden"
                >
                  <div className="pt-2">
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">FCFA</span>
                      <input
                        type="number"
                        min="0"
                        value={donateAmount || ''}
                        onChange={(e) => setDonateAmount(Number(e.target.value))}
                        placeholder="Saisissez un montant..."
                        className="w-full pl-16 pr-4 py-4 rounded-xl border-2 border-slate-200 focus:border-primary-500 focus:ring-0 text-lg font-bold text-slate-800 transition-colors"
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Avantage fiscal / Info */}
                <div className="bg-emerald-50 rounded-xl p-4 flex gap-3 items-start border border-emerald-100">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-500 shrink-0 mt-0.5">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                  <p className="text-sm text-emerald-800 font-body leading-relaxed">
                    Votre don est 100% sécurisé. La FAAZ s'engage à utiliser l'intégralité de votre don pour financer ses actions sur le terrain.
                  </p>
                </div>

              </div>

              {/* Footer / CTA */}
              <div className="p-6 border-t border-slate-100 bg-white">
                <button
                  className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-500 hover:to-secondary-500 text-white font-bold text-lg py-4 rounded-xl shadow-lg hover:shadow-primary-500/25 transition-all duration-300 flex items-center justify-center gap-2 group"
                  onClick={() => {
                    setDonateOpen(false);
                    if (donateAmount) {
                      window.location.href = `/donate?amount=${donateAmount}`;
                    } else {
                      window.location.href = '/donate';
                    }
                  }}
                >
                  <span>Soutenir {donateAmount ? `à hauteur de ${donateAmount.toLocaleString('fr-FR')} FCFA` : ''}</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:translate-x-1 transition-transform">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
