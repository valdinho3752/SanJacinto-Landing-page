import React, { useState } from 'react';
import { ShoppingCart, Check, Tag, Info, Calendar } from 'lucide-react';
import { servicesData } from '../data/services';

export default function PricingSection({ 
  t, 
  lang, 
  addToCart, 
  cartItems, 
  onBookClick 
}) {
  // State for arch selection for individual dentures
  const [archSelection, setArchSelection] = useState({
    'full-single': 'upper',
    'partial': 'upper'
  });

  const handleArchChange = (serviceId, arch) => {
    setArchSelection(prev => ({
      ...prev,
      [serviceId]: arch
    }));
  };

  return (
    <section id="precios" className="py-16 bg-slate-100/70 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-navy-900 text-sky-300 font-bold px-4 py-1.5 rounded-full text-sm mb-3">
            <Tag className="w-4 h-4 text-amber-400" />
            <span>{t.services.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-navy-900 tracking-tight">
            {t.services.title}
          </h2>
          <p className="mt-4 text-lg text-slate-700 font-medium">
            {t.services.subtitle}
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
          {servicesData.map((service) => {
            const isFeatured = service.featured;
            const currentArch = archSelection[service.id] || 'both';
            const inCart = cartItems.some(item => item.id === service.id && (!service.options.length || item.arch === currentArch));

            return (
              <div 
                key={service.id}
                className={`flex flex-col justify-between bg-white rounded-3xl p-6 sm:p-8 transition-all duration-300 shadow-md hover:shadow-xl border-2 ${
                  isFeatured 
                    ? 'border-brand-blue ring-4 ring-blue-100 relative' 
                    : 'border-slate-200'
                }`}
              >
                {/* Featured Ribbon Badge */}
                {isFeatured && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-brand-blue text-white font-extrabold text-xs uppercase tracking-wider py-1.5 px-4 rounded-full shadow-md">
                    {lang === 'es' ? service.badge_es : service.badge_en}
                  </div>
                )}

                <div>
                  {/* Service Title */}
                  <div className="min-h-[60px]">
                    <h3 className="text-xl sm:text-2xl font-black text-navy-900 leading-snug">
                      {service.name}
                    </h3>
                    <p className="text-sm font-semibold text-brand-blue mt-1">
                      {lang === 'es' ? service.spanishName : service.name}
                    </p>
                  </div>

                  {/* Price Tag */}
                  <div className="my-6 py-4 px-5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-baseline justify-between">
                    <div>
                      <span className="text-xs text-slate-500 font-bold block uppercase tracking-wider">
                        {lang === 'es' ? 'Precio Total Fijo' : 'Fixed Total Price'}
                      </span>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span className="text-4xl sm:text-5xl font-black text-navy-900 tracking-tight">
                          ${service.price}
                        </span>
                        <span className="text-slate-500 font-bold text-sm">USD</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-300">
                      {t.services.guaranteedBadge || (lang === 'es' ? 'Garantizado' : 'Guaranteed')}
                    </span>
                  </div>

                  {/* Arch selection for single arch options */}
                  {service.options.includes('upper') && (
                    <div className="mb-6 p-3.5 bg-sky-50/70 rounded-xl border border-sky-200">
                      <label className="block text-xs font-bold text-navy-900 uppercase tracking-wide mb-2">
                        {t.cart.archSelection}
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => handleArchChange(service.id, 'upper')}
                          className={`py-2 px-3 text-xs sm:text-sm font-bold rounded-lg border transition-all ${
                            currentArch === 'upper'
                              ? 'bg-brand-blue text-white border-brand-blue shadow-sm'
                              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          {t.services.upperArchBtn || (lang === 'es' ? 'Superior (Arriba)' : 'Upper Arch')}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleArchChange(service.id, 'lower')}
                          className={`py-2 px-3 text-xs sm:text-sm font-bold rounded-lg border transition-all ${
                            currentArch === 'lower'
                              ? 'bg-brand-blue text-white border-brand-blue shadow-sm'
                              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          {t.services.lowerArchBtn || (lang === 'es' ? 'Inferior (Abajo)' : 'Lower Arch')}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">
                    {lang === 'es' ? service.desc_es : service.desc_en}
                  </p>

                  {/* Features List */}
                  <ul className="space-y-3 mb-8">
                    {(lang === 'es' ? service.features_es : service.features_en).map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700">
                        <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Actions: Add to Cart & Book */}
                <div className="pt-4 border-t border-slate-200 flex flex-col gap-2.5">
                  <button
                    onClick={() => addToCart(service, currentArch)}
                    className={`w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-extrabold text-base transition-all shadow ${
                      inCart
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-brand-blue hover:bg-brand-hover text-white'
                    }`}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>{inCart ? `${t.services.inCart} (✓)` : t.services.addToCart}</span>
                  </button>

                  <button
                    onClick={() => onBookClick(service.name)}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-sm text-navy-900 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-300"
                  >
                    <Calendar className="w-4 h-4 text-brand-blue" />
                    <span>{t.services.bookThis}</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
