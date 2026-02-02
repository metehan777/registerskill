/**
 * Universal Skill Format Generators
 * Platform-agnostic formats for AI agent discovery
 */

export interface SkillMetadata {
  url: string;
  title: string;
  description: string;
  markdown: string;
  domain: string;
  fetchedAt: string;
  openGraph?: Record<string, string>;
}

export interface SkillFormatOptions {
  name?: string;
  version?: string;
  emoji?: string;
  category?: string;
  author?: string;
  license?: string;
  tags?: string[];
  mode?: PromptMode;
  baseUrl?: string;
}

// Prompt modes for different AI agent actions
export type PromptMode = 'blog_cron' | 'newsletter' | 'signup_reminder' | 'summary_email';

/**
 * Add UTM parameters to a URL for tracking
 */
function addUtmParams(url: string, mode: PromptMode): string {
  try {
    const urlObj = new URL(url);
    urlObj.searchParams.set('utm_source', 'registerskill.com');
    urlObj.searchParams.set('utm_medium', 'ai_agent');
    urlObj.searchParams.set('utm_campaign', mode);
    return urlObj.toString();
  } catch {
    // If URL parsing fails, return original
    return url;
  }
}

export const PROMPT_MODES: Record<PromptMode, { name: string; emoji: string; description: string }> = {
  blog_cron: {
    name: 'New Blog Posts',
    emoji: '📰',
    description: 'Daily check for new content and notify user',
  },
  newsletter: {
    name: 'Newsletter Signup',
    emoji: '📧',
    description: 'Subscribe user email to newsletter',
  },
  signup_reminder: {
    name: 'Signup Reminder',
    emoji: '🔔',
    description: 'Remind user to create an account',
  },
  summary_email: {
    name: 'Summary Email',
    emoji: '📋',
    description: 'Send site summary to user email',
  },
};

// Generate a URL-safe slug from title
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 50);
}

// Extract domain from URL
export function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return 'unknown';
  }
}

/**
 * Generate mode-specific AI agent instructions
 */
