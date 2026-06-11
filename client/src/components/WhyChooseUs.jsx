import React from 'react';
import { FiAward, FiShield, FiTrendingUp, FiTruck } from 'react-icons/fi';

const features = [
  {
    id: 'premium',
    icon: <FiAward />,
    title: 'Premium Quality Products',
    desc: 'Formulated with high-grade surfactants and natural concentrates to deliver professional-grade cleaning results.',
    colorBg: 'bg-brand-soft-blue text-brand-blue',
    hoverGlow: 'hover:shadow-brand-blue/10 hover:border-brand-blue/30'
  },
  {
    id: 'germ',
    icon: <FiShield />,
    title: 'Effective Germ Protection',
    desc: 'Lab-tested formulas that eliminate 99.9% of bacteria and household pathogens, keeping your family safe.',
    colorBg: 'bg-brand-soft-green text-brand-green',
    hoverGlow: 'hover:shadow-brand-green/10 hover:border-brand-green/30'
  },
  {
    id: 'eco',
    icon: <FiTrendingUp />,
    title: 'Eco-Friendly Ingredients',
    desc: 'Biodegradable, plant-based ingredients packaged in recyclable materials that reduce environmental impact.',
    colorBg: 'bg-purple-50 text-purple-600',
    hoverGlow: 'hover:shadow-purple-500/10 hover:border-purple-500/30'
  },
  {
    id: 'delivery',
    icon: <FiTruck />,
    title: 'Fast & Secure Delivery',
    desc: 'Reliable nationwide shipping with real-time tracking, ensuring your hygiene supplies arrive when needed.',
    colorBg: 'bg-amber-50 text-amber-600',
    hoverGlow: 'hover:shadow-amber-500/10 hover:border-amber-500/30'
  }
];

export default function WhyChooseUs() {
  return (
    <section id="why-choose-us" className="py-20 bg-white font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold text-brand-blue uppercase tracking-widest bg-brand-soft-blue px-3 py-1 rounded-full">
            Why Well Clean Solutions
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
            Designed for Clean Living, Better Living
          </h2>
          <p className="text-sm sm:text-base text-slate-500 max-w-xl mx-auto">
            We combine high-potency sanitation science with eco-friendly integrity to provide cleaning products that you can trust.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feat) => (
            <div 
              key={feat.id}
              className={`p-8 bg-slate-50/50 hover:bg-white border border-slate-100 hover:scale-105 rounded-2xl transition-all duration-300 ${feat.hoverGlow}`}
            >
              {/* Icon Container */}
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-6 shadow-sm ${feat.colorBg}`}>
                {feat.icon}
              </div>

              {/* Title & Description */}
              <h3 className="font-bold text-slate-800 text-base mb-3 leading-snug">
                {feat.title}
              </h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
