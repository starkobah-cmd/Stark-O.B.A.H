import { ServiceItem, PortfolioItem, PricingPlan, Testimonial, FAQItem, ProcessStep, WhyChooseItem } from '../types';
import { agencyInfo, servicesData, portfolioData, pricingData, testimonialsData, faqData, whyChooseData, processSteps, aboutUsData } from './agencyData';

export interface SiteLogoConfig {
  brandName: string;
  brandDotColor: string;
  showDot: boolean;
  taglineText: string;
  showTagline: boolean;
  customLogoUrl: string; // Header Logo URL
  footerLogoUrl?: string; // Footer Logo URL
  faviconUrl?: string; // Browser Favicon URL
  glowStyle: 'subtle' | 'medium' | 'vibrant' | 'none';
  iconVariant: 'network-orb' | 'custom-image' | 'none'; // Header icon variant
  footerIconVariant?: 'network-orb' | 'custom-image' | 'none'; // Footer icon variant
  logoSize?: number;
  gap?: number;
  showCustomButton?: boolean;
  customButtonText?: string;
  customButtonUrl?: string;
  customButtonColor?: string;
  customButtonShine?: boolean;
  customButtonBorder?: boolean;
  headerLogoAlign?: 'left' | 'center' | 'right';
  footerLogoAlign?: 'left' | 'center' | 'right';
}

export interface SiteHeroConfig {
  titlePrefix: string;
  typingPhrases: string[];
  subtitle: string;
  primaryCtaText: string;
  secondaryCtaText: string;
  showAnnouncementBadge: boolean;
  announcementText: string;
}

export interface SiteAgencyInfo {
  name: string;
  tagline: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  address: string;
  hours: string;
  social: {
    facebook: string;
    instagram: string;
    twitter: string;
    linkedin: string;
    youtube: string;
    github: string;
    hideAll?: boolean;
  };
  stats: Array<{ label: string; value: string }>;
}

export interface PageSectionConfig {
  id: string;
  name: string;
  title: string;
  subtitle: string;
  badge?: string;
  ctaText?: string;
  ctaUrl?: string;
  visible: boolean;
  order: number;
}

export interface SitePageConfig {
  id: string;
  title: string;
  slug: string;
  status: 'published' | 'draft';
  metaTitle: string;
  metaDescription: string;
  focusKeyword: string;
  secondaryKeywords: string;
  ogImage?: string;
  customSchema?: string;
  seoScore?: number;
  noIndex: boolean;
  sections: PageSectionConfig[];
}

export interface SiteSeoConfig {
  canonicalUrl: string;
  googleSiteVerification?: string;
  defaultOgTitle: string;
  defaultOgDescription: string;
  defaultOgImage: string;
  twitterCardType: 'summary_large_image' | 'summary';
  globalNoIndex: boolean;
  globalNoFollow: boolean;
  robotsTxt: string;
  headerScripts: string;
  footerScripts: string;
  allowIndexing?: boolean;
  sitemapXml?: string;
  wordpressUrl?: string;
}

export interface InquiryItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  budget: string;
  message: string;
  createdAt: string;
  status: 'new' | 'contacted' | 'closed';
}

export interface SiteConfig {
  logo: SiteLogoConfig;
  hero: SiteHeroConfig;
  agency: SiteAgencyInfo;
  services: ServiceItem[];
  portfolio: PortfolioItem[];
  pricing: PricingPlan[];
  testimonials: Testimonial[];
  faqs: FAQItem[];
  whyChooseUs: WhyChooseItem[];
  processSteps: ProcessStep[];
  aboutUs: typeof aboutUsData;
  seo: SiteSeoConfig;
  pages: SitePageConfig[];
  inquiries: InquiryItem[];
  primaryColorHex?: string;
  blogPosts?: any[];
  layout?: any;
}

