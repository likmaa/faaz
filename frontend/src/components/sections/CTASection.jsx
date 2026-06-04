import React, { useEffect, useRef, useState } from 'react';

const slides = [
  { url: '/assets/img/accueil1.png', alt: 'Volunteers working with children' },
  { url: '/assets/img/about1.png', alt: 'Community support' },
  { url: '/assets/img/close-up-team-hand-shake.jpg', alt: 'Field projects' },
];

export default function CTASection() {
  const sectionRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Gestion du carrousel automatique
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Gestion de l'animation au scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // On commence l'animation quand le haut de la section entre dans le dernier tiers de l'écran
      // On la termine quand le haut de la section est un peu au-dessus du milieu
      const startOffset = windowHeight * 0.9;
      const endOffset = windowHeight * 0.2;
      
      const distance = startOffset - rect.top;
      const totalDistance = startOffset - endOffset;
      
      let progress = distance / totalDistance;
      
      // Clamp entre 0 et 1
      progress = Math.max(0, Math.min(1, progress));
      
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Init check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calcul des styles dynamiques basés sur le scroll
  // Largeur: de 90% à 100%
  // BorderRadius: de 40px à 0px
  // Padding latéral interne: ajustement optionnel pour garder le contenu centré
  const width = 90 + (scrollProgress * 10); 
  const borderRadius = 2.5 - (scrollProgress * 2.5); // rem

  return (
    <div ref={sectionRef} className="py-20 w-full flex justify-center overflow-hidden bg-slate-50">
      <div 
        className="relative bg-gradient-to-r from-[var(--brand-green)] to-[var(--brand-green-bright)] overflow-hidden transition-all duration-100 ease-out shadow-2xl"
        style={{
          width: `${width}%`,
          borderRadius: `${borderRadius}rem`,
          minHeight: '600px'
        }}
      >
        <div className="flex flex-col lg:flex-row h-full min-h-[600px]">
          
          {/* Colonne Gauche : Carrousel */}
          <div className="lg:w-1/2 relative h-[400px] lg:h-auto overflow-hidden group">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <img 
                  src={slide.url} 
                  alt={slide.alt} 
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-[2000ms]"
                />
                {/* No overlay — keep image colors intact */}
              </div>
            ))}
            
            {/* Indicateurs de slide */}
            <div className="absolute bottom-8 left-8 flex gap-3 z-10">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'
                  }`}
                  aria-label={`Aller à la diapositive ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Colonne Droite : Contenu & Actions */}
          <div className="lg:w-1/2 p-10 lg:p-20 flex flex-col justify-center text-white relative z-10">
            {/* Éléments décoratifs d'arrière-plan */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#166534] blur-[100px] rounded-full pointer-events-none" />
            
            <div className="relative">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--brand-blue)]/10 text-white text-sm font-medium mb-8 border border-[var(--brand-blue)]/20 w-fit">
                <span className="w-2 h-2 rounded-full bg-[var(--brand-blue)] animate-pulse"></span>
                Rejoignez l'aventure
              </span>

              <h2 className="text-3xl md:text-4xl lg:text-5xl leading-[1.1] font-extrabold mb-6 text-white tracking-tight font-heading">
                Ensemble, transformons <br/>
                <span className="text-[var(--brand-blue)]">l'espoir</span>
                <span className="text-white"> en action.</span>
              </h2>
              
              <p className="text-white/80 text-sm sm:text-base leading-relaxed font-body mb-12 max-w-lg">
                Chaque don est une promesse de changement: un enfant scolarisé, une famille soutenue, une vie transformée. 
                En nous soutenant aujourd'hui, vous faites naître des lendemains plus sûrs et plus justes pour nos communautés.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="px-8 py-4 bg-white text-[var(--brand-green)] rounded-full font-bold hover:bg-[var(--brand-blue)]/5 transition-all transform hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] flex items-center justify-center gap-2 group">
                  Faire un don
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
                
                <button className="px-8 py-4 bg-transparent border border-[var(--brand-green)]/40 text-white rounded-full font-semibold hover:bg-[var(--brand-green)]/20 hover:border-[var(--brand-blue)]/30 transition-all flex items-center justify-center">
                  Devenir membre
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
