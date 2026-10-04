export interface SeoCheckItem {
  id: string;
  label: string;
  passed: boolean;
  category: 'basic' | 'title' | 'content';
  message: string;
  tip?: string;
  points: number;
  earned: number;
}

export interface SeoAnalysisResult {
  score: number; // 0 - 100
  rating: 'poor' | 'fair' | 'good';
  colorClass: string;
  bgColorClass: string;
  borderColorClass: string;
  hexColor: string;
  passedCount: number;
  totalCount: number;
  checks: SeoCheckItem[];
  wordCount: number;
  keywordCount: number;
  keywordDensity: number; // percentage, e.g. 1.8
  powerWordFound?: string;
  hasNumber: boolean;
  maxParagraphWords: number;
  hasLinks: boolean;
}

export const POWER_WORDS = [
  'best', 'top', 'ultimate', 'guide', 'proven', 'powerful', 'exclusive', 'secret',
  'fast', 'quick', 'easy', 'simple', 'complete', 'essential', 'free', 'boost',
  'high-impact', 'revolutionary', 'mastery', 'step-by-step', 'growth', 'premier',
  'strategies', 'tactics', 'advanced', 'checklist', 'secrets', 'expert', 'smart',
  'amazing', 'incredible', 'great', 'awesome', 'effortless', 'insane', 'profitable',
  'worst', 'mistakes', 'avoid', 'crucial', 'shocking', 'unbelievable', 'guaranteed'
];

export interface AnalyzeSeoParams {
  focusKeyword?: string;
  seoTitle?: string;
  metaDescription?: string;
  slug?: string;
  content?: string;
  ogImage?: string;
}

/**
 * Strips markdown and HTML formatting to get pure raw text and word tokens.
 */
