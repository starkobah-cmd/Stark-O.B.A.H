import React, { useState, useEffect } from 'react';
import { Sparkles, Phone, MessageSquare, Menu, X, ArrowUpRight, BookOpen, Lock } from 'lucide-react';
import { BlogViewMode } from '../types';
import { Logo } from './Logo';
import { SiteConfig } from '../data/siteConfig';

interface NavbarProps {
  onOpenQuote: (serviceTitle?: string) => void;
  currentView?: BlogViewMode;
  onNavigate?: (view: BlogViewMode) => void;
  siteConfig?: SiteConfig;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenQuote, currentView = 'main', onNavigate, siteConfig }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const agencyData = siteConfig?.agency || {
    whatsappNumber: '923020487103'
  };
  const whatsappNum = agencyData.whatsappNumber || '923020487103';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About Us', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Process', href: '#process' },
    { label: 'Portfolio', href: '#portfolio' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'Contact', href: '#contact' },
  ];

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (currentView !== 'main' && onNavigate) {
      onNavigate('main');
    }
    setTimeout(() => {
      const el = document.querySelector('#home');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, currentView !== 'main' ? 100 : 0);
  };

  const handleBlogClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate('blog-list');
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-xl shadow-lg shadow-sky-950/5 border-b border-sky-100 py-2 sm:py-2.5'
          : 'bg-white/85 backdrop-blur-md py-3 sm:py-3.5 border-b border-sky-100/70'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center ${
          siteConfig?.logo?.headerLogoAlign === 'center' ? 'justify-center flex-col sm:flex-row' : 
          siteConfig?.logo?.headerLogoAlign === 'right' ? 'justify-end flex-row-reverse' : 
          'justify-between'
        } gap-4`}>
          {/* Logo Brand - Perfectly Aligned */}
          <div
            onClick={handleHomeClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleHomeClick(e as any); } }}
            className="flex items-center shrink-0 focus:outline-none rounded-xl transition-opacity hover:opacity-95 cursor-pointer"
            aria-label="Homepage"
          >
            <Logo variant="light" size="md" showTagline={true} config={siteConfig?.logo} />
          </div>

          {/* Desktop Nav Links - Centered Floating Pill */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1.5 bg-slate-50/90 p-1.5 rounded-2xl border border-sky-100/80 shadow-2xs">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  if (currentView !== 'main' && onNavigate) {
                    onNavigate('main');
                    setTimeout(() => {
                      const el = document.querySelector(link.href);
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }, 150);
                  } else {
                    const el = document.querySelector(link.href);
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="text-[13px] font-semibold text-slate-700 hover:text-sky-600 px-3 py-1.5 rounded-xl hover:bg-white hover:shadow-xs transition-all duration-200 whitespace-nowrap"
              >
                {link.label}
              </a>
            ))}

            {/* Dedicated Blog Link */}
            <button
              onClick={handleBlogClick}
              className={`text-[13px] font-bold flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                currentView === 'blog-list' || currentView === 'single-blog'
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25'
                  : 'text-sky-700 bg-sky-100/80 hover:bg-sky-500 hover:text-white border border-sky-200/80'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Blog</span>
            </button>
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-2.5 shrink-0">
            <a
              href="https://wa.me/923020487103"
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-shine-btn inline-flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer group"
              title="Message Netronomic Web on WhatsApp"
              aria-label="Message Netronomic Web on WhatsApp"
            >
              <span className="w-2 h-2 rounded-full bg-white animate-ping group-hover:animate-none" />
              <MessageSquare className="w-3.5 h-3.5 text-white" />
              <span>WhatsApp</span>
            </a>


          </div>

          {/* Mobile menu toggle */}
          <div className="flex lg:hidden items-center gap-2 shrink-0">


            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-sky-50 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-sky-600" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-sky-100 shadow-xl px-4 pt-3 pb-6 mt-2 space-y-3">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-100">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  setMobileMenuOpen(false);
                  if (currentView !== 'main' && onNavigate) {
                    onNavigate('main');
                    setTimeout(() => {
                      const el = document.querySelector(link.href);
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }, 150);
                  } else {
                    const el = document.querySelector(link.href);
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="text-sm font-medium text-slate-700 hover:text-sky-600 p-2 rounded-md hover:bg-sky-50 transition-colors whitespace-nowrap"
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={(e) => {
                setMobileMenuOpen(false);
                handleBlogClick(e);
              }}
              className="text-sm font-bold text-sky-600 bg-sky-50 p-2 rounded-md flex items-center gap-2 col-span-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>Blog & Insights</span>
            </button>
          </div>
          <div className="flex flex-col gap-2 pt-2">
            <a
              href="https://wa.me/923020487103"
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-shine-btn w-full flex items-center justify-center gap-2 text-sm font-bold py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 text-white shadow-md transition-all cursor-pointer"
              title="Message Netronomic Web on WhatsApp"
              aria-label="Message Netronomic Web on WhatsApp"
            >
              <MessageSquare className="w-4 h-4 text-white" />
              <span>Message Netronomic Web on WhatsApp</span>
            </a>
            


            {onNavigate && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate('site-admin');
                }}
                className="w-full text-center text-xs font-medium py-2 rounded-lg text-slate-500 hover:text-sky-600 hover:bg-slate-50 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Lock className="w-3.5 h-3.5 text-sky-500" />
                <span>Admin CMS Portal</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

