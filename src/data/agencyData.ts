import {
  ServiceItem,
  ProcessStep,
  WhyChooseItem,
  PortfolioItem,
  PricingPlan,
  Testimonial,
  FAQItem,
} from '../types';

export const agencyInfo = {
  name: 'Netronomic Web',
  tagline: 'Transforming Ideas Into Exceptional Digital Experiences',
  phone: '+92 302 0487103',
  whatsappNumber: '923020487103',
  email: 'daimali2453@gmail.com',
  address: 'Netronomic Tower, Tech Innovation Hub, Sector 62',
  hours: 'Mon - Sat: 9:00 AM - 7:00 PM PKT',
  social: {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    twitter: 'https://twitter.com',
    linkedin: 'https://linkedin.com',
    youtube: 'https://youtube.com',
    github: 'https://github.com',
  },
  stats: [
    { label: 'Completed Projects', value: '450+' },
    { label: 'Happy Clients', value: '280+' },
    { label: 'Client Satisfaction Rate', value: '99.4%' },
    { label: 'Years Experience', value: '8+' },
  ],
};

// 2. Our Services - Exact 9 requested services
export const servicesData: ServiceItem[] = [
  {
    id: 'website-design',
    title: 'Website Design & Development',
    shortDesc: 'Custom responsive websites engineered for ultra-fast performance, SEO supremacy, and high conversions.',
    fullDesc: 'We craft modern, visually breathtaking websites tailored to your brand. From single-page landing pages to enterprise portals, our full-stack web engineering guarantees lightning load speeds, intuitive UI/UX, and flawless mobile responsiveness.',
    iconName: 'Globe',
    category: 'development',
    features: ['Custom Next.js & React Architecture', '100% Mobile & Tablet Responsive', 'Speed Optimization (95+ Lighthouse)', 'CMS & Admin Dashboard Integration', 'Basic On-Page SEO Included'],
    startingPrice: '$299',
    deliveryTime: '5-7 Days',
    badge: 'Most Popular',
  },
  {
    id: 'app-design',
    title: 'App Design',
    shortDesc: 'Intuitive mobile and web app UI/UX wireframes, user flows, and interactive prototypes.',
    fullDesc: 'We craft stunning, user-centric mobile and web application interfaces designed for seamless navigation, high user engagement, and exceptional conversion rates across iOS and Android.',
    iconName: 'Lock',
    category: 'design',
    features: ['iOS & Android UI/UX Design', 'Interactive Figma Prototypes', 'User Journey & Flow Mapping', 'Design Systems & Component Libraries', 'Developer-Ready Handover Assets'],
    startingPrice: '$349',
    deliveryTime: 'Coming Soon',
    badge: 'Coming Soon',
  },
  {
    id: 'logo-design',
    title: 'Logo & Poster Design',
    shortDesc: 'Memorable visual identity, branding assets, and eye-catching promotional posters that instantly command brand authority.',
    fullDesc: 'Your logo and visual collateral are the heartbeat of your brand. We deliver vector-based timeless logos, promotional posters, banners, and comprehensive brand style guides.',
    iconName: 'Palette',
    category: 'design',
    features: ['3 to 5 Unique Concept Variations', 'Promotional Posters & Social Banners', 'Full Vector Files (SVG, AI, EPS, PNG, PDF)', 'Brand Style Guide Sheet', 'Unlimited Revisions Included'],
    startingPrice: '$79',
    deliveryTime: '2-3 Days',
  },

  {
    id: 'reel-editing',
    title: 'Short-Form Reel Editing',
    shortDesc: 'Engaging vertical videos, Instagram Reels, TikToks, and YouTube Shorts with motion graphics and captions.',
    fullDesc: 'Maximize video retention with dynamic jump cuts, engaging kinetic typography, custom sound design, color grading, and trend-setting captions designed specifically for viral reach.',
    iconName: 'Video',
    category: 'editing',
    features: ['Auto & Styled Animated Captions', 'Sound FX & Copyright-Free Music Track', 'Color Grading & Smooth Transitions', 'B-Roll & Overlay Enhancements', '4K / 1080p 60FPS Delivery'],
    startingPrice: '$39',
    deliveryTime: '1-2 Days',
    badge: 'Trending',
  },
  
  {
    id: 'blog-writing',
    title: 'Blog & Content Writing',
    shortDesc: 'SEO-optimized, high-authority articles that educate readers and rank at the top of Google search results.',
    fullDesc: 'Engaging, human-written content curated by domain experts. Every article is backed by keyword research, structured with optimal heading hierarchy, and formatted for maximum readability and search rankings.',
    iconName: 'FileText',
    category: 'marketing',
    features: ['Keyword Researched & Structured', '100% Plagiarism-Free & Human Tone', 'In-Text Internal & External Links', 'Meta Title & Description Included', 'Royalty-Free Header Image'],
    startingPrice: '$29',
    deliveryTime: '1-2 Days',
  },
  {
    id: 'seo-services',
    title: 'SEO Services',
    shortDesc: 'Data-driven Search Engine Optimization to drive consistent organic traffic and dominate search rankings.',
    fullDesc: 'Comprehensive technical, on-page, and off-page SEO audits and continuous optimization strategies designed to elevate your site visibility, target lucrative search keywords, and outrank competitors.',
    iconName: 'TrendingUp',
    category: 'marketing',
    features: ['Technical Site Audit & Fixes', 'Target Keyword Strategy & Mapping', 'On-Page Meta & Schema Markup', 'Speed & Core Web Vitals Optimization', 'Monthly Rank & Traffic Reports'],
    startingPrice: '$199',
    deliveryTime: 'Monthly Retainer',
  },
  {
    id: 'keyword-research',
    title: 'SEO Friendly Keyword Research',
    shortDesc: 'High-intent, low-competition keyword research mapped to search intent for rapid Google rankings.',
    fullDesc: 'Supercharge your search visibility with data-backed keyword intelligence. We unearth lucrative low-difficulty search queries, long-tail search terms, competitor content gaps, and buyer-intent keywords so your pages rank faster and attract converting traffic.',
    iconName: 'Search',
    category: 'marketing',
    features: [
      'High-Intent & Low-Competition Keyword Discovery',
      'Competitor Keyword Gap & Difficulty (KD) Analysis',
      'Search Intent Mapping (Informational & Commercial)',
      'Long-Tail Search Queries & Question Clusters',
      'Clean Spreadsheet Report with Search Volume & CPC Metrics'
    ],
    startingPrice: '$49',
    deliveryTime: '2-3 Days',
    badge: 'High ROI',
  },
  {
    id: 'profile-backlinks',
    title: 'Profile Backlinks',
    shortDesc: 'High-DA manual profile backlinks from authoritative platforms to build domain score & TRUST.',
    fullDesc: 'Strengthen your website trust score with 100% white-hat, manually created profile backlinks on high Domain Authority (DA 70-90+) platforms with indexation reporting.',
    iconName: 'Link',
    category: 'marketing',
    features: ['100% White-Hat Manual Submission', 'High DA/DR (70+ to 90+) Domains', 'Complete Excel Audit Report', 'Natural Anchor Text Distribution', 'Safe Search Engine Indexation'],
    startingPrice: '$59',
    deliveryTime: '3-5 Days',
  },
  {
    id: 'social-backlinks',
    title: 'Social Backlinks',
    shortDesc: 'Social signals and authority bookmarks to boost search indexation speed and social validation.',
    fullDesc: 'Amplify your site brand signals across major social networks, social bookmarking hubs, and community platforms to accelerate indexing and boost algorithmic credibility.',
    iconName: 'Share2',
    category: 'marketing',
    features: ['Active Social Bookmark Submissions', 'Multi-Platform Brand Signals', 'Increases Search Crawler Visits', 'Full Transparency Excel Report', '100% Safe Penalty-Free Approach'],
    startingPrice: '$49',
    deliveryTime: '2-4 Days',
  },
];