export function cleanContentText(content: string = ''): string {
  return content
    .replace(/!\[.*?\]\(.*?\)/g, ' ') // markdown images
    .replace(/\[.*?\]\(.*?\)/g, ' ') // markdown links
    .replace(/<[^>]*>/g, ' ') // HTML tags
    .replace(/#{1,6}\s+/g, ' ') // headings
    .replace(/[`*~_]/g, ' ') // formatting markers
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Counts words accurately.
 */
export function countWords(text: string = ''): number {
  const cleaned = cleanContentText(text);
  if (!cleaned) return 0;
  const words = cleaned.split(/\s+/).filter(Boolean);
  return words.length;
}

/**
 * Evaluates full RankMath-style on-page SEO metrics and returns 0-100 score + detailed checklist.
 */
export function analyzeSeo({
  focusKeyword = '',
  seoTitle = '',
  metaDescription = '',
  slug = '',
  content = '',
  ogImage = ''
}: AnalyzeSeoParams): SeoAnalysisResult {
  const rawKeyword = (focusKeyword || '').trim().toLowerCase();
  const title = (seoTitle || '').trim();
  const desc = (metaDescription || '').trim();
  const cleanSlug = (slug || '').toLowerCase().replace(/^\/+/, '');
  const rawContent = (content || '').trim();
  const cleanedContent = cleanContentText(rawContent);

  const wordList = cleanedContent.toLowerCase().split(/\s+/).filter(Boolean);
  const totalWords = wordList.length;

  // 1. Keyword occurence calculations
  let keywordInTitle = false;
  let keywordInDesc = false;
  let keywordInSlug = false;
  let keywordInFirst10Percent = false;
  let keywordCount = 0;
  let keywordDensity = 0;

  if (rawKeyword) {
    const keywordRegex = new RegExp(`\\b${rawKeyword.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i');
    
    // In SEO Title
    keywordInTitle = keywordRegex.test(title);

    // In Meta Description
    keywordInDesc = keywordRegex.test(desc);

    // In URL / Slug (slug may contain hyphens instead of spaces)
    const slugKeywordParts = rawKeyword.split(/\s+/).filter(Boolean).map(p => p.toLowerCase());
    const slugNormalized = cleanSlug.replace(/[^a-z0-9]/g, '-');
    keywordInSlug = slugKeywordParts.length > 0 && slugKeywordParts.every(part => slugNormalized.includes(part));

    // In first 10% of content
    const first10PercentWordCount = Math.max(1, Math.ceil(totalWords * 0.1));
    const first10PercentText = wordList.slice(0, first10PercentWordCount).join(' ');
    keywordInFirst10Percent = keywordRegex.test(first10PercentText);

    // Keyword density
    const escapedKeyword = rawKeyword.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const matches = cleanedContent.match(new RegExp(`\\b${escapedKeyword}\\b`, 'gi'));
    keywordCount = matches ? matches.length : 0;
    
    const keywordWordLen = rawKeyword.split(/\s+/).length || 1;
    if (totalWords > 0) {
      keywordDensity = Number(((keywordCount * keywordWordLen / totalWords) * 100).toFixed(2));
    }
  }

  // 2. Title & Readability
  const titleLen = title.length;
  const isTitleLengthOptimal = titleLen >= 50 && titleLen <= 60;
  const descLen = desc.length;
  const isDescLengthOptimal = descLen >= 120 && descLen <= 160;

  // Power / Sentiment words
  const titleLower = title.toLowerCase();
  const powerWordFound = POWER_WORDS.find(pw => {
    const regex = new RegExp(`\\b${pw}\\b`, 'i');
    return regex.test(titleLower);
  });
  const hasPowerWord = !!powerWordFound;

  // Number in title
  const hasNumber = /\d+/.test(title);

  // 3. Content Analysis
  const isContentLengthOk = totalWords >= 600;
  const isDensityOptimal = keywordDensity >= 1.0 && keywordDensity <= 2.5;

  // Subheading keyword check
  let keywordInSubheading = false;
  if (rawKeyword) {
    const subheadings = rawContent.match(/(?:#{2,6}\s+.*|<h[2-6][^>]*>.*?<\/h[2-6]>)/gi) || [];
    const keywordRegex = new RegExp(`\\b${rawKeyword.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i');
    keywordInSubheading = subheadings.some(sh => keywordRegex.test(sh));
  }

  // TOC check
  const hasToc = /(table of contents|\[toc\]|<nav[^>]*toc|<ul[^>]*>(\s*<li><a href="#[^"]+">.*?<\/a><\/li>){2,})/i.test(rawContent);

  // Links detection: markdown [text](url), HTML <a href=...>, or raw URLs
  const hasLinks = /(?:\[.*?\]\(https?:\/\/|\/|#[^)]+\)|<a\s+[^>]*href=["'](?:https?:\/\/|\/|#)|https?:\/\/[^\s]+)/i.test(rawContent);

  // Paragraph length analysis: split content by newlines and check paragraph word counts
  const paragraphs = rawContent
    .split(/\n\s*\n/)
    .map(p => cleanContentText(p))
    .filter(p => p.length > 0);

  let maxParagraphWords = 0;
  paragraphs.forEach(p => {
    const pWords = p.split(/\s+/).filter(Boolean).length;
    if (pWords > maxParagraphWords) {
      maxParagraphWords = pWords;
    }
  });

  const areParagraphsShort = paragraphs.length === 0 || maxParagraphWords <= 120;

  // Checklist Items construction with strictly weighted points (total: 100)
  const checks: SeoCheckItem[] = [
    // --- BASIC SEO (Total 46 pts) ---
    {
      id: 'focus-keyword-set',
      label: 'Focus Keyword is set',
      category: 'basic',
      passed: Boolean(rawKeyword),
      points: 10,
      earned: rawKeyword ? 10 : 0,
      message: rawKeyword 
        ? `Focus keyword is configured: "${rawKeyword}"` 
        : 'No focus keyword set. Enter your target ranking phrase.',
      tip: 'Choose a primary search term with commercial intent.'
    },
    {
      id: 'keyword-in-title',
      label: 'Focus Keyword appears in SEO Title',
      category: 'basic',
      passed: keywordInTitle,
      points: 10,
      earned: keywordInTitle ? 10 : 0,
      message: keywordInTitle
        ? 'Great! The focus keyword appears in the SEO title.'
        : 'Focus keyword is missing from the SEO Title.',
      tip: 'Place the focus keyword as close to the beginning of the title as possible.'
    },
    {
      id: 'keyword-in-description',
      label: 'Focus Keyword appears in Meta Description',
      category: 'basic',
      passed: keywordInDesc,
      points: 10,
      earned: keywordInDesc ? 10 : 0,
      message: keywordInDesc
        ? 'Great! The focus keyword appears in the Meta Description.'
        : 'Focus keyword is missing from the Meta Description.',
      tip: 'Include your focus keyword naturally in the snippet summary.'
    },
    {
      id: 'keyword-in-slug',
      label: 'Focus Keyword is in the URL / Slug',
      category: 'basic',
      passed: keywordInSlug,
      points: 8,
      earned: keywordInSlug ? 8 : 0,
      message: keywordInSlug
        ? `Slug contains the keyword: /${cleanSlug}`
        : 'The URL / Slug does not contain the focus keyword.',
      tip: 'Keep the URL slug clean, lowercase, and keyword-rich.'
    },
    {
      id: 'keyword-in-first-10-percent',
      label: 'Focus Keyword in first 10% of content',
      category: 'basic',
      passed: keywordInFirst10Percent,
      points: 8,
      earned: keywordInFirst10Percent ? 8 : 0,
      message: keywordInFirst10Percent
        ? 'Focus keyword is found right in the opening section.'
        : 'Focus keyword does not appear in the opening 10% of the content.',
      tip: 'Hook readers and search crawlers by mentioning your keyword in the introductory paragraph.'
    },

    // --- TITLE & READABILITY (Total 28 pts) ---
    {
      id: 'title-length-optimal',
      label: 'SEO Title length is optimal (50–60 characters)',
      category: 'title',
      passed: isTitleLengthOptimal,
      points: 8,
      earned: isTitleLengthOptimal ? 8 : 0,
      message: isTitleLengthOptimal
        ? `Optimal title length (${titleLen} / 60 characters).`
        : titleLen < 50
        ? `SEO Title is too short (${titleLen} chars). Expand to 50–60 chars.`
        : `SEO Title is too long (${titleLen} chars). Truncate to under 60 chars.`,
      tip: 'Google displays between 50 to 60 characters before truncating with an ellipsis.'
    },
    {
      id: 'description-length-optimal',
      label: 'Meta Description length is optimal (120–160 characters)',
      category: 'title',
      passed: isDescLengthOptimal,
      points: 8,
      earned: isDescLengthOptimal ? 8 : 0,
      message: isDescLengthOptimal
        ? `Optimal description length (${descLen} / 160 characters).`
        : descLen < 120
        ? `Meta description is short (${descLen} chars). Add more details (aim for 120–160 chars).`
        : `Meta description is over 160 chars (${descLen} chars). Shorten to prevent truncation.`,
      tip: 'Aim for 120–160 characters to maximize SERP click-through rate without ellipsis cutoffs.'
    },
    {
      id: 'title-sentiment-power-word',
      label: 'SEO Title contains a power or sentiment word',
      category: 'title',
      passed: hasPowerWord,
      points: 6,
      earned: hasPowerWord ? 6 : 0,
      message: hasPowerWord
        ? `Power word identified: "${powerWordFound}".`
        : 'Title lacks a psychological power or sentiment word.',
      tip: 'Use power words like "Proven", "Ultimate", "Guide", "Premier", "Best", or "Fast".'
    },
    {
      id: 'title-contains-number',
      label: 'SEO Title contains a number (CTR Booster)',
      category: 'title',
      passed: hasNumber,
      points: 6,
      earned: hasNumber ? 6 : 0,
      message: hasNumber
        ? 'Title contains a number (e.g., year, step, or quantity).'
        : 'No numbers found in title. Adding a number boosts click rates by up to 36%.',
      tip: 'Include numbers like current year (e.g. 2026), quantity (e.g. 7 Steps), or metrics.'
    },

    // --- CONTENT ANALYSIS (Total 26 pts) ---
    {
      id: 'content-min-words',
      label: 'Content is at least 600 words long',
      category: 'content',
      passed: isContentLengthOk,
      points: 8,
      earned: isContentLengthOk ? 8 : 0,
      message: isContentLengthOk
        ? `Strong in-depth content length (${totalWords} words).`
        : `Content is currently ${totalWords} words. Add more value to reach at least 600 words.`,
      tip: 'Long-form content ranks higher and covers search intent more comprehensively.'
    },
    {
      id: 'keyword-density-optimal',
      label: 'Focus keyword density is optimal (1.0% – 2.5%)',
      category: 'content',
      passed: isDensityOptimal,
      points: 8,
      earned: isDensityOptimal ? 8 : 0,
      message: isDensityOptimal
        ? `Optimal keyword density of ${keywordDensity}% (${keywordCount} occurrences).`
        : keywordDensity === 0
        ? 'Keyword density is 0%. Add your focus keyword naturally into the text.'
        : keywordDensity < 1.0
        ? `Low density (${keywordDensity}%). Mention the keyword a few more times.`
        : `High density (${keywordDensity}%). Reduce repetition to avoid keyword stuffing penalties.`,
      tip: 'Maintain between 1% and 2.5% density for natural, penalty-free search indexing.'
    },
    {
      id: 'content-has-links',
      label: 'Content contains internal or external links',
      category: 'content',
      passed: hasLinks,
      points: 5,
      earned: hasLinks ? 5 : 0,
      message: hasLinks
        ? 'Links detected! Good internal and contextual link structure.'
        : 'No links detected in the content. Add internal links or reputable sources.',
      tip: 'Links help search engine bots discover topical context and related pages.'
    },
    {
      id: 'short-readable-paragraphs',
      label: 'Short, readable paragraphs (<= 120 words each)',
      category: 'content',
      passed: areParagraphsShort,
      points: 4,
      earned: areParagraphsShort ? 4 : 0,
      message: areParagraphsShort
        ? `Paragraphs are bite-sized (max ${maxParagraphWords} words). Easy on mobile eyes!`
        : `One or more paragraphs exceed 120 words (longest has ${maxParagraphWords} words). Break into shorter blocks.`,
      tip: 'Keep paragraphs under 120 words to improve mobile readability and dwell time.'
    },
    {
      id: 'keyword-in-subheading',
      label: 'Focus Keyword appears in a Subheading (H2/H3)',
      category: 'content',
      passed: keywordInSubheading,
      points: 4,
      earned: keywordInSubheading ? 4 : 0,
      message: keywordInSubheading
        ? 'Focus keyword is present in at least one subheading.'
        : 'Focus keyword is missing from all H2/H3 subheadings.',
      tip: 'Include your focus keyword in subheadings to signal clear topical hierarchy to search engines.'
    },
    {
      id: 'has-table-of-contents',
      label: 'Table of Contents detected in content',
      category: 'content',
      passed: hasToc,
      points: 4,
      earned: hasToc ? 4 : 0,
      message: hasToc
        ? 'Table of Contents detected for better UX and jump links.'
        : 'No Table of Contents detected. Adding a TOC improves user experience and SERP sitelinks.',
      tip: 'Include a Table of Contents list with anchor links for long-form articles.'
    }
  ];

  // Calculate score sum
  const earnedScore = checks.reduce((sum, item) => sum + item.earned, 0);
  const finalScore = Math.min(100, Math.max(0, earnedScore));

  const passedCount = checks.filter(c => c.passed).length;
  const totalCount = checks.length;

  let rating: 'poor' | 'fair' | 'good' = 'poor';
  let colorClass = 'text-rose-500';
  let bgColorClass = 'bg-rose-500';
  let borderColorClass = 'border-rose-500';
  let hexColor = '#ef4444';

  if (finalScore >= 81) {
    rating = 'good';
    colorClass = 'text-emerald-500';
    bgColorClass = 'bg-emerald-500';
    borderColorClass = 'border-emerald-500';
    hexColor = '#10b981';
  } else if (finalScore >= 51) {
    rating = 'fair';
    colorClass = 'text-amber-500';
    bgColorClass = 'bg-amber-500';
    borderColorClass = 'border-amber-500';
    hexColor = '#f59e0b';
  }

  return {
    score: finalScore,
    rating,
    colorClass,
    bgColorClass,
    borderColorClass,
    hexColor,
    passedCount,
    totalCount,
    checks,
    wordCount: totalWords,
    keywordCount,
    keywordDensity,
    powerWordFound,
    hasNumber,
    maxParagraphWords,
    hasLinks
  };
}
