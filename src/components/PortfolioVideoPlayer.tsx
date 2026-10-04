import React from 'react';
import { parseVideoUrl } from '../utils/videoHelper';
import { Film } from 'lucide-react';

interface PortfolioVideoPlayerProps {
  url?: string;
  embedCode?: string;
  poster?: string;
  title?: string;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
}

export const PortfolioVideoPlayer: React.FC<PortfolioVideoPlayerProps> = ({
  url = '',
  embedCode = '',
  poster = '',
  title = 'Portfolio Project Video',
  className = '',
  autoPlay = false,
  loop = true,
  muted = true,
  controls = true
}) => {
  // If custom embed code is provided
  if (embedCode && embedCode.trim().length > 0) {
    return (
      <div
        className={`w-full aspect-video rounded-2xl overflow-hidden bg-black flex items-center justify-center ${className}`}
        dangerouslySetInnerHTML={{ __html: embedCode }}
      />
    );
  }

  if (!url || !url.trim()) {
    return null;
  }

  const parsed = parseVideoUrl(url);

  if (parsed.type === 'embed') {
    return (
      <div
        className={`w-full aspect-video rounded-2xl overflow-hidden bg-black flex items-center justify-center ${className}`}
        dangerouslySetInnerHTML={{ __html: parsed.originalUrl }}
      />
    );
  }

  if (parsed.type === 'youtube' && parsed.embedUrl) {
    return (
      <div className={`relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-xl ${className}`}>
        <iframe
          src={`${parsed.embedUrl}${autoPlay ? '&autoplay=1&mute=1' : ''}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full border-0"
        />
      </div>
    );
  }

  if (parsed.type === 'vimeo' && parsed.embedUrl) {
    return (
      <div className={`relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-xl ${className}`}>
        <iframe
          src={`${parsed.embedUrl}${autoPlay ? '&autoplay=1&muted=1' : ''}`}
          title={title}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="w-full h-full border-0"
        />
      </div>
    );
  }

  // Direct MP4 / WebM video
  if (parsed.type === 'mp4' || url.startsWith('http') || url.startsWith('/')) {
    return (
      <div className={`relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-950 shadow-xl ${className}`}>
        <video
          src={url}
          poster={poster || parsed.thumbnailUrl}
          controls={controls}
          autoPlay={autoPlay}
          loop={loop}
          muted={muted}
          playsInline
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className={`w-full aspect-video rounded-2xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center text-slate-400 p-6 ${className}`}>
      <Film className="w-10 h-10 text-sky-400 mb-2" />
      <p className="text-xs font-bold text-white">Video format not recognized</p>
      <p className="text-[11px] text-slate-500 mt-1 truncate max-w-xs">{url}</p>
    </div>
  );
};
