export interface MediaItem {
  id: string;
  title: string;
  url: string;
  type: 'image' | 'logo' | 'banner' | 'blog' | 'avatar' | 'icon' | 'other';
  sizeFormatted: string;
  dimensions?: string;
  uploadedAt: string;
  altText?: string;
  fileSize?: number;
}

export const DEFAULT_MEDIA_ITEMS: MediaItem[] = [
  {
    id: 'media-favicon-1',
    title: 'Netronomic Official Brand Favicon (SVG)',
    url: '/favicon.svg',
    type: 'icon',
    sizeFormatted: '1 KB',
    dimensions: '512 x 512 px',
    uploadedAt: '2026-08-01',
    altText: 'Netronomic Official Brand Favicon Vector'
  },
  {
    id: 'media-1',
    title: 'Web Design & Engineering Showcase',
    url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    type: 'blog',
    sizeFormatted: '420 KB',
    dimensions: '1200 x 800 px',
    uploadedAt: '2026-08-01',
    altText: 'Web Design Analytics Dashboard on Laptop'
  },
  {
    id: 'media-2',
    title: 'SEO Analytics & Ranking Audit',
    url: 'https://images.unsplash.com/photo-1557838923-2985c318be48?auto=format&fit=crop&w=1200&q=80',
    type: 'blog',
    sizeFormatted: '380 KB',
    dimensions: '1200 x 800 px',
    uploadedAt: '2026-08-01',
    altText: 'SEO Growth Metrics and Charting'
  },
  {
    id: 'media-3',
    title: 'Video Production & Reel Studio',
    url: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80',
    type: 'blog',
    sizeFormatted: '510 KB',
    dimensions: '1200 x 800 px',
    uploadedAt: '2026-08-02',
    altText: 'Professional Video Editing Suite'
  },
  {
    id: 'media-4',
    title: 'Brand Identity & Guidelines',
    url: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1200&q=80',
    type: 'banner',
    sizeFormatted: '490 KB',
    dimensions: '1200 x 800 px',
    uploadedAt: '2026-08-02',
    altText: 'Color Swatches and Modern Logo Mockup'
  },
  {
    id: 'media-5',
    title: 'Web UX Engineering',
    url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80',
    type: 'blog',
    sizeFormatted: '440 KB',
    dimensions: '1200 x 800 px',
    uploadedAt: '2026-08-03',
    altText: 'iOS and Android Smartphone Wireframe UI'
  },
  {
    id: 'media-6',
    title: 'Netronomic Agency Glowing Orb Logo',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    type: 'logo',
    sizeFormatted: '180 KB',
    dimensions: '600 x 600 px',
    uploadedAt: '2026-08-01',
    altText: 'Abstract Glowing Cyan Orb Emblem'
  },
  {
    id: 'media-7',
    title: 'Editorial Team Author Avatar 1',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    type: 'avatar',
    sizeFormatted: '95 KB',
    dimensions: '300 x 300 px',
    uploadedAt: '2026-08-01',
    altText: 'Content Strategist Headshot'
  },
  {
    id: 'media-8',
    title: 'Lead Architect Author Avatar 2',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    type: 'avatar',
    sizeFormatted: '110 KB',
    dimensions: '300 x 300 px',
    uploadedAt: '2026-08-01',
    altText: 'Engineering Lead Headshot'
  },
  {
    id: 'media-9',
    title: 'OpenGraph Social Share Banner',
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    type: 'banner',
    sizeFormatted: '530 KB',
    dimensions: '1200 x 630 px',
    uploadedAt: '2026-08-02',
    altText: 'SaaS Analytics Dashboard Hero Graphic'
  }
];

export const MEDIA_STORAGE_KEY = 'netronomic_media_library_v2';

export function getStoredMediaLibrary(): MediaItem[] {
  try {
    const raw = localStorage.getItem(MEDIA_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(DEFAULT_MEDIA_ITEMS));
      return DEFAULT_MEDIA_ITEMS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return DEFAULT_MEDIA_ITEMS;
    }
    return parsed;
  } catch (err) {
    console.error('Failed to load media library:', err);
    return DEFAULT_MEDIA_ITEMS;
  }
}

