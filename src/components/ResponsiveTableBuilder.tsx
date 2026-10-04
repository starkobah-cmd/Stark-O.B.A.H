import React from "react";
import { Table as TableIcon } from "lucide-react";

export default function ResponsiveTableBuilder({ onInsertTable, onClose }: any) {
  return (
    <div className="p-4 bg-slate-900 border border-white/10 rounded-2xl space-y-4">
      <h4 className="text-xs font-bold text-white uppercase font-mono flex items-center gap-1.5">
        <TableIcon className="w-4 h-4 text-blue-400" /> Responsive Table Builder
      </h4>
      <button
        onClick={() => {
          onInsertTable && onInsertTable("<table><thead><tr><th>Header 1</th><th>Header 2</th></tr></thead><tbody><tr><td>Data 1</td><td>Data 2</td></tr></tbody></table>");
          onClose && onClose();
        }}
        className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
      >
        Insert Default Table
      </button>
    </div>
  );
}