// 3. About Us
export const aboutUsData = {
  whoWeAre: {
    title: 'Who We Are',
    subtitle: 'A Passionate Team of Digital Craftsmen',
    desc: 'Netronomic Web is a full-service creative agency dedicated to transforming brand ideas into powerful digital realities. Founded in 2018, we combine technical excellence in software engineering with artful graphic design and strategic digital marketing.',
    bullets: [
      'Multi-disciplinary team of developers, designers, video creators & SEO strategists',
      'Over 450+ successful client deployments across 25+ countries',
      'Sky Blue & White clean design ethos focused on clarity, performance, and impact',
    ],
  },
  mission: {
    title: 'Our Mission',
    subtitle: 'Empowering Brands Through Innovation',
    desc: 'To deliver world-class web, mobile, design, and marketing solutions that enable businesses of all sizes to scale effortlessly, engage audiences deeply, and achieve sustainable ROI.',
    icon: 'Target',
  },
  vision: {
    title: 'Our Vision',
    subtitle: 'Leading the Future of Digital Agency Services',
    desc: 'To be the globally trusted benchmark for digital agency craftsmanship, known for uncompromising quality, rapid execution, transparent communication, and sky-high client satisfaction.',
    icon: 'Eye',
  },
};

// 4. Why Choose Us (5 items)
export const whyChooseData: WhyChooseItem[] = [
  {
    id: 'team',
    title: 'Professional Team',
    description: 'Our senior developers, UI/UX designers, and video editors possess years of hands-on industry expertise.',
    icon: 'Users',
    highlight: 'Senior Talent Only',
  },
  {
    id: 'speed',
    title: 'Fast Delivery',
    description: 'Agile milestone workflows guarantee fast turnaround times without compromising on quality or testing.',
    icon: 'Zap',
    highlight: 'On-Time Guaranteed',
  },
  {
    id: 'pricing',
    title: 'Affordable Pricing',
    description: 'Transparent, competitive pricing structures with zero hidden fees. Exceptional value for every budget.',
    icon: 'DollarSign',
    highlight: 'No Hidden Fees',
  },
  {
    id: 'quality',
    title: 'Quality Work',
    description: 'Pixel-perfect UI design, clean maintainable code, high-resolution media assets, and robust QA testing.',
    icon: 'Award',
    highlight: '100% QA Tested',
  },
  {
    id: 'support',
    title: 'Customer Support',
    description: 'Dedicated client success manager, continuous status updates, and 24/7 post-delivery assistance.',
    icon: 'Headphones',
    highlight: '24/7 Assistance',
  },
];

