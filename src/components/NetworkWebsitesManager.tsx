import React, { useState } from 'react';
import {
  Globe,
  Plus,
  Trash2,
  Edit3,
  Eye,
  EyeOff,
  Code2,
  Check,
  Copy,
  ArrowUpRight,
  ExternalLink,
  Zap,
  Cloud,
  Sparkles,
  Rocket,
  Shield,
  Layers,
  Laptop,
  Smartphone,
  Palette,
  ShoppingBag,
  Save,
  CheckCircle2,
  AlertTriangle,
  MoveUp,
  MoveDown,
  RefreshCw
} from 'lucide-react';
import { SiteConfig, NetworkWebsitesSectionConfig, NetworkWebsiteButton, DEFAULT_NETWORK_WEBSITES } from '../data/siteConfig';

interface NetworkWebsitesManagerProps {
  siteConfig: SiteConfig;
  onSave: (updatedConfig: SiteConfig) => void;
}

const AVAILABLE_ICONS = [
  { id: 'globe', label: 'Globe', Icon: Globe },
  { id: 'cloud', label: 'Cloud', Icon: Cloud },
  { id: 'zap', label: 'Lightning / Fast', Icon: Zap },
  { id: 'sparkles', label: 'Sparkles / AI', Icon: Sparkles },
  { id: 'rocket', label: 'Rocket / Launch', Icon: Rocket },
  { id: 'shield', label: 'Shield / Security', Icon: Shield },
  { id: 'layers', label: 'Layers / Platform', Icon: Layers },
  { id: 'laptop', label: 'Laptop / Web App', Icon: Laptop },
  { id: 'mobile', label: 'Mobile / App', Icon: Smartphone },
  { id: 'design', label: 'Design / Creative', Icon: Palette },
  { id: 'shop', label: 'Shop / E-Commerce', Icon: ShoppingBag },
  { id: 'external', label: 'External Link', Icon: ExternalLink },
];

const AVAILABLE_COLORS = [
  { id: 'sky', label: 'Sky Blue', bg: 'bg-sky-500' },
  { id: 'emerald', label: 'Emerald Green', bg: 'bg-emerald-500' },
  { id: 'purple', label: 'Royal Purple', bg: 'bg-purple-500' },
  { id: 'amber', label: 'Amber / Gold', bg: 'bg-amber-500' },
  { id: 'rose', label: 'Rose Red', bg: 'bg-rose-500' },
  { id: 'indigo', label: 'Indigo Navy', bg: 'bg-indigo-500' },
  { id: 'cyan', label: 'Cyan Teal', bg: 'bg-cyan-500' },
];

