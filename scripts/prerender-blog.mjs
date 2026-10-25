import fs from 'fs';
import path from 'path';

const distDir = path.join(process.cwd(), 'dist');
const dbFile = path.join(process.cwd(), 'data', 'db.json');
const indexHtmlFile = path.join(distDir, 'index.html');

if (!fs.existsSync(distDir) || !fs.existsSync(indexHtmlFile)) {
  console.log('Dist or index.html not found, skipping blog pre-rendering.');
  process.exit(0);
}

function toAbsoluteImageUrl(imgUrl) {
  if (!imgUrl || typeof imgUrl !== 'string') {
    return 'https://netronomic.com/og-image.jpg';
  }
  const trimmed = imgUrl.trim();
  if (trimmed.startsWith('data:') || !trimmed) {
    return 'https://netronomic.com/og-image.jpg';
  }
  if (trimmed.startsWith('http://')) {
    return trimmed.replace(/^http:\/\//i, 'https://');
  }
  if (trimmed.startsWith('https://')) {
    return trimmed;
  }
  if (trimmed.startsWith('/')) {
    return `https://netronomic.com${trimmed}`;
  }
  return `https://netronomic.com/${trimmed}`;
}

const escapeAttr = (str) => String(str || '').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escapeText = (str) => String(str || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');

try {
  const indexHtml = fs.readFileSync(indexHtmlFile, 'utf-8');
  let posts = [];
  if (fs.existsSync(dbFile)) {
    const dbData = JSON.parse(fs.readFileSync(dbFile, 'utf-8'));
    posts = dbData.posts || [];
  }

  console.log(`Pre-rendering Open Graph tags for ${posts.length} blog posts in dist/blog/...`);

  for (const post of posts) {
    if (!post.slug) continue;

    const title = post.seoTitle || post.ogTitle || `${post.title} | Netronomic`;
    const description = post.seoDescription || post.metaDescription || post.excerpt || 'Discover actionable strategies on web design, development and SEO.';
    const ogImage = toAbsoluteImageUrl(post.ogImage || post.featuredImage);
    const articleUrl = `https://netronomic.com/blog/${encodeURIComponent(post.slug)}`;
    const imageExt = ogImage.toLowerCase().endsWith('.png') ? 'image/png' : ogImage.toLowerCase().endsWith('.webp') ? 'image/webp' : 'image/jpeg';

    const renderedHtml = indexHtml
      .replace(/<title>.*?<\/title>/i, `<title>${escapeText(title)}</title>`)
      .replace(/<meta name="description" content=".*?" \/>/i, `<meta name="description" content="${escapeAttr(description)}" />`)
      .replace(/<meta property="og:title" content=".*?" \/>/i, `<meta property="og:title" content="${escapeAttr(title)}" />`)
      .replace(/<meta property="og:description" content=".*?" \/>/i, `<meta property="og:description" content="${escapeAttr(description)}" />`)
      .replace(/<meta property="og:image" content=".*?" \/>/i, `<meta property="og:image" content="${escapeAttr(ogImage)}" />`)
      .replace(/<meta property="og:image:secure_url" content=".*?" \/>/i, `<meta property="og:image:secure_url" content="${escapeAttr(ogImage)}" />`)
      .replace(/<meta property="og:image:type" content=".*?" \/>/i, `<meta property="og:image:type" content="${imageExt}" />`)
      .replace(/<meta property="og:url" content=".*?" \/>/i, `<meta property="og:url" content="${escapeAttr(articleUrl)}" />`)
      .replace(/<meta property="og:type" content=".*?" \/>/i, `<meta property="og:type" content="article" />`)
      .replace(/<meta name="twitter:title" content=".*?" \/>/i, `<meta name="twitter:title" content="${escapeAttr(title)}" />`)
      .replace(/<meta name="twitter:description" content=".*?" \/>/i, `<meta name="twitter:description" content="${escapeAttr(description)}" />`)
      .replace(/<meta name="twitter:image" content=".*?" \/>/i, `<meta name="twitter:image" content="${escapeAttr(ogImage)}" />`);

    const postDir = path.join(distDir, 'blog', post.slug);
    if (!fs.existsSync(postDir)) {
      fs.mkdirSync(postDir, { recursive: true });
    }
    fs.writeFileSync(path.join(postDir, 'index.html'), renderedHtml, 'utf-8');

    // Also support decoded folder if slug has spaces/special characters
    const decoded = decodeURIComponent(post.slug);
    if (decoded !== post.slug) {
      const decodedDir = path.join(distDir, 'blog', decoded);
      if (!fs.existsSync(decodedDir)) {
        fs.mkdirSync(decodedDir, { recursive: true });
      }
      fs.writeFileSync(path.join(decodedDir, 'index.html'), renderedHtml, 'utf-8');
    }
  }

  console.log('Blog Open Graph pre-rendering completed successfully!');
} catch (err) {
  console.error('Error pre-rendering blog Open Graph HTML:', err);
}
