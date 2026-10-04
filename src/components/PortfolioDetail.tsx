import React, { useEffect, useState } from 'react';
import { ArrowLeft, ExternalLink, Tag, Play, Film, Calendar, User, CheckCircle2, Star, Sparkles } from 'lucide-react';
import { PortfolioItem, PortfolioVideo } from '../types';
import { PortfolioCard } from './PortfolioCard';
import { PortfolioVideoPlayer } from './PortfolioVideoPlayer';

interface PortfolioDetailProps {
  item: PortfolioItem;
  allItems: PortfolioItem[];
  onBack: () => void;
  onSelectPortfolio: (item: PortfolioItem) => void;
}

export const PortfolioDetail: React.FC<PortfolioDetailProps> = ({
  item,
  allItems = [],
  onBack,
  onSelectPortfolio
}) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [item]);

  const [activeVideo, setActiveVideo] = useState<PortfolioVideo | null>(null);

  const relatedItems = allItems
    .filter((p) => p.category === item.category && p.id !== item.id)
    .slice(0, 3);

  const hasPrimaryVideo = Boolean(item.videoUrl || item.videoEmbedCode);
  const extraVideos = item.videos || [];

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-32 font-sans selection:bg-sky-500 selection:text-white">
      {/* Top Breadcrumb & Heading */}
      <div className="max-w-5xl mx-auto px-6 lg:px-8 mb-8">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-slate-500 hover:text-sky-600 font-bold transition-colors mb-6 cursor-pointer text-xs sm:text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Portfolio</span>
        </button>

        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="px-3.5 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-black uppercase tracking-wider">
            {item.categoryLabel || item.category}
          </span>
          {item.featured && (
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-black flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>Featured Project</span>
            </span>
          )}
          {item.date && (
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {item.date}
            </span>
          )}
          {item.readingTime && (
            <span className="text-xs font-semibold text-slate-400">
              • {item.readingTime}
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
          {item.title}
        </h1>

        <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed max-w-3xl">
          {item.description}
        </p>
      </div>

      {/* Main Hero Showcase: Video Player or Cover Image */}
      <div className="max-w-5xl mx-auto px-6 lg:px-8 mb-16">
        <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-slate-900">
          {activeVideo ? (
            <div className="space-y-2 p-2">
              <PortfolioVideoPlayer
                url={activeVideo.url}
                embedCode={activeVideo.embedCode}
                title={activeVideo.title}
                autoPlay={true}
                controls={true}
              />
              <div className="px-4 py-2 flex items-center justify-between text-white text-xs">
                <span className="font-bold flex items-center gap-2">
                  <Play className="w-3.5 h-3.5 text-sky-400" />
                  Playing: {activeVideo.title}
                </span>
                <button
                  onClick={() => setActiveVideo(null)}
                  className="text-slate-400 hover:text-white underline cursor-pointer"
                >
                  Switch to Primary View
                </button>
              </div>
            </div>
          ) : hasPrimaryVideo ? (
            <PortfolioVideoPlayer
              url={item.videoUrl}
              embedCode={item.videoEmbedCode}
              poster={item.image}
              title={item.title}
              autoPlay={false}
              controls={true}
            />
          ) : (
            <img
              src={item.image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200'}
              alt={item.title}
              className="w-full h-auto aspect-video object-cover"
            />
          )}
        </div>
      </div>

      {/* Multiple Videos Walkthrough Section */}
      {extraVideos.length > 0 && (
        <div className="max-w-5xl mx-auto px-6 lg:px-8 mb-16">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <Film className="w-5 h-5 text-sky-500" />
                <span>Project Walkthrough Videos & Demos ({extraVideos.length})</span>
              </h3>
              <span className="text-xs font-semibold text-slate-400">Click to play in hero viewer</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {extraVideos.map((vid, idx) => (
                <div
                  key={vid.id || idx}
                  onClick={() => {
                    setActiveVideo(vid);
                    window.scrollTo({ top: 380, behavior: 'smooth' });
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer group ${
                    activeVideo?.url === vid.url
                      ? 'border-sky-500 bg-sky-50/50 shadow-md'
                      : 'border-slate-200 hover:border-sky-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="aspect-video rounded-xl bg-slate-900 flex items-center justify-center relative overflow-hidden mb-3">
                    {vid.thumbnail ? (
                      <img src={vid.thumbnail} alt={vid.title} className="w-full h-full object-cover" />
                    ) : (
                      <Film className="w-8 h-8 text-slate-600" />
                    )}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <div className="w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-lg">
                        <Play className="w-4 h-4 fill-white ml-0.5" />
                      </div>
                    </div>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-sky-600 transition-colors line-clamp-1">
                    {vid.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1 uppercase font-semibold">
                    {vid.type || 'Video Demo'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content Layout (Case Study Content & Sidebar) */}
      <div className="max-w-5xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
        
        {/* Left 2 Cols: Gutenberg Case Study Content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-4">
              <Sparkles className="w-5 h-5 text-sky-500" />
              <span>Project Case Study</span>
            </h2>

            {/* Gutenberg HTML Content Renderer */}
            {item.content || item.detailedDescription ? (
              <div
                className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-6
                  [&_h2]:text-2xl [&_h2]:font-extrabold [&_h2]:text-slate-900 [&_h2]:mt-8 [&_h2]:mb-4
                  [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-slate-900 [&_h3]:mt-6 [&_h3]:mb-3
                  [&_p]:text-slate-600 [&_p]:leading-relaxed [&_p]:text-base
                  [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ul]:text-slate-600
                  [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2 [&_ol]:text-slate-600
                  [&_blockquote]:border-l-4 [&_blockquote]:border-sky-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:bg-slate-50 [&_blockquote]:p-3 [&_blockquote]:rounded-r-xl
                  [&_code]:px-2 [&_code]:py-1 [&_code]:bg-slate-100 [&_code]:rounded [&_code]:text-xs [&_code]:font-mono [&_code]:text-sky-600
                  [&_pre]:bg-slate-900 [&_pre]:text-slate-100 [&_pre]:p-4 [&_pre]:rounded-2xl [&_pre]:overflow-x-auto
                  [&_table]:w-full [&_table]:border-collapse [&_table]:my-6
                  [&_th]:bg-slate-100 [&_th]:p-3 [&_th]:border [&_th]:border-slate-300 [&_th]:text-slate-900 [&_th]:font-bold [&_th]:text-left
                  [&_td]:p-3 [&_td]:border [&_td]:border-slate-200 [&_td]:text-slate-700"
                dangerouslySetInnerHTML={{ __html: item.content || item.detailedDescription || '' }}
              />
            ) : (
              <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-4">
                <p className="text-lg font-medium">{item.description}</p>
              </div>
            )}

            {/* Gallery Images if available */}
            {item.images && item.images.length > 0 && (
              <div className="mt-10 pt-8 border-t border-slate-100 space-y-6">
                <h3 className="text-xl font-extrabold text-slate-900">Project Screenshots & Gallery</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {item.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Project Screenshot ${idx + 1}`}
                      className="rounded-2xl border border-slate-200 shadow-sm w-full h-52 object-cover hover:scale-105 transition-transform"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Specs & Key Details */}
        <div className="space-y-6">
          {/* Project Highlights Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3">
              Project Information
            </h3>

            {item.client && (
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Client</h4>
                <p className="text-slate-900 font-bold text-sm">{item.client}</p>
              </div>
            )}

            {item.stats && (
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Key Results</h4>
                <p className="text-emerald-600 font-extrabold text-lg flex items-center gap-1.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <span>{item.stats}</span>
                </p>
              </div>
            )}

            {item.date && (
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Timeline</h4>
                <p className="text-slate-900 font-semibold text-sm">{item.date}</p>
              </div>
            )}

            {item.link && (
              <div className="pt-2 border-t border-slate-100">
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-sky-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Visit Live Project</span>
                </a>
              </div>
            )}
          </div>

          {/* Technologies & Skills Chips */}
          {((item.technologies && item.technologies.length > 0) || (item.tags && item.tags.length > 0)) && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h4 className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
                <Tag className="w-4 h-4 text-sky-500" />
                <span>Technologies & Skills</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {(item.technologies || item.tags || []).map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-sky-50 hover:text-sky-700 transition-colors rounded-xl text-xs font-bold"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Projects */}
      {relatedItems.length > 0 && (
        <div className="max-w-6xl mx-auto px-6 lg:px-8 border-t border-slate-200 pt-16">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-8">
            More Projects in {item.categoryLabel || item.category}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedItems.map((related) => (
              <PortfolioCard key={related.id} item={related} onClick={onSelectPortfolio} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
