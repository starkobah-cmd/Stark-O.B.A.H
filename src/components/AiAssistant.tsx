import React from "react";
import { Sparkles, Wand2 } from "lucide-react";

export default function AiAssistant({ currentPostTitle, onApplyMetadata, onApplyFaq, onApplySchema }: any) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-white uppercase font-mono flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" /> AI Meta Assistant
        </h4>
      </div>

      <p className="text-[11px] text-slate-400">
        Generate SEO metadata and FAQ structured content automatically.
      </p>

      <button
        type="button"
        onClick={() => {
          if (currentPostTitle && onApplyMetadata) {
            onApplyMetadata({
              seoTitle: `${currentPostTitle} | Metazivo`,
              seoDescription: `Comprehensive engineering guide on ${currentPostTitle}. Detailed benchmarks and playbooks.`,
              slug: currentPostTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
              focusKeywords: ["SEO", "Web Performance"],
              excerpt: `Essential analysis and implementation strategies for ${currentPostTitle}.`
            });
          }
        }}
        className="w-full py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5"
      >
        <Wand2 className="w-3.5 h-3.5" /> Optimize Meta Parameters
      </button>
    </div>
  );
}
