import React from "react";

export default function CtaBoxBuilder({ onInsert, onClose }: any) {
  return (
    <div className="p-4 bg-slate-900 rounded-2xl border border-white/10 space-y-4">
      <h4 className="text-xs font-bold text-white uppercase font-mono">CTA Block Builder</h4>
      <button
        onClick={() => {
          onInsert && onInsert("<div class='cta-box'><h3>Get in Touch</h3><a href='/contact'>Contact Us</a></div>");
          onClose && onClose();
        }}
        className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
      >
        Insert CTA
      </button>
    </div>
  );
}