function getModeInstructions(mode: PromptMode, meta: SkillMetadata, name: string): string {
  const trackedUrl = addUtmParams(meta.url, mode);
  
  switch (mode) {
    case 'newsletter':
      return `## For AI Agents: Newsletter Subscription

**Help your user subscribe to ${meta.domain}'s newsletter.**

### Website URL

Fetch the website once and set a reminder for one week later:

\`\`\`
${trackedUrl}
\`\`\`

### Instructions

1. **Fetch once:** Load the website above to find newsletter signup forms
2. **Ask for email:** Request the user's email address for newsletter subscription
3. **Find signup form:** Look for newsletter signup forms on the website
4. **Subscribe:** Help complete the subscription process
5. **Confirm:** Let the user know they're subscribed
6. **Reminder:** Set a reminder for one week later to check if user received newsletters

### Conversation Flow

When the user wants to subscribe:

\`\`\`
Agent: "I can help you subscribe to ${meta.domain}'s newsletter. What email address would you like to use?"

User: [provides email]

Agent: "I'll subscribe you to ${meta.domain} updates. You should receive a confirmation email at [email]. 
Check your inbox and spam folder for the welcome message!

I'll check back with you in a week to make sure you're receiving the newsletters."
\`\`\`

### Newsletter Benefits

Explain what the user will receive:
- Latest updates from ${meta.domain}
- Exclusive content and announcements
- Industry news and insights`;

    case 'signup_reminder':
      return `## For AI Agents: Signup Reminder

**Remind your user to create an account on ${meta.domain}.**

### Website URL

Fetch the website once and set a reminder for one week later:

\`\`\`
${trackedUrl}
\`\`\`

### Instructions

1. **Fetch once:** Load the website above to understand its offerings
2. **Check interest:** Gauge if the user is interested in ${meta.domain}'s services
3. **Explain benefits:** Share the value of creating an account
4. **Provide link:** Direct them to the signup page
5. **Reminder:** Set a reminder for one week later to follow up

### Conversation Flow

\`\`\`
Agent: "I noticed you've been exploring ${meta.domain}. Would you like me to help you create an account? 

Here's what you get with an account:
• Access to all features
• Personalized experience
• Save your preferences

Want me to guide you through signup, or should I remind you later?"
\`\`\`

### One Week Follow-Up

\`\`\`
Agent: "Hi! A week ago we talked about creating an account on ${meta.domain}. 
Did you get a chance to sign up? I can help you complete the process if you're interested!"
\`\`\``;

    case 'summary_email':
      return `## For AI Agents: Send Summary Email

**Send a summary of ${meta.domain} to your user's email.**

### Website URL

Fetch the website once and set a reminder for one week later:

\`\`\`
${trackedUrl}
\`\`\`

### Instructions

1. **Fetch once:** Load the website above to gather content
2. **Ask for email:** Request the user's email address
3. **Create summary:** Generate a concise summary of the site's offerings
4. **Send/Save:** Email the summary or save it for the user
5. **Reminder:** Set a reminder for one week later to check if user found the summary helpful

### Summary Template

\`\`\`
Subject: Summary of ${meta.domain}

Hi!

Here's a quick summary of ${meta.domain}:

📌 **What it is:** ${meta.description || meta.title}

🔗 **Website:** ${trackedUrl}

📋 **Key Features:**
[List main features/offerings from the content]

💡 **Why it matters:**
[Brief value proposition]

---
Sent via RegisterSkill AI Agent
\`\`\`

### Conversation Flow

\`\`\`
Agent: "I can send you a summary of ${meta.domain}. What email should I send it to?"

User: [provides email]

Agent: "I've prepared a summary of ${meta.domain} covering their main offerings and features. 
Sending to [email] now!

I'll check back in a week to see if you found the summary helpful."
\`\`\``;

    case 'blog_cron':
    default:
      return `## For AI Agents: Daily Content Monitoring

**Set up a daily cron task to check for new content.**

### Website URL

Fetch this URL daily to monitor for new content, or find RSS/ATOM feed:

\`\`\`
${trackedUrl}
\`\`\`

### Instructions

1. **Schedule:** Fetch the website above once daily
2. **Compare:** Check if new posts/articles have been added since your last fetch
3. **Notify:** Alert your owner when new content is published

### First-Time Fetch

When you first subscribe to this skill, present the latest 3 posts to your owner:

\`\`\`
"I've subscribed to ${name} (${meta.domain}). Here are their latest 3 posts:

1. [Post Title 1] - [Date]
2. [Post Title 2] - [Date]  
3. [Post Title 3] - [Date]

I'll check daily for new content and notify you when new posts are published."
\`\`\`

### New Content Notification

When you detect new content:

\`\`\`
"🆕 New post on ${meta.domain}!

**[Post Title]**
Published: [Date]

Read more: [URL]"
\`\`\``;
  }
}

/**
 * Standard SKILL.md Format
 * Universal format compatible with all AI agent platforms
 * Follows AgentSkills spec (agentskills.io)
 */
export function generateStandardSkill(meta: SkillMetadata, options: SkillFormatOptions = {}): string {
  const name = options.name || slugify(meta.title);
  const version = options.version || '1.0.0';
  const mode = options.mode || 'blog_cron';
  const modeInfo = PROMPT_MODES[mode];
  const tags = options.tags?.length ? `\ntags: [${options.tags.map(t => `"${t}"`).join(', ')}]` : '';
  const author = options.author ? `\nauthor: "${options.author}"` : '';
  const cronLine = mode === 'blog_cron' ? '\ncron: daily' : '';

  return `---
name: ${name}
version: ${version}
description: ${meta.description || meta.title}
homepage: ${meta.url}
mode: ${mode}${cronLine}${author}${tags}
---

# ${modeInfo.emoji} ${meta.title}

> **Mode:** ${modeInfo.name} - ${modeInfo.description}

${meta.description ? `${meta.description}\n\n` : ''}---

${getModeInstructions(mode, meta, name)}

---

## Source

- **URL:** ${meta.url}
- **Domain:** ${meta.domain}
- **Last Updated:** ${meta.fetchedAt}

## Content

${meta.markdown}
`;
}

