import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Clock, DollarSign, ArrowRight, MessageSquare } from 'lucide-react';
import { ServiceItem } from '../types';
import { agencyInfo } from '../data/agencyData';
import { SiteConfig } from '../data/siteConfig';

interface ServiceModalProps {
  siteConfig?: SiteConfig;
  service: ServiceItem | null;
  onClose: () => void;
  onRequestQuote: (serviceTitle: string) => void;
}

export const ServiceModal: React.FC<ServiceModalProps> = ({ siteConfig, service, onClose, onRequestQuote }) => {
  const activeAgency = siteConfig?.agency || agencyInfo;
  if (!service) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 relative shadow-2xl overflow-hidden border border-sky-100 max-h-[90vh] overflow-y-auto"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-sky-50 hover:text-sky-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="space-y-3 mb-6">
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-sky-100 text-sky-800">
              {service.category.toUpperCase()} SERVICE
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{service.title}</h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">{service.fullDesc}</p>
          </div>

          {/* Key Deliverables */}
          <div className="space-y-3 mb-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">What's Included:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {service.features.map((feat, i) => (
                <div key={i} className="flex items-start gap-2 p-2.5 rounded-xl bg-sky-50/70 text-slate-800 text-xs font-semibold">
                  <Check className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Price & Turnaround Box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-xs text-slate-500 block">Starting Investment</span>
              <span className="text-2xl font-extrabold text-slate-900">{service.startingPrice}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">Average Delivery</span>
              <span className="text-sm font-bold text-sky-700 flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {service.deliveryTime}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => {
                onClose();
                onRequestQuote(service.title);
              }}
              className="w-full sm:flex-1 py-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Request Quote For This Service</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="https://wa.me/923020487103"
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-shine-btn w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              title="Message Netronomic Web on WhatsApp"
              aria-label="Message Netronomic Web on WhatsApp"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Message Netronomic Web on WhatsApp</span>
            </a>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
