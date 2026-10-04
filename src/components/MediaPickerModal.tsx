import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Upload,
  Image as ImageIcon,
  Search,
  Check,
  Trash2,
  Copy,
  X,
  Plus,
  Edit3,
  ExternalLink,
  Filter,
  CheckCircle2,
  AlertCircle,
  FileImage,
  RefreshCw
} from 'lucide-react';
import {
  MediaItem,
  getStoredMediaLibrary,
  saveMediaLibrary,
  processFileToMediaItem
} from '../utils/mediaStore';

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (url: string, item?: MediaItem) => void;
  title?: string;
  currentValue?: string;
  allowedCategory?: MediaItem['type'];
}

export const MediaPickerModal: React.FC<MediaPickerModalProps> = ({
  isOpen,
  onClose,
  onSelectImage,
  title = 'Select Image from Media Library',
  currentValue = '',
  allowedCategory
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'library'>('library');
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  // Editing current selected item metadata
  const [editingTitle, setEditingTitle] = useState('');
  const [editingAlt, setEditingAlt] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      const items = getStoredMediaLibrary();
      setMediaItems(items);
      
      // If current value matches an item, select it
      if (currentValue) {
        const found = items.find(i => i.url === currentValue);
        if (found) {
          setSelectedId(found.id);
          setEditingTitle(found.title);
          setEditingAlt(found.altText || found.title);
        } else {
          setSelectedId(null);
        }
      } else if (items.length > 0) {
        setSelectedId(items[0].id);
        setEditingTitle(items[0].title);
        setEditingAlt(items[0].altText || items[0].title);
      }
    }
  }, [isOpen, currentValue]);

  if (!isOpen) return null;

  const handleSelect = (item: MediaItem) => {
    setSelectedId(item.id);
    setEditingTitle(item.title);
    setEditingAlt(item.altText || item.title);
  };

  const handleConfirmSelection = () => {
    const item = mediaItems.find(i => i.id === selectedId);
    if (item) {
      onSelectImage(item.url, item);
      onClose();
    } else if (currentValue) {
      onSelectImage(currentValue);
      onClose();
    }
  };

  const handleFileUpload = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    setToastMsg('Processing image upload...');

    try {
      const newItems: MediaItem[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith('image/')) continue;
        const processed = await processFileToMediaItem(file, allowedCategory || 'image');
        newItems.unshift(processed);
      }

      const updated = [...newItems, ...mediaItems];
      setMediaItems(updated);
      saveMediaLibrary(updated);

      if (newItems.length > 0) {
        setSelectedId(newItems[0].id);
        setEditingTitle(newItems[0].title);
        setEditingAlt(newItems[0].altText || newItems[0].title);
        setToastMsg(`Successfully uploaded ${newItems.length} image(s)!`);
        setActiveTab('library');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setToastMsg('Failed to process uploaded file.');
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
      setToastMsg('Media item deleted.');
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
    setToastMsg('Image details saved.');
    setTimeout(() => setToastMsg(''), 2000);
  };

  const handleReplaceImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !selectedId) return;
    const file = files[0];
    try {
      const processed = await processFileToMediaItem(file, allowedCategory || 'image');
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
      setToastMsg('Image replaced successfully.');
      setTimeout(() => setToastMsg(''), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredItems = mediaItems.filter(item => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.altText && item.altText.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter =
      filterType === 'all' ||
      item.type === filterType ||
      (filterType === 'logo' && (item.type === 'logo' || item.type === 'icon'));
    return matchesSearch && matchesFilter;
  });

  const selectedItem = mediaItems.find(i => i.id === selectedId);

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="w-full max-w-5xl h-[90vh] max-h-[750px] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-white"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-400">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">{title}</h2>
              <p className="text-xs text-slate-400">WordPress-style media asset manager & upload engine</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {toastMsg && (
              <span className="text-xs font-bold text-sky-400 bg-sky-500/10 border border-sky-500/30 px-3 py-1 rounded-full animate-pulse">
                {toastMsg}
              </span>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher Bar */}
        <div className="flex items-center justify-between px-6 py-2.5 bg-slate-900 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'upload'
                  ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>Upload Files</span>
            </button>

            <button
              onClick={() => setActiveTab('library')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'library'
                  ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Media Library ({mediaItems.length})</span>
            </button>
          </div>

          {activeTab === 'library' && (
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search media..."
                  className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 w-48"
                />
              </div>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-300 focus:outline-none"
              >
                <option value="all">All Media</option>
                <option value="blog">Blog Images</option>
                <option value="banner">Banners</option>
                <option value="logo">Logos & Icons</option>
                <option value="avatar">Avatars</option>
                <option value="image">Uploaded Images</option>
              </select>
            </div>
          )}
        </div>

        {/* Modal Main Content Area */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row bg-slate-950">
          {/* TAB 1: UPLOAD FILES */}
          {activeTab === 'upload' && (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`flex-1 flex flex-col items-center justify-center p-8 text-center border-2 border-dashed m-6 rounded-3xl transition-all ${
                isDragging
                  ? 'border-sky-500 bg-sky-500/10'
                  : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
              }`}
            >
              <div className="p-5 rounded-full bg-slate-900 border border-slate-800 text-sky-400 mb-4 shadow-xl">
                <Upload className="w-10 h-10 animate-bounce" />
              </div>

              <h3 className="text-lg font-extrabold text-white">Drag and Drop Files Here to Upload</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-md">
                Upload PNG, JPG, WebP, SVG, or GIF files directly from your computer. Select multiple images at once to add them to your persistent Media Library.
              </p>

              <div className="mt-6 flex items-center gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.ico,.svg,.png,.jpg,.jpeg,.webp"
                  multiple
                  className="hidden"
                  onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-extrabold text-xs shadow-lg shadow-sky-500/20 transition-all cursor-pointer flex items-center gap-2"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Select Files from Computer</span>
                </button>
              </div>

              <span className="text-[10px] text-slate-500 mt-4 uppercase font-bold tracking-wider">
                Maximum file size: 10 MB per file • Instant local persistence
              </span>
            </div>
          )}

          {/* TAB 2: MEDIA LIBRARY GRID & DETAILS DRAWER */}
          {activeTab === 'library' && (
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
              {/* Image Grid */}
              <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
                {filteredItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-500 space-y-3">
                    <FileImage className="w-12 h-12 text-slate-600" />
                    <p className="text-sm font-bold text-slate-400">No media items found</p>
                    <p className="text-xs text-slate-500">
                      Try adjusting your search query or switch to the Upload tab to add new images.
                    </p>
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
                              ? 'border-sky-500 shadow-lg shadow-sky-500/20 ring-2 ring-sky-500/30'
                              : 'border-slate-800 hover:border-slate-600 bg-slate-900'
                          }`}
                        >
                          <div className="aspect-square w-full bg-slate-900 overflow-hidden flex items-center justify-center relative">
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
                          <div className="p-2.5 bg-slate-900/90 border-t border-slate-800">
                            <p className="text-[11px] font-bold text-white truncate">{item.title}</p>
                            <p className="text-[10px] text-slate-400">{item.sizeFormatted}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Sidebar Details Drawer (WordPress Style) */}
              {selectedItem ? (
                <div className="w-full md:w-80 bg-slate-900 border-t md:border-t-0 md:border-l border-slate-800 p-5 overflow-y-auto space-y-4 shrink-0">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-2">
                    Attachment Details
                  </h3>

                  {/* Image Preview Box */}
                  <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 p-2 relative group">
                    <img
                      src={selectedItem.url}
                      alt={selectedItem.title}
                      className="w-full h-40 object-contain rounded-xl bg-slate-950"
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

                  {/* Meta Specs */}
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Uploaded:</span>
                      <strong className="text-white">{selectedItem.uploadedAt}</strong>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Dimensions:</span>
                      <strong className="text-sky-400">{selectedItem.dimensions || 'N/A'}</strong>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>File size:</span>
                      <strong className="text-white">{selectedItem.sizeFormatted}</strong>
                    </div>
                  </div>

                  {/* Edit Form */}
                  <div className="space-y-3 pt-2 border-t border-slate-800">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">Image Title</label>
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
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">File URL</label>
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
                            setCopiedUrl(selectedItem.id);
                            setTimeout(() => setCopiedUrl(''), 2000);
                          }}
                          className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-sky-500 hover:text-slate-950 text-slate-300 text-xs font-bold transition-colors"
                        >
                          {copiedUrl === selectedItem.id ? 'Copied' : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Actions: Replace & Delete */}
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
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-sky-400" />
                      <span>Replace</span>
                    </button>

                    <button
                      onClick={handleDeleteSelectedItem}
                      className="px-3 py-1.5 rounded-xl bg-rose-500/15 text-rose-400 border border-rose-500/30 hover:bg-rose-500/25 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="w-full md:w-80 bg-slate-900 border-t md:border-t-0 md:border-l border-slate-800 p-5 flex flex-col items-center justify-center text-center text-slate-500">
                  <p className="text-xs">Select an item to view attachment details.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-t border-slate-800">
          <div className="flex items-center gap-3">
            {selectedItem ? (
              <div className="flex items-center gap-2">
                <img
                  src={selectedItem.url}
                  alt=""
                  className="w-8 h-8 rounded-lg object-cover border border-slate-800 bg-slate-900"
                />
                <span className="text-xs font-bold text-white truncate max-w-[200px]">
                  {selectedItem.title}
                </span>
              </div>
            ) : (
              <span className="text-xs text-slate-400">No image selected</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
            >
              Cancel
            </button>

            <button
              onClick={handleConfirmSelection}
              disabled={!selectedId && !currentValue}
              className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-slate-950 font-black text-xs shadow-lg shadow-sky-500/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Select & Assign Image</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
