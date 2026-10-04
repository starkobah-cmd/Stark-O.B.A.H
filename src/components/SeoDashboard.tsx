import React from "react";
import { Globe, BarChart3, TrendingUp } from "lucide-react";

export default function SeoDashboard({ blogs = [], services = [] }: any) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <span className="text-xs text-slate-400 font-mono block">Indexed Pages</span>
          <span className="text-2xl font-bold text-white mt-1 block">{blogs.length + 8}</span>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <span className="text-xs text-slate-400 font-mono block">Average SEO Score</span>
          <span className="text-2xl font-bold text-emerald-400 mt-1 block">94/100</span>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <span className="text-xs text-slate-400 font-mono block">Schema Coverage</span>
          <span className="text-2xl font-bold text-blue-400 mt-1 block">100%</span>
        </div>
      </div>
    </div>
  );
}
