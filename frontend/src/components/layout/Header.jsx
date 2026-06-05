import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

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
              src="/assets/img/logo blanc.png"
              alt="FAAZ"
              loading="eager"
              className={`absolute inset-0 w-full h-full object-contain object-left transition-opacity duration-500 ${hasSolidBg ? 'opacity-0' : 'opacity-100'}`}
            />
            <img
              src="/assets/img/logo.png"
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
              to="/login"
              className={`btn-icon ${hasSolidBg ? 'btn-icon-solid' : 'btn-icon-transparent'}`}
              title="Se connecter"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
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
            to="/login"
            className="flex items-center gap-3 text-slate-700 font-semibold py-2 hover:text-primary-600 transition-colors"
            onClick={closeMobile}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            Se connecter
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
      {donateOpen && (
        <>
          <div className="donate-overlay" onClick={() => setDonateOpen(false)} />
          <aside
            id="donate-drawer"
            className={`donate-drawer ${donateOpen ? 'open' : ''}`}
            role="dialog"
            aria-label="Faire un don"
          >
            {/* Header */}
            <div className="donate-header">
              <h3>Faire un don</h3>
              <button
                className="donate-close"
                aria-label="Fermer"
                onClick={() => setDonateOpen(false)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {/* Tabs once / mensuel */}
            <div className="donate-tabs">
              <button
                className={`donate-tab ${donatePlan === 'once' ? 'active' : ''}`}
                onClick={() => setDonatePlan('once')}
              >
                Don unique
              </button>
              <button
                className={`donate-tab ${donatePlan === 'monthly' ? 'active' : ''}`}
                onClick={() => setDonatePlan('monthly')}
              >
                Mensuel
              </button>
            </div>

            {/* Presets */}
            <div className="donate-presets">
              {DONATE_PRESETS.map((v) => (
                <button
                  key={v}
                  className={`donate-chip ${donateAmount === v ? 'active' : ''}`}
                  onClick={() => setDonateAmount(v)}
                >
                  {v.toLocaleString('fr-FR')}
                </button>
              ))}
              <button
                className={`donate-chip ${!DONATE_PRESETS.includes(donateAmount) ? 'active' : ''}`}
                onClick={() => setDonateAmount(0)}
              >
                Autre
              </button>
            </div>

            {/* Saisie libre */}
            <div className="donate-input">
              <span className="donate-currency">FCFA</span>
              <input
                type="number"
                min="0"
                value={donateAmount || ''}
                onChange={(e) => setDonateAmount(Number(e.target.value))}
                placeholder="Montant libre"
              />
            </div>

            <button
              className="donate-cta"
              onClick={() => {
                /* TODO : connecter au checkout KKiaPay / PayPal */
                setDonateOpen(false);
              }}
            >
              Donner maintenant
            </button>
          </aside>
        </>
      )}
    </>
  );
}
