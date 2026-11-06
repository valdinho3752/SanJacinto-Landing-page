import React from 'react';
import { Anchor, CheckCircle, ShieldAlert, Sparkles, ArrowRight, Phone } from 'lucide-react';

export default function ImplantSpecialty({ t, onBookClick }) {
  return (
    <section id="implantes" className="py-16 bg-navy-900 text-white border-b border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Information & Explanation */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 bg-brand-blue/30 text-sky-300 font-bold px-4 py-1.5 rounded-full text-sm mb-4 border border-brand-blue/50">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{t.services.implantsBadge}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              {t.services.implantsTitle}
            </h2>

            <p className="mt-5 text-lg text-slate-300 leading-relaxed">
              {t.services.implantsDesc}
            </p>

            {/* Comparison / Benefits List */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-navy-800/80 p-4 rounded-2xl border border-navy-700">
                <div className="flex items-center gap-2 font-bold text-amber-300 text-base">
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>Cero Pastas Adhesivas</span>
                </div>
                <p className="text-slate-300 text-sm mt-1">
                  Olvídese del sabor amargo y la textura pegajosa de los pegamentos dentales.
                </p>
              </div>

              <div className="bg-navy-800/80 p-4 rounded-2xl border border-navy-700">
                <div className="flex items-center gap-2 font-bold text-amber-300 text-base">
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>Masticación Segura</span>
                </div>
                <p className="text-slate-300 text-sm mt-1">
                  Muerda carnes, frutas duras y panes crujientes sin temor a que se desplace.
                </p>
              </div>

              <div className="bg-navy-800/80 p-4 rounded-2xl border border-navy-700">
                <div className="flex items-center gap-2 font-bold text-amber-300 text-base">
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>Sin Heridas ni Rozaduras</span>
                </div>
                <p className="text-slate-300 text-sm mt-1">
                  La dentadura se apoya en los implantes, reduciendo la presión directa sobre la encía.
                </p>
              </div>

              <div className="bg-navy-800/80 p-4 rounded-2xl border border-navy-700">
                <div className="flex items-center gap-2 font-bold text-amber-300 text-base">
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>Sistema 'Snap-On' Removible</span>
                </div>
                <p className="text-slate-300 text-sm mt-1">
                  Firmeza absoluta durante el día y fácil de desabrochar para una higiene rápida.
                </p>
              </div>
            </div>

            {/* CTA action */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
              <button
                onClick={() => onBookClick("Evaluación para Dentaduras Fijadas con Implantes")}
                className="inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-navy-900 font-extrabold text-base sm:text-lg py-4 px-6 rounded-2xl shadow-xl transition-all"
              >
                <span>{t.services.implantsCta}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              
              <a
                href="tel:+14423742450"
                className="inline-flex items-center justify-center gap-2 bg-navy-800 hover:bg-navy-700 text-white font-bold text-base py-4 px-6 rounded-2xl border border-navy-600 transition-colors"
              >
                <Phone className="w-5 h-5 text-amber-300" />
                <span>Preguntar por Teléfono</span>
              </a>
            </div>

          </div>

          {/* Right Column: Visual Diagram / Explanation Box */}
          <div className="lg:col-span-5">
            <div className="bg-gradient-to-br from-navy-800 to-navy-950 p-6 sm:p-8 rounded-3xl border-2 border-brand-blue/50 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/10 rounded-full blur-2xl"></div>
              
              <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2 mb-4">
                <Anchor className="w-6 h-6 text-sky-400" />
                <span>¿Cómo Funciona la Fijación?</span>
              </h3>

              <div className="space-y-4 text-sm text-slate-300">
                <div className="flex gap-3">
                  <span className="w-7 h-7 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold shrink-0">1</span>
                  <div>
                    <strong className="text-white block font-bold">Colocación Mínimamente Invasiva:</strong>
                    Se instalan de 2 a 4 fijadores de titanio en el hueso maxilar o mandibular.
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="w-7 h-7 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold shrink-0">2</span>
                  <div>
                    <strong className="text-white block font-bold">Anclajes de Precisión:</strong>
                    La base de la dentadura lleva receptores especiales de cierre seguro que encajan con suavidad.
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="w-7 h-7 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold shrink-0">3</span>
                  <div>
                    <strong className="text-white block font-bold">Firmeza Inmediata:</strong>
                    Usted siente el clic de seguridad y recupera la fuerza para comer lo que desee.
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-navy-700/80 bg-navy-900/60 p-4 rounded-xl text-center">
                <span className="text-xs uppercase font-bold text-amber-300 tracking-wider block mb-1">
                  Consulta de Diagnóstico
                </span>
                <p className="text-xs sm:text-sm text-slate-300">
                  Evaluamos su densidad ósea y le explicamos si es candidato sin ningún compromiso.
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
