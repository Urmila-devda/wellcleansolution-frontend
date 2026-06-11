import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiX, FiStar, FiPlus, FiMinus, FiShoppingBag, FiShield, FiHeart } from 'react-icons/fi';
import { CATALOG_MODE } from '../config';


export default function QuickViewModal({ isOpen, onClose, product, onAddToCart }) {
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    onAddToCart(product, qty);
    setQty(1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto font-sans">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100 animate-fade-in-up flex flex-col md:flex-row">
          
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors z-10"
          >
            <FiX className="text-xl" />
          </button>

          {/* Left Column: Image Area */}
          <div className="md:w-1/2 bg-slate-50/50 p-8 flex flex-col items-center justify-center border-r border-slate-100 min-h-[300px]">
            {product.tag && (
              <span className="self-start mb-4 px-3 py-1 bg-brand-green/10 text-brand-green text-xs font-bold rounded-full">
                {product.tag}
              </span>
            )}
            <img 
              src={product.image} 
              alt={product.name} 
              className="max-h-72 max-w-full object-contain hover:scale-105 transition-transform duration-500" 
            />
          </div>

          {/* Right Column: Info Area */}
          <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-brand-blue uppercase tracking-wider">{product.category}</span>
              <h3 className="text-2xl font-bold text-slate-800 mt-1 mb-2 leading-tight">{product.name}</h3>
              
              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <FiStar 
                    key={i} 
                    className={`text-sm ${i < Math.floor(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} 
                  />
                ))}
                <span className="text-xs font-bold text-slate-500 ml-1">{product.rating} / 5.0 Rating</span>
              </div>

              {/* Price */}
              <div className="text-2xl font-black text-slate-800 mb-6">
                ₹{product.price.toFixed(2)}
              </div>

              {/* Tabs */}
              <div className="flex border-b border-slate-100 mb-4">
                {['description', 'specifications', 'ingredients'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-2 pr-4 text-xs font-bold capitalize transition-all border-b-2 -mb-[2px] ${
                      activeTab === tab
                        ? 'border-brand-blue text-brand-blue'
                        : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="text-slate-600 text-sm mb-6 min-h-[80px]">
                {activeTab === 'description' && (
                  <p className="leading-relaxed">{product.details || product.description}</p>
                )}
                {activeTab === 'specifications' && (
                  <ul className="space-y-1">
                    {product.specs?.map((spec, i) => (
                      <li key={i} className="flex justify-between border-b border-slate-50 pb-1">
                        <span className="text-slate-400 text-xs">{spec.name}</span>
                        <span className="text-slate-700 text-xs font-semibold">{spec.value}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {activeTab === 'ingredients' && (
                  <p className="leading-relaxed italic text-slate-500 text-xs">{product.ingredients || 'Naturally derived biodegradable surfactant system, essential oil fragrance, purified water.'}</p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              {CATALOG_MODE ? (
                <div className="space-y-3">
                  <div className="bg-amber-50 border border-amber-200 text-amber-805 rounded-xl p-2.5 text-[10px] font-bold text-center flex items-center justify-center gap-1.5 shadow-sm">
                    <span>📢</span>
                    <span>Online ordering will be available shortly.</span>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2 w-full">
                    {/* WhatsApp Enquiry Button */}
                    <a
                      href={`https://wa.me/917021204733?text=${encodeURIComponent(
                        `Hi, I'm interested in the product: ${product.name} (Price: ₹${product.price.toFixed(2)}). Could you please provide more details?`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2.5 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-1.5 text-xs text-center border border-transparent cursor-pointer"
                    >
                      <span>WhatsApp Enquiry</span>
                    </a>

                    {/* Request Quote Button */}
                    <button
                      onClick={() => {
                        onClose();
                        navigate("/", {
                          state: {
                            scrollToContact: true,
                            prefillSubject: `Quote request for ${product.name}`,
                            prefillMessage: `Hi, I would like to request a price quote for ${product.name} (Price: ₹${product.price.toFixed(2)}). Please contact me with more information.`
                          }
                        });
                      }}
                      className="flex-1 py-2.5 bg-brand-blue hover:bg-brand-blue-hover text-white rounded-xl font-bold transition-all shadow-md text-xs cursor-pointer"
                    >
                      Request Quote
                    </button>

                    {/* Contact Us Button */}
                    <button
                      onClick={() => {
                        onClose();
                        navigate("/", {
                          state: {
                            scrollToContact: true,
                            prefillSubject: `Inquiry about ${product.name}`,
                            prefillMessage: `Hi, I have a question regarding ${product.name}. Please contact me.`
                          }
                        });
                      }}
                      className="flex-1 py-2.5 border border-slate-200 hover:border-brand-blue hover:text-brand-blue text-slate-600 rounded-xl font-bold transition-all text-xs cursor-pointer"
                    >
                      Contact Us
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  {/* Quantity selector */}
                  <div className="flex items-center border border-slate-200 rounded-full py-1.5 px-3 bg-slate-50">
                    <button 
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="p-1 text-slate-500 hover:text-brand-blue transition-colors"
                    >
                      <FiMinus />
                    </button>
                    <span className="px-4 text-sm font-bold text-slate-800 min-w-8 text-center">{qty}</span>
                    <button 
                      onClick={() => setQty(qty + 1)}
                      className="p-1 text-slate-500 hover:text-brand-blue transition-colors"
                    >
                      <FiPlus />
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <button 
                    onClick={handleAddToCart}
                    className="flex-grow py-3 bg-brand-blue text-white rounded-full font-bold hover:bg-brand-blue-hover transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <FiShoppingBag />
                    <span>Add to Cart - ₹{(product.price * qty).toFixed(2)}</span>
                  </button>
                </div>
              )}

              {/* Badges */}
              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <FiShield className="text-brand-green" />
                  <span>99.9% Germ Protection</span>
                </span>
                <span className="flex items-center gap-1">
                  <FiHeart className="text-rose-500 fill-rose-500" />
                  <span>Eco-Friendly Formula</span>
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
