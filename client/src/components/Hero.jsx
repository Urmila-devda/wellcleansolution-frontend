import React from 'react';
import { FiArrowRight, FiShield, FiSmile, FiPackage } from 'react-icons/fi';
import heroBg from '../assets/hero_bg.png';

export default function Hero() {
  const scrollToProducts = () => {
    const el = document.getElementById('products');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToAbout = () => {
    const el = document.getElementById('about-us');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative bg-gradient-premium overflow-hidden min-h-[85vh] flex items-center pt-8 pb-16 font-sans">
      
      {/* Background blobs for premium layout depth */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-brand-soft-blue rounded-full filter blur-3xl opacity-60 animate-pulse-subtle -z-10" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-brand-soft-green rounded-full filter blur-3xl opacity-50 animate-pulse-subtle -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headline copy */}
          <div className="lg:col-span-6 space-y-6 md:space-y-8 text-center lg:text-left animate-fade-in-up">
            
            {/* Promo Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-brand-blue/10 border border-brand-blue/20 rounded-full text-brand-blue text-xs font-bold tracking-wide uppercase">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-blue opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-blue"></span>
              </span>
              Premium Hygiene & Care
            </div>

            {/* Big Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-800 leading-[1.1] tracking-tight">
              Keep Your Home <br />
              <span className="text-gradient">Spotless & Fresh</span> <br />
              with Well Clean Solutions
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
              Premium cleaning solutions for every corner of your home. Unleash the power of eco-friendly hygiene that defends against germs and respects the environment.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button 
                onClick={scrollToProducts}
                className="w-full sm:w-auto px-8 py-4 bg-brand-blue hover:bg-brand-blue-hover text-white rounded-full font-bold transition-all shadow-md shadow-brand-blue/20 hover:shadow-lg hover:shadow-brand-blue/30 flex items-center justify-center gap-2 group"
              >
                <span>Shop Now</span>
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={scrollToAbout}
                className="w-full sm:w-auto px-8 py-4 bg-white border border-slate-200 text-slate-700 hover:text-brand-blue hover:border-brand-blue/30 rounded-full font-bold transition-all hover:bg-slate-50 flex items-center justify-center gap-2"
              >
                <span>Explore Products</span>
              </button>
            </div>

            {/* Floating Trust Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200/80 max-w-md mx-auto lg:mx-0">
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <FiShield className="text-brand-green text-xl flex-shrink-0" />
                <div className="text-left">
                  <p className="text-xs font-black text-slate-800">99.9%</p>
                  <p className="text-[10px] text-slate-400 font-bold">Germ Kill Rate</p>
                </div>
              </div>
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <FiSmile className="text-brand-blue text-xl flex-shrink-0" />
                <div className="text-left">
                  <p className="text-xs font-black text-slate-800">Eco Friendly</p>
                  <p className="text-[10px] text-slate-400 font-bold">Ingredients</p>
                </div>
              </div>
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <FiPackage className="text-amber-500 text-xl flex-shrink-0" />
                <div className="text-left">
                  <p className="text-xs font-black text-slate-800">Fast Delivery</p>
                  <p className="text-[10px] text-slate-400 font-bold">Nationwide</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Image with Floating Elements */}
          <div className="lg:col-span-6 relative flex justify-center items-center">
            
            {/* Main Image Container */}
            <div className="relative w-full max-w-lg aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-50/50 animate-float">
              <img 
                src={heroBg} 
                alt="Well Clean Solutions Modern Home Environment" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />
            </div>

            {/* Badge overlay 1 */}
            <div className="absolute -left-4 top-1/4 glassmorphism p-3 rounded-2xl shadow-lg border border-white/40 flex items-center gap-3 animate-float-slow max-w-[180px]">
              <span className="w-8 h-8 rounded-full bg-brand-green/20 flex items-center justify-center text-brand-green font-bold text-base">🌱</span>
              <div>
                <h4 className="text-xs font-bold text-slate-800">Safe for Families</h4>
                <p className="text-[9px] text-slate-500">Non-toxic, herbal formula</p>
              </div>
            </div>

            {/* Badge overlay 2 */}
            <div className="absolute -right-4 bottom-1/4 glassmorphism p-3.5 rounded-2xl shadow-lg border border-white/40 flex items-center gap-3 animate-float max-w-[200px]">
              <span className="w-9 h-9 rounded-full bg-brand-blue/20 flex items-center justify-center text-brand-blue text-lg">⭐</span>
              <div>
                <h4 className="text-xs font-extrabold text-slate-800">4.9/5 Average Rating</h4>
                <p className="text-[9px] text-slate-500">Over 10,000+ happy homes</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
