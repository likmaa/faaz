import React, { useEffect, useRef, useState } from 'react';

const STATS = [
  { value: 122,  suffix: '',     label: 'Orphelins scolarisés',   sub: 'Chaque orphelin à l\'école' },
  { value: 232,  suffix: '',     label: 'Bénéficiaires santé',    sub: 'Santé & dons de vêtements' },
  { value: 108,  suffix: '',     label: 'Bénéficiaires vivres',   sub: 'Dons de vivres aux orphelins' },
  { value: 28,   suffix: '',     label: 'Jeunes coachés',         sub: 'Coaching & leadership' },
  { value: 6,    suffix: '',     label: 'Éd. Prix Gnamey',        sub: 'Excellence scolaire' },
  { value: 6,    suffix: ' ans', label: 'D\'action continue',     sub: '2020 → 2026' },
];

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
  return (
    <section className="bg-primary-600 py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-20">

        <p className="text-center text-primary-200 text-xs font-bold uppercase tracking-widest mb-10">
          Notre impact · Données réelles 2020–2026
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 lg:gap-2">
          {STATS.map((stat, i) => (
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
