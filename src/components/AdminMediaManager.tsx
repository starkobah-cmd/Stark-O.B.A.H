import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Upload,
  Image as ImageIcon,
  Search,
  Check,
  Trash2,
  Copy,
  Plus,
  Edit3,
  ExternalLink,
  Filter,
  CheckCircle2,
  FileImage,
  RefreshCw,
  FolderOpen,
  Grid,
  List,
  Sparkles,
  HardDrive
} from 'lucide-react';
import {
  MediaItem,
  getStoredMediaLibrary,
  saveMediaLibrary,
  processFileToMediaItem,
  formatFileSize
} from '../utils/mediaStore';

export const AdminMediaManager: React.FC = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [copiedId, setCopiedId] = useState('');

  // Editing current selected item metadata
  const [editingTitle, setEditingTitle] = useState('');
  const [editingAlt, setEditingAlt] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const items = getStoredMediaLibrary();
    setMediaItems(items);
    if (items.length > 0) {
      setSelectedId(items[0].id);
      setEditingTitle(items[0].title);
      setEditingAlt(items[0].altText || items[0].title);
    }
  }, []);

  const handleSelect = (item: MediaItem) => {
    setSelectedId(item.id);
    setEditingTitle(item.title);
    setEditingAlt(item.altText || item.title);
  };

  const handleFileUpload = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    setToastMsg('Uploading media assets...');

    try {
      const newItems: MediaItem[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith('image/')) continue;
        if (file.size > 2 * 1024 * 1024) {
          alert(`Note: "${file.name}" exceeds 2MB (${formatFileSize(file.size)}). Compressed version will be stored for instant site loading.`);
        }
        const processed = await processFileToMediaItem(file, 'image');
        newItems.unshift(processed);
      }

      const updated = [...newItems, ...mediaItems];
      setMediaItems(updated);
      saveMediaLibrary(updated);

      if (newItems.length > 0) {
        setSelectedId(newItems[0].id);
        setEditingTitle(newItems[0].title);
        setEditingAlt(newItems[0].altText || newItems[0].title);
        setToastMsg(`Successfully uploaded ${newItems.length} media file(s)!`);
      }
    } catch (err) {
      console.error('Upload error:', err);
      setToastMsg('Failed to process image upload.');
    } finally {
      setIsUploading(false);
      setTimeout(() => setToastMsg(''), 3000);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleDeleteSelectedItem = () => {
    if (!selectedId) return;
    if (confirm('Are you sure you want to delete this media item permanently?')) {
      const updated = mediaItems.filter(i => i.id !== selectedId);
      setMediaItems(updated);
      saveMediaLibrary(updated);
      if (updated.length > 0) {
        setSelectedId(updated[0].id);
        setEditingTitle(updated[0].title);
        setEditingAlt(updated[0].altText || updated[0].title);
      } else {
        setSelectedId(null);
      }
      setToastMsg('Media asset deleted.');
      setTimeout(() => setToastMsg(''), 2000);
    }
  };

  const handleSaveMetadata = () => {
    if (!selectedId) return;
    const updated = mediaItems.map(item => {
      if (item.id === selectedId) {
        return {
          ...item,
          title: editingTitle || item.title,
          altText: editingAlt || item.title
        };
      }
      return item;
    });
    setMediaItems(updated);
    saveMediaLibrary(updated);
    setToastMsg('Media details updated.');
    setTimeout(() => setToastMsg(''), 2000);
  };

  const handleReplaceImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !selectedId) return;
    const file = files[0];
    try {
      const processed = await processFileToMediaItem(file, 'image');
      const updated = mediaItems.map(item => {
        if (item.id === selectedId) {
          return {
            ...processed,
            id: selectedId,
            uploadedAt: new Date().toISOString().split('T')[0]
          };
        }
        return item;
      });
      setMediaItems(updated);
      saveMediaLibrary(updated);
      setToastMsg('Media file replaced.');
      setTimeout(() => setToastMsg(''), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredItems = mediaItems.filter(item => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.altText && item.altText.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterType === 'all' || item.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const selectedItem = mediaItems.find(i => i.id === selectedId);

  // Stats calculation
  const totalItems = mediaItems.length;
  const logoItemsCount = mediaItems.filter(i => i.type === 'logo').length;
  const blogItemsCount = mediaItems.filter(i => i.type === 'blog').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-white">
      {/* Top Header & Metrics Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <span>Netronomic Asset & Media Manager</span>
            <span className="text-[10px] bg-sky-500/20 text-sky-400 border border-sky-400/30 px-2.5 py-0.5 rounded-full font-bold uppercase">
              CMS v2.4 Storage
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Centralized cloud asset hub. Upload images, select assets for posts and branding, manage SEO alt tags, and copy CDN URLs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-cyan-500 hover:scale-105 text-white font-extrabold text-xs shadow-lg shadow-sky-500/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Upload className="w-4 h-4 stroke-[3]" />
            <span>Upload New Media</span>
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase">Total Media Assets</p>
            <p className="text-xl font-black text-white mt-1">{totalItems}</p>
          </div>
          <div className="p-3 rounded-xl bg-sky-500/15 text-sky-400 border border-sky-500/20">
            <ImageIcon className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase">Logos & Favicons</p>
            <p className="text-xl font-black text-emerald-400 mt-1">{logoItemsCount}</p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase">Blog & Article Covers</p>
            <p className="text-xl font-black text-amber-400 mt-1">{blogItemsCount}</p>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/20">
            <FileImage className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase">Library Status</p>
            <p className="text-xs font-extrabold text-cyan-400 mt-1 flex items-center gap-1">
              <HardDrive className="w-3.5 h-3.5" /> Persistent Local
            </p>
          </div>
          <div className="p-3 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/20">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Drag & Drop Upload Dropzone Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`p-6 rounded-2xl border-2 border-dashed transition-all text-center flex flex-col items-center justify-center ${
          isDragging
            ? 'border-sky-500 bg-sky-500/10'
            : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
        }`}
      >
        <Upload className="w-7 h-7 text-sky-400 mb-2 animate-bounce" />
        <p className="text-xs font-bold text-white">Drag & drop computer files anywhere here to instant upload</p>
        <p className="text-[10px] text-slate-400 mt-0.5">Supports PNG, JPG, WebP, SVG, and GIF formats</p>
      </div>

      {/* Search & Filter Control Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search media by title or alt text..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {toastMsg && (
            <span className="text-xs font-bold text-sky-400 bg-sky-500/10 border border-sky-500/30 px-3 py-1.5 rounded-xl animate-pulse">
              {toastMsg}
            </span>
          )}

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-300 focus:outline-none"
          >
            <option value="all">All Media Categories</option>
            <option value="blog">Blog Covers</option>
            <option value="banner">Banners</option>
            <option value="logo">Logos & Icons</option>
            <option value="avatar">Avatars</option>
            <option value="image">Uploaded</option>
          </select>
        </div>
      </div>

      {/* Main Grid & Inspector View */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Media Grid */}
        <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-5 min-h-[400px]">
          {filteredItems.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center text-slate-500 space-y-2">
              <FileImage className="w-10 h-10 text-slate-600" />
              <p className="text-xs font-bold text-slate-400">No media items found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredItems.map((item) => {
                const isSelected = item.id === selectedId;
                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    className={`group relative rounded-2xl overflow-hidden border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-sky-500 shadow-xl shadow-sky-500/20 ring-2 ring-sky-500/30'
                        : 'border-slate-800 hover:border-slate-700 bg-slate-950'
                    }`}
                  >
                    <div className="aspect-square w-full bg-slate-950 overflow-hidden flex items-center justify-center relative">
                      <img
                        src={item.url}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                      {isSelected && (
                        <div className="absolute top-2 right-2 p-1.5 rounded-full bg-sky-500 text-slate-950 shadow-md">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <div className="p-3 bg-slate-900 border-t border-slate-800">
                      <p className="text-xs font-bold text-white truncate">{item.title}</p>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                        <span>{item.sizeFormatted}</span>
                        <span className="text-sky-400 font-mono">{item.dimensions || 'Image'}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Media Inspector Drawer */}
        {selectedItem ? (
          <div className="w-full lg:w-80 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shrink-0 h-fit">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-2">
              Media Asset Inspector
            </h3>

            {/* Preview Box */}
            <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 p-2 relative">
              <img
                src={selectedItem.url}
                alt={selectedItem.title}
                className="w-full h-44 object-contain rounded-xl bg-slate-950"
              />
              <a
                href={selectedItem.url}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-4 right-4 p-2 rounded-xl bg-slate-900/80 text-white hover:bg-sky-500 hover:text-slate-950 text-xs transition-colors flex items-center gap-1 shadow-md"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Specs */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Uploaded:</span>
                <strong className="text-white">{selectedItem.uploadedAt}</strong>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Dimensions:</span>
                <strong className="text-sky-400">{selectedItem.dimensions || 'N/A'}</strong>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>File Size:</span>
                <strong className="text-white">{selectedItem.sizeFormatted}</strong>
              </div>
            </div>

            {/* Metadata Editor */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Title</label>
                <input
                  type="text"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  onBlur={handleSaveMetadata}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Alt Text (SEO)</label>
                <input
                  type="text"
                  value={editingAlt}
                  onChange={(e) => setEditingAlt(e.target.value)}
                  onBlur={handleSaveMetadata}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              {/* Copy URL */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Asset URL</label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    readOnly
                    value={selectedItem.url}
                    className="flex-1 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-[10px] text-slate-400 font-mono focus:outline-none truncate"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(selectedItem.url);
                      setCopiedId(selectedItem.id);
                      setToastMsg('Asset URL copied to clipboard!');
                      setTimeout(() => {
                        setCopiedId('');
                        setToastMsg('');
                      }, 2000);
                    }}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-sky-500 hover:text-slate-950 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                    title="Copy Asset URL"
                  >
                    {copiedId === selectedItem.id ? 'Copied' : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
              <input
                ref={replaceFileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleReplaceImage}
              />
              <button
                onClick={() => replaceFileInputRef.current?.click()}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-sky-400" />
                <span>Replace</span>
              </button>

              <button
                onClick={handleDeleteSelectedItem}
                className="px-3.5 py-2 rounded-xl bg-rose-500/15 text-rose-400 border border-rose-500/30 hover:bg-rose-500/25 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full lg:w-80 bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col items-center justify-center text-center text-slate-500">
            <p className="text-xs">Select a media item to view asset details.</p>
          </div>
        )}
      </div>
    </div>
  );
};
