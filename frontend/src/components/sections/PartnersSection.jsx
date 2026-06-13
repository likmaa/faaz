import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { Globe, Droplet, Sun, GraduationCap, Activity, Sprout, Handshake } from 'lucide-react';

const fallbackPartners = [
  { 
    id: 1, 
    name: 'UNICEF Bénin', 
    type: 'Institution', 
    Icon: Globe, 
    colorClass: 'text-sky-600',
    bgClass: 'bg-sky-50',
    borderClass: 'border-sky-100',
  },
  { 
    id: 2, 
    name: 'Fondation Eau & Vie', 
    type: 'ONG internationale', 
    Icon: Droplet, 
    colorClass: 'text-blue-600',
    bgClass: 'bg-blue-50',
    borderClass: 'border-blue-100',
  },
  { 
    id: 3, 
    name: 'SolarVillage', 
    type: 'Entreprise sociale', 
    Icon: Sun, 
    colorClass: 'text-amber-500',
    bgClass: 'bg-amber-50',
    borderClass: 'border-amber-100',
  },
  { 
    id: 4, 
    name: 'EduPlus', 
    type: 'Association éducation', 
    Icon: GraduationCap, 
    colorClass: 'text-emerald-600',
    bgClass: 'bg-emerald-50',
    borderClass: 'border-emerald-100',
  },
  { 
    id: 5, 
    name: 'HealthLink', 
    type: 'Programme de santé', 
    Icon: Activity, 
    colorClass: 'text-red-500',
    bgClass: 'bg-red-50',
    borderClass: 'border-red-100',
  },
  { 
    id: 6, 
    name: 'AgriDev Bénin', 
    type: 'Partenaire local', 
    Icon: Sprout, 
    colorClass: 'text-green-600',
    bgClass: 'bg-green-50',
    borderClass: 'border-green-100',
  }
];

export default function PartnersSection() {
  const { data: partnersList = [] } = useQuery({
    queryKey: ['partners'],
    queryFn: async () => {
      try {
        const res = await api.get('/partners/');
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
    staleTime: 1000 * 60 * 10
  });

  const displayList = partnersList.length > 0 ? partnersList : fallbackPartners;
  
  // Pour l'effet infini, on duplique la liste plusieurs fois
  const duplicatedList = [...displayList, ...displayList, ...displayList, ...displayList];
  const reversedList = [...duplicatedList].reverse();

  const renderCard = (p, index) => {
    let logoUrl = p.logo || '';
    if (logoUrl && !logoUrl.startsWith('http')) {
      const apiBase = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace(/\/api$/, '');
      logoUrl = `${apiBase}${logoUrl}`;
    }

    const colorClass = p.colorClass || 'text-primary-600';
    const bgClass = p.bgClass || 'bg-primary-50';
    const borderClass = p.borderClass || 'border-primary-100';
    const IconComponent = p.Icon || Handshake;
    const typeText = p.type || 'Partenaire';

    return (
      <a 
        key={`${p.id}-${index}`}
        href={p.link || '#'}
        target={p.link ? '_blank' : undefined}
        rel={p.link ? 'noopener noreferrer' : undefined}
        className="group relative flex items-center gap-5 p-4 pr-10 bg-white/70 backdrop-blur-md border border-white/40 shadow-xl shadow-slate-200/20 rounded-[2rem] min-w-[320px] hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary-600/10 hover:bg-white transition-all duration-500 ease-out overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-100 -translate-x-full group-hover:translate-x-full transition-all duration-1000 ease-in-out" />
        
        <div className={`w-14 h-14 rounded-2xl ${bgClass} border ${borderClass} flex items-center justify-center flex-shrink-0 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3 overflow-hidden ${colorClass}`}>
          {p.logo ? (
            <img 
              src={logoUrl} 
              alt={p.name} 
              className="w-full h-full object-contain p-2" 
            />
          ) : (
            <IconComponent size={24} strokeWidth={2.5} />
          )}
        </div>
        <div>
          <p className="text-sm font-black text-slate-800 leading-tight group-hover:text-primary-600 transition-colors font-body">
            {p.name}
          </p>
          <p className="text-[10px] font-bold text-slate-400 mt-1 tracking-widest uppercase font-body">
            {typeText}
          </p>
        </div>
      </a>
    );
  };

  return (
    <section className="py-32 bg-slate-50 relative overflow-hidden" id="partners-section">
      {/* Motifs de fond (Dotted pattern) */}
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.25] pointer-events-none" />
      
      {/* Dégradés décoratifs de fond pour effet "Premium" */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-r from-primary-200/30 to-secondary-200/30 rounded-[100%] blur-[100px] pointer-events-none opacity-50 mix-blend-multiply" />

      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-12 relative z-10">
        
        {/* En-tête de section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-20 gap-10">
          <div className="lg:w-1/2">
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xs font-black uppercase tracking-[0.2em] text-primary-600 block mb-5"
            >
              Réseau de Confiance
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl leading-[1.05] font-black text-slate-900 tracking-tight font-heading"
            >
              Ils soutiennent <br />
              <span className="bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
                notre mission.
              </span>
            </motion.h2>
          </div>
          <div className="lg:w-1/3">
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-slate-500 text-base lg:text-lg leading-relaxed font-medium"
            >
              Un réseau engagé d'organisations certifiées qui nous soutiennent pour pérenniser chaque projet et maximiser l'impact direct sur le terrain.
            </motion.p>
          </div>
        </div>

      </div>

      {/* Carrousels Infinis (Marquee) */}
      <div className="relative w-full z-20 flex flex-col gap-6 mt-10">
        
        {/* Lignes de fondu (Fade edges) pour cacher les bords */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-slate-50 to-transparent z-30 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-slate-50 to-transparent z-30 pointer-events-none" />

        {/* Ligne 1 : Défilement vers la gauche */}
        <div className="flex w-full overflow-hidden">
          <motion.div 
            animate={{ x: ["0%", "-50%"] }}
            transition={{ ease: "linear", duration: 80, repeat: Infinity }}
            className="flex gap-6 pr-6 w-max"
          >
            {duplicatedList.map((p, i) => renderCard(p, i))}
          </motion.div>
        </div>

        {/* Ligne 2 : Défilement vers la droite */}
        <div className="flex w-full overflow-hidden">
          <motion.div 
            animate={{ x: ["-50%", "0%"] }}
            transition={{ ease: "linear", duration: 95, repeat: Infinity }}
            className="flex gap-6 pr-6 w-max"
          >
            {reversedList.map((p, i) => renderCard(p, i))}
          </motion.div>
        </div>

      </div>

    </section>
  );
}