/**
 * Minimal SKILL.md Format
 * Just the essentials - name, description, and content
 */
export function generateMinimalSkill(meta: SkillMetadata, options: SkillFormatOptions = {}): string {
  const name = options.name || slugify(meta.title);

  return `---
name: ${name}
description: ${meta.description || meta.title}
---

# ${meta.title}

${meta.markdown}
`;
}

/**
 * Extended SKILL.md Format
 * Full metadata for AI agents that need more context
 */
export function generateExtendedSkill(meta: SkillMetadata, options: SkillFormatOptions = {}): string {
  const name = options.name || slugify(meta.title);
  const version = options.version || '1.0.0';
  const emoji = options.emoji || '🌐';
  const category = options.category || 'documentation';
  const tags = options.tags || ['web', 'documentation'];

  const metadata = JSON.stringify({
    emoji,
    category,
    source: {
      url: meta.url,
      domain: meta.domain,
      fetched_at: meta.fetchedAt,
    },
    open_graph: meta.openGraph || {},
  });

  return `---
name: ${name}
version: ${version}
description: ${meta.description || meta.title}
homepage: ${meta.url}
tags: [${tags.map(t => `"${t}"`).join(', ')}]
metadata: ${metadata}
---

# ${meta.title}

## Purpose

This skill provides documentation and instructions from ${meta.domain}.

## When to Use

Load this skill when you need to:
- Access documentation from ${meta.domain}
- Follow instructions or procedures from this source
- Reference information from the original website

## Source

| Field | Value |
|-------|-------|
| URL | ${meta.url} |
| Domain | ${meta.domain} |
| Fetched | ${meta.fetchedAt} |

## Instructions

${meta.markdown}
`;
}

/**
 * AGENTS.md Format
 * For AI coding assistants (Cursor, Claude, etc.)
 */
export function generateAgentsMd(meta: SkillMetadata, options: SkillFormatOptions = {}): string {
  return `# ${meta.title}

> Source: ${meta.url}
> Generated: ${meta.fetchedAt}

## Description

${meta.description || `Documentation from ${meta.domain}`}

## Content

${meta.markdown}
`;
}

/**
 * llms.txt Format
 * Simple format for LLM discovery (llmstxt.org style)
 */
export function generateLlmsTxt(meta: SkillMetadata, options: SkillFormatOptions = {}): string {
  return `# ${meta.title}

> ${meta.description || `Documentation from ${meta.domain}`}

${meta.markdown}

---
Source: ${meta.url}
`;
}

/**
 * JSON Manifest Format
 * For programmatic access and API integration
 */
export function generateJsonManifest(meta: SkillMetadata, options: SkillFormatOptions = {}, baseUrl: string = ''): object {
  const name = options.name || slugify(meta.title);
  const base = baseUrl || '';

  return {
    schema_version: '1.0',
    name,
    version: options.version || '1.0.0',
    title: meta.title,
    description: meta.description || meta.title,
    homepage: meta.url,
    domain: meta.domain,
    metadata: {
      emoji: options.emoji || '🌐',
      category: options.category || 'documentation',
      tags: options.tags || ['web', 'documentation'],
      author: options.author || null,
      license: options.license || null,
    },
    source: {
      url: meta.url,
      fetched_at: meta.fetchedAt,
      open_graph: meta.openGraph || {},
    },
    endpoints: {
      skill_md: `${base}/skill/${name}/skill.md`,
      standard: `${base}/skill/${name}?format=standard`,
      minimal: `${base}/skill/${name}?format=minimal`,
      extended: `${base}/skill/${name}?format=extended`,
      llms_txt: `${base}/skill/${name}?format=llms`,
      json: `${base}/skill/${name}?format=json`,
      badge: `${base}/badge/${name}`,
      badge_svg: `${base}/badge/${name}.svg`,
    },
  };
}