export const DEFAULT_PAGE_SECTIONS: PageSectionConfig[] = [
  { id: 'sec-hero', name: 'Hero Banner', title: 'Accelerate Your Brand with Digital Growth', subtitle: 'Full-stack engineering & branding', badge: '1.', visible: true, order: 1, ctaText: 'Get Started Today', ctaUrl: '#contact' },
  { id: 'sec-about', name: 'About Agency', title: 'Engineering Excellence & Creative Power', subtitle: 'Your trusted partner in digital transformation', badge: '2.', visible: true, order: 2 },
  { id: 'sec-services', name: 'Services Grid', title: 'High-Impact Digital Solutions', subtitle: 'Crafted for scalable business performance', badge: '3.', visible: true, order: 3, ctaText: 'View All Services', ctaUrl: '#services' },
  { id: 'sec-why', name: 'Why Choose Us', title: 'Why Leaders Choose Netronomic', subtitle: 'Data-driven results and bulletproof quality', badge: '4.', visible: true, order: 4 },
  { id: 'sec-process', name: 'Our Work Process', title: '6-Step Strategic Workflow', subtitle: 'From strategy to seamless deployment', badge: '5.', visible: true, order: 5 },
  { id: 'sec-portfolio', name: 'Featured Portfolio', title: 'Our Latest Digital Masterpieces', subtitle: 'Case studies across web, mobile, and video', badge: '6.', visible: true, order: 6 },
  { id: 'sec-pricing', name: 'Transparent Pricing', title: 'Flexible Plans for Every Stage', subtitle: 'No hidden fees, standard commercial rights', badge: '7.', visible: true, order: 7 },
  { id: 'sec-testimonials', name: 'Client Testimonials', title: 'What Our Clients Say', subtitle: 'Real reviews from growing brands', badge: '8.', visible: true, order: 8 },
  { id: 'sec-faq', name: 'Frequently Asked Questions', title: 'Got Questions? We Have Answers', subtitle: 'Everything you need to know before getting started', badge: '9.', visible: true, order: 9 },
  { id: 'sec-contact', name: 'Contact Us', title: "Let's Build Something Extraordinary", subtitle: 'Interactive project estimator & fast response', badge: '10.', visible: true, order: 10, ctaText: 'Submit Inquiry', ctaUrl: '#contact' },
];

export const DEFAULT_SITE_PAGES: SitePageConfig[] = [
  {
    id: 'page-home',
    title: 'Home Page',
    slug: '/',
    status: 'published',
    metaTitle: 'Netronomic | High-Converting Web Development & SEO Agency (2026)',
    metaDescription: 'Netronomic is a full-service digital and web development agency engineering ultra-fast websites, mobile apps, video reels, and high-impact SEO rankings.',
    focusKeyword: 'Web Development & SEO Agency',
    secondaryKeywords: 'Netronomic, web development agency, SEO agency, website design, mobile apps, video reels, high-converting digital solutions',
    ogImage: '/og-image.png',
    customSchema: '{\n  "@context": "https://schema.org",\n  "@type": "Organization",\n  "name": "Netronomic",\n  "url": "https://netronomic.com",\n  "logo": "https://netronomic.com/og-image.png",\n  "contactPoint": {\n    "@type": "ContactPoint",\n    "telephone": "+92-302-0487103",\n    "contactType": "customer service"\n  }\n}',
    noIndex: false,
    sections: DEFAULT_PAGE_SECTIONS,
  },
  {
    id: 'page-about',
    title: 'About Us',
    slug: '/about',
    status: 'published',
    metaTitle: 'About Netronomic Web Agency — Digital Excellence, Vision & Expertise',
    metaDescription: 'Discover Netronomic Web, a premier digital agency driven by expert software engineers, creative designers, and SEO specialists dedicated to accelerating your brand growth.',
    focusKeyword: 'digital agency about',
    secondaryKeywords: 'Netronomic Web team, software engineers, branding specialists, digital agency vision, web design experts',
    noIndex: false,
    sections: DEFAULT_PAGE_SECTIONS.filter(s => ['sec-about', 'sec-why', 'sec-testimonials'].includes(s.id)),
  },
  {
    id: 'page-services',
    title: 'Services Overview',
    slug: '/services',
    status: 'published',
    metaTitle: 'Digital Agency Services — Web Design, Mobile Apps, SEO & Branding',
    metaDescription: 'Explore our comprehensive suite of professional digital services including custom web design, mobile app development, logo creation, video editing, and advanced SEO backlink packages.',
    focusKeyword: 'digital agency services',
    secondaryKeywords: 'web design packages, SEO backlinks, mobile app development, custom logo branding, viral video editing, professional digital services',
    noIndex: false,
    sections: DEFAULT_PAGE_SECTIONS.filter(s => ['sec-services', 'sec-pricing', 'sec-process'].includes(s.id)),
  },
  {
    id: 'page-portfolio',
    title: 'Portfolio & Case Studies',
    slug: '/portfolio',
    status: 'published',
    metaTitle: 'Portfolio & Client Case Studies — Netronomic Web Agency',
    metaDescription: 'Browse our portfolio of high-performing web applications, mobile apps, brand identity designs, and viral video reels that deliver 300%+ conversion growth for clients.',
    focusKeyword: 'web design portfolio',
    secondaryKeywords: 'client case studies, web app showreel, brand logo showcase, viral video editing portfolio, digital agency results',
    noIndex: false,
    sections: DEFAULT_PAGE_SECTIONS.filter(s => ['sec-portfolio', 'sec-testimonials'].includes(s.id)),
  },
  {
    id: 'page-contact',
    title: 'Contact Us',
    slug: '/contact',
    status: 'published',
    metaTitle: 'Contact Netronomic Web Agency — Get a Free Quote & Consultation',
    metaDescription: 'Get in touch with Netronomic Web today for custom web design quotes, SEO project estimates, or immediate WhatsApp consultation with our digital experts.',
    focusKeyword: 'contact digital agency',
    secondaryKeywords: 'get web development quote, contact Netronomic Web, WhatsApp consultation, hire web designers, SEO project inquiry',
    noIndex: false,
    sections: DEFAULT_PAGE_SECTIONS.filter(s => ['sec-contact', 'sec-faq'].includes(s.id)),
  }
];

