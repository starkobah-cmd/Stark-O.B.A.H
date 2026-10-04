import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PortfolioItem } from '../types';
import { PortfolioCard } from './PortfolioCard';
import { PORTFOLIO_CATEGORIES } from '../data/agencyData';

interface PortfolioPageProps {
  items: PortfolioItem[];
  onSelectPortfolio: (item: PortfolioItem) => void;
}

export const PortfolioPage: React.FC<PortfolioPageProps> = ({ items = [], onSelectPortfolio }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const filteredItems = activeCategory === 'All' 
    ? items 
    : items.filter(item => item.category === activeCategory);

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-32">
      {/* Header */}
      <div className="bg-slate-900 py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-20"></div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">Our Complete Portfolio</h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Explore our diverse range of successful projects across all our professional service categories.
          </p>
        </div>
      </div>

      {/* Filters & Grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-12">
        
        {/* Category Filters (Horizontal Scroll on Mobile) */}
        <div className="flex overflow-x-auto pb-4 mb-8 -mx-6 px-6 lg:mx-0 lg:px-0 hide-scrollbar gap-2 lg:flex-wrap lg:justify-center">
          <button
            onClick={() => setActiveCategory('All')}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-all ${
              activeCategory === 'All' 
                ? 'bg-sky-600 text-white shadow-md' 
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All Projects
          </button>
          {PORTFOLIO_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-all ${
                activeCategory === cat.id 
                  ? 'bg-sky-600 text-white shadow-md' 
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Portfolio Grid */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeCategory}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredItems.length > 0 ? (
              filteredItems.map(item => (
                <PortfolioCard key={item.id} item={item} onClick={onSelectPortfolio} />
              ))
            ) : (
              <div className="col-span-full py-20 text-center text-slate-500">
                <p className="text-lg font-medium">No projects found in this category yet.</p>
                <button 
                  onClick={() => setActiveCategory('All')}
                  className="mt-4 text-sky-600 font-bold hover:underline"
                >
                  View all projects
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
};
