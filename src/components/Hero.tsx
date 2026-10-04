import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2, Star, MessageSquare, ShieldCheck, Play, Sparkles } from 'lucide-react';
import { SiteConfig } from '../data/siteConfig';
import { agencyInfo } from '../data/agencyData';

interface HeroProps {
  onGetStarted: () => void;
  onExploreServices: () => void;
  siteConfig?: SiteConfig;
}

const DEFAULT_PHRASES = [
  'Website Development',
  'Logo & Poster Design',
  'Viral Video Reels',
  'Google SEO',
  'SEO Backlinks',
  'Digital Growth'
];

const TypewriterText: React.FC<{ phrases?: string[] }> = ({ phrases = DEFAULT_PHRASES }) => {
  const activePhrases = phrases.length > 0 ? phrases : DEFAULT_PHRASES;
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = activePhrases[phraseIndex % activePhrases.length] || 'Web Build';
    let timer: NodeJS.Timeout;

    if (!isDeleting && charIndex < currentPhrase.length) {
      timer = setTimeout(() => {
        setCharIndex((prev) => prev + 1);
      }, 65);
    } else if (!isDeleting && charIndex === currentPhrase.length) {
      timer = setTimeout(() => {
        setIsDeleting(true);
      }, 2200);
    } else if (isDeleting && charIndex > 0) {
      timer = setTimeout(() => {
        setCharIndex((prev) => prev - 1);
      }, 35);
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setPhraseIndex((prev) => (prev + 1) % activePhrases.length);
    }

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, phraseIndex, activePhrases]);

  const currentPhrase = activePhrases[phraseIndex % activePhrases.length] || 'Web Build';
  const currentText = currentPhrase.substring(0, charIndex);

  return (
    <span className="inline-flex items-center min-h-[1.2em] max-w-full whitespace-nowrap overflow-hidden">
      <span className="bg-gradient-to-r from-sky-600 via-sky-500 to-cyan-500 bg-clip-text text-transparent font-extrabold pb-1 whitespace-nowrap">
        {currentText}
      </span>
      <span className="inline-block w-[3.5px] h-[0.85em] bg-sky-500 ml-1.5 animate-pulse rounded-full shadow-[0_0_10px_#38bdf8] shrink-0" />
    </span>
  );
};