export const DEFAULT_INQUIRIES: InquiryItem[] = [
  {
    id: 'inq-1',
    name: 'Sarah Jenkins',
    email: 'sarah.j@apextech.io',
    phone: '+1 (555) 234-5678',
    service: 'Website Design & Development',
    budget: '$1,000 - $2,500',
    message: 'We are looking to rebuild our SaaS marketing portal with fast loading times and modern sky blue branding.',
    createdAt: '2026-08-03 14:22',
    status: 'new',
  },
  {
    id: 'inq-2',
    name: 'Marcus Vance',
    email: 'marcus@vancemedia.com',
    phone: '+1 (555) 876-5432',
    service: 'Full-Scale SEO & Backlink Campaign',
    budget: '$500 - $1,000',
    message: 'Need high DA profile backlinks and Google SEO optimization for our e-commerce platform.',
    createdAt: '2026-08-02 09:15',
    status: 'contacted',
  },
  {
    id: 'inq-3',
    name: 'Elena Rostova',
    email: 'elena@luxebrand.co',
    phone: '+1 (555) 345-6789',
    service: 'Logo & Brand Identity Suite',
    budget: '$250 - $500',
    message: 'Requesting brand guidelines, vector logos, and social media media templates.',
    createdAt: '2026-08-01 18:40',
    status: 'closed',
  }
];

export const DEFAULT_SITEMAP_XML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://netronomicweb.com/</loc>
    <lastmod>2026-09-15</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://netronomicweb.com/blog</loc>
    <lastmod>2026-09-15</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://netronomicweb.com/blog/10-key-strategies-high-converting-websites-2026</loc>
    <lastmod>2026-09-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://netronomicweb.com/blog/ultimate-guide-profile-social-backlinks-seo-dominance</loc>
    <lastmod>2026-09-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://netronomicweb.com/blog/designing-viral-reels-video-editing-hacks-brands</loc>
    <lastmod>2026-09-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://netronomicweb.com/blog/modern-brand-identity-custom-logos-vs-templates</loc>
    <lastmod>2026-09-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;

