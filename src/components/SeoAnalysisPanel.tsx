import React, { useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle2,
  XCircle,
  Sparkles,
  Search,
  Globe,
  FileText,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Link2,
  BarChart3,
  Lightbulb,
  ExternalLink,
  ShieldCheck,
  Code
} from 'lucide-react';
import { analyzeSeo, SeoCheckItem } from '../utils/seoAnalyzer';

interface SeoAnalysisPanelProps {
  focusKeyword: string;
  onFocusKeywordChange: (val: string) => void;
  seoTitle: string;
  onSeoTitleChange: (val: string) => void;
  metaDescription: string;
  onMetaDescriptionChange: (val: string) => void;
  slug: string;
  onSlugChange: (val: string) => void;
  ogImage?: string;
  onOgImageChange?: (val: string) => void;
  customSchema?: string;
  onCustomSchemaChange?: (val: string) => void;
  content: string;
  entityType?: 'blog' | 'page';
  entityName?: string;
  onScoreUpdate?: (score: number) => void;
}

export const SeoAnalysisPanel: React.FC<SeoAnalysisPanelProps> = ({
  focusKeyword,
  onFocusKeywordChange,
  seoTitle,
  onSeoTitleChange,
  metaDescription,
  onMetaDescriptionChange,
  slug,
  onSlugChange,
  ogImage = '',
  onOgImageChange,
  customSchema: customSchemaProp = '',
  onCustomSchemaChange,
  content,
  entityType = 'blog',
  entityName,
  onScoreUpdate
}) => {
  const [activeCategory, setActiveCategory] = React.useState<'all' | 'basic' | 'title' | 'content'>('all');
  const [previewDevice, setPreviewDevice] = React.useState<'desktop' | 'mobile'>('desktop');
  const [showTips, setShowTips] = React.useState<boolean>(true);
  const [customSchema, setCustomSchema] = React.useState<string>(customSchemaProp);

  useEffect(() => {
    if (customSchemaProp !== undefined) {
      setCustomSchema(customSchemaProp);
    }
  }, [customSchemaProp]);

  // Run real-time RankMath-style SEO analysis
  const analysis = useMemo(() => {
    return analyzeSeo({
      focusKeyword,
      seoTitle,
      metaDescription,
      slug,
      content,
      ogImage
    });
  }, [focusKeyword, seoTitle, metaDescription, slug, content, ogImage]);

  // Sync score back to parent
  useEffect(() => {
    if (onScoreUpdate) {
      onScoreUpdate(analysis.score);
    }
  }, [analysis.score, onScoreUpdate]);

  // Circular gauge calculations
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (analysis.score / 100) * circumference;

  // Filter checklist items
  const filteredChecks = useMemo(() => {
    if (activeCategory === 'all') return analysis.checks;
    return analysis.checks.filter(c => c.category === activeCategory);
  }, [analysis.checks, activeCategory]);

  const basicChecks = analysis.checks.filter(c => c.category === 'basic');
  const titleChecks = analysis.checks.filter(c => c.category === 'title');
  const contentChecks = analysis.checks.filter(c => c.category === 'content');

  const basicPassed = basicChecks.filter(c => c.passed).length;
  const titlePassed = titleChecks.filter(c => c.passed).length;
  const contentPassed = contentChecks.filter(c => c.passed).length;

  return (
    <div className="space-y-6">
      {/* HEADER: REAL-TIME SCORE CIRCLE & LIVE AUDIT OVERVIEW */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950/40 border border-sky-900/40 shadow-xl relative overflow-hidden">
        {/* Glow ambient */}
        <div 
          className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: analysis.hexColor }}
        />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          {/* Left: Score Gauge Circle */}
          <div className="flex items-center gap-5">
            <div className="relative w-24 h-24 flex-shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                {/* Background track */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  className="stroke-slate-800"
                  strokeWidth="8"
                  fill="transparent"
                />
                {/* Animated colored progress bar */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  stroke={analysis.hexColor}
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-500 ease-out"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className={`text-2xl font-black tracking-tight ${analysis.colorClass}`}>
                  {analysis.score}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  / 100
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
                  NETRONOMIC SEO AUDIT
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide border ${
                    analysis.rating === 'good'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : analysis.rating === 'fair'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                  }`}
                >
                  {analysis.rating === 'good' ? 'Great SEO' : analysis.rating === 'fair' ? 'Fair SEO' : 'Needs Optimization'}
                </span>
              </div>

              <h3 className="text-lg font-extrabold text-white mt-0.5">
                {entityName ? `SEO Audit: ${entityName}` : 'On-Page Optimization Engine'}
              </h3>

              <p className="text-xs text-slate-300 mt-1">
                {analysis.passedCount} of {analysis.totalCount} tests passing. Updates in real-time as you write.
              </p>
            </div>
          </div>

          {/* Right: Quick SEO Metrics Pill Badges */}
          <div className="flex flex-wrap items-center gap-2 justify-center md:justify-end">
            <div className="px-3 py-2 rounded-xl bg-slate-950/70 border border-slate-800 text-center min-w-[90px]">
              <span className="block text-[10px] font-bold text-slate-400 uppercase">Words</span>
              <span className={`text-xs font-extrabold ${analysis.wordCount >= 600 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {analysis.wordCount}
              </span>
            </div>

            <div className="px-3 py-2 rounded-xl bg-slate-950/70 border border-slate-800 text-center min-w-[90px]">
              <span className="block text-[10px] font-bold text-slate-400 uppercase">Keyword %</span>
              <span className={`text-xs font-extrabold ${analysis.keywordDensity >= 1.0 && analysis.keywordDensity <= 2.5 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {analysis.keywordDensity}%
              </span>
            </div>

            <div className="px-3 py-2 rounded-xl bg-slate-950/70 border border-slate-800 text-center min-w-[90px]">
              <span className="block text-[10px] font-bold text-slate-400 uppercase">Power Word</span>
              <span className={`text-xs font-extrabold ${analysis.powerWordFound ? 'text-sky-400' : 'text-slate-500'}`}>
                {analysis.powerWordFound || 'None'}
              </span>
            </div>

            <div className="px-3 py-2 rounded-xl bg-slate-950/70 border border-slate-800 text-center min-w-[90px]">
              <span className="block text-[10px] font-bold text-slate-400 uppercase">CTR Number</span>
              <span className={`text-xs font-extrabold ${analysis.hasNumber ? 'text-emerald-400' : 'text-slate-500'}`}>
                {analysis.hasNumber ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* INPUT FIELDS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: SEO Meta Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-4 bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-sky-400" />
              <span>SEO Parameters & Meta Tags</span>
            </h4>
            <span className="text-[11px] font-mono text-sky-400/90">
              Synced with Firestore
            </span>
          </div>

          {/* Focus Keyword Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <span>Focus Keyword</span>
                <span className="text-[10px] text-rose-400">*</span>
              </label>
              <span className="text-[11px] text-slate-400">
                {focusKeyword ? `Found ${analysis.keywordCount}x in text` : 'Enter target search phrase'}
              </span>
            </div>
            <div className="relative">
              <input
                type="text"
                value={focusKeyword}
                onChange={(e) => onFocusKeywordChange(e.target.value)}
                placeholder="e.g. Web Agency, SEO Services, Best Video Editing"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-medium focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all placeholder:text-slate-600"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              The primary search term you want this {entityType === 'blog' ? 'article' : 'page'} to rank for on Google.
            </p>
          </div>

          {/* SEO Title Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-200">SEO Title</label>
              <span className={`text-[11px] font-mono font-bold ${
                seoTitle.length >= 50 && seoTitle.length <= 60
                  ? 'text-emerald-400'
                  : seoTitle.length > 60
                  ? 'text-rose-400'
                  : 'text-amber-400'
              }`}>
                {seoTitle.length} / 60 chars {seoTitle.length >= 50 && seoTitle.length <= 60 && '✓ Optimal'}
              </span>
            </div>
            <input
              type="text"
              value={seoTitle}
              onChange={(e) => onSeoTitleChange(e.target.value)}
              placeholder="e.g. 7 Proven Web Agency Strategies for Explosive Growth (2026)"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-medium focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all placeholder:text-slate-600"
            />
            {/* Live Progress Bar for Title Length */}
            <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden mt-1.5 border border-slate-800/60">
              <div
                className={`h-full transition-all duration-300 ${
                  seoTitle.length >= 50 && seoTitle.length <= 60
                    ? 'bg-emerald-500'
                    : seoTitle.length > 60
                    ? 'bg-rose-500'
                    : 'bg-amber-500'
                }`}
                style={{ width: `${Math.min(100, (seoTitle.length / 60) * 100)}%` }}
              />
            </div>
          </div>

          {/* Meta Description Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-200">Meta Description</label>
              <span className={`text-[11px] font-mono font-bold ${
                metaDescription.length >= 120 && metaDescription.length <= 160
                  ? 'text-emerald-400'
                  : metaDescription.length > 160
                  ? 'text-rose-400'
                  : 'text-amber-400'
              }`}>
                {metaDescription.length} / 160 chars {metaDescription.length >= 120 && metaDescription.length <= 160 && '✓ Optimal'}
              </span>
            </div>
            <textarea
              rows={3}
              value={metaDescription}
              onChange={(e) => onMetaDescriptionChange(e.target.value)}
              placeholder="A compelling, keyword-rich summary that searchers will see on Google search result pages..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-medium focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all placeholder:text-slate-600 leading-relaxed"
            />
            {/* Live Progress Bar for Description Length */}
            <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden mt-1.5 border border-slate-800/60">
              <div
                className={`h-full transition-all duration-300 ${
                  metaDescription.length >= 120 && metaDescription.length <= 160
                    ? 'bg-emerald-500'
                    : metaDescription.length > 160
                    ? 'bg-rose-500'
                    : 'bg-amber-500'
                }`}
                style={{ width: `${Math.min(100, (metaDescription.length / 160) * 100)}%` }}
              />
            </div>
          </div>

          {/* Slug & Open Graph Image (2 cols) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1.5 flex items-center gap-1">
                <Link2 className="w-3.5 h-3.5 text-sky-400" />
                <span>Custom URL / Slug</span>
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => onSlugChange(e.target.value)}
                placeholder="e.g. web-design-services"
                className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-sky-500 placeholder:text-slate-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1.5 flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5 text-sky-400" />
                <span>Open Graph Image URL</span>
              </label>
              <input
                type="text"
                value={ogImage}
                onChange={(e) => onOgImageChange && onOgImageChange(e.target.value)}
                placeholder="https://.../og-banner.jpg"
                className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-sky-500 placeholder:text-slate-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1.5 flex items-center gap-1">
              <Code className="w-3.5 h-3.5 text-sky-400" />
              <span>Custom Schema.org Code (JSON-LD)</span>
            </label>
            <textarea
              rows={4}
              value={customSchema}
              onChange={(e) => {
                setCustomSchema(e.target.value);
                if (onCustomSchemaChange) onCustomSchemaChange(e.target.value);
              }}
              placeholder='<script type="application/ld+json">&#10;{&#10;  "@context": "https://schema.org"&#10;}&#10;</script>'
              className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-sky-500 placeholder:text-slate-600"
            />
          </div>
        </div>

        {/* Right Col: Google SERP Snippet Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-sky-400" />
                <span>Google Search Snippet Preview</span>
              </h4>

              <div className="flex bg-slate-950 p-0.5 rounded-lg border border-slate-800">
                <button
                  type="button"
                  onClick={() => setPreviewDevice('desktop')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                    previewDevice === 'desktop' ? 'bg-sky-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Desktop
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice('mobile')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                    previewDevice === 'mobile' ? 'bg-sky-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Mobile
                </button>
              </div>
            </div>

            {/* Google SERP Card */}
            <div className="p-4 rounded-xl bg-white text-slate-900 border border-slate-200 shadow-sm space-y-2">
              {/* Google Brand Header */}
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-black text-sky-600 overflow-hidden">
                  <img src="/favicon.svg" alt="NW" className="w-4 h-4 object-contain" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
                  NW
                </div>
                <div className="text-[11px] leading-tight text-slate-600 truncate">
                  <span className="font-semibold text-slate-800">Netronomic Web</span>
                  <span className="mx-1 text-slate-400">›</span>
                  <span className="text-slate-500 font-mono">https://netronomicweb.com{slug.startsWith('/') ? slug : `/${slug || 'article'}`}</span>
                </div>
              </div>

              {/* Title Link */}
              <h5 className="text-[#1a0dab] hover:underline cursor-pointer text-sm sm:text-base font-medium leading-snug line-clamp-2">
                {seoTitle || 'Netronomic Web — High Converting Digital Agency'}
              </h5>

              {/* Description */}
              <p className="text-xs text-[#4d5156] leading-relaxed line-clamp-2">
                <span className="text-slate-400 text-[11px] mr-1">Sep 8, 2026 —</span>
                {metaDescription || 'We engineer high-converting websites, mobile apps, brand logos, and viral video reels with measurable ROI.'}
              </p>

              {/* Rich OG Image Thumbnail (if mobile view or preview) */}
              {ogImage && (
                <div className="pt-2 border-t border-slate-100 flex items-center gap-3">
                  <img
                    src={ogImage}
                    alt="OG Preview"
                    className="w-16 h-10 rounded object-cover border border-slate-200"
                    onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                  />
                  <span className="text-[11px] text-slate-500 font-mono truncate">
                    OG: {ogImage}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              Valid Schema.org Article tags
            </span>
            <button
              type="button"
              onClick={() => setShowTips(!showTips)}
              className="text-sky-400 hover:underline flex items-center gap-1"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>{showTips ? 'Hide Tips' : 'Show Tips'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* REAL-TIME DYNAMIC CHECKLIST TABS */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h4 className="text-base font-extrabold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-sky-400" />
              <span>Real-Time On-Page SEO Checklist</span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Core Google search & semantic ranking audit rules evaluated dynamically against Title, Description, Keyword, and Body content.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                activeCategory === 'all'
                  ? 'bg-sky-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({analysis.passedCount}/{analysis.totalCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory('basic')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                activeCategory === 'basic'
                  ? 'bg-sky-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Basic ({basicPassed}/{basicChecks.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory('title')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                activeCategory === 'title'
                  ? 'bg-sky-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Title ({titlePassed}/{titleChecks.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory('content')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                activeCategory === 'content'
                  ? 'bg-sky-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Content ({contentPassed}/{contentChecks.length})
            </button>
          </div>
        </div>

        {/* CHECKLIST ITEMS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredChecks.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-3.5 rounded-xl border transition-all ${
                item.passed
                  ? 'bg-slate-950/70 border-emerald-500/20 hover:border-emerald-500/40'
                  : 'bg-slate-950/70 border-rose-500/20 hover:border-rose-500/40'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex-shrink-0">
                  {item.passed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-400" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-white leading-snug">
                      {item.label}
                    </span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      item.passed ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'
                    }`}>
                      +{item.earned}/{item.points} pts
                    </span>
                  </div>

                  <p className={`text-xs mt-1 leading-relaxed ${item.passed ? 'text-slate-300' : 'text-slate-400'}`}>
                    {item.message}
                  </p>

                  {showTips && item.tip && !item.passed && (
                    <div className="mt-2 p-2 rounded-lg bg-sky-950/30 border border-sky-900/40 text-[11px] text-sky-200 flex items-start gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5 text-sky-400 flex-shrink-0 mt-0.5" />
                      <span>{item.tip}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