// 5. Our Process (6 steps)
export const processSteps: ProcessStep[] = [
  {
    number: '01',
    title: 'Discuss',
    desc: 'We conduct a deep discovery session to analyze your requirements, business objectives, target audience, and project scope.',
    details: ['Requirements Gathering', 'Target Audience Blueprint', 'Goal & KPI Setting'],
    icon: 'MessageSquare',
  },
  {
    number: '02',
    title: 'Plan',
    desc: 'We architect a clear project roadmap, choosing optimal technology stacks, sitemaps, wireframes, and delivery timelines.',
    details: ['Tech Stack Selection', 'Sitemap & Wireframing', 'Milestone Schedule'],
    icon: 'Compass',
  },
  {
    number: '03',
    title: 'Design',
    desc: 'Our creative team designs stunning visual mockups, UI concepts, brand color palettes, and interactive prototypes.',
    details: ['Custom Brand Visual Systems & Color Systems', 'Figma UI/UX Mockups', 'Client Feedback Iterations'],
    icon: 'Palette',
  },
  {
    number: '04',
    title: 'Develop',
    desc: 'Engineers turn approved designs into clean, high-performance code, integrating APIs, databases, and responsive features.',
    details: ['Clean Modular Codebase', 'API & Database Wiring', 'Cross-Browser Compatibility'],
    icon: 'Code',
  },
  {
    number: '05',
    title: 'Review',
    desc: 'Rigorously testing performance, security, SEO readiness, responsive breakpoints, and client review walk-through.',
    details: ['Speed & Quality Audit', 'Security Checks', 'Final Client Acceptance'],
    icon: 'CheckCircle',
  },
  {
    number: '06',
    title: 'Deliver',
    desc: 'Deploying live to your servers, delivering source files, training your team, and launching your digital product.',
    details: ['Live Deployment', 'Complete Source Code Release', 'Ongoing Support Handover'],
    icon: 'Rocket',
  },
];

// 6. Portfolio Items (Across Websites, Logos, Posters, Apps, Video Editing)
export const PORTFOLIO_CATEGORIES = [
  { id: 'website', label: 'Websites' },
  { id: 'logo', label: 'Logo Design' },
  { id: 'poster', label: 'Poster Design' },
  { id: 'app', label: 'App Design' },
  { id: 'reel', label: 'Reel Editing' },
  { id: 'content-seo', label: 'Content & SEO' }
];

