/**
 * Dynamically creates or updates meta tags in the document <head>
 * for Google Crawlers, social previews, and browser title bars.
 */
export function setOrUpdateMeta(attribute: 'name' | 'property', nameOrProperty: string, content: string) {
  if (typeof document === 'undefined') return;
  const selector = `meta[${attribute}="${nameOrProperty}"]`;
  let tag = document.querySelector(selector) as HTMLMetaElement | null;
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attribute, nameOrProperty);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content || '');
}

export interface HeadMetaConfig {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonicalUrl?: string;
  googleSiteVerification?: string;
  customSchema?: string;
  allowIndexing?: boolean;
  headerScripts?: string;
  faviconUrl?: string;
}

export function applyHeadMeta({
  title,
  description,
  keywords,
  ogImage,
  canonicalUrl,
  googleSiteVerification,
  customSchema,
  allowIndexing,
  headerScripts,
  faviconUrl
}: HeadMetaConfig) {
  if (typeof document === 'undefined') return;

  if (title) {
    document.title = title;
    setOrUpdateMeta('property', 'og:title', title);
    setOrUpdateMeta('name', 'twitter:title', title);
  }

  if (description) {
    setOrUpdateMeta('name', 'description', description);
    setOrUpdateMeta('property', 'og:description', description);
    setOrUpdateMeta('name', 'twitter:description', description);
  }

  if (keywords) {
    setOrUpdateMeta('name', 'keywords', keywords);
  }

  if (ogImage) {
    setOrUpdateMeta('property', 'og:image', ogImage);
    setOrUpdateMeta('name', 'twitter:image', ogImage);
  }

  if (googleSiteVerification) {
    setOrUpdateMeta('name', 'google-site-verification', googleSiteVerification);
  }

  if (allowIndexing !== undefined) {
    const robotsContent = allowIndexing ? 'index, follow' : 'noindex, nofollow';
    setOrUpdateMeta('name', 'robots', robotsContent);
  }

  if (faviconUrl) {
    let favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement | null;
    if (!favicon) {
      favicon = document.createElement('link');
      favicon.setAttribute('rel', 'icon');
      document.head.appendChild(favicon);
    }
    favicon.setAttribute('href', faviconUrl);
  }

  if (headerScripts !== undefined) {
    let scriptContainer = document.querySelector('div#dynamic-header-scripts-container') as HTMLDivElement | null;
    if (!scriptContainer) {
      scriptContainer = document.createElement('div');
      scriptContainer.id = 'dynamic-header-scripts-container';
      document.head.appendChild(scriptContainer);
    }
    scriptContainer.innerHTML = '';
    if (headerScripts.trim()) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = headerScripts;
      Array.from(tempDiv.children).forEach(child => {
        if (child.tagName === 'SCRIPT') {
          const newScript = document.createElement('script');
          Array.from(child.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
          newScript.textContent = child.textContent;
          scriptContainer?.appendChild(newScript);
        } else {
          scriptContainer?.appendChild(child.cloneNode(true));
        }
      });
    }
  }

  if (canonicalUrl) {
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);
  }

  if (customSchema) {
    let scriptTag = document.querySelector('script#dynamic-json-ld') as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'dynamic-json-ld';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = customSchema;
  }
}
