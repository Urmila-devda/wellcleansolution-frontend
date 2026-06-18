import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiShield, FiSmile, FiPackage } from 'react-icons/fi';
import heroBg from '../assets/hero_bg.png';

export default function Hero() {
  const navigate = useNavigate();

  const handleShopNow = () => {
    navigate('/products');
  };

  const handleContactUs = () => {
    const el = document.getElementById('contact-us');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/', { state: { scrollToContact: true } });
    }
  };

  return (
    <section id="hero" className="relative bg-gradient-premium overflow-hidden min-h-[80vh] flex items-center pt-12 pb-20 font-sans">
      
      {/* Visual Background Glow Blobs */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-brand-soft-blue rounded-full filter blur-[120px] opacity-70 animate-pulse-subtle -z-10" />
      <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-brand-soft-green rounded-full filter blur-[120px] opacity-60 animate-pulse-subtle -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Headline and Copy Panel */}
          <div className="lg:col-span-6 space-y-6 md:space-y-8 text-center lg:text-left animate-fade-in-up">
            
            {/* Trust Badge Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur border border-slate-100 shadow-sm rounded-full text-brand-blue text-xs font-bold uppercase tracking-wider">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-blue opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-blue"></span>
              </span>
              Premium Hygiene & Home Care
            </div>

            {/* Core Commercial Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-800 leading-[1.1] tracking-tight">
              Keep Your Space <br />
              <span className="text-gradient">Spotless & Healthy</span> <br />
              with Well Clean Solutions
            </h1>

            {/* Subheading copy */}
            <p className="text-sm sm:text-base text-slate-500 font-semibold leading-relaxed max-w-xl mx-auto lg:mx-0">
              Discover high-performance, professional-grade cleaning formulations designed to protect your family from germs while keeping your home spotless. Pure hygiene with zero compromises.
            </p>

            {/* Direct Action CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button 
                onClick={handleShopNow}
                className="w-full sm:w-auto px-8 py-4 bg-brand-blue hover:bg-brand-blue-hover text-white rounded-full font-bold transition-all shadow-lg shadow-brand-blue/25 hover:shadow-brand-blue/35 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Shop Now</span>
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={handleContactUs}
                className="w-full sm:w-auto px-8 py-4 bg-white border border-slate-200 text-slate-700 hover:text-brand-blue hover:border-brand-blue/45 rounded-full font-bold transition-all hover:bg-slate-50 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <span>Contact Us</span>
              </button>
            </div>

            {/* Floating Quality Assurance Row */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-250/60 max-w-md mx-auto lg:mx-0 text-left">
              <div className="flex items-center gap-2.5">
                <FiShield className="text-brand-green text-xl flex-shrink-0" />
                <div>
                  <p className="text-xs font-black text-slate-850">99.9%</p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Germ Kill Rate</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <FiSmile className="text-brand-blue text-xl flex-shrink-0" />
                <div>
                  <p className="text-xs font-black text-slate-850">Non-Toxic</p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Formulations</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <FiPackage className="text-amber-500 text-xl flex-shrink-0" />
                <div>
                  <p className="text-xs font-black text-slate-850">Fast Shipping</p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Nationwide</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Environment Visual Image */}
          <div className="lg:col-span-6 relative flex justify-center items-center">
            
            {/* Picture Stage Frame */}
            <div className="relative w-full max-w-lg aspect-square rounded-3xl overflow-hidden shadow-2xl border-[6px] border-white bg-slate-50/50 animate-float">
              <img 
                src={heroBg} 
                alt="Well Clean Solutions Premium Home Environment" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent" />
            </div>

            {/* Floating Trust Indicator Badge 1 */}
            <div className="absolute -left-4 top-1/4 glassmorphism p-3.5 rounded-2xl shadow-lg border border-white/50 flex items-center gap-3 animate-float-slow max-w-[190px]">
              <span className="w-9 h-9 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green font-bold text-lg">🌱</span>
              <div>
                <h4 className="text-xs font-bold text-slate-800">100% Organic</h4>
                <p className="text-[9px] text-slate-500 font-semibold">Herbal & Non-Toxic</p>
              </div>
            </div>

            {/* Floating Trust Indicator Badge 2 */}
            <div className="absolute -right-4 bottom-1/4 glassmorphism p-3.5 rounded-2xl shadow-lg border border-white/50 flex items-center gap-3 animate-float max-w-[210px]">
              <span className="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue text-xl">⭐</span>
              <div>
                <h4 className="text-xs font-extrabold text-slate-800">4.9/5 Rating</h4>
                <p className="text-[9px] text-slate-500 font-semibold">Trusted by 10k+ Homes</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
