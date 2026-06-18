import React from 'react';
import { FiCheck } from 'react-icons/fi';
import aboutHome from '../assets/about_home.png';

export default function AboutUs() {
  const bulletPoints = [
    'Highly effective active cleaning agents',
    'Tough on stains, safe for toddlers and pets',
    'Certified 99.9% germ protection formulas',
    'Proudly manufactured with cruelty-free practices'
  ];

  return (
    <section id="about-us" className="py-20 bg-white font-sans scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Story copy */}
          <div className="lg:col-span-6 space-y-6 md:space-y-8 text-center lg:text-left">
            <div className="space-y-4">
              <span className="text-xs font-bold text-brand-blue uppercase tracking-widest bg-brand-soft-blue px-3 py-1 rounded-full">
                About Well Clean Solutions
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight leading-tight">
                Dedicated to a Healthier, <br />
                Cleaner Lifestyle
              </h2>
              <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
                Well Clean Solutions is dedicated to providing high-quality cleaning and hygiene products that help families maintain a healthier and cleaner lifestyle. We believe that clean living leads to better living, which is why we research and formulate high-performance detergents that deliver outstanding performance without compromise.
              </p>
            </div>

            {/* Bullet List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto lg:mx-0 text-left">
              {bulletPoints.map((point, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-brand-soft-green text-brand-green flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FiCheck className="text-xs" />
                  </span>
                  <span className="text-xs font-semibold text-slate-600">{point}</span>
                </div>
              ))}
            </div>

            {/* Small stats layout */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-100 max-w-md mx-auto lg:mx-0">
              <div>
                <h4 className="text-2xl font-black text-brand-blue">15+</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Years of Research</p>
              </div>
              <div>
                <h4 className="text-2xl font-black text-brand-green">1M+</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Homes Cleaned</p>
              </div>
              <div>
                <h4 className="text-2xl font-black text-amber-500">100%</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Satisfaction Guarantee</p>
              </div>
            </div>
          </div>

          {/* Right Column: High-quality Image */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-full max-w-lg aspect-4/3 rounded-3xl overflow-hidden shadow-xl border border-slate-100">
              <img 
                src={aboutHome} 
                alt="Well Clean Solutions Immaculate Living Room interior" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent pointer-events-none" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
