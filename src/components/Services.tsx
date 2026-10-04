import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Globe,
  Palette,
  Image as ImageIcon,
  Video,
  Smartphone,
  FileText,
  TrendingUp,
  Link,
  Share2,
  Check,
  ArrowRight,
  Clock,
  Sparkles,
  Info,
  Search,
  Lock,
} from 'lucide-react';
import { servicesData } from '../data/agencyData';
import { ServiceItem } from '../types';

interface ServicesProps {
  onSelectService: (service: ServiceItem) => void;
  onRequestQuoteForService: (serviceTitle: string) => void;
}

export const Services: React.FC<ServicesProps> = ({ onSelectService, onRequestQuoteForService }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'development' | 'design' | 'marketing' | 'editing'>('all');

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Globe': return <Globe className="w-6 h-6" />;
      case 'Palette': return <Palette className="w-6 h-6" />;
      case 'Image': return <ImageIcon className="w-6 h-6" />;
      case 'Video': return <Video className="w-6 h-6" />;
      case 'Smartphone': return <Smartphone className="w-6 h-6" />;
      case 'FileText': return <FileText className="w-6 h-6" />;
      case 'TrendingUp': return <TrendingUp className="w-6 h-6" />;
      case 'Search': return <Search className="w-6 h-6" />;
      case 'Link': return <Link className="w-6 h-6" />;
      case 'Share2': return <Share2 className="w-6 h-6" />;
      case 'Lock': return <Lock className="w-6 h-6" />;
      default: return <Sparkles className="w-6 h-6" />;
    }
  };

  const filteredServices = activeTab === 'all'
    ? servicesData
    : servicesData.filter((s) => s.category === activeTab);

  return (
    <section id="services" className="py-20 bg-white relative overflow-hidden">
      {/* Subtle Sky Blue Gradient Accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-sky-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Our Services</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Comprehensive Digital Solutions Built to <span className="text-sky-600">Elevate Your Business</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            From website architecture and mobile applications to logo identity, reel editing, SEO keyword research, and backlink networks — explore our flagship services.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-8 mb-12">
          {[
            { id: 'all', label: `All Services (${servicesData.length})` },
            { id: 'development', label: 'Web Development' },
            { id: 'design', label: 'Logo & Graphic Design' },
            { id: 'editing', label: 'Reel Video Editing' },
            { id: 'marketing', label: 'SEO, Keywords & Marketing' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-sky-50 hover:text-sky-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Services Grid (9 Services) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className={`rounded-2xl border p-6 shadow-sm spotlight-card flex flex-col justify-between group relative overflow-hidden ${
                service.badge === 'Coming Soon'
                  ? 'bg-slate-50/70 border-dashed border-slate-300 opacity-85 hover:opacity-100'
                  : 'bg-white border-sky-100 hover:shadow-xl hover:border-sky-300'
              }`}
            >
              {/* Badge if present */}
              {service.badge && (
                <div className={`absolute top-4 right-4 text-[10px] uppercase tracking-widest font-extrabold px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1 ${
                  service.badge === 'Coming Soon' ? 'bg-slate-800 text-slate-200' : 'bg-sky-500 text-white'
                }`}>
                  {service.badge === 'Coming Soon' && <Lock className="w-3 h-3" />}
                  <span>{service.badge}</span>
                </div>
              )}

              <div>
                {/* Icon box */}
                <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100 group-hover:bg-sky-500 group-hover:text-white group-hover:scale-110 transition-all duration-300 mb-5">
                  {getIcon(service.iconName)}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-sky-600 transition-colors mb-2">
                  {service.title}
                </h3>

                {/* Short Description */}
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  {service.shortDesc}
                </p>

                {/* Key Features list */}
                <ul className="space-y-2 mb-6 border-t border-slate-100 pt-4">
                  {service.features.slice(0, 3).map((feat, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                      <Check className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Card Footer: Starting Price, Turnaround & CTA */}
              <div className="pt-4 border-t border-sky-50 flex items-center justify-between gap-2">
                <div>
                  <span className="text-[11px] text-slate-600 block">Starting from</span>
                  <span className="text-lg font-extrabold text-slate-900">{service.startingPrice}</span>
                  <div className="flex items-center gap-1 text-[11px] text-sky-600">
                    <Clock className="w-3 h-3" />
                    <span>{service.deliveryTime}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectService(service)}
                    className="p-2.5 rounded-xl bg-sky-50 text-sky-700 hover:bg-sky-100 transition-colors"
                    title="View Full Service Details"
                  >
                    <Info className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onRequestQuoteForService(service.title)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold shadow-xs transition-colors btn-shimmer group/btn cursor-pointer"
                  >
                    <span>Request</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
