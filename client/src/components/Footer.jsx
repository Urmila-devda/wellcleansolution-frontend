import React from 'react';
import { FiFacebook, FiTwitter, FiInstagram, FiYoutube, FiMapPin, FiPhone, FiMail, FiHeart } from 'react-icons/fi';
import logoImg from '../assets/logo.jpg';


export default function Footer({ onSelectCategory }) {
  const handleCategoryClick = (categoryVal) => {
    onSelectCategory(categoryVal);
    const el = document.getElementById('products');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleNavClick = (sectionId) => {
    const el = document.getElementById(sectionId);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer id="contact-us" className="bg-slate-900 text-slate-400 font-sans pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Column 1: Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <img src={logoImg} alt="Well Clean Solutions" className="h-8 w-auto object-contain bg-white p-0.5 rounded" />
              <span className="text-lg font-black tracking-tight text-white">
                Well Clean <span className="text-brand-blue">Solutions</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Well Clean Solutions is dedicated to providing high-quality cleaning and hygiene products that help families maintain a healthier, spotless, and cleaner lifestyle.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              {[
                { icon: <FiFacebook />, url: '#facebook' },
                { icon: <FiTwitter />, url: '#twitter' },
                { icon: <FiInstagram />, url: '#instagram' },
                { icon: <FiYoutube />, url: '#youtube' }
              ].map((soc, idx) => (
                <a
                  key={idx}
                  href={soc.url}
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-brand-blue hover:text-white flex items-center justify-center text-sm transition-colors"
                >
                  {soc.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest border-l-2 border-brand-blue pl-2">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-xs">
              {[
                { name: 'Home', section: 'hero' },
                { name: 'Products', section: 'products' },
                { name: 'About Us', section: 'about-us' },
                { name: 'Testimonials', section: 'testimonials' }
              ].map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => handleNavClick(link.section)}
                    className="hover:text-white hover:underline transition-all"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Categories */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest border-l-2 border-brand-green pl-2">
              Categories
            </h3>
            <ul className="space-y-2.5 text-xs">
              {[
                'Hand Wash',
                'Toilet Cleaner',
                'Glass Cleaner',
                'Floor Cleaner',
                'Dish Wash Liquid',
                'Surface Cleaner'
              ].map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => handleCategoryClick(cat)}
                    className="hover:text-white hover:underline transition-all"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest border-l-2 border-amber-500 pl-2">
              Contact Info
            </h3>
            <ul className="space-y-3.5 text-xs">
              <li className="flex items-start gap-2.5">
                <FiMapPin className="text-brand-blue text-sm flex-shrink-0 mt-0.5" />
                <span>Shed No. 1, Kolshet Khadi, Taricha Pada, Thane West. Maharashtra, 400607</span>
              </li>
              <li className="flex items-center gap-2.5">
                <FiPhone className="text-brand-green text-sm flex-shrink-0" />
                <span>+(91) 7021204733</span>
              </li>
              <li className="flex items-center gap-2.5">
                <FiMail className="text-amber-500 text-sm flex-shrink-0" />
                <span>wellcleansolutions11@gmail.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Banner */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p>© 2026 Well Clean Solutions. All Rights Reserved.</p>
          <p className="flex items-center gap-1 text-[10px] text-slate-500">
            Made with <FiHeart className="text-rose-500 fill-rose-500" /> for clean and healthy living.
          </p>
        </div>

      </div>
    </footer>
  );
}