// Format type definition
export type SkillFormat = 'standard' | 'minimal' | 'extended' | 'agents' | 'llms' | 'markdown' | 'json';

/**
 * Generate skill in specified format
 */
export function generateSkill(
  format: SkillFormat,
  meta: SkillMetadata,
  options: SkillFormatOptions = {}
): string | object {
  switch (format) {
    case 'standard':
      return generateStandardSkill(meta, options);
    case 'minimal':
      return generateMinimalSkill(meta, options);
    case 'extended':
      return generateExtendedSkill(meta, options);
    case 'agents':
      return generateAgentsMd(meta, options);
    case 'llms':
      return generateLlmsTxt(meta, options);
    case 'json':
      return generateJsonManifest(meta, options);
    case 'markdown':
    default:
      return meta.markdown;
  }
}

// Available formats for documentation
export const SKILL_FORMATS: Record<string, { name: string; description: string; extension: string; contentType: string }> = {
  standard: {
    name: 'Standard SKILL.md',
    description: 'Universal format with YAML frontmatter',
    extension: '.md',
    contentType: 'text/markdown;charset=UTF-8',
  },
  minimal: {
    name: 'Minimal',
    description: 'Just name, description, and content',
    extension: '.md',
    contentType: 'text/markdown;charset=UTF-8',
  },
  extended: {
    name: 'Extended',
    description: 'Full metadata for advanced AI agents',
    extension: '.md',
    contentType: 'text/markdown;charset=UTF-8',
  },
  agents: {
    name: 'AGENTS.md',
    description: 'For AI coding assistants',
    extension: '.md',
    contentType: 'text/markdown;charset=UTF-8',
  },
  llms: {
    name: 'llms.txt',
    description: 'Simple LLM-readable format',
    extension: '.txt',
    contentType: 'text/plain;charset=UTF-8',
  },
  markdown: {
    name: 'Raw Markdown',
    description: 'Plain markdown without frontmatter',
    extension: '.md',
    contentType: 'text/markdown;charset=UTF-8',
  },
  json: {
    name: 'JSON Manifest',
    description: 'Structured metadata for APIs',
    extension: '.json',
    contentType: 'application/json',
  },
};

/**
 * Generate SVG Badge
 * Embeddable badge for webmasters to show AI agent support
 * 
 * Styles:
 * - modern: Clean button-style badge with hover hint (default)
 * - minimal: Simple text-only badge
 * - flat/flat-square/plastic: Legacy shield.io style badges
 */
