// Design tokens centralisés pour Lafaaz
// Couleurs & typographies
// Utilisation: import { colors, fonts, gradients } from '../theme';

export const colors = {
  brand: {
    green: '#16a34a', // action principale
    greenBright: '#22c55e', // variante éclat / gradient
    blue: '#0284c7', // liens, accents secondaires
    blueBright: '#38bdf8', // hover / gradient
  },
  neutral: {
    overlayDark: '#0f172a', // hero overlay / modals
    text: '#1e293b',
    glass: 'rgba(255,255,255,0.1)'
  }
};

export const fonts = {
  heading: 'Outfit, ui-sans-serif, system-ui',
  body: 'Plus Jakarta Sans, ui-sans-serif, system-ui'
};

export const gradients = {
  hero: `linear-gradient(135deg, ${colors.brand.green} 0%, ${colors.brand.blue} 100%)`,
  cta: `linear-gradient(135deg, ${colors.brand.greenBright} 0%, ${colors.brand.blueBright} 100%)`,
};

// Helper style objects (ex: <div style={tokenStyles.sectionHeader}>...)
export const tokenStyles = {
  sectionHeader: {
    fontFamily: fonts.heading,
    fontWeight: 700,
    letterSpacing: '-0.5px',
    color: colors.neutral.text
  },
  paragraph: {
    fontFamily: fonts.body,
    fontSize: '1rem',
    lineHeight: 1.6,
    color: colors.neutral.text
  },
  glassPanel: {
    background: colors.neutral.glass,
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '16px'
  }
};

// Optional ThemeProvider (injection via CSS variables)
export function applyThemeVariables() {
  const r = document.documentElement;
  r.style.setProperty('--brand-green', colors.brand.green);
  r.style.setProperty('--brand-green-bright', colors.brand.greenBright);
  r.style.setProperty('--brand-blue', colors.brand.blue);
  r.style.setProperty('--brand-blue-bright', colors.brand.blueBright);
  r.style.setProperty('--overlay-dark', colors.neutral.overlayDark);
  r.style.setProperty('--text-primary', colors.neutral.text);
  r.style.setProperty('--glass-bg', colors.neutral.glass);
}

// Exemple d'usage dans un composant:
// import { tokenStyles } from '../theme';
// <h2 style={tokenStyles.sectionHeader}>Titre</h2>
