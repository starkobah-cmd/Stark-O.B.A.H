import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Search, HelpCircle, Sparkles } from 'lucide-react';
import { faqData } from '../data/agencyData';

export const FAQ: React.FC = () => {
  const [openId, setOpenId] = useState<string>('faq-1');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const toggleFAQ = (id: string) => {
    setOpenId(openId === id ? '' : id);
  };

  const filteredFAQs = faqData.filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section id="faq" className="py-20 bg-slate-50 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider">
            <span>FAQ</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked <span className="text-sky-600">Questions</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Got questions about our services, timelines, SEO backlinks, or pricing? Find clear answers below.
          </p>
        </div>

        {/* Search input */}
        <div className="relative mb-8 max-w-lg mx-auto">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions (e.g. backlinks, turnaround, website)..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-sky-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400 text-sm shadow-xs"
          />
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((faq) => {
              const isOpen = openId === faq.id;

              return (
                <div
                  key={faq.id}
                  className={`bg-white rounded-2xl border transition-all overflow-hidden ${
                    isOpen ? 'border-sky-400 shadow-md ring-1 ring-sky-300/40' : 'border-sky-100 shadow-xs hover:border-sky-200'
                  }`}
                >
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full text-left p-6 flex items-center justify-between gap-4 focus:outline-none cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 border border-sky-100 shrink-0">
                        {faq.category}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900">
                        {faq.question}
                      </h3>
                    </div>

                    <div className={`p-1.5 rounded-full transition-transform duration-300 shrink-0 ${
                      isOpen ? 'bg-sky-500 text-white rotate-180' : 'bg-slate-100 text-slate-600'
                    }`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-6 pb-6 text-sm text-slate-600 leading-relaxed border-t border-slate-50 pt-3">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-sky-100 p-6 space-y-2">
              <HelpCircle className="w-8 h-8 text-sky-400 mx-auto" />
              <p className="text-slate-700 font-bold">No matching questions found.</p>
              <p className="text-xs text-slate-500">Contact us directly via WhatsApp or Email for instant answers!</p>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};
