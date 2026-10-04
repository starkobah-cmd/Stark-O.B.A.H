import React from 'react';
import { motion } from 'motion/react';
import { Users, Zap, DollarSign, Award, Headphones, ShieldCheck, Check } from 'lucide-react';
import { whyChooseData } from '../data/agencyData';

export const WhyChooseUs: React.FC = () => {
  const getIcon = (icon: string) => {
    switch (icon) {
      case 'Users': return <Users className="w-6 h-6" />;
      case 'Zap': return <Zap className="w-6 h-6" />;
      case 'DollarSign': return <DollarSign className="w-6 h-6" />;
      case 'Award': return <Award className="w-6 h-6" />;
      case 'Headphones': return <Headphones className="w-6 h-6" />;
      default: return <ShieldCheck className="w-6 h-6" />;
    }
  };

  return (
    <section id="why-us" className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-bold uppercase tracking-wider">
            <span>Why Choose Us</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            5 Core Pillars That Make Us <span className="text-sky-600">The Preferred Agency</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            We don't just deliver files — we craft digital assets engineered for speed, affordability, pixel precision, and long-term client success.
          </p>
        </div>

        {/* 5 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {whyChooseData.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="bg-sky-50/40 rounded-2xl border border-sky-100 p-6 hover:bg-white hover:shadow-xl hover:border-sky-300 transition-all duration-300 group space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-sky-500 text-white flex items-center justify-center shadow-md shadow-sky-500/20 group-hover:scale-110 transition-transform">
                  {getIcon(item.icon)}
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-sky-100 text-sky-800 border border-sky-200">
                  {item.highlight}
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                {item.title}
              </h3>

              <p className="text-sm text-slate-600 leading-relaxed">
                {item.description}
              </p>

              <div className="pt-3 border-t border-sky-100 flex items-center gap-1.5 text-xs font-semibold text-sky-700">
                <Check className="w-4 h-4 text-sky-500" />
                <span>Guaranteed Standard</span>
              </div>
            </motion.div>
          ))}

          {/* Bonus Guarantee Banner Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="bg-gradient-to-br from-sky-600 to-sky-700 rounded-2xl p-6 text-white flex flex-col justify-between shadow-lg"
          >
            <div className="space-y-3">
              <span className="inline-block text-[11px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-white/20">
                Client Satisfaction
              </span>
              <h3 className="text-2xl font-bold">100% Satisfaction Guarantee</h3>
              <p className="text-xs sm:text-sm text-sky-100 leading-relaxed">
                We work closely with you through every iteration until your vision is completely realized. Zero compromises.
              </p>
            </div>

            <a
              href="#contact"
              className="mt-6 inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-white text-sky-700 font-bold text-xs sm:text-sm hover:bg-sky-50 transition-colors"
            >
              Start Your Project Today
            </a>
          </motion.div>
        </div>

      </div>
    </section>
  );
};