export const NetworkWebsitesManager: React.FC<NetworkWebsitesManagerProps> = ({
  siteConfig,
  onSave
}) => {
  const currentConfig: NetworkWebsitesSectionConfig = siteConfig.networkWebsites || DEFAULT_NETWORK_WEBSITES;

  const [sectionConfig, setSectionConfig] = useState<NetworkWebsitesSectionConfig>({
    ...DEFAULT_NETWORK_WEBSITES,
    ...currentConfig,
    buttons: currentConfig.buttons || DEFAULT_NETWORK_WEBSITES.buttons
  });

  const [editorMode, setEditorMode] = useState<'cards' | 'code' | 'preview'>('cards');
  const [jsonCode, setJsonCode] = useState<string>(() => JSON.stringify(sectionConfig.buttons || [], null, 2));
  const [codeError, setCodeError] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  // Form for adding/editing single button
  const [editingButton, setEditingButton] = useState<NetworkWebsiteButton | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleToggleEnabled = () => {
    const updated = { ...sectionConfig, enabled: !sectionConfig.enabled };
    setSectionConfig(updated);
    saveToConfig(updated);
  };

  const saveToConfig = (updated: NetworkWebsitesSectionConfig) => {
    const newConfig: SiteConfig = {
      ...siteConfig,
      networkWebsites: updated
    };
    onSave(newConfig);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  const handleSaveAll = () => {
    saveToConfig(sectionConfig);
  };

  // Open modal to add new button
  const handleAddNewButton = () => {
    setEditingButton({
      id: `btn-${Date.now()}`,
      title: '',
      url: 'https://',
      description: '',
      badge: 'Live Portal',
      icon: 'globe',
      color: 'sky',
      openInNewTab: true
    });
    setIsModalOpen(true);
  };

  // Save single button from modal
  const handleSaveModalButton = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingButton || !editingButton.title || !editingButton.url) return;

    const exists = sectionConfig.buttons.some((b) => b.id === editingButton.id);
    let newButtons: NetworkWebsiteButton[];
    if (exists) {
      newButtons = sectionConfig.buttons.map((b) => (b.id === editingButton.id ? editingButton : b));
    } else {
      newButtons = [...sectionConfig.buttons, editingButton];
    }

    const updated = { ...sectionConfig, buttons: newButtons };
    setSectionConfig(updated);
    setJsonCode(JSON.stringify(newButtons, null, 2));
    saveToConfig(updated);
    setIsModalOpen(false);
    setEditingButton(null);
  };

  const handleDeleteButton = (id: string) => {
    const newButtons = sectionConfig.buttons.filter((b) => b.id !== id);
    const updated = { ...sectionConfig, buttons: newButtons };
    setSectionConfig(updated);
    setJsonCode(JSON.stringify(newButtons, null, 2));
    saveToConfig(updated);
  };

  const handleMoveButton = (index: number, direction: 'up' | 'down') => {
    const newButtons = [...sectionConfig.buttons];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newButtons.length) return;

    const temp = newButtons[index];
    newButtons[index] = newButtons[targetIndex];
    newButtons[targetIndex] = temp;

    const updated = { ...sectionConfig, buttons: newButtons };
    setSectionConfig(updated);
    setJsonCode(JSON.stringify(newButtons, null, 2));
    saveToConfig(updated);
  };

  // Raw Code / JSON Mode apply
  const handleApplyJsonCode = () => {
    try {
      setCodeError(null);
      const parsed = JSON.parse(jsonCode);
      if (!Array.isArray(parsed)) {
        throw new Error('Code must be a JSON array of website button objects, e.g. [{"title": "...", "url": "..."}]');
      }

      // Ensure every item has an id
      const validatedButtons: NetworkWebsiteButton[] = parsed.map((item: any, i: number) => ({
        id: item.id || `btn-${Date.now()}-${i}`,
        title: item.title || `Website ${i + 1}`,
        url: item.url || 'https://',
        description: item.description || '',
        badge: item.badge || '',
        icon: item.icon || 'globe',
        color: item.color || 'sky',
        openInNewTab: item.openInNewTab !== false
      }));

      const updated = { ...sectionConfig, buttons: validatedButtons };
      setSectionConfig(updated);
      saveToConfig(updated);
      setEditorMode('cards');
    } catch (err: any) {
      setCodeError(err.message || 'Invalid JSON syntax. Please check quotes and commas.');
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(jsonCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleInsertSampleCode = () => {
    const sample = [
      {
        id: `btn-${Date.now()}-1`,
        title: "Netronomic Store",
        url: "https://shop.netronomicweb.com",
        description: "Official apparel, merchandise, and digital assets store.",
        badge: "E-Commerce",
        icon: "shop",
        color: "emerald",
        openInNewTab: true
      },
      {
        id: `btn-${Date.now()}-2`,
        title: "Netronomic AI Studio",
        url: "https://ai.netronomicweb.com",
        description: "Next-gen generative AI applications and workflow automations.",
        badge: "AI Platform",
        icon: "sparkles",
        color: "purple",
        openInNewTab: true
      }
    ];
    setJsonCode(JSON.stringify(sample, null, 2));
    setCodeError(null);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Toast Notification */}
      {saveToast && (
        <div className="fixed top-6 right-6 z-50 p-4 rounded-2xl bg-emerald-500 text-slate-950 font-black text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>Website buttons & section updated successfully!</span>
        </div>
      )}

      {/* Top Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
                <span>Other Websites & Portals Section</span>
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Add buttons linking to all your other websites. Manage via visual cards or raw code.
              </p>
            </div>
          </div>
        </div>

        {/* Master Hide / Show Toggle Switch */}
        <div className="flex items-center gap-4 bg-slate-950 p-3 rounded-2xl border border-slate-800 self-start md:self-auto">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-white block">
              Homepage Visibility
            </span>
            <span className={`text-[11px] font-semibold flex items-center gap-1.5 ${
              sectionConfig.enabled ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              {sectionConfig.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              {sectionConfig.enabled ? 'Section is VISIBLE on Homepage' : 'Section is HIDDEN (Turned Off)'}
            </span>
          </div>

          <button
            type="button"
            onClick={handleToggleEnabled}
            className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              sectionConfig.enabled ? 'bg-sky-500' : 'bg-slate-700'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                sectionConfig.enabled ? 'translate-x-7' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Section Title & Subtitle Settings */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <h2 className="text-base font-extrabold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
          <span>Section Headings & Branding</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Section Badge Tag
            </label>
            <input
              type="text"
              value={sectionConfig.badge || ''}
              onChange={(e) => setSectionConfig({ ...sectionConfig, badge: e.target.value })}
              placeholder="e.g. Network Portals"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Section Main Title
            </label>
            <input
              type="text"
              value={sectionConfig.title}
              onChange={(e) => setSectionConfig({ ...sectionConfig, title: e.target.value })}
              placeholder="e.g. Our Other Websites & Digital Portals"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-sky-500 font-bold"
            />
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Section Subtitle / Description
            </label>
            <input
              type="text"
              value={sectionConfig.subtitle || ''}
              onChange={(e) => setSectionConfig({ ...sectionConfig, subtitle: e.target.value })}
              placeholder="e.g. Explore our network of live platforms, web tools, and partner websites."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>
      </div>

      {/* Buttons Manager: Cards vs Code Mode */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <span>Website Buttons ({sectionConfig.buttons.length})</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Manage website buttons via interactive cards or direct code/JSON.
            </p>
          </div>

          {/* Mode Tabs */}
          <div className="flex items-center gap-2">
            <div className="flex items-center p-1 bg-slate-950 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setEditorMode('cards')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  editorMode === 'cards'
                    ? 'bg-sky-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Visual Cards
              </button>
              <button
                type="button"
                onClick={() => {
                  setJsonCode(JSON.stringify(sectionConfig.buttons, null, 2));
                  setEditorMode('code');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  editorMode === 'code'
                    ? 'bg-sky-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Raw Code Mode</span>
              </button>
            </div>

            {editorMode === 'cards' && (
              <button
                type="button"
                onClick={handleAddNewButton}
                className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs shadow-lg shadow-sky-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Website Button</span>
              </button>
            )}
          </div>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* MODE 1: VISUAL CARDS */}
        {/* ----------------------------------------------------------------- */}
        {editorMode === 'cards' && (
          <div className="space-y-4">
            {sectionConfig.buttons.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sectionConfig.buttons.map((btn, idx) => {
                  const IconComp = (btn.icon && AVAILABLE_ICONS.find(i => i.id === btn.icon.toLowerCase())?.Icon) || Globe;
                  return (
                    <div
                      key={btn.id || idx}
                      className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all group"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center">
                            <IconComp className="w-5 h-5" />
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleMoveButton(idx, 'up')}
                              disabled={idx === 0}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-white disabled:opacity-30 cursor-pointer"
                              title="Move left/up"
                            >
                              <MoveUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveButton(idx, 'down')}
                              disabled={idx === sectionConfig.buttons.length - 1}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-white disabled:opacity-30 cursor-pointer"
                              title="Move right/down"
                            >
                              <MoveDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingButton(btn);
                                setIsModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg text-sky-400 hover:bg-sky-500/10 cursor-pointer"
                              title="Edit button"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteButton(btn.id)}
                              className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                              title="Delete button"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-white truncate">{btn.title}</h4>
                            {btn.badge && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-900 border border-slate-700 text-slate-300">
                                {btn.badge}
                              </span>
                            )}
                          </div>
                          {btn.description && (
                            <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                              {btn.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="pt-3 mt-3 border-t border-slate-900 flex items-center justify-between text-[11px] font-mono text-slate-500">
                        <span className="truncate max-w-[180px]">{btn.url}</span>
                        <a
                          href={btn.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sky-400 hover:underline flex items-center gap-0.5"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-12 text-center rounded-2xl border-2 border-dashed border-slate-800 space-y-3">
                <Globe className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="text-sm font-bold text-slate-400">No website buttons added yet</p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Click "+ Add Website Button" or switch to "Raw Code Mode" to add links to your other websites.
                </p>
                <button
                  type="button"
                  onClick={handleAddNewButton}
                  className="px-4 py-2 rounded-xl bg-sky-500 text-slate-950 font-black text-xs cursor-pointer shadow-md"
                >
                  Add First Website Button
                </button>
              </div>
            )}
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* MODE 2: RAW CODE / JSON MODE (CODE KE ZARIYE BUTTON BNAYEIN) */}
        {/* ----------------------------------------------------------------- */}
        {editorMode === 'code' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
              <div className="space-y-1">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Code2 className="w-4 h-4 text-sky-400" />
                  <span>Direct Code / JSON Button Engine</span>
                </span>
                <p className="text-slate-400 text-[11px]">
                  Paste or write JSON code for your website buttons. When saved, buttons are generated immediately on the frontend.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleInsertSampleCode}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
                >
                  Insert Sample Code
                </button>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
                </button>
              </div>
            </div>

            {codeError && (
              <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{codeError}</span>
              </div>
            )}

            <textarea
              rows={14}
              value={jsonCode}
              onChange={(e) => {
                setJsonCode(e.target.value);
                setCodeError(null);
              }}
              spellCheck={false}
              className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-sky-300 focus:outline-none focus:border-sky-500 leading-relaxed shadow-inner"
              placeholder='[
  {
    "title": "My Other Website",
    "url": "https://mywebsite.com",
    "description": "Short description",
    "badge": "Portfolio",
    "icon": "globe",
    "color": "sky"
  }
]'
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEditorMode('cards')}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
              >
                Back to Cards
              </button>
              <button
                type="button"
                onClick={handleApplyJsonCode}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Apply Code & Update Buttons</span>
              </button>
            </div>
          </div>
        )}

        {/* Global Save Button */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-end">
          <button
            type="button"
            onClick={handleSaveAll}
            className="px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs shadow-lg shadow-sky-500/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Section Settings</span>
          </button>
        </div>
      </div>

      {/* MODAL: ADD / EDIT WEBSITE BUTTON */}
      {isModalOpen && editingButton && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in font-sans">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-sky-400" />
                <span>{editingButton.id?.startsWith('btn-') && !editingButton.title ? 'Add New Website Button' : 'Edit Website Button'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveModalButton} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Website Name / Button Title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editingButton.title}
                  onChange={(e) => setEditingButton({ ...editingButton, title: e.target.value })}
                  placeholder="e.g. Netronomic Cloud Portal"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-sky-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Destination URL (Website Link) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="url"
                  required
                  value={editingButton.url}
                  onChange={(e) => setEditingButton({ ...editingButton, url: e.target.value })}
                  placeholder="https://mysecondwebsite.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={editingButton.description || ''}
                  onChange={(e) => setEditingButton({ ...editingButton, description: e.target.value })}
                  placeholder="Brief 1-sentence overview of this website..."
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Badge / Tag (Optional)
                  </label>
                  <input
                    type="text"
                    value={editingButton.badge || ''}
                    onChange={(e) => setEditingButton({ ...editingButton, badge: e.target.value })}
                    placeholder="e.g. Free Tools"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Color Theme
                  </label>
                  <select
                    value={editingButton.color || 'sky'}
                    onChange={(e) => setEditingButton({ ...editingButton, color: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-sky-500"
                  >
                    {AVAILABLE_COLORS.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  Select Button Icon
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {AVAILABLE_ICONS.map((item) => {
                    const IconComponent = item.Icon;
                    const isSelected = (editingButton.icon || 'globe').toLowerCase() === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setEditingButton({ ...editingButton, icon: item.id })}
                        className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-sky-500/20 border-sky-400 text-sky-400'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                        title={item.label}
                      >
                        <IconComponent className="w-4 h-4" />
                        <span className="text-[9px] font-semibold truncate w-full text-center">
                          {item.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="openInNewTabCheckbox"
                  checked={editingButton.openInNewTab !== false}
                  onChange={(e) => setEditingButton({ ...editingButton, openInNewTab: e.target.checked })}
                  className="w-4 h-4 rounded bg-slate-950 border-slate-800 text-sky-500 focus:ring-sky-500 cursor-pointer"
                />
                <label htmlFor="openInNewTabCheckbox" className="text-xs text-slate-300 font-semibold cursor-pointer select-none">
                  Open link in a new tab (target="_blank")
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs shadow-lg shadow-sky-500/20 cursor-pointer"
                >
                  Save Button
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
