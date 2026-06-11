import React, { useState, useEffect } from 'react';
import { FiPercent, FiClock, FiTag } from 'react-icons/fi';

export default function PromoBanner({ onApplyCoupon }) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59
  });
  const [couponApplied, setCouponApplied] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          clearInterval(interval);
          return prev;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleApply = () => {
    onApplyCoupon();
    setCouponApplied(true);
    setTimeout(() => setCouponApplied(false), 3000);
  };

  const formatNum = (num) => String(num).padStart(2, '0');

  return (
    <section id="promo-banner" className="py-12 bg-white font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner Card */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-blue-green p-8 sm:p-12 lg:p-16 text-white shadow-xl flex flex-col lg:flex-row justify-between items-center gap-8">
          
          {/* Background overlay design details */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full filter blur-2xl -z-10 translate-x-20 -translate-y-20" />
          <div className="absolute -bottom-10 -left-10 w-96 h-96 bg-brand-green/20 rounded-full filter blur-3xl -z-10" />

          {/* Left Panel */}
          <div className="space-y-4 max-w-xl text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider">
              <FiPercent className="text-sm" />
              Limited Time Special
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight">
              Up to 25% OFF on <br className="hidden sm:inline" />
              Cleaning Essentials
            </h2>
            <p className="text-white/80 text-sm font-medium">
              Save big on premium sanitizers, toilet cleaners, floor washes, and eco-friendly kitchen liquids. Pure hygiene, pure savings.
            </p>
            
            {/* Promo Code Box */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <span className="text-xs font-bold text-white/90">Use Code:</span>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900/35 border border-white/20 rounded-lg text-sm font-extrabold select-all uppercase">
                <FiTag />
                WELCOME25
              </div>
            </div>
          </div>

          {/* Right Panel: Countdown and Button */}
          <div className="flex flex-col items-center gap-6 bg-slate-900/20 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-white/15 w-full max-w-sm">
            <div className="text-center space-y-1">
              <p className="text-xs font-bold text-brand-soft-green flex items-center justify-center gap-1.5">
                <FiClock className="animate-spin-slow" />
                OFFER ENDS SOON
              </p>
              
              {/* Countdown numbers */}
              <div className="flex items-center gap-3 pt-2">
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-black tracking-tight">{formatNum(timeLeft.hours)}</span>
                  <span className="text-[9px] font-bold text-white/60 uppercase">Hours</span>
                </div>
                <span className="text-2xl font-black pb-4 text-white/60">:</span>
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-black tracking-tight">{formatNum(timeLeft.minutes)}</span>
                  <span className="text-[9px] font-bold text-white/60 uppercase">Mins</span>
                </div>
                <span className="text-2xl font-black pb-4 text-white/60">:</span>
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-black tracking-tight">{formatNum(timeLeft.seconds)}</span>
                  <span className="text-[9px] font-bold text-white/60 uppercase">Secs</span>
                </div>
              </div>
            </div>

            {/* CTA action */}
            <button 
              onClick={handleApply}
              className="w-full py-3.5 bg-white text-slate-800 hover:bg-slate-50 rounded-xl font-extrabold text-sm transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
            >
              <span>{couponApplied ? '25% Coupon Applied!' : 'Shop Deals / Apply Code'}</span>
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
