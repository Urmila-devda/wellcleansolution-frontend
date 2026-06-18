import React, { useState, useEffect, useRef } from 'react';
import { FiSearch, FiX, FiArrowRight } from 'react-icons/fi';

export default function SearchModal({ isOpen, onClose, products, onQuickView }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtered);
  }, [query, products]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto font-sans">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative min-h-screen flex items-start justify-center p-4 pt-10 sm:pt-20">
        <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100 animate-fade-in-up">
          
          {/* Input Bar */}
          <div className="p-4 border-b border-slate-100 flex items-center gap-3">
            <FiSearch className="text-slate-400 text-xl flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search for cleaning products, hygiene items..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-grow text-base text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent"
            />
            <button 
              onClick={onClose}
              className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <FiX className="text-xl" />
            </button>
          </div>

          {/* Results Area */}
          <div className="max-h-[60vh] overflow-y-auto p-4">
            {query.trim() === '' ? (
              // Suggestion panel when search is empty
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Popular Searches</h4>
                <div className="flex flex-wrap gap-2 mb-6">
                  {['Hand Wash', 'Toilet Cleaner', 'All Purpose', 'Glass Cleaner', 'Floor Cleaner'].map((term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="px-3.5 py-1.5 bg-slate-50 border border-slate-200/60 rounded-full text-xs font-semibold text-slate-600 hover:bg-brand-soft-blue hover:text-brand-blue hover:border-brand-blue/30 transition-all"
                    >
                      {term}
                    </button>
                  ))}
                </div>

                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Recommended Products</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {products.slice(0, 4).map((p) => (
                    <div 
                      key={p.id}
                      onClick={() => {
                        onQuickView(p);
                        onClose();
                      }}
                      className="flex items-center gap-3 p-2 rounded-xl border border-slate-100 hover:border-brand-blue/20 hover:bg-slate-50/50 cursor-pointer transition-all"
                    >
                      <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-100 flex-shrink-0">
                        <img src={p.image} alt={p.name} className="max-h-10 object-contain" />
                      </div>
                      <div className="overflow-hidden">
                        <h5 className="font-semibold text-slate-800 text-xs truncate">{p.name}</h5>
                        <p className="text-[10px] text-slate-400 truncate">{p.category}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : results.length === 0 ? (
              // No results found
              <div className="py-12 text-center">
                <p className="text-slate-500 font-medium">No results found for "{query}"</p>
                <p className="text-slate-400 text-xs mt-1">Check spelling or search for popular cleaning products.</p>
              </div>
            ) : (
              // Matching results
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Products Found ({results.length})</h4>
                <div className="space-y-2">
                  {results.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => {
                        onQuickView(product);
                        onClose();
                      }}
                      className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-brand-blue/20 hover:bg-slate-50/50 cursor-pointer transition-all"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-14 h-14 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-100 flex-shrink-0">
                          <img src={product.image} alt={product.name} className="max-h-12 object-contain" />
                        </div>
                        <div className="overflow-hidden">
                          <h5 className="font-semibold text-slate-800 text-sm truncate">{product.name}</h5>
                          <p className="text-xs text-slate-400 truncate">{product.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 flex-shrink-0 pl-3">
                        <span className="font-bold text-slate-800 text-sm">₹{product.price.toFixed(2)}</span>
                        <div className="w-8 h-8 rounded-full bg-brand-soft-blue flex items-center justify-center text-brand-blue hover:bg-brand-blue hover:text-white transition-colors">
                          <FiArrowRight />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