export function saveMediaLibrary(items: MediaItem[]): void {
  try {
    localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to save media library:', err);
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function sanitizeMediaTitle(rawName: string): string {
  let name = rawName.replace(/\.[^/.]+$/, '');
  name = name.replace(/^(chatgpt[\s_-]*image|gemini[\s_-]*generated|screenshot[\s_-]*|img[\s_-]*|dsc[\s_-]*|whatsapp[\s_-]*image[\s_-]*)/gi, '');
  name = name.replace(/[\d]{4}[-_][\d]{2}[-_][\d]{2}/g, '');
  name = name.replace(/[-_]+/g, ' ').trim();
  if (!name || name.length < 2) {
    return 'Netronomic Brand Graphic';
  }
  return name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

export function processFileToMediaItem(file: File, category: MediaItem['type'] = 'image'): Promise<MediaItem> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = (e.target?.result as string) || '';
      const cleanTitle = sanitizeMediaTitle(file.name);
      const isVectorOrIcon =
        file.type.includes('svg') ||
        file.type.includes('icon') ||
        file.name.toLowerCase().endsWith('.ico') ||
        file.name.toLowerCase().endsWith('.svg');

      // For icons, SVGs or small assets, preserve exact data URL without canvas distortion
      if (isVectorOrIcon || file.size < 64 * 1024) {
        return resolve({
          id: `media-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          title: cleanTitle,
          url: dataUrl,
          type: category,
          sizeFormatted: formatFileSize(file.size),
          fileSize: file.size,
          dimensions: isVectorOrIcon ? 'Vector / Icon' : 'Original',
          uploadedAt: new Date().toISOString().split('T')[0],
          altText: cleanTitle
        });
      }

      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = category === 'logo' || category === 'icon' || category === 'avatar' ? 400 : 1200;
          const MAX_HEIGHT = category === 'logo' || category === 'icon' || category === 'avatar' ? 400 : 1200;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = Math.max(1, Math.round(width));
          canvas.height = Math.max(1, Math.round(height));
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            const format = file.type === 'image/png' ? 'image/png' : 'image/webp';
            const compressedDataUrl = canvas.toDataURL(format, 0.85);

            return resolve({
              id: `media-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
              title: cleanTitle,
              url: compressedDataUrl,
              type: category,
              sizeFormatted: formatFileSize(Math.round(compressedDataUrl.length * 0.75)),
              fileSize: Math.round(compressedDataUrl.length * 0.75),
              dimensions: `${canvas.width} x ${canvas.height} px`,
              uploadedAt: new Date().toISOString().split('T')[0],
              altText: cleanTitle
            });
          }
        } catch (err) {
          console.warn('Canvas processing error, falling back to direct DataURL', err);
        }

        return resolve({
          id: `media-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          title: cleanTitle,
          url: dataUrl,
          type: category,
          sizeFormatted: formatFileSize(file.size),
          fileSize: file.size,
          dimensions: `${img.width} x ${img.height} px`,
          uploadedAt: new Date().toISOString().split('T')[0],
          altText: cleanTitle
        });
      };

      img.onerror = () => {
        // Fallback to dataUrl even if Image onload fails
        resolve({
          id: `media-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          title: cleanTitle,
          url: dataUrl,
          type: category,
          sizeFormatted: formatFileSize(file.size),
          fileSize: file.size,
          dimensions: 'Original',
          uploadedAt: new Date().toISOString().split('T')[0],
          altText: cleanTitle
        });
      };

      img.src = dataUrl;
    };

    reader.onerror = () => {
      resolve({
        id: `media-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        title: file.name,
        url: '',
        type: category,
        sizeFormatted: '0 B',
        uploadedAt: new Date().toISOString().split('T')[0]
      });
    };

    reader.readAsDataURL(file);
  });
}
