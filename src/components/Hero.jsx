import React from 'react';
import { Phone, Calendar, CheckCircle2, Shield, Award, HeartHandshake } from 'lucide-react';

export default function Hero({ t, onBookClick }) {
  return (
    <section id="inicio" className="relative bg-gradient-to-b from-slate-100 via-sky-50/50 to-white pt-8 pb-16 lg:pt-14 lg:pb-20 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Exclusive specialty badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 bg-navy-900 text-amber-300 font-bold px-4 py-2 rounded-full text-xs sm:text-sm tracking-wide shadow-md border border-navy-700 text-center">
            <Award className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{t.hero.badgeExclusive}</span>
          </div>
        </div>

        {/* Main Headings */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-navy-900 tracking-tight leading-tight">
            SAN JACINTO CENTER FOR IMPLANTS AND DENTURES
          </h1>
          <p className="mt-5 text-lg sm:text-2xl text-slate-700 leading-relaxed font-medium max-w-3xl mx-auto">
            {t.hero.subtitle}
          </p>
        </div>

        {/* Big Touch CTA Buttons for Seniors */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto">
          {/* Direct Phone Button */}
          <a
            href="tel:+14423742450"
            className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-3 bg-brand-blue hover:bg-brand-hover text-white text-lg sm:text-xl font-extrabold px-6 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 border-2 border-blue-400/40 text-center"
          >
            <Phone className="w-6 h-6 text-amber-300 shrink-0" />
            <span>{t.hero.callBtn}</span>
          </a>

          {/* Book Online Button */}
          <button
            onClick={onBookClick}
            className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-3 bg-navy-900 hover:bg-navy-800 text-white text-lg sm:text-xl font-extrabold px-6 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all border-2 border-slate-700 text-center"
          >
            <Calendar className="w-6 h-6 text-sky-400 shrink-0" />
            <span>{t.hero.bookBtn}</span>
          </button>
        </div>

        {/* Feature Highlights Grid */}
        <div className="mt-12 pt-8 border-t border-slate-200/80 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 text-brand-blue">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-bold text-navy-900 text-lg">{t.hero.feature1}</h3>
              <p className="text-slate-600 text-sm mt-1">Precios públicos fijos: Full Set a $1,518. Sin cobros sorpresa.</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 text-brand-blue">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-bold text-navy-900 text-lg">{t.hero.feature2}</h3>
              <p className="text-slate-600 text-sm mt-1">Acrílico biocompatible pulido con bordes anatómicos suaves.</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 text-brand-blue">
              <HeartHandshake className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-bold text-navy-900 text-lg">{t.hero.feature3}</h3>
              <p className="text-slate-600 text-sm mt-1">Acceso plano sin gradas, ideal para andaderas y sillas de ruedas.</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