export const Hero: React.FC<HeroProps> = ({ onGetStarted, onExploreServices, siteConfig }) => {
  const activeAgency = siteConfig?.agency || agencyInfo;
  const heroData = siteConfig?.hero || {
    titlePrefix: 'Accelerate Your Brand with',
    typingPhrases: DEFAULT_PHRASES,
    subtitle: 'Full-stack engineering, custom branding, high-DA backlinks, and viral reel editing engineered for fast growth and maximum ROI.',
    primaryCtaText: 'Get Started Today',
    secondaryCtaText: 'Explore Our Services',
  };

  const [tiltStyle, setTiltStyle] = useState({ transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)' });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotateX = (-y / 20).toFixed(2);
    const rotateY = (x / 20).toFixed(2);
    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({ transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)' });
  };

  return (
    <section id="home" className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden bg-gradient-to-b from-sky-50/70 via-white to-sky-50/30">
      {/* Background Decorative Sky Blue Glows & Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#0284c7_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-sky-300/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Heading, Intro, CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            {/* Top Subtitle / Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100/80 border border-sky-200/60 text-sky-700 text-xs sm:text-sm font-semibold">
              <Sparkles className="w-4 h-4 text-sky-500" />
              <span>Netronomic - Exploring Modern Tech & Web Development</span>
            </div>

            {/* Main Heading with Animated Typing Effect */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.18] min-h-[110px] sm:min-h-[135px] flex flex-col justify-start">
              <span>{heroData.titlePrefix}</span>
              <div className="mt-1 sm:mt-2.5 overflow-visible">
                <TypewriterText phrases={heroData.typingPhrases} />
              </div>
            </h1>

            {/* Short Introduction */}
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {heroData.subtitle}
            </p>

            {/* Key Value Micro Bullet Points */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-y-2 gap-x-6 text-xs sm:text-sm font-semibold text-slate-700 pt-1">
              <div className="flex items-center gap-1.5 bg-white/80 px-3 py-1.5 rounded-xl border border-sky-100 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-sky-500" />
                <span>Pixel-Perfect Design</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/80 px-3 py-1.5 rounded-xl border border-sky-100 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-sky-500" />
                <span>Fast 24-48h Delivery</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/80 px-3 py-1.5 rounded-xl border border-sky-100 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-sky-500" />
                <span>Transparent Pricing</span>
              </div>
            </div>

            {/* CTA Buttons (Get Started / Contact Us) */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={onGetStarted}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-sky-500 via-sky-600 to-cyan-600 text-white font-bold text-base shadow-xl shadow-sky-500/30 hover:shadow-2xl hover:shadow-sky-500/40 transition-all cursor-pointer group btn-shimmer"
              >
                <span>{heroData.primaryCtaText || 'Get Started Now'}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
              </motion.button>

              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href="#services"
                onClick={(e) => {
                  e.preventDefault();
                  onExploreServices();
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white border border-sky-200 text-sky-700 font-bold text-base hover:bg-sky-50/80 hover:border-sky-300 transition-all cursor-pointer shadow-xs"
              >
                <span>{heroData.secondaryCtaText || 'Explore Our Services'}</span>
              </motion.a>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t border-sky-100/80 flex items-center justify-center lg:justify-start gap-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-slate-600">
                <strong className="text-slate-900 font-bold">4.9/5 Rating</strong> from 280+ Worldwide Businesses
              </p>
            </div>
          </motion.div>

          {/* Right Column: Visual Showcase Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            {/* Floating Top Left Badge */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-5 -left-4 z-20 hidden sm:flex items-center gap-2 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-sky-100 shadow-xl text-xs font-bold text-slate-800"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span>Speed Score: 99/100</span>
            </motion.div>

            {/* Floating Bottom Right Badge */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-5 -right-4 z-20 hidden sm:flex items-center gap-2.5 bg-gradient-to-r from-sky-600 to-cyan-600 text-white px-4 py-2.5 rounded-2xl shadow-xl text-xs font-bold"
            >
              <ShieldCheck className="w-4 h-4 text-sky-200" />
              <span>100% Quality Guaranteed</span>
            </motion.div>

            <div 
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{ ...tiltStyle, willChange: 'transform' }}
              className="relative mx-auto max-w-md lg:max-w-none transition-transform duration-100 ease-out cursor-pointer"
            >
              {/* Outer Decorative Ring */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-sky-400 to-cyan-300 rounded-3xl blur-md opacity-40 animate-pulse pointer-events-none" />

              {/* Card Surface */}
              <div className="relative bg-white rounded-2xl border border-sky-100 shadow-xl overflow-hidden p-6 space-y-6">
                
                {/* Header bar */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  </div>
                  <span className="text-[11px] font-mono text-sky-600 font-semibold bg-sky-50 px-2 py-0.5 rounded-md border border-sky-100">
                    netronomic.com
                  </span>
                </div>

                {/* Main Feature Highlight */}
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="bg-gradient-to-br from-sky-600 via-sky-700 to-cyan-800 rounded-2xl p-6 text-white space-y-4 shadow-lg relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex items-center justify-between relative z-10">
                    <span className="text-[11px] uppercase font-bold tracking-wider text-sky-200 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/15">Featured Service</span>
                    <span className="text-[11px] font-bold bg-emerald-400/20 text-emerald-200 border border-emerald-400/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" /> Active
                    </span>
                  </div>
                  <h3 className="text-xl font-bold relative z-10">Website Suite</h3>
                  <p className="text-sky-100 text-xs sm:text-sm leading-relaxed relative z-10">
                    Custom responsive development, high-speed cloud infrastructure, & SEO backlinks built under one roof.
                  </p>

                  <div className="grid grid-cols-2 gap-3 pt-2 relative z-10">
                    <div className="bg-white/10 rounded-xl p-3 backdrop-blur-xs border border-white/10">
                      <span className="block text-2xl font-black">99.8%</span>
                      <span className="text-[11px] text-sky-100">Lighthouse Score</span>
                    </div>
                    <div className="bg-white/10 rounded-xl p-3 backdrop-blur-xs border border-white/10">
                      <span className="block text-2xl font-black">&lt; 24h</span>
                      <span className="text-[11px] text-sky-100">Design Turnaround</span>
                    </div>
                  </div>
                </motion.div>

                {/* Quick Interactive Service Chips */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Top Request Categories</div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      'Website Development',
                      'Logo & Poster Design',
                      'Info Reel Editing',
                      'SEO & Backlinks'
                    ].map((chip) => (
                      <motion.div
                        key={chip}
                        whileHover={{ scale: 1.03, x: 2 }}
                        className="flex items-center gap-2 p-2.5 rounded-xl bg-sky-50/70 border border-sky-100/80 text-slate-800 text-xs font-semibold cursor-default hover:bg-sky-100/70 hover:border-sky-200 transition-colors"
                      >
                        <span className="w-2 h-2 rounded-full bg-sky-500 shadow-xs" />
                        <span>{chip}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Bottom WhatsApp bar */}
                <a
                  href="https://wa.me/923020487103"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whatsapp-shine-btn flex items-center justify-between p-3.5 rounded-xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200/80 hover:border-emerald-300 transition-all group cursor-pointer shadow-sm"
                  title="Message Netronomic Web on WhatsApp"
                  aria-label="Message Netronomic Web on WhatsApp"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-sm shadow-xs group-hover:scale-105 transition-transform">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                        <span>Message Netronomic Web on WhatsApp</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                      </p>
                      <p className="text-[11px] text-emerald-700 font-mono">https://wa.me/923020487103</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition-transform" />
                </a>

              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
