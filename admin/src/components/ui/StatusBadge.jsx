import React from 'react';

const STATUS_MAP = {
  // Adhésion
  en_attente:  { label: 'En attente',    cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  valide:      { label: 'Validé',        cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  rejete:      { label: 'Refusé',        cls: 'bg-red-50 text-red-700 border-red-200' },
  // Cotisation
  a_jour:      { label: 'À jour',        cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  a_echoir:    { label: 'À échoir',      cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  en_retard:   { label: 'En retard',     cls: 'bg-red-50 text-red-700 border-red-200' },
  relance:     { label: 'Relance',       cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  // Don / Paiement
  paye:        { label: 'Confirmé',      cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  echoue:      { label: 'Échoué',        cls: 'bg-red-50 text-red-700 border-red-200' },
  // Projet
  brouillon:   { label: 'Brouillon',     cls: 'bg-slate-100 text-slate-500 border-slate-200' },
  collecte:    { label: 'En financement',cls: 'bg-sky-50 text-sky-700 border-sky-200' },
  finance:     { label: 'Financé',       cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  realise:     { label: 'Réalisé',       cls: 'bg-green-100 text-green-800 border-green-200' },
  // Candidature
  nouvelle:    { label: 'Nouvelle',      cls: 'bg-sky-50 text-sky-700 border-sky-200' },
  en_cours:    { label: 'En cours',      cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  retenu:      { label: 'Retenu',        cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  // Offre recrutement
  ouvert:      { label: 'Ouverte',       cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  ferme:       { label: 'Fermée',        cls: 'bg-slate-100 text-slate-500 border-slate-200' },
  // Contenu
  publie:      { label: 'Publié',        cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  // Axe
  actif:       { label: 'Actif',         cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  a_venir:     { label: 'À venir',       cls: 'bg-sky-50 text-sky-700 border-sky-200' },
};

export default function StatusBadge({ status }) {
  const entry = STATUS_MAP[status] ?? { label: status, cls: 'bg-slate-100 text-slate-500 border-slate-200' };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${entry.cls}`}>
      {entry.label}
    </span>
  );
}
