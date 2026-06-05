import React, { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';

function extractStat(list, titleKeyword, statLabelKeyword, fallback) {
  if (!list || list.length === 0) return fallback;
  for (const r of list) {
    const title = (r.title || r.titre || '').toLowerCase();
    if (title.includes(titleKeyword.toLowerCase())) {
      const statsArray = r.stats || [];
      for (const s of statsArray) {
        const label = (s.label || '').toLowerCase();
        if (label.includes(statLabelKeyword.toLowerCase())) {
          const cleaned = (s.value || '').replace(/[^\d]/g, '');
          const parsed = parseInt(cleaned, 10);
          if (!isNaN(parsed)) {
            return parsed;
          }
        }
      }
    }
  }
  return fallback;
}

function Counter({ value, suffix, duration = 1600 }) {
  const [display, setDisplay] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) { setDisplay(value); return; }
    let startTime = null;
    const tick = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(2, -10 * progress); // easeOutExpo
      setDisplay(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame(tick);
      else setDisplay(value);
    };
    requestAnimationFrame(tick);
  }, [started, value, duration]);

  return <span ref={ref} className="tabular-nums">{display}{suffix}</span>;
}

export default function StatsSection() {
  const { data: realisations = [] } = useQuery({
    queryKey: ['realisations'],
    queryFn: async () => {
      try {
        const res = await api.get('/realisations/');
        const list = Array.isArray(res.data) 
          ? res.data 
          : (Array.isArray(res.data?.results) 
              ? res.data.results 
              : (res.data?.data || []));
        return list;
      } catch (err) {
        return [];
      }
    },
    staleTime: 1000 * 60 * 5
  });

  const scolarises = extractStat(realisations, 'scolaris', 'bénéficiaire', 122);
  const sante = extractStat(realisations, 'sant', 'bénéficiaire', 232);
  const vivres = extractStat(realisations, 'vivres', 'bénéficiaire', 108);
  const coaches = extractStat(realisations, 'coach', 'jeune', 28);
  const gnameyEditions = extractStat(realisations, 'gnamey', 'édition', 6);
  const actionYears = Math.max(6, new Date().getFullYear() - 2020);

  const stats = [
    { value: scolarises,     suffix: '',     label: 'Orphelins scolarisés',   sub: 'Chaque orphelin à l\'école' },
    { value: sante,          suffix: '',     label: 'Bénéficiaires santé',    sub: 'Santé & dons de vêtements' },
    { value: vivres,         suffix: '',     label: 'Bénéficiaires vivres',   sub: 'Dons de vivres aux orphelins' },
    { value: coaches,        suffix: '',     label: 'Jeunes coachés',         sub: 'Coaching & leadership' },
    { value: gnameyEditions, suffix: '',     label: 'Éd. Prix Gnamey',        sub: 'Excellence scolaire' },
    { value: actionYears,    suffix: ' ans', label: 'D\'action continue',     sub: `2020 → ${new Date().getFullYear()}` },
  ];

  return (
    <section className="bg-primary-600 py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-20">

        <p className="text-center text-primary-200 text-xs font-bold uppercase tracking-widest mb-10">
          Notre impact · Données réelles 2020–{new Date().getFullYear()}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 lg:gap-2">
          {stats.map((stat, i) => (
            <div key={i} className="text-center px-2">
              <div className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-1">
                <Counter value={stat.value} suffix={stat.suffix} duration={1500 + i * 80} />
              </div>
              <p className="text-primary-100 font-semibold text-sm mb-1">{stat.label}</p>
              <p className="text-primary-300 text-xs leading-snug hidden sm:block">{stat.sub}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 h-px bg-primary-500" />
        <p className="text-center text-primary-300 text-xs mt-3 tracking-wide">
          Fondation les Amis de A à Z · Bénin · lafaaz.org
        </p>
      </div>
    </section>
  );
}
