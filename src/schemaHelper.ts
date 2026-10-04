export function generateBlogSchemaJson(postOrOptions: any): string {
  const post = postOrOptions?.blogPost || postOrOptions;
  if (!post) return "";
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title || "Metazivo Article",
    "description": post.seoDescription || post.excerpt || "",
    "datePublished": post.publishDate || new Date().toISOString(),
    "author": {
      "@type": "Person",
      "name": (typeof post.author === "object" ? post.author?.name : post.author) || "Ali Hassan"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Metazivo",
      "logo": {
        "@type": "ImageObject",
        "url": "https://metazivo.com/favicon.svg"
      }
    }
  };
  return JSON.stringify(schema, null, 2);
}

export function injectSchemaToHead(canonicalPathOrJson: any, optionsOrScriptId?: any): void {
  if (typeof document === "undefined") return;
  const jsonStr = typeof canonicalPathOrJson === "object"
    ? JSON.stringify(canonicalPathOrJson, null, 2)
    : buildPageSchemaGraph();

  let script = document.getElementById("metazivo-jsonld-schema") as HTMLScriptElement;
  if (!script) {
    script = document.createElement("script");
    script.id = "metazivo-jsonld-schema";
    script.type = "application/ld+json";
    document.head.appendChild(script);
  }
  script.text = jsonStr;
}

export function buildPageSchemaGraph(): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Metazivo",
    "url": "https://metazivo.com/"
  });
}

export function extractFaqsFromHtml(html: string): { question: string; answer: string }[] {
  return [];
}
