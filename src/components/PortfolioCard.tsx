import React from 'react';
import { Eye, Play, Film, Star } from 'lucide-react';
import { PortfolioItem } from '../types';
import { parseVideoUrl } from '../utils/videoHelper';

interface PortfolioCardProps {
  item: PortfolioItem;
  onClick: (item: PortfolioItem) => void;
}

export const PortfolioCard: React.FC<PortfolioCardProps> = ({ item, onClick }) => {
  const parsedVideo = item.videoUrl ? parseVideoUrl(item.videoUrl) : null;
  const hasVideo = Boolean(item.videoUrl || (item.videos && item.videos.length > 0));
  const coverImage = item.image || (parsedVideo?.thumbnailUrl) || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800';

  return (
    <div
      onClick={() => onClick(item)}
      className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-sky-300 transition-all group flex flex-col justify-between cursor-pointer relative"
    >
      <div>
        {/* Image/Video Container with hover overlay */}
        <div className="relative h-56 overflow-hidden bg-slate-900">
          {item.videoUrl && parsedVideo?.type === 'mp4' ? (
            <video
              src={item.videoUrl}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
            />
          ) : (
            <img
              src={coverImage}
              alt={item.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95 group-hover:opacity-100"
            />
          )}

          {/* Badges on Top */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
            {hasVideo && (
              <span className="px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-sky-400/40 text-sky-400 text-[10px] font-black tracking-wide flex items-center gap-1 shadow-md">
                <Play className="w-2.5 h-2.5 fill-sky-400" />
                <span>VIDEO CASE STUDY</span>
              </span>
            )}
            {item.featured && (
              <span className="px-2.5 py-1 rounded-full bg-amber-500/90 text-slate-950 text-[10px] font-black tracking-wide flex items-center gap-1 shadow-md">
                <Star className="w-2.5 h-2.5 fill-slate-950" />
                <span>FEATURED</span>
              </span>
            )}
          </div>

          {/* Floating Play Button if it has video */}
          {hasVideo && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:scale-110 transition-transform duration-300">
              <div className="w-12 h-12 rounded-full bg-sky-500/90 text-white shadow-xl shadow-sky-500/40 flex items-center justify-center backdrop-blur-sm group-hover:bg-sky-400 transition-colors">
                <Play className="w-5 h-5 fill-white ml-0.5" />
              </div>
            </div>
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-4">
            <div className="w-full flex items-center justify-between text-white text-xs font-bold transform translate-y-2 group-hover:translate-y-0 transition-transform">
              <span className="flex items-center gap-1.5 text-sky-300">
                <Eye className="w-4 h-4" />
                <span>Explore Full Case Study</span>
              </span>
              {item.stats && (
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black">
                  {item.stats}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-sky-600 font-bold uppercase tracking-wider text-[11px]">
              {item.categoryLabel || item.category}
            </span>
            {item.date && (
              <span className="text-slate-400 font-medium">
                {item.date}
              </span>
            )}
          </div>

          <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-sky-600 transition-colors line-clamp-1">
            {item.title}
          </h3>

          <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
            {item.description}
          </p>

          {/* Tags / Tech Chips */}
          {item.technologies && item.technologies.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2">
              {item.technologies.slice(0, 3).map((tech, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-semibold"
                >
                  {tech}
                </span>
              ))}
              {item.technologies.length > 3 && (
                <span className="text-[10px] text-slate-400 font-semibold self-center">
                  +{item.technologies.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
