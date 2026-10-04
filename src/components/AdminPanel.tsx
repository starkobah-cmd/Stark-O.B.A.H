import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BlogEditorStudio } from './BlogEditorStudio';
import { PortfolioEditorStudio } from './PortfolioEditorStudio';
import {
  LayoutDashboard,
  FileText,
  Layers,
  Sparkles,
  Settings,
  Building2,
  MessageSquare,
  Image as ImageIcon,
  Database,
  Plus,
  Trash2,
  Edit3,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Download,
  Upload,
  RotateCcw,
  RefreshCw,
  Zap,
  ExternalLink,
  Save,
  Globe,
  Phone,
  Mail,
  MapPin,
  Clock,
  Share2,
  Code2,
  Briefcase,
  FolderGit2,
  Check,
  Copy,
  ChevronRight,
  Filter,
  BarChart3,
  TrendingUp,
  Users,
  ShieldCheck,
  Sparkle,
  ArrowLeft,
  X,
  Type,
  Lock,
  KeyRound,
  UserPlus,
  LogOut,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Github,
  Music2,
  Pin,
  FileCode,
  PlusCircle
} from 'lucide-react';
import {
  SiteConfig,
  SiteLogoConfig,
  SiteHeroConfig,
  SiteAgencyInfo,
  SitePageConfig,
  PageSectionConfig,
  SiteSeoConfig,
  InquiryItem,
  DEFAULT_SITE_CONFIG,
  DEFAULT_SITEMAP_XML
} from '../data/siteConfig';
import { BlogPost, PostStatus, PortfolioItem, BlogBlock, BlogBlockType } from '../types';
import { BLOG_CATEGORIES } from '../data/blogData';
import { AdminMediaManager } from './AdminMediaManager';
import { MediaPickerField } from './MediaPickerField';
import { SeoAnalysisPanel } from './SeoAnalysisPanel';
import { analyzeSeo } from '../utils/seoAnalyzer';
import {
  logoutAdmin,
  getCurrentSession,
  getStoredAdminUsers,
  createAdminUser,
  deleteAdminUser,
  updateAdminUser,
  changeUserPassword,
  AdminUser,
  AdminRole,
  AdminSession
} from '../utils/auth';

interface AdminPanelProps {
  siteConfig: SiteConfig;
  onSaveSiteConfig: (config: SiteConfig) => void;
  onResetSiteConfig: () => void;
  posts: BlogPost[];
  onSavePost: (post: BlogPost) => void;
  onDeletePost: (postId: string) => void;
  onToggleStatus: (postId: string, status: PostStatus) => void;
  onExitAdmin: () => void;
  onLogout?: () => void;
  onOpenSitemap: () => void;
}

type TabType =
  | 'dashboard'
  | 'pages'
  | 'posts'
  | 'portfolio'
  | 'seo'
  | 'branding'
  | 'social'
  | 'agency'
  | 'inquiries'
  | 'media'
  | 'backup'
  | 'users';

