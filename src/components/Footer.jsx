import React from 'react';
import { Phone, MapPin, Clock, ShieldCheck, Heart } from 'lucide-react';

export default function Footer({ t }) {
  const googleMapsUrl = "https://maps.app.goo.gl/staj4b6FonERcXFR7";

  return (
    <footer className="bg-navy-900 text-slate-300 pt-16 pb-12 border-t-4 border-brand-blue">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-navy-800">
          
          {/* Clinic Information */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-blue text-white flex items-center justify-center font-black text-lg">
                SJ
              </div>
              <div>
                <span className="block font-black text-white text-lg tracking-tight">
                  SAN JACINTO
                </span>
                <span className="block text-xs font-bold text-sky-400 uppercase tracking-wide">
                  Center for Implants and Dentures
                </span>
              </div>
            </div>

            <p className="text-slate-400 text-sm leading-relaxed max-w-md">
              {t.footer.tagline} Devolvemos la firmeza, la dignidad y el confort de masticar sin dolor ni inseguridades.
            </p>

            <div className="inline-flex items-center gap-2 bg-navy-800/80 text-amber-300 text-xs font-bold px-3 py-1.5 rounded-lg border border-navy-700">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Instalaciones 100% accesibles para adultos mayores</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-base uppercase tracking-wider mb-4">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#inicio" className="hover:text-amber-300 transition-colors">Inicio</a>
              </li>
              <li>
                <a href="#caso-real" className="hover:text-amber-300 transition-colors">Muestra de Trabajo Real</a>
              </li>
              <li>
                <a href="#precios" className="hover:text-amber-300 transition-colors">Precios y Tratamientos</a>
              </li>
              <li>
                <a href="#implantes" className="hover:text-amber-300 transition-colors">Fijación con Implantes</a>
              </li>
              <li>
                <a href="#citas" className="hover:text-amber-300 transition-colors">Apartar Cita en Línea</a>
              </li>
              <li>
                <a href="#resenas" className="hover:text-amber-300 transition-colors">Testimonios de Pacientes</a>
              </li>
              <li>
                <a href="#ubicacion" className="hover:text-amber-300 transition-colors">Ubicación y Mapa</a>
              </li>
            </ul>
          </div>

          {/* Contact Direct */}
          <div>
            <h4 className="text-white font-bold text-base uppercase tracking-wider mb-4">
              {t.footer.contactUs}
            </h4>
            
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-xs text-slate-400 block font-semibold">Línea Directa:</span>
                <a 
                  href="tel:+14423742450" 
                  className="text-lg font-black text-amber-300 hover:underline inline-flex items-center gap-1.5"
                >
                  <Phone className="w-4 h-4" />
                  <span>+1 (442) 374-2450</span>
                </a>
              </div>

              <div>
                <span className="text-xs text-slate-400 block font-semibold">Horario:</span>
                <p className="text-slate-300 text-xs">
                  Lun a Vie: 8:00 AM - 5:00 PM<br />
                  Sábados: 9:00 AM - 2:00 PM
                </p>
              </div>

              <div>
                <span className="text-xs text-slate-400 block font-semibold">Ubicación:</span>
                <a 
                  href={googleMapsUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sky-300 hover:text-white text-xs underline inline-flex items-center gap-1 mt-0.5"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>San Jacinto, CA (Ver en Google Maps)</span>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} {t.footer.rights}</p>
          <p className="flex items-center gap-1">
            <span>Atención dedicada con</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>para nuestros adultos mayores</span>
          </p>
        </div>

      </div>
    </footer>
  );
}
