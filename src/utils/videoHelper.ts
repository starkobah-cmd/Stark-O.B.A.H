/**
 * Video Helper Utility for Portfolio & Media
 * Supports YouTube, Vimeo, Direct MP4/WebM, and Custom Embed Iframe
 */

export interface ParsedVideo {
  type: 'youtube' | 'vimeo' | 'mp4' | 'embed' | 'unknown';
  embedUrl?: string;
  originalUrl: string;
  videoId?: string;
  thumbnailUrl?: string;
}

export function parseVideoUrl(url: string = ''): ParsedVideo {
  const trimmed = url.trim();
  if (!trimmed) {
    return { type: 'unknown', originalUrl: '' };
  }

  // Check for HTML embed code (iframe)
  if (trimmed.includes('<iframe') || trimmed.includes('<video')) {
    return { type: 'embed', originalUrl: trimmed };
  }

  // YouTube matchers:
  // - https://www.youtube.com/watch?v=VIDEO_ID
  // - https://youtu.be/VIDEO_ID
  // - https://www.youtube.com/embed/VIDEO_ID
  // - https://www.youtube.com/shorts/VIDEO_ID
  const ytMatch = trimmed.match(
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i
  );
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return {
      type: 'youtube',
      videoId,
      originalUrl: trimmed,
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1`,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    };
  }

  // Vimeo matcher:
  // - https://vimeo.com/VIDEO_ID
  // - https://player.vimeo.com/video/VIDEO_ID
  const vimeoMatch = trimmed.match(/(?:https?:\/\/)?(?:www\.)?(?:vimeo\.com\/|player\.vimeo\.com\/video\/)([0-9]+)/i);
  if (vimeoMatch && vimeoMatch[1]) {
    const videoId = vimeoMatch[1];
    return {
      type: 'vimeo',
      videoId,
      originalUrl: trimmed,
      embedUrl: `https://player.vimeo.com/video/${videoId}?title=0&byline=0&portrait=0`
    };
  }

  // Direct MP4 / WebM / OGG video file
  if (/\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(trimmed)) {
    return {
      type: 'mp4',
      originalUrl: trimmed,
      embedUrl: trimmed
    };
  }

  // Default fallback
  return {
    type: 'unknown',
    originalUrl: trimmed
  };
}
