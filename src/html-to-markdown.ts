/**
 * HTML to Markdown Converter
 * A lightweight converter optimized for Cloudflare Workers
 */

interface ConversionOptions {
  includeImages?: boolean;
  includeTables?: boolean;
  preserveLinks?: boolean;
  removeScripts?: boolean;
  removeStyles?: boolean;
  baseUrl?: string;
}

const defaultOptions: ConversionOptions = {
  includeImages: true,
  includeTables: true,
  preserveLinks: true,
  removeScripts: true,
  removeStyles: true,
};

// HTML entity decoder with comprehensive list
function decodeEntities(text: string): string {
  const entities: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&apos;': "'",
    '&nbsp;': ' ',
    '&mdash;': '—',
    '&ndash;': '–',
    '&hellip;': '…',
    '&copy;': '©',
    '&reg;': '®',
    '&trade;': '™',
    '&bull;': '•',
    '&rarr;': '→',
    '&larr;': '←',
    '&uarr;': '↑',
    '&darr;': '↓',
    '&lsquo;': '\u2018',
    '&rsquo;': '\u2019',
    '&ldquo;': '\u201C',
    '&rdquo;': '\u201D',
    '&prime;': '\u2032',
    '&Prime;': '\u2033',
    '&deg;': '°',
    '&plusmn;': '±',
    '&times;': '×',
    '&divide;': '÷',
    '&frac12;': '½',
    '&frac14;': '¼',
    '&frac34;': '¾',
  };

  let result = text;
  for (const [entity, char] of Object.entries(entities)) {
    result = result.replace(new RegExp(entity, 'gi'), char);
  }

  // Handle numeric entities
  result = result.replace(/&#(\d+);/g, (_, num) => String.fromCharCode(parseInt(num, 10)));
  result = result.replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)));

  return result;
}

