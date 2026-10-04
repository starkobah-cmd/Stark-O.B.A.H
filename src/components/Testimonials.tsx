import React from 'react';
import { motion } from 'motion/react';
import { Star, Quote, TrendingUp, CheckCircle, Sparkles } from 'lucide-react';
import { testimonialsData } from '../data/agencyData';

export const Testimonials: React.FC = () => {
  return (
    <section id="testimonials" className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-bold uppercase tracking-wider">
            <span>Testimonials & Stories</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Client Reviews & <span className="text-sky-600">Real Success Stories</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Hear directly from business leaders, brand founders, and marketing directors who trust Netronomic.
          </p>
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonialsData.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-sky-50/40 rounded-3xl p-8 border border-sky-100 flex flex-col justify-between hover:bg-white hover:shadow-xl hover:border-sky-300 transition-all group"
            >
              <div className="space-y-4">
                {/* Header: Rating & Quote Icon */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-8 h-8 text-sky-300 opacity-60 group-hover:text-sky-500 transition-colors" />
                </div>

                {/* Service Used Chip */}
                <span className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200">
                  {review.serviceUsed}
                </span>

                {/* Comment */}
                <p className="text-sm text-slate-700 leading-relaxed italic">
                  "{review.comment}"
                </p>
              </div>

              {/* Author Footer */}
              <div className="pt-6 border-t border-sky-100 flex items-center gap-3 mt-6">
                <img
                  src={review.avatar}
                  alt={review.name}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-full object-cover border-2 border-sky-200 shadow-sm"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{review.name}</h4>
                  <p className="text-xs text-slate-500">{review.role}, <strong className="text-sky-700">{review.company}</strong></p>
                </div>
              </div>

            </motion.div>
          ))}
        </div>

        {/* Success Stories Metric Banner */}
        <div className="mt-16 bg-gradient-to-r from-sky-600 via-sky-500 to-cyan-500 rounded-3xl p-8 text-white shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-sky-200" />
                <span className="text-xs font-bold uppercase tracking-wider text-sky-100">Success Highlight</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold">Over 280+ Businesses Scaled</h3>
              <p className="text-sm text-sky-50 leading-relaxed max-w-2xl">
                From launching custom e-commerce stores to generating 2M+ organic reel views and securing top 3 Google rankings with profile backlinks, our success stories speak for themselves.
              </p>
            </div>
            <div className="lg:col-span-4 flex justify-start lg:justify-end">
              <a
                href="#contact"
                className="px-6 py-3 rounded-xl bg-white text-sky-700 font-bold text-sm shadow-md hover:bg-sky-50 transition-colors"
              >
                Become Our Next Success Story
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
