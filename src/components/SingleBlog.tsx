import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Share2,
  Copy,
  Check,
  Twitter,
  Linkedin,
  Facebook,
  MessageSquare,
  Send,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  List,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  ChevronUp,
  ChevronDown,
  RefreshCw,
  Home,
  Tag
} from 'lucide-react';
import { BlogPost, BlogComment } from '../types';
import { Logo } from './Logo';
import { ArticleRenderer, extractArticleHeadings } from './ArticleRenderer';

interface SingleBlogProps {
  post: BlogPost;
  allPosts: BlogPost[];
  onBack: () => void;
  onSelectPost: (slug: string) => void;
  onAddComment: (postId: string, comment: BlogComment) => void;
  onNavigateHome?: () => void;
  onSelectCategory?: (category: string) => void;
}

// Formats dates into clean readable strings (e.g. Sep 24, 2026)
const formatReadableDate = (dateStr?: string): string => {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return dateStr;
  }
};

export const SingleBlog: React.FC<SingleBlogProps> = ({
  post,
  allPosts,
  onBack,
  onSelectPost,
  onAddComment,
  onNavigateHome,
  onSelectCategory
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [commentName, setCommentName] = useState('');
  const [commentEmail, setCommentEmail] = useState('');
  const [commentText, setCommentText] = useState('');
  const [commentSubmitted, setCommentSubmitted] = useState(false);
  const [mobileTocOpen, setMobileTocOpen] = useState(false);
  const [activeHeadingId, setActiveHeadingId] = useState<string>('');

  // Automated SEO meta values and JSON-LD structured data for react-helmet-async
  const resolvedTitle = post.seoTitle || `${post.title} | Netronomic Web`;
  const resolvedDesc = post.metaDescription || post.excerpt;
  const resolvedImage = post.ogImage || post.featuredImage;
  const canonical = post.canonicalUrl || `https://netronomicweb.com/blog/${post.slug}`;

  const authorName = (post.author?.name || 'Netronomic Web').trim();
  const isOrgAuthor =
    authorName.toLowerCase().includes('netronomic') ||
    authorName.toLowerCase().includes('team') ||
    authorName.toLowerCase().includes('agency') ||
    authorName.toLowerCase().includes('editorial');

  const authorSchema = isOrgAuthor
    ? {
        '@type': 'Organization',
        name: authorName,
        url: 'https://netronomicweb.com'
      }
    : {
        '@type': 'Person',
        name: authorName,
        ...(post.author?.role ? { jobTitle: post.author.role } : {}),
        ...(post.author?.avatar ? { image: post.author.avatar } : {})
      };

  const publisherSchema = {
    '@type': 'Organization',
    name: 'Netronomic Web',
    url: 'https://netronomicweb.com',
    logo: {
      '@type': 'ImageObject',
      url: 'https://netronomicweb.com/logo.png'
    }
  };

  const blogPostingSchema = {
    '@type': 'BlogPosting',
    '@id': `${canonical}#article`,
    headline: post.title,
    description: resolvedDesc,
    image: [resolvedImage],
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: authorSchema,
    publisher: publisherSchema,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonical
    },
    url: canonical,
    articleSection: post.category,
    ...(post.tags && post.tags.length > 0 ? { keywords: post.tags.join(', ') } : {})
  };

  const breadcrumbSchema = {
    '@type': 'BreadcrumbList',
    '@id': `${canonical}#breadcrumb`,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://netronomicweb.com/'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: 'https://netronomicweb.com/blog'
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.category,
        item: `https://netronomicweb.com/blog?category=${encodeURIComponent(post.category)}`
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: post.title,
        item: canonical
      }
    ]
  };

  const jsonLdGraphString = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [blogPostingSchema, breadcrumbSchema, publisherSchema]
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [post]);

  // Extract headings for Table of Contents dynamically (supports both blocks and markdown)
  const tableOfContents = useMemo(() => extractArticleHeadings(post), [post]);

  // Track active heading on scroll
  useEffect(() => {
    if (tableOfContents.length === 0) return;

    const handleScroll = () => {
      const scrollPos = window.scrollY + 160;
      for (let i = tableOfContents.length - 1; i >= 0; i--) {
        const item = tableOfContents[i];
        const el = document.getElementById(item.id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveHeadingId(item.id);
          return;
        }
      }
      if (tableOfContents.length > 0) {
        setActiveHeadingId(tableOfContents[0].id);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [tableOfContents]);

  // Previous and Next Post navigation
  const publishedPosts = useMemo(() => allPosts.filter(p => p.status === 'published'), [allPosts]);
  const currentIndex = publishedPosts.findIndex(p => p.id === post.id);
  const prevPost = currentIndex > 0 ? publishedPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < publishedPosts.length - 1 ? publishedPosts[currentIndex + 1] : null;

  // Related posts: 1. Same category, 2. Matching tags, 3. Related keywords (excluding current)
  const relatedPosts = useMemo(() => {
    return publishedPosts
      .filter(p => p.id !== post.id)
      .map(p => {
        let score = 0;
        if (p.category.toLowerCase() === post.category.toLowerCase()) score += 10;
        const matchingTags = (p.tags || []).filter(t => 
          (post.tags || []).some(pt => pt.toLowerCase() === t.toLowerCase())
        );
        score += matchingTags.length * 3;
        if (post.focusKeyword && (p.title.toLowerCase().includes(post.focusKeyword.toLowerCase()) || p.excerpt.toLowerCase().includes(post.focusKeyword.toLowerCase()))) {
          score += 5;
        }
        return { post: p, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(item => item.post);
  }, [publishedPosts, post]);

  const handleShare = (platform: 'twitter' | 'linkedin' | 'facebook' | 'copy') => {
    const url = window.location.href;
    const title = post.title;

    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    } else {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentName.trim() && commentText.trim()) {
      const newComment: BlogComment = {
        id: `c-${Date.now()}`,
        author: commentName.trim(),
        email: commentEmail.trim() || undefined,
        avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80`,
        date: new Date().toISOString().split('T')[0],
        content: commentText.trim()
      };
      onAddComment(post.id, newComment);
      setCommentName('');
      setCommentEmail('');
      setCommentText('');
      setCommentSubmitted(true);
      setTimeout(() => setCommentSubmitted(false), 3500);
    }
  };

  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const topOffset = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: topOffset, behavior: 'smooth' });
    }
  };

  const hasUpdatedDate = Boolean(post.updatedAt && post.updatedAt.trim() !== '' && post.updatedAt !== post.publishedAt);
  const allowComments = post.allowComments !== false;

  useEffect(() => {
    document.title = resolvedTitle;
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', resolvedDesc);
  }, [resolvedTitle, resolvedDesc]);

  return (
    <div className="pt-24 pb-20 bg-[#050816] text-white min-h-screen relative overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdGraphString }}
      />
      {/* Background Lighting Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[450px] bg-gradient-to-b from-sky-600/15 via-blue-600/10 to-transparent blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-[450px] h-[450px] bg-sky-500/10 blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ======================================================== */}
        {/* 2. ARTICLE HEADER (EXACT ORDER REQUESTED) */}
        {/* Breadcrumb ↓ Category ↓ H1 Article Title ↓ Short Excerpt ↓ Author + Published Date + Reading Time ↓ Featured Image */}
        {/* ======================================================== */}
        <header className="max-w-4xl mx-auto space-y-4 mb-8">
          
          {/* 1. Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-400 py-1">
            <button
              onClick={() => onNavigateHome ? onNavigateHome() : onBack()}
              className="hover:text-sky-300 transition-colors cursor-pointer shrink-0"
            >
              Home
            </button>
            <span className="text-slate-600">/</span>
            <button
              onClick={onBack}
              className="hover:text-sky-300 transition-colors cursor-pointer shrink-0"
            >
              Blog
            </button>
            <span className="text-slate-600">/</span>
            <button
              onClick={() => {
                if (onSelectCategory) onSelectCategory(post.category);
                else onBack();
              }}
              className="text-sky-400 font-semibold hover:underline decoration-sky-400/50 cursor-pointer shrink-0"
            >
              {post.category}
            </button>
          </nav>

          {/* 2. Category Eyebrow */}
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-sky-400">
              {post.category}
            </span>
          </div>

          {/* 3. Main H1 Article Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-[2.65rem] font-black text-white tracking-tight leading-[1.2]">
            {post.title}
          </h1>

          {/* 4. Short Excerpt */}
          {post.excerpt && (
            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {/* 5. Author + Published Date + Reading Time */}
          <div className="pt-3 pb-4 border-t border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="shrink-0 p-1 rounded-xl bg-slate-900 border border-sky-500/20 shadow-md">
                <Logo size="sm" variant="dark" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">Netronomic Web</span>
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/30">
                    <ShieldCheck className="w-3 h-3 text-sky-400" />
                    <span>Verified</span>
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Published {formatReadableDate(post.publishedAt)} • {post.readingTime}
                  {hasUpdatedDate && (
                    <span className="text-emerald-400 ml-1.5">• Updated {formatReadableDate(post.updatedAt)}</span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* 6. Large Featured Image */}
          <div className="pt-2">
            <div className="rounded-2xl sm:rounded-3xl overflow-hidden border border-sky-500/20 shadow-2xl aspect-video w-full bg-slate-900">
              <img
                src={post.featuredImage}
                alt={post.featuredImageAlt || post.title}
                loading="eager"
                className="w-full h-full object-cover"
              />
            </div>
            {post.featuredImageCaption && (
              <p className="text-xs text-slate-400 mt-2.5 text-center italic">
                {post.featuredImageCaption}
              </p>
            )}
          </div>

        </header>

        {/* ======================================================== */}
        {/* 3 & 4. ARTICLE CONTENT AREA & DESKTOP STICKY TOC */}
        {/* Desktop: LEFT ~700-780px readable width, RIGHT sticky TOC */}
        {/* Mobile: 100% width with collapsible TOC */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT: Main article content (700–780px readable width) */}
          <main className="lg:col-span-8 min-w-0">
            
            {/* Mobile Collapsible Table of Contents */}
            {tableOfContents.length > 0 && (
              <div className="lg:hidden mb-8 rounded-2xl bg-[#0B1120] border border-slate-800 p-4 shadow-lg">
                <button
                  onClick={() => setMobileTocOpen(!mobileTocOpen)}
                  className="w-full flex items-center justify-between text-left text-sm font-bold text-sky-400 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <List className="w-4 h-4 text-sky-400" />
                    <span>Table of Contents ({tableOfContents.length})</span>
                  </span>
                  {mobileTocOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {mobileTocOpen && (
                  <ol className="mt-3 pt-3 border-t border-slate-800/80 space-y-2 text-xs list-decimal pl-5">
                    {tableOfContents.map((head, idx) => (
                      <li key={idx} className="pl-1">
                        <button
                          onClick={() => {
                            scrollToHeading(head.id);
                            setMobileTocOpen(false);
                          }}
                          className={`text-left transition-colors w-full truncate ${
                            activeHeadingId === head.id ? 'text-sky-400 font-bold' : 'text-slate-300 hover:text-white'
                          }`}
                        >
                          {head.text}
                        </button>
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            )}

            {/* Reusable Article Content Renderer */}
            <article className="prose-invert max-w-none">
              <ArticleRenderer post={post} />
            </article>

            {/* ======================================================== */}
            {/* 12. ARTICLE FOOTER: TAGS */}
            {/* ======================================================== */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-10 mt-10 border-t border-slate-800">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
                  Tags:
                </span>
                {post.tags.map(tag => (
                  <button
                    key={tag}
                    onClick={onBack}
                    className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-sky-500/40 text-slate-300 hover:text-sky-300 text-xs font-semibold transition-all cursor-pointer"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            )}

            {/* ======================================================== */}
            {/* PREVIOUS / NEXT ARTICLE PREVIEWS */}
            {/* ======================================================== */}
            <nav aria-label="Previous and Next Articles" className="pt-8">
              <div className={`grid gap-4 ${prevPost && nextPost ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
                {prevPost && (
                  <button
                    onClick={() => onSelectPost(prevPost.slug)}
                    className="p-5 rounded-2xl bg-[#0B1120] border border-slate-800 hover:border-sky-500/40 text-left transition-all group cursor-pointer shadow-lg"
                  >
                    <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      <ChevronLeft className="w-3.5 h-3.5 text-sky-400 group-hover:-translate-x-1 transition-transform" />
                      <span>Previous Article</span>
                    </div>
                    <p className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors line-clamp-2 leading-snug">
                      {prevPost.title}
                    </p>
                  </button>
                )}

                {nextPost && (
                  <button
                    onClick={() => onSelectPost(nextPost.slug)}
                    className={`p-5 rounded-2xl bg-[#0B1120] border border-slate-800 hover:border-sky-500/40 text-right transition-all group cursor-pointer shadow-lg ${
                      !prevPost ? 'sm:col-start-1 sm:max-w-md ml-auto w-full' : ''
                    }`}
                  >
                    <div className="flex items-center justify-end gap-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      <span>Next Article</span>
                      <ChevronRight className="w-3.5 h-3.5 text-sky-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <p className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors line-clamp-2 leading-snug">
                      {nextPost.title}
                    </p>
                  </button>
                )}
              </div>
            </nav>

            {/* ======================================================== */}
            {/* 13. RELATED ARTICLES */}
            {/* ======================================================== */}
            {relatedPosts.length > 0 && (
              <section aria-labelledby="related-heading" className="pt-10 mt-10 border-t border-slate-800">
                <h3 id="related-heading" className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-sky-400" />
                  <span>Related Articles</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {relatedPosts.map(rel => (
                    <div
                      key={rel.id}
                      onClick={() => onSelectPost(rel.slug)}
                      className="bg-[#0B1120] border border-slate-800 hover:border-sky-500/40 rounded-2xl p-4 cursor-pointer group transition-all shadow-md flex flex-col justify-between"
                    >
                      <div>
                        <div className="w-full h-32 rounded-xl overflow-hidden mb-3 bg-slate-900">
                          <img
                            src={rel.featuredImage}
                            alt={rel.title}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/10 text-sky-400 mb-2">
                          {rel.category}
                        </span>
                        <h4 className="text-sm font-bold text-white group-hover:text-sky-300 line-clamp-2 leading-snug">
                          {rel.title}
                        </h4>
                        <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                          {rel.excerpt}
                        </p>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mt-4 pt-2 border-t border-slate-800/80">
                        <span>{rel.readingTime}</span>
                        <span className="text-sky-400 font-semibold group-hover:translate-x-0.5 transition-transform">Read →</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ======================================================== */}
            {/* 14. COMMENTS / DISCUSSION */}
            {/* ======================================================== */}
            {allowComments && (
              <section aria-labelledby="discussion-heading" className="mt-12 rounded-3xl bg-[#0B1120] border border-slate-800/80 p-6 sm:p-8 shadow-2xl">
                <h3 id="discussion-heading" className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-sky-400" />
                  <span>Discussion ({post.comments?.length || 0})</span>
                </h3>

                {/* Comment List */}
                <div className="space-y-4 mb-8">
                  {(!post.comments || post.comments.length === 0) ? (
                    <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/60 text-center">
                      <p className="text-xs text-slate-400 italic">No comments yet. Share your thoughts or technical perspective below!</p>
                    </div>
                  ) : (
                    post.comments.map(c => (
                      <div key={c.id} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={c.avatar || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80`}
                              alt={c.author}
                              className="w-8 h-8 rounded-full object-cover border border-sky-400/30"
                            />
                            <div>
                              <p className="text-xs font-bold text-white">{c.author}</p>
                              <p className="text-[10px] text-slate-400">{formatReadableDate(c.date)}</p>
                            </div>
                          </div>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-10">
                          {c.content}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                {/* Leave a comment form */}
                <form onSubmit={handlePostComment} className="space-y-4 pt-4 border-t border-slate-800">
                  <h4 className="text-sm font-bold text-white">Join the Conversation</h4>

                  {commentSubmitted && (
                    <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
                      ✓ Thank you! Your comment has been added to this article discussion.
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={commentName}
                        onChange={(e) => setCommentName(e.target.value)}
                        placeholder="John Doe / Tech Lead"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">Your Email (optional)</label>
                      <input
                        type="email"
                        value={commentEmail}
                        onChange={(e) => setCommentEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-sky-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">Comment *</label>
                    <textarea
                      required
                      rows={3}
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Share your perspective or ask a technical question..."
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-bold text-xs shadow-md shadow-sky-500/20 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Post Comment</span>
                  </button>
                </form>
              </section>
            )}

          </main>

          {/* ======================================================== */}
          {/* RIGHT: DESKTOP STICKY SIDEBAR (TABLE OF CONTENTS & SHARE) */}
          {/* ======================================================== */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-28 space-y-6">
            
            {/* 5. Clean Sticky Table of Contents Card */}
            {tableOfContents.length > 0 && (
              <div className="rounded-2xl bg-[#0B1120]/95 backdrop-blur-md border border-slate-800 p-5 shadow-xl">
                <div className="flex items-center gap-2 text-sky-400 font-bold text-xs uppercase tracking-wider mb-4 pb-2 border-b border-slate-800">
                  <List className="w-4 h-4" />
                  <span>Table of Contents</span>
                </div>
                <nav aria-label="Table of Contents">
                  <ol className="space-y-2 text-xs list-decimal pl-4">
                    {tableOfContents.map((head, idx) => {
                      const isActive = activeHeadingId === head.id;
                      return (
                        <li key={idx} className="pl-1">
                          <button
                            onClick={() => scrollToHeading(head.id)}
                            className={`text-left py-1 px-1.5 rounded transition-all w-full truncate cursor-pointer ${
                              isActive
                                ? 'text-sky-300 font-bold'
                                : 'text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            {head.text}
                          </button>
                        </li>
                      );
                    })}
                  </ol>
                </nav>
              </div>
            )}

            {/* Quick Share Card */}
            <div className="rounded-2xl bg-[#0B1120]/95 backdrop-blur-md border border-slate-800 p-5 shadow-xl">
              <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider mb-4 pb-2 border-b border-slate-800">
                <Share2 className="w-4 h-4 text-sky-400" />
                <span>Share this Article</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => handleShare('twitter')}
                  className="p-2.5 rounded-xl bg-slate-900 hover:bg-sky-500/20 hover:text-sky-400 text-slate-300 border border-slate-800 flex items-center justify-center transition-all cursor-pointer"
                  title="Share on X / Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleShare('linkedin')}
                  className="p-2.5 rounded-xl bg-slate-900 hover:bg-sky-500/20 hover:text-sky-400 text-slate-300 border border-slate-800 flex items-center justify-center transition-all cursor-pointer"
                  title="Share on LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleShare('facebook')}
                  className="p-2.5 rounded-xl bg-slate-900 hover:bg-sky-500/20 hover:text-sky-400 text-slate-300 border border-slate-800 flex items-center justify-center transition-all cursor-pointer"
                  title="Share on Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleShare('copy')}
                  className="p-2.5 rounded-xl bg-slate-900 hover:bg-sky-500/20 hover:text-sky-400 text-slate-300 border border-slate-800 flex items-center justify-center transition-all cursor-pointer"
                  title="Copy Article Link"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              {copiedLink && (
                <p className="text-[11px] text-emerald-400 font-semibold mt-2 text-center">
                  ✓ Link copied to clipboard!
                </p>
              )}
            </div>

            {/* Publication Back to Top */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="w-full py-2.5 rounded-xl bg-[#0B1120] hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
            >
              <ChevronUp className="w-3.5 h-3.5 text-sky-400" />
              <span>Back to Top</span>
            </button>

          </aside>

        </div>

      </div>
    </div>
  );
};
