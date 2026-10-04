import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Globe,
  Search,
  Save,
  Tag,
  Table as TableIcon,
  X,
  Clock,
  Eye,
  Video,
  Play,
  Film,
  Plus,
  Trash2,
  ExternalLink,
  Code,
  Image as ImageIcon,
  Check,
  Star,
  FolderGit2
} from 'lucide-react';
import { PortfolioItem, PortfolioVideo, PostStatus } from '../types';
import GutenbergEditor from './GutenbergEditor';
import ResponsiveTableBuilder from './ResponsiveTableBuilder';
import { MediaPickerModal } from './MediaPickerModal';
import { PortfolioVideoPlayer } from './PortfolioVideoPlayer';
import { parseVideoUrl } from '../utils/videoHelper';

interface PortfolioEditorStudioProps {
  portfolio: Partial<PortfolioItem>;
  onSave: (portfolio: Partial<PortfolioItem>, shouldPublish?: boolean) => void;
  onClose: () => void;
  categories: Array<{ id: string; label: string }>;
}

export const PortfolioEditorStudio: React.FC<PortfolioEditorStudioProps> = ({
  portfolio: initialPort,
  onSave,
  onClose,
  categories = []
}) => {
  const [formData, setFormData] = useState<Partial<PortfolioItem>>({
    id: initialPort.id || `port-${Date.now()}`,
    title: initialPort.title || '',
    slug: initialPort.slug || '',
    category: initialPort.category || (categories[0]?.id || 'websites'),
    categoryLabel: initialPort.categoryLabel || (categories[0]?.label || 'Website Design & Development'),
    image: initialPort.image || '',
    description: initialPort.description || '',
    detailedDescription: initialPort.detailedDescription || '',
    content: initialPort.content || initialPort.detailedDescription || '',
    images: initialPort.images || [],
    tags: initialPort.tags || ['Web Development', 'Design'],
    technologies: initialPort.technologies || ['React', 'Tailwind CSS', 'TypeScript'],
    client: initialPort.client || '',
    stats: initialPort.stats || '',
    link: initialPort.link || '',
    videoUrl: initialPort.videoUrl || '',
    videoType: initialPort.videoType || 'youtube',
    videoEmbedCode: initialPort.videoEmbedCode || '',
    videos: initialPort.videos || [],
    date: initialPort.date || new Date().getFullYear().toString(),
    featured: initialPort.featured || false,
    status: initialPort.status || 'published',
    seoTitle: initialPort.seoTitle || (initialPort.title ? `${initialPort.title} | Case Study | Netronomic` : ''),
    metaDescription: initialPort.metaDescription || initialPort.description || '',
    focusKeyword: initialPort.focusKeyword || '',
    secondaryKeywords: initialPort.secondaryKeywords || '',
    canonicalUrl: initialPort.canonicalUrl || '',
    customSchema: initialPort.customSchema || '',
    seoScore: initialPort.seoScore || 85,
    readingTime: initialPort.readingTime || '4 min read'
  });

  const [activeTab, setActiveTab] = useState<'content' | 'video' | 'seo' | 'specs'>('content');
  const [showMediaModal, setShowMediaModal] = useState<((url: string) => void) | null>(null);
  const [showTableBuilder, setShowTableBuilder] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [techInput, setTechInput] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newVideoTitle, setNewVideoTitle] = useState('');

  // Dynamic Word Count & Case Study stats
  const stats = useMemo(() => {
    const text = ((formData.content || '') + ' ' + (formData.description || '')).replace(/<[^>]+>/g, ' ').trim();
    const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
    const minutes = Math.max(1, Math.min(15, Math.ceil(words / 180)));
    return {
      wordCount: words,
      readingTime: `${minutes} min read`
    };
  }, [formData.content, formData.description]);

  // Dynamic SEO Score Calculation
  const seoScore = useMemo(() => {
    let score = 50;
    if (formData.title && formData.title.length >= 20 && formData.title.length <= 70) score += 10;
    if (formData.metaDescription && formData.metaDescription.length >= 80 && formData.metaDescription.length <= 160) score += 10;
    if (formData.image) score += 10;
    if (formData.videoUrl || (formData.videos && formData.videos.length > 0)) score += 10;
    if (stats.wordCount > 150) score += 10;
    if (formData.focusKeyword && formData.title?.toLowerCase().includes(formData.focusKeyword.toLowerCase())) score += 10;
    return Math.min(100, score);
  }, [formData.title, formData.metaDescription, formData.image, formData.videoUrl, formData.videos, stats.wordCount, formData.focusKeyword]);

  const handleTitleChange = (val: string) => {
    setFormData((prev) => {
      const autoSlug = !initialPort.id || !prev.slug
        ? val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
        : prev.slug;
      const autoSeoTitle = !prev.seoTitle || prev.seoTitle === `${prev.title} | Case Study | Netronomic`
        ? `${val} | Case Study | Netronomic`
        : prev.seoTitle;
      return {
        ...prev,
        title: val,
        slug: autoSlug,
        seoTitle: autoSeoTitle
      };
    });
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags?.includes(tagInput.trim())) {
        setFormData((prev) => ({
          ...prev,
          tags: [...(prev.tags || []), tagInput.trim()]
        }));
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((t) => t !== tagToRemove) || []
    }));
  };

  const handleAddTech = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && techInput.trim()) {
      e.preventDefault();
      if (!formData.technologies?.includes(techInput.trim())) {
        setFormData((prev) => ({
          ...prev,
          technologies: [...(prev.technologies || []), techInput.trim()]
        }));
      }
      setTechInput('');
    }
  };

  const handleRemoveTech = (techToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies?.filter((t) => t !== techToRemove) || []
    }));
  };

  // Multiple Videos Support
  const handleAddExtraVideo = () => {
    if (!newVideoUrl.trim()) return;
    const parsed = parseVideoUrl(newVideoUrl);
    const newVideo: PortfolioVideo = {
      id: `vid-${Date.now()}`,
      title: newVideoTitle.trim() || `Demo Video ${((formData.videos || []).length) + 1}`,
      url: newVideoUrl.trim(),
      type: parsed.type === 'unknown' ? 'mp4' : parsed.type,
      thumbnail: parsed.thumbnailUrl
    };

    setFormData((prev) => ({
      ...prev,
      videos: [...(prev.videos || []), newVideo]
    }));
    setNewVideoUrl('');
    setNewVideoTitle('');
  };

  const handleRemoveExtraVideo = (videoId?: string) => {
    setFormData((prev) => ({
      ...prev,
      videos: prev.videos?.filter((v) => v.id !== videoId) || []
    }));
  };

  // Structured Data Schema Generation for Project / CreativeWork
  const generateSchema = () => {
    const siteUrl = 'https://netronomic.com';
    const projectUrl = `${siteUrl}/portfolio#${formData.slug || formData.id}`;
    const schemaObj: any = {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      headline: formData.title,
      name: formData.title,
      description: formData.metaDescription || formData.description,
      image: formData.image,
      author: {
        '@type': 'Organization',
        name: 'Netronomic Web',
        url: siteUrl
      },
      creator: {
        '@type': 'Organization',
        name: 'Netronomic Web'
      },
      genre: formData.categoryLabel || formData.category,
      keywords: (formData.tags || []).join(', '),
      url: projectUrl
    };

    if (formData.videoUrl) {
      const parsed = parseVideoUrl(formData.videoUrl);
      schemaObj.video = {
        '@type': 'VideoObject',
        name: `${formData.title} Video Walkthrough`,
        description: formData.description,
        thumbnailUrl: formData.image || parsed.thumbnailUrl,
        contentUrl: formData.videoUrl,
        embedUrl: parsed.embedUrl || formData.videoUrl,
        uploadDate: formData.date || new Date().toISOString()
      };
    }

    setFormData((prev) => ({
      ...prev,
      customSchema: JSON.stringify(schemaObj, null, 2)
    }));
  };

  const handleSubmit = (publishStatus: PostStatus = 'published') => {
    const updated: Partial<PortfolioItem> = {
      ...formData,
      status: publishStatus,
      seoScore,
      readingTime: stats.readingTime,
      detailedDescription: formData.content || formData.detailedDescription || formData.description
    };
    onSave(updated, publishStatus === 'published');
  };

  const detectedVideo = useMemo(() => {
    return parseVideoUrl(formData.videoUrl || '');
  }, [formData.videoUrl]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-slate-100 flex flex-col font-sans overflow-hidden">
      {/* Top Header Bar */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-2 text-xs font-semibold cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Portfolio</span>
          </button>
          <div className="h-4 w-px bg-slate-700 hidden sm:block" />
          <div className="flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-sky-400" />
            <span className="text-xs font-bold text-sky-400 uppercase tracking-widest hidden md:inline">
              Portfolio Studio
            </span>
            <span className="text-slate-400 text-xs hidden md:inline">•</span>
            <span className="text-xs font-semibold text-slate-300 truncate max-w-[200px] sm:max-w-xs">
              {formData.title || 'Untitled Portfolio Project'}
            </span>
          </div>
        </div>

        {/* Tab Switcher Pills */}
        <div className="hidden lg:flex items-center p-1 bg-slate-950/80 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('content')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'content'
                ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Case Study & Content</span>
          </button>
          <button
            onClick={() => setActiveTab('video')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer relative ${
              activeTab === 'video'
                ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Videos & Media</span>
            {formData.videoUrl && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('seo')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'seo'
                ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>SEO & SERP</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                seoScore >= 80 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
              }`}
            >
              {seoScore}%
            </span>
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'specs'
                ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Project Specs</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSubmit('draft')}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Save Draft</span>
          </button>
          <button
            onClick={() => handleSubmit('published')}
            className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-sky-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Save & Publish</span>
          </button>
        </div>
      </header>

      {/* Mobile Tab Bar */}
      <div className="lg:hidden flex items-center border-b border-slate-800 bg-slate-900 px-3 py-2 overflow-x-auto gap-2">
        <button
          onClick={() => setActiveTab('content')}
          className={`px-3 py-1 rounded-lg text-xs font-bold shrink-0 ${
            activeTab === 'content' ? 'bg-sky-500 text-slate-950' : 'text-slate-400'
          }`}
        >
          Case Study
        </button>
        <button
          onClick={() => setActiveTab('video')}
          className={`px-3 py-1 rounded-lg text-xs font-bold shrink-0 ${
            activeTab === 'video' ? 'bg-sky-500 text-slate-950' : 'text-slate-400'
          }`}
        >
          Videos & Media
        </button>
        <button
          onClick={() => setActiveTab('seo')}
          className={`px-3 py-1 rounded-lg text-xs font-bold shrink-0 ${
            activeTab === 'seo' ? 'bg-sky-500 text-slate-950' : 'text-slate-400'
          }`}
        >
          SEO ({seoScore}%)
        </button>
        <button
          onClick={() => setActiveTab('specs')}
          className={`px-3 py-1 rounded-lg text-xs font-bold shrink-0 ${
            activeTab === 'specs' ? 'bg-sky-500 text-slate-950' : 'text-slate-400'
          }`}
        >
          Project Specs
        </button>
      </div>

      {/* Main Studio Body */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
          
          {/* ============================================================ */}
          {/* TAB 1: CASE STUDY & CONTENT (GUTENBERG BLOCKS + TABLE) */}
          {/* ============================================================ */}
          {activeTab === 'content' && (
            <div className="space-y-6">
              {/* Project Title & Short Summary */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black uppercase tracking-wider text-sky-400">
                      Project Title
                    </label>
                    <span className="text-[11px] text-slate-500">
                      {formData.title?.length || 0}/70 Chars
                    </span>
                  </div>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g., AURA AI – Next-Gen SaaS Platform Design & Full-Stack Development"
                    className="w-full text-xl sm:text-2xl font-black bg-transparent border-b border-slate-800 focus:border-sky-500 pb-3 text-white placeholder:text-slate-600 focus:outline-none transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300">
                      Short Description (Portfolio Card Summary)
                    </label>
                    <textarea
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Brief overview displayed on portfolio cards and search snippets..."
                      className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-sky-500 transition-colors"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-300">
                      Featured Project Setting & Badge
                    </label>
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={Boolean(formData.featured)}
                          onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                          className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-sky-500 focus:ring-sky-500 cursor-pointer"
                        />
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                          <span>Show in Homepage Top Showcase</span>
                        </span>
                      </label>
                      <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-800">
                        <span>Reading Duration:</span>
                        <span className="font-bold text-sky-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {stats.readingTime} ({stats.wordCount} words)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Gutenberg Visual Blocks Studio */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <h2 className="text-lg font-black text-white flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-sky-400" />
                      <span>Case Study Gutenberg Visual Block Editor</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Build modern case study sections with headings, paragraphs, bullet lists, CTA boxes, code snippets, and responsive tables.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowTableBuilder(true)}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sky-400 hover:text-sky-300 text-xs font-bold transition-all cursor-pointer shadow-sm self-start sm:self-auto"
                  >
                    <TableIcon className="w-4 h-4" />
                    <span>Insert Responsive Table</span>
                  </button>
                </div>

                {/* Gutenberg Editor Core */}
                <GutenbergEditor
                  value={formData.content || formData.detailedDescription || ''}
                  onChange={(html) =>
                    setFormData((prev) => ({
                      ...prev,
                      content: html,
                      detailedDescription: html
                    }))
                  }
                  mediaAssets={[]}
                  onOpenMediaSelector={(onSelect) => setShowMediaModal(() => onSelect)}
                />
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 2: VIDEOS & MEDIA STUDIO (DEDICATED VIDEO FEATURE) */}
          {/* ============================================================ */}
          {activeTab === 'video' && (
            <div className="space-y-8">
              {/* PRIMARY VIDEO STUDIO */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <h2 className="text-lg font-black text-white flex items-center gap-2">
                      <Video className="w-5 h-5 text-sky-400" />
                      <span>Primary Portfolio Video Feature</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Add YouTube videos, Vimeo links, direct MP4 video files, or custom embed codes to showcase your work in motion.
                    </p>
                  </div>
                  {detectedVideo.type !== 'unknown' && (
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5" />
                      <span>{detectedVideo.type.toUpperCase()} DETECTED</span>
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left: Video Input Controls */}
                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        Video Source URL or Share Link
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.videoUrl}
                          onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                          placeholder="https://www.youtube.com/watch?v=... or https://vimeo.com/... or .mp4 URL"
                          className="w-full px-4 py-3 pl-10 rounded-2xl bg-slate-950 border border-slate-800 text-white text-xs font-mono placeholder:text-slate-600 focus:outline-none focus:border-sky-500"
                        />
                        <Film className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1.5">
                        Supported: YouTube (Standard, Shorts, Embeds), Vimeo, and direct MP4/WebM uploads.
                      </p>
                    </div>

                    {/* Or Embed Code */}
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                        <Code className="w-3.5 h-3.5 text-sky-400" />
                        <span>Or Custom Video Embed Code (&lt;iframe&gt;)</span>
                      </label>
                      <textarea
                        rows={3}
                        value={formData.videoEmbedCode || ''}
                        onChange={(e) => setFormData({ ...formData, videoEmbedCode: e.target.value })}
                        placeholder='<iframe width="560" height="315" src="..." frameborder="0" allowfullscreen></iframe>'
                        className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-xs font-mono placeholder:text-slate-600 focus:outline-none focus:border-sky-500"
                      />
                    </div>

                    {/* Cover Thumbnail Image */}
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                        <span>Project Poster / Thumbnail Image</span>
                        <button
                          type="button"
                          onClick={() => setShowMediaModal(() => (url: string) => setFormData({ ...formData, image: url }))}
                          className="text-[11px] text-sky-400 hover:text-sky-300 font-bold cursor-pointer"
                        >
                          Select from Gallery
                        </button>
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={formData.image}
                          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                          placeholder="https://images.unsplash.com/... or uploaded image URL"
                          className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-sky-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowMediaModal(() => (url: string) => setFormData({ ...formData, image: url }))}
                          className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 transition-colors cursor-pointer"
                        >
                          Browse
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right: Live Interactive Video Preview */}
                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Play className="w-3.5 h-3.5 text-sky-400" />
                      <span>Live Video Preview Player</span>
                    </label>

                    <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-950 p-2 shadow-2xl">
                      {formData.videoUrl || formData.videoEmbedCode ? (
                        <PortfolioVideoPlayer
                          url={formData.videoUrl}
                          embedCode={formData.videoEmbedCode}
                          poster={formData.image}
                          title={formData.title}
                          controls={true}
                        />
                      ) : formData.image ? (
                        <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900">
                          <img
                            src={formData.image}
                            alt="Cover preview"
                            className="w-full h-full object-cover opacity-80"
                          />
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-center p-4">
                            <Video className="w-10 h-10 text-slate-400 mb-2" />
                            <p className="text-xs font-bold text-white">No Video Added Yet</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              Paste a YouTube, Vimeo, or MP4 link on the left to activate video playback.
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="aspect-video rounded-xl border border-dashed border-slate-800 flex flex-col items-center justify-center p-6 text-center text-slate-500">
                          <Film className="w-10 h-10 text-slate-600 mb-2" />
                          <p className="text-xs font-bold text-slate-400">Video Player Standby</p>
                          <p className="text-[11px] text-slate-600 mt-1 max-w-xs">
                            Add a video URL or image above to see a live preview.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* EXTRA DEMO VIDEOS PLAYLIST (ADD MULTIPLE VIDEOS) */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Film className="w-4 h-4 text-sky-400" />
                      <span>Multiple Project Walkthrough Videos & Reels</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Add additional clips, product demos, user journey videos, or social reels for this project.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-slate-400">
                    {formData.videos?.length || 0} Extra Videos
                  </span>
                </div>

                {/* Add Video Row */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="sm:col-span-4">
                    <input
                      type="text"
                      value={newVideoTitle}
                      onChange={(e) => setNewVideoTitle(e.target.value)}
                      placeholder="Video Title (e.g. Mobile App Demo)"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-sky-500"
                    />
                  </div>
                  <div className="sm:col-span-6">
                    <input
                      type="text"
                      value={newVideoUrl}
                      onChange={(e) => setNewVideoUrl(e.target.value)}
                      placeholder="Video URL (YouTube, Vimeo, MP4)"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-sky-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <button
                      type="button"
                      onClick={handleAddExtraVideo}
                      disabled={!newVideoUrl.trim()}
                      className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Video</span>
                    </button>
                  </div>
                </div>

                {/* List of Extra Videos */}
                {formData.videos && formData.videos.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formData.videos.map((vid, idx) => (
                      <div
                        key={vid.id || idx}
                        className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-3 group"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
                            <Play className="w-4 h-4 fill-sky-400/20" />
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-xs font-bold text-white truncate">{vid.title}</p>
                            <p className="text-[11px] text-slate-500 truncate font-mono">{vid.url}</p>
                            <span className="inline-block mt-1 text-[10px] font-bold text-sky-400 uppercase tracking-wider">
                              {vid.type || 'Video'}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveExtraVideo(vid.id)}
                          className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center rounded-2xl border border-dashed border-slate-800 text-slate-500 text-xs">
                    No extra demo videos added yet. You can add video links above.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 3: SEO SUITE & GOOGLE SERP PREVIEW (BLOG FEATURES A-Z) */}
          {/* ============================================================ */}
          {activeTab === 'seo' && (
            <div className="space-y-8">
              {/* GOOGLE SERP LIVE PREVIEW */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <h2 className="text-lg font-black text-white flex items-center gap-2">
                      <Search className="w-5 h-5 text-sky-400" />
                      <span>Google SERP Search Preview</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      See how this portfolio project will look on Google Search results and social sharing cards.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                        seoScore >= 80
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      SEO Score: {seoScore}/100
                    </span>
                  </div>
                </div>

                {/* Google Search Card Box */}
                <div className="p-5 rounded-2xl bg-white text-slate-900 shadow-inner space-y-2 max-w-2xl font-sans">
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center font-bold text-sky-600">
                      N
                    </div>
                    <span className="font-semibold text-slate-800">Netronomic Web</span>
                    <span className="text-slate-400">› portfolio › {formData.slug || 'project-slug'}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-blue-700 hover:underline cursor-pointer line-clamp-1">
                    {formData.seoTitle || formData.title || 'Portfolio Case Study | Netronomic Web'}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {formData.metaDescription ||
                      formData.description ||
                      'Explore our detailed case study and project results by Netronomic Web.'}
                  </p>
                </div>

                {/* Meta Title & Meta Description Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-slate-300">SEO Meta Title</label>
                      <span className="text-[11px] text-slate-500">
                        {formData.seoTitle?.length || 0}/60 Chars
                      </span>
                    </div>
                    <input
                      type="text"
                      value={formData.seoTitle}
                      onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                      placeholder="e.g. AURA AI Platform – Web Design Case Study | Netronomic"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-slate-300">Focus Keyword</label>
                      <span className="text-[11px] text-slate-500">Primary target query</span>
                    </div>
                    <input
                      type="text"
                      value={formData.focusKeyword}
                      onChange={(e) => setFormData({ ...formData, focusKeyword: e.target.value })}
                      placeholder="e.g. AI SaaS web design"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-slate-300">Meta Description</label>
                      <span className="text-[11px] text-slate-500">
                        {formData.metaDescription?.length || 0}/160 Chars
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      value={formData.metaDescription}
                      onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                      placeholder="High-converting summary of the project to drive click-throughs from Google..."
                      className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300">Secondary Keywords</label>
                    <input
                      type="text"
                      value={formData.secondaryKeywords}
                      onChange={(e) => setFormData({ ...formData, secondaryKeywords: e.target.value })}
                      placeholder="Comma separated: web development, UI UX, react case study"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300">Canonical URL</label>
                    <input
                      type="text"
                      value={formData.canonicalUrl}
                      onChange={(e) => setFormData({ ...formData, canonicalUrl: e.target.value })}
                      placeholder="https://netronomic.com/portfolio#..."
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>
              </div>

              {/* STRUCTURED DATA SCHEMA GENERATOR */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Code className="w-4 h-4 text-sky-400" />
                      <span>Structured Data JSON-LD Schema Generator</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Generates CreativeWork & VideoObject schema for rich snippets and video search badges.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={generateSchema}
                    className="px-4 py-2 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 text-xs font-bold transition-colors cursor-pointer self-start sm:self-auto"
                  >
                    Auto-Generate Schema
                  </button>
                </div>

                <textarea
                  rows={8}
                  value={formData.customSchema || ''}
                  onChange={(e) => setFormData({ ...formData, customSchema: e.target.value })}
                  placeholder='Click "Auto-Generate Schema" to create rich structured JSON-LD data...'
                  className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-emerald-400 text-xs font-mono focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 4: PROJECT SPECS & METADATA */}
          {/* ============================================================ */}
          {activeTab === 'specs' && (
            <div className="space-y-8">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
                <h2 className="text-lg font-black text-white border-b border-slate-800 pb-4 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-sky-400" />
                  <span>Project Specifications & Metadata</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Category */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Project Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => {
                        const val = e.target.value;
                        const match = categories.find((c) => c.id === val);
                        setFormData({
                          ...formData,
                          category: val,
                          categoryLabel: match?.label || 'Website Design & Development'
                        });
                      }}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-sky-500"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Client Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Client Name</label>
                    <input
                      type="text"
                      value={formData.client}
                      onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                      placeholder="e.g. Netronomic Labs / Aura Tech Inc."
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  {/* Highlight Stats */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Highlight Result / Key Metric
                    </label>
                    <input
                      type="text"
                      value={formData.stats}
                      onChange={(e) => setFormData({ ...formData, stats: e.target.value })}
                      placeholder="e.g. +240% Growth or 1.2M Active Users"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  {/* Live Website Link */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Live Project Website Link
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.link}
                        onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                        placeholder="https://example.com"
                        className="w-full px-4 py-2.5 pl-10 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-sky-500"
                      />
                      <ExternalLink className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  {/* Completion Date */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Year / Date</label>
                    <input
                      type="text"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      placeholder="e.g. 2026"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  {/* Project Slug */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">URL Slug</label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="e.g. aura-ai-platform"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                {/* Technologies Pills */}
                <div className="space-y-3 pt-2">
                  <label className="block text-xs font-bold text-slate-300">
                    Technologies & Frameworks (Press Enter to Add)
                  </label>
                  <div className="flex flex-wrap gap-2 p-3 rounded-2xl bg-slate-950 border border-slate-800 min-h-[50px] items-center">
                    {formData.technologies?.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-bold flex items-center gap-1.5"
                      >
                        {tech}
                        <button
                          type="button"
                          onClick={() => handleRemoveTech(tech)}
                          className="hover:text-white"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      value={techInput}
                      onChange={(e) => setTechInput(e.target.value)}
                      onKeyDown={handleAddTech}
                      placeholder="Add tech (e.g. Next.js, Figma, Python)..."
                      className="flex-1 min-w-[200px] bg-transparent text-xs text-white placeholder:text-slate-600 focus:outline-none px-2"
                    />
                  </div>
                </div>

                {/* Tags Pills */}
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-slate-300">
                    Tags & Keywords (Press Enter to Add)
                  </label>
                  <div className="flex flex-wrap gap-2 p-3 rounded-2xl bg-slate-950 border border-slate-800 min-h-[50px] items-center">
                    {formData.tags?.map((t) => (
                      <span
                        key={t}
                        className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5"
                      >
                        {t}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(t)}
                          className="hover:text-white"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleAddTag}
                      placeholder="Add tag (e.g. AI, Full-Stack, High-Converting)..."
                      className="flex-1 min-w-[200px] bg-transparent text-xs text-white placeholder:text-slate-600 focus:outline-none px-2"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

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

      {/* Responsive Table Builder Modal */}
      {showTableBuilder && (
        <ResponsiveTableBuilder
          onInsert={(tableHtml) => {
            setFormData((prev) => ({
              ...prev,
              content: (prev.content || '') + '\n' + tableHtml
            }));
            setShowTableBuilder(false);
          }}
          onClose={() => setShowTableBuilder(false)}
        />
      )}
    </div>
  );
};
