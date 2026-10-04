import React from "react";
import { Image as ImageIcon, Upload, Trash2 } from "lucide-react";

export default function MediaLibrary({ mediaAssets = [], onSelectMedia, onDeleteMedia }: any) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-white">Media Assets Library</h3>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5">
          <Upload className="w-3.5 h-3.5" /> Upload File
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
        {mediaAssets.map((asset: any) => (
          <div key={asset.id} className="group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden aspect-square">
            <img src={asset.url} alt={asset.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                onClick={() => onSelectMedia && onSelectMedia(asset.url)}
                className="p-1.5 bg-blue-600 rounded-lg text-white"
              >
                Use
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
