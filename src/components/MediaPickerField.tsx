import React, { useState, useRef } from 'react';
import {
  Image as ImageIcon,
  Upload,
  X,
  Link,
  CheckCircle2,
  FolderOpen,
  Sparkles
} from 'lucide-react';
import { MediaPickerModal } from './MediaPickerModal';
import { processFileToMediaItem, saveMediaLibrary, getStoredMediaLibrary, MediaItem } from '../utils/mediaStore';

interface MediaPickerFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  category?: MediaItem['type'];
  helperText?: string;
}

export const MediaPickerField: React.FC<MediaPickerFieldProps> = ({
  label,
  value,
  onChange,
  placeholder = 'No image selected',
  category,
  helperText
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploading(true);
    try {
      const file = files[0];
      const processed = await processFileToMediaItem(file, category || 'image');
      if (processed && processed.url) {
        const currentLibrary = getStoredMediaLibrary();
        const updated = [processed, ...currentLibrary];
        saveMediaLibrary(updated);
        onChange(processed.url);
      }
    } catch (err) {
      console.error('File upload error:', err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-300">{label}</label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[10px] text-slate-400 hover:text-sky-400 font-semibold flex items-center gap-1 cursor-pointer"
        >
          <Link className="w-3 h-3" />
          <span>{showUrlInput ? 'Hide URL' : 'Paste Direct URL'}</span>
        </button>
      </div>

      <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
        {/* Live Image Preview Card */}
        {value ? (
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900 border border-slate-800 relative group">
            <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-950 shrink-0 border border-slate-800 flex items-center justify-center p-1.5">
              <img
                src={value}
                alt="Selected asset"
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/favicon.svg';
                }}
              />
            </div>

            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Selected Media Asset
              </span>
              <p className="text-xs text-slate-300 font-mono truncate mt-0.5" title={value}>{value}</p>
            </div>

            <button
              type="button"
              onClick={() => onChange('')}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500 hover:text-white text-slate-400 transition-colors cursor-pointer"
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="p-4 rounded-xl border border-dashed border-slate-800 bg-slate-900/40 text-center flex flex-col items-center justify-center">
            <ImageIcon className="w-8 h-8 text-slate-600 mb-1" />
            <span className="text-xs text-slate-400 font-semibold">{placeholder}</span>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex-1 min-w-[140px] px-3.5 py-2.5 rounded-xl bg-sky-500/15 border border-sky-500/30 hover:bg-sky-500 hover:text-slate-950 text-sky-400 font-extrabold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <FolderOpen className="w-4 h-4" />
            <span>Choose from Media Library</span>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.ico,.svg,.png,.jpg,.jpeg,.webp"
            className="hidden"
            onChange={handleFileChange}
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Upload className="w-4 h-4 text-sky-400" />
            <span>{isUploading ? 'Uploading...' : 'Upload File'}</span>
          </button>
        </div>

        {/* Optional Collapsible URL Field */}
        {showUrlInput && (
          <div className="pt-2 border-t border-slate-800">
            <input
              type="url"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
            />
          </div>
        )}

        {helperText && (
          <p className="text-[10px] text-slate-500">{helperText}</p>
        )}
      </div>

      {/* WordPress-Style Media Picker Modal */}
      <MediaPickerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectImage={(url) => onChange(url)}
        title={`Select ${label}`}
        currentValue={value}
        allowedCategory={category}
      />
    </div>
  );
};
