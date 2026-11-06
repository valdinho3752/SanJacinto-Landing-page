import React from 'react';
import { Phone, Clock, ShoppingCart, Calendar, Globe, ZoomIn, ZoomOut, ShieldCheck } from 'lucide-react';

export default function Header({ 
  lang, 
  setLang, 
  t, 
  cartCount, 
  setIsCartOpen, 
  isLargeText, 
  setIsLargeText,
  onBookClick
}) {
  return (
    <header className="sticky top-0 z-40 bg-white shadow-md border-b border-slate-200">
      {/* Senior Accessibility & Direct Call Top Bar */}
      <div className="bg-navy-900 text-white text-sm py-2 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Phone highlight */}
          <div className="flex items-center gap-4 flex-wrap">
            <a 
              href="tel:+14423742450" 
              className="inline-flex items-center gap-2 font-bold text-amber-300 hover:text-white transition-colors text-base sm:text-lg focus:ring-2 focus:ring-amber-300 rounded px-1"
              aria-label="Call clinic directly"
            >
              <Phone className="w-5 h-5 text-amber-300 animate-pulse" />
              <span>+1 (442) 374-2450</span>
            </a>
            <span className="hidden md:inline-block text-slate-400">|</span>
            <div className="hidden sm:flex items-center gap-1.5 text-slate-300 text-xs sm:text-sm">
              <Clock className="w-4 h-4 text-sky-400" />
              <span>{t.topBar.hours}</span>
            </div>
            <div className="hidden lg:flex items-center gap-1.5 text-emerald-300 text-xs font-medium bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t.topBar.seniorFriendly}</span>
            </div>
          </div>

          {/* Accessibility & Language Controls */}
          <div className="flex items-center gap-3">
            {/* Text size booster */}
            <button
              onClick={() => setIsLargeText(!isLargeText)}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs sm:text-sm font-semibold transition-all border ${
                isLargeText 
                  ? 'bg-amber-400 text-navy-900 border-amber-300 font-bold' 
                  : 'bg-navy-800 text-slate-200 hover:bg-navy-700 border-navy-600'
              }`}
              title={t.topBar.textSize}
              aria-label="Toggle text size for readability"
            >
              {isLargeText ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
              <span>{isLargeText ? 'Texto Normal' : 'Texto Grande (A+)'}</span>
            </button>

            {/* Language switch */}
            <div className="flex items-center bg-navy-800 rounded p-0.5 border border-navy-700">
              <button
                onClick={() => setLang('es')}
                className={`px-2.5 py-0.5 rounded text-xs font-bold transition-colors ${
                  lang === 'es' ? 'bg-brand-blue text-white shadow' : 'text-slate-300 hover:text-white'
                }`}
              >
                ES
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-2.5 py-0.5 rounded text-xs font-bold transition-colors ${
                  lang === 'en' ? 'bg-brand-blue text-white shadow' : 'text-slate-300 hover:text-white'
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-4">
          
          {/* Clinic Name & Brand */}
          <a href="#inicio" className="flex items-center gap-3 group">
            <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-xl bg-gradient-to-br from-navy-900 to-brand-blue flex items-center justify-center text-white shadow-md text-xl font-black">
              SJ
            </div>
            <div>
              <span className="block font-black text-navy-900 text-lg sm:text-xl lg:text-2xl tracking-tight leading-none group-hover:text-brand-blue transition-colors">
                SAN JACINTO
              </span>
              <span className="block text-xs sm:text-sm font-bold text-brand-blue tracking-wide uppercase mt-0.5">
                Center for Implants and Dentures
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden xl:flex items-center gap-6 font-semibold text-slate-700 text-base">
            <a href="#especialidad" className="hover:text-brand-blue transition-colors">{t.nav.specialty}</a>
            <a href="#caso-real" className="hover:text-brand-blue transition-colors">{t.nav.ourWork}</a>
            <a href="#precios" className="hover:text-brand-blue transition-colors">{t.nav.pricing}</a>
            <a href="#implantes" className="hover:text-brand-blue transition-colors">{t.nav.implants}</a>
            <a href="#resenas" className="hover:text-brand-blue transition-colors">{t.nav.reviews}</a>
            <a href="#ubicacion" className="hover:text-brand-blue transition-colors">{t.nav.location}</a>
          </nav>

          {/* Action CTAs: Cart & Book */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-navy-900 px-3.5 py-2.5 rounded-xl font-bold transition-all border border-slate-300"
              aria-label="Ver carrito"
            >
              <ShoppingCart className="w-5 h-5 text-brand-blue" />
              <span className="hidden sm:inline text-sm">{t.nav.cart}</span>
              {cartCount > 0 && (
                <span className="bg-amber-500 text-navy-900 font-extrabold text-xs rounded-full w-5 h-5 flex items-center justify-center shadow">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Book Appointment CTA */}
            <button
              onClick={onBookClick}
              className="inline-flex items-center gap-2 bg-navy-900 hover:bg-brand-blue text-white px-4 sm:px-5 py-2.5 rounded-xl font-bold transition-all shadow-md hover:shadow-lg text-sm sm:text-base"
            >
              <Calendar className="w-4 h-4 text-sky-400" />
              <span>{t.nav.bookAppointment}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
