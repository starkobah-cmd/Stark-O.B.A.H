export interface ServiceItem {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  iconName: string;
  category: 'development' | 'design' | 'marketing' | 'editing';
  features: string[];
  startingPrice: string;
  deliveryTime: string;
  badge?: string;
}

export interface ProcessStep {
  number: string;
  title: string;
  desc: string;
  details: string[];
  icon: string;
}

export interface WhyChooseItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  highlight: string;
}

export type PortfolioCategory = string;

export interface PortfolioVideo {
  id?: string;
  title: string;
  url: string;
  type?: 'youtube' | 'vimeo' | 'mp4' | 'embed';
  embedCode?: string;
  thumbnail?: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  slug?: string;
  category: PortfolioCategory;
  categoryLabel?: string;
  image: string;
  description: string;
  detailedDescription?: string;
  content?: string;
  images?: string[];
  tags: string[];
  technologies?: string[];
  client?: string;
  stats?: string;
  link?: string;
  videoUrl?: string;
  videoType?: 'youtube' | 'vimeo' | 'mp4' | 'embed';
  videoEmbedCode?: string;
  videos?: PortfolioVideo[];
  date?: string;
  featured?: boolean;
  status?: PostStatus;
  seoTitle?: string;
  metaDescription?: string;
  focusKeyword?: string;
  secondaryKeywords?: string;
  canonicalUrl?: string;
  customSchema?: string;
  seoScore?: number;
  readingTime?: string;
  author?: {
    name: string;
    avatar: string;
    role?: string;
  };
}

export interface PricingPlan {
  id: string;
  name: string;
  badge?: string;
  priceMonthly: number;
  priceOneTime: number;
  description: string;
  features: string[];
  notIncluded?: string[];
  popular?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
  comment: string;
  serviceUsed: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  service: string;
  budget: string;
  message: string;
}

export interface BlogComment {
  id: string;
  author: string;
  email?: string;
  avatar?: string;
  date: string;
  content: string;
}

export type PostStatus = 'published' | 'draft' | 'scheduled' | string;

export type BlogBlockType =
  | 'heading'
  | 'paragraph'
  | 'introduction'
  | 'image'
  | 'table'
  | 'quote'
  | 'bullet-list'
  | 'numbered-list'
  | 'faq'
  | 'custom-html'
  | 'custom-code'
  | 'divider';

export interface BlogBlock {
  id?: string;
  type?: BlogBlockType | string;
  data?: {
    text?: string;
    level?: number;
    imageUrl?: string;
    altText?: string;
    caption?: string;
    link?: string;
    alignment?: 'left' | 'center' | 'right';
    rows?: string[][];
    columns?: string[];
    questions?: { question: string; answer: string }[];
    items?: string[];
    html?: string;
    code?: string;
    language?: string;
  };
  [key: string]: any;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  blocks?: BlogBlock[];
  featuredImage?: string;
  featuredImageAlt?: string;
  featuredImageCaption?: string;
  author?: any;
  category?: string;
  categories?: string[];
  tags?: string[];
  publishDate?: string;
  publishedAt?: string;
  updatedAt?: string;
  readingTime?: any;
  isFeatured?: boolean;
  status: PostStatus;
  scheduledDate?: string;
  focusKeyword?: string;
  focusKeywords?: string[];
  secondaryKeywords?: string;
  seoTitle?: string;
  seoDescription?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  robotsIndex?: boolean;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  customSchema?: string;
  seoScore?: number;
  allowComments?: boolean;
  comments?: BlogComment[];
  views?: number;
  schemas?: any[];
  [key: string]: any;
}

export type BlogViewMode =
  | 'main'
  | 'blog-list'
  | 'single-blog'
  | 'blog-admin'
  | 'site-admin'
  | 'portfolio-list'
  | 'portfolio-detail';

export interface MediaAsset {
  id: string;
  name: string;
  url: string;
  size?: number | string;
  dimensions?: string;
  altText?: string;
  createdAt?: string;
  type?: string;
  folder?: string;
  mimeType?: string;
  caption?: string;
  [key: string]: any;
}

export interface RedirectRule {
  id: string;
  source?: string;
  destination?: string;
  fromPath?: string;
  toPath?: string;
  statusCode?: number;
  hits?: number;
  active?: boolean;
  [key: string]: any;
}

export interface ActivityLog {
  id?: string;
  user: string;
  role: string;
  action: string;
  timestamp: string;
  details?: string;
  [key: string]: any;
}

export interface AnalyticsSummary {
  totalViews: number;
  monthlyViews: number;
  uniqueVisitors?: number;
  pageViews?: number;
  visitors?: number;
  leadsCount?: number;
  averageSeoScore?: number;
  bounceRate?: string;
  topPages?: { path: string; views: number }[];
  trafficSources?: { source: string; percentage: number }[];
  dailyViews?: { date: string; views: number }[];
  viewsHistory?: any[];
  [key: string]: any;
}

export interface SiteSettings {
  siteTitle?: string;
  siteDescription?: string;
  customHeadTags?: string;
  googleAnalyticsId?: string;
  metaPixelId?: string;
  adsenseId?: string;
  [key: string]: any;
}

export interface CustomPage {
  id: string;
  slug: string;
  title: string;
  content: string;
  status: "published" | "draft" | string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  isSystem?: boolean;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface ContactInfo {
  phone: string;
  email: string;
  address?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  whatsapp?: string;
  [key: string]: any;
}
