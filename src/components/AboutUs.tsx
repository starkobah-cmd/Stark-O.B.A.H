import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Target, Eye, Users, Award, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { aboutUsData, agencyInfo } from '../data/agencyData';

export const AboutUs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'who' | 'mission' | 'vision'>('who');

  return (
    <section id="about" className="py-20 bg-slate-50 relative overflow-hidden">
      {/* Sky Blue Decorative Glow */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-sky-200/30 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider whitespace-nowrap">
            <span className="whitespace-nowrap">About Us</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Who We Are, Our Mission & <span className="text-sky-600">Our Vision</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Learn about our core philosophy, digital craftsmanship, and commitment to driving measurable client success.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center max-w-md mx-auto mb-10 p-1 bg-white rounded-2xl border border-sky-100 shadow-xs">
          <button
            onClick={() => setActiveTab('who')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'who'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                : 'text-slate-600 hover:text-sky-600'
            }`}
          >
            Who We Are
          </button>
          <button
            onClick={() => setActiveTab('mission')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'mission'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                : 'text-slate-600 hover:text-sky-600'
            }`}
          >
            Our Mission
          </button>
          <button
            onClick={() => setActiveTab('vision')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'vision'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                : 'text-slate-600 hover:text-sky-600'
            }`}
          >
            Our Vision
          </button>
        </div>

        {/* Tab Content Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Main Info Box */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-7 bg-white p-8 rounded-3xl border border-sky-100 shadow-lg space-y-6"
          >
            {activeTab === 'who' && (
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center font-bold">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-sky-600">Established 2018</span>
                    <h3 className="text-2xl font-bold text-slate-900">{aboutUsData.whoWeAre.title}</h3>
                  </div>
                </div>

                <p className="text-slate-600 leading-relaxed text-base">
                  {aboutUsData.whoWeAre.desc}
                </p>

                <div className="space-y-3 pt-2 border-t border-slate-100">
                  {aboutUsData.whoWeAre.bullets.map((b, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-700 font-medium">{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'mission' && (
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center font-bold">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-sky-600">Empowering Brands</span>
                    <h3 className="text-2xl font-bold text-slate-900">{aboutUsData.mission.title}</h3>
                  </div>
                </div>

                <p className="text-slate-600 leading-relaxed text-base">
                  {aboutUsData.mission.desc}
                </p>

                <div className="p-4 bg-sky-50/70 rounded-2xl border border-sky-100 space-y-2">
                  <h4 className="text-sm font-bold text-sky-900">How We Achieve Our Mission:</h4>
                  <ul className="text-xs sm:text-sm text-sky-800 space-y-1.5 list-disc list-inside">
                    <li>Combining innovative engineering with high-impact UI/UX aesthetics.</li>
                    <li>Maintaining 100% white-hat standards across SEO & profile backlinks.</li>
                    <li>Offering direct communication and transparent milestones.</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'vision' && (
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center font-bold">
                    <Eye className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-sky-600">The Future</span>
                    <h3 className="text-2xl font-bold text-slate-900">{aboutUsData.vision.title}</h3>
                  </div>
                </div>

                <p className="text-slate-600 leading-relaxed text-base">
                  {aboutUsData.vision.desc}
                </p>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="block text-xl font-extrabold text-sky-600">Global Reach</span>
                    <span className="text-xs text-slate-500">Serving clients in 25+ countries</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="block text-xl font-extrabold text-sky-600">Future Ready</span>
                    <span className="text-xs text-slate-500">Integrating modern web tech & AI</span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Right Stats Overview */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            {agencyInfo.stats.map((stat, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-sky-100 shadow-sm hover:border-sky-300 hover:shadow-md transition-all text-center space-y-2"
              >
                <div className="w-10 h-10 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center mx-auto">
                  <Award className="w-5 h-5" />
                </div>
                <span className="block text-3xl font-extrabold text-slate-900">{stat.value}</span>
                <span className="text-xs font-medium text-slate-500 block">{stat.label}</span>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
