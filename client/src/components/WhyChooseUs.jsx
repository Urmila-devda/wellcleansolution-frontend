import React from 'react';
import { FiAward, FiUsers, FiTruck, FiTag } from 'react-icons/fi';

const features = [
  {
    id: 'quality',
    icon: <FiAward />,
    title: 'High Quality Products',
    desc: 'Formulated with premium active agents and natural concentrates to deliver professional, industrial-grade hygiene.',
    colorBg: 'bg-brand-soft-blue text-brand-blue',
    hoverGlow: 'hover:shadow-brand-blue/10 hover:border-brand-blue/30'
  },
  {
    id: 'trusted',
    icon: <FiUsers />,
    title: 'Trusted by Customers',
    desc: 'With verified 4.9/5 star ratings across thousands of households, we are Thane\'s chosen name for safe sanitation.',
    colorBg: 'bg-brand-soft-green text-brand-green',
    hoverGlow: 'hover:shadow-brand-green/10 hover:border-brand-green/30'
  },
  {
    id: 'delivery',
    icon: <FiTruck />,
    title: 'Fast Delivery',
    desc: 'Secure nationwide shipping with real-time tracking, ensuring your sanitization supplies arrive safely right to your doorstep.',
    colorBg: 'bg-amber-50 text-amber-600',
    hoverGlow: 'hover:shadow-amber-500/10 hover:border-amber-500/30'
  },
  {
    id: 'pricing',
    icon: <FiTag />,
    title: 'Affordable Pricing',
    desc: 'Direct-to-consumer value without middleman markup. Premium concentrated formulations that save you money per wash.',
    colorBg: 'bg-purple-50 text-purple-600',
    hoverGlow: 'hover:shadow-purple-500/10 hover:border-purple-500/30'
  }
];

export default function WhyChooseUs() {
  return (
    <section id="why-choose-us" className="py-20 bg-white font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold text-brand-blue uppercase tracking-widest bg-brand-soft-blue px-3 py-1 rounded-full">
            Our Key Brand Pillars
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
            Why Choose Well Clean Solutions
          </h2>
          <p className="text-sm sm:text-base text-slate-550 max-w-xl mx-auto font-semibold">
            We bridge the gap between heavy-duty cleaning science and family safety, ensuring clean spaces with total peace of mind.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feat) => (
            <div 
              key={feat.id}
              className={`p-8 bg-slate-50/50 hover:bg-white border border-slate-100 rounded-2xl transition-all duration-300 hover:scale-[1.03] ${feat.hoverGlow}`}
            >
              {/* Icon Container */}
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-6 shadow-inner ${feat.colorBg}`}>
                {feat.icon}
              </div>

              {/* Title & Description */}
              <h3 className="font-bold text-slate-800 text-base mb-3 leading-snug">
                {feat.title}
              </h3>
              <p className="text-slate-500 text-xs leading-relaxed font-semibold">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
