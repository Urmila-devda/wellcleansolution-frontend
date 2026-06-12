import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram, FiYoutube, FiMapPin, FiPhone, FiMail, FiHeart } from 'react-icons/fi';
import logoImg from '../assets/logo.jpg';

export default function Footer({ onSelectCategory }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleCategoryClick = (categoryVal) => {
    if (onSelectCategory) {
      onSelectCategory(categoryVal);
    }
    if (location.pathname !== '/products') {
      navigate('/products');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLinkClick = (path, sectionId) => {
    if (path) {
      navigate(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (sectionId) {
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          const el = document.getElementById(sectionId);
          el?.scrollIntoView({ behavior: 'smooth' });
        }, 350);
      } else {
        const el = document.getElementById(sectionId);
        el?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-400 font-sans pt-16 pb-8 border-t border-slate-800 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Column 1: Company Info & Socials */}
          <div className="space-y-4">
            <button 
              onClick={() => handleLinkClick('/')} 
              className="flex items-center gap-2.5 text-left focus:outline-none cursor-pointer"
            >
              <img src={logoImg} alt="Well Clean Solutions" className="h-8 w-auto object-contain bg-white p-0.5 rounded" />
              <span className="text-lg font-black tracking-tight text-white">
                Well Clean <span className="text-brand-blue">Solutions</span>
              </span>
            </button>
            <p className="text-xs text-slate-400 leading-relaxed font-semibold">
              Well Clean Solutions is dedicated to delivering professional-grade cleaning concentrates and hygiene products that protect your loved ones and respect the environment.
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
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-brand-blue hover:text-white flex items-center justify-center text-sm transition-colors cursor-pointer"
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
            <ul className="space-y-2.5 text-xs font-semibold">
              {[
                { name: 'Home', path: '/' },
                { name: 'Products', path: '/products' },
                { name: 'About Us', path: '/about' },
                { name: 'FAQs', sectionId: 'faq' },
                { name: 'Contact Form', sectionId: 'contact-us' }
              ].map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => handleLinkClick(link.path, link.sectionId)}
                    className="hover:text-white hover:underline transition-all cursor-pointer text-left focus:outline-none"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Category Links */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest border-l-2 border-brand-green pl-2">
              Our Categories
            </h3>
            <ul className="space-y-2.5 text-xs font-semibold">
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
                    className="hover:text-white hover:underline transition-all cursor-pointer text-left focus:outline-none"
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
            <ul className="space-y-3.5 text-xs font-semibold">
              <li className="flex items-start gap-2.5">
                <FiMapPin className="text-brand-blue text-sm flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">Shed No. 1, Kolshet Khadi, Taricha Pada, Thane West. Maharashtra, 400607</span>
              </li>
              <li className="flex items-center gap-2.5">
                <FiPhone className="text-brand-green text-sm flex-shrink-0" />
                <span>+(91) 7021204733</span>
              </li>
              <li className="flex items-center gap-2.5">
                <FiMail className="text-amber-500 text-sm flex-shrink-0" />
                <span>wellclean11@gmail.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Banner */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-semibold">
          <p>© 2026 Well Clean Solutions. All Rights Reserved.</p>
          <p className="flex items-center gap-1 text-[10px] text-slate-500">
            Made with <FiHeart className="text-rose-500 fill-rose-500" /> for clean and healthy living.
          </p>
        </div>

      </div>
    </footer>
  );
}
