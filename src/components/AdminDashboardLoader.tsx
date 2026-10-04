import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Logo } from './Logo';
import { SiteConfig } from '../data/siteConfig';
import { ShieldCheck, Sparkles, Lock, Cpu, CheckCircle2 } from 'lucide-react';

interface AdminDashboardLoaderProps {
  siteConfig?: SiteConfig;
  onFinish: () => void;
}

export const AdminDashboardLoader: React.FC<AdminDashboardLoaderProps> = ({
  siteConfig,
  onFinish,
}) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Verifying Security Credentials...');

  useEffect(() => {
    // Progress counter animation from 0% to 100% over ~2.4 seconds
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 3;
        if (next >= 100) {
          clearInterval(interval);
          return 100;
        }
        
        // Update status text dynamically as progress advances
        if (next > 75) {
          setStatusText('Dashboard Ready! Launching CMS Panel...');
        } else if (next > 50) {
          setStatusText('Syncing SEO Suite & Contact Inquiries...');
        } else if (next > 25) {
          setStatusText('Loading Modular Page Sections & Media Library...');
        } else {
          setStatusText('Verifying Admin Token & Decrypting Session...');
        }

        return next;
      });
    }, 60);

    const timer = setTimeout(() => {
      onFinish();
    }, 2500);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [onFinish]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.03 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      className="fixed inset-0 z-[99999] bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-100 font-sans selection:bg-sky-500 overflow-hidden"
    >
      {/* Radiant Background Aura */}
      <motion.div
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.35, 0.65, 0.35],
        }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-sky-500/25 via-cyan-500/20 to-indigo-600/25 rounded-full blur-[120px] pointer-events-none"
      />

      <div className="relative z-10 flex flex-col items-center text-center space-y-8 max-w-md w-full">
        {/* Animated Brand Logo in Center */}
        <div className="relative flex items-center justify-center">
          {/* Outer Dashed Orbit Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            className="absolute -inset-8 rounded-full border border-dashed border-sky-400/40 p-2"
          />

          {/* Inner Glowing Orbit Ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            className="absolute -inset-4 rounded-full border border-sky-500/20"
          />

          {/* Main Logo Container */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: [0.95, 1.05, 0.95], opacity: 1 }}
            transition={{
              scale: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
              opacity: { duration: 0.5 },
            }}
            className="relative bg-slate-900/90 border border-sky-500/30 p-7 rounded-3xl shadow-2xl shadow-sky-500/30 backdrop-blur-2xl flex items-center justify-center"
          >
            <Logo size="lg" variant="dark" config={siteConfig?.logo} />
          </motion.div>

          {/* Sparkles & Shield Badges */}
          <motion.div
            animate={{ scale: [1, 1.25, 1], rotate: [0, 15, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-3 -right-3 p-2 rounded-full bg-sky-500/20 border border-sky-400/50 text-sky-300 backdrop-blur-md shadow-lg shadow-sky-500/30"
          >
            <Sparkles className="w-5 h-5" />
          </motion.div>

          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -bottom-2 -left-2 p-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-400 backdrop-blur-md shadow-lg"
          >
            <ShieldCheck className="w-4 h-4" />
          </motion.div>
        </div>

        {/* Status Header & Animated Progress */}
        <div className="space-y-4 w-full">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-300 text-[11px] font-black uppercase tracking-widest shadow-sm">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping inline-block" />
              Authenticated Session
            </span>
            <h2 className="text-xl font-black text-white tracking-tight mt-2.5">
              Opening {siteConfig?.logo?.brandName || 'NETRONOMIC'} Admin Panel
            </h2>
          </div>

          {/* Progress Bar & Percentage */}
          <div className="space-y-2 bg-slate-900/80 border border-slate-800/80 p-4 rounded-2xl backdrop-blur-md shadow-xl">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-300 text-[11px] flex items-center gap-1.5 font-medium truncate max-w-[260px]">
                {progress === 100 ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <Cpu className="w-3.5 h-3.5 text-sky-400 shrink-0 animate-spin" />
                )}
                <span>{statusText}</span>
              </span>
              <span className="text-sky-400 font-mono font-black text-sm">{progress}%</span>
            </div>

            {/* Glowing Linear Progress Bar */}
            <div className="w-full h-2.5 bg-slate-950 rounded-full p-0.5 border border-slate-800 overflow-hidden shadow-inner">
              <motion.div
                style={{ width: `${progress}%` }}
                className="h-full bg-gradient-to-r from-sky-500 via-cyan-400 to-indigo-500 rounded-full shadow-lg shadow-sky-400/50"
                transition={{ ease: 'easeOut' }}
              />
            </div>
          </div>

          <p className="text-[11px] text-slate-500 font-semibold tracking-wide">
            Encrypted SHA-256 Auth • Realtime Site CMS Engine
          </p>
        </div>
      </div>
    </motion.div>
  );
};
