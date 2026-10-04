import React, { useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { Youtube } from "@tiptap/extension-youtube";
import { Link } from "@tiptap/extension-link";
import { TextAlign } from "@tiptap/extension-text-align";
import { Underline } from "@tiptap/extension-underline";
import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import { TaskItem } from "@tiptap/extension-task-item";
import { TaskList } from "@tiptap/extension-task-list";
import { Placeholder } from "@tiptap/extension-placeholder";
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, Code,
  Heading1, Heading2, Heading3, List, ListOrdered, Quote,
  Minus, Undo, Redo, Link as LinkIcon, Image as ImageIcon,
  Youtube as YoutubeIcon, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Table as TableIcon, CheckSquare, HelpCircle, Sparkles, Plus, Trash2,
  Zap, Code2, Eye, Search, Copy, Check, Wand2, X, CheckCircle2, ArrowRight
} from "lucide-react";
import { MediaAsset } from "../types";
import { FaqBlock, FaqItem, FaqQuestion, FaqAnswer } from "./tiptap-faq";
import { CtaBoxNode, CtaBoxAttributes, setGlobalOnEditCta } from "./tiptap-cta-box";
import ResponsiveTableBuilder from "./ResponsiveTableBuilder";
import CtaBoxBuilder from "./CtaBoxBuilder";
import { analyzeArticleForCta, SmartCtaRecommendation } from "../utils/smartCtaAnalyzer";

interface WordEditorProps {
  value: string;
  onChange: (html: string) => void;
  mediaAssets: MediaAsset[];
  onOpenMediaSelector: (onSelect: (url: string, altText?: string) => void) => void;
}

