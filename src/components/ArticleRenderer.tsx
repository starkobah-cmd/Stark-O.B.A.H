import React, { useState, useMemo } from 'react';
import { Code2, Check, Copy, ExternalLink, Sparkles, Info, Quote as QuoteIcon } from 'lucide-react';
import { BlogPost, BlogBlock } from '../types';

export interface HeadingItem {
  id: string;
  text: string;
  level: number;
}

// Slugify helper to create URL-safe anchor IDs for headings
export const slugifyHeading = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/<[^>]*>?/gm, '') // strip HTML
    .replace(/[^\w\s-]/g, '') // remove non-alphanumeric except spaces and hyphens
    .trim()
    .replace(/\s+/g, '-'); // replace spaces with hyphens
};

// Helper to extract Table of Contents headings (H2 & H3) from any BlogPost
export const extractArticleHeadings = (post: BlogPost): HeadingItem[] => {
  const headings: HeadingItem[] = [];
  const seenIds = new Set<string>();

  const addHeading = (text: string, level: number) => {
    const cleanText = text.replace(/<[^>]*>?/gm, '').trim();
    if (!cleanText) return;
    // Suppress heading if it matches the main article title exactly
    if (post.title && cleanText.toLowerCase() === post.title.trim().toLowerCase()) {
      return;
    }
    let baseId = slugifyHeading(cleanText) || `section-${headings.length + 1}`;
    let uniqueId = baseId;
    let counter = 1;
    while (seenIds.has(uniqueId)) {
      uniqueId = `${baseId}-${counter++}`;
    }
    seenIds.add(uniqueId);
    headings.push({ id: uniqueId, text: cleanText, level });
  };

  // 1. If post has structured blocks
  if (post.blocks && post.blocks.length > 0) {
    post.blocks.forEach((block) => {
      if (block.type === 'heading') {
        const level = block.data.level || 2;
        if (level === 2 || level === 3) {
          addHeading(block.data.text || '', level);
        }
      }
    });
    if (headings.length > 0) return headings;
  }

  // 2. Otherwise extract from markdown / HTML content
  const content = post.content || '';
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('## ') && !line.startsWith('### ')) {
      addHeading(line.replace(/^##\s+/, ''), 2);
    } else if (line.startsWith('### ') && !line.startsWith('#### ')) {
      addHeading(line.replace(/^###\s+/, ''), 3);
    } else if (line.match(/^<h2[^>]*>(.*?)<\/h2>/i)) {
      const match = line.match(/^<h2[^>]*>(.*?)<\/h2>/i);
      if (match && match[1]) addHeading(match[1], 2);
    } else if (line.match(/^<h3[^>]*>(.*?)<\/h3>/i)) {
      const match = line.match(/^<h3[^>]*>(.*?)<\/h3>/i);
      if (match && match[1]) addHeading(match[1], 3);
    }
  }

  return headings;
};

// Check if a string looks like raw internal JSON / schema data that should never be shown
export const isInternalSchemaOrTechnicalPayload = (text: string): boolean => {
  if (!text) return false;
  const trimmed = text.trim();
  const lower = trimmed.toLowerCase();
  
  if (
    lower.includes('schema.org') ||
    lower.includes('"@context"') ||
    lower.includes("'@context'") ||
    lower.includes('"@type"') ||
    lower.includes("'@type'") ||
    lower.includes('blogposting') ||
    lower.includes('breadcrumblist') ||
    lower.includes('application/ld+json') ||
    lower.includes('itemscope') ||
    lower.includes('itemtype') ||
    lower.includes('headerbar') ||
    lower.includes('next-gen headers')
  ) {
    return true;
  }
  
  // Check if it's a raw unformatted JSON object dumped by mistake
  if (trimmed.startsWith('{') && trimmed.endsWith('}') && (trimmed.includes('"slug":') || trimmed.includes('"customSchema":'))) {
    return true;
  }
  return false;
};

// Formats inline text with **bold**, *italic*, [link](url), and `inline code`
export const renderFormattedInlineText = (text: string): React.ReactNode => {
  if (!text) return null;

  const parts: React.ReactNode[] = [];
  const regex = /(`[^`]+`|\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|\*[^*]+\*|__[^_]+__|_[^_]+_)/g;
  
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    const before = text.substring(lastIndex, match.index);
    if (before) parts.push(before);

    const token = match[0];
    if (token.startsWith('`') && token.endsWith('`')) {
      // Inline code
      parts.push(
        <code key={match.index} className="px-1.5 py-0.5 rounded-md bg-slate-900 text-sky-300 font-mono text-[0.88em] border border-slate-800">
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith('[') && token.includes('](')) {
      // Link
      const linkMatch = token.match(/^\[(.*?)\]\((.*?)\)$/);
      if (linkMatch) {
        const linkText = linkMatch[1];
        const linkUrl = linkMatch[2];
        const isExternal = linkUrl.startsWith('http');
        parts.push(
          <a
            key={match.index}
            href={linkUrl}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            className="text-sky-400 hover:text-sky-300 font-medium underline underline-offset-4 decoration-sky-400/40 hover:decoration-sky-300 transition-colors inline-flex items-center gap-0.5"
          >
            <span>{linkText}</span>
            {isExternal && <ExternalLink className="w-3 h-3 inline-block shrink-0 ml-0.5 opacity-70" />}
          </a>
        );
      } else {
        parts.push(token);
      }
    } else if (token.startsWith('**') && token.endsWith('**')) {
      // Bold
      parts.push(
        <strong key={match.index} className="font-extrabold text-white">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('__') && token.endsWith('__')) {
      // Bold alternate
      parts.push(
        <strong key={match.index} className="font-extrabold text-white">
          {token.slice(2, -2)}
        </strong>
      );
    } else if ((token.startsWith('*') && token.endsWith('*')) || (token.startsWith('_') && token.endsWith('_'))) {
      // Italic
      parts.push(
        <em key={match.index} className="italic text-slate-200">
          {token.slice(1, -1)}
        </em>
      );
    } else {
      parts.push(token);
    }

    lastIndex = regex.lastIndex;
  }

  const remaining = text.substring(lastIndex);
  if (remaining) parts.push(remaining);

  return parts;
};

// Reusable Code Snippet Box with Copy Button & Horizontal Scroll
const ArticleCodeBlock: React.FC<{ code: string; language?: string }> = ({ code, language = 'typescript' }) => {
  const [copied, setCopied] = useState(false);

  // Safety filter: never render schema JSON code on frontend
  if (isInternalSchemaOrTechnicalPayload(code)) {
    return null;
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-8 rounded-2xl bg-[#050816] border border-slate-800 overflow-hidden shadow-2xl">
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 text-xs font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-sky-400" />
          <span className="text-sky-300 font-semibold uppercase tracking-wider">{language}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer text-xs"
          title="Copy code to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 sm:p-5 text-xs sm:text-sm font-mono text-sky-200/95 overflow-x-auto leading-relaxed scrollbar-thin scrollbar-thumb-slate-700">
        <code>{code}</code>
      </pre>
    </div>
  );
};

// Reusable Responsive Table (horizontal scrolling on mobile inside container only)
const ArticleTable: React.FC<{ columns: string[]; rows: string[][] }> = ({ columns, rows }) => {
  return (
    <div className="my-8 overflow-x-auto rounded-2xl border border-slate-800 bg-[#0B1120] shadow-xl">
      <table className="w-full text-left border-collapse text-xs sm:text-sm">
        {columns && columns.length > 0 && (
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/90">
              {columns.map((col, idx) => (
                <th key={idx} className="p-4 font-bold text-sky-400 whitespace-nowrap">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody className="divide-y divide-slate-800/60">
          {rows.map((row, rIdx) => (
            <tr key={rIdx} className="hover:bg-slate-900/40 transition-colors">
              {row.map((cell, cIdx) => (
                <td key={cIdx} className="p-4 text-slate-300">
                  {renderFormattedInlineText(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Reusable Inline Article Image with Caption
const ArticleInlineImage: React.FC<{
  imageUrl: string;
  altText?: string;
  caption?: string;
  alignment?: 'left' | 'center' | 'right';
  link?: string;
}> = ({ imageUrl, altText = 'Article illustration', caption, alignment = 'center', link }) => {
  const alignClasses =
    alignment === 'left' ? 'text-left' : alignment === 'right' ? 'text-right' : 'text-center';

  const imageElem = (
    <img
      src={imageUrl}
      alt={altText}
      loading="lazy"
      className="rounded-2xl sm:rounded-3xl max-h-[550px] inline-block object-cover shadow-2xl border border-slate-800/90 w-full"
    />
  );

  return (
    <figure className={`my-8 ${alignClasses}`}>
      {link ? (
        <a href={link} target="_blank" rel="noopener noreferrer" className="inline-block hover:opacity-95 transition-opacity">
          {imageElem}
        </a>
      ) : (
        imageElem
      )}
      {caption && (
        <figcaption className="text-xs sm:text-sm text-slate-400 mt-3 text-center italic leading-relaxed">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};

// Editorial Callout / Key Takeaway Box
const ArticleCallout: React.FC<{ title?: string; children: React.ReactNode }> = ({
  title = 'KEY TAKEAWAY',
  children
}) => {
  return (
    <div className="my-8 p-6 rounded-2xl bg-[#0B1120] border-l-4 border-sky-400 border-t border-r border-b border-slate-800/80 shadow-lg space-y-2">
      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-sky-400">
        <Sparkles className="w-3.5 h-3.5 text-sky-400" />
        <span>{title}</span>
      </div>
      <div className="text-slate-200 text-sm sm:text-base leading-relaxed">
        {children}
      </div>
    </div>
  );
};

interface ArticleRendererProps {
  post: BlogPost;
  className?: string;
}

export const ArticleRenderer: React.FC<ArticleRendererProps> = ({ post, className = '' }) => {
  // If structured blocks are provided, render them sequentially
  if (post.blocks && post.blocks.length > 0) {
    return (
      <div className={`space-y-6 text-slate-300 ${className}`}>
        {post.blocks.map((block, i) => {
          const data = block.data || {};

          switch (block.type) {
            case 'heading': {
              const text = data.text || '';
              const id = slugifyHeading(text);
              const level = data.level || 2;
              if (level === 1) {
                // If this matches the main article title, avoid duplicate display
                if (post.title && text.trim().toLowerCase() === post.title.trim().toLowerCase()) {
                  return null;
                }
                return (
                  <h1 key={block.id || i} id={id} className="text-3xl sm:text-4xl font-black text-white mt-12 mb-4 tracking-tight scroll-mt-28">
                    {renderFormattedInlineText(text)}
                  </h1>
                );
              } else if (level === 3) {
                return (
                  <h3 key={block.id || i} id={id} className="text-xl sm:text-2xl font-bold text-sky-200 mt-8 mb-3 scroll-mt-28">
                    {renderFormattedInlineText(text)}
                  </h3>
                );
              } else if (level === 4) {
                return (
                  <h4 key={block.id || i} id={id} className="text-lg font-bold text-white mt-6 mb-2 scroll-mt-28">
                    {renderFormattedInlineText(text)}
                  </h4>
                );
              }
              return (
                <h2 key={block.id || i} id={id} className="text-2xl sm:text-3xl font-extrabold text-white mt-12 mb-4 tracking-tight scroll-mt-28">
                  {renderFormattedInlineText(text)}
                </h2>
              );
            }
            case 'introduction':
              return (
                <div key={block.id || i} className="my-6 p-6 rounded-2xl bg-[#0B1120] border-l-4 border-sky-400 border border-slate-800 text-sky-100 text-lg font-medium leading-relaxed shadow-lg">
                  {renderFormattedInlineText(data.text || '')}
                </div>
              );
            case 'paragraph':
              if (isInternalSchemaOrTechnicalPayload(data.text || '')) return null;
              return (
                <p key={block.id || i} className="text-slate-300 text-base sm:text-lg leading-[1.8] my-5 font-normal">
                  {renderFormattedInlineText(data.text || '')}
                </p>
              );
            case 'image':
              if (!data.imageUrl) return null;
              return (
                <ArticleInlineImage
                  key={block.id || i}
                  imageUrl={data.imageUrl}
                  altText={data.altText}
                  caption={data.caption}
                  alignment={data.alignment}
                  link={data.link}
                />
              );
            case 'table':
              return (
                <ArticleTable
                  key={block.id || i}
                  columns={data.columns || []}
                  rows={data.rows || []}
                />
              );
            case 'quote':
              return (
                <blockquote key={block.id || i} className="my-8 pl-6 border-l-2 border-sky-400 italic text-slate-200 text-base sm:text-lg leading-relaxed font-normal">
                  "{renderFormattedInlineText(data.text || '')}"
                </blockquote>
              );
            case 'bullet-list':
              return (
                <ul key={block.id || i} className="my-5 space-y-3 list-none pl-2">
                  {(data.items || []).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-slate-300 text-base leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-2.5 shrink-0" />
                      <span>{renderFormattedInlineText(item)}</span>
                    </li>
                  ))}
                </ul>
              );
            case 'numbered-list':
              return (
                <ol key={block.id || i} className="my-5 space-y-3 list-none pl-2">
                  {(data.items || []).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-slate-300 text-base leading-relaxed">
                      <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center font-mono text-xs font-bold mt-0.5 shrink-0">
                        {idx + 1}
                      </span>
                      <span>{renderFormattedInlineText(item)}</span>
                    </li>
                  ))}
                </ol>
              );
            case 'custom-code':
              if (isInternalSchemaOrTechnicalPayload(data.code || '')) return null;
              return (
                <ArticleCodeBlock
                  key={block.id || i}
                  code={data.code || ''}
                  language={data.language || 'typescript'}
                />
              );
            case 'faq':
              return (
                <div key={block.id || i} className="my-8 space-y-4">
                  <h3 className="text-xl font-extrabold text-white mb-4">Frequently Asked Questions</h3>
                  {(data.questions || []).map((faq, idx) => (
                    <div key={idx} className="p-5 rounded-2xl bg-[#0B1120] border border-slate-800 space-y-2">
                      <h4 className="text-sm sm:text-base font-bold text-sky-300 flex items-center gap-2">
                        <span className="text-sky-500 font-mono">Q.</span>
                        <span>{faq.question}</span>
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-300 pl-5 leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              );
            case 'custom-html':
              if (isInternalSchemaOrTechnicalPayload(data.html || '')) return null;
              return (
                <div
                  key={block.id || i}
                  className="my-6 overflow-x-auto rounded-xl"
                  dangerouslySetInnerHTML={{ __html: data.html || '' }}
                />
              );
            case 'divider':
              return <hr key={block.id || i} className="my-10 border-slate-800/60" />;
            default:
              return null;
          }
        })}
      </div>
    );
  }

  // Fallback: Parse markdown & HTML content dynamically
  const content = post.content || '';
  if (!content.trim()) {
    return <p className="text-slate-400 italic">No content provided for this article.</p>;
  }

  const renderedElements = parseMarkdownContent(content, post.title);

  return (
    <div className={`space-y-6 text-slate-300 leading-relaxed ${className}`}>
      {renderedElements}
    </div>
  );
};

// Parser to convert markdown/HTML text into clean React components
function parseMarkdownContent(content: string, postTitle?: string): React.ReactNode[] {
  const elements: React.ReactNode[] = [];
  const lines = content.split('\n');
  let i = 0;
  let elementIndex = 0;

  while (i < lines.length) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    if (!trimmed) {
      i++;
      continue;
    }

    // 0. Safety Check: Filter out raw JSON-LD or internal schemas completely
    if (isInternalSchemaOrTechnicalPayload(trimmed)) {
      if (trimmed.startsWith('{')) {
        let braceCount = (trimmed.match(/\{/g) || []).length - (trimmed.match(/\}/g) || []).length;
        i++;
        while (i < lines.length && braceCount > 0) {
          const l = lines[i];
          braceCount += (l.match(/\{/g) || []).length - (l.match(/\}/g) || []).length;
          i++;
        }
      } else {
        i++;
      }
      continue;
    }

    // 1. Fenced Code Block: ```lang ... ```
    if (trimmed.startsWith('```')) {
      const lang = trimmed.replace('```', '').trim() || 'typescript';
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      if (i < lines.length && lines[i].trim().startsWith('```')) {
        i++; // skip closing ```
      }
      const codeContent = codeLines.join('\n');
      // If code content is raw schema JSON, suppress it completely!
      if (!isInternalSchemaOrTechnicalPayload(codeContent)) {
        elements.push(
          <ArticleCodeBlock
            key={`code-${elementIndex++}`}
            code={codeContent}
            language={lang}
          />
        );
      }
      continue;
    }

    // 2. Markdown Image: ![alt](url "optional caption")
    const imgMatch = trimmed.match(/^!\[(.*?)\]\((.*?)(?:\s+"(.*?)")?\)$/);
    if (imgMatch) {
      const altText = imgMatch[1];
      const imageUrl = imgMatch[2];
      const caption = imgMatch[3] || altText;
      elements.push(
        <ArticleInlineImage
          key={`img-${elementIndex++}`}
          imageUrl={imageUrl}
          altText={altText}
          caption={caption !== altText ? caption : undefined}
        />
      );
      i++;
      continue;
    }

    // 3. HTML <img> tag (from WordPress or rich text paste)
    if (trimmed.startsWith('<img') || trimmed.startsWith('<figure')) {
      const srcMatch = trimmed.match(/src=["'](.*?)["']/i);
      const altMatch = trimmed.match(/alt=["'](.*?)["']/i);
      const capMatch = trimmed.match(/<figcaption>(.*?)<\/figcaption>/i);
      if (srcMatch && srcMatch[1]) {
        elements.push(
          <ArticleInlineImage
            key={`img-html-${elementIndex++}`}
            imageUrl={srcMatch[1]}
            altText={altMatch ? altMatch[1] : ''}
            caption={capMatch ? capMatch[1] : undefined}
          />
        );
        i++;
        continue;
      }
    }

    // 4. Markdown Table: Starts with | Col 1 | Col 2 | and next line is |---|---|
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
        tableLines.push(lines[i].trim());
        i++;
      }

      if (tableLines.length >= 2) {
        const headerRow = tableLines[0];
        const isSeparator = tableLines[1].replace(/[\s|:-]/g, '').length === 0;
        
        if (isSeparator) {
          const columns = headerRow
            .slice(1, -1)
            .split('|')
            .map(c => c.trim());
          const rows = tableLines.slice(2).map(r =>
            r
              .slice(1, -1)
              .split('|')
              .map(c => c.trim())
          );

          elements.push(
            <ArticleTable
              key={`table-${elementIndex++}`}
              columns={columns}
              rows={rows}
            />
          );
          continue;
        }
      }
    }

    // 5. Callouts: :::key-takeaway or :::callout or :::info
    if (
      trimmed.startsWith(':::key-takeaway') ||
      trimmed.startsWith(':::callout') ||
      trimmed.startsWith(':::info') ||
      trimmed.startsWith(':::note')
    ) {
      const calloutTitle = trimmed.includes('takeaway') ? 'KEY TAKEAWAY' : 'NOTE';
      const calloutLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith(':::')) {
        calloutLines.push(lines[i]);
        i++;
      }
      if (i < lines.length && lines[i].trim().startsWith(':::')) {
        i++;
      }
      elements.push(
        <ArticleCallout key={`callout-${elementIndex++}`} title={calloutTitle}>
          {calloutLines.map((l, lIdx) => (
            <p key={lIdx} className="my-1">{renderFormattedInlineText(l)}</p>
          ))}
        </ArticleCallout>
      );
      continue;
    }

    // 6. Headings: # H1, ## H2, ### H3, #### H4
    if (trimmed.startsWith('# ') && !trimmed.startsWith('## ')) {
      const text = trimmed.replace('# ', '').trim();
      // If the heading is level 1 and matches the article title, do not repeat it
      if (postTitle && text.toLowerCase() === postTitle.trim().toLowerCase()) {
        i++;
        continue;
      }
      const id = slugifyHeading(text);
      elements.push(
        <h1 key={`h1-${elementIndex++}`} id={id} className="text-3xl sm:text-4xl font-black text-white mt-12 mb-4 tracking-tight scroll-mt-28">
          {renderFormattedInlineText(text)}
        </h1>
      );
      i++;
      continue;
    }

    if (trimmed.startsWith('## ') && !trimmed.startsWith('### ')) {
      const text = trimmed.replace('## ', '').trim();
      const id = slugifyHeading(text);
      elements.push(
        <h2 key={`h2-${elementIndex++}`} id={id} className="text-2xl sm:text-3xl font-extrabold text-white mt-12 mb-4 tracking-tight scroll-mt-28">
          {renderFormattedInlineText(text)}
        </h2>
      );
      i++;
      continue;
    }

    if (trimmed.startsWith('### ') && !trimmed.startsWith('#### ')) {
      const text = trimmed.replace('### ', '').trim();
      const id = slugifyHeading(text);
      elements.push(
        <h3 key={`h3-${elementIndex++}`} id={id} className="text-xl sm:text-2xl font-bold text-sky-200 mt-8 mb-3 scroll-mt-28">
          {renderFormattedInlineText(text)}
        </h3>
      );
      i++;
      continue;
    }

    if (trimmed.startsWith('#### ')) {
      const text = trimmed.replace('#### ', '').trim();
      const id = slugifyHeading(text);
      elements.push(
        <h4 key={`h4-${elementIndex++}`} id={id} className="text-lg font-bold text-white mt-6 mb-2 scroll-mt-28">
          {renderFormattedInlineText(text)}
        </h4>
      );
      i++;
      continue;
    }

    // 7. Blockquotes: > quote text or > **KEY TAKEAWAY**
    if (trimmed.startsWith('> ')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        quoteLines.push(lines[i].trim().replace(/^>\s*/, ''));
        i++;
      }

      // Check if it's a KEY TAKEAWAY block
      const firstLine = quoteLines[0] || '';
      if (firstLine.toLowerCase().includes('key takeaway')) {
        const remainingLines = quoteLines.slice(1);
        elements.push(
          <ArticleCallout key={`takeaway-${elementIndex++}`} title="KEY TAKEAWAY">
            {remainingLines.map((line, qIdx) => (
              <p key={qIdx} className="my-1">{renderFormattedInlineText(line)}</p>
            ))}
          </ArticleCallout>
        );
      } else {
        elements.push(
          <blockquote key={`quote-${elementIndex++}`} className="my-8 pl-6 border-l-2 border-sky-400 italic text-slate-200 text-base sm:text-lg leading-relaxed font-normal">
            <div className="space-y-1">
              {quoteLines.map((line, qIdx) => (
                <p key={qIdx}>{renderFormattedInlineText(line)}</p>
              ))}
            </div>
          </blockquote>
        );
      }
      continue;
    }

    // 8. Horizontal Rule: --- or ***
    if (trimmed === '---' || trimmed === '***') {
      // If next line is a heading, skip the divider to avoid dual lines
      const nextLine = (lines[i + 1] || '').trim();
      if (!nextLine.startsWith('##') && !nextLine.startsWith('#')) {
        elements.push(<hr key={`hr-${elementIndex++}`} className="my-10 border-slate-800/60" />);
      }
      i++;
      continue;
    }

    // 9. Bullet List: - item or * item
    if (trimmed.match(/^(\*|-)\s+/)) {
      const listItems: string[] = [];
      while (i < lines.length && lines[i].trim().match(/^(\*|-)\s+/)) {
        listItems.push(lines[i].trim().replace(/^(\*|-)\s+/, ''));
        i++;
      }
      elements.push(
        <ul key={`ul-${elementIndex++}`} className="my-5 space-y-3 list-none pl-2">
          {listItems.map((item, idx) => (
            <li key={idx} className="flex items-start gap-3 text-slate-300 text-base leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-2.5 shrink-0" />
              <span>{renderFormattedInlineText(item)}</span>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // 10. Numbered List: 1. item
    if (trimmed.match(/^\d+\.\s+/)) {
      const listItems: string[] = [];
      while (i < lines.length && lines[i].trim().match(/^\d+\.\s+/)) {
        listItems.push(lines[i].trim().replace(/^\d+\.\s+/, ''));
        i++;
      }
      elements.push(
        <ol key={`ol-${elementIndex++}`} className="my-5 space-y-3 list-none pl-2">
          {listItems.map((item, idx) => (
            <li key={idx} className="flex items-start gap-3 text-slate-300 text-base leading-relaxed">
              <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center font-mono text-xs font-bold mt-0.5 shrink-0">
                {idx + 1}
              </span>
              <span>{renderFormattedInlineText(item)}</span>
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // 11. Normal Paragraph
    const paragraphLines: string[] = [rawLine];
    i++;
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].trim().startsWith('#') &&
      !lines[i].trim().startsWith('```') &&
      !lines[i].trim().startsWith('![') &&
      !lines[i].trim().startsWith('<img') &&
      !lines[i].trim().startsWith('|') &&
      !lines[i].trim().startsWith('> ') &&
      !lines[i].trim().match(/^(\*|-)\s+/) &&
      !lines[i].trim().match(/^\d+\.\s+/) &&
      !lines[i].trim().startsWith(':::') &&
      lines[i].trim() !== '---' &&
      lines[i].trim() !== '***'
    ) {
      paragraphLines.push(lines[i]);
      i++;
    }

    const paragraphText = paragraphLines.join(' ').trim();
    if (paragraphText) {
      if (!isInternalSchemaOrTechnicalPayload(paragraphText)) {
        elements.push(
          <p key={`p-${elementIndex++}`} className="text-slate-300 text-base sm:text-lg leading-[1.8] my-5 font-normal">
            {renderFormattedInlineText(paragraphText)}
          </p>
        );
      }
    }
  }

  return elements;
}
