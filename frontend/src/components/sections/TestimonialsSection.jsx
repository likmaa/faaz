import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Quote, Star, ShieldCheck, Heart } from 'lucide-react';
import Loading from '../ui/Loading';
import api from '../../services/api';

/* ─── données de repli ─── */
const fallbackData = [
  {
    id: 1,
    nom: 'Ablavi G.',
    role: 'Secrétaire Générale, Orphelinat Saint Dominique',
    montant: null,
    message:
      "Grâce au projet « Chaque orphelin à l'école » de la FAAZ, 122 enfants ont pu s'inscrire cette année avec toutes leurs fournitures scolaires. C'est un suivi continu qui change des vies.",
    variant: 'dark',
  },
  {
    id: 2,
    nom: 'Koffi M.',
    role: 'Donateur actif, Diaspora Béninoise (Paris)',
    montant: '50 000',
    message:
      "La transparence financière absolue de la fondation est ce qui m'a convaincu. Chaque franc versé est tracé et on suit l'avancement des projets en temps réel sur le site.",
    variant: 'light',
  },
  {
    id: 3,
    nom: 'Dr. Saliou B.',
    role: 'Coordinateur des campagnes médicales (Porto-Novo)',
    montant: null,
    message:
      "Les consultations gratuites organisées par la FAAZ permettent d'apporter des soins de base à des populations isolées. L'engagement des bénévoles est tout simplement admirable.",
    variant: 'dark',
  },
];

