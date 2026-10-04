import React from "react";
import { FileText, Plus, Edit2, Trash2 } from "lucide-react";

export default function PagesPanel({ pages = [], onSavePage, onDeletePage }: any) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-white">Custom Pages Management</h3>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5">
          <Plus className="w-3.5 h-3.5" /> Create Page
        </button>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-white/5 text-slate-400 font-mono text-[10px] uppercase border-b border-white/10">
            <tr>
              <th className="p-4">Title</th>
              <th className="p-4">Slug</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {pages.map((p: any) => (
              <tr key={p.id}>
                <td className="p-4 font-bold text-white">{p.title}</td>
                <td className="p-4 font-mono">/{p.slug}</td>
                <td className="p-4">{p.status || "published"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
