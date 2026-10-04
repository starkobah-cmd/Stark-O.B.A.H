import React from "react";
import { Code2, Plus, Trash2 } from "lucide-react";

export default function SchemaEditor({ schemas = [], onChange }: any) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-white uppercase font-mono flex items-center gap-1.5">
          <Code2 className="w-3.5 h-3.5 text-blue-400" /> Schema.org Graph
        </h4>
        <span className="text-[10px] text-slate-400 font-mono">{schemas.length} Schemas</span>
      </div>

      <div className="space-y-2">
        {schemas.map((s: any, idx: number) => (
          <div key={idx} className="p-2.5 bg-slate-900 border border-white/10 rounded-xl flex items-center justify-between text-xs">
            <span className="font-mono text-slate-300">{s.type || "BlogPosting"}</span>
            <button
              onClick={() => onChange(schemas.filter((_: any, i: number) => i !== idx))}
              className="text-slate-500 hover:text-red-400"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => onChange([...schemas, { id: `schema-${Date.now()}`, type: "BlogPosting", jsonData: "{}" }])}
          className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs text-slate-300 font-semibold flex items-center justify-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" /> Add Schema
        </button>
      </div>
    </div>
  );
}
