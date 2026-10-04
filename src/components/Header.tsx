import React, { useState } from "react";
import { Lock, BookOpen, Search, Menu, X, Shield, Sparkles } from "lucide-react";

interface HeaderProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  onOpenAdmin?: () => void;
}

export default function Header({ currentTab, onNavigate, onOpenAdmin }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleItemClick = (tab: string) => {
    onNavigate(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => handleItemClick("blog")} 
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF5722] to-amber-500 flex items-center justify-center shadow-[0_0_20px_rgba(255,87,34,0.35)] group-hover:scale-105 transition-transform text-white font-black text-xl">
            M
          </div>
          <div>
            <span className="text-2xl font-black tracking-tight text-slate-900">
              Meta<span className="text-[#FF5722]">zivo</span>
            </span>
            <span className="ml-2 text-xs font-mono font-bold text-slate-400 uppercase tracking-widest hidden sm:inline">
              Blog &amp; Knowledge Hub
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          <button
            onClick={() => handleItemClick("blog")}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              currentTab === "blog" || currentTab === "blog-detail"
                ? "bg-orange-50 text-[#FF5722] border border-orange-200"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Articles</span>
          </button>
        </nav>

        {/* Right Action: Direct Backend CMS Access */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (onOpenAdmin) onOpenAdmin();
              else handleItemClick("admin-login");
            }}
            className="px-5 py-2.5 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-md hover:shadow-lg border border-slate-700"
            title="Open Administrative Blog Backend & Editor"
          >
            <Shield className="w-3.5 h-3.5 text-[#FF5722]" />
            <span>Admin Blog Portal</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-700 hover:text-slate-900 focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-6 space-y-3 shadow-xl">
          <button
            onClick={() => handleItemClick("blog")}
            className="w-full text-left px-4 py-3 rounded-2xl text-sm font-bold flex items-center justify-between text-slate-800 bg-slate-50"
          >
            <span className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#FF5722]" />
              <span>Browse All Articles</span>
            </span>
          </button>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              if (onOpenAdmin) onOpenAdmin();
              else handleItemClick("admin-login");
            }}
            className="w-full py-3 bg-[#FF5722] hover:bg-[#FF7043] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Open Admin Blog Studio</span>
          </button>
        </div>
      )}
    </header>
  );
}
