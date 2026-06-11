import React, { useState, useEffect, useRef } from 'react';
import Loading from '../ui/Loading';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { Quote, MessageSquare, ShieldCheck, Heart, ChevronLeft, ChevronRight, Star } from 'lucide-react';

const fallbackData = [
  {
    id: 1,
    nom: "Ablavi G.",
    role: "Secrétaire Générale, Orphelinat Saint Dominique",
    montant: null,
    message: "Grâce au projet 'Chaque orphelin à l'école' de la FAAZ, 122 enfants ont pu s'inscrire cette année avec toutes leurs fournitures scolaires. C'est un suivi continu qui change des vies."
  },
  {
    id: 2,
    nom: "Koffi M.",
    role: "Donateur actif, Diaspora Béninoise (Paris)",
    montant: "50 000",
    message: "La transparence financière absolue de la fondation est ce qui m'a convaincu. Chaque franc versé est tracé et on suit l'avancement des projets en temps réel sur le site."
  },
  {
    id: 3,
    nom: "Dr. Saliou B.",
    role: "Coordinateur des campagnes médicales (Porto-Novo)",
    montant: null,
    message: "Les consultations gratuites organisées par la FAAZ permettent d'apporter des soins de base à des populations isolées. L'engagement des bénévoles est tout simplement admirable."
  }
];

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const autoPlayRef = useRef(null);

  const { data: testimonials = fallbackData, isLoading } = useQuery({
    queryKey: ['home-temoignages'],
    queryFn: async () => {
      try {
        const res = await api.get('/temoignages?limit=5');
        const list = Array.isArray(res.data)
          ? res.data
          : (Array.isArray(res.data?.results)
              ? res.data.results
              : (res.data?.data || []));
        return list.length > 0 ? list : fallbackData;
      } catch (err) {
        return fallbackData;
      }
    },
    staleTime: 1000 * 60
  });

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    if (isPaused) {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
      return;
    }

    autoPlayRef.current = setInterval(() => {
      nextSlide();
    }, 6000);

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isPaused, testimonials.length]);

  return (
    <section className="py-28 bg-slate-50/70 relative overflow-hidden" id="testimonials-section">
      {/* Éléments de fond décoratifs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-100/15 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary-100/10 rounded-full blur-3xl -z-10 pointer-events-none" />
      
      {/* Fine grille décorative avec gradient radial */}
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:32px_32px] opacity-25 pointer-events-none" />

      <div className="mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-20 relative z-10">
        <div className="grid lg:grid-cols-3 gap-12 lg:gap-20 items-center">
          
          {/* Bloc éditorial gauche */}
          <div className="lg:col-span-1 flex flex-col justify-between py-4 h-full">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-50 border border-primary-100/80 text-primary-700 text-xs font-bold uppercase tracking-wider mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
                Voix du terrain
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.1] font-black text-slate-900 tracking-tight font-heading mb-6">
                Pourquoi ils soutiennent <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">la FAAZ.</span>
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-8 font-body">
                Qu'ils soient donateurs, membres de la diaspora ou partenaires locaux, découvrez les témoignages de ceux qui font battre le cœur de la fondation au quotidien.
              </p>
            </div>

            {/* Petites stats d'engagement */}
            <div className="space-y-4 border-t border-slate-200/80 pt-8 mt-4">
              <div className="group flex items-center gap-4 p-3 rounded-2xl bg-white/50 border border-slate-100/50 shadow-[0_4px_20px_rgba(15,23,42,0.01)] hover:bg-white hover:shadow-md hover:border-slate-100 transition-all duration-300">
                <div className="w-11 h-11 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-600 shadow-sm transition-transform duration-300 group-hover:scale-110">
                  <ShieldCheck size={20} strokeWidth={2} />
                </div>
                <div>
                  <p className="text-sm font-extrabold text-slate-800 font-body">Comptabilité transparente</p>
                  <p className="text-[10px] text-slate-400 font-semibold font-body uppercase tracking-wider mt-0.5">Contrôle interne rigoureux</p>
                </div>
              </div>
              
              <div className="group flex items-center gap-4 p-3 rounded-2xl bg-white/50 border border-slate-100/50 shadow-[0_4px_20px_rgba(15,23,42,0.01)] hover:bg-white hover:shadow-md hover:border-slate-100 transition-all duration-300">
                <div className="w-11 h-11 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-600 shadow-sm transition-transform duration-300 group-hover:scale-110">
                  <Heart size={20} strokeWidth={2} />
                </div>
                <div>
                  <p className="text-sm font-extrabold text-slate-800 font-body">Actions directes terrain</p>
                  <p className="text-[10px] text-slate-400 font-semibold font-body uppercase tracking-wider mt-0.5">Aucun intermédiaire inutile</p>
                </div>
              </div>
            </div>
          </div>

          {/* Carrousel à droite */}
          <div className="lg:col-span-2 flex flex-col justify-center min-h-[380px]">
            {isLoading ? (
              <Loading text="Chargement des témoignages..." />
            ) : testimonials?.length > 0 ? (
              <div className="w-full flex flex-col gap-8">
                
                {/* Zone de cartes de témoignages */}
                <div 
                  className="relative overflow-hidden h-[340px] sm:h-[300px]"
                  onMouseEnter={() => setIsPaused(true)}
                  onMouseLeave={() => setIsPaused(false)}
                >
                  {testimonials.map((t, idx) => {
                    const isActive = idx === activeIndex;
                    return (
                      <div 
                        key={t.id} 
                        id={`testimonial-card-${t.id}`}
                        className={`absolute inset-0 w-full h-full bg-white/95 rounded-[2rem] p-8 md:p-10 border border-slate-100/60 shadow-[0_20px_50px_-12px_rgba(15,23,42,0.04)] backdrop-blur-md transition-all duration-700 ease-in-out flex flex-col justify-between ${
                          isActive 
                            ? 'opacity-100 translate-x-0 scale-100 pointer-events-auto z-10' 
                            : 'opacity-0 translate-x-8 scale-95 pointer-events-none z-0'
                        }`}
                      >
                        {/* Guillemet géant décoratif */}
                        <div className="absolute top-8 right-10 text-primary-100/40 pointer-events-none transition-colors duration-500 group-hover:text-primary-200/50">
                          <Quote size={90} className="stroke-[1] opacity-35" />
                        </div>

                        {/* Top: Stars + Message */}
                        <div>
                          {/* 5 Etoiles de notation */}
                          <div className="flex gap-1 mb-5">
                            {Array(5).fill(0).map((_, i) => (
                              <Star key={i} size={15} className="fill-amber-400 text-amber-400 drop-shadow-sm" />
                            ))}
                          </div>

                          {/* Message */}
                          <p className="text-slate-700 text-base sm:text-lg leading-relaxed italic font-body mb-6 pr-6 font-medium">
                            "{t.message || 'Merci pour votre soutien.'}"
                          </p>
                        </div>

                        {/* Bottom: Profil Donateur */}
                        <div className="flex flex-wrap items-center justify-between gap-4 mt-auto border-t border-slate-100 pt-6">
                          <div className="flex items-center gap-4">
                            {/* Avatar initials avec dégradé premium */}
                            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-primary-500 to-secondary-500 flex items-center justify-center text-white font-black text-lg shadow-md border-2 border-white ring-4 ring-primary-50/50">
                              {(t.nom || 'A')[0].toUpperCase()}
                            </div>
                            <div>
                              <p className="font-black text-slate-800 text-base font-body">{t.nom || 'Anonyme'}</p>
                              <p className="text-slate-400 text-[10px] font-extrabold font-body tracking-wider uppercase mt-0.5">{t.role || 'Soutien'}</p>
                            </div>
                          </div>

                          {/* Badge Donateur */}
                          {t.montant && (
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-black bg-emerald-50 border border-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full shadow-sm">
                              <Heart size={11} className="fill-emerald-600 text-emerald-600" />
                              Donateur · {t.montant} FCFA
                            </span>
                          )}
                        </div>

                      </div>
                    );
                  })}
                </div>

                {/* Contrôles du Carrousel (Flèches + Puces) */}
                <div className="flex items-center justify-between px-2">
                  
                  {/* Indicateurs à puces (Dots) */}
                  <div className="flex gap-2">
                    {testimonials.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveIndex(idx)}
                        className={`h-2.5 rounded-full transition-all duration-300 ${
                          idx === activeIndex 
                            ? 'w-8 bg-gradient-to-r from-primary-600 to-secondary-600' 
                            : 'w-2.5 bg-slate-200 hover:bg-slate-300'
                        }`}
                        aria-label={`Aller au témoignage ${idx + 1}`}
                      />
                    ))}
                  </div>

                  {/* Boutons flèches */}
                  <div className="flex gap-3">
                    <button
                      onClick={prevSlide}
                      className="w-12 h-12 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200 transition-all duration-300 shadow-sm active:scale-95"
                      aria-label="Témoignage précédent"
                    >
                      <ChevronLeft size={20} strokeWidth={2.5} />
                    </button>
                    <button
                      onClick={nextSlide}
                      className="w-12 h-12 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200 transition-all duration-300 shadow-sm active:scale-95"
                      aria-label="Témoignage suivant"
                    >
                      <ChevronRight size={20} strokeWidth={2.5} />
                    </button>
                  </div>

                </div>

              </div>
            ) : (
              <div className="bg-white rounded-3xl p-8 border border-slate-100 text-center shadow-sm">
                <p className="text-slate-500 font-medium">Aucun témoignage disponible pour le moment.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}