export const portfolioData: PortfolioItem[] = [
  {
    id: 'p1',
    title: 'Horizon SaaS Platform',
    category: 'website',
    categoryLabel: 'Websites',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    description: 'Custom responsive web development with lightning fast speeds and interactive dashboard.',
    detailedDescription: 'We built a complete analytics suite from the ground up, focusing on a robust frontend architecture and optimized real-time data flow.',
    tags: ['React', 'Tailwind CSS', 'Node.js', 'Dashboard'],
    technologies: ['React', 'Tailwind', 'Node.js', 'PostgreSQL'],
    client: 'Horizon Tech Inc.',
    stats: '240% Conversion Increase',
    featured: true,
  },
  {
    id: 'p2',
    title: 'Apex Mobility App UI/UX',
    category: 'app',
    categoryLabel: 'App Design',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80',
    description: 'Cross-platform mobile UI/UX interactive prototype with intuitive navigation and modern dark/light mode.',
    detailedDescription: 'Designed a seamless ride-sharing and delivery application interface in Figma with fully interactive component libraries and user journey flows.',
    tags: ['Figma', 'Mobile UI', 'UX Research', 'iOS & Android'],
    client: 'Apex Mobility',
    stats: '98% Usability Score',
    featured: true,
  },
  {
    id: 'p3',
    title: 'Aura Minimalist Branding',
    category: 'logo',
    categoryLabel: 'Logo Design',
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80',
    description: 'High-contrast vector logo concept and visual identity system for a high-end eco-lifestyle brand.',
    detailedDescription: 'Created a unique geometric logo prioritizing scalability across print and digital mediums while conveying an eco-conscious philosophy.',
    tags: ['Logo Design', 'Vector', 'Branding Guide', 'SVG'],
    client: 'Aura Studio',
    stats: 'Brand Identity Award 2024',
    featured: true,
  },
  {
    id: 'p4',
    title: 'Tech Summit Event Poster & Banners',
    category: 'poster',
    categoryLabel: 'Poster Design',
    image: 'https://images.unsplash.com/photo-1542744094-3a31243364d0?auto=format&fit=crop&w=800&q=80',
    description: 'Print-ready promotional poster and social media banner set for a global technology conference.',
    detailedDescription: 'Designed eye-catching promotional posters, billboard banners, and social media creative assets designed to maximize attendee engagement.',
    tags: ['Poster Design', 'Print Media', 'Social Banners', 'Typography'],
    client: 'Global Tech Con',
    stats: '5,000+ Print Runs',
    featured: true,
  },
  {
    id: 'p5',
    title: 'Viral AI Tech Reel Series',
    category: 'reel',
    categoryLabel: 'Reel Editing',
    image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80',
    description: 'Vertical short-form video with custom sound effects and kinetic captions for social growth.',
    detailedDescription: 'High-retention short-form video series explaining AI concepts with custom motion graphics and dynamic pacing.',
    tags: ['Premiere Pro', 'After Effects', 'Kinetic Captions', 'Reels'],
    client: 'TechTok Media',
    stats: '1.2M+ Views',
    featured: true,
  },
  {
    id: 'p6',
    title: 'B2B Authority Content & SEO Suite',
    category: 'content-seo',
    categoryLabel: 'Content & SEO',
    image: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=800&q=80',
    description: 'Comprehensive blog writing, keyword strategy, and technical SEO overhaul driving organic growth.',
    detailedDescription: 'Executed technical SEO audit, high-intent keyword research cluster, and authoritative content creation resulting in massive traffic gains.',
    tags: ['Technical SEO', 'Keyword Strategy', 'Content Writing', 'Backlinks'],
    client: 'FinServe Solutions',
    stats: '315% Organic Traffic Growth',
    featured: true,
  }
];

