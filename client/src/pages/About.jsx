import React, { useEffect } from "react"
import { FiCheck, FiAward, FiShield, FiHeart } from "react-icons/fi"
import aboutHome from "../assets/about_home.png"

export default function About() {
  // SEO setup
  useEffect(() => {
    document.title = "About Us | WellClean Solutions"
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        "Learn about WellClean Solutions - our commitment to premium, family-safe cleaning formulations that protect your home."
      )
    }
  }, [])

  const values = [
    {
      icon: <FiAward className="text-xl text-brand-blue" />,
      title: "Premium Formulations",
      desc: "We use only high-grade active ingredients and botanical concentrates to ensure industrial-strength cleaning power.",
    },
    {
      icon: <FiShield className="text-xl text-brand-green" />,
      title: "Family & Pet Safety",
      desc: "Our products are formulated to eradicate 99.9% of germs while remaining completely non-toxic and safe around children and pets.",
    },
    {
      icon: <FiHeart className="text-xl text-rose-500" />,
      title: "Quality Integrity",
      desc: "We stand by premium active agents, cruelty-free practices, and secure packaging to respect our customers.",
    },
  ]

  const bulletPoints = [
    "Highly effective active cleaning agents",
    "Tough on stains, safe for toddlers and pets",
    "Certified 99.9% germ protection formulas",
    "Proudly manufactured with cruelty-free practices",
  ]

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans pb-20">
      {/* Premium Hero Banner */}
      <div className="bg-slate-900 text-white py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-blue/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-green/5 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-4">
          <span className="text-xs font-bold text-brand-blue uppercase tracking-widest bg-brand-blue/10 border border-brand-blue/20 px-3 py-1 rounded-full">
            Our Story
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">About Well Clean Solutions</h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto font-medium">
            Discover our journey in redefining home hygiene with safe, highly effective cleaning concentrates.
          </p>
        </div>
      </div>

      {/* Main Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Story Copy */}
          <div className="lg:col-span-6 space-y-6 md:space-y-8">
            <div className="space-y-4">
              <span className="text-xs font-bold text-brand-blue uppercase tracking-widest bg-brand-soft-blue px-3 py-1 rounded-full">
                Who We Are
              </span>
              <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight leading-tight">
                Dedicated to a Healthier, <br />
                Cleaner Lifestyle
              </h2>
              <p className="text-sm sm:text-base text-slate-500 leading-relaxed font-medium">
                Well Clean Solutions is committed to providing professional-grade cleaning and hygiene products that help families maintain a healthier and cleaner lifestyle. We believe that clean living leads to better living, which is why we research and formulate high-performance detergents that deliver outstanding performance without compromise.
              </p>
            </div>

            {/* Bullet List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              {bulletPoints.map((point, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-brand-soft-green text-brand-green flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FiCheck className="text-xs" />
                  </span>
                  <span className="text-xs font-bold text-slate-600">{point}</span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-200/80">
              <div>
                <h4 className="text-3xl font-black text-brand-blue">15+</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Years of Research</p>
              </div>
              <div>
                <h4 className="text-3xl font-black text-brand-green">1M+</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Homes Cleaned</p>
              </div>
              <div>
                <h4 className="text-3xl font-black text-amber-500">100%</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Satisfaction Guarantee</p>
              </div>
            </div>
          </div>

          {/* Right Column: Imagery */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-full max-w-lg aspect-square rounded-3xl overflow-hidden shadow-2xl border border-slate-100 bg-white">
              <img 
                src={aboutHome} 
                alt="Well Clean Solutions Immaculate Living Room interior" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent pointer-events-none" />
            </div>
          </div>

        </div>

        {/* Company Core Values Grid */}
        <div className="mt-24">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-brand-green uppercase tracking-widest bg-brand-soft-green px-3 py-1 rounded-full">
              Our Principles
            </span>
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
              Values That Drive Us Forward
            </h2>
            <p className="text-sm text-slate-400 font-medium">
              We operate on the foundation of trust, scientific efficiency, and safety.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((v, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-4 hover:shadow-lg transition-shadow duration-300">
                <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 shadow-inner">
                  {v.icon}
                </div>
                <h3 className="font-bold text-slate-800 text-base">{v.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed font-medium">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
