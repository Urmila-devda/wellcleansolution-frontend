import React, { useState } from 'react';
import { FiMail, FiSend, FiCheckCircle } from 'react-icons/fi';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email) {
      setErrorMsg('Please enter your email.');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate subscribe API delay
    setTimeout(() => {
      setIsSubmitting(false);
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }, 1500);
  };

  return (
    <section id="newsletter" className="py-16 bg-slate-50/50 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Newsletter Box */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-100 shadow-xl relative overflow-hidden text-center space-y-6">
          
          {/* Ambient blob detail */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-soft-blue rounded-full filter blur-2xl opacity-60 pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-brand-soft-green rounded-full filter blur-2xl opacity-60 pointer-events-none" />

          {/* Icon */}
          <div className="w-14 h-14 bg-brand-soft-blue text-brand-blue rounded-full flex items-center justify-center text-2xl mx-auto shadow-sm">
            <FiMail />
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
              Get Cleaning Tips & Exclusive Offers
            </h2>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              Subscribe to the Well Clean Solutions newsletter and receive household hygiene advice, new product updates, and <strong>10% off your next purchase</strong>.
            </p>
          </div>

          {/* Form */}
          {subscribed ? (
            <div className="max-w-md mx-auto p-4 bg-brand-soft-green/40 border border-brand-green/20 rounded-2xl flex items-center gap-3 justify-center text-brand-green animate-fade-in">
              <FiCheckCircle className="text-xl flex-shrink-0" />
              <span className="text-sm font-bold">Successfully Subscribed! Check your inbox for your 10% coupon.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="max-w-md mx-auto space-y-2">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-grow">
                  <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="email" 
                    placeholder="Enter your email address" 
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-brand-blue rounded-xl text-sm text-slate-800 placeholder-slate-400"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-brand-blue hover:bg-brand-blue-hover text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-brand-blue/10 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : (
                    <>
                      <span>Subscribe</span>
                      <FiSend />
                    </>
                  )}
                </button>
              </div>
              {errorMsg && <p className="text-left text-xs font-semibold text-rose-500 pl-2">{errorMsg}</p>}
            </form>
          )}

        </div>
      </div>
    </section>
  );
}
