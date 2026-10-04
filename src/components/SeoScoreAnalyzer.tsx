import React, { useMemo } from "react";
import { CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";

interface SeoScoreAnalyzerProps {
  title: string;
  content: string;
  focusKeywords: string[];
  seoTitle: string;
  seoDescription: string;
}

export default function SeoScoreAnalyzer({
  title,
  content,
  focusKeywords,
  seoTitle,
  seoDescription
}: SeoScoreAnalyzerProps) {
  const score = useMemo(() => {
    let s = 50;
    if (title && title.length >= 20 && title.length <= 70) s += 15;
    if (seoDescription && seoDescription.length >= 80 && seoDescription.length <= 160) s += 15;
    if (content && content.length > 500) s += 10;
    if (focusKeywords && focusKeywords.length > 0) s += 10;
    return Math.min(100, s);
  }, [title, content, focusKeywords, seoDescription]);

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-white uppercase font-mono flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#FF5722]" /> Live SEO Auditor
        </h4>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${
          score >= 85 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"
        }`}>
          {score}/100
        </span>
      </div>

      <div className="space-y-2 text-[11px] text-slate-300">
        <div className="flex items-center gap-2">
          {title.length >= 20 ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          )}
          <span>Title length: {title.length} chars (Target 20-70)</span>
        </div>

        <div className="flex items-center gap-2">
          {seoDescription.length >= 80 ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          )}
          <span>Meta description: {seoDescription.length} chars (Target 80-160)</span>
        </div>

        <div className="flex items-center gap-2">
          {content.length > 500 ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          )}
          <span>Body word count: {content ? content.split(/\s+/).length : 0} words</span>
        </div>
      </div>
    </div>
  );
}
