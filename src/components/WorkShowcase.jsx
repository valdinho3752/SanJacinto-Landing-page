import React from 'react';
import { Sparkles, Check, ZoomIn, ShieldCheck, Heart } from 'lucide-react';

export default function WorkShowcase({ t, onBookClick }) {
  return (
    <section id="caso-real" className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-brand-blue font-bold px-4 py-1.5 rounded-full text-sm mb-3 border border-blue-200">
            <Sparkles className="w-4 h-4" />
            <span>{t.showcase.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-navy-900 tracking-tight">
            {t.showcase.title}
          </h2>
          <p className="mt-4 text-lg text-slate-600 leading-relaxed">
            {t.showcase.description}
          </p>
        </div>

        {/* Showcase Visual Card */}
        <div className="mt-12 bg-slate-50 rounded-3xl border border-slate-200/90 shadow-md p-6 sm:p-10 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Image Container with Denture Photo */}
            <div className="lg:col-span-7">
              <div className="relative rounded-2xl overflow-hidden shadow-lg border-4 border-white bg-white group">
                <img
                  src="/denture_ex.jpg"
                  alt="Ejemplo real de dentadura fabricada en San Jacinto Center for Implants and Dentures"
                  className="w-full h-auto object-cover max-h-[460px] mx-auto rounded-xl transform transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                
                {/* Floating badge over photo */}
                <div className="absolute bottom-4 left-4 right-4 bg-navy-900/90 backdrop-blur-md text-white p-3.5 rounded-xl border border-navy-700 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
                    <span className="text-xs sm:text-sm font-bold">Muestra real elaborada en nuestro laboratorio</span>
                  </div>
                  <span className="text-xs text-sky-300 font-semibold hidden sm:inline">100% Acrílico Grado Médico</span>
                </div>
              </div>
            </div>

            {/* Quality Details / Benefits List */}
            <div className="lg:col-span-5 flex flex-col gap-5">
              
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-100 text-brand-blue flex items-center justify-center font-black">
                    1
                  </div>
                  <h3 className="font-bold text-navy-900 text-lg">{t.showcase.highlight1Title}</h3>
                </div>
                <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                  {t.showcase.highlight1Desc}
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-100 text-brand-blue flex items-center justify-center font-black">
                    2
                  </div>
                  <h3 className="font-bold text-navy-900 text-lg">{t.showcase.highlight2Title}</h3>
                </div>
                <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                  {t.showcase.highlight2Desc}
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-100 text-brand-blue flex items-center justify-center font-black">
                    3
                  </div>
                  <h3 className="font-bold text-navy-900 text-lg">{t.showcase.highlight3Title}</h3>
                </div>
                <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                  {t.showcase.highlight3Desc}
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={onBookClick}
                  className="w-full inline-flex items-center justify-center gap-2 bg-navy-900 hover:bg-brand-blue text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md text-base"
                >
                  <Heart className="w-5 h-5 text-rose-400" />
                  <span>Quiero una Sonrisa Como Esta</span>
                </button>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
