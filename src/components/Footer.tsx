import React from 'react';
import {  Sparkles, Heart, MessageSquare, ArrowUpRight, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Linkedin, Youtube, Github , Music2, Pin } from 'lucide-react';
import { agencyInfo, servicesData } from '../data/agencyData';
import { Logo } from './Logo';
import { SiteConfig } from '../data/siteConfig';
import { BlogViewMode } from '../types';

interface FooterProps {
  onOpenQuote: (serviceTitle?: string) => void;
  onNavigate?: (view: BlogViewMode) => void;
  siteConfig?: SiteConfig;
}

export const Footer: React.FC<FooterProps> = ({ onOpenQuote, onNavigate, siteConfig }) => {
  const activeAgency = siteConfig?.agency || agencyInfo;
  
  const renderSocialIcon = (network: string, url: string | undefined) => {
    if (!url) return null;
    let Icon;
    switch(network) {
      case 'facebook': Icon = Facebook; break;
      case 'instagram': Icon = Instagram; break;
      case 'twitter': Icon = Twitter; break;
      case 'linkedin': Icon = Linkedin; break;
      case 'youtube': Icon = Youtube; break;
      case 'github': Icon = Github; break;
      case 'tiktok': Icon = Music2; break;
      case 'pinterest': Icon = Pin; break;
      default: return null;
    }
    return (
      <a
        key={network}
        href={url}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-sky-500 hover:text-white transition-colors"
        title={network}
      >
        <Icon className="w-4 h-4" />
      </a>
    );
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Col 1: Brand Info */}
          <div className={`lg:col-span-2 space-y-4 ${
            siteConfig?.logo?.footerLogoAlign === 'center' ? 'flex flex-col items-center text-center' :
            siteConfig?.logo?.footerLogoAlign === 'right' ? 'flex flex-col items-end text-right' :
            'flex flex-col items-start text-left'
          }`}>
            <Logo 
              variant="dark" 
              size="md" 
              showTagline={true} 
              config={{
                ...siteConfig?.logo,
                customLogoUrl: siteConfig?.logo?.footerLogoUrl || '',
                iconVariant: siteConfig?.logo?.footerIconVariant || (siteConfig?.logo?.footerLogoUrl ? 'custom-image' : 'network-orb'),
              }} 
            />
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              Full-service digital agency providing high-impact Website Design, Mobile Apps, Logo & Poster Design, Reel Video Editing, SEO, Profile & Social Backlinks.
            </p>
            <div className="flex flex-col gap-4 pt-2">
              <a
                href="https://wa.me/923020487103"
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-shine-btn inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 text-white border border-emerald-400/40 shadow-lg shadow-emerald-500/25 text-xs font-semibold hover:shadow-emerald-500/40 transition-all w-fit cursor-pointer group"
                title="Message Netronomic on WhatsApp"
                aria-label="Message Netronomic on WhatsApp"
              >
                <span className="w-2 h-2 rounded-full bg-white animate-ping group-hover:animate-none shrink-0" />
                <MessageSquare className="w-4 h-4 text-white shrink-0" />
                <span className="font-bold text-sm">Message Netronomic on WhatsApp</span>
              </a>
              
              {/* Social Links */}
              {activeAgency.social && !(activeAgency.social as any).hideAll && (
                <div className="flex items-center gap-2 flex-wrap">
                  {!(activeAgency.social as any).facebook_hidden && renderSocialIcon('facebook', activeAgency.social.facebook)}
                  {!(activeAgency.social as any).instagram_hidden && renderSocialIcon('instagram', activeAgency.social.instagram)}
                  {!(activeAgency.social as any).twitter_hidden && renderSocialIcon('twitter', activeAgency.social.twitter)}
                  {!(activeAgency.social as any).linkedin_hidden && renderSocialIcon('linkedin', activeAgency.social.linkedin)}
                  {!(activeAgency.social as any).youtube_hidden && renderSocialIcon('youtube', activeAgency.social.youtube)}
                  {!(activeAgency.social as any).github_hidden && renderSocialIcon('github', activeAgency.social.github)}
                  {renderSocialIcon('tiktok', (activeAgency.social as any).tiktok)}
                  {renderSocialIcon('pinterest', (activeAgency.social as any).pinterest)}
                </div>
              )}
            </div>
          </div>

          {/* Col 2: Services List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Our Core Services</h4>
            <ul className="space-y-2 text-xs">
              {servicesData.map((s) => (
                <li key={s.id}>
                  <button
                    onClick={() => onOpenQuote(s.title)}
                    className="hover:text-sky-400 transition-colors text-left cursor-pointer"
                  >
                    {s.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Quick Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Quick Links</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => onNavigate && onNavigate('blog-list')} className="text-sky-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"><span>★ Blog & Articles</span></button></li>
              <li><a href="#services" className="hover:text-sky-400 transition-colors">Our Services</a></li>
              <li><a href="#about" className="hover:text-sky-400 transition-colors">About Us</a></li>
              <li><a href="#contact" className="hover:text-sky-400 transition-colors">Contact Us</a></li>
              <li><a href="#privacy" className="hover:text-sky-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#terms" className="hover:text-sky-400 transition-colors">Terms of Service</a></li>
              <li><a href="#why-us" className="hover:text-sky-400 transition-colors">Why Choose Us</a></li>
              <li><a href="#process" className="hover:text-sky-400 transition-colors">Our 6-Step Process</a></li>
              <li><a href="#portfolio" className="hover:text-sky-400 transition-colors">Portfolio Showcase</a></li>
              <li><a href="#pricing" className="hover:text-sky-400 transition-colors">Pricing Packages</a></li>
              <li><a href="#testimonials" className="hover:text-sky-400 transition-colors">Testimonials</a></li>
              <li><a href="#faq" className="hover:text-sky-400 transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Col 4: Direct Contact Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Contact Info</h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <span>{activeAgency.email}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-sky-400 shrink-0" />
                <span>{activeAgency.phone}</span>
              </p>
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span>{activeAgency.address}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Netronomic. All rights reserved.</p>
          <div className="flex items-center gap-4 flex-wrap">
            <a href="#about" className="hover:text-sky-400 transition-colors">About Us</a>
            <a href="#contact" className="hover:text-sky-400 transition-colors">Contact Us</a>
            <a href="#privacy" className="hover:text-sky-400 transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-sky-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
