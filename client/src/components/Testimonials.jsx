import React from 'react';
import { FiStar, FiCheckCircle } from 'react-icons/fi';

const reviews = [
  {
    id: 1,
    name: 'Sarah Jenkins',
    location: 'Boston, MA',
    avatar: '👩‍💼',
    rating: 5,
    quote: 'Absolutely love the Well Clean Solutions Hand Wash and Glass Cleaner! The hand wash leaves my hands incredibly soft, and the glass cleaner leaves absolutely zero streaks on my mirrors. Safe to say I am hooked!'
  },
  {
    id: 2,
    name: 'Marcus Chen',
    location: 'San Francisco, CA',
    avatar: '👨‍💻',
    rating: 5,
    quote: 'With two toddlers in the house, safe and non-toxic cleaning is my top priority. Well Clean Solutions floor wash and multi-surface sprays work wonders on tough stains and give me peace of mind about safety.'
  },
  {
    id: 3,
    name: 'Elena Rostova',
    location: 'Chicago, IL',
    avatar: '👩‍⚕️',
    rating: 5,
    quote: 'The toilet cleaner and dish wash are the best I have ever used. They have a pleasant, fresh natural fragrance instead of that harsh chemical odor. Incredible value for premium quality hygiene products.'
  }
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20 bg-slate-50/50 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold text-brand-blue uppercase tracking-widest bg-brand-soft-blue px-3 py-1 rounded-full">
            Customer Reviews
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
            Loved by Clean Homes Everywhere
          </h2>
          <p className="text-sm sm:text-base text-slate-500 max-w-xl mx-auto">
            Read stories from verified homeowners who switched to Well Clean Solutions for a healthier, spotless, and chemical-free lifestyle.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev) => (
            <div 
              key={rev.id}
              className="bg-white p-8 rounded-2xl border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Stars */}
                <div className="flex items-center gap-0.5 text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <FiStar key={i} className="fill-amber-400" />
                  ))}
                </div>
                
                {/* Quote */}
                <p className="text-slate-600 text-sm italic leading-relaxed">
                  "{rev.quote}"
                </p>
              </div>

              {/* Profile Card */}
              <div className="flex items-center gap-4 mt-8 pt-4 border-t border-slate-100/80">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xl shadow-inner border border-slate-200">
                  {rev.avatar}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1">
                    {rev.name}
                    <FiCheckCircle className="text-brand-green text-xs" title="Verified Purchase" />
                  </h4>
                  <p className="text-[10px] text-slate-400 font-semibold">{rev.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