/* ─── Carte individuelle pour le Stack ─── */
function StackedCard({ testimonial, index, total, progress }) {
  const isDark = (testimonial.variant ?? (index % 2 === 0 ? 'dark' : 'light')) === 'dark';

  /*
   * ANIMATION APPLE-STYLE ULTRA PREMIUM :
   * Au lieu de rendre la carte transparente (opacity) ce qui laisse voir à travers,
   * on utilise un "overlay" noir (darkOverlay) qui s'assombrit pour simuler l'ombre.
   */
  const segmentSize = 1 / total;
  const enterStart = index * segmentSize;
  const enterEnd = enterStart + segmentSize;

  // 1. Entrée (Y)
  const yRange = index === 0 ? [0, 1] : [enterStart, enterEnd];
  const yOutput = index === 0 ? [0, 0] : [1200, 0];
  const y = useTransform(progress, yRange, yOutput);

  // 2. Scale (Profondeur)
  const scaleInput = [0, enterEnd];
  const scaleOutput = [1, 1];
  for (let j = index + 1; j < total; j++) {
    scaleInput.push(j * segmentSize + segmentSize);
    scaleOutput.push(1 - (j - index) * 0.05); 
  }
  if (scaleInput[scaleInput.length - 1] < 1) {
    scaleInput.push(1);
    scaleOutput.push(scaleOutput[scaleOutput.length - 1]);
  }
  const scale = useTransform(progress, scaleInput, scaleOutput);

  // 3. Décalage vers le haut (Stacking gap)
  const yOffsetInput = [0, enterEnd];
  const yOffsetOutput = [0, 0];
  for (let j = index + 1; j < total; j++) {
    yOffsetInput.push(j * segmentSize + segmentSize);
    yOffsetOutput.push(-(j - index) * 40); // 40px d'espacement au sommet
  }
  if (yOffsetInput[yOffsetInput.length - 1] < 1) {
    yOffsetInput.push(1);
    yOffsetOutput.push(yOffsetOutput[yOffsetOutput.length - 1]);
  }
  const yOffset = useTransform(progress, yOffsetInput, yOffsetOutput);

  // 4. Inclinaison 3D (Tilt arrière)
  const rotateXInput = [0, enterEnd];
  const rotateXOutput = [0, 0];
  for (let j = index + 1; j < total; j++) {
    rotateXInput.push(j * segmentSize + segmentSize);
    rotateXOutput.push((j - index) * 2); // Penche de 2 degrés vers l'arrière
  }
  if (rotateXInput[rotateXInput.length - 1] < 1) {
    rotateXInput.push(1);
    rotateXOutput.push(rotateXOutput[rotateXOutput.length - 1]);
  }
  const rotateX = useTransform(progress, rotateXInput, rotateXOutput);

  // 5. Overlay sombre (Simule l'ombre des cartes du dessus SANS transparence globale)
  const darkOverlayInput = [0, enterEnd];
  const darkOverlayOutput = [0, 0];
  for (let j = index + 1; j < total; j++) {
    darkOverlayInput.push(j * segmentSize + segmentSize);
    darkOverlayOutput.push((j - index) * 0.15); // L'overlay noir monte à 15%, 30%, etc.
  }
  if (darkOverlayInput[darkOverlayInput.length - 1] < 1) {
    darkOverlayInput.push(1);
    darkOverlayOutput.push(darkOverlayOutput[darkOverlayOutput.length - 1]);
  }
  const darkOverlayOpacity = useTransform(progress, darkOverlayInput, darkOverlayOutput);

  // 6. Ombre portée dynamique pour la carte active
  const boxShadow = useTransform(
    progress,
    yRange,
    index === 0
      ? ['0px 30px 60px -15px rgba(0,0,0,0)', '0px 30px 60px -15px rgba(0,0,0,0)']
      : ['0px 0px 0px 0px rgba(0,0,0,0)', '0px 40px 80px -20px rgba(0,0,0,0.4)']
  );

  return (
    <motion.div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: index + 1,
        y,
        scale,
        marginTop: yOffset,
        rotateX,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transformOrigin: "top center",
        perspective: "1000px" // Pour le rotateX
      }}
    >
      <motion.div
        style={{ boxShadow: isDark ? boxShadow : undefined }}
        className={`relative w-full max-w-2xl rounded-[2.5rem] border overflow-hidden p-6 sm:p-8 transition-colors duration-500 ${
          isDark
            ? 'bg-slate-900 border-white/10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)]'
            : 'bg-white border-slate-100 shadow-[0_40px_80px_-20px_rgba(15,23,42,0.15)]'
        }`}
      >
        {/* Overlay sombre dynamique pour la profondeur (empêche la carte de devenir transparente) */}
        <motion.div 
          style={{ opacity: darkOverlayOpacity }}
          className="absolute inset-0 bg-black z-20 pointer-events-none"
        />

        {/* Dégradé décoratif */}
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-0 z-0 rounded-[2rem] ${
            isDark
              ? 'bg-[radial-gradient(ellipse_70%_50%_at_100%_0%,rgba(34,197,94,0.10),transparent_60%)]'
              : 'bg-[radial-gradient(ellipse_70%_50%_at_0%_100%,rgba(14,165,233,0.07),transparent_60%)]'
          }`}
        />
        {/* Guillemet géant */}
        <Quote
          aria-hidden
          className={`absolute -top-1 right-6 h-20 w-20 opacity-[0.05] ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}
        />

        <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
          {/* Avatar */}
          <div className="flex flex-row sm:flex-col items-center sm:items-start gap-3 flex-shrink-0">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-xl flex-shrink-0 ${
                isDark
                  ? 'bg-gradient-to-br from-primary-600 to-secondary-700'
                  : 'bg-gradient-to-br from-primary-500 to-secondary-500'
              }`}
            >
              {(testimonial.nom || 'A')[0].toUpperCase()}
            </div>
            <div>
              <p
                className={`font-black text-base tracking-tight leading-tight ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                {testimonial.nom || 'Anonyme'}
              </p>
              <p
                className={`mt-0.5 text-xs font-semibold leading-snug max-w-[140px] ${
                  isDark ? 'text-slate-400' : 'text-slate-400'
                }`}
              >
                {testimonial.role || 'Soutien'}
              </p>
            </div>
          </div>

          {/* Contenu */}
          <div className="flex flex-col gap-3 flex-1 overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex gap-1" aria-label="5 étoiles sur 5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={
                      isDark
                        ? 'fill-emerald-400 text-emerald-400'
                        : 'fill-amber-400 text-amber-400'
                    }
                  />
                ))}
              </div>
              {testimonial.montant && (
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-full ${
                    isDark
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                  }`}
                >
                  <Heart size={12} className="fill-current" />
                  Donateur
                </span>
              )}
            </div>

            <blockquote
              className={`text-base leading-[1.6] font-medium max-h-[35vh] overflow-y-auto pr-2 ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              } [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-400/30 [&::-webkit-scrollbar-thumb]:rounded-full`}
            >
              &ldquo;{testimonial.message || 'Merci pour votre soutien.'}&rdquo;
            </blockquote>

            <div className="flex items-center gap-2 mt-2">
              <div
                className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                  isDark ? 'bg-primary-500 text-white' : 'bg-primary-600 text-white'
                }`}
              >
                ✓
              </div>
              <span
                className={`text-[10px] font-black uppercase tracking-widest ${
                  isDark ? 'text-slate-500' : 'text-slate-400'
                }`}
              >
                Témoignage vérifié
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── section principale ─── */
export default function TestimonialsSection() {
  const containerRef = useRef(null);

  const { data: testimonials = fallbackData, isLoading } = useQuery({
    queryKey: ['home-temoignages'],
    queryFn: async () => {
      try {
        const res = await api.get('/temoignages?limit=5');
        const list = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.results)
          ? res.data.results
          : res.data?.data || [];
        return list.length > 0 ? list : fallbackData;
      } catch {
        return fallbackData;
      }
    },
    staleTime: 1000 * 60,
  });

  const total = testimonials.length;

  /*
   * On capture le scroll sur l'ensemble du grand conteneur
   */
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Physique de ressort (Spring) pour lisser le scroll de façon premium !
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120, // Plus c'est haut, plus ça suit vite la souris
    damping: 24,    // Amortissement (pas trop d'élasticité)
    restDelta: 0.001
  });

  if (isLoading) {
    return (
      <section className="py-28 bg-slate-50 flex items-center justify-center border-t border-slate-100">
        <Loading text="Chargement des témoignages..." />
      </section>
    );
  }

  return (
    <section className="bg-slate-50 relative border-t border-slate-100" id="testimonials-section">
      {/* Décorations de fond */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.25]" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-100/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-secondary-100/20 rounded-full blur-[100px]" />
      </div>

      {/*
       * LE CONTENEUR GÉANT
       * Sa hauteur dépend du nombre de cartes. (Ex: 100vh par carte)
       * Cela nous donne le "temps" de scroller pour déclencher toutes les animations.
       */}
      <div 
        ref={containerRef} 
        style={{ height: `${total * 100}vh` }} 
        className="relative w-full"
      >
        {/*
         * LE STICKY WRAPPER
         * Ce bloc fait la taille de l'écran et reste collé.
         * À l'intérieur, l'animation se déroule.
         */}
        <div className="sticky top-0 h-screen w-full flex flex-col justify-center overflow-hidden">
          
          {/* Header */}
          <div className="absolute top-0 inset-x-0 z-20 px-6 sm:px-10 lg:px-16 pt-20">
            <div className="mx-auto max-w-5xl flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-50 border border-primary-100 text-primary-700 text-[11px] font-bold uppercase tracking-wider mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
                  Voix du terrain
                </div>
                <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight font-heading leading-[1.05]">
                  Pourquoi ils soutiennent{' '}
                  <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                    la FAAZ.
                  </span>
                </h2>
              </div>
              
              <div className="flex flex-col gap-3 self-start lg:self-auto hidden md:flex">
                {[
                  { icon: ShieldCheck, label: 'Transparence totale' },
                  { icon: Heart, label: 'Impact direct' },
                ].map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-3 bg-white/80 backdrop-blur-sm border border-slate-100 rounded-2xl px-4 py-2.5 shadow-sm"
                  >
                    <div className="w-8 h-8 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center flex-shrink-0">
                      <Icon size={16} strokeWidth={2} />
                    </div>
                    <p className="text-sm font-extrabold text-slate-800 font-body">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Les cartes */}
          <div className="relative w-full h-full flex items-center justify-center px-6 mt-16 md:mt-24">
            <div className="relative w-full max-w-2xl h-[400px]">
              {testimonials.map((testimonial, i) => (
                <StackedCard
                  key={testimonial.id ?? i}
                  testimonial={testimonial}
                  index={i}
                  total={total}
                  progress={smoothProgress}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
