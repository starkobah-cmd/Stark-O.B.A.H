import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from './Logo';
import { SiteConfig } from '../data/siteConfig';
import { Sparkles, CheckCircle2 } from 'lucide-react';

interface SiteLoaderProps {
  siteConfig?: SiteConfig;
  onFinish: () => void;
}

export const SiteLoader: React.FC<SiteLoaderProps> = ({ siteConfig, onFinish }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Smooth progress bar animation over 2 seconds
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 4;
      });
    }, 50);

    const timer = setTimeout(() => {
      onFinish();
    }, 2400);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [onFinish]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="fixed inset-0 z-[99999] bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-100 selection:bg-sky-500 overflow-hidden"
    >
      {/* Background Animated Glowing Spheres */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1.1, 1.4, 1],
          opacity: [0.3, 0.6, 0.4, 0.7, 0.3],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-sky-500/20 via-cyan-500/20 to-blue-600/20 rounded-full blur-[100px] pointer-events-none"
      />

      <div className="relative z-10 flex flex-col items-center text-center space-y-8 max-w-sm w-full">
        {/* Animated Icon Ring Surround */}
        <div className="relative">
          {/* Rotating Outer Glow Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
            className="absolute -inset-6 rounded-full border border-dashed border-sky-400/30 p-2"
          />

          <motion.div
            animate={{ scale: [0.95, 1.05, 0.95] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="relative bg-slate-900/80 border border-slate-800 p-6 rounded-3xl shadow-2xl shadow-sky-500/20 backdrop-blur-xl"
          >
            <Logo size="lg" variant="dark" config={siteConfig?.logo} />
          </motion.div>

          {/* Floating Sparkles */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], y: [-2, 2, -2] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-2 -right-2 p-1.5 rounded-full bg-sky-500/20 border border-sky-400/40 text-sky-400 shadow-lg"
          >
            <Sparkles className="w-4 h-4" />
          </motion.div>
        </div>

        {/* Tagline & Progress Info */}
        <div className="space-y-3 w-full">
          <div className="flex items-center justify-between text-xs font-bold px-1">
            <span className="text-sky-400 uppercase tracking-widest text-[11px] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping inline-block" />
              Initializing Web Experience
            </span>
            <span className="text-slate-400 font-mono">{progress}%</span>
          </div>

          {/* Glowing Animated Progress Bar */}
          <div className="w-full h-2 bg-slate-900 rounded-full p-0.5 border border-slate-800 overflow-hidden shadow-inner">
            <motion.div
              style={{ width: `${progress}%` }}
              className="h-full bg-gradient-to-r from-sky-500 via-cyan-400 to-indigo-500 rounded-full shadow-lg shadow-sky-400/50"
              transition={{ ease: 'easeOut' }}
            />
          </div>

          <p className="text-[11px] text-slate-500 font-medium">
            {siteConfig?.logo?.brandName || 'NETRONOMIC'} Digital Agency CMS Platform
          </p>
        </div>
      </div>
    </motion.div>
  );
};
