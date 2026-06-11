import React from 'react';
import { FiArrowRight } from 'react-icons/fi';

const categories = [
  {
    id: 'hand-wash',
    name: 'Hand Wash',
    icon: '🧼',
    count: '12 Products',
    gradient: 'from-[#E6F0FF] to-[#CCE0FF]',
    iconBg: 'bg-[#007BFF]/10 text-brand-blue',
    filterVal: 'Hand Wash'
  },
  {
    id: 'toilet-cleaner',
    name: 'Toilet Cleaner',
    icon: '🚽',
    count: '8 Products',
    gradient: 'from-[#EAF7EC] to-[#D5F2D9]',
    iconBg: 'bg-[#28A745]/10 text-brand-green',
    filterVal: 'Toilet Cleaner'
  },
  {
    id: 'glass-cleaner',
    name: 'Glass Cleaner',
    icon: '✨',
    count: '6 Products',
    gradient: 'from-[#FFF9E6] to-[#FFF0CC]',
    iconBg: 'bg-amber-500/10 text-amber-600',
    filterVal: 'Glass Cleaner'
  },
  {
    id: 'floor-cleaner',
    name: 'Floor Cleaner',
    icon: '🧹',
    count: '10 Products',
    gradient: 'from-[#F3E8FF] to-[#E9D5FF]',
    iconBg: 'bg-purple-500/10 text-purple-600',
    filterVal: 'Floor Cleaner'
  },
  {
    id: 'dishwash',
    name: 'Dish Wash Liquid',
    icon: '🍽️',
    count: '9 Products',
    gradient: 'from-[#FFF0F0] to-[#FFE0E0]',
    iconBg: 'bg-rose-500/10 text-rose-600',
    filterVal: 'Dish Wash Liquid'
  },
  {
    id: 'surface-cleaner',
    name: 'Surface Cleaner',
    icon: '🧽',
    count: '14 Products',
    gradient: 'from-[#E0F7FA] to-[#B2EBF2]',
    iconBg: 'bg-cyan-500/10 text-cyan-600',
    filterVal: 'Surface Cleaner'
  }
];

export default function Categories({ onSelectCategory }) {
  const handleCategoryClick = (categoryVal) => {
    onSelectCategory(categoryVal);
  };

  return (
    <section id="categories" className="py-20 bg-white font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold text-brand-blue uppercase tracking-widest bg-brand-soft-blue px-3 py-1 rounded-full">
            Featured Categories
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
            Tailored Solutions for Every Surface
          </h2>
          <p className="text-sm sm:text-base text-slate-500 max-w-xl mx-auto">
            Explore our curated ranges designed to defend against bacteria, eliminate stubborn stains, and leave your home smelling clean and fresh.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((cat) => (
            <div 
              key={cat.id}
              onClick={() => handleCategoryClick(cat.filterVal)}
              className="group cursor-pointer rounded-2xl p-5 border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-between text-center min-h-[220px]"
            >
              {/* Category Icon */}
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform duration-300`}>
                {cat.icon}
              </div>

              {/* Name & Count */}
              <div className="my-4">
                <h3 className="font-bold text-slate-800 text-sm group-hover:text-brand-blue transition-colors leading-tight">
                  {cat.name}
                </h3>
                <p className="text-[10px] text-slate-400 font-semibold mt-1">
                  {cat.count}
                </p>
              </div>

              {/* Action Button */}
              <button 
                className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-blue group-hover:text-brand-blue-hover transition-colors"
              >
                <span>View Products</span>
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
