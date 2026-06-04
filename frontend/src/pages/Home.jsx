import React from 'react';
import CausesSection from '../components/sections/CausesSection';
import ImpactSection from '../components/sections/ImpactSection';
import CTASection from '../components/sections/CTASection';
import BackgroundVideo from '../components/layout/BackgroundVideo';
import ProjectsSection from '../components/sections/ProjectsSection';
import MembershipSection from '../components/sections/MembershipSection';
import TestimonialsSection from '../components/sections/TestimonialsSection';
import PartnersSection from '../components/sections/PartnersSection';

export default function Home() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <div className="relative w-full" style={{ minHeight: '100vh' }}>

        {/* Vidéo fond */}
        <BackgroundVideo
          webmSrc="/assets/video/kk1_hq.webm"
          mp4Src="/assets/video/kk1_hq.mp4"
          poster={null}
        />

        {/* Voile sombre léger pour lisibilité du texte centré */}
        <div className="absolute inset-0 bg-black/30 pointer-events-none z-0" />

        {/* Gradient bleu bas → fondu vers la CausesSection */}
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            background: 'linear-gradient(to top, #0284c7 0%, #0284c7 18%, rgba(2,132,199,0.4) 42%, transparent 62%)'
          }}
        />

        {/* Contenu ancré dans le bas du hero — laisse la vidéo respirer en haut */}
        <div className="relative z-10 flex flex-col items-center justify-end text-center"
             style={{ minHeight: '100vh', paddingBottom: '8vh' }}>

          <div className="w-full max-w-4xl mx-auto px-6 sm:px-10">

            {/* Label + titre — enchaînés sans séparation */}
            <p className="text-white/55 text-xs sm:text-sm font-bold uppercase tracking-[0.25em] mb-2 sm:mb-3">
              Fondation les Amis de A à Z
            </p>
            <h1 className="text-white font-extrabold tracking-tight leading-[1.05]
                           text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem]">
              Engageons notre amitié<br />
              au service des personnes<br />
              <span className="text-primary-400">vulnérables.</span>
            </h1>

            {/* Barre inférieure */}
            <div className="w-full h-px bg-white/30 mt-6 sm:mt-8 mb-6 sm:mb-8" />

            {/* Sous-titre + CTA sous la barre */}
            <p className="text-white/75 text-sm sm:text-base leading-relaxed max-w-xl mx-auto mb-8">
              ONG béninoise à membres active depuis 2020 — enfance indigente,
              excellence scolaire, coaching de la jeunesse.
            </p>

            {/* CTA */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="/donate"
                className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold px-7 py-3.5 rounded-full text-sm transition shadow-lg"
              >
                Faire un don
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
              <a
                href="/projects"
                className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white font-semibold px-7 py-3.5 rounded-full text-sm border border-white/40 transition backdrop-blur-sm"
              >
                Découvrir nos causes
              </a>
            </div>

          </div>
        </div>
      </div>

      {/* ── Sections ─────────────────────────────────────────── */}
      <CausesSection />
      <ProjectsSection />
      <ImpactSection />
      <TestimonialsSection />
      <MembershipSection />
      <PartnersSection />
      <CTASection />
    </>
  );
}