const MenuBar = ({
  editor,
  onOpenMediaSelector,
  onOpenTableBuilder,
  onOpenCtaBuilder,
  onOpenSmartCta,
  editorMode,
  onToggleMode
}: {
  editor: any;
  onOpenMediaSelector: any;
  onOpenTableBuilder: () => void;
  onOpenCtaBuilder: () => void;
  onOpenSmartCta: () => void;
  editorMode: "visual" | "code";
  onToggleMode: (mode: "visual" | "code") => void;
}) => {
  if (!editor) return null;

  const addImage = () => {
    onOpenMediaSelector((url: string, altText?: string) => {
      const alt = altText || "";
      editor.chain().focus().setImage({ src: url, alt }).run();
    });
  };

  const addYoutube = () => {
    const url = prompt("Enter YouTube URL");
    if (url) {
      editor.chain().focus().setYoutubeVideo({ src: url }).run();
    }
  };

  const addLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    if (url === null) return;

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url, target: "_blank" }).run();
  };

  const btnClass = "p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer";
  const activeBtnClass = "p-1.5 rounded bg-blue-600 text-white transition-colors cursor-pointer";
  const isTableActive = editor.isActive("table");

  return (
    <div className="flex flex-col border-b border-slate-800 bg-slate-900/60 rounded-t-xl sticky top-0 z-10">
      <div className="flex flex-wrap items-center justify-between gap-2 p-2">
        {/* Left Side: Standard Formatting Controls (only in visual mode) */}
        {editorMode === "visual" ? (
          <div className="flex flex-wrap items-center gap-1">
            <button type="button" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} className={btnClass} title="Undo"><Undo className="w-4 h-4" /></button>
            <button type="button" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} className={btnClass} title="Redo"><Redo className="w-4 h-4" /></button>
            <div className="w-px h-6 bg-slate-800 mx-1"></div>

            <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive("bold") ? activeBtnClass : btnClass} title="Bold"><Bold className="w-4 h-4" /></button>
            <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive("italic") ? activeBtnClass : btnClass} title="Italic"><Italic className="w-4 h-4" /></button>
            <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={editor.isActive("underline") ? activeBtnClass : btnClass} title="Underline"><UnderlineIcon className="w-4 h-4" /></button>
            <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={editor.isActive("strike") ? activeBtnClass : btnClass} title="Strikethrough"><Strikethrough className="w-4 h-4" /></button>
            <button type="button" onClick={() => editor.chain().focus().toggleCode().run()} className={editor.isActive("code") ? activeBtnClass : btnClass} title="Code"><Code className="w-4 h-4" /></button>
            <button type="button" onClick={addLink} className={editor.isActive("link") ? activeBtnClass : btnClass} title="Link"><LinkIcon className="w-4 h-4" /></button>
            <div className="w-px h-6 bg-slate-800 mx-1"></div>

            <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={editor.isActive("heading", { level: 1 }) ? activeBtnClass : btnClass} title="Heading 1"><Heading1 className="w-4 h-4" /></button>
            <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive("heading", { level: 2 }) ? activeBtnClass : btnClass} title="Heading 2"><Heading2 className="w-4 h-4" /></button>
            <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={editor.isActive("heading", { level: 3 }) ? activeBtnClass : btnClass} title="Heading 3"><Heading3 className="w-4 h-4" /></button>
            <div className="w-px h-6 bg-slate-800 mx-1"></div>

            <button type="button" onClick={() => editor.chain().focus().setTextAlign("left").run()} className={editor.isActive({ textAlign: "left" }) ? activeBtnClass : btnClass} title="Align Left"><AlignLeft className="w-4 h-4" /></button>
            <button type="button" onClick={() => editor.chain().focus().setTextAlign("center").run()} className={editor.isActive({ textAlign: "center" }) ? activeBtnClass : btnClass} title="Align Center"><AlignCenter className="w-4 h-4" /></button>
            <button type="button" onClick={() => editor.chain().focus().setTextAlign("right").run()} className={editor.isActive({ textAlign: "right" }) ? activeBtnClass : btnClass} title="Align Right"><AlignRight className="w-4 h-4" /></button>
            <button type="button" onClick={() => editor.chain().focus().setTextAlign("justify").run()} className={editor.isActive({ textAlign: "justify" }) ? activeBtnClass : btnClass} title="Justify"><AlignJustify className="w-4 h-4" /></button>
            <div className="w-px h-6 bg-slate-800 mx-1"></div>

            <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive("bulletList") ? activeBtnClass : btnClass} title="Bullet List"><List className="w-4 h-4" /></button>
            <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive("orderedList") ? activeBtnClass : btnClass} title="Numbered List"><ListOrdered className="w-4 h-4" /></button>
            <button type="button" onClick={() => editor.chain().focus().toggleTaskList().run()} className={editor.isActive("taskList") ? activeBtnClass : btnClass} title="Task List"><CheckSquare className="w-4 h-4" /></button>
            <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={editor.isActive("blockquote") ? activeBtnClass : btnClass} title="Quote"><Quote className="w-4 h-4" /></button>
            <button type="button" onClick={() => editor.chain().focus().setHorizontalRule().run()} className={btnClass} title="Horizontal Rule"><Minus className="w-4 h-4" /></button>
            <div className="w-px h-6 bg-slate-800 mx-1"></div>

            <button type="button" onClick={addImage} className={btnClass} title="Insert Image"><ImageIcon className="w-4 h-4" /></button>
            <button type="button" onClick={addYoutube} className={btnClass} title="Insert YouTube"><YoutubeIcon className="w-4 h-4" /></button>
            <button type="button" onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} className={editor.isActive("table") ? activeBtnClass : btnClass} title="Quick 3x3 Table"><TableIcon className="w-4 h-4" /></button>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-orange-400 font-mono py-1 px-2 bg-orange-950/30 rounded-lg border border-orange-500/20">
            <Code2 className="w-4 h-4 text-[#FF5722]" />
            <span>Raw HTML / Code Mode: Search, edit tags, or view clean markup directly below.</span>
          </div>
        )}

        {/* Right Side: WordPress Gutenberg High-Converting Builders & Mode Switch */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Smart CTA (Auto-Analyze Article) Button */}
          <button
            type="button"
            onClick={onOpenSmartCta}
            className="px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-400 hover:text-amber-300 flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer shadow-sm animate-pulse"
            title="Auto-detect topic from article and generate related CTA box"
          >
            <Wand2 className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Smart CTA</span>
            <span className="sm:hidden">Auto</span>
          </button>

          {/* CTA Callout Box Builder Button */}
          <button
            type="button"
            onClick={onOpenCtaBuilder}
            className="px-2.5 py-1 rounded-lg bg-[#FF5722]/15 hover:bg-[#FF5722]/25 border border-[#FF5722]/40 text-[#FF5722] hover:text-[#ff7043] flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer shadow-sm"
            title="Open WordPress Gutenberg CTA Callout Box Builder"
          >
            <Zap className="w-3.5 h-3.5 text-[#FF5722]" />
            <span>CTA Box</span>
          </button>

          {/* Table Builder Trigger Button */}
          <button
            type="button"
            onClick={onOpenTableBuilder}
            className="px-2.5 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:text-blue-300 flex items-center gap-1.5 text-xs font-semibold transition-all cursor-pointer shadow-sm"
            title="Responsive Table Builder & HTML Converter"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Theme Table</span>
          </button>

          {/* WordPress-style Visual vs HTML Code Tabs */}
          <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => onToggleMode("visual")}
              className={`px-2.5 py-1 rounded-md flex items-center gap-1 font-semibold transition-colors cursor-pointer ${
                editorMode === "visual"
                  ? "bg-slate-800 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              title="Visual Editor (WordPress Gutenberg WYSIWYG Mode)"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Visual</span>
            </button>
            <button
              type="button"
              onClick={() => onToggleMode("code")}
              className={`px-2.5 py-1 rounded-md flex items-center gap-1 font-semibold transition-colors cursor-pointer ${
                editorMode === "code"
                  ? "bg-[#FF5722] text-white shadow-sm font-bold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              title="HTML Code Mode (Search and edit raw HTML)"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>HTML</span>
            </button>
          </div>
        </div>
      </div>

      {/* Contextual Table Controls Toolbar (shown when table cell is active in visual mode) */}
      {editorMode === "visual" && isTableActive && (
        <div className="flex flex-wrap items-center gap-1.5 px-3 py-1.5 bg-slate-950/90 border-t border-slate-800 text-[11px] text-slate-300">
          <span className="text-slate-400 font-mono uppercase text-[10px] mr-1 flex items-center gap-1">
            <TableIcon className="w-3 h-3 text-[#FF5722]" /> Table Active:
          </span>
          <button type="button" onClick={() => editor.chain().focus().addRowBefore().run()} className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer">+ Row Above</button>
          <button type="button" onClick={() => editor.chain().focus().addRowAfter().run()} className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer">+ Row Below</button>
          <button type="button" onClick={() => editor.chain().focus().deleteRow().run()} className="px-2 py-0.5 rounded bg-red-950/60 hover:bg-red-900/60 text-red-300 cursor-pointer">- Del Row</button>
          <span className="text-slate-700">|</span>
          <button type="button" onClick={() => editor.chain().focus().addColumnBefore().run()} className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer">+ Col Left</button>
          <button type="button" onClick={() => editor.chain().focus().addColumnAfter().run()} className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer">+ Col Right</button>
          <button type="button" onClick={() => editor.chain().focus().deleteColumn().run()} className="px-2 py-0.5 rounded bg-red-950/60 hover:bg-red-900/60 text-red-300 cursor-pointer">- Del Col</button>
          <span className="text-slate-700">|</span>
          <button type="button" onClick={() => editor.chain().focus().deleteTable().run()} className="px-2 py-0.5 rounded bg-red-900/80 hover:bg-red-800 text-white font-medium cursor-pointer">Delete Table</button>
          <button type="button" onClick={onOpenTableBuilder} className="ml-auto px-2.5 py-0.5 rounded bg-[#FF5722] hover:bg-[#ff7043] text-white font-bold flex items-center gap-1 cursor-pointer">
            <Sparkles className="w-3 h-3" /> Custom Responsive Builder
          </button>
        </div>
      )}
    </div>
  );
};

