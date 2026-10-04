import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Check,
  X,
  Sparkles,
  Zap,
  Crown,
  ShieldCheck,
  ArrowRight,
  Star,
  Globe,
  Palette,
  Image as ImageIcon,
  Video,
  Smartphone,
  FileText,
  TrendingUp,
  Link as LinkIcon,
  Share2,
  MessageSquare,
  HelpCircle
} from 'lucide-react';

interface PricingProps {
  onSelectPlan: (planName: string) => void;
}

interface PackagePlan {
  id: string;
  name: string;
  badge?: string;
  badgeType?: 'popular' | 'luxury';
  tagline: string;
  priceStartingOneTime: string;
  priceStartingMonthly: string;
  customQuoteAvailable: boolean;
  icon: React.ElementType;
  glowColor: string;
  borderColor: string;
  features: string[];
  notIncluded?: string[];
  isPopular?: boolean;
}

const packages: PackagePlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    tagline: 'Essential digital starter pack for small businesses & emerging brands.',
    priceStartingOneTime: '$299',
    priceStartingMonthly: '$199',
    customQuoteAvailable: true,
    icon: Zap,
    glowColor: 'from-sky-500/20 via-blue-500/10 to-transparent',
    borderColor: 'border-slate-800 hover:border-sky-500/50',
    features: [
      'Website Design & Dev (3-5 Pages)',
      'Logo & Poster Design (1 Vector Concept & 2 Posters)',
      'Basic On-Page SEO Setup',
      'Blog Article (1x 1,000 words)',
      '10 High-DA Profile Backlinks',
      '1 Week Free Technical Support'
    ],
    notIncluded: [
      'Short-Form Viral Reels',
      'Social Media Backlinks Campaign'
    ]
  },
  {
    id: 'standard',
    name: 'Standard',
    badge: '⭐ Most Popular',
    badgeType: 'popular',
    isPopular: true,
    tagline: 'High-growth package for brands scaling search traffic, social & conversions.',
    priceStartingOneTime: '$699',
    priceStartingMonthly: '$499',
    customQuoteAvailable: true,
    icon: Sparkles,
    glowColor: 'from-sky-500/30 via-blue-600/20 to-cyan-400/20',
    borderColor: 'border-sky-400 shadow-[0_0_35px_rgba(56,189,248,0.25)]',
    features: [
      'Custom React/Next Website (Up to 10 Pages)',
      '3 Logo Variations & Style Guide Sheet',
      '3 Edited Reels with Kinetic Captions',
      'Blog & Content Writing (3x Articles)',
      'Full Technical SEO Audit & Keyword Plan',
      '30 Manual High-DA Profile Backlinks',
      '25 Active Social Signal Backlinks',
      '1 Month Dedicated Agency Support'
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    badge: '👑 Luxury Enterprise',
    badgeType: 'luxury',
    tagline: 'All-inclusive agency powerhouse with web dev, viral media & high-PR SEO.',
    priceStartingOneTime: '$1,499',
    priceStartingMonthly: '$999',
    customQuoteAvailable: true,
    icon: Crown,
    glowColor: 'from-amber-500/20 via-sky-500/20 to-blue-600/20',
    borderColor: 'border-amber-500/40 hover:border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.15)]',
    features: [
      'Full Custom Web App & E-Commerce Portal',
      'Unlimited Logo Revisions + Complete Branding Kit',
      '8 Short-Form Viral Reels',
      '8 High-Authority SEO Articles (1,500+ words)',
      'Complete SEO Suite (On-Page + Technical + Audit)',
      '100 Manual High-DA Profile Backlinks',
      '75 Social Backlinks & Bookmarks',
      '24/7 VIP Priority Manager Support'
    ]
  }
];

interface ComparisonRow {
  serviceName: string;
  icon: React.ElementType;
  basic: string | boolean;
  standard: string | boolean;
  premium: string | boolean;
}

