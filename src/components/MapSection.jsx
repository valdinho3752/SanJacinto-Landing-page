import React from 'react';
import { MapPin, Navigation, Phone, Clock, CheckCircle2, ExternalLink } from 'lucide-react';

export default function MapSection({ t, lang = 'es' }) {
  const googleMapsUrl = "https://maps.app.goo.gl/staj4b6FonERcXFR7";
  
  // Google Maps embed URL using San Jacinto Center for Implants and Dentures query
  const embedUrl = "https://maps.google.com/maps?q=San+Jacinto+Center+for+Implants+and+Dentures&t=&z=15&ie=UTF8&iwloc=&output=embed";

  return (
    <section id="ubicacion" className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-brand-blue font-bold px-4 py-1.5 rounded-full text-sm mb-3 border border-blue-200">
            <MapPin className="w-4 h-4" />
            <span>{t.location.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-navy-900 tracking-tight">
            {t.location.title}
          </h2>
          <p className="mt-3 text-lg text-slate-600">
            {t.location.subtitle}
          </p>
        </div>

        {/* Location Grid: Map Widget + Info Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Map Widget (7 cols) */}
          <div className="lg:col-span-7 bg-slate-100 rounded-3xl overflow-hidden border-2 border-slate-300 shadow-md flex flex-col min-h-[420px]">
            <div className="bg-navy-900 text-white px-5 py-3 flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 font-bold">
                <Navigation className="w-4 h-4 text-sky-400" />
                <span>{lang === 'es' ? 'Mapa Interactivo de Nuestra Ubicación' : 'Interactive Map of Our Clinic Location'}</span>
              </div>
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-amber-300 hover:text-white inline-flex items-center gap-1 font-bold"
              >
                <span>{lang === 'es' ? 'Ver en pantalla completa' : 'View full screen'}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="flex-1 w-full relative">
              <iframe
                title="San Jacinto Center for Implants and Dentures Map"
                src={embedUrl}
                className="w-full h-full min-h-[380px] border-0"
                loading="lazy"
                allowFullScreen
              ></iframe>
            </div>

            <div className="bg-white p-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-slate-500 font-medium">
                {lang === 'es' 
                  ? 'San Jacinto, California • Fácil acceso desde Ramona Blvd y San Jacinto Ave' 
                  : 'San Jacinto, California • Easy access from Ramona Blvd and San Jacinto Ave'}
              </span>
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-brand-blue hover:bg-brand-hover text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-xl transition-all shadow"
              >
                <Navigation className="w-4 h-4" />
                <span>{t.location.googleMapsBtn}</span>
              </a>
            </div>
          </div>

          {/* Location Info Card (5 cols) */}
          <div className="lg:col-span-5 bg-slate-50 rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-md flex flex-col justify-between">
            <div className="space-y-6">
              
              {/* Address */}
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  <MapPin className="w-4 h-4 text-brand-blue" />
                  <span>{t.location.addressTitle}</span>
                </div>
                <div className="font-extrabold text-navy-900 text-xl leading-snug">
                  SAN JACINTO CENTER FOR IMPLANTS AND DENTURES
                </div>
                <div className="text-slate-600 text-base mt-1">
                  {lang === 'es' 
                    ? 'San Jacinto, CA (Haga clic en el botón inferior para abrir la ruta directa en Google Maps)' 
                    : 'San Jacinto, CA (Click the button below to get direct directions in Google Maps)'}
                </div>
              </div>

              {/* Direct Phone */}
              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  {t.location.phoneTitle}
                </div>
                <a
                  href="tel:+14423742450"
                  className="inline-flex items-center gap-3 text-2xl font-black text-brand-blue hover:text-brand-hover transition-colors"
                >
                  <Phone className="w-6 h-6 text-amber-500" />
                  <span>+1 (442) 374-2450</span>
                </a>
                <p className="text-xs text-slate-500 mt-1">
                  {lang === 'es' ? 'Llamada directa • Contestamos en español e inglés' : 'Direct line • We speak English and Spanish'}
                </p>
              </div>

              {/* Office Hours */}
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  <Clock className="w-4 h-4 text-brand-blue" />
                  <span>{t.location.hoursTitle}</span>
                </div>
                <p className="text-sm font-semibold text-slate-700">
                  {t.location.hoursText}
                </p>
              </div>

              {/* Accessibility Points for Seniors */}
              <div className="pt-4 border-t border-slate-200">
                <h4 className="text-xs font-bold text-navy-900 uppercase tracking-wider mb-3">
                  {lang === 'es' ? 'Comodidad y Accesibilidad para Adultos Mayores:' : 'Senior Comfort & Accessibility:'}
                </h4>
                <ul className="space-y-2.5">
                  {t.location.accessibilityHighlights.map((highlight, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Direct Open in Google Maps CTA Button */}
            <div className="mt-8 pt-4 border-t border-slate-200">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-3 bg-navy-900 hover:bg-brand-blue text-white text-base font-extrabold py-4 px-6 rounded-2xl shadow-lg transition-all"
              >
                <Navigation className="w-5 h-5 text-sky-400" />
                <span>{t.location.googleMapsBtn}</span>
                <ExternalLink className="w-4 h-4 opacity-70" />
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