function SlashMenu({
  editor,
  position,
  query,
  onClose,
  onOpenMediaSelector,
  onOpenTableBuilder,
  onOpenCtaBuilder,
  onOpenSmartCta
}: {
  editor: any;
  position: any;
  query: string;
  onClose: () => void;
  onOpenMediaSelector: (onSelect: (url: string, altText?: string) => void) => void;
  onOpenTableBuilder: () => void;
  onOpenCtaBuilder: () => void;
  onOpenSmartCta: () => void;
}) {
  if (!position) return null;

  const options = [
    { id: "smart-cta", label: "🪄 Auto-Generate Smart CTA from Article", icon: <Wand2 className="w-4 h-4 mr-2 text-amber-400" />, action: () => onOpenSmartCta() },
    { id: "cta", label: "⚡ CTA Callout Box (WordPress Gutenberg)", icon: <Zap className="w-4 h-4 mr-2 text-[#FF5722]" />, action: () => onOpenCtaBuilder() },
    { id: "h1", label: "Heading 1", icon: <Heading1 className="w-4 h-4 mr-2" />, action: () => editor.chain().focus().toggleHeading({ level: 1 }).run() },
    { id: "h2", label: "Heading 2", icon: <Heading2 className="w-4 h-4 mr-2" />, action: () => editor.chain().focus().toggleHeading({ level: 2 }).run() },
    { id: "h3", label: "Heading 3", icon: <Heading3 className="w-4 h-4 mr-2" />, action: () => editor.chain().focus().toggleHeading({ level: 3 }).run() },
    { id: "bullet", label: "Bullet List", icon: <List className="w-4 h-4 mr-2" />, action: () => editor.chain().focus().toggleBulletList().run() },
    { id: "ordered", label: "Numbered List", icon: <ListOrdered className="w-4 h-4 mr-2" />, action: () => editor.chain().focus().toggleOrderedList().run() },
    { id: "quote", label: "Quote", icon: <Quote className="w-4 h-4 mr-2" />, action: () => editor.chain().focus().toggleBlockquote().run() },
    {
      id: "image",
      label: "Image",
      icon: <ImageIcon className="w-4 h-4 mr-2" />,
      action: () => {
        onOpenMediaSelector((url, altText) => {
          editor.chain().focus().setImage({ src: url, alt: altText || "" }).run();
        });
      }
    },
    {
      id: "youtube",
      label: "YouTube Video",
      icon: <YoutubeIcon className="w-4 h-4 mr-2" />,
      action: () => {
        const url = window.prompt("Enter YouTube URL:");
        if (url) {
          editor.chain().focus().setYoutubeVideo({ src: url }).run();
        }
      }
    },
    { id: "responsive-table", label: "Theme Table Builder (Mobile, Tablet, Laptop)", icon: <Sparkles className="w-4 h-4 mr-2 text-[#FF5722]" />, action: () => onOpenTableBuilder() },
    { id: "table", label: "Quick Table (3x3 Grid)", icon: <TableIcon className="w-4 h-4 mr-2" />, action: () => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run() },
    { id: "faq", label: "FAQ Block", icon: <HelpCircle className="w-4 h-4 mr-2" />, action: () => editor.chain().focus().insertFaq().run() },
  ];

  const filteredOptions = options.filter((o) => o.label.toLowerCase().includes((query || "").toLowerCase()));

  if (filteredOptions.length === 0) return null;

  return (
    <div
      className="absolute z-50 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden py-1"
      style={{ top: position.top + 24, left: position.left }}
    >
      {filteredOptions.map((opt) => (
        <button
          key={opt.id}
          type="button"
          className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-blue-600 hover:text-white flex items-center transition-colors cursor-pointer"
          onClick={() => {
            editor.chain().focus().deleteRange({ from: position.from, to: position.to }).run();
            opt.action();
            onClose();
          }}
        >
          {opt.icon}
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export default function GutenbergEditor({ value, onChange, mediaAssets, onOpenMediaSelector }: WordEditorProps) {
  const [isReady, setIsReady] = useState(false);
  const [showTableBuilder, setShowTableBuilder] = useState(false);
  const [showCtaBuilder, setShowCtaBuilder] = useState(false);
  const [ctaBuilderInitialValues, setCtaBuilderInitialValues] = useState<Partial<CtaBoxAttributes> | undefined>(undefined);
  const [editorMode, setEditorMode] = useState<"visual" | "code">("visual");
  const [rawHtml, setRawHtml] = useState(value || "");
  const [htmlSearch, setHtmlSearch] = useState("");
  const [slashPos, setSlashPos] = useState<any>(null);
  const isFirstRender = useRef(true);

  // Smart Article CTA Detection States
  const [smartSuggestion, setSmartSuggestion] = useState<SmartCtaRecommendation | null>(null);
  const [smartAlternatives, setSmartAlternatives] = useState<SmartCtaRecommendation[]>([]);
  const [showSmartBanner, setShowSmartBanner] = useState(false);
  const [showSmartModal, setShowSmartModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Wire up global edit handler for in-editor Gutenberg CTA blocks
  useEffect(() => {
    setGlobalOnEditCta((attrs) => {
      setCtaBuilderInitialValues(attrs);
      setShowCtaBuilder(true);
    });
    return () => {
      setGlobalOnEditCta(null);
    };
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4, 5, 6] },
        codeBlock: { HTMLAttributes: { class: "bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-sm overflow-x-auto my-4" } },
        blockquote: { HTMLAttributes: { class: "border-l-4 border-blue-500 pl-4 py-1 italic text-slate-300 my-4 bg-slate-800/30 rounded-r-lg" } }
      }),
      Underline,
      TextStyle,
      Color,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      FaqBlock,
      FaqItem,
      FaqQuestion,
      FaqAnswer,
      CtaBoxNode,
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "text-blue-400 underline" } }),
      Image.configure({ HTMLAttributes: { class: "max-w-full h-auto rounded-xl my-4 mx-auto" } }),
      Youtube.configure({ HTMLAttributes: { class: "w-full aspect-video rounded-xl my-4" } }),
      TaskList.configure({ HTMLAttributes: { class: "list-none p-0 my-4 space-y-2" } }),
      TaskItem.configure({ nested: true, HTMLAttributes: { class: "flex gap-2 items-start" } }),
      Table.configure({ resizable: true, HTMLAttributes: { class: "w-full border-collapse border border-slate-700 my-4 text-sm" } }),
      TableRow,
      TableHeader.configure({ HTMLAttributes: { class: "border border-slate-700 p-2 bg-slate-800 font-bold" } }),
      TableCell.configure({ HTMLAttributes: { class: "border border-slate-700 p-2" } }),
      Placeholder.configure({ placeholder: "Start writing, paste your article, or type / for Gutenberg blocks (CTA Box, Smart CTA, Table, FAQ)..." })
    ],
    content: value,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setRawHtml(html);
      onChange(html);

      const { state, view } = editor;
      const { selection } = state;
      if (selection.empty) {
        const $pos = selection.$anchor;
        const textBefore = $pos.parent.textContent.substring(0, $pos.parentOffset);
        const match = textBefore.match(/(?:^|\s)\/([^\s]*)$/);

        if (match) {
          const query = match[1];
          const from = $pos.pos - match[1].length - 1;
          const coords = view.coordsAtPos(from);
          const parentEl = view.dom.parentElement;
          if (parentEl) {
            const containerRect = parentEl.getBoundingClientRect();

            setSlashPos({
              top: coords.top - containerRect.top + parentEl.scrollTop,
              left: coords.left - containerRect.left,
              query,
              from,
              to: $pos.pos
            });
          }
        } else {
          setSlashPos(null);
        }
      } else {
        setSlashPos(null);
      }
    },
    onCreate: () => {
      setIsReady(true);
    },
    editorProps: {
      attributes: {
        class: "max-w-none focus:outline-none min-h-[400px] p-6 pb-20 leading-relaxed text-slate-200"
      },
      handleClick: (view, pos, event) => {
        if (event.target instanceof HTMLImageElement) {
          const img = event.target;
          const currentAlt = img.alt || "";

          setTimeout(() => {
            const newAlt = window.prompt("Update SEO alt text (or leave empty):", currentAlt);
            if (newAlt !== null) {
              editor.commands.updateAttributes("image", { alt: newAlt });
            }
          }, 50);
          return false;
        }
        return false;
      },
      // Smart Auto-Detection on Paste: examine pasted article and detect relevant tool CTA
      handlePaste: (view, event) => {
        const text = event.clipboardData?.getData("text/plain") || "";
        if (text && text.trim().split(/\s+/).length >= 30) {
          const analysis = analyzeArticleForCta(text);
          if (analysis && analysis.bestMatch) {
            setSmartSuggestion(analysis.bestMatch);
            setSmartAlternatives(analysis.alternatives);
            setShowSmartBanner(true);
          }
        }
        return false; // let normal paste proceed into the editor
      }
    }
  });

  // Sync external value
  useEffect(() => {
    if (editor && isFirstRender.current && value) {
      if (editor.getHTML() !== value) {
        editor.commands.setContent(value);
      }
      setRawHtml(value);
      isFirstRender.current = false;
    }
  }, [value, editor]);

  // Handle mode toggle (Visual <-> Code)
  const handleToggleMode = (newMode: "visual" | "code") => {
    if (newMode === "code") {
      if (editor) {
        const currentHtml = editor.getHTML();
        setRawHtml(currentHtml);
      }
      setEditorMode("code");
    } else {
      // Switching to visual: push rawHtml into TipTap editor
      if (editor) {
        editor.commands.setContent(rawHtml);
      }
      onChange(rawHtml);
      setEditorMode("visual");
    }
  };

  const handleRawHtmlChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setRawHtml(val);
    onChange(val);
  };

  // Run Smart CTA Analysis on Current Editor Content
  const handleRunSmartCtaAnalysis = () => {
    const currentText = editor?.getText() || rawHtml;
    if (!currentText || currentText.trim().split(/\s+/).length < 20) {
      // Fallback for short content: default to Broken Link Checker
      const fallbackAnalysis = analyzeArticleForCta("seo audit website links speed performance");
      setSmartSuggestion(fallbackAnalysis.bestMatch);
      setSmartAlternatives(fallbackAnalysis.alternatives);
      setShowSmartModal(true);
      return;
    }

    const analysis = analyzeArticleForCta(currentText);
    setSmartSuggestion(analysis.bestMatch);
    setSmartAlternatives(analysis.alternatives);
    setShowSmartModal(true);
  };

  // Insert a smart CTA recommendation into the editor
  const handleInsertSmartCta = (rec: SmartCtaRecommendation) => {
    if (editorMode === "visual" && editor) {
      editor
        .chain()
        .focus()
        .insertContent({
          type: "ctaBox",
          attrs: {
            badge: rec.badge,
            title: rec.title,
            description: rec.description,
            buttonText: rec.buttonText,
            buttonUrl: rec.buttonUrl,
            footerNote: rec.footerNote,
            theme: rec.theme,
            layout: rec.layout
          }
        })
        .run();
    } else {
      // Code mode fallback: compile HTML string
      const ctaHtml = `<aside class="metazivo-cta-box not-prose my-8 p-6 md:p-7 rounded-2xl border transition-all" data-type="cta-box" data-badge="${rec.badge}" data-title="${rec.title}" data-description="${rec.description}" data-button-text="${rec.buttonText}" data-button-url="${rec.buttonUrl}" data-footer-note="${rec.footerNote}" data-theme="${rec.theme}" data-layout="${rec.layout}">
  <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
    <div class="space-y-2.5 max-w-xl">
      <div class="cta-badge inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase">${rec.badge}</div>
      <h3 class="cta-title text-lg md:text-xl font-extrabold tracking-tight m-0">${rec.title}</h3>
      <p class="cta-desc text-sm leading-relaxed m-0">${rec.description}</p>
      <p class="cta-footer text-xs font-medium m-0 pt-1">${rec.footerNote}</p>
    </div>
    <div class="shrink-0 md:self-center">
      <a href="${rec.buttonUrl}" class="metazivo-cta-btn inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm tracking-wide text-white">${rec.buttonText}</a>
    </div>
  </div>
</aside>`;
      const updated = rawHtml + "\n\n" + ctaHtml;
      setRawHtml(updated);
      onChange(updated);
    }

    setShowSmartBanner(false);
    setShowSmartModal(false);
    showToast(`✓ Inserted Gutenberg CTA Block for "${rec.detectedTopicName}"!`);
  };

  if (!editor) {
    return (
      <div className="min-h-[500px] flex items-center justify-center bg-slate-900 border border-slate-800 rounded-2xl animate-pulse text-slate-400">
        Loading WordPress Gutenberg Editor...
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-slate-950 border border-slate-800 rounded-2xl shadow-xl overflow-hidden tiptap-container relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-14 right-4 z-50 bg-emerald-500 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      <MenuBar
        editor={editor}
        onOpenMediaSelector={onOpenMediaSelector}
        onOpenTableBuilder={() => setShowTableBuilder(true)}
        onOpenCtaBuilder={() => {
          setCtaBuilderInitialValues(undefined);
          setShowCtaBuilder(true);
        }}
        onOpenSmartCta={handleRunSmartCtaAnalysis}
        editorMode={editorMode}
        onToggleMode={handleToggleMode}
      />

      {/* Floating Smart Article Analysis Banner (shown automatically when user pastes article) */}
      {showSmartBanner && smartSuggestion && (
        <div className="bg-gradient-to-r from-orange-950/90 via-slate-900 to-amber-950/90 border-b border-orange-500/40 px-4 py-3 flex flex-wrap items-center justify-between gap-3 shadow-lg animate-fade-in z-20">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-xl bg-gradient-to-br from-[#FF5722] to-amber-500 text-white shadow-md">
              <Wand2 className="w-4 h-4 animate-spin-slow" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5 flex-wrap">
                <span>🪄 Smart Article Detected:</span>
                <span className="text-orange-400 underline decoration-orange-500/60 font-extrabold">
                  {smartSuggestion.detectedTopicName}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px]">
                  Suggested Tool: {smartSuggestion.buttonUrl}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Automatically generate a high-converting CTA card matching your article's topic.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleInsertSmartCta(smartSuggestion)}
              className="px-3.5 py-1.5 rounded-xl bg-[#FF5722] hover:bg-orange-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-orange-500/20 cursor-pointer transition-all active:scale-95"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Insert Matching CTA Box</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setCtaBuilderInitialValues({
                  badge: smartSuggestion.badge,
                  title: smartSuggestion.title,
                  description: smartSuggestion.description,
                  buttonText: smartSuggestion.buttonText,
                  buttonUrl: smartSuggestion.buttonUrl,
                  footerNote: smartSuggestion.footerNote,
                  theme: smartSuggestion.theme,
                  layout: smartSuggestion.layout
                });
                setShowCtaBuilder(true);
                setShowSmartBanner(false);
              }}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 cursor-pointer"
            >
              Customize
            </button>

            <button
              type="button"
              onClick={() => setShowSmartBanner(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {editorMode === "visual" ? (
        <div className="flex-1 overflow-y-auto max-h-[800px] scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent p-4 relative">
          <EditorContent editor={editor} />
          <SlashMenu
            editor={editor}
            position={slashPos}
            query={slashPos?.query}
            onClose={() => setSlashPos(null)}
            onOpenMediaSelector={onOpenMediaSelector}
            onOpenTableBuilder={() => setShowTableBuilder(true)}
            onOpenCtaBuilder={() => {
              setCtaBuilderInitialValues(undefined);
              setShowCtaBuilder(true);
            }}
            onOpenSmartCta={handleRunSmartCtaAnalysis}
          />
        </div>
      ) : (
        /* Raw HTML Code Editor Mode */
        <div className="flex-1 flex flex-col p-4 bg-slate-950 font-mono">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2 flex-1 max-w-md bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
              <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={htmlSearch}
                onChange={(e) => setHtmlSearch(e.target.value)}
                placeholder="Search inside HTML code (e.g. metazivo-cta-box, table, h2)..."
                className="w-full bg-transparent text-slate-200 placeholder:text-slate-500 focus:outline-none text-xs"
              />
              {htmlSearch && (
                <span className="text-[10px] text-orange-400 whitespace-nowrap">
                  {rawHtml.toLowerCase().split(htmlSearch.toLowerCase()).length - 1} matches
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRunSmartCtaAnalysis}
                className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>🪄 Auto-Detect CTA from Article</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCtaBuilderInitialValues(undefined);
                  setShowCtaBuilder(true);
                }}
                className="px-3 py-1.5 rounded-lg bg-[#FF5722] hover:bg-orange-600 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>+ Insert CTA Box HTML</span>
              </button>
              <button
                type="button"
                onClick={() => handleToggleMode("visual")}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Switch to Visual Preview</span>
              </button>
            </div>
          </div>

          <textarea
            value={rawHtml}
            onChange={handleRawHtmlChange}
            rows={22}
            spellCheck={false}
            className="w-full p-4 mt-3 bg-slate-900/90 text-orange-200/90 border border-slate-800 rounded-xl font-mono text-xs leading-relaxed focus:outline-none focus:border-[#FF5722] resize-y scrollbar-thin"
            placeholder="Type or paste your raw HTML here. Use the CTA Box Builder to insert styled callouts..."
          />

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 font-mono">
            <span>Length: {rawHtml.length} characters</span>
            <span>Switch to 'Visual' above to see the WordPress Gutenberg visual block layout.</span>
          </div>
        </div>
      )}

      {/* CTA Box Builder Modal */}
      {showCtaBuilder && (
        <CtaBoxBuilder
          isOpen={showCtaBuilder}
          initialValues={ctaBuilderInitialValues}
          articleContent={editor?.getText() || rawHtml}
          onClose={() => {
            setShowCtaBuilder(false);
            setCtaBuilderInitialValues(undefined);
          }}
          onInsertCta={(ctaHtml, attrs) => {
            if (editorMode === "code") {
              const updated = rawHtml + "\n\n" + ctaHtml;
              setRawHtml(updated);
              onChange(updated);
            } else if (attrs) {
              editor.chain().focus().insertContent({ type: "ctaBox", attrs }).run();
            } else {
              editor.chain().focus().insertContent(ctaHtml).run();
            }
            setShowCtaBuilder(false);
            setCtaBuilderInitialValues(undefined);
            showToast("✓ Gutenberg CTA Callout Box added!");
          }}
        />
      )}

      {/* Smart Article CTA Selector Modal (Triggered by Toolbar Button) */}
      {showSmartModal && smartSuggestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fade-in font-sans">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl flex flex-col shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg">
                  <Wand2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    Auto-Detected Smart CTA for Article
                  </h3>
                  <p className="text-xs text-slate-400">
                    Our semantic analyzer examined your article content and picked the most relevant MetaZivo tool.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSmartModal(false)}
                className="p-2 text-slate-400 hover:text-white rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh]">
              {/* Primary Match Card */}
              <div className="p-5 rounded-2xl bg-slate-950 border-2 border-[#FF5722]/60 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#FF5722]/20 border border-[#FF5722]/40 text-[#FF5722] text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                    <Zap className="w-3 h-3" /> Best Recommendation (99% Match)
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Topic: {smartSuggestion.detectedTopicName}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-orange-950/20 border border-orange-500/30">
                  <div className="text-xs font-bold text-orange-400 uppercase tracking-wide">
                    {smartSuggestion.badge}
                  </div>
                  <h4 className="text-base font-extrabold text-white mt-1">
                    {smartSuggestion.title}
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {smartSuggestion.description}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-[#FF5722] text-white text-xs font-bold">
                      <span>{smartSuggestion.buttonText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Destination: {smartSuggestion.buttonUrl}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCtaBuilderInitialValues(smartSuggestion);
                      setShowSmartModal(false);
                      setShowCtaBuilder(true);
                    }}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 cursor-pointer"
                  >
                    Customize in Builder
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInsertSmartCta(smartSuggestion)}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#FF5722] to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-orange-500/25 cursor-pointer active:scale-95"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Insert This CTA Block</span>
                  </button>
                </div>
              </div>

              {/* Alternative Recommendations */}
              {smartAlternatives.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Alternative Related Tools for this Article:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {smartAlternatives.map((alt) => (
                      <div
                        key={alt.topicId}
                        className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 flex flex-col justify-between transition-all"
                      >
                        <div>
                          <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wide">
                            {alt.badge}
                          </span>
                          <h5 className="text-xs font-bold text-white mt-1">
                            {alt.title}
                          </h5>
                          <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                            {alt.description}
                          </p>
                        </div>
                        <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-800">
                          <span className="text-[10px] font-mono text-slate-500 truncate max-w-[140px]">
                            {alt.buttonUrl}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleInsertSmartCta(alt)}
                            className="px-2.5 py-1 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/40 text-blue-300 text-xs font-semibold cursor-pointer"
                          >
                            Insert →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Responsive Table Builder Modal */}
      {showTableBuilder && (
        <ResponsiveTableBuilder
          isOpen={showTableBuilder}
          onClose={() => setShowTableBuilder(false)}
          onInsertTable={(html) => {
            if (editorMode === "code") {
              const updated = rawHtml + "\n\n" + html;
              setRawHtml(updated);
              onChange(updated);
            } else {
              editor.chain().focus().insertContent(html).run();
            }
            setShowTableBuilder(false);
            showToast("✓ Responsive Theme Table added!");
          }}
        />
      )}

      <style>{`
        .tiptap-container .ProseMirror ul[data-type="taskList"] {
          list-style: none;
          padding: 0;
        }
        .tiptap-container .ProseMirror ul[data-type="taskList"] li {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
        }
        .tiptap-container .ProseMirror ul[data-type="taskList"] li > label {
          margin-top: 0.2rem;
          user-select: none;
        }
        .tiptap-container .ProseMirror ul[data-type="taskList"] li > div {
          flex: 1;
        }
        .tiptap-container .ProseMirror p.is-editor-empty:first-child::before {
          color: #64748b;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }
        .tiptap-container .ProseMirror ul:not([data-type="taskList"]) {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin-bottom: 1rem;
        }
        .tiptap-container .ProseMirror ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
          margin-bottom: 1rem;
        }
        .tiptap-container .ProseMirror h1 { font-size: 2.25rem; font-weight: 800; margin-top: 2rem; margin-bottom: 1rem; color: #f8fafc; }
        .tiptap-container .ProseMirror h2 { font-size: 1.875rem; font-weight: 700; margin-top: 1.5rem; margin-bottom: 0.75rem; color: #f8fafc; }
        .tiptap-container .ProseMirror h3 { font-size: 1.5rem; font-weight: 600; margin-top: 1.25rem; margin-bottom: 0.5rem; color: #f1f5f9; }
        .tiptap-container .ProseMirror p { color: #f8fafc !important; }
        .tiptap-container .ProseMirror { color: #f8fafc !important; }
        .tiptap-container .ProseMirror * { color: #e2e8f0; }
        .tiptap-container .ProseMirror h1, 
        .tiptap-container .ProseMirror h2, 
        .tiptap-container .ProseMirror h3, 
        .tiptap-container .ProseMirror h4, 
        .tiptap-container .ProseMirror h5, 
        .tiptap-container .ProseMirror h6, 
        .tiptap-container .ProseMirror p, 
        .tiptap-container .ProseMirror li, 
        .tiptap-container .ProseMirror strong, 
        .tiptap-container .ProseMirror em {
          color: #f8fafc !important;
        }

        /* In-Editor Preview styling for Metazivo CTA Box Node */
        .tiptap-container .ProseMirror .gutenberg-cta-block-node {
          margin: 1.75rem 0;
        }
        .tiptap-container .ProseMirror .metazivo-cta-box {
          color: #0f172a !important;
        }
        .tiptap-container .ProseMirror .metazivo-cta-box * {
          color: inherit;
        }
        .tiptap-container .ProseMirror .metazivo-cta-box h3 {
          margin-top: 0 !important;
          margin-bottom: 0.5rem !important;
        }
        .tiptap-container .ProseMirror .metazivo-cta-btn {
          color: #ffffff !important;
        }
      `}</style>
    </div>
  );
}