const comparisonData: ComparisonRow[] = [
  {
    serviceName: 'Website Design & Development',
    icon: Globe,
    basic: '3-5 Pages (Landing/Business)',
    standard: 'Up to 10 Pages (React/Next)',
    premium: 'Full Web App & E-Commerce'
  },
  {
    serviceName: 'Logo & Poster Design',
    icon: Palette,
    basic: '1 Concept + 2 Posters',
    standard: '3 Concepts + Posters & Guide',
    premium: 'Unlimited + Posters & Brand Kit'
  },
  {
    serviceName: 'Short-Form Viral Reels',
    icon: Video,
    basic: false,
    standard: '3 Reels with Captions',
    premium: '8 Short-Form Viral Reels'
  },

  {
    serviceName: 'Blog Writing',
    icon: FileText,
    basic: '1 Article (1,000 words)',
    standard: '3 Articles (1,200 words)',
    premium: '8 Articles (1,500+ words)'
  },
  {
    serviceName: 'SEO Services',
    icon: TrendingUp,
    basic: 'Basic On-Page Setup',
    standard: 'Full Technical Audit & Strategy',
    premium: 'Complete SEO Suite & Keywords'
  },
  {
    serviceName: 'Profile Backlinks',
    icon: LinkIcon,
    basic: '10 High-DA Profile Backlinks',
    standard: '30 High-DA Profile Backlinks',
    premium: '100 Manual High-DA Backlinks'
  },
  {
    serviceName: 'Social Backlinks',
    icon: Share2,
    basic: '5 Social Signals',
    standard: '25 Social Backlinks',
    premium: '75 Social Backlinks & Bookmarks'
  }
];

