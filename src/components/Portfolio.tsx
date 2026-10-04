import React from 'react';
import { ArrowRight } from 'lucide-react';
import { PortfolioItem } from '../types';
import { PortfolioCard } from './PortfolioCard';
import { SiteConfig } from '../data/siteConfig';

interface PortfolioProps {
  items: PortfolioItem[];
  siteConfig?: SiteConfig;
  onSelectPortfolio: (item: PortfolioItem) => void;
  onViewAll: () => void;
}

export const Portfolio: React.FC<PortfolioProps> = ({ items = [], siteConfig, onSelectPortfolio, onViewAll }) => {
  let featuredItems = items.filter(item => item.featured).slice(0, 6);
  if (featuredItems.length === 0) {
    featuredItems = items.slice(0, 6);
  }

  if (featuredItems.length === 0) {
    return null;
  }

  const sectionConfig = (siteConfig as any)?.layout?.sections?.find((s: any) => s.id === 'sec-portfolio') || {
    title: 'Featured Portfolio',
    subtitle: 'Our Latest Digital Masterpieces',
    badge: 'Portfolio'
  };

  return (
    <section id="portfolio" className="py-24 sm:py-32 bg-slate-50 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-30"></div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="max-w-2xl text-left sm:text-center sm:mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-sky-100 shadow-sm text-sky-600 font-bold text-xs tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
            {sectionConfig.badge}
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            {sectionConfig.title}
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            {sectionConfig.subtitle}
          </p>
        </div>

        {/* Grid of Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredItems.map((item) => (
            <PortfolioCard key={item.id} item={item} onClick={onSelectPortfolio} />
          ))}
        </div>
        
        <div className="mt-16 flex justify-center">
          <button
            onClick={onViewAll}
            className="group inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-sky-600 transition-all duration-300 shadow-lg hover:shadow-sky-500/25"
          >
            View All Portfolio
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};
