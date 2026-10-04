import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Send,
  MessageSquare,
  Mail,
  Phone,
  MapPin,
  Clock,
  CheckCircle2,
  Sparkles,
  Calculator,
  Share2,
  User,
  Lock,
Music2, Pin } from 'lucide-react';
import { Facebook, Instagram, Twitter, Linkedin, Youtube, Github } from 'lucide-react';
import { agencyInfo, servicesData } from '../data/agencyData';
import { SiteConfig } from '../data/siteConfig';

interface ContactUsProps {
  preselectedService?: string;
  siteConfig?: SiteConfig;
  onAddInquiry?: (inquiry: { name: string; email: string; phone: string; service: string; budget: string; message: string }) => void;
}

export const ContactUs: React.FC<ContactUsProps> = ({ preselectedService, siteConfig, onAddInquiry }) => {
  const activeAgency = siteConfig?.agency || agencyInfo;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: preselectedService || 'Website Design & Development',
    budget: '$500 - $1,000',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estimator State
  const [selectedEstimatorServices, setSelectedEstimatorServices] = useState<string[]>(['Website Design & Development']);
  const [estimatedTurnaround, setEstimatedTurnaround] = useState('5-7 Days');

  const handleServiceToggle = (serviceTitle: string) => {
    let updated = [...selectedEstimatorServices];
    if (updated.includes(serviceTitle)) {
      if (updated.length > 1) updated = updated.filter((s) => s !== serviceTitle);
    } else {
      updated.push(serviceTitle);
    }
    setSelectedEstimatorServices(updated);
  };

  const calculateEstimate = () => {
    let total = 0;
    selectedEstimatorServices.forEach((st) => {
      const match = servicesData.find((s) => s.title === st);
      if (match) {
        const num = parseInt(match.startingPrice.replace('$', ''), 10) || 100;
        total += num;
      }
    });
    return total;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (onAddInquiry) {
      onAddInquiry({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        service: formData.service,
        budget: formData.budget,
        message: formData.message,
      });
    }
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 800);
  };

  const constructWhatsAppLink = () => {
    return 'https://wa.me/923020487103';
  };

  return (
    <section id="contact" className="py-20 bg-white relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-sky-100/30 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-bold uppercase tracking-wider">
            <span>Contact Us</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Let's Build Something <span className="text-sky-600">Extraordinary Together</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Reach out via our interactive inquiry form, chat directly on WhatsApp, or email us. We respond within 2 hours!
          </p>
        </div>

        {/* 2-Column Main Layout: Contact Details & Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16">
          
          {/* Left Column: Contact Cards, WhatsApp, Email, Social Media */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Direct WhatsApp Callout Card */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-6 text-white shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-0.5 rounded-full">
                  Fastest Response
                </span>
                <MessageSquare className="w-6 h-6 text-emerald-100" />
              </div>

              <h3 className="text-2xl font-bold">Chat Live on WhatsApp</h3>
              <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
                Connect directly with our senior agency lead for instant quotes, portfolio samples, and project scoping.
              </p>

              <a
                href={constructWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-shine-btn inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-white text-emerald-800 font-bold text-sm hover:bg-emerald-50 transition-all shadow-md cursor-pointer"
                title="Message Netronomic Web on WhatsApp"
                aria-label="Message Netronomic Web on WhatsApp"
              >
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>Message Netronomic Web on WhatsApp</span>
              </a>
            </div>

            {/* Contact Details List */}
            <div className="bg-sky-50/50 rounded-3xl p-6 border border-sky-100 space-y-5">
              <h4 className="text-base font-bold text-slate-900">Contact Channels</h4>

              <div className="space-y-4">
                {/* Developer */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-sky-200 text-sky-600 flex items-center justify-center shadow-xs shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">Developer</span>
                    <span className="text-sm font-bold text-slate-800">Daim Ali</span>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-sky-200 text-sky-600 flex items-center justify-center shadow-xs shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">Email Us</span>
                    <a href={`mailto:${activeAgency.email}`} className="text-sm font-bold text-slate-800 hover:text-sky-600 transition-colors">
                      {activeAgency.email}
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-sky-200 text-sky-600 flex items-center justify-center shadow-xs shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">Call Directly</span>
                    <a href={`tel:${activeAgency.phone}`} className="text-sm font-bold text-slate-800 hover:text-sky-600 transition-colors">
                      {activeAgency.phone}
                    </a>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-sky-200 text-sky-600 flex items-center justify-center shadow-xs shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    
                    <span className="text-xs font-semibold text-slate-700 block">
                      {activeAgency.address}
                    </span>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-sky-200 text-sky-600 flex items-center justify-center shadow-xs shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">Business Hours</span>
                    <span className="text-xs font-semibold text-slate-700 block">
                      {activeAgency.hours}
                    </span>
                  </div>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="pt-4 border-t border-sky-200/60">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-3">
                  Connect on Social Media
                </span>
                {activeAgency.social && !(activeAgency.social as any).hideAll && (
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    { network: 'facebook', label: 'Facebook', href: activeAgency.social.facebook, hidden: (activeAgency.social as any).facebook_hidden, Icon: Facebook },
                    { network: 'instagram', label: 'Instagram', href: activeAgency.social.instagram, hidden: (activeAgency.social as any).instagram_hidden, Icon: Instagram },
                    { network: 'twitter', label: 'Twitter', href: activeAgency.social.twitter, hidden: (activeAgency.social as any).twitter_hidden, Icon: Twitter },
                    { network: 'linkedin', label: 'LinkedIn', href: activeAgency.social.linkedin, hidden: (activeAgency.social as any).linkedin_hidden, Icon: Linkedin },
                    { network: 'youtube', label: 'YouTube', href: activeAgency.social.youtube, hidden: (activeAgency.social as any).youtube_hidden, Icon: Youtube },
                    { network: 'github', label: 'GitHub', href: activeAgency.social.github, hidden: (activeAgency.social as any).github_hidden, Icon: Github },
                    { network: 'tiktok', label: 'TikTok', href: (activeAgency.social as any).tiktok, hidden: (activeAgency.social as any).tiktok_hidden, Icon: Music2 },
                    { network: 'pinterest', label: 'Pinterest', href: (activeAgency.social as any).pinterest, hidden: (activeAgency.social as any).pinterest_hidden, Icon: Pin },
                  ].filter(soc => soc.href && !soc.hidden).map((soc) => (
                    <a
                      key={soc.network}
                      href={soc.href}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="px-3 py-1.5 rounded-lg bg-white border border-sky-200 text-xs font-bold text-slate-600 hover:text-sky-600 hover:border-sky-400 hover:bg-sky-50 flex items-center gap-1.5 transition-all shadow-sm"
                    >
                      <soc.Icon className="w-3.5 h-3.5" />
                      {soc.label}
                    </a>
                  ))}
                </div>
              )}
              </div>

            </div>

          </div>

          {/* Right Column: Interactive Contact Form */}
          <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-sky-100 shadow-xl">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 space-y-4"
              >
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Inquiry Received Successfully!</h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  Thank you, <strong className="text-slate-900">{formData.name}</strong>. Our senior strategy consultant will review your inquiry for <strong className="text-sky-600">{formData.service}</strong> and contact you within 2 business hours.
                </p>

                <div className="pt-4 flex justify-center gap-3">
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-5 py-2.5 rounded-xl bg-sky-50 text-sky-700 font-bold text-xs"
                  >
                    Send Another Message
                  </button>
                  <a
                    href={constructWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="whatsapp-shine-btn px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                    title="Message Netronomic Web on WhatsApp"
                    aria-label="Message Netronomic Web on WhatsApp"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Message Netronomic Web on WhatsApp</span>
                  </a>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-xl font-bold text-slate-900">Send Us a Direct Message</h3>
                  <span className="text-xs text-sky-600 font-semibold">* All fields confidential</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Alex Morgan"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:bg-white transition-all"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="alex@company.com"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Phone / WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+92 300 1234567"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:bg-white transition-all"
                    />
                  </div>

                  {/* Service dropdown */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Service Required *
                    </label>
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:bg-white transition-all font-medium truncate pr-8"
                    >
                      {servicesData.map((s) => (
                        <option key={s.id} value={s.title}>
                          {s.title} ({s.startingPrice})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Budget */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Estimated Project Budget
                  </label>
                  <select
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:bg-white transition-all font-medium"
                  >
                    <option value="< $300">Under $300 (Micro Task)</option>
                    <option value="$300 - $500">$300 - $500 (Basic Package)</option>
                    <option value="$500 - $1,000">$500 - $1,000 (Standard Growth)</option>
                    <option value="$1,000 - $3,000">$1,000 - $3,000 (Full Web Suite)</option>
                    <option value="$3,000+">$3,000+ (Enterprise Retainer)</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Project Requirements / Notes
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your project goals, deadlines, or existing website links..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:bg-white transition-all"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white font-bold text-base shadow-lg shadow-sky-500/30 hover:from-sky-600 hover:to-sky-700 hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Sending Inquiry...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Project Inquiry</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Interactive Quick Package Estimator Box (Removed per user request) */}


      </div>
    </section>
  );
};