export const Pricing: React.FC<PricingProps> = ({ onSelectPlan }) => {
  const [billingCycle, setBillingCycle] = useState<'oneTime' | 'monthly'>('oneTime');

  return (
    <section id="pricing" className="py-24 bg-[#050816] text-white relative overflow-hidden">
      {/* Background Neon Lighting FX */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-sky-600/15 via-blue-600/10 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-[500px] h-[500px] bg-sky-500/10 blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-0 w-[400px] h-[400px] bg-indigo-600/10 blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Badge & Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(56,189,248,0.2)]"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
            <span>Transparent Pricing Packages</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-white"
          >
            Invest in High-Impact <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-sky-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent">
              Digital Excellence
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto font-normal"
          >
            Select a tailored package designed to elevate your website, design assets, video media, and search engine authority with zero hidden charges.
          </motion.p>

          {/* Billing Cycle Toggle */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25 }}
            className="pt-4 flex justify-center items-center gap-4"
          >
            <span
              className={`text-sm font-semibold transition-colors cursor-pointer ${
                billingCycle === 'oneTime' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
              onClick={() => setBillingCycle('oneTime')}
            >
              One-Time Delivery
            </span>

            <button
              onClick={() => setBillingCycle(billingCycle === 'oneTime' ? 'monthly' : 'oneTime')}
              className="w-16 h-8 bg-slate-800/90 border border-sky-500/30 rounded-full p-1 transition-all relative focus:outline-none shadow-[0_0_15px_rgba(37,99,235,0.2)]"
              aria-label="Toggle Billing Cycle"
            >
              <motion.div
                layout
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className={`w-6 h-6 rounded-full bg-gradient-to-r from-sky-400 to-blue-500 shadow-md ${
                  billingCycle === 'monthly' ? 'translate-x-8' : 'translate-x-0'
                }`}
              />
            </button>

            <span
              className={`text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
                billingCycle === 'monthly' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
              onClick={() => setBillingCycle('monthly')}
            >
              <span>Monthly Agency Retainer</span>
              <span className="text-[10px] bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                Save 25%
              </span>
            </span>
          </motion.div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch mb-24">
          {packages.map((pkg, index) => {
            const IconComp = pkg.icon;
            const priceVal = billingCycle === 'oneTime' ? pkg.priceStartingOneTime : pkg.priceStartingMonthly;
            const periodLabel = billingCycle === 'oneTime' ? 'one-time project' : '/ month retainer';

            return (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className={`relative rounded-3xl p-8 flex flex-col justify-between backdrop-blur-xl pricing-card-hover ${
                  pkg.isPopular
                    ? 'bg-gradient-to-b from-[#0F172A] via-[#0B1120] to-[#070D1B] border-2 border-sky-400 shadow-[0_0_40px_rgba(56,189,248,0.25)] lg:-translate-y-2 z-25'
                    : 'bg-[#0B1120]/80 border border-slate-800/80 hover:border-sky-500/40'
                }`}
              >
                {/* Glow Backdrop overlay */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-b ${pkg.glowColor} pointer-events-none opacity-40`} />

                {/* Top Badge */}
                {pkg.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-30 whitespace-nowrap">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-lg flex items-center gap-1.5 ${
                      pkg.badgeType === 'luxury'
                        ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 border border-amber-200 shadow-amber-500/20'
                        : 'bg-gradient-to-r from-sky-400 via-blue-500 to-cyan-400 text-slate-950 border border-sky-200 shadow-sky-500/30'
                    }`}>
                      {pkg.badge}
                    </span>
                  </div>
                )}

                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                        {pkg.name}
                      </h3>
                      <p className="text-xs text-sky-400/90 font-medium mt-0.5">
                        Starting From
                      </p>
                    </div>
                    <div className={`p-3 rounded-2xl ${
                      pkg.isPopular 
                        ? 'bg-sky-500/20 text-sky-400 border border-sky-400/30' 
                        : 'bg-slate-800/80 text-sky-400 border border-slate-700/50'
                    }`}>
                      <IconComp className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Price display */}
                  <div className="mb-6 pb-6 border-b border-slate-800/80">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                        {priceVal}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        {periodLabel}
                      </span>
                    </div>
                    {pkg.customQuoteAvailable && (
                      <span className="inline-block mt-2 text-[11px] font-semibold text-emerald-400/90 bg-emerald-950/40 border border-emerald-500/20 px-2.5 py-0.5 rounded-md">
                        ✓ Flexible Custom Quotes Available
                      </span>
                    )}
                  </div>

                  {/* Tagline */}
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 font-normal">
                    {pkg.tagline}
                  </p>

                  {/* Deliverables List */}
                  <div className="space-y-3 mb-8">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400 block mb-3">
                      Included Services & Deliverables:
                    </span>
                    {pkg.features.map((feat, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.05 * i }}
                        className="flex items-start gap-3 text-xs sm:text-sm text-slate-200"
                      >
                        <div className="p-0.5 rounded-full bg-sky-500/20 text-sky-400 mt-0.5 shrink-0 border border-sky-400/30">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                        <span className="font-medium text-slate-200">{feat}</span>
                      </motion.div>
                    ))}

                    {pkg.notIncluded && pkg.notIncluded.map((notFeat, i) => (
                      <div key={i} className="flex items-start gap-3 text-xs sm:text-sm text-slate-400 opacity-95">
                        <div className="p-0.5 rounded-full bg-slate-800 text-slate-400 mt-0.5 shrink-0 border border-slate-700">
                          <X className="w-3.5 h-3.5" />
                        </div>
                        <span className="line-through font-medium">{notFeat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card CTA Button */}
                <div className="pt-4 mt-auto">
                  <button
                    onClick={() => onSelectPlan(`${pkg.name} Package (${billingCycle})`)}
                    className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg relative group overflow-hidden btn-shimmer ${
                      pkg.isPopular
                        ? 'bg-gradient-to-r from-sky-500 via-blue-600 to-cyan-500 text-white shadow-sky-500/25 hover:shadow-sky-500/40 hover:scale-[1.02]'
                        : 'bg-slate-800/90 text-white hover:bg-sky-600 hover:text-white border border-slate-700/80 hover:border-sky-400'
                    }`}
                  >
                    <span className="relative z-10">Select {pkg.name} Plan</span>
                    <ArrowRight className="w-4 h-4 relative z-10 transition-transform group-hover:translate-x-1" />
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* BELOW CARDS: NEED A CUSTOM SOLUTION CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl p-8 sm:p-12 md:p-16 bg-gradient-to-r from-sky-950/60 via-blue-950/40 to-slate-900/90 border border-sky-500/30 backdrop-blur-2xl text-center shadow-[0_0_50px_rgba(56,189,248,0.15)] overflow-hidden mt-16"
        >
          {/* Ambient Glow Orbs */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/20 border border-sky-400/40 text-sky-300 text-xs font-bold uppercase tracking-widest shadow-sm">
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              <span>Tailored Agency Packages</span>
            </div>

            <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              Need a Custom Solution?
            </h3>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
              Every business is unique. Contact us for a personalized package tailored to your goals and budget.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => onSelectPlan('Custom Quote')}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-600 to-cyan-500 text-white font-extrabold text-base transition-all duration-300 shadow-[0_0_25px_rgba(56,189,248,0.4)] hover:shadow-[0_0_40px_rgba(56,189,248,0.6)] hover:scale-105 flex items-center justify-center gap-3 cursor-pointer group"
              >
                <MessageSquare className="w-5 h-5 text-sky-200 group-hover:scale-110 transition-transform" />
                <span>Request a Custom Quote</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