// Fix UTF-8 mojibake (common issue with curly quotes, etc.)
function fixMojibake(text: string): string {
  return text
    // Fix common mojibake patterns (UTF-8 interpreted as Latin-1)
    .replace(/Ã¢â‚¬â„¢/g, "'")   // '
    .replace(/Ã¢â‚¬Ëœ/g, "'")    // '
    .replace(/Ã¢â‚¬Å"/g, '"')    // "
    .replace(/Ã¢â‚¬Â/g, '"')     // "
    .replace(/Ã¢â‚¬â€/g, '-')    // —
    .replace(/Ã¢â‚¬â€œ/g, '-')   // –
    .replace(/Ã¢â‚¬Â¦/g, '...')  // …
    .replace(/Ã¢â‚¬Â¢/g, '*')    // •
    .replace(/Ã¢â€ â€™/g, '->')  // →
    .replace(/â†'/g, '->')        // → (another encoding)
    .replace(/â€™/g, "'")         // '
    .replace(/â€˜/g, "'")         // '
    .replace(/â€œ/g, '"')         // "
    .replace(/â€/g, '"')          // "
    .replace(/â€"/g, '-')         // —
    .replace(/â€"/g, '-')         // –
    .replace(/â€¦/g, '...')       // …
    .replace(/â€¢/g, '*')         // •
    // Simplify curly quotes to straight quotes
    .replace(/[\u2018\u2019\u0091\u0092]/g, "'")
    .replace(/[\u201C\u201D\u0093\u0094]/g, '"')
    // Replace em/en dashes with hyphens
    .replace(/[\u2013\u2014]/g, '-')
    // Replace ellipsis with ...
    .replace(/\u2026/g, '...')
    // Replace bullet with *
    .replace(/\u2022/g, '*')
    // Replace arrows
    .replace(/[\u2192\u2190\u2191\u2193]/g, '->')
    .replace(/→/g, '->')
    .replace(/←/g, '<-')
    .replace(/↑/g, '^')
    .replace(/↓/g, 'v');
}

// Resolve relative URLs to absolute
function resolveUrl(url: string, baseUrl?: string): string {
  if (!baseUrl || !url) return url;
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//')) {
    return url.startsWith('//') ? 'https:' + url : url;
  }
  if (url.startsWith('mailto:') || url.startsWith('tel:') || url.startsWith('javascript:')) {
    return url;
  }
  try {
    return new URL(url, baseUrl).href;
  } catch {
    return url;
  }
}

// Clean and normalize whitespace
function cleanText(text: string): string {
  return text
    .replace(/[\t\r]+/g, ' ')
    .replace(/\n\s*\n/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/^\s+|\s+$/gm, '')
    .trim();
}

// Extract text content, stripping all HTML
function stripHtml(html: string): string {
  let text = html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return decodeEntities(text);
}

// Extract attribute value from a tag
function getAttribute(tag: string, attr: string): string | null {
  const regex = new RegExp(`${attr}\\s*=\\s*["']([^"']*)["']`, 'i');
  const match = tag.match(regex);
  return match ? decodeEntities(match[1]) : null;
}

// Convert HTML table to Markdown
function convertTable(tableHtml: string): string {
  const rows: string[][] = [];

  const rowMatches = tableHtml.match(/<tr[^>]*>[\s\S]*?<\/tr>/gi) || [];
  
  for (const rowHtml of rowMatches) {
    const cells: string[] = [];
    const cellMatches = rowHtml.match(/<t[hd][^>]*>[\s\S]*?<\/t[hd]>/gi) || [];
    for (const cellHtml of cellMatches) {
      const content = stripHtml(cellHtml.replace(/<\/?t[hd][^>]*>/gi, ''));
      cells.push(content);
    }
    if (cells.length > 0) {
      rows.push(cells);
    }
  }

  if (rows.length === 0) return '';

  const maxCols = Math.max(...rows.map(r => r.length));
  const normalizedRows = rows.map(row => {
    while (row.length < maxCols) row.push('');
    return row;
  });

  const lines: string[] = [];
  for (let i = 0; i < normalizedRows.length; i++) {
    const row = normalizedRows[i];
    lines.push('| ' + row.join(' | ') + ' |');
    if (i === 0) {
      lines.push('| ' + row.map(() => '---').join(' | ') + ' |');
    }
  }

  return lines.join('\n');
}

// Main conversion function
export function htmlToMarkdown(html: string, options: ConversionOptions = {}): string {
  const opts = { ...defaultOptions, ...options };
  let md = html;

  // Remove scripts, styles, and non-content elements
  if (opts.removeScripts) {
    md = md.replace(/<script[\s\S]*?<\/script>/gi, '');
    md = md.replace(/<noscript[\s\S]*?<\/noscript>/gi, '');
  }
  if (opts.removeStyles) {
    md = md.replace(/<style[\s\S]*?<\/style>/gi, '');
  }
  
  // Remove structural non-content elements
  md = md.replace(/<head[\s\S]*?<\/head>/gi, '');
  md = md.replace(/<nav[\s\S]*?<\/nav>/gi, '');
  md = md.replace(/<footer[\s\S]*?<\/footer>/gi, '');
  md = md.replace(/<aside[\s\S]*?<\/aside>/gi, '');
  md = md.replace(/<form[\s\S]*?<\/form>/gi, '');
  md = md.replace(/<button[\s\S]*?<\/button>/gi, '');
  md = md.replace(/<input[^>]*>/gi, '');
  md = md.replace(/<select[\s\S]*?<\/select>/gi, '');
  md = md.replace(/<textarea[\s\S]*?<\/textarea>/gi, '');
  md = md.replace(/<!--[\s\S]*?-->/g, '');
  md = md.replace(/<iframe[\s\S]*?<\/iframe>/gi, '');
  md = md.replace(/<svg[\s\S]*?<\/svg>/gi, '');
  md = md.replace(/<canvas[\s\S]*?<\/canvas>/gi, '');
  md = md.replace(/<video[\s\S]*?<\/video>/gi, '');
  md = md.replace(/<audio[\s\S]*?<\/audio>/gi, '');

  // Handle code blocks first (preserve formatting)
  md = md.replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, (_, content) => {
    const code = content.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, '$1');
    const cleanCode = stripHtml(code);
    return `\n\`\`\`\n${cleanCode}\n\`\`\`\n`;
  });

  // Handle inline code
  md = md.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, (_, content) => {
    const code = stripHtml(content);
    return code ? `\`${code}\`` : '';
  });

  // Handle tables
  if (opts.includeTables) {
    md = md.replace(/<table[^>]*>[\s\S]*?<\/table>/gi, (match) => {
      const table = convertTable(match);
      return table ? `\n${table}\n` : '';
    });
  } else {
    md = md.replace(/<table[\s\S]*?<\/table>/gi, '');
  }

  // Headers
  md = md.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, (_, content) => {
    const text = cleanText(stripHtml(content));
    return text ? `\n# ${text}\n` : '';
  });
  md = md.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, (_, content) => {
    const text = cleanText(stripHtml(content));
    return text ? `\n## ${text}\n` : '';
  });
  md = md.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, (_, content) => {
    const text = cleanText(stripHtml(content));
    return text ? `\n### ${text}\n` : '';
  });
  md = md.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, (_, content) => {
    const text = cleanText(stripHtml(content));
    return text ? `\n#### ${text}\n` : '';
  });
  md = md.replace(/<h5[^>]*>([\s\S]*?)<\/h5>/gi, (_, content) => {
    const text = cleanText(stripHtml(content));
    return text ? `\n##### ${text}\n` : '';
  });
  md = md.replace(/<h6[^>]*>([\s\S]*?)<\/h6>/gi, (_, content) => {
    const text = cleanText(stripHtml(content));
    return text ? `\n###### ${text}\n` : '';
  });

  // Paragraphs
  md = md.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (_, content) => {
    const text = cleanText(stripHtml(content));
    return text ? `\n${text}\n` : '';
  });

  // Divs and sections - just extract content
  md = md.replace(/<(div|article|section|main|span)[^>]*>([\s\S]*?)<\/\1>/gi, '$2');

  // Lists
  md = md.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (_, content) => {
    let result = '\n';
    const items = content.match(/<li[^>]*>([\s\S]*?)<\/li>/gi) || [];
    for (const item of items) {
      const text = cleanText(stripHtml(item.replace(/<\/?li[^>]*>/gi, '')));
      if (text) result += `- ${text}\n`;
    }
    return result;
  });

  md = md.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (_, content) => {
    let result = '\n';
    const items = content.match(/<li[^>]*>([\s\S]*?)<\/li>/gi) || [];
    let counter = 1;
    for (const item of items) {
      const text = cleanText(stripHtml(item.replace(/<\/?li[^>]*>/gi, '')));
      if (text) result += `${counter++}. ${text}\n`;
    }
    return result;
  });

  // Remove remaining list items
  md = md.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_, content) => {
    const text = cleanText(stripHtml(content));
    return text ? `- ${text}\n` : '';
  });

  // Bold and italic
  md = md.replace(/<(strong|b)[^>]*>([\s\S]*?)<\/\1>/gi, (_, __, content) => {
    const text = stripHtml(content);
    return text ? `**${text}**` : '';
  });
  md = md.replace(/<(em|i)[^>]*>([\s\S]*?)<\/\1>/gi, (_, __, content) => {
    const text = stripHtml(content);
    return text ? `*${text}*` : '';
  });
  md = md.replace(/<(del|s|strike)[^>]*>([\s\S]*?)<\/\1>/gi, (_, __, content) => {
    const text = stripHtml(content);
    return text ? `~~${text}~~` : '';
  });

  // Links
  if (opts.preserveLinks) {
    md = md.replace(/<a[^>]*href\s*=\s*["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi, (_, href, content) => {
      const text = cleanText(stripHtml(content));
      const url = resolveUrl(href, opts.baseUrl);
      if (!text) return '';
      if (text === url || url.startsWith('javascript:')) return text;
      return `[${text}](${url})`;
    });
  }
  md = md.replace(/<a[^>]*>([\s\S]*?)<\/a>/gi, (_, content) => stripHtml(content));

  // Images - only include if they have meaningful content
  if (opts.includeImages) {
    md = md.replace(/<img[^>]*>/gi, (tag) => {
      const src = getAttribute(tag, 'src');
      const alt = getAttribute(tag, 'alt') || '';
      if (!src) return '';
      // Skip tracking pixels and tiny images
      const width = getAttribute(tag, 'width');
      const height = getAttribute(tag, 'height');
      if ((width && parseInt(width) < 10) || (height && parseInt(height) < 10)) return '';
      const url = resolveUrl(src, opts.baseUrl);
      return `\n![${alt}](${url})\n`;
    });
  } else {
    md = md.replace(/<img[^>]*>/gi, '');
  }

  // Blockquotes
  md = md.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_, content) => {
    const text = cleanText(stripHtml(content));
    return text ? `\n> ${text}\n` : '';
  });

  // Horizontal rules
  md = md.replace(/<hr[^>]*\/?>/gi, '\n---\n');

  // Line breaks
  md = md.replace(/<br[^>]*\/?>/gi, '\n');

  // Clean up remaining HTML tags
  md = md.replace(/<[^>]*>/g, '');

  // Decode entities
  md = decodeEntities(md);

  // Fix mojibake
  md = fixMojibake(md);

  // Clean up whitespace
  // Remove lines that are just whitespace
  md = md.split('\n').map(line => line.trim()).join('\n');
  
  // Remove excessive blank lines (more than 2 in a row)
  md = md.replace(/\n{3,}/g, '\n\n');
  
  // Remove blank lines at start and end
  md = md.trim();

  // Clean up around headers and images
  md = md.replace(/\n{2,}(#{1,6} )/g, '\n\n$1');
  md = md.replace(/(#{1,6} [^\n]+)\n{2,}/g, '$1\n\n');

  // Remove duplicate consecutive images
  md = md.replace(/(!\[[^\]]*\]\([^)]+\)\n?){3,}/g, (match) => {
    const images = match.match(/!\[[^\]]*\]\([^)]+\)/g) || [];
    // Keep max 3 images
    return images.slice(0, 3).join('\n') + '\n';
  });

  return md;
}

