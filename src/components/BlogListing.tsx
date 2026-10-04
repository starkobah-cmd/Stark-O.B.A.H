import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Search,
  Sparkles,
  Clock,
  Calendar,
  User,
  ArrowRight,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Filter
} from 'lucide-react';
import { BlogPost } from '../types';
import { BLOG_CATEGORIES } from '../data/blogData';

interface BlogListingProps {
  posts: BlogPost[];
  onSelectPost: (slug: string) => void;
  onOpenAdmin?: () => void;
  onOpenSitemap?: () => void;
}

export const BlogListing: React.FC<BlogListingProps> = ({
  posts,
  onSelectPost,
  onOpenAdmin,
  onOpenSitemap
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  const postsPerPage = 6;

  // Filter only published posts for public view
  const publishedPosts = useMemo(() => {
    return posts.filter(p => p.status === 'published');
  }, [posts]);

  // Featured post
  const featuredPost = useMemo(() => {
    return publishedPosts.find(p => p.isFeatured) || publishedPosts[0];
  }, [publishedPosts]);

  // Filtered list
  const filteredPosts = useMemo(() => {
    return publishedPosts.filter(post => {
      const matchesCategory =
        selectedCategory === 'All' || post.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch =
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [publishedPosts, selectedCategory, searchTerm]);

  // Grid list (exclude featured post on page 1 when 'All' category and no search)
  const gridPostsRaw = useMemo(() => {
    if (currentPage === 1 && !searchTerm && selectedCategory === 'All' && featuredPost) {
      return filteredPosts.filter(p => p.id !== featuredPost.id);
    }
    return filteredPosts;
  }, [filteredPosts, currentPage, searchTerm, selectedCategory, featuredPost]);

  // Pagination calculation
  const totalPages = Math.ceil(gridPostsRaw.length / postsPerPage) || 1;
  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * postsPerPage;
    return gridPostsRaw.slice(start, start + postsPerPage);
  }, [gridPostsRaw, currentPage]);

  return (
    <div className="pt-24 pb-20 bg-[#050816] text-white min-h-screen relative overflow-hidden">
      {/* Background Lighting Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[500px] bg-gradient-to-b from-sky-600/15 via-blue-600/10 to-transparent blur-[130px] pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-sky-500/10 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Header Information Bar */}
        <div className="flex items-center justify-between py-2 border-b border-slate-800/80 mb-8 text-xs">
          <div className="flex items-center gap-3 text-slate-400">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Netronomic Knowledge Hub & Official Engineering Insights</span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(56,189,248,0.2)]"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
            <span>Netronomic Publication</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-black tracking-tight leading-tight text-white uppercase"
          >
            Blog
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal"
          >
            Insights, guides and ideas from Netronomic Web.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="pt-4 max-w-xl mx-auto relative"
          >
            <div className="relative flex items-center">
              <Search className="w-5 h-5 absolute left-4 text-sky-400 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search articles by keyword, category, or tag..."
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[#0B1120] border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-sm shadow-xl transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 text-xs font-bold text-slate-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>
          </motion.div>

          {/* Category Filter Pills */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-2">
            {BLOG_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  selectedCategory.toLowerCase() === cat.toLowerCase()
                    ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white border-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.3)]'
                    : 'bg-[#0B1120] text-slate-400 border-slate-800 hover:border-sky-500/40 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Article Banner (Only show when on page 1 and no search filter) */}
        {featuredPost && currentPage === 1 && !searchTerm && selectedCategory === 'All' && (
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16 relative rounded-3xl bg-[#0B1120] border border-sky-500/30 overflow-hidden shadow-[0_0_40px_rgba(56,189,248,0.15)] group cursor-pointer"
            onClick={() => onSelectPost(featuredPost.slug)}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
              <div className="lg:col-span-7 aspect-video lg:aspect-auto lg:h-[420px] overflow-hidden relative">
                <img
                  src={featuredPost.featuredImage}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#0B1120] via-transparent to-transparent opacity-80" />
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 shadow-md flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Featured Story
                  </span>
                </div>
              </div>

              <div className="lg:col-span-5 p-8 sm:p-10 space-y-4">
                <div className="flex items-center gap-3 text-xs text-sky-400 font-semibold">
                  <span className="px-2.5 py-1 rounded-md bg-sky-500/10 border border-sky-500/20">
                    {featuredPost.category}
                  </span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-sky-400" />
                    {featuredPost.readingTime}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-white group-hover:text-sky-300 transition-colors leading-tight">
                  {featuredPost.title}
                </h2>

                <p className="text-xs sm:text-sm text-slate-300 line-clamp-3 leading-relaxed">
                  {featuredPost.excerpt}
                </p>

                <div className="pt-4 flex items-center justify-between border-t border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <img
                      src={featuredPost.author.avatar}
                      alt={featuredPost.author.name}
                      className="w-9 h-9 rounded-full object-cover border border-sky-400/40"
                    />
                    <div>
                      <p className="text-xs font-bold text-white">{featuredPost.author.name}</p>
                      <p className="text-[10px] text-slate-400">{featuredPost.publishedAt}</p>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 text-xs font-bold text-sky-400 group-hover:translate-x-1 transition-transform">
                    Read Article <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Blog Posts Grid */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Filter className="w-4 h-4 text-sky-400" />
              <span>
                {selectedCategory === 'All' ? 'All Publications' : `${selectedCategory} Articles`}
              </span>
              <span className="text-xs font-normal text-slate-400">
                ({filteredPosts.length} total)
              </span>
            </h3>
          </div>

          {paginatedPosts.length === 0 ? (
            <div className="text-center py-16 bg-[#0B1120] rounded-3xl border border-slate-800 p-8 space-y-4">
              <p className="text-slate-400 text-base">No articles found matching your criteria.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                }}
                className="px-4 py-2 rounded-xl bg-sky-500 text-white font-bold text-xs"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
              {paginatedPosts.map((post, idx) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -6 }}
                  onClick={() => onSelectPost(post.slug)}
                  className="bg-[#0B1120]/90 border border-slate-800/80 hover:border-sky-500/40 rounded-3xl overflow-hidden flex flex-col justify-between group cursor-pointer shadow-xl backdrop-blur-xl transition-all duration-300"
                >
                  <div>
                    {/* Thumbnail Image */}
                    <div className="aspect-video w-full overflow-hidden relative">
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-sky-950/80 text-sky-300 border border-sky-400/30 backdrop-blur-md">
                          {post.category}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-3">
                      <div className="flex items-center gap-3 text-[11px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-sky-400" />
                          {post.publishedAt}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-sky-400" />
                          {post.readingTime}
                        </span>
                      </div>

                      <h4 className="text-lg font-bold text-white group-hover:text-sky-300 transition-colors line-clamp-2 leading-snug">
                        {post.title}
                      </h4>

                      <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                        {post.excerpt}
                      </p>

                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {post.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="text-[10px] font-medium text-slate-400 bg-slate-900/90 px-2 py-0.5 rounded-md border border-slate-800">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer Author & CTA */}
                  <div className="p-6 pt-0 mt-4 flex items-center justify-between border-t border-slate-800/60">
                    <div className="flex items-center gap-2">
                      <img
                        src={post.author.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                        alt={post.author.name}
                        className="w-7 h-7 rounded-full object-cover border border-sky-500/30"
                      />
                      <span className="text-xs font-semibold text-slate-300">{post.author.name || 'Netronomic Web'}</span>
                    </div>

                    <span className="text-xs font-bold text-sky-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      Read More <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mb-20">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="p-2.5 rounded-xl bg-[#0B1120] border border-slate-800 disabled:opacity-40 disabled:cursor-not-allowed hover:border-sky-500/40 text-white transition-all cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-10 h-10 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    currentPage === pageNum
                      ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30 border border-sky-400'
                      : 'bg-[#0B1120] text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className="p-2.5 rounded-xl bg-[#0B1120] border border-slate-800 disabled:opacity-40 disabled:cursor-not-allowed hover:border-sky-500/40 text-white transition-all cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}



      </div>
    </div>
  );
};
