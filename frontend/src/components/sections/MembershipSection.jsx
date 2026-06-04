import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Users, Vote, BookOpen } from 'lucide-react';

const AVANTAGES = [
  { Icon: Vote,       label: 'Droit de vote en Assemblée Générale' },
  { Icon: BookOpen,   label: 'Accès aux rapports d\'impact et bilans financiers' },
  { Icon: Users,      label: 'Faire partie d\'une communauté engagée (Bénin + diaspora)' },
  { Icon: CheckCircle,label: 'Participer aux décisions stratégiques de la fondation' },
];

export default function MembershipSection() {
  return (
    <section className="bg-white py-24 border-t border-gray-100">
      <div className="mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Texte gauche */}
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-primary-600 block mb-4">
              Rejoindre la fondation
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl leading-[1.1] font-extrabold text-gray-900 tracking-tight font-heading mb-5">
              Devenez membre.<br />
              <span className="text-primary-600">Contribuez à la décision.</span>
            </h2>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed mb-8 font-body">
              La FAAZ est une fondation à membres. En adhérant, vous ne vous contentez pas de soutenir — vous participez activement à la gouvernance, aux orientations et à la vie de la fondation.
            </p>

            {/* Avantages */}
            <ul className="space-y-3 mb-8">
              {AVANTAGES.map(({ Icon, label }) => (
                <li key={label} className="flex items-center gap-3">
                  <Icon size={17} className="text-primary-600 flex-shrink-0" strokeWidth={2} />
                  <span className="text-gray-700 text-sm">{label}</span>
                </li>
              ))}
            </ul>

            <Link
              to="/join-us"
              className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold px-7 py-3.5 rounded-full text-sm transition shadow-lg"
            >
              Adhérer à la FAAZ
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>

          {/* Tarifs droite */}
          <div className="grid sm:grid-cols-2 gap-5">
            {/* Droit d'adhésion */}
            <div className="bg-primary-50 border border-primary-100 rounded-2xl p-6">
              <p className="text-primary-600 text-xs font-semibold uppercase tracking-wider mb-2">Droit d'adhésion</p>
              <p className="text-4xl font-extrabold text-gray-900 mb-1">10 000</p>
              <p className="text-primary-600 text-sm font-semibold mb-3">FCFA <span className="text-gray-400 font-normal">≈ 15 €</span></p>
              <p className="text-gray-500 text-xs leading-relaxed">
                Versement unique à l'inscription. Donne accès à la qualité de membre après validation du Conseil d'Administration.
              </p>
            </div>

            {/* Cotisation annuelle */}
            <div className="bg-primary-600 rounded-2xl p-6 shadow-xl">
              <p className="text-primary-200 text-xs font-semibold uppercase tracking-wider mb-2">Cotisation annuelle</p>
              <p className="text-4xl font-extrabold text-white mb-1">25 000</p>
              <p className="text-primary-200 text-sm font-semibold mb-3">FCFA <span className="text-white/50 font-normal">≈ 40 €</span></p>
              <p className="text-primary-100 text-xs leading-relaxed">
                À régler avant le <strong className="text-white">30 juin</strong> de chaque exercice. Maintient vos droits de membre actif.
              </p>
            </div>

            {/* Bénévolat */}
            <div className="sm:col-span-2 bg-gray-50 border border-gray-200 rounded-2xl p-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-gray-800 font-semibold text-sm mb-1">Pas encore prêt à adhérer ?</p>
                <p className="text-gray-500 text-xs">Contribuez en tant que bénévole — votre temps est aussi précieux.</p>
              </div>
              <Link
                to="/volunteering"
                className="flex-shrink-0 text-sm font-semibold text-primary-600 border border-primary-200 px-4 py-2 rounded-full hover:bg-primary-50 transition"
              >
                Devenir bénévole
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
