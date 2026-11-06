import React from 'react';
import { Star, MessageSquareQuote, CheckCircle2 } from 'lucide-react';
import { reviews } from '../data/reviews';

export default function ReviewsSection({ t, lang }) {
  return (
    <section id="resenas" className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 font-bold px-4 py-1.5 rounded-full text-sm mb-3 border border-amber-300">
            <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span>{t.reviews.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-navy-900 tracking-tight">
            {t.reviews.title}
          </h2>
          <p className="mt-3 text-lg text-slate-600">
            {t.reviews.subtitle}
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Rating stars & verified */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-1">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verificado</span>
                  </span>
                </div>

                {/* Treatment tag */}
                <span className="inline-block text-xs font-bold text-brand-blue bg-blue-50 px-2.5 py-1 rounded-md mb-3 border border-blue-100">
                  {rev.treatment}
                </span>

                {/* Comment quote */}
                <p className="text-slate-700 text-base leading-relaxed italic mb-6">
                  "{lang === 'es' ? rev.comment_es : rev.comment_en}"
                </p>
              </div>

              {/* Author Info */}
              <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                <div className={`w-11 h-11 rounded-full ${rev.avatarBg} text-white font-black flex items-center justify-center text-sm shadow`}>
                  {rev.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                </div>
                <div>
                  <div className="font-bold text-navy-900 text-sm sm:text-base leading-tight">
                    {rev.name}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {rev.age} • {rev.location}
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Reassurance Banner under reviews */}
        <div className="mt-12 bg-white rounded-2xl p-6 border-2 border-dashed border-slate-300 text-center max-w-3xl mx-auto">
          <p className="text-base text-slate-700 font-medium">
            <span className="font-bold text-navy-900">¿Desea una segunda opinión o revisar su dentadura actual?</span> Le atendemos con la misma paciencia y respeto que a nuestros propios padres y abuelos.
          </p>
        </div>

      </div>
    </section>
  );
}