// Extract title from HTML
export function extractTitle(html: string): string | null {
  // Try og:title first
  const ogMatch = html.match(/<meta[^>]*property\s*=\s*["']og:title["'][^>]*content\s*=\s*["']([^"']*)["'][^>]*>/i);
  if (ogMatch) {
    return decodeEntities(ogMatch[1]).trim();
  }

  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (titleMatch) {
    return cleanText(stripHtml(titleMatch[1]));
  }
  
  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1Match) {
    return cleanText(stripHtml(h1Match[1]));
  }
  
  return null;
}

// Extract meta description
export function extractDescription(html: string): string | null {
  // Try og:description first
  const ogMatch = html.match(/<meta[^>]*property\s*=\s*["']og:description["'][^>]*content\s*=\s*["']([^"']*)["'][^>]*>/i);
  if (ogMatch) {
    return decodeEntities(ogMatch[1]).trim();
  }

  const metaMatch = html.match(/<meta[^>]*name\s*=\s*["']description["'][^>]*content\s*=\s*["']([^"']*)["'][^>]*>/i)
    || html.match(/<meta[^>]*content\s*=\s*["']([^"']*)["'][^>]*name\s*=\s*["']description["'][^>]*>/i);
  
  if (metaMatch) {
    return decodeEntities(metaMatch[1]).trim();
  }
  
  return null;
}

// Extract Open Graph data
export function extractOpenGraph(html: string): Record<string, string> {
  const og: Record<string, string> = {};
  const regex = /<meta[^>]*property\s*=\s*["']og:([^"']*)["'][^>]*content\s*=\s*["']([^"']*)["'][^>]*>/gi;
  
  let match;
  while ((match = regex.exec(html)) !== null) {
    og[match[1]] = decodeEntities(match[2]).trim();
  }
  
  return og;
}