const FEATURED_IMAGE_PRESETS = [
  { label: 'Web Design', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80' },
  { label: 'SEO Analytics', url: 'https://images.unsplash.com/photo-1557838923-2985c318be48?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Video Production', url: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Brand Identity', url: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Mobile App', url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80' }
];

export const AdminPanel: React.FC<AdminPanelProps> = ({
  siteConfig,
  onSaveSiteConfig,
  onResetSiteConfig,
  posts,
  onSavePost,
  onDeletePost,
  onToggleStatus,
  onExitAdmin,
  onLogout,
  onOpenSitemap,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [localConfig, setLocalConfig] = useState<SiteConfig>({ ...siteConfig, blogPosts: posts || siteConfig.blogPosts });
  const [savedSuccessMsg, setSavedSuccessMsg] = useState('');

  useEffect(() => {
    if (posts) {
      setLocalConfig(prev => ({ ...prev, blogPosts: posts }));
    }
  }, [posts]);

    // Portfolio Management State
  const [editingPortfolio, setEditingPortfolio] = useState<Partial<PortfolioItem> | null>(null);
  const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState(false);
  const [portfolioSearch, setPortfolioSearch] = useState('');
  const [portfolioCategoryFilter, setPortfolioCategoryFilter] = useState('All');
  const [portfolioVideoFilter, setPortfolioVideoFilter] = useState<'All' | 'WithVideo' | 'WithoutVideo'>('All');

// Blog Management State
  const [blogSearch, setBlogSearch] = useState('');
  const [blogCategoryFilter, setBlogCategoryFilter] = useState('All');
  const [blogStatusFilter, setBlogStatusFilter] = useState<string>('All');
  const [editingPost, setEditingPost] = useState<Partial<BlogPost> | null>(null);
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [blogEditorTab, setBlogEditorTab] = useState<'content' | 'seo'>('content');
  const [selectedPostIds, setSelectedPostIds] = useState<string[]>([]);
  const [blogContentSubTab, setBlogContentSubTab] = useState<'builder' | 'markdown' | 'import' | 'preview'>('builder');

  const [isSyncingWp, setIsSyncingWp] = useState(false);
  const [wpSyncStatus, setWpSyncStatus] = useState<string | null>(null);

  const handleSyncWordPress = async () => {
    const wpUrl = localConfig.seo?.wordpressUrl?.trim();
    if (!wpUrl) {
      alert('Please enter your WordPress site URL first (e.g. https://mywordpresssite.com)');
      return;
    }
    setIsSyncingWp(true);
    setWpSyncStatus('Connecting to WordPress REST API...');
    try {
      const cleanUrl = wpUrl.replace(/\/+$/, '');
      const res = await fetch(`${cleanUrl}/wp-json/wp/v2/posts?_embed&per_page=15`, {
        headers: { 'Accept': 'application/json' }
      });
      if (!res.ok) {
        throw new Error(`WordPress returned status ${res.status}. Make sure REST API is enabled on your WP site.`);
      }
      const wpPosts = await res.json();
      if (!Array.isArray(wpPosts)) {
        throw new Error('Invalid response format from WordPress REST API.');
      }

      const mappedPosts: BlogPost[] = wpPosts.map((p: any) => {
        const title = p.title?.rendered ? p.title.rendered.replace(/<[^>]*>?/gm, '') : 'Untitled WordPress Post';
        const excerpt = p.excerpt?.rendered ? p.excerpt.rendered.replace(/<[^>]*>?/gm, '') : '';
        const content = p.content?.rendered ? p.content.rendered : '';
        const slug = p.slug || `wp-post-${p.id}`;
        const date = p.date ? p.date.split('T')[0] : new Date().toISOString().split('T')[0];
        
        let featuredImage = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200';
        if (p._embedded && p._embedded['wp:featuredmedia'] && p._embedded['wp:featuredmedia'][0]?.source_url) {
          featuredImage = p._embedded['wp:featuredmedia'][0].source_url;
        }

        const authorName = p._embedded?.author?.[0]?.name || 'WordPress Author';

        return {
          id: `wp-${p.id}`,
          title,
          slug,
          excerpt,
          content,
          featuredImage,
          author: {
            name: authorName,
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
            role: 'WordPress Editor'
          },
          category: 'WordPress Import',
          tags: ['WordPress', 'Synced'],
          publishedAt: date,
          readingTime: '5 min read',
          status: 'published',
          comments: []
        };
      });

      const existingIds = new Set(localConfig.blogPosts.map(bp => bp.id));
      const newPostsToAdd = mappedPosts.filter(mp => !existingIds.has(mp.id));
      const mergedPosts = [...newPostsToAdd, ...localConfig.blogPosts];

      const updatedConfig = { ...localConfig, blogPosts: mergedPosts };
      setLocalConfig(updatedConfig);
      onSaveSiteConfig(updatedConfig);
      setWpSyncStatus(`Successfully synced ${mappedPosts.length} posts from WordPress!`);
      triggerSaveNotification(`Synced ${mappedPosts.length} posts from WordPress!`);
    } catch (err: any) {
      console.error('WP Sync error:', err);
      setWpSyncStatus(`Sync error: ${err.message || 'CORS or Network error. Check URL.'}`);
    } finally {
      setIsSyncingWp(false);
    }
  };

  const getDefaultBlockData = (type: BlogBlockType): BlogBlock['data'] => {
    switch (type) {
      case 'heading': return { text: 'Section Heading', level: 2 };
      case 'paragraph': return { text: 'Write your paragraph content here...' };
      case 'introduction': return { text: 'Write your introductory lead paragraph here...' };
      case 'image': return { imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80', altText: 'Illustration', caption: 'Image caption', alignment: 'center' };
      case 'table': return { columns: ['Column 1', 'Column 2', 'Column 3'], rows: [['Row 1 Col 1', 'Row 1 Col 2', 'Row 1 Col 3'], ['Row 2 Col 1', 'Row 2 Col 2', 'Row 2 Col 3']] };
      case 'quote': return { text: 'Important insight or quote goes here.' };
      case 'bullet-list': return { items: ['First list item', 'Second list item', 'Third list item'] };
      case 'numbered-list': return { items: ['Step 1 description', 'Step 2 description', 'Step 3 description'] };
      case 'faq': return { questions: [{ question: 'What is this about?', answer: 'Detailed answer goes here.' }] };
      case 'custom-html': return { html: '<div class="p-4 bg-sky-950/30 rounded-xl text-sky-200">Custom HTML Block</div>' };
      case 'custom-code': return { code: 'console.log("Hello Netronomic");', language: 'javascript' };
      default: return { text: '' };
    }
  };

  const handleAddBlogBlock = (type: BlogBlockType) => {
    if (!editingPost) return;
    const newBlock: BlogBlock = {
      id: `block-${Date.now()}`,
      type,
      data: getDefaultBlockData(type)
    };
    const currentBlocks = editingPost.blocks || [];
    setEditingPost({
      ...editingPost,
      blocks: [...currentBlocks, newBlock]
    });
  };

  const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
    if (!editingPost || !editingPost.blocks) return;
    const blocks = [...editingPost.blocks];
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === blocks.length - 1) return;
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const [moved] = blocks.splice(index, 1);
    blocks.splice(targetIdx, 0, moved);
    setEditingPost({ ...editingPost, blocks });
  };

  const handleDuplicateBlock = (index: number) => {
    if (!editingPost || !editingPost.blocks) return;
    const blocks = [...editingPost.blocks];
    const target = blocks[index];
    const duplicated: BlogBlock = {
      ...target,
      id: `block-${Date.now()}`,
      data: JSON.parse(JSON.stringify(target.data))
    };
    blocks.splice(index + 1, 0, duplicated);
    setEditingPost({ ...editingPost, blocks });
  };

  const handleDeleteBlock = (index: number) => {
    if (!editingPost || !editingPost.blocks) return;
    if (confirm('Delete this block?')) {
      const blocks = [...editingPost.blocks];
      blocks.splice(index, 1);
      setEditingPost({ ...editingPost, blocks });
    }
  };

  const handleUpdateBlockData = (index: number, dataKey: string, value: any) => {
    if (!editingPost || !editingPost.blocks) return;
    const blocks = [...editingPost.blocks];
    blocks[index] = {
      ...blocks[index],
      data: {
        ...blocks[index].data,
        [dataKey]: value
      }
    };
    setEditingPost({ ...editingPost, blocks });
  };

  // Page Editor State
  const [selectedPageId, setSelectedPageId] = useState<string>(siteConfig.pages?.[0]?.id || 'page-home');
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [pageEditorMode, setPageEditorMode] = useState<'sections' | 'seo'>('sections');

  // SEO Analyzer State
  const [seoTargetType, setSeoTargetType] = useState<'page' | 'post'>('page');
  const [selectedSeoTargetId, setSelectedSeoTargetId] = useState<string>(siteConfig.pages?.[0]?.id || 'page-home');

  // Backup & Import Modal
  const [importJsonText, setImportJsonText] = useState('');
  const [importError, setImportError] = useState('');
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetConfirmInput, setResetConfirmInput] = useState('');
  const [lastExportedAt, setLastExportedAt] = useState<string>(() => {
    return localStorage.getItem('netronomic_last_exported_at') || 'Never';
  });
  const backupFileInputRef = useRef<HTMLInputElement>(null);

  // Media Library copied URL toast
  const [copiedMediaUrl, setCopiedMediaUrl] = useState('');
  const [inquiryFilter, setInquiryFilter] = useState<'all' | 'new' | 'contacted' | 'closed'>('all');

  // Hero typing phrase temp input
  const [newPhraseInput, setNewPhraseInput] = useState('');

  // Sitemap Helper Form State
  const [sitemapUrlInput, setSitemapUrlInput] = useState('');
  const [sitemapPriorityInput, setSitemapPriorityInput] = useState('0.8');
  const [sitemapChangefreqInput, setSitemapChangefreqInput] = useState('weekly');
  const [sitemapLastmodInput, setSitemapLastmodInput] = useState(new Date().toISOString().split('T')[0]);

  // Admin Users & Security Management State
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [currentSession, setCurrentSessionState] = useState<AdminSession | null>(() => getCurrentSession());
  
  // Profile & Password Update Form
  const [profileUsername, setProfileUsername] = useState(currentSession?.username || 'netronomicweb');
  const [profileEmail, setProfileEmail] = useState(currentSession?.email || 'starkobah@gmail.com');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [secMsg, setSecMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // New User Creation Form
  const [addUserModalOpen, setAddUserModalOpen] = useState(false);
  const [addUsername, setAddUsername] = useState('');
  const [addEmail, setAddEmail] = useState('');
  const [addPassword, setAddPassword] = useState('');
  const [addRole, setAddRole] = useState<AdminRole>('Editor');
  const [addUserMsg, setAddUserMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Load Admin Users on mount
  useEffect(() => {
    getStoredAdminUsers().then(users => {
      setAdminUsers(users);
      const session = getCurrentSession();
      setCurrentSessionState(session);
      if (session) {
        setProfileUsername(session.username);
        setProfileEmail(session.email);
      }
    });
  }, []);

  const refreshUsers = async () => {
    const users = await getStoredAdminUsers();
    setAdminUsers(users);
    const session = getCurrentSession();
    setCurrentSessionState(session);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSecMsg(null);
    if (!currentSession) return;

    if (!profileUsername.trim() || !profileEmail.trim()) {
      setSecMsg({ type: 'error', text: 'Username and Email cannot be empty.' });
      return;
    }

    const res = await updateAdminUser(currentSession.userId, {
      username: profileUsername,
      email: profileEmail,
    });

    if (res.success) {
      setSecMsg({ type: 'success', text: 'Profile details updated!' });
      refreshUsers();
      triggerSaveNotification('Admin profile details updated!');
    } else {
      setSecMsg({ type: 'error', text: res.message });
    }
  };

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSecMsg(null);
    if (!currentSession) return;

    if (!oldPassword || !newPassword) {
      setSecMsg({ type: 'error', text: 'Please enter your current and new password.' });
      return;
    }

    if (newPassword.length < 8 || !/\d/.test(newPassword)) {
      setSecMsg({ type: 'error', text: 'Password must be at least 8 characters and contain at least one number.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setSecMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    const res = await changeUserPassword(currentSession.userId, oldPassword, newPassword);
    if (res.success) {
      setSecMsg({ type: 'success', text: 'Password successfully updated and encrypted with SHA-256!' });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      refreshUsers();
      triggerSaveNotification('Admin password changed!');
    } else {
      setSecMsg({ type: 'error', text: res.message });
    }
  };

  const handleCreateNewUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddUserMsg(null);

    if (!addUsername.trim() || !addEmail.trim() || !addPassword) {
      setAddUserMsg({ type: 'error', text: 'All fields are required.' });
      return;
    }

    if (addPassword.length < 6) {
      setAddUserMsg({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }

    const res = await createAdminUser(addUsername, addEmail, addPassword, addRole);
    if (res.success) {
      setAddUserMsg({ type: 'success', text: res.message });
      setAddUsername('');
      setAddEmail('');
      setAddPassword('');
      refreshUsers();
      setTimeout(() => {
        setAddUserModalOpen(false);
        setAddUserMsg(null);
      }, 1500);
    } else {
      setAddUserMsg({ type: 'error', text: res.message });
    }
  };

  const handleDeleteAdminUserClick = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this admin account?')) {
      const res = await deleteAdminUser(userId);
      if (res.success) {
        refreshUsers();
        triggerSaveNotification('Admin user account removed.');
      } else {
        alert(res.message);
      }
    }
  };

  const handleUpdateRoleClick = async (userId: string, newRole: AdminRole) => {
    const res = await updateAdminUser(userId, { role: newRole });
    if (res.success) {
      refreshUsers();
      triggerSaveNotification(`Role updated to ${newRole}`);
    } else {
      alert(res.message);
    }
  };

  const triggerSaveNotification = (msg: string = 'Changes saved successfully!') => {
    onSaveSiteConfig(localConfig);
    setSavedSuccessMsg(msg);
    setTimeout(() => setSavedSuccessMsg(''), 3000);
  };

  // -------------------------------------------------------------
  // CALCULATED METRICS FOR DASHBOARD
  // -------------------------------------------------------------
  const publishedPostsCount = posts.filter(p => p.status === 'published').length;
  const draftPostsCount = posts.filter(p => p.status === 'draft').length;
  const totalPagesCount = localConfig.pages?.length || 5;
  const totalInquiriesCount = localConfig.inquiries?.length || 0;
  const newInquiriesCount = localConfig.inquiries?.filter(i => i.status === 'new').length || 0;

  // Calculate Overall Site SEO Health Score
  const calculateSeoScore = () => {
    let score = 100;
    const globalSeo = localConfig.seo;
    if (!globalSeo?.canonicalUrl) score -= 10;
    if (!globalSeo?.defaultOgImage) score -= 10;
    if (!globalSeo?.defaultOgDescription || globalSeo.defaultOgDescription.length < 50) score -= 10;
    
    // Check Home page meta
    const homePage = localConfig.pages?.find(p => p.slug === '/');
    if (!homePage?.metaTitle || homePage.metaTitle.length < 30) score -= 15;
    if (!homePage?.metaDescription || homePage.metaDescription.length < 80) score -= 15;
    if (!homePage?.focusKeyword) score -= 10;

    return Math.max(20, Math.min(100, score));
  };

  const seoHealthScore = calculateSeoScore();

  // -------------------------------------------------------------
  // PAGE & MODULAR SECTION HANDLERS
  // -------------------------------------------------------------
  const selectedPage = localConfig.pages?.find(p => p.id === selectedPageId) || localConfig.pages?.[0];

  const handleToggleSectionVisibility = (sectionId: string) => {
    if (!selectedPage) return;
    const updatedSections = selectedPage.sections.map(sec => {
      if (sec.id === sectionId) {
        return { ...sec, visible: !sec.visible };
      }
      return sec;
    });

    const updatedPages = localConfig.pages.map(p => {
      if (p.id === selectedPage.id) {
        return { ...p, sections: updatedSections };
      }
      return p;
    });

    setLocalConfig({ ...localConfig, pages: updatedPages });
    onSaveSiteConfig({ ...localConfig, pages: updatedPages });
  };

  const handleMoveSection = (sectionId: string, direction: 'up' | 'down') => {
    if (!selectedPage) return;
    const idx = selectedPage.sections.findIndex(s => s.id === sectionId);
    if (idx === -1) return;
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === selectedPage.sections.length - 1) return;

    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    const updatedSections = [...selectedPage.sections];
    const [moved] = updatedSections.splice(idx, 1);
    updatedSections.splice(targetIdx, 0, moved);

    // Reassign order
    const reordered = updatedSections.map((s, i) => ({ ...s, order: i + 1 }));

    const updatedPages = localConfig.pages.map(p => {
      if (p.id === selectedPage.id) {
        return { ...p, sections: reordered };
      }
      return p;
    });

    setLocalConfig({ ...localConfig, pages: updatedPages });
    onSaveSiteConfig({ ...localConfig, pages: updatedPages });
  };

  const handleUpdateSectionData = (sectionId: string, fields: Partial<PageSectionConfig>) => {
    if (!selectedPage) return;
    const updatedSections = selectedPage.sections.map(sec => {
      if (sec.id === sectionId) {
        return { ...sec, ...fields };
      }
      return sec;
    });

    const updatedPages = localConfig.pages.map(p => {
      if (p.id === selectedPage.id) {
        return { ...p, sections: updatedSections };
      }
      return p;
    });

    setLocalConfig({ ...localConfig, pages: updatedPages });
  };

  // -------------------------------------------------------------
  // BLOG POST HANDLERS
  // -------------------------------------------------------------
  const filteredPosts = posts.filter(post => {
    const matchesSearch =
      post.title.toLowerCase().includes(blogSearch.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(blogSearch.toLowerCase()) ||
      post.slug.toLowerCase().includes(blogSearch.toLowerCase());
    const matchesCategory = blogCategoryFilter === 'All' || post.category === blogCategoryFilter;
    const matchesStatus = blogStatusFilter === 'All' || post.status === blogStatusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

    const handleCreatePortfolio = () => {
    setEditingPortfolio({
      id: `port-${Date.now()}`,
      title: '',
      category: 'websites',
      categoryLabel: 'Website Design & Development',
      featured: false,
      image: '',
      description: '',
      detailedDescription: '',
      tags: ['React', 'Tailwind'],
      technologies: ['React', 'Vite'],
      client: '',
      stats: '',
      link: '',
      videoUrl: '',
      date: '2026'
    });
    setIsPortfolioModalOpen(true);
  };

  const handleEditPortfolio = (port: PortfolioItem) => {
    setEditingPortfolio({ ...port });
    setIsPortfolioModalOpen(true);
  };

  const handleSavePortfolio = () => {
    if (!editingPortfolio || !editingPortfolio.id || !editingPortfolio.title) return;
    const currentList = localConfig.portfolio || [];
    const exists = currentList.find(p => p.id === editingPortfolio.id);
    let newList;
    if (exists) {
      newList = currentList.map(p => p.id === editingPortfolio.id ? (editingPortfolio as PortfolioItem) : p);
    } else {
      newList = [(editingPortfolio as PortfolioItem), ...currentList];
    }
    const updatedConfig = { ...localConfig, portfolio: newList };
    setLocalConfig(updatedConfig);
    onSaveSiteConfig(updatedConfig);
    setSavedSuccessMsg('Portfolio project saved!');
    setTimeout(() => setSavedSuccessMsg(''), 3000);
    setIsPortfolioModalOpen(false);
    setEditingPortfolio(null);
  };

  const handleDeletePortfolio = (id: string) => {
    if (confirm('Are you sure you want to delete this portfolio project?')) {
      const updatedConfig = {
        ...localConfig,
        portfolio: (localConfig.portfolio || []).filter(p => p.id !== id)
      };
      setLocalConfig(updatedConfig);
      onSaveSiteConfig(updatedConfig);
      setSavedSuccessMsg('Portfolio project deleted!');
      setTimeout(() => setSavedSuccessMsg(''), 3000);
    }
  };

  const handleCreatePost = () => {
    setEditingPost({
      id: `post-${Date.now()}`,
      title: '',
      slug: '',
      excerpt: '',
      content: 'Write your introductory lead paragraph here...\n\nWrite your main article content here...',
      blocks: [
        { id: 'b1', type: 'introduction', data: { text: 'Write your introductory lead paragraph here...' } },
        { id: 'b2', type: 'paragraph', data: { text: 'Write your main article content here...' } }
      ],
      featuredImage: FEATURED_IMAGE_PRESETS[0].url,
      author: {
        name: localConfig.agency?.name || 'Netronomic Team',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        role: 'Digital Strategist',
      },
      publishedAt: new Date().toISOString().split('T')[0],
      readingTime: '4 min read',
      category: 'Web Development',
      tags: ['SEO', 'Web Design', 'Digital Agency'],
      status: 'draft',
      seoTitle: '',
      metaDescription: '',
      focusKeyword: '',
      secondaryKeywords: '',
    });
    setBlogEditorTab('content');
    setBlogContentSubTab('builder');
    setIsBlogModalOpen(true);
  };

  const handleUpdatePageSeoField = (pageId: string, field: keyof SitePageConfig, val: any) => {
    const updatedPages = (localConfig.pages || []).map(p => {
      if (p.id === pageId) {
        return { ...p, [field]: val };
      }
      return p;
    });
    const updatedConfig = { ...localConfig, pages: updatedPages };
    setLocalConfig(updatedConfig);
    onSaveSiteConfig(updatedConfig);
  };

  const handleSaveArticleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost?.title || !editingPost?.slug) {
      alert('Please fill in Title and Slug');
      return;
    }

    const resolvedSlug = editingPost.slug.startsWith('/') ? editingPost.slug.slice(1) : editingPost.slug;
    const resolvedTitle = editingPost.seoTitle || editingPost.title;
    const resolvedDesc = editingPost.metaDescription || editingPost.excerpt || '';
    const resolvedOgImage = editingPost.ogImage || editingPost.featuredImage || FEATURED_IMAGE_PRESETS[0].url;

    const serializedContent = (editingPost.blocks && editingPost.blocks.length > 0)
      ? editingPost.blocks.map(b => {
          const d = b.data || {};
          switch (b.type) {
            case 'heading': return `${'#'.repeat(d.level || 2)} ${d.text}`;
            case 'introduction':
            case 'paragraph':
            case 'quote': return d.text;
            case 'image': return `![${d.altText || ''}](${d.imageUrl || ''})\n*${d.caption || ''}*`;
            case 'bullet-list': return (d.items || []).map(item => `- ${item}`).join('\n');
            case 'numbered-list': return (d.items || []).map((item, idx) => `${idx + 1}. ${item}`).join('\n');
            case 'faq': return (d.questions || []).map(q => `**Q: ${q.question}**\nA: ${q.answer}`).join('\n\n');
            case 'custom-html': return d.html;
            case 'custom-code': return `\`\`\`${d.language || 'code'}\n${d.code}\n\`\`\``;
            default: return '';
          }
        }).filter(Boolean).join('\n\n')
      : (editingPost.content || '');

    // Calculate score using RankMath analyzer
    const calculatedSeo = analyzeSeo({
      focusKeyword: editingPost.focusKeyword || '',
      seoTitle: resolvedTitle,
      metaDescription: resolvedDesc,
      slug: resolvedSlug,
      content: serializedContent,
      ogImage: resolvedOgImage
    });

    const postToSave: BlogPost = {
      id: editingPost.id || `post-${Date.now()}`,
      title: editingPost.title,
      slug: resolvedSlug,
      excerpt: editingPost.excerpt || '',
      content: serializedContent,
      blocks: editingPost.blocks || [],
      featuredImage: editingPost.featuredImage || FEATURED_IMAGE_PRESETS[0].url,
      author: editingPost.author || {
        name: 'Netronomic Team',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        role: 'Digital Strategist'
      },
      publishedAt: editingPost.publishedAt || new Date().toISOString().split('T')[0],
      readingTime: editingPost.readingTime || '5 min read',
      category: editingPost.category || 'Web Development',
      tags: editingPost.tags || ['Web', 'SEO'],
      status: (editingPost.status as PostStatus) || 'draft',
      comments: editingPost.comments || [],
      focusKeyword: editingPost.focusKeyword || '',
      secondaryKeywords: editingPost.secondaryKeywords || '',
      seoTitle: resolvedTitle,
      metaDescription: resolvedDesc,
      ogImage: resolvedOgImage,
      seoScore: calculatedSeo.score,
    };

    onSavePost(postToSave);
    setIsBlogModalOpen(false);
    setEditingPost(null);
    triggerSaveNotification(`Blog post saved with SEO score: ${calculatedSeo.score}/100!`);
  };

  const handleBulkDelete = () => {
    if (selectedPostIds.length === 0) return;
    if (confirm(`Are you sure you want to delete ${selectedPostIds.length} post(s)?`)) {
      selectedPostIds.forEach(id => onDeletePost(id));
      setSelectedPostIds([]);
      triggerSaveNotification('Selected posts deleted.');
    }
  };

  const handleDuplicatePost = (post: BlogPost) => {
    const duplicated: BlogPost = {
      ...post,
      id: `post-${Date.now()}`,
      title: `${post.title} (Copy)`,
      slug: `${post.slug}-copy-${Math.floor(Math.random() * 1000)}`,
      status: 'draft',
      publishedAt: new Date().toISOString().split('T')[0],
      comments: []
    };
    onSavePost(duplicated);
    triggerSaveNotification(`Duplicated "${post.title}" as draft!`);
  };

  const handleBulkStatusChange = (status: PostStatus) => {
    if (selectedPostIds.length === 0) return;
    selectedPostIds.forEach(id => onToggleStatus(id, status));
    setSelectedPostIds([]);
    triggerSaveNotification(`Updated ${selectedPostIds.length} post(s) to ${status}.`);
  };

  // -------------------------------------------------------------
  // BACKUP & IMPORT HANDLERS
  // -------------------------------------------------------------
  const handleExportJSON = () => {
    const backupData = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      siteConfig: localConfig,
      posts: posts,
    };
    const jsonStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `netronomic_cms_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);

    const nowStr = new Date().toLocaleString();
    setLastExportedAt(nowStr);
    localStorage.setItem('netronomic_last_exported_at', nowStr);
    triggerSaveNotification('Site backup exported successfully!');
  };

  const validateAndRestoreJSON = (textToRestore: string) => {
    setImportError('');
    try {
      if (!textToRestore.trim()) {
        setImportError('Please paste valid JSON or choose a backup file.');
        return false;
      }
      const parsed = JSON.parse(textToRestore);
      if (!parsed || typeof parsed !== 'object' || (!parsed.siteConfig && !parsed.posts && !parsed.agency)) {
        setImportError('Invalid JSON backup file structure.');
        return false;
      }
      if (parsed.siteConfig) {
        setLocalConfig(parsed.siteConfig);
        onSaveSiteConfig(parsed.siteConfig);
      }
      if (parsed.posts && Array.isArray(parsed.posts)) {
        parsed.posts.forEach((p: BlogPost) => onSavePost(p));
      }
      setImportJsonText('');
      triggerSaveNotification('Data successfully restored!');
      return true;
    } catch (err: any) {
      setImportError('Invalid JSON backup file structure.');
      return false;
    }
  };

  const handleRestoreFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setImportJsonText(content);
        const success = validateAndRestoreJSON(content);
        if (!success) {
          setImportError('Invalid JSON backup file structure.');
        }
      }
    };
    reader.onerror = () => {
      setImportError('Failed to read uploaded file.');
    };
    reader.readAsText(file);
  };

  const handleInquiryStatusChange = (inquiryId: string, newStatus: 'new' | 'contacted' | 'closed') => {
    const updatedInquiries = localConfig.inquiries?.map(i => {
      if (i.id === inquiryId) return { ...i, status: newStatus };
      return i;
    }) || [];
    setLocalConfig({ ...localConfig, inquiries: updatedInquiries });
    onSaveSiteConfig({ ...localConfig, inquiries: updatedInquiries });
  };

  const handleDeleteInquiry = (inquiryId: string) => {
    if (confirm('Are you sure you want to delete this inquiry?')) {
      const updatedInquiries = localConfig.inquiries?.filter(i => i.id !== inquiryId) || [];
      setLocalConfig({ ...localConfig, inquiries: updatedInquiries });
      onSaveSiteConfig({ ...localConfig, inquiries: updatedInquiries });
      triggerSaveNotification('Inquiry deleted successfully');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* ------------------------------------------------------------- */}
      {/* TOP WORDPRESS ADMIN BAR */}
      {/* ------------------------------------------------------------- */}
      <header className="h-16 bg-slate-900 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-500 to-cyan-400 flex items-center justify-center font-black text-slate-950 text-sm shadow-md">
            W
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base text-white tracking-tight">
                {localConfig.logo?.brandName || 'NETRONOMIC'} CMS
              </span>
              <span className="px-2 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-[10px] font-bold uppercase tracking-wider">
                NETRONOMIC CORE
              </span>
            </div>
            <span className="text-[11px] text-slate-400 hidden sm:block">
              Full-Stack Control Panel & Content Engine
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {savedSuccessMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{savedSuccessMsg}</span>
            </motion.div>
          )}

          <button
            onClick={onOpenSitemap}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-sky-400" />
            <span>XML Sitemap</span>
          </button>

          <button
            onClick={() => triggerSaveNotification('Global configuration updated!')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-sky-500/20 hover:brightness-110 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save All Changes</span>
          </button>

          <button
            onClick={onExitAdmin}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Exit to Website</span>
          </button>

          <button
            onClick={() => {
              logoutAdmin();
              if (onLogout) {
                onLogout();
              } else {
                onExitAdmin();
              }
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 font-bold text-xs border border-rose-500/30 transition-all cursor-pointer"
            title="Log out and lock Admin Panel"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* MAIN LAYOUT: SIDEBAR + CONTENT AREA */}
      <div className="flex-1 flex overflow-hidden">
        {/* ------------------------------------------------------------- */}
        {/* WORDPRESS-STYLE LEFT SIDEBAR */}
        {/* ------------------------------------------------------------- */}
        <aside className="w-16 sm:w-64 bg-slate-900 border-r border-slate-800 shrink-0 flex flex-col justify-between py-4">
          <div className="space-y-1 px-2 sm:px-3">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
              { id: 'pages', label: 'Pages & Sections', icon: Layers, badge: `${totalPagesCount}` },
              { id: 'posts', label: 'Blog Posts', icon: FileText, badge: `${posts.length}` },
              { id: 'portfolio', label: 'Portfolio Projects', icon: Briefcase, badge: `${localConfig.portfolio?.length || 0}` },
              { id: 'seo', label: 'Advanced SEO Suite', icon: Sparkles, badge: `${seoHealthScore}%` },
              { id: 'inquiries', label: 'Contact Inquiries', icon: MessageSquare, badge: newInquiriesCount > 0 ? `${newInquiriesCount}` : null, alert: newInquiriesCount > 0 },
              { id: 'branding', label: 'Site Branding & Logo', icon: Settings, badge: null },
              { id: 'social', label: 'Social Media', icon: Share2, badge: null },
              { id: 'agency', label: 'Agency & Contact', icon: Building2, badge: null },
              { id: 'media', label: 'Media Library', icon: ImageIcon, badge: null },
              { id: 'backup', label: 'Data Backup & Import', icon: Database, badge: null },
              { id: 'users', label: 'Admin Users & Security', icon: ShieldCheck, badge: `${adminUsers.length}` },
            ].map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as TabType)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all group ${
                    isActive
                      ? 'bg-sky-500 text-slate-950 font-black shadow-md shadow-sky-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                  }`}
                  title={item.label}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-slate-950' : 'text-sky-400'}`} />
                    <span className="hidden sm:inline truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-extrabold shrink-0 ${
                        item.alert
                          ? 'bg-rose-500 text-white animate-pulse'
                          : isActive
                          ? 'bg-slate-950 text-sky-400'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Bottom Quick Links */}
          <div className="px-3 pt-4 border-t border-slate-800 space-y-2 hidden sm:block">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white text-xs font-semibold transition-colors"
            >
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-sky-400" />
                <span>Visit Live Website</span>
              </div>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>
          </div>
        </aside>

        {/* ------------------------------------------------------------- */}
        {/* MAIN DASHBOARD CONTENT AREA */}
        {/* ------------------------------------------------------------- */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-950 space-y-8">
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 max-w-6xl mx-auto">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  CMS Control Dashboard
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Manage pages, blog posts, SEO configurations, and incoming leads in real time.
                </p>
              </div>

              {/* METRICS GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                    <span>Total Site Pages</span>
                    <Layers className="w-4 h-4 text-sky-400" />
                  </div>
                  <div className="text-3xl font-black text-white">{totalPagesCount}</div>
                  <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-3 h-3" /> All {totalPagesCount} pages indexable
                  </p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                    <span>Blog Articles</span>
                    <FileText className="w-4 h-4 text-sky-400" />
                  </div>
                  <div className="text-3xl font-black text-white">{posts.length}</div>
                  <p className="text-[11px] text-slate-400">
                    <span className="text-sky-400 font-bold">{publishedPostsCount} Published</span> • {draftPostsCount} Draft
                  </p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                    <span>Inquiries / Leads</span>
                    <MessageSquare className="w-4 h-4 text-sky-400" />
                  </div>
                  <div className="text-3xl font-black text-white">{totalInquiriesCount}</div>
                  <p className="text-[11px] text-rose-400 font-semibold">
                    {newInquiriesCount} new unread submissions
                  </p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                    <span>SEO Health Score</span>
                    <Sparkles className="w-4 h-4 text-sky-400" />
                  </div>
                  <div className="text-3xl font-black text-emerald-400">{seoHealthScore}/100</div>
                  <p className="text-[11px] text-slate-400">
                    Technical SEO & Schema validation score
                  </p>
                </div>
              </div>

              {/* QUICK ACTIONS & RECENT INQUIRIES */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Recent Inquiries */}
                <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white">Recent Contact Inquiries</h3>
                      <p className="text-xs text-slate-400">Leads captured from project estimator and forms</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('inquiries')}
                      className="text-xs text-sky-400 font-bold hover:underline"
                    >
                      View All ({totalInquiriesCount})
                    </button>
                  </div>

                  <div className="space-y-3">
                    {(!localConfig.inquiries || localConfig.inquiries.length === 0) ? (
                      <div className="p-8 text-center rounded-xl bg-slate-950 border border-slate-800/80 text-slate-500 text-xs italic space-y-1">
                        <div>No new inquiries yet.</div>
                        <div className="text-[10px]">Client submissions from estimators and contact forms will appear here in real-time.</div>
                      </div>
                    ) : (
                      localConfig.inquiries?.slice(0, 3).map(inq => (
                        <div key={inq.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-white">{inq.name}</span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                                inq.status === 'new'
                                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                  : inq.status === 'contacted'
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              }`}
                            >
                              {inq.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 line-clamp-2">{inq.message}</p>
                          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                            <span>Requested: {inq.service} ({inq.budget})</span>
                            <span>{inq.createdAt}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Quick Management Shortland Cards */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                    <h3 className="text-base font-bold text-white">Quick CMS Shortcuts</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={handleCreatePost}
                        className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-sky-500 text-left space-y-1 transition-colors group cursor-pointer"
                      >
                        <Plus className="w-5 h-5 text-sky-400 group-hover:scale-110 transition-transform" />
                        <div className="text-xs font-bold text-white">New Article</div>
                        <div className="text-[10px] text-slate-400">Write blog post</div>
                      </button>

                      <button
                        onClick={() => setActiveTab('pages')}
                        className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-sky-500 text-left space-y-1 transition-colors group cursor-pointer"
                      >
                        <Layers className="w-5 h-5 text-sky-400 group-hover:scale-110 transition-transform" />
                        <div className="text-xs font-bold text-white">Edit Layout</div>
                        <div className="text-[10px] text-slate-400">Manage sections</div>
                      </button>

                      <button
                        onClick={() => setActiveTab('seo')}
                        className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-sky-500 text-left space-y-1 transition-colors group cursor-pointer"
                      >
                        <Sparkles className="w-5 h-5 text-sky-400 group-hover:scale-110 transition-transform" />
                        <div className="text-xs font-bold text-white">SEO Health</div>
                        <div className="text-[10px] text-slate-400">Check keywords</div>
                      </button>

                      <button
                        onClick={() => setActiveTab('backup')}
                        className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-sky-500 text-left space-y-1 transition-colors group cursor-pointer"
                      >
                        <Download className="w-5 h-5 text-sky-400 group-hover:scale-110 transition-transform" />
                        <div className="text-xs font-bold text-white">Export Data</div>
                        <div className="text-[10px] text-slate-400">Download JSON</div>
                      </button>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-sky-900/40 to-cyan-900/40 border border-sky-500/30 rounded-2xl p-6 space-y-2">
                    <div className="flex items-center gap-2 text-sky-300 text-xs font-bold">
                      <ShieldCheck className="w-4 h-4 text-sky-400" />
                      <span>Live Site Configuration</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      All edits performed in this admin suite persist securely to the active database state and exportable JSON architecture.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* TAB 2: COMPLETE PAGE & MODULAR LAYOUT MANAGEMENT */}
          {/* ------------------------------------------------------------- */}
          {activeTab === 'pages' && (
            <div className="space-y-8 max-w-6xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-extrabold text-white">Pages & Modular Section Editor</h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Manage page hierarchy, toggle visibility of home sections, reorder sections, and update titles/CTAs.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-bold">Select Page:</span>
                  <select
                    value={selectedPageId}
                    onChange={(e) => setSelectedPageId(e.target.value)}
                    className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-sky-400 focus:outline-none focus:border-sky-500"
                  >
                    {localConfig.pages?.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.title} ({p.slug})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* PAGE SUB-TABS: SECTIONS VS SEO */}
              <div className="flex bg-slate-900 p-1 rounded-2xl border border-slate-800 w-fit">
                <button
                  type="button"
                  onClick={() => setPageEditorMode('sections')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    pageEditorMode === 'sections' ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>Modular Sections Layout</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPageEditorMode('seo')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    pageEditorMode === 'seo' ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>SEO Settings & Analysis</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-slate-950 text-sky-400 border border-slate-800">
                    Real-Time Audit
                  </span>
                </button>
              </div>

              {/* TAB CONTENT: SEO SETTINGS & ANALYSIS FOR SELECTED PAGE */}
              {pageEditorMode === 'seo' && selectedPage && (
                <div className="space-y-4">
                  <SeoAnalysisPanel
                    focusKeyword={selectedPage.focusKeyword || ''}
                    onFocusKeywordChange={(val) => handleUpdatePageSeoField(selectedPage.id, 'focusKeyword', val)}
                    seoTitle={selectedPage.metaTitle || selectedPage.title || ''}
                    onSeoTitleChange={(val) => handleUpdatePageSeoField(selectedPage.id, 'metaTitle', val)}
                    metaDescription={selectedPage.metaDescription || ''}
                    onMetaDescriptionChange={(val) => handleUpdatePageSeoField(selectedPage.id, 'metaDescription', val)}
                    slug={selectedPage.slug || ''}
                    onSlugChange={(val) => handleUpdatePageSeoField(selectedPage.id, 'slug', val)}
                    ogImage={selectedPage.ogImage || localConfig.seo?.defaultOgImage || ''}
                    onOgImageChange={(val) => handleUpdatePageSeoField(selectedPage.id, 'ogImage', val)}
                    customSchema={selectedPage.customSchema || ''}
                    onCustomSchemaChange={(val) => handleUpdatePageSeoField(selectedPage.id, 'customSchema', val)}
                    content={`${selectedPage.title}\n\n${selectedPage.metaTitle}\n\n${selectedPage.metaDescription}\n\n${selectedPage.sections?.map(s => `${s.name}. ${s.title}. ${s.subtitle}. ${s.badge || ''} ${s.ctaText || ''}`).join('\n\n')}`}
                    entityType="page"
                    entityName={selectedPage.title}
                    onScoreUpdate={(score) => handleUpdatePageSeoField(selectedPage.id, 'seoScore', score)}
                  />
                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => triggerSaveNotification(`SEO settings saved for "${selectedPage.title}"!`)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-sky-500/20 transition-all cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Page SEO to Firestore</span>
                    </button>
                  </div>
                </div>
              )}

              {/* MODULAR SECTION EDITOR BOARD */}
              {pageEditorMode === 'sections' && selectedPage && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <Layers className="w-5 h-5 text-sky-400" />
                        <span>Sections for "{selectedPage.title}"</span>
                      </h3>
                      <p className="text-xs text-slate-400">
                        Use arrows to reorder. Toggle visibility or edit titles & call-to-action buttons.
                      </p>
                    </div>

                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                      {selectedPage.sections.filter(s => s.visible).length} / {selectedPage.sections.length} Sections Active
                    </span>
                  </div>

                  <div className="space-y-3">
                    {selectedPage.sections.map((sec, idx) => {
                      const isEditing = editingSectionId === sec.id;
                      return (
                        <div
                          key={sec.id}
                          className={`rounded-xl border transition-all ${
                            sec.visible
                              ? 'bg-slate-950 border-slate-800 hover:border-sky-500/50'
                              : 'bg-slate-950/40 border-slate-800/50 opacity-60'
                          }`}
                        >
                          <div className="p-4 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              {/* Reorder Buttons */}
                              <div className="flex flex-col gap-1">
                                <button
                                  disabled={idx === 0}
                                  onClick={() => handleMoveSection(sec.id, 'up')}
                                  className="p-1 rounded bg-slate-900 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                                  title="Move Up"
                                >
                                  <ArrowUp className="w-3 h-3" />
                                </button>
                                <button
                                  disabled={idx === selectedPage.sections.length - 1}
                                  onClick={() => handleMoveSection(sec.id, 'down')}
                                  className="p-1 rounded bg-slate-900 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                                  title="Move Down"
                                >
                                  <ArrowDown className="w-3 h-3" />
                                </button>
                              </div>

                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-sky-400">{sec.badge || `Sec ${idx + 1}`}</span>
                                  <span className="text-sm font-extrabold text-white">{sec.name}</span>
                                </div>
                                <p className="text-xs text-slate-400 line-clamp-1">{sec.title}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleToggleSectionVisibility(sec.id)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer flex items-center gap-1.5 ${
                                  sec.visible
                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                    : 'bg-slate-800 text-slate-400 border-slate-700'
                                }`}
                              >
                                {sec.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                                <span>{sec.visible ? 'Visible' : 'Hidden'}</span>
                              </button>

                              <button
                                onClick={() => setEditingSectionId(isEditing ? null : sec.id)}
                                className="px-3 py-1.5 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/30 text-xs font-bold hover:bg-sky-500/20 transition-colors cursor-pointer flex items-center gap-1"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>{isEditing ? 'Close' : 'Edit Section'}</span>
                              </button>
                            </div>
                          </div>

                          {/* Expanded Section Editor */}
                          {isEditing && (
                            <div className="p-4 border-t border-slate-800/80 bg-slate-900/50 space-y-4 rounded-b-xl">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-xs font-bold text-slate-300 mb-1">Section Headline Title</label>
                                  <input
                                    type="text"
                                    value={sec.title}
                                    onChange={(e) => handleUpdateSectionData(sec.id, { title: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-sky-500"
                                  />
                                </div>

                                <div>
                                  <label className="block text-xs font-bold text-slate-300 mb-1">Section Subtitle / Description</label>
                                  <input
                                    type="text"
                                    value={sec.subtitle}
                                    onChange={(e) => handleUpdateSectionData(sec.id, { subtitle: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-sky-500"
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-xs font-bold text-slate-300 mb-1">CTA Button Text (Optional)</label>
                                  <input
                                    type="text"
                                    value={sec.ctaText || ''}
                                    onChange={(e) => handleUpdateSectionData(sec.id, { ctaText: e.target.value })}
                                    placeholder="e.g. Get Started Today"
                                    className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-sky-500"
                                  />
                                </div>

                                <div>
                                  <label className="block text-xs font-bold text-slate-300 mb-1">CTA Button URL / Anchor</label>
                                  <input
                                    type="text"
                                    value={sec.ctaUrl || '#contact'}
                                    onChange={(e) => handleUpdateSectionData(sec.id, { ctaUrl: e.target.value })}
                                    placeholder="#contact or /services"
                                    className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-sky-500"
                                  />
                                </div>
                              </div>

                              <div className="flex justify-end pt-2">
                                <button
                                  onClick={() => {
                                    setEditingSectionId(null);
                                    triggerSaveNotification(`Updated section "${sec.name}"`);
                                  }}
                                  className="px-4 py-1.5 rounded-lg bg-sky-500 text-slate-950 font-bold text-xs"
                                >
                                  Done Editing
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* TAB 3: FULL BLOG & CONTENT MANAGEMENT */}
          {/* ------------------------------------------------------------- */}
          {activeTab === 'posts' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-extrabold text-white">Blog & Content Management</h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Create, edit, search, and manage blog posts with rich markdown and status workflows.
                  </p>
                </div>

                <button
                  onClick={handleCreatePost}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-sky-500/20 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New Article</span>
                </button>
              </div>

              {/* FILTER BAR & BULK ACTIONS */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex flex-1 items-center gap-3 w-full">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={blogSearch}
                      onChange={(e) => setBlogSearch(e.target.value)}
                      placeholder="Search posts by title or keyword..."
                      className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <select
                    value={blogCategoryFilter}
                    onChange={(e) => setBlogCategoryFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-300 focus:outline-none"
                  >
                    {BLOG_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>

                  <select
                    value={blogStatusFilter}
                    onChange={(e) => setBlogStatusFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-300 focus:outline-none"
                  >
                    <option value="All">All Statuses</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>

                {selectedPostIds.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-sky-400 font-bold">{selectedPostIds.length} selected</span>
                    <button
                      onClick={() => handleBulkStatusChange('published')}
                      className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30"
                    >
                      Publish
                    </button>
                    <button
                      onClick={() => handleBulkStatusChange('draft')}
                      className="px-3 py-1 rounded-lg bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30"
                    >
                      Draft
                    </button>
                    <button
                      onClick={handleBulkDelete}
                      className="px-3 py-1 rounded-lg bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>

              {/* POSTS TABLE */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 text-slate-400 uppercase font-bold border-b border-slate-800">
                      <tr>
                        <th className="p-4 w-10">
                          <input
                            type="checkbox"
                            checked={selectedPostIds.length === filteredPosts.length && filteredPosts.length > 0}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedPostIds(filteredPosts.map(p => p.id));
                              } else {
                                setSelectedPostIds([]);
                              }
                            }}
                          />
                        </th>
                        <th className="p-4">Article Title</th>
                        <th className="p-4">Category</th>
                        <th className="p-4 text-center">RankMath SEO</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Date</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {filteredPosts.map(post => {
                        const isSelected = selectedPostIds.includes(post.id);
                        return (
                          <tr key={post.id} className="hover:bg-slate-800/40 transition-colors">
                            <td className="p-4">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedPostIds([...selectedPostIds, post.id]);
                                  } else {
                                    setSelectedPostIds(selectedPostIds.filter(id => id !== post.id));
                                  }
                                }}
                              />
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={post.featuredImage}
                                  alt=""
                                  className="w-10 h-10 rounded-lg object-cover bg-slate-800 shrink-0"
                                />
                                <div>
                                  <div className="font-bold text-white line-clamp-1">{post.title}</div>
                                  <div className="text-[11px] text-slate-400">/{post.slug}</div>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 font-semibold text-slate-300">{post.category}</td>
                            <td className="p-4 text-center">
                              {(() => {
                                const calculated = analyzeSeo({
                                  focusKeyword: post.focusKeyword || '',
                                  seoTitle: post.seoTitle || post.title,
                                  metaDescription: post.metaDescription || post.excerpt,
                                  slug: post.slug,
                                  content: post.content,
                                  ogImage: post.ogImage || post.featuredImage
                                });
                                const finalScore = post.seoScore !== undefined && post.seoScore > 0 ? post.seoScore : calculated.score;
                                return (
                                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono font-extrabold border ${
                                    finalScore >= 81
                                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                      : finalScore >= 51
                                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                                      : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                                  }`}>
                                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                    <span>{finalScore}/100</span>
                                  </span>
                                );
                              })()}
                            </td>
                            <td className="p-4">
                              <button
                                onClick={() =>
                                  onToggleStatus(post.id, post.status === 'published' ? 'draft' : 'published')
                                }
                                className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border cursor-pointer ${
                                  post.status === 'published'
                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                    : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                                }`}
                              >
                                {post.status}
                              </button>
                            </td>
                            <td className="p-4 text-slate-400">{post.publishedAt}</td>
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => {
                                    setEditingPost(post);
                                    setBlogEditorTab('content');
                                    setIsBlogModalOpen(true);
                                  }}
                                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-sky-500 hover:text-slate-950 text-slate-300 transition-colors cursor-pointer"
                                  title="Edit Post"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDuplicatePost(post)}
                                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-sky-500 hover:text-slate-950 text-slate-300 transition-colors cursor-pointer"
                                  title="Duplicate Post"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingPost(post);
                                    setBlogEditorTab('content');
                                    setIsBlogModalOpen(true);
                                  }}
                                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-300 transition-colors cursor-pointer"
                                  title="Preview Post"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm('Delete this article?')) onDeletePost(post.id);
                                  }}
                                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500 hover:text-white text-slate-300 transition-colors cursor-pointer"
                                  title="Delete Post"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          
          {/* TAB 3.5: PORTFOLIO MANAGEMENT */}
          {/* ------------------------------------------------------------- */}
          {activeTab === 'portfolio' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
                    <FolderGit2 className="w-7 h-7 text-sky-400" />
                    <span>Portfolio Management</span>
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Gutenberg Block Editor Studio, Video Embeds, YouTube/Vimeo Showcase, and SEO Engine.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCreatePortfolio}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-sky-500/20 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Project</span>
                  </button>
                </div>
              </div>

              {/* Filters & Search Toolbar */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={portfolioSearch}
                      onChange={(e) => setPortfolioSearch(e.target.value)}
                      placeholder="Search projects by title, client, tags, or description..."
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Video Filter */}
                    <select
                      value={portfolioVideoFilter}
                      onChange={(e) => setPortfolioVideoFilter(e.target.value as any)}
                      className="px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-semibold focus:outline-none focus:border-sky-500"
                    >
                      <option value="All">All Media Types</option>
                      <option value="WithVideo">▶ With Video (YouTube/MP4)</option>
                      <option value="WithoutVideo">📷 Images Only</option>
                    </select>

                    {/* Category Filter */}
                    <select
                      value={portfolioCategoryFilter}
                      onChange={(e) => setPortfolioCategoryFilter(e.target.value)}
                      className="px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-semibold focus:outline-none focus:border-sky-500"
                    >
                      <option value="All">All Categories</option>
                      <option value="websites">Websites & Web Apps</option>
                      <option value="apps">Mobile Apps</option>
                      <option value="logos">Logos & Branding</option>
                      <option value="reels">Video & Reels</option>
                      <option value="seo">SEO & Marketing</option>
                    </select>
                  </div>
                </div>

                {/* Quick Category Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-1">
                  {['All', 'websites', 'apps', 'logos', 'reels', 'seo'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setPortfolioCategoryFilter(cat)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold shrink-0 transition-colors cursor-pointer ${
                        portfolioCategoryFilter === cat
                          ? 'bg-sky-500 text-slate-950'
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {cat === 'All' ? 'All Projects' : cat.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* PORTFOLIO LIST GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(localConfig.portfolio || [])
                  .filter((port) => {
                    const matchesSearch =
                      !portfolioSearch.trim() ||
                      port.title.toLowerCase().includes(portfolioSearch.toLowerCase()) ||
                      port.description?.toLowerCase().includes(portfolioSearch.toLowerCase()) ||
                      port.client?.toLowerCase().includes(portfolioSearch.toLowerCase()) ||
                      (port.tags || []).some((t) => t.toLowerCase().includes(portfolioSearch.toLowerCase()));
                    const matchesCat =
                      portfolioCategoryFilter === 'All' || port.category === portfolioCategoryFilter;
                    const hasVid = Boolean(port.videoUrl || (port.videos && port.videos.length > 0));
                    const matchesVideo =
                      portfolioVideoFilter === 'All' ||
                      (portfolioVideoFilter === 'WithVideo' && hasVid) ||
                      (portfolioVideoFilter === 'WithoutVideo' && !hasVid);
                    return matchesSearch && matchesCat && matchesVideo;
                  })
                  .map((port) => {
                    const hasVid = Boolean(port.videoUrl || (port.videos && port.videos.length > 0));
                    return (
                      <div
                        key={port.id}
                        className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden group hover:border-slate-700 transition-all flex flex-col justify-between"
                      >
                        <div>
                          {/* Card Thumbnail / Video Header */}
                          <div className="h-44 bg-slate-950 relative overflow-hidden">
                            {port.image ? (
                              <img
                                src={port.image}
                                alt={port.title}
                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-600">
                                <FolderGit2 className="w-10 h-10 opacity-40" />
                              </div>
                            )}

                            {/* Top Badges */}
                            <div className="absolute top-2 left-2 flex flex-wrap gap-1.5 z-10">
                              {hasVid && (
                                <span className="px-2 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-sm border border-sky-400/40 text-sky-400 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                                  <span>▶ VIDEO</span>
                                </span>
                              )}
                              {port.featured && (
                                <span className="px-2 py-0.5 rounded-full bg-amber-500/90 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                                  ⭐ FEATURED
                                </span>
                              )}
                            </div>

                            {/* Action Buttons on Hover */}
                            <div className="absolute top-2 right-2 flex items-center gap-1.5 z-10">
                              <button
                                onClick={() => handleEditPortfolio(port)}
                                title="Open Full Studio"
                                className="w-8 h-8 rounded-lg bg-slate-900/90 backdrop-blur-sm text-sky-400 flex items-center justify-center hover:bg-sky-500 hover:text-white transition-colors border border-white/10 shadow-sm cursor-pointer"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeletePortfolio(port.id)}
                                title="Delete Project"
                                className="w-8 h-8 rounded-lg bg-slate-900/90 backdrop-blur-sm text-rose-400 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-colors border border-white/10 shadow-sm cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            <div className="absolute bottom-2 left-2 px-2.5 py-1 bg-slate-950/80 backdrop-blur-sm rounded-lg border border-white/10 text-[10px] font-bold text-white uppercase tracking-wider">
                              {port.categoryLabel || port.category}
                            </div>

                            {port.seoScore && (
                              <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 rounded text-[10px] font-bold">
                                SEO {port.seoScore}%
                              </div>
                            )}
                          </div>

                          {/* Card Details */}
                          <div className="p-5 space-y-3">
                            <h3 className="text-sm font-bold text-white group-hover:text-sky-400 transition-colors truncate">
                              {port.title}
                            </h3>
                            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                              {port.description}
                            </p>

                            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800">
                              {port.client ? (
                                <span className="truncate max-w-[150px]">
                                  <strong className="text-slate-300">Client:</strong> {port.client}
                                </span>
                              ) : (
                                <span>Netronomic Studio</span>
                              )}
                              {port.stats && (
                                <span className="font-bold text-emerald-400">
                                  {port.stats}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Card Footer with Quick Edit */}
                        <div className="p-3 bg-slate-950/50 border-t border-slate-800/80 flex items-center justify-between">
                          <span className="text-[10px] text-slate-500 font-semibold">
                            {port.date || '2026'}
                          </span>
                          <button
                            onClick={() => handleEditPortfolio(port)}
                            className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1 cursor-pointer"
                          >
                            <span>Open in Studio</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}

                {(localConfig.portfolio || []).length === 0 && (
                  <div className="col-span-full py-16 text-center border-2 border-dashed border-slate-800 rounded-3xl bg-slate-900/50">
                    <FolderGit2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-slate-300">No Portfolio Projects Found</h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                      Click "Add New Project" to open the Portfolio Gutenberg Studio with video support and SEO tools.
                    </p>
                    <button
                      onClick={handleCreatePortfolio}
                      className="mt-4 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-lg shadow-sky-500/20 transition-all cursor-pointer"
                    >
                      Create First Project
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* PORTFOLIO GUTENBERG STUDIO (FULL BLOG-FEATURE SUITE + VIDEO FEATURE) */}
          <AnimatePresence>
            {isPortfolioModalOpen && editingPortfolio && (
              <PortfolioEditorStudio
                portfolio={editingPortfolio}
                categories={[
                  { id: 'websites', label: 'Website Design & Development' },
                  { id: 'apps', label: 'Mobile App Design' },
                  { id: 'logos', label: 'Logo & Poster Design' },
                  { id: 'reels', label: 'Short-Form Reel Editing' },
                  { id: 'seo', label: 'SEO & Backlinks' }
                ]}
                onSave={(updatedPort) => {
                  const currentList = localConfig.portfolio || [];
                  const exists = currentList.find((p) => p.id === updatedPort.id);
                  let newList;
                  if (exists) {
                    newList = currentList.map((p) =>
                      p.id === updatedPort.id ? ({ ...p, ...updatedPort } as PortfolioItem) : p
                    );
                  } else {
                    newList = [updatedPort as PortfolioItem, ...currentList];
                  }
                  const updatedConfig = { ...localConfig, portfolio: newList };
                  setLocalConfig(updatedConfig);
                  onSaveSiteConfig(updatedConfig);
                  setSavedSuccessMsg('Portfolio project saved successfully!');
                  setTimeout(() => setSavedSuccessMsg(''), 3000);
                  setIsPortfolioModalOpen(false);
                  setEditingPortfolio(null);
                }}
                onClose={() => {
                  setIsPortfolioModalOpen(false);
                  setEditingPortfolio(null);
                }}
              />
            )}
          </AnimatePresence>

          {/* TAB 4: ADVANCED SEO SUITE (YOAST / RANKMATH STYLE) */}
          {/* ------------------------------------------------------------- */}
          {activeTab === 'seo' && (
            <div className="space-y-8 max-w-6xl mx-auto">
              <div>
                <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-sky-400" />
                  <span>Advanced SEO Suite & On-Page Health Check</span>
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Full-stack technical SEO engine: Social OpenGraph previews, crawler directives, verification tokens, and tracking injections.
                </p>
              </div>

              {/* GLOBAL SEO SETTINGS BOARD */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
                <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">
                  Global Site SEO & Indexing
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Canonical URL Domain</label>
                      <input
                        type="text"
                        value={localConfig.seo?.canonicalUrl || ''}
                        onChange={(e) =>
                          setLocalConfig({
                            ...localConfig,
                            seo: { ...localConfig.seo, canonicalUrl: e.target.value },
                          })
                        }
                        className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-sky-500"
                      />
                    </div>
                    <div className="pt-1">
                      <label className="flex items-center gap-3 cursor-pointer select-none p-3 rounded-xl bg-slate-950 border border-slate-800">
                        <input
                          type="checkbox"
                          checked={localConfig.seo?.allowIndexing !== false}
                          onChange={(e) =>
                            setLocalConfig({
                              ...localConfig,
                              seo: { ...localConfig.seo, allowIndexing: e.target.checked },
                            })
                          }
                          className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-sky-500 focus:ring-sky-500 cursor-pointer"
                        />
                        <div>
                          <span className="text-xs font-bold text-white block">Search Engine Visibility (Allow Google Indexing)</span>
                          <span className="text-[10px] text-slate-400 block">When disabled, injects &lt;meta name="robots" content="noindex, nofollow"&gt;.</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Google Site Verification (Search Console)</label>
                    <input
                      type="text"
                      value={localConfig.seo?.googleSiteVerification || ''}
                      onChange={(e) =>
                        setLocalConfig({
                          ...localConfig,
                          seo: { ...localConfig.seo, googleSiteVerification: e.target.value },
                        })
                      }
                      placeholder="e.g. 1O58y68drsW0R2i79KCJdV_4JNK1IdlMxWOe80dxsq4"
                      className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-sky-500"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      Injected as &lt;meta name="google-site-verification" content="..."&gt; in &lt;head&gt;
                    </p>
                  </div>

                  <MediaPickerField
                    label="Default OpenGraph Social Image"
                    value={localConfig.seo?.defaultOgImage || ''}
                    onChange={(url) =>
                      setLocalConfig({
                        ...localConfig,
                        seo: { ...localConfig.seo, defaultOgImage: url },
                      })
                    }
                    category="banner"
                    helperText="Displayed when sharing link on Facebook, LinkedIn, Twitter, and WhatsApp."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Robots.txt Content</label>
                    <textarea
                      rows={4}
                      value={localConfig.seo?.robotsTxt || ''}
                      onChange={(e) =>
                        setLocalConfig({
                          ...localConfig,
                          seo: { ...localConfig.seo, robotsTxt: e.target.value },
                        })
                      }
                      className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-sky-300 focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Header Scripts Injection (`&lt;head&gt;` GTM / GA4)</label>
                    <textarea
                      rows={4}
                      value={localConfig.seo?.headerScripts || ''}
                      onChange={(e) =>
                        setLocalConfig({
                          ...localConfig,
                          seo: { ...localConfig.seo, headerScripts: e.target.value },
                        })
                      }
                      className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-amber-200 focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                {/* SOCIAL OPENGRAPH PREVIEW CARD */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    OpenGraph Social Sharing Preview (Facebook / LinkedIn / Twitter)
                  </div>
                  <div className="max-w-md rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-lg">
                    <img
                      src={localConfig.seo?.defaultOgImage || '/og-image.png'}
                      alt="OG Preview"
                      className="w-full h-40 object-cover bg-slate-800"
                    />
                    <div className="p-4 space-y-1">
                      <div className="text-[10px] uppercase font-bold text-slate-500">
                        {localConfig.seo?.canonicalUrl || 'NETRONOMIC.COM'}
                      </div>
                      <div className="text-sm font-bold text-white">
                        {localConfig.seo?.defaultOgTitle || localConfig.logo?.brandName}
                      </div>
                      <div className="text-xs text-slate-400 line-clamp-2">
                        {localConfig.seo?.defaultOgDescription || localConfig.hero?.subtitle}
                      </div>
                    </div>
                  </div>
                </div>

                {/* WORDPRESS CMS INTEGRATION & SYNC */}
                <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                  <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                    <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                      <Globe className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">WordPress Website & CMS Integration</h3>
                      <p className="text-xs text-slate-400">Connect your WordPress site via REST API to automatically sync posts and articles.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-300 mb-1">WordPress Site URL</label>
                      <input
                        type="text"
                        value={localConfig.seo?.wordpressUrl || ''}
                        onChange={(e) =>
                          setLocalConfig({
                            ...localConfig,
                            seo: { ...localConfig.seo, wordpressUrl: e.target.value },
                          })
                        }
                        placeholder="e.g. https://mywordpresssite.com"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <button
                        onClick={handleSyncWordPress}
                        disabled={isSyncingWp}
                        className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-900/30 transition-all cursor-pointer disabled:opacity-50"
                      >
                        {isSyncingWp ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Syncing...</span>
                          </>
                        ) : (
                          <>
                            <Zap className="w-4 h-4" />
                            <span>Sync WordPress Posts</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {wpSyncStatus && (
                    <div className={`p-3 rounded-xl text-xs font-mono border ${
                      wpSyncStatus.includes('Successfully') || wpSyncStatus.includes('Synced')
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                        : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                    }`}>
                      {wpSyncStatus}
                    </div>
                  )}
                </div>

                {/* COMPREHENSIVE SITEMAP XML MANAGEMENT SUITE */}
                <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
                        <FileCode className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-white">Sitemap XML Management Suite</h3>
                          <span className="px-2.5 py-0.5 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-400 text-[10px] font-black uppercase tracking-wider">
                            Search Console Live Sync
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Directly inspect, validate, clean, and manage your production sitemap.xml for strict Google SEO compliance.
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const xml = localConfig.seo?.sitemapXml || DEFAULT_SITEMAP_XML;
                          if (xml.includes('#')) {
                            alert('⚠️ GSC Compliance Warning: Sitemap contains hash (#) fragment URLs which Google Search Console rejects!');
                          } else if (!xml.includes('<urlset')) {
                            alert('❌ XML Error: Invalid sitemap structure.');
                          } else {
                            alert('✅ Success! Sitemap is fully compliant with Google Search Console standards. No hash fragments detected.');
                          }
                        }}
                        className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Check GSC Compliance</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          let xml = localConfig.seo?.sitemapXml || DEFAULT_SITEMAP_XML;
                          const urlBlocks = xml.split('</url>');
                          const cleanedBlocks = urlBlocks.filter(block => !block.includes('#'));
                          const newXml = cleanedBlocks.join('</url>');
                          setLocalConfig({
                            ...localConfig,
                            seo: { ...localConfig.seo, sitemapXml: newXml },
                          });
                          triggerSaveNotification('Auto-stripped invalid hash URLs from sitemap!');
                        }}
                        className="px-3 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Auto-Strip Invalid Hash URLs</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const xmlContent = localConfig.seo?.sitemapXml || DEFAULT_SITEMAP_XML;
                          const blob = new Blob([xmlContent], { type: 'application/xml;charset=utf-8;' });
                          const url = URL.createObjectURL(blob);
                          const link = document.createElement('a');
                          link.href = url;
                          link.setAttribute('download', 'sitemap.xml');
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                          triggerSaveNotification('sitemap.xml downloaded successfully!');
                        }}
                        className="px-3 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-lg shadow-sky-900/30"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download sitemap.xml</span>
                      </button>
                    </div>
                  </div>

                  {/* URL INSERTION HELPER FORM */}
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                        <PlusCircle className="w-4 h-4 text-sky-400" />
                        <span>Quick URL Insertion Helper</span>
                      </div>
                      <span className="text-[10px] text-slate-400">Appends formatted XML tag instantly</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                      <div className="sm:col-span-5">
                        <label className="block text-[11px] font-bold text-slate-400 mb-1">Page URL</label>
                        <input
                          type="text"
                          placeholder="https://netronomicweb.com/services"
                          value={sitemapUrlInput}
                          onChange={(e) => setSitemapUrlInput(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-sky-500"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-slate-400 mb-1">Priority</label>
                        <select
                          value={sitemapPriorityInput}
                          onChange={(e) => setSitemapPriorityInput(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-sky-500"
                        >
                          <option value="1.0">1.0 (Highest)</option>
                          <option value="0.9">0.9</option>
                          <option value="0.8">0.8 (Standard)</option>
                          <option value="0.7">0.7</option>
                          <option value="0.5">0.5 (Low)</option>
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-slate-400 mb-1">Changefreq</label>
                        <select
                          value={sitemapChangefreqInput}
                          onChange={(e) => setSitemapChangefreqInput(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-sky-500"
                        >
                          <option value="daily">daily</option>
                          <option value="weekly">weekly</option>
                          <option value="monthly">monthly</option>
                          <option value="yearly">yearly</option>
                        </select>
                      </div>
                      <div className="sm:col-span-3 flex items-end">
                        <button
                          type="button"
                          onClick={() => {
                            if (!sitemapUrlInput.trim()) {
                              alert('Please enter a valid URL.');
                              return;
                            }
                            if (sitemapUrlInput.includes('#')) {
                              alert('Warning: Entering URLs with hash (#) fragments is discouraged for GSC compliance.');
                            }
                            const currentXml = localConfig.seo?.sitemapXml || DEFAULT_SITEMAP_XML;
                            const newUrlBlock = `  <url>\n    <loc>${sitemapUrlInput.trim()}</loc>\n    <lastmod>${sitemapLastmodInput}</lastmod>\n    <changefreq>${sitemapChangefreqInput}</changefreq>\n    <priority>${sitemapPriorityInput}</priority>\n  </url>\n`;
                            
                            let updated = currentXml;
                            if (currentXml.includes('</urlset>')) {
                              updated = currentXml.replace('</urlset>', newUrlBlock + '</urlset>');
                            } else {
                              updated = currentXml + '\n' + newUrlBlock;
                            }

                            setLocalConfig({
                              ...localConfig,
                              seo: { ...localConfig.seo, sitemapXml: updated },
                            });
                            setSitemapUrlInput('');
                            triggerSaveNotification('New URL added to sitemap!');
                          }}
                          className="w-full py-2 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                        >
                          <PlusCircle className="w-4 h-4" />
                          <span>Add URL to Sitemap</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* LIVE XML CODE EDITOR */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                        <span>XML Source Code Editor</span>
                        <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">UTF-8 Encoded</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setLocalConfig({
                            ...localConfig,
                            seo: { ...localConfig.seo, sitemapXml: DEFAULT_SITEMAP_XML },
                          });
                          triggerSaveNotification('Sitemap reset to clean default 6 URLs!');
                        }}
                        className="text-xs font-bold text-slate-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset to Clean Default</span>
                      </button>
                    </div>

                    <textarea
                      rows={14}
                      value={localConfig.seo?.sitemapXml || DEFAULT_SITEMAP_XML}
                      onChange={(e) =>
                        setLocalConfig({
                          ...localConfig,
                          seo: { ...localConfig.seo, sitemapXml: e.target.value },
                        })
                      }
                      className="w-full p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-emerald-300 focus:outline-none focus:border-sky-500 leading-relaxed shadow-inner"
                    />

                    {/* METRICS BAR */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-400 mt-2 px-1 gap-2">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5 font-semibold text-slate-300">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                          Total URLs Indexed: {(localConfig.seo?.sitemapXml || DEFAULT_SITEMAP_XML).match(/<loc>/g)?.length || 0}
                        </span>
                        <span>Character Size: {(localConfig.seo?.sitemapXml || DEFAULT_SITEMAP_XML).length} bytes</span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Last Modified Detected: <span className="text-slate-200 font-mono">{sitemapLastmodInput}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* TAB 5: GLOBAL BRANDING & LOGO */}
          {/* ------------------------------------------------------------- */}
          {activeTab === 'branding' && (
            <div className="space-y-8 max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h1 className="text-xl font-extrabold text-white border-b border-slate-800 pb-3">
                Global Site Branding & Colors
              </h1>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Brand Name</label>
                  <input
                    type="text"
                    value={localConfig.logo?.brandName || ''}
                    onChange={(e) =>
                      setLocalConfig({
                        ...localConfig,
                        logo: { ...localConfig.logo, brandName: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Brand Tagline</label>
                  <input
                    type="text"
                    value={localConfig.logo?.taglineText || ''}
                    onChange={(e) =>
                      setLocalConfig({
                        ...localConfig,
                        logo: { ...localConfig.logo, taglineText: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              {/* Header Logo Settings */}
              <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-sky-400 uppercase tracking-wider">Header Logo Settings</h3>
                <MediaPickerField
                  label="Header Brand Logo Image"
                  value={localConfig.logo?.customLogoUrl || ''}
                  onChange={(url) =>
                    setLocalConfig({
                      ...localConfig,
                      logo: { ...localConfig.logo, customLogoUrl: url, iconVariant: url ? 'custom-image' : localConfig.logo?.iconVariant || 'network-orb' },
                    })
                  }
                  category="logo"
                  helperText="Upload header logo or select from Media Library. (Used in navbar header)"
                />
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Header Logo Icon Mode</label>
                  <select
                    value={localConfig.logo?.iconVariant || 'network-orb'}
                    onChange={(e) =>
                      setLocalConfig({
                        ...localConfig,
                        logo: { ...localConfig.logo, iconVariant: e.target.value as any },
                      })
                    }
                    className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-sky-500"
                  >
                    <option value="network-orb">Default Vector Orb</option>
                    <option value="custom-image">Custom Image (Upload above)</option>
                    <option value="none">Hide Icon Entirely</option>
                  </select>
                </div>
              </div>

              {/* Footer Logo Settings */}
              <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-sky-400 uppercase tracking-wider">Footer Logo Settings</h3>
                <MediaPickerField
                  label="Footer Brand Logo Image"
                  value={localConfig.logo?.footerLogoUrl || ''}
                  onChange={(url) =>
                    setLocalConfig({
                      ...localConfig,
                      logo: { ...localConfig.logo, footerLogoUrl: url, footerIconVariant: url ? 'custom-image' : localConfig.logo?.footerIconVariant || 'network-orb' },
                    })
                  }
                  category="logo"
                  helperText="Upload footer logo or select from Media Library. (Used independently in website footer)"
                />
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Footer Logo Icon Mode</label>
                  <select
                    value={localConfig.logo?.footerIconVariant || 'network-orb'}
                    onChange={(e) =>
                      setLocalConfig({
                        ...localConfig,
                        logo: { ...localConfig.logo, footerIconVariant: e.target.value as any },
                      })
                    }
                    className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-sky-500"
                  >
                    <option value="network-orb">Default Vector Orb</option>
                    <option value="custom-image">Custom Image (Upload above)</option>
                    <option value="none">Hide Icon Entirely</option>
                  </select>
                </div>
              </div>

              {/* Favicon Settings */}
              <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-sky-400 uppercase tracking-wider">Browser Favicon Asset</h3>
                <MediaPickerField
                  label="Favicon Asset (32x32 / 48x48)"
                  value={localConfig.logo?.faviconUrl || '/favicon.ico'}
                  onChange={(url) =>
                    setLocalConfig({
                      ...localConfig,
                      logo: { ...localConfig.logo, faviconUrl: url },
                    })
                  }
                  category="logo"
                  helperText="Upload favicon icon file (.ico, .png) for browser tab display."
                />
              </div>
              {/* Logo Layout & Custom Button Options */}
              <div className="pt-6 border-t border-slate-800">
                <h2 className="text-lg font-bold text-white mb-4">Logo Image & Layout Controls</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Global Logo Size ({localConfig.logo?.logoSize || 100}%)
                    </label>
                    <input
                      type="range"
                      min="20"
                      max="300"
                      value={localConfig.logo?.logoSize || 100}
                      onChange={(e) =>
                        setLocalConfig({
                          ...localConfig,
                          logo: { ...localConfig.logo, logoSize: parseInt(e.target.value) },
                        })
                      }
                      className="w-full mt-2 accent-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Header Logo Alignment
                    </label>
                    <select
                      value={localConfig.logo?.headerLogoAlign || 'left'}
                      onChange={(e) =>
                        setLocalConfig({
                          ...localConfig,
                          logo: { ...localConfig.logo, headerLogoAlign: e.target.value as any },
                        })
                      }
                      className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-sky-500"
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Footer Logo Alignment
                    </label>
                    <select
                      value={localConfig.logo?.footerLogoAlign || 'left'}
                      onChange={(e) =>
                        setLocalConfig({
                          ...localConfig,
                          logo: { ...localConfig.logo, footerLogoAlign: e.target.value as any },
                        })
                      }
                      className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-sky-500"
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Gap between Icon & Text ({localConfig.logo?.gap !== undefined ? localConfig.logo.gap : 12}px)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="40"
                      value={localConfig.logo?.gap !== undefined ? localConfig.logo.gap : 12}
                      onChange={(e) =>
                        setLocalConfig({
                          ...localConfig,
                          logo: { ...localConfig.logo, gap: parseInt(e.target.value) },
                        })
                      }
                      className="w-full mt-2 accent-sky-500"
                    />
                  </div>
                  <div className="flex items-center mt-6">
                    <input
                      type="checkbox"
                      id="showTagline"
                      checked={localConfig.logo?.showTagline !== false}
                      onChange={(e) =>
                        setLocalConfig({
                          ...localConfig,
                          logo: { ...localConfig.logo, showTagline: e.target.checked },
                        })
                      }
                      className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-sky-500 focus:ring-sky-500 focus:ring-offset-slate-950"
                    />
                    <label htmlFor="showTagline" className="ml-2 text-sm text-slate-300 font-semibold cursor-pointer">
                      Show Tagline under Brand Name
                    </label>
                  </div>
                </div>
              </div>

              <div className="p-5 border border-sky-500/30 bg-sky-950/20 rounded-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-sky-400">Custom Action Button Instead of Text</h3>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="showCustomButton"
                        checked={localConfig.logo?.showCustomButton || false}
                        onChange={(e) =>
                          setLocalConfig({
                            ...localConfig,
                            logo: { ...localConfig.logo, showCustomButton: e.target.checked },
                          })
                        }
                        className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-sky-500 focus:ring-sky-500 focus:ring-offset-slate-950"
                      />
                      <label htmlFor="showCustomButton" className="ml-2 text-xs text-sky-200 font-bold cursor-pointer">
                        Replace Text with Button
                      </label>
                    </div>
                  </div>
                  
                  {localConfig.logo?.showCustomButton && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 mb-1">Button Text</label>
                        <input
                          type="text"
                          value={localConfig.logo?.customButtonText || ''}
                          placeholder="e.g., Click Here"
                          onChange={(e) =>
                            setLocalConfig({
                              ...localConfig,
                              logo: { ...localConfig.logo, customButtonText: e.target.value },
                            })
                          }
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-sky-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 mb-1">Button Link / URL</label>
                        <input
                          type="text"
                          value={localConfig.logo?.customButtonUrl || ''}
                          placeholder="https://..."
                          onChange={(e) =>
                            setLocalConfig({
                              ...localConfig,
                              logo: { ...localConfig.logo, customButtonUrl: e.target.value },
                            })
                          }
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-sky-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 mb-1">Button Color</label>
                        <select
                          value={localConfig.logo?.customButtonColor || 'sky'}
                          onChange={(e) =>
                            setLocalConfig({
                              ...localConfig,
                              logo: { ...localConfig.logo, customButtonColor: e.target.value },
                            })
                          }
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-sky-500"
                        >
                          <option value="sky">Sky Blue</option>
                          <option value="emerald">Emerald Green</option>
                          <option value="rose">Rose Red</option>
                          <option value="indigo">Indigo Purple</option>
                          <option value="slate">Dark Slate</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-2 justify-end pb-1">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={localConfig.logo?.customButtonShine || false}
                            onChange={(e) =>
                              setLocalConfig({
                                ...localConfig,
                                logo: { ...localConfig.logo, customButtonShine: e.target.checked },
                              })
                            }
                            className="w-3.5 h-3.5 rounded border-slate-700 bg-slate-900 text-sky-500"
                          />
                          <span className="ml-2 text-[11px] text-slate-300">Enable Shine Animation</span>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={localConfig.logo?.customButtonBorder || false}
                            onChange={(e) =>
                              setLocalConfig({
                                ...localConfig,
                                logo: { ...localConfig.logo, customButtonBorder: e.target.checked },
                              })
                            }
                            className="w-3.5 h-3.5 rounded border-slate-700 bg-slate-900 text-sky-500"
                          />
                          <span className="ml-2 text-[11px] text-slate-300">Show Light Border</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => triggerSaveNotification('Branding updated!')}
                  className="px-6 py-2.5 rounded-xl bg-sky-500 text-slate-950 font-bold text-xs"
                >
                  Save Branding Settings
                </button>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* TAB 6: AGENCY & CONTACT DETAILS */}
          {/* ------------------------------------------------------------- */}
          
          {activeTab === 'social' && (
            <div className="space-y-8 max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h1 className="text-xl font-extrabold text-white">
                  Social Media Platforms
                </h1>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="hideAllSocial"
                    checked={localConfig.agency?.social?.hideAll || false}
                    onChange={(e) =>
                      setLocalConfig({
                        ...localConfig,
                        agency: {
                          ...localConfig.agency,
                          social: {
                            ...localConfig.agency?.social,
                            hideAll: e.target.checked
                          }
                        } as any
                      })
                    }
                    className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-sky-500 focus:ring-sky-500"
                  />
                  <label htmlFor="hideAllSocial" className="text-sm font-bold text-slate-300 cursor-pointer">
                    Hide All Social Icons
                  </label>
                </div>
              </div>
              <p className="text-xs text-slate-400">Manage all your social media platforms here. To hide a specific platform, just clear its URL.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                {[
                  { id: 'facebook', label: 'Facebook Profile URL', placeholder: 'https://facebook.com/yourprofile', icon: Facebook, color: 'text-blue-500 bg-blue-500/10' },
                  { id: 'instagram', label: 'Instagram Profile URL', placeholder: 'https://instagram.com/yourprofile', icon: Instagram, color: 'text-pink-500 bg-pink-500/10' },
                  { id: 'twitter', label: 'X (formerly Twitter) Profile URL', placeholder: 'https://x.com/yourprofile', icon: Twitter, color: 'text-sky-400 bg-sky-400/10' },
                  { id: 'linkedin', label: 'LinkedIn Profile URL', placeholder: 'https://linkedin.com/in/yourprofile', icon: Linkedin, color: 'text-blue-400 bg-blue-400/10' },
                  { id: 'youtube', label: 'YouTube Channel URL', placeholder: 'https://youtube.com/@yourchannel', icon: Youtube, color: 'text-rose-500 bg-rose-500/10' },
                  { id: 'github', label: 'GitHub Profile URL', placeholder: 'https://github.com/yourprofile', icon: Github, color: 'text-purple-400 bg-purple-400/10' },
                  { id: 'tiktok', label: 'TikTok Profile URL', placeholder: 'https://tiktok.com/@yourprofile', icon: Music2, color: 'text-teal-400 bg-teal-400/10' },
                  { id: 'pinterest', label: 'Pinterest Profile URL', placeholder: 'https://pinterest.com/yourprofile', icon: Pin, color: 'text-red-400 bg-red-400/10' },
                ].map(({ id: network, label, placeholder, icon: NetIcon, color }) => (
                  <div key={network} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${color} shrink-0`}>
                        <NetIcon className="w-3.5 h-3.5" />
                      </div>
                      <label className="block text-xs font-bold text-slate-300">{label}</label>
                    </div>
                    <input
                      type="text"
                      value={(localConfig.agency?.social as any)?.[network] || ''}
                      onChange={(e) =>
                        setLocalConfig({
                          ...localConfig,
                          agency: {
                            ...localConfig.agency,
                            social: {
                              ...localConfig.agency?.social,
                              [network]: e.target.value.trim()
                            }
                          } as any
                        })
                      }
                      placeholder={placeholder}
                      className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-sky-500 transition-colors"
                    />
                  </div>
                ))}
              </div>
              
              <div className="pt-6 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => triggerSaveNotification('Social Media updated!')}
                  className="px-6 py-2.5 rounded-xl bg-sky-500 text-slate-950 font-bold text-xs hover:bg-sky-400 transition-colors cursor-pointer"
                >
                  Save Social Settings
                </button>
              </div>
            </div>
          )}

          {activeTab === 'agency' && (
            <div className="space-y-8 max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h1 className="text-xl font-extrabold text-white border-b border-slate-800 pb-3">
                Agency Details & Contact Info
              </h1>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">WhatsApp Number or Full Link</label>
                  <input
                    type="text"
                    value={localConfig.agency?.whatsappNumber || ''}
                    onChange={(e) =>
                      setLocalConfig({
                        ...localConfig,
                        agency: { ...localConfig.agency, whatsappNumber: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={localConfig.agency?.phone || ''}
                    onChange={(e) =>
                      setLocalConfig({
                        ...localConfig,
                        agency: { ...localConfig.agency, phone: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Contact Email</label>
                  <input
                    type="email"
                    value={localConfig.agency?.email || ''}
                    onChange={(e) =>
                      setLocalConfig({
                        ...localConfig,
                        agency: { ...localConfig.agency, email: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Business Hours</label>
                  <input
                    type="text"
                    value={localConfig.agency?.hours || ''}
                    onChange={(e) =>
                      setLocalConfig({
                        ...localConfig,
                        agency: { ...localConfig.agency, hours: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Physical Headquarters Address</label>
                <input
                  type="text"
                  value={localConfig.agency?.address || ''}
                  onChange={(e) =>
                    setLocalConfig({
                      ...localConfig,
                      agency: { ...localConfig.agency, address: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => triggerSaveNotification('Agency contact info updated!')}
                  className="px-6 py-2.5 rounded-xl bg-sky-500 text-slate-950 font-bold text-xs"
                >
                  Save Agency Details
                </button>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* TAB 7: CONTACT INQUIRIES & LEADS MANAGER */}
          {/* ------------------------------------------------------------- */}
          {activeTab === 'inquiries' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-extrabold text-white">Contact Inquiries & Leads</h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Manage form submissions, budget preferences, and respond directly via WhatsApp or Email.
                  </p>
                </div>
              </div>

              {/* Status Filter Bar */}
              <div className="flex items-center gap-2 border-b border-slate-800 pb-4 overflow-x-auto">
                {(['all', 'new', 'contacted', 'closed'] as const).map(tab => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setInquiryFilter(tab)}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer whitespace-nowrap ${
                      inquiryFilter === tab
                        ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                        : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {tab} {tab === 'all' ? `(${localConfig.inquiries?.length || 0})` : `(${localConfig.inquiries?.filter(i => i.status === tab).length || 0})`}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                {(() => {
                  const filteredInquiries = (localConfig.inquiries || []).filter(inq => {
                    if (inquiryFilter === 'all') return true;
                    return inq.status === inquiryFilter;
                  });

                  if (filteredInquiries.length === 0) {
                    return (
                      <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 text-xs space-y-2">
                        <MessageSquare className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                        <div className="font-bold text-slate-300">No new inquiries yet</div>
                        <p>Submissions from the website contact form will appear here in real time.</p>
                      </div>
                    );
                  }

                  return filteredInquiries.map((inq) => (
                    <div
                      key={inq.id}
                      className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                        <div>
                          <div className="flex items-center gap-2.5">
                            <h3 className="text-base font-bold text-white">{inq.name}</h3>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              inq.status === 'new' ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30' :
                              inq.status === 'contacted' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                              'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            }`}>
                              {inq.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">{inq.email} • {inq.phone}</p>
                        </div>

                        <div className="flex items-center flex-wrap gap-2">
                          <select
                            value={inq.status}
                            onChange={(e) =>
                              handleInquiryStatusChange(inq.id, e.target.value as 'new' | 'contacted' | 'closed')
                            }
                            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-300 focus:outline-none"
                          >
                            <option value="new">Mark New</option>
                            <option value="contacted">Mark Contacted</option>
                            <option value="closed">Mark Closed</option>
                          </select>

                          <a
                            href={`mailto:${inq.email}?subject=Regarding your inquiry at Netronomic`}
                            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-400 text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-700 shadow-xs"
                            title="Send email reply"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            Email Reply
                          </a>

                          <a
                            href={(localConfig.agency?.whatsappNumber?.startsWith('http') ? localConfig.agency?.whatsappNumber : `https://wa.me/${localConfig.agency?.whatsappNumber || '923020487103'}`)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="whatsapp-shine-btn px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                            title="Message via WhatsApp"
                          >
                            WhatsApp Reply
                          </a>

                          <button
                            type="button"
                            onClick={() => handleDeleteInquiry(inq.id)}
                            className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-all cursor-pointer"
                            title="Delete Inquiry"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">{inq.message}</p>

                      <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
                        <span>Service: <strong className="text-sky-400">{inq.service}</strong></span>
                        <span>Budget: <strong className="text-emerald-400">{inq.budget}</strong></span>
                        <span>Date: {inq.createdAt}</span>
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* TAB 8: MEDIA LIBRARY */}
          {/* ------------------------------------------------------------- */}
          {activeTab === 'media' && (
            <AdminMediaManager />
          )}

          {/* ------------------------------------------------------------- */}
          {/* TAB 9: DATA BACKUP, EXPORT & IMPORT */}
          {/* ------------------------------------------------------------- */}
          {activeTab === 'backup' && (
            <div className="space-y-8 max-w-4xl mx-auto">
              <div>
                <h1 className="text-2xl font-extrabold text-white">Data Backup, Export & Import</h1>
                <p className="text-xs text-slate-400 mt-1">
                  Export site configuration to JSON for offline backup, or restore data safely.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Export Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <Download className="w-6 h-6 text-sky-400" />
                    <h3 className="text-base font-bold text-white">Export Site Backup</h3>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Downloads complete JSON package containing all page structures, blog posts, SEO configurations, and agency info.
                  </p>
                  <div className="space-y-3">
                    <button
                      onClick={handleExportJSON}
                      className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-md shadow-sky-500/20 transition-all cursor-pointer"
                    >
                      Download JSON Backup File
                    </button>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                      <span className="font-bold text-slate-300">Last Backup Exported:</span>
                      <span className="text-sky-400 font-mono">{lastExportedAt}</span>
                    </div>
                  </div>
                </div>

                {/* Reset to Factory Defaults Card */}
                <div className="bg-slate-900 border border-rose-900/50 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <RotateCcw className="w-6 h-6 text-rose-400" />
                    <h3 className="text-base font-bold text-white">Factory Reset</h3>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Reset all site data and configurations back to initial agency defaults.
                  </p>
                  <button
                    onClick={() => {
                      setResetConfirmInput('');
                      setShowResetModal(true);
                    }}
                    className="w-full py-2.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 font-bold text-xs hover:bg-rose-500/30 transition-all cursor-pointer"
                  >
                    Reset to Factory Defaults
                  </button>
                </div>
              </div>

              {/* Import JSON Box */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Upload className="w-6 h-6 text-sky-400" />
                    <h3 className="text-base font-bold text-white">Restore / Import JSON Data</h3>
                  </div>
                  <div>
                    <input
                      ref={backupFileInputRef}
                      type="file"
                      accept=".json,application/json"
                      className="hidden"
                      onChange={handleRestoreFileUpload}
                    />
                    <button
                      onClick={() => backupFileInputRef.current?.click()}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-400 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      📁 Upload .json Backup File
                    </button>
                  </div>
                </div>

                <textarea
                  rows={6}
                  value={importJsonText}
                  onChange={(e) => setImportJsonText(e.target.value)}
                  placeholder="Paste backup JSON content here..."
                  className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-sky-300 focus:outline-none focus:border-sky-500"
                />

                {importError && (
                  <p className="text-xs font-bold text-rose-400">{importError}</p>
                )}

                <button
                  onClick={() => validateAndRestoreJSON(importJsonText)}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs cursor-pointer shadow-md shadow-emerald-500/20 hover:bg-emerald-400 transition-all"
                >
                  Import Data Now
                </button>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* TAB 10: ADMIN USERS & SECURITY MANAGEMENT */}
          {/* ------------------------------------------------------------- */}
          {activeTab === 'users' && (
            <div className="space-y-8 max-w-5xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
                    <ShieldCheck className="w-7 h-7 text-sky-400" />
                    <span>Admin Users & Authentication Security</span>
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Manage administrator accounts, user roles, security settings, and password policies.
                  </p>
                </div>

                <button
                  onClick={() => setAddUserModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 text-slate-950 font-black text-xs shadow-lg shadow-sky-500/20 hover:brightness-110 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Admin User</span>
                </button>
              </div>

              {/* Status Message Toast */}
              {secMsg && (
                <div
                  className={`p-4 rounded-xl border text-xs font-semibold flex items-center justify-between ${
                    secMsg.type === 'success'
                      ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                      : 'bg-rose-500/15 border-rose-500/30 text-rose-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {secMsg.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                    )}
                    <span>{secMsg.text}</span>
                  </div>
                  <button onClick={() => setSecMsg(null)} className="text-slate-400 hover:text-white cursor-pointer">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* CURRENT LOGGED-IN ACCOUNT PROFILE & PASSWORD CHANGE */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Profile Settings Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                    <Building2 className="w-5 h-5 text-sky-400" />
                    <div>
                      <h3 className="text-sm font-bold text-white">Current Account Profile</h3>
                      <p className="text-[11px] text-slate-400">
                        Logged in as: <strong className="text-sky-300">{currentSession?.username || 'admin'}</strong> ({currentSession?.role || 'Super Admin'})
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Username</label>
                      <input
                        type="text"
                        value={profileUsername}
                        onChange={(e) => setProfileUsername(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-sky-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Email Address</label>
                      <input
                        type="email"
                        value={profileEmail}
                        onChange={(e) => setProfileEmail(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-sky-500"
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-sky-500 text-slate-950 font-bold text-xs hover:bg-sky-400 transition-colors cursor-pointer"
                    >
                      Save Profile Changes
                    </button>
                  </form>
                </div>

                {/* Password Change Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                    <KeyRound className="w-5 h-5 text-amber-400" />
                    <div>
                      <h3 className="text-sm font-bold text-white">Change Admin Password</h3>
                      <p className="text-[11px] text-slate-400">Passwords are salted and stored securely with SHA-256 encryption.</p>
                    </div>
                  </div>

                  <form onSubmit={handleChangePasswordSubmit} className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Current Password</label>
                      <div className="relative">
                        <input
                          type={showOldPass ? 'text' : 'password'}
                          placeholder="••••••••••••"
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                          className="w-full px-4 py-2 pr-10 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-sky-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowOldPass(!showOldPass)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                        >
                          {showOldPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">New Password</label>
                      <div className="relative">
                        <input
                          type={showNewPass ? 'text' : 'password'}
                          placeholder="Min 8 chars, 1 number"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full px-4 py-2 pr-10 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-sky-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPass(!showNewPass)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                        >
                          {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">Must be at least 8 characters with 1 number.</p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Confirm New Password</label>
                      <div className="relative">
                        <input
                          type={showConfirmPass ? 'text' : 'password'}
                          placeholder="••••••••••••"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full px-4 py-2 pr-10 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-sky-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPass(!showConfirmPass)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                        >
                          {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {confirmPassword && newPassword !== confirmPassword && (
                        <p className="text-[10px] text-rose-400 mt-1 font-bold">Passwords do not match.</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-extrabold text-xs hover:brightness-110 transition-all cursor-pointer"
                    >
                      Update Password
                    </button>
                  </form>
                </div>
              </div>

              {/* ADMINISTRATOR ACCOUNTS TABLE */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Users className="w-5 h-5 text-sky-400" />
                      <span>Administrator Accounts ({adminUsers.length})</span>
                    </h3>
                    <p className="text-xs text-slate-400">List of authorized administrators with access to CMS.</p>
                  </div>
                  <button
                    onClick={() => setAddUserModalOpen(true)}
                    className="px-3 py-1.5 rounded-lg bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-bold hover:bg-sky-500/30 transition-colors cursor-pointer"
                  >
                    + Add Account
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider font-extrabold">
                      <tr>
                        <th className="p-3 rounded-l-xl">User</th>
                        <th className="p-3">Email</th>
                        <th className="p-3">Role</th>
                        <th className="p-3">Created Date</th>
                        <th className="p-3 text-right rounded-r-xl">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {adminUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="p-3 font-bold text-white flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 font-black flex items-center justify-center text-xs">
                              {user.username.charAt(0).toUpperCase()}
                            </div>
                            <span>{user.username}</span>
                            {user.mustChangePassword && (
                              <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[9px] font-bold">
                                Default Pass
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-slate-300 font-mono text-[11px]">{user.email}</td>
                          <td className="p-3">
                            <select
                              value={user.role}
                              onChange={(e) => handleUpdateRoleClick(user.id, e.target.value as AdminRole)}
                              className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs text-sky-300 font-bold focus:outline-none cursor-pointer"
                            >
                              <option value="Super Admin">Super Admin</option>
                              <option value="Editor">Editor</option>
                              <option value="SEO Manager">SEO Manager</option>
                            </select>
                          </td>
                          <td className="p-3 text-slate-400 text-[11px]">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Initial'}</td>
                          <td className="p-3 text-right">
                            {(() => {
                              const isSelf = currentSession ? (user.id === currentSession.userId || user.username.toLowerCase() === currentSession.username.toLowerCase()) : false;
                              return (
                                <button
                                  onClick={() => handleDeleteAdminUserClick(user.id)}
                                  disabled={isSelf || adminUsers.length <= 1}
                                  className={`p-1.5 rounded-lg transition-colors ${
                                    isSelf || adminUsers.length <= 1
                                      ? 'bg-slate-800/40 text-slate-600 cursor-not-allowed opacity-40'
                                      : 'bg-rose-500/15 hover:bg-rose-500/30 text-rose-400 cursor-pointer'
                                  }`}
                                  title={isSelf ? 'Cannot delete currently logged-in account' : 'Delete Admin Account'}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              );
                            })()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* BLOG EDITOR MODAL */}
      {/* ------------------------------------------------------------- */}
      <AnimatePresence>
        {isBlogModalOpen && editingPost && (
          <BlogEditorStudio
            post={editingPost}
            categories={BLOG_CATEGORIES}
            onClose={() => setIsBlogModalOpen(false)}
            onSave={(updatedPost) => {
              if (!updatedPost.title || !updatedPost.slug) {
                alert('Please fill in Title and Slug');
                return;
              }

              const resolvedSlug = updatedPost.slug.startsWith('/') ? updatedPost.slug.slice(1) : updatedPost.slug;
              const resolvedTitle = updatedPost.seoTitle || updatedPost.title;
              const resolvedDesc = updatedPost.metaDescription || updatedPost.excerpt || '';
              const resolvedOgImage = updatedPost.ogImage || updatedPost.featuredImage || FEATURED_IMAGE_PRESETS[0].url;

              const calculatedSeo = analyzeSeo({
                focusKeyword: updatedPost.focusKeyword || '',
                seoTitle: resolvedTitle,
                metaDescription: resolvedDesc,
                slug: resolvedSlug,
                content: updatedPost.content || '',
                ogImage: resolvedOgImage
              });

              const existingPost = localConfig.blogPosts.find(p => p.id === updatedPost.id);
              const finalPost: BlogPost = {
                id: updatedPost.id || `post-${Date.now()}`,
                title: updatedPost.title || 'Untitled',
                slug: resolvedSlug,
                category: updatedPost.category || 'Web Development',
                status: updatedPost.status || 'draft',
                publishedAt: updatedPost.publishedAt || existingPost?.publishedAt || new Date().toISOString().split('T')[0],
                updatedAt: updatedPost.updatedAt,
                excerpt: updatedPost.excerpt || '',
                content: updatedPost.content || '',
                blocks: updatedPost.blocks || [],
                featuredImage: updatedPost.featuredImage || '',
                featuredImageAlt: updatedPost.featuredImageAlt,
                featuredImageCaption: updatedPost.featuredImageCaption,
                author: updatedPost.author || existingPost?.author || { name: 'Netronomic Web', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop', role: 'Lead Agency Architect' },
                tags: updatedPost.tags || existingPost?.tags || ['Web Development', 'SEO'],
                readingTime: updatedPost.readingTime || existingPost?.readingTime || '5 min read',
                seoTitle: resolvedTitle,
                metaDescription: resolvedDesc,
                focusKeyword: updatedPost.focusKeyword || '',
                secondaryKeywords: updatedPost.secondaryKeywords || '',
                canonicalUrl: updatedPost.canonicalUrl || `https://netronomicweb.com/blog/${resolvedSlug}`,
                robotsIndex: updatedPost.robotsIndex !== false,
                ogTitle: updatedPost.ogTitle || resolvedTitle,
                ogDescription: updatedPost.ogDescription || resolvedDesc,
                customSchema: updatedPost.customSchema || '',
                ogImage: resolvedOgImage,
                seoScore: calculatedSeo.score,
                allowComments: updatedPost.allowComments !== false,
                isFeatured: updatedPost.isFeatured || false,
                comments: existingPost?.comments || []
              };

              const isExisting = localConfig.blogPosts.some(p => p.id === finalPost.id);
              const updatedPosts = isExisting
                ? localConfig.blogPosts.map(p => p.id === finalPost.id ? finalPost : p)
                : [finalPost, ...localConfig.blogPosts];

              const updatedConfig = { ...localConfig, blogPosts: updatedPosts };
              setLocalConfig(updatedConfig);
              onSaveSiteConfig(updatedConfig);
              onSavePost(finalPost);
              setIsBlogModalOpen(false);
              setSavedSuccessMsg('Blog article saved successfully in Gutenberg Studio!');
              setTimeout(() => setSavedSuccessMsg(null), 3000);
            }}
          />
        )}
      </AnimatePresence>

      {/* ------------------------------------------------------------- */}
      {/* FACTORY RESET CONFIRMATION MODAL */}
      {/* ------------------------------------------------------------- */}
      <AnimatePresence>
        {showResetModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-slate-900 border border-rose-900/60 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl"
            >
              <div className="flex items-center gap-3 text-rose-400 font-extrabold text-base">
                <AlertTriangle className="w-6 h-6" />
                <span>Confirm Factory Reset</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                This action will restore all site pages, agency details, logo settings, and SEO configurations to original defaults. To confirm, please type <strong className="text-rose-400 font-mono">CONFIRM RESET</strong> below:
              </p>
              <input
                type="text"
                value={resetConfirmInput}
                onChange={(e) => setResetConfirmInput(e.target.value)}
                placeholder="Type CONFIRM RESET..."
                className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-rose-500"
              />
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => {
                    setShowResetModal(false);
                    setResetConfirmInput('');
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  disabled={resetConfirmInput !== 'CONFIRM RESET'}
                  onClick={() => {
                    if (resetConfirmInput === 'CONFIRM RESET') {
                      onResetSiteConfig();
                      setShowResetModal(false);
                      setResetConfirmInput('');
                      setLocalConfig(DEFAULT_SITE_CONFIG);
                      triggerSaveNotification('Data successfully restored to factory defaults!');
                    }
                  }}
                  className={`px-5 py-2 rounded-xl font-extrabold text-xs transition-all ${
                    resetConfirmInput === 'CONFIRM RESET'
                      ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30 cursor-pointer hover:bg-rose-600'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  Reset Everything
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ------------------------------------------------------------- */}
      {/* ADD NEW ADMIN USER MODAL */}
      {/* ------------------------------------------------------------- */}
      <AnimatePresence>
        {addUserModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-white font-extrabold text-base">
                  <UserPlus className="w-5 h-5 text-sky-400" />
                  <span>Create Administrator Account</span>
                </div>
                <button
                  onClick={() => setAddUserModalOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {addUserMsg && (
                <div
                  className={`p-3 rounded-xl border text-xs font-semibold ${
                    addUserMsg.type === 'success'
                      ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                      : 'bg-rose-500/15 border-rose-500/30 text-rose-300'
                  }`}
                >
                  {addUserMsg.text}
                </div>
              )}

              <form onSubmit={handleCreateNewUserSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Username</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. johndoe"
                    value={addUsername}
                    onChange={(e) => setAddUsername(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="john@example.com"
                    value={addEmail}
                    onChange={(e) => setAddEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Temporary Password</label>
                  <input
                    type="password"
                    required
                    placeholder="At least 6 characters"
                    value={addPassword}
                    onChange={(e) => setAddPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Administrative Role</label>
                  <select
                    value={addRole}
                    onChange={(e) => setAddRole(e.target.value as AdminRole)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sky-300 text-xs font-bold focus:outline-none focus:border-sky-500 cursor-pointer"
                  >
                    <option value="Super Admin">Super Admin (Full Access)</option>
                    <option value="Editor">Editor (Pages & Blog Management)</option>
                    <option value="SEO Manager">SEO Manager (SEO Suite Only)</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setAddUserModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 text-slate-950 font-extrabold text-xs shadow-md shadow-sky-500/20 cursor-pointer"
                  >
                    Create Administrator
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
