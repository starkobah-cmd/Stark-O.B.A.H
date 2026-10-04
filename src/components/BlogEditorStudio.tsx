import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Globe,
  Search,
  Save,
  Send,
  Tag,
  Table as TableIcon,
  X,
  Clock,
  Eye,
  Copy,
  Check
} from 'lucide-react';
import { BlogPost, PostStatus } from '../types';
import GutenbergEditor from './GutenbergEditor';
import ResponsiveTableBuilder from './ResponsiveTableBuilder';
import { MediaPickerModal } from './MediaPickerModal';
import { generateBlogSchemaJson } from '../schemaHelper';

interface BlogEditorStudioProps {
  post: Partial<BlogPost>;
  onSave: (post: Partial<BlogPost>, shouldPublish?: boolean) => void;
  onClose: () => void;
  categories: string[];
}

export const BlogEditorStudio: React.FC<BlogEditorStudioProps> = ({
  post: initialPost,
  onSave,
  onClose,
  categories
}) => {
  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: initialPost.title || '',
    slug: initialPost.slug || '',
    category: initialPost.category || (categories && categories[0]) || 'Web Development',
    status: initialPost.status || 'draft',
    excerpt: initialPost.excerpt || '',
    content: initialPost.content || '',
    featuredImage: initialPost.featuredImage || '',
    featuredImageAlt: initialPost.featuredImageAlt || '',
    author: initialPost.author || {
      name: 'Netronomic Editorial Team',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      role: 'Technical Lead'
    },
    tags: initialPost.tags || ['Web Development', 'Technology'],
    publishedAt: initialPost.publishedAt || new Date().toISOString().split('T')[0],
    readingTime: initialPost.readingTime || '5 min read',
    seoTitle: initialPost.seoTitle || (initialPost.title ? `${initialPost.title} | Netronomic` : ''),
    metaDescription: initialPost.metaDescription || initialPost.excerpt || '',
    focusKeyword: initialPost.focusKeyword || '',
    canonicalUrl: initialPost.canonicalUrl || '',
    isFeatured: initialPost.isFeatured || false,
    seoScore: initialPost.seoScore || 85
  });

  const [activeTab, setActiveTab] = useState<'content' | 'seo' | 'settings'>('content');
  const [showMediaModal, setShowMediaModal] = useState<((url: string) => void) | null>(null);
  const [showTableBuilder, setShowTableBuilder] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [copiedSlug, setCopiedSlug] = useState(false);

  // Dynamic Word Count and Reading Time
  const stats = useMemo(() => {
    const text = ((formData.content || '') + ' ' + (formData.excerpt || '')).replace(/<[^>]+>/g, ' ').trim();
    const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
    const minutes = Math.max(1, Math.min(15, Math.ceil(words / 180)));
    return {
      wordCount: words,
      readingTime: `${minutes} min read`
    };
  }, [formData.content, formData.excerpt]);

  // Dynamic SEO Score calculation
  const seoScore = useMemo(() => {
    let score = 50;
    if (formData.title && formData.title.length >= 25 && formData.title.length <= 70) score += 15;
    if (formData.metaDescription && formData.metaDescription.length >= 100 && formData.metaDescription.length <= 160) score += 15;
    if (formData.featuredImage) score += 10;
    if (stats.wordCount > 300) score += 10;
    return Math.min(100, score);
  }, [formData.title, formData.metaDescription, formData.featuredImage, stats.wordCount]);

  const handleTitleChange = (val: string) => {
    setFormData((prev) => {
      const autoSlug = !initialPost.id || !prev.slug
        ? val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
        : prev.slug;
      const autoSeoTitle = !prev.seoTitle || prev.seoTitle === `${prev.title} | Netronomic`
        ? `${val} | Netronomic`
        : prev.seoTitle;
      return {
        ...prev,
        title: val,
        slug: autoSlug,
        seoTitle: autoSeoTitle
      };
    });
  };

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    const currentTags = formData.tags || [];
    if (!currentTags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...currentTags, tagInput.trim()]
      }));
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: (prev.tags || []).filter((t) => t !== tagToRemove)
    }));
  };

  const handleSave = (publish = false) => {
    if (!formData.title?.trim() || !formData.slug?.trim()) {
      alert('Please provide an article title and URL slug.');
      return;
    }

    const payload: Partial<BlogPost> = {
      ...formData,
      id: initialPost.id || `post-${Date.now()}`,
      status: publish ? 'published' : formData.status || 'draft',
      readingTime: stats.readingTime,
      seoScore,
      updatedAt: new Date().toISOString()
    };

    onSave(payload, publish);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col overflow-hidden">
      {/* Top Header */}
      <header className="h-16 bg-slate-900 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
            title="Exit Editor"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">Metazivo Gutenberg Article Studio</span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                formData.status === 'published' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}>
                {formData.status}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              {stats.wordCount} words • {stats.readingTime}
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="hidden md:flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('content')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              activeTab === 'content' ? 'bg-sky-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Content &amp; Blocks
          </button>
          <button
            onClick={() => setActiveTab('seo')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'seo' ? 'bg-sky-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>SEO &amp; SERP</span>
            <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
              seoScore >= 80 ? 'bg-emerald-500/30 text-emerald-300' : 'bg-amber-500/30 text-amber-300'
            }`}>
              {seoScore}%
            </span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              activeTab === 'settings' ? 'bg-sky-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Publish Settings
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSave(false)}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5 text-slate-400" />
            <span>Save Draft</span>
          </button>
          <button
            onClick={() => handleSave(true)}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 font-black text-xs shadow-lg shadow-sky-500/25 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Publish Article</span>
          </button>
        </div>
      </header>

      {/* Editor Content Area */}
      <div className="flex-grow overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-6">
        {/* TAB 1: CONTENT & GUTENBERG BLOCKS */}
        {activeTab === 'content' && (
          <div className="space-y-6">
            {/* Title & Slug */}
            <div className="space-y-3 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                  Article Title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Modern Web Architecture for Maximum Conversions"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-base sm:text-lg font-bold text-white placeholder-slate-600 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                    Canonical URL Slug <span className="text-rose-400">*</span>
                  </label>
                  <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs">
                    <span className="text-slate-500 font-mono">/blog/</span>
                    <input
                      type="text"
                      value={formData.slug || ''}
                      onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                      placeholder="modern-web-architecture"
                      className="w-full bg-transparent text-white font-mono focus:outline-none"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`/blog/${formData.slug}`);
                        setCopiedSlug(true);
                        setTimeout(() => setCopiedSlug(false), 2000);
                      }}
                      className="text-slate-400 hover:text-white p-1"
                      title="Copy URL"
                    >
                      {copiedSlug ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                    Primary Category
                  </label>
                  <select
                    value={formData.category || (categories && categories[0]) || 'Web Development'}
                    onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Featured Image & Excerpt */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <div className="space-y-2">
                <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  Featured Cover Image
                </label>
                <div className="aspect-video w-full rounded-xl bg-slate-950 border border-slate-800 overflow-hidden relative group">
                  {formData.featuredImage ? (
                    <img
                      src={formData.featuredImage}
                      alt={formData.title || 'Cover'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 text-xs">
                      <span>No image selected</span>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowMediaModal(() => (url: string) => setFormData((prev) => ({ ...prev, featuredImage: url })))}
                    className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs font-bold text-sky-400 cursor-pointer"
                  >
                    {formData.featuredImage ? 'Change Image' : 'Pick Image from Media'}
                  </button>
                </div>
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  Article Excerpt &amp; Search Teaser
                </label>
                <textarea
                  value={formData.excerpt || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value, metaDescription: prev.metaDescription || e.target.value }))}
                  rows={4}
                  placeholder="Provide a compelling 2-3 sentence overview that searchers and social media users will see..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-sky-500 leading-relaxed"
                />
              </div>
            </div>

            {/* Metazivo Gutenberg Editor Container */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Article Body (Visual Gutenberg Engine)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowTableBuilder(true)}
                  className="px-3 py-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <TableIcon className="w-3.5 h-3.5" />
                  <span>Responsive Table Builder</span>
                </button>
              </div>

              <GutenbergEditor
                value={formData.content || ''}
                onChange={(html) => setFormData((prev) => ({ ...prev, content: html }))}
                mediaAssets={[]}
                onOpenMediaSelector={(onSelect) => {
                  setShowMediaModal(() => (url: string) => onSelect(url));
                }}
              />
            </div>
          </div>
        )}

        {/* TAB 2: SEO & GOOGLE SERP PREVIEW */}
        {activeTab === 'seo' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-sky-400" />
                Google SERP Snippet Preview
              </h3>

              {/* SERP Mockup Card */}
              <div className="bg-white rounded-xl p-4 space-y-1.5 shadow-md">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <span className="font-medium text-slate-800">netronomic.com</span>
                  <span>› blog › {formData.slug || 'article'}</span>
                </div>
                <div className="text-lg font-medium text-blue-700 hover:underline cursor-pointer truncate">
                  {formData.seoTitle || formData.title || 'Article Title'}
                </div>
                <div className="text-xs text-slate-700 leading-relaxed line-clamp-2">
                  {formData.metaDescription || formData.excerpt || 'Read this in-depth guide compiled by the technical digital engineering team...'}
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-800">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[10px] font-mono uppercase text-slate-400">Meta Title (SEO Title)</label>
                    <span className={`text-[10px] font-mono ${
                      (formData.seoTitle?.length || 0) > 60 ? 'text-rose-400 font-bold' : 'text-slate-500'
                    }`}>
                      {formData.seoTitle?.length || 0} / 60 chars
                    </span>
                  </div>
                  <input
                    type="text"
                    value={formData.seoTitle || ''}
                    onChange={(e) => setFormData((prev) => ({ ...prev, seoTitle: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[10px] font-mono uppercase text-slate-400">Meta Description</label>
                    <span className={`text-[10px] font-mono ${
                      (formData.metaDescription?.length || 0) > 160 ? 'text-rose-400 font-bold' : 'text-slate-500'
                    }`}>
                      {formData.metaDescription?.length || 0} / 160 chars
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    value={formData.metaDescription || ''}
                    onChange={(e) => setFormData((prev) => ({ ...prev, metaDescription: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Primary Focus Keyword</label>
                  <input
                    type="text"
                    value={formData.focusKeyword || ''}
                    onChange={(e) => setFormData((prev) => ({ ...prev, focusKeyword: e.target.value }))}
                    placeholder="e.g. web development, SEO strategy"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PUBLISH SETTINGS */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Tag className="w-4 h-4 text-sky-400" />
                Tags &amp; Taxonomy
              </h3>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="Add a topic tag (press Enter)..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs cursor-pointer"
                >
                  Add Tag
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {(formData.tags || []).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-slate-200 text-xs font-mono"
                  >
                    #{tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="text-slate-400 hover:text-rose-400 cursor-pointer"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <h3 className="text-sm font-bold text-white">Featured Post Toggle</h3>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFeatured || false}
                  onChange={(e) => setFormData((prev) => ({ ...prev, isFeatured: e.target.checked }))}
                  className="w-4 h-4 rounded text-sky-500 focus:ring-sky-500 bg-slate-950 border-slate-800"
                />
                <span className="text-xs text-slate-300 font-medium">Highlight as Featured Post at the top of the blog directory</span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Responsive Table Builder Modal */}
      {showTableBuilder && (
        <ResponsiveTableBuilder
          isOpen={showTableBuilder}
          onClose={() => setShowTableBuilder(false)}
          onInsertTable={(html) => {
            setFormData((prev) => ({
              ...prev,
              content: prev.content ? `${prev.content}\n<br/>\n${html}` : html
            }));
            setShowTableBuilder(false);
          }}
        />
      )}

      {/* Media Picker Modal */}
      {showMediaModal && (
        <MediaPickerModal
          isOpen={!!showMediaModal}
          onClose={() => setShowMediaModal(null)}
          onSelectImage={(url) => {
            if (showMediaModal) showMediaModal(url);
            setShowMediaModal(null);
          }}
        />
      )}
    </div>
  );
};

export default BlogEditorStudio;