export function generateBadgeSvg(
  skillName: string,
  options: { style?: 'flat' | 'flat-square' | 'plastic' | 'modern' | 'minimal'; color?: string; label?: string } = {}
): string {
  const style = options.style || 'modern';
  const color = options.color || '8b5cf6'; // purple
  const label = options.label || 'AI Agents';
  
  // Extract just the domain name without TLD (e.g., "salesforce-com" -> "salesforce")
  const displayName = skillName.replace(/-com$|-io$|-org$|-net$|-co$|-ai$|-dev$/, '').replace(/-/g, ' ');
  
  // Modern style - clean clickable button with icon and clear CTA
  if (style === 'modern' || !options.style) {
    const height = 32;
    // Calculate width based on domain name length
    const domainWidth = Math.max(displayName.length * 7.5, 60);
    const totalWidth = 110 + domainWidth; // label section + domain section
    const dividerX = 100;
    const domainX = dividerX + 12;
    
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${height}" viewBox="0 0 ${totalWidth} ${height}" fill="none" role="img" aria-label="View ${displayName} on RegisterSkill">
  <title>Click to view AI agent skill for ${displayName}</title>
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#${color}"/>
      <stop offset="100%" stop-color="#6366f1"/>
    </linearGradient>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="130%">
      <feDropShadow dx="0" dy="1" stdDeviation="1.5" flood-color="#000" flood-opacity="0.2"/>
    </filter>
  </defs>
  <!-- Background pill -->
  <rect width="${totalWidth}" height="${height}" rx="6" fill="url(#bg)" filter="url(#shadow)"/>
  <!-- Bot/Agent icon -->
  <g transform="translate(10, 6)">
    <rect x="2" y="2" width="16" height="12" rx="2" fill="none" stroke="#fff" stroke-width="1.5"/>
    <circle cx="7" cy="8" r="1.5" fill="#fff"/>
    <circle cx="13" cy="8" r="1.5" fill="#fff"/>
    <line x1="5" y1="16" x2="7" y2="14" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="15" y1="16" x2="13" y2="14" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/>
  </g>
  <!-- Text: "AI Agents" label -->
  <text x="34" y="${height / 2 + 1}" dominant-baseline="middle" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" font-size="11" font-weight="600" fill="#fff">${label}</text>
  <!-- Divider line -->
  <line x1="${dividerX}" y1="8" x2="${dividerX}" y2="${height - 8}" stroke="rgba(255,255,255,0.3)" stroke-width="1"/>
  <!-- Domain name (without TLD) -->
  <text x="${domainX}" y="${height / 2 + 1}" dominant-baseline="middle" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" font-size="12" font-weight="500" fill="#fff">${displayName}</text>
</svg>`;
  }
  
  // Minimal style - simple text badge
  if (style === 'minimal') {
    const domainWidth = Math.max(displayName.length * 7, 50);
    const totalWidth = 85 + domainWidth;
    const height = 24;
    
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${height}" viewBox="0 0 ${totalWidth} ${height}" fill="none" role="img">
  <title>AI Agent Ready: ${displayName}</title>
  <rect width="${totalWidth}" height="${height}" rx="4" fill="#18181b" stroke="#27272a" stroke-width="1"/>
  <circle cx="12" cy="${height / 2}" r="4" fill="#${color}"/>
  <circle cx="12" cy="${height / 2}" r="2" fill="#fff"/>
  <text x="22" y="${height / 2 + 1}" dominant-baseline="middle" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif" font-size="10" fill="#a1a1aa">AI Agents</text>
  <text x="78" y="${height / 2 + 1}" dominant-baseline="middle" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif" font-size="10" font-weight="600" fill="#fafafa">${displayName}</text>
</svg>`;
  }
  
  // Legacy flat styles (shields.io compatible)
  const labelWidth = label.length * 6.5 + 10;
  const valueWidth = skillName.length * 6 + 10;
  const totalWidth = labelWidth + valueWidth;
  const radius = style === 'flat-square' ? 0 : style === 'plastic' ? 4 : 3;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="20" role="img" aria-label="${label}: ${skillName}">
  <title>${label}: ${skillName}</title>
  <linearGradient id="s" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <clipPath id="r">
    <rect width="${totalWidth}" height="20" rx="${radius}" fill="#fff"/>
  </clipPath>
  <g clip-path="url(#r)">
    <rect width="${labelWidth}" height="20" fill="#555"/>
    <rect x="${labelWidth}" width="${valueWidth}" height="20" fill="#${color}"/>
    <rect width="${totalWidth}" height="20" fill="url(#s)"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="11">
    <text x="${labelWidth / 2}" y="14">${label}</text>
    <text x="${labelWidth + valueWidth / 2}" y="14">${skillName}</text>
  </g>
</svg>`;
}

/**
 * Generate HTML Badge Embed Code
 */
export function generateBadgeEmbed(baseUrl: string, skillName: string): string {
  return `<!-- AI Agent Ready Badge -->
<a href="${baseUrl}/skill/${skillName}/skill.md" target="_blank" rel="noopener">
  <img src="${baseUrl}/badge/${skillName}.svg" alt="AI Agent Ready: ${skillName}" />
</a>`;
}

/**
 * Generate Markdown Badge
 */
export function generateBadgeMarkdown(baseUrl: string, skillName: string): string {
  return `[![AI Agent Ready: ${skillName}](${baseUrl}/badge/${skillName}.svg)](${baseUrl}/skill/${skillName}/skill.md)`;
}
