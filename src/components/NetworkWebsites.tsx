import React from 'react';
import {
  Globe,
  ExternalLink,
  Zap,
  Cloud,
  Sparkles,
  Rocket,
  Shield,
  Layers,
  Laptop,
  Smartphone,
  Palette,
  ShoppingBag,
  ArrowUpRight
} from 'lucide-react';
import { NetworkWebsitesSectionConfig, NetworkWebsiteButton } from '../data/siteConfig';

interface NetworkWebsitesProps {
  config?: NetworkWebsitesSectionConfig;
}

const ICON_MAP: Record<string, React.ElementType> = {
  globe: Globe,
  external: ExternalLink,
  zap: Zap,
  cloud: Cloud,
  sparkles: Sparkles,
  rocket: Rocket,
  shield: Shield,
  layers: Layers,
  laptop: Laptop,
  mobile: Smartphone,
  design: Palette,
  shop: ShoppingBag,
};

const COLOR_CLASSES: Record<string, { border: string; bg: string; text: string; glow: string; badge: string }> = {
  sky: {
    border: 'border-sky-500/30 hover:border-sky-400',
    bg: 'bg-sky-500/10 group-hover:bg-sky-500/20',
    text: 'text-sky-400 group-hover:text-sky-300',
    glow: 'group-hover:shadow-sky-500/20',
    badge: 'bg-sky-500/20 text-sky-300 border-sky-500/30'
  },
  emerald: {
    border: 'border-emerald-500/30 hover:border-emerald-400',
    bg: 'bg-emerald-500/10 group-hover:bg-emerald-500/20',
    text: 'text-emerald-400 group-hover:text-emerald-300',
    glow: 'group-hover:shadow-emerald-500/20',
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
  },
  purple: {
    border: 'border-purple-500/30 hover:border-purple-400',
    bg: 'bg-purple-500/10 group-hover:bg-purple-500/20',
    text: 'text-purple-400 group-hover:text-purple-300',
    glow: 'group-hover:shadow-purple-500/20',
    badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30'
  },
  amber: {
    border: 'border-amber-500/30 hover:border-amber-400',
    bg: 'bg-amber-500/10 group-hover:bg-amber-500/20',
    text: 'text-amber-400 group-hover:text-amber-300',
    glow: 'group-hover:shadow-amber-500/20',
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
  },
  rose: {
    border: 'border-rose-500/30 hover:border-rose-400',
    bg: 'bg-rose-500/10 group-hover:bg-rose-500/20',
    text: 'text-rose-400 group-hover:text-rose-300',
    glow: 'group-hover:shadow-rose-500/20',
    badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30'
  },
  indigo: {
    border: 'border-indigo-500/30 hover:border-indigo-400',
    bg: 'bg-indigo-500/10 group-hover:bg-indigo-500/20',
    text: 'text-indigo-400 group-hover:text-indigo-300',
    glow: 'group-hover:shadow-indigo-500/20',
    badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
  },
  cyan: {
    border: 'border-cyan-500/30 hover:border-cyan-400',
    bg: 'bg-cyan-500/10 group-hover:bg-cyan-500/20',
    text: 'text-cyan-400 group-hover:text-cyan-300',
    glow: 'group-hover:shadow-cyan-500/20',
    badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
  }
};

export const NetworkWebsites: React.FC<NetworkWebsitesProps> = ({ config }) => {
  // Respect backend hide/show toggle
  if (!config || config.enabled === false) {
    return null;
  }

  const buttons = config.buttons || [];
  if (buttons.length === 0) {
    return null;
  }

  const title = config.title || 'Our Other Websites & Digital Portals';
  const subtitle = config.subtitle || 'Explore our network of platforms, web tools, and partner websites.';
  const badge = config.badge || 'Network Portals';

  return (
    <section
      id="network-portals"
      className="py-16 md:py-20 bg-slate-950 border-t border-slate-800/80 relative overflow-hidden"
    >
      {/* Background Subtle Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-64 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12 space-y-3">
          {badge && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-bold uppercase tracking-wider">
              <Globe className="w-3.5 h-3.5" />
              <span>{badge}</span>
            </div>
          )}

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {title}
          </h2>

          {subtitle && (
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {/* Buttons / Portal Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {buttons.map((btn) => {
            const IconComponent = (btn.icon && ICON_MAP[btn.icon.toLowerCase()]) || Globe;
            const colorTheme = (btn.color && COLOR_CLASSES[btn.color.toLowerCase()]) || COLOR_CLASSES.sky;

            return (
              <a
                key={btn.id}
                href={btn.url || '#'}
                target={btn.openInNewTab !== false ? '_blank' : '_self'}
                rel="noopener noreferrer"
                className={`group relative p-5 sm:p-6 rounded-2xl bg-slate-900/90 border ${colorTheme.border} transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${colorTheme.glow} flex flex-col justify-between overflow-hidden cursor-pointer backdrop-blur-sm`}
              >
                {/* Header row: Icon & Badge */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-11 h-11 rounded-xl ${colorTheme.bg} flex items-center justify-center transition-colors`}
                    >
                      <IconComponent className={`w-5 h-5 ${colorTheme.text} transition-colors`} />
                    </div>

                    <div className="flex items-center gap-2">
                      {btn.badge && (
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${colorTheme.badge}`}
                        >
                          {btn.badge}
                        </span>
                      )}
                      <ArrowUpRight
                        className={`w-4 h-4 text-slate-500 group-hover:${colorTheme.text} transition-all transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5`}
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-white transition-colors flex items-center gap-1.5">
                      <span>{btn.title}</span>
                    </h3>
                    {btn.description && (
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                        {btn.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer link URL teaser */}
                <div className="pt-4 mt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500 group-hover:text-slate-400 transition-colors">
                  <span className="truncate max-w-[200px]">
                    {btn.url.replace(/^https?:\/\//i, '').replace(/\/$/, '')}
                  </span>
                  <span className={`font-sans font-bold text-xs ${colorTheme.text} flex items-center gap-1`}>
                    <span>Visit Site</span>
                    <span>→</span>
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};
