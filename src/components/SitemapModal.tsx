import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Copy, Check, Download, Code2, Globe } from 'lucide-react';
import { generateSitemapXML } from '../data/blogData';
import { BlogPost } from '../types';

interface SitemapModalProps {
  isOpen: boolean;
  onClose: () => void;
  posts: BlogPost[];
}

export const SitemapModal: React.FC<SitemapModalProps> = ({ isOpen, onClose, posts }) => {
  const [copied, setCopied] = useState(false);
  const xmlContent = generateSitemapXML(posts);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(xmlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([xmlContent], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[#0B1120] border border-sky-500/30 rounded-3xl p-6 sm:p-8 max-w-3xl w-full text-white shadow-[0_0_50px_rgba(56,189,248,0.2)] max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <Code2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>XML Sitemap Generator</span>
                  <span className="text-[10px] bg-sky-500/20 text-sky-400 border border-sky-400/30 px-2 py-0.5 rounded-full font-bold uppercase">
                    SEO Ready
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Includes static pages & all {posts.filter(p => p.status === 'published').length} published blog post URLs for Google Indexing.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* XML Code Body */}
          <div className="my-4 flex-1 overflow-hidden flex flex-col">
            <div className="bg-[#050816] rounded-2xl p-4 border border-slate-800 font-mono text-xs text-sky-300/90 overflow-auto max-h-[50vh] leading-relaxed select-all">
              <pre>{xmlContent}</pre>
            </div>
          </div>

          {/* Actions Footer */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Globe className="w-4 h-4 text-sky-400" />
              <span>Valid Schema.org & Google Sitemap Protocol 0.9</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={handleCopy}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 border border-slate-700"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-sky-400" />}
                <span>{copied ? 'Copied XML!' : 'Copy XML'}</span>
              </button>

              <button
                onClick={handleDownload}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md shadow-sky-500/20"
              >
                <Download className="w-4 h-4" />
                <span>Download sitemap.xml</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