// 7. Pricing (3 Tiers)
export const pricingData: PricingPlan[] = [
  {
    id: 'basic',
    name: 'Basic Starter',
    priceMonthly: 199,
    priceOneTime: 299,
    description: 'Ideal for small businesses & startups launching their initial online presence.',
    features: [
      'Responsive 3-5 Page Website',
      '1 Professional Logo Concept',
      'Basic On-Page SEO Setup',
      'Contact Form & WhatsApp Integration',
      '1 Week Free Support',
    ],
    notIncluded: ['Reel Video Editing', 'High DA Backlinks'],
  },
  {
    id: 'standard',
    name: 'Growth Professional',
    badge: 'Best Value',
    popular: true,
    priceMonthly: 499,
    priceOneTime: 699,
    description: 'Comprehensive package for growing brands looking to dominate search and social media.',
    features: [
      'Custom React/Next Website (Up to 10 pages)',
      '3 Logo Variations & Brand Style Guide',
      '3 Edited Reels with Kinetic Captions',
      'Full SEO Audit & Keyword Optimization',
      '30 Manual Profile Backlinks',
      '3 Blog Articles (1,200 words each)',
      '1 Month Dedicated Support',
    ],
  },
  {
    id: 'premium',
    name: 'Enterprise Scale',
    priceMonthly: 999,
    priceOneTime: 1499,
    description: 'All-inclusive solution for businesses needing custom web dev, high PR backlinks, and full media production.',
    features: [
      'Unlimited Logo Revisions + Complete Branding Kit',
      '8 High-Impact Reels / Video Edits',
      'Complete SEO Suite (On-page + Technical)',
      '100 High DA Profile & Social Backlinks',
      '8 Optimized SEO Blog Posts',
      'Priority 24/7 VIP Support',
    ],
  },
];

// 8. Testimonials
export const testimonialsData: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Sarah Jenkins',
    role: 'CEO & Founder',
    company: 'Luminary Tech',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    comment: 'Netronomic redesigned our entire web application and created stunning promotional reels. Our website traffic doubled in under 30 days and our conversion rate jumped significantly.',
    serviceUsed: 'Website Design & Reel Editing',
  },
  {
    id: 'test-2',
    name: 'Rajesh Sharma',
    role: 'Marketing Director',
    company: 'FinEdge Solutions',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    comment: 'Their SEO services and profile backlinks propelled our brand to the top 3 spots on Google for key industry terms. Truly professional team with fast delivery!',
    serviceUsed: 'SEO Services & Profile Backlinks',
  },
  {
    id: 'test-3',
    name: 'Elena Rostova',
    role: 'Creative Director',
    company: 'Vogue Essentials',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    comment: 'The logo design and brand assets were beyond expectations. The vector files were flawless, and the turnaround time was remarkably quick.',
    serviceUsed: 'Logo Design',
  },
];

// 9. FAQ
export const faqData: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'General',
    question: 'How do we get started with a project?',
    answer: 'Simply click "Get Started" or message us on WhatsApp with your project details. We schedule a brief discovery chat, provide a custom proposal, and initiate design/development upon agreement.',
  },
  {
    id: 'faq-2',
    category: 'Services',
    question: 'What is included in the Website Design & Development package?',
    answer: 'Our website packages include responsive design, clean code, speed optimization, contact forms, social media integration, basic SEO, and complete source files hosted on your domain.',
  },
  {
    id: 'faq-3',
    category: 'SEO & Backlinks',
    question: 'Are your profile and social backlinks safe for Google?',
    answer: 'Yes! We use 100% white-hat manual submission strategies on high Domain Authority (DA 70+) platforms. We provide detailed Excel reports with live URL verification.',
  },
  {
    id: 'faq-4',
    category: 'Reel Editing',
    question: 'What format do I need to send for Information Reel Editing?',
    answer: 'You can upload raw vertical clips or audio recordings via Google Drive, Dropbox, or WhatsApp. We take care of transcriptions, kinetic captions, overlays, music, and final 4K rendering.',
  },
  {
    id: 'faq-5',
    category: 'Turnaround',
    question: 'How fast can you deliver a project?',
    answer: 'Small design tasks (Logos, Reels, Blog Posts) are delivered in 24 to 48 hours. Websites and mobile applications take between 5 days to 3 weeks depending on complexity.',
  },
  {
    id: 'faq-6',
    category: 'Revisions',
    question: 'What if I need changes after delivery?',
    answer: 'We offer unlimited revisions during the review stage until you are 100% satisfied. Post-delivery, all packages come with free support.',
  },
];