export const DEFAULT_SEO_CONFIG: SiteSeoConfig = {
  canonicalUrl: 'https://netronomic.com',
  googleSiteVerification: '1O58y68drsW0R2i79KCJdV_4JNK1IdlMxWOe80dxsq4',
  defaultOgTitle: 'Netronomic | High-Converting Web Development & SEO Agency (2026)',
  defaultOgDescription: 'Netronomic is a full-service digital and web development agency engineering ultra-fast websites, mobile apps, video reels, and high-impact SEO rankings.',
  defaultOgImage: '/og-image.png',
  twitterCardType: 'summary_large_image',
  globalNoIndex: false,
  globalNoFollow: false,
  robotsTxt: `User-agent: *\nAllow: /\nSitemap: https://netronomic.com/sitemap.xml`,
  headerScripts: `<!-- Google Tag Manager / Analytics -->\n<script async src="https://www.googletagmanager.com/gtag/js?id=G-NETRONOMIC"></script>`,
  footerScripts: `<!-- Custom Chat Widget Script -->\n<!-- <script src="https://chat.netronomic.com/widget.js"></script> -->`,
  allowIndexing: true,
  sitemapXml: DEFAULT_SITEMAP_XML,
};

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  logo: {
    brandName: 'NETRONOMIC',
    brandDotColor: '#0284c7',
    showDot: true,
    taglineText: 'DIGITAL CREATIVE & SEO AGENCY',
    showTagline: true,
    customLogoUrl: '',
    footerLogoUrl: '',
    faviconUrl: '/favicon.ico',
    glowStyle: 'subtle',
    iconVariant: 'network-orb',
    footerIconVariant: 'network-orb',
  },
  hero: {
    titlePrefix: 'Accelerate Your Brand with',
    typingPhrases: [
      'Website Development',
      'Logo & Poster Design',
      'Viral Video Reels',
      'Google SEO',
      'SEO Backlinks',
      'Digital Growth'
    ],
    subtitle: 'Full-stack engineering, custom branding, high-DA backlinks, and viral reel editing engineered for fast growth and maximum ROI.',
    primaryCtaText: 'Get Started Today',
    secondaryCtaText: 'Explore Our Services',
    showAnnouncementBadge: false,
    announcementText: 'Netronomic Web Agency — Digital Excellence',
  },
  agency: agencyInfo,
  services: servicesData,
  portfolio: portfolioData,
  pricing: pricingData,
  testimonials: testimonialsData,
  faqs: faqData,
  whyChooseUs: whyChooseData,
  processSteps: processSteps,
  aboutUs: aboutUsData,
  seo: DEFAULT_SEO_CONFIG,
  pages: DEFAULT_SITE_PAGES,
  inquiries: DEFAULT_INQUIRIES,
  primaryColorHex: '#0284c7',
};

export const SITE_CONFIG_STORAGE_KEY = 'netronomic_site_config_v2';

export function getStoredSiteConfig(): SiteConfig {
  try {
    const raw = localStorage.getItem(SITE_CONFIG_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(SITE_CONFIG_STORAGE_KEY, JSON.stringify(DEFAULT_SITE_CONFIG));
      return DEFAULT_SITE_CONFIG;
    }
    const parsed = JSON.parse(raw);
    const agency = { ...DEFAULT_SITE_CONFIG.agency, ...(parsed.agency || {}) };
    if (!agency.whatsappNumber || agency.whatsappNumber === '919876543210') {
      agency.whatsappNumber = '923020487103';
    }
    let services = parsed.services || servicesData;
    if (Array.isArray(services)) {
      servicesData.forEach((s) => {
        if (!services.some((existing: any) => existing.id === s.id)) {
          services.push(s);
        }
      });
    } else {
      services = servicesData;
    }
    const pages = parsed.pages || DEFAULT_SITE_PAGES;
    const homePage = Array.isArray(pages) ? pages.find((p: any) => p.slug === '/') : null;
    if (homePage && (homePage.metaTitle === 'Netronomic Web – Creative Digital Agency' || homePage.metaTitle === 'Netronomic Web Agency — High-Converting Web & SEO')) {
      homePage.metaTitle = 'Netronomic Web – Creative Digital Agency | Web Design, SEO & Digital Solutions';
      homePage.metaDescription = 'Netronomic Web is a creative digital agency offering professional web design, development, SEO, branding, and digital solutions to help businesses grow online.';
      homePage.focusKeyword = 'creative digital agency';
      homePage.secondaryKeywords = 'Netronomic Web, web design agency, website development, SEO services, digital marketing, branding services, professional web design, web development services, digital solutions';
    }

    return {
      ...DEFAULT_SITE_CONFIG,
      ...parsed,
      logo: { ...DEFAULT_SITE_CONFIG.logo, ...(parsed.logo || {}) },
      hero: { ...DEFAULT_SITE_CONFIG.hero, ...(parsed.hero || {}) },
      agency,
      services,
      seo: { ...DEFAULT_SITE_CONFIG.seo, ...(parsed.seo || {}) },
      pages,
      inquiries: parsed.inquiries || DEFAULT_INQUIRIES,
    };
  } catch (err) {
    console.error('Error loading site config:', err);
    return DEFAULT_SITE_CONFIG;
  }
}

export function saveSiteConfigToStorage(config: SiteConfig): void {
  try {
    localStorage.setItem(SITE_CONFIG_STORAGE_KEY, JSON.stringify(config));
  } catch (err) {
    console.error('Error saving site config:', err);
  }
}
