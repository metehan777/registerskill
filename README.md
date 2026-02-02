# RegisterSkill

A universal skill.md creator for any website. Make your website discoverable by AI agents.

**Live Demo:** [registerskill.com](https://registerskill.com)

## What It Does

1. **Converts any URL** to an AI-readable `skill.md` file
2. **Registers websites** in a searchable skill registry  
3. **Generates badges** webmasters can embed on their sites
4. **Supports multiple modes** for different AI agent actions
5. **Tracks referrals** with UTM parameters for analytics

## Modes

| Mode | Description | Frequency |
|------|-------------|-----------|
| `blog_cron` | Monitor for new blog posts/content | Daily |
| `newsletter` | Help user subscribe to newsletter | Once + 1 week reminder |
| `signup_reminder` | Remind user to create account | Once + 1 week reminder |
| `summary_email` | Send website summary to email | Once + 1 week reminder |

## Quick Start

### Prerequisites

```bash
npm install -g wrangler
```

### Install & Run Locally

```bash
# Install dependencies
npm install

# Create D1 database
wrangler d1 create ai-skill-registry
# Update database_id in wrangler.toml

# Initialize database
wrangler d1 execute ai-skill-registry --local --file=./schema.sql

# Start development server
npm run dev
```

### Deploy to Cloudflare

```bash
# Initialize remote database
wrangler d1 execute ai-skill-registry --remote --file=./schema.sql

# Deploy
npm run deploy
```

## API Reference

### Register a Skill

```bash
POST /register
Content-Type: application/json

{
  "url": "https://example.com",
  "name": "example-site",
  "mode": "blog_cron"
}
```

### Get Skill

```bash
# Get skill.md file (for AI agents)
GET /skill/{name}/skill.md

# Get metadata as JSON
GET /skill/{name}
```

### Get Badge

```bash
GET /badge/{name}.svg
```

### List & Search

```bash
# List all skills
GET /skills

# Search skills
GET /skills/search?q=documentation
```

## For AI Agents

Read the skill.md to understand how to use this service:

```
https://registerskill.com/skill.md
```

## Badge Integration

After registering, add a badge to your website:

### HTML

```html
<a href="https://registerskill.com/skill/your-site/skill.md" target="_blank">
  <img src="https://registerskill.com/badge/your-site.svg" alt="AI Agent Ready" />
</a>
```

### Markdown

```markdown
[![AI Agent Ready](https://registerskill.com/badge/your-site.svg)](https://registerskill.com/skill/your-site/skill.md)
```

## Project Structure

```
registerskill/
├── src/
│   ├── index.ts              # Main worker (API + UI)
│   ├── html-to-markdown.ts   # HTML conversion
│   └── skill-formats.ts      # Format generators + badges
├── schema.sql                # D1 database schema
├── wrangler.toml             # Cloudflare config
├── package.json
└── README.md
```

## Author

**Metehan Yesilyurt**
- Website: [metehan.ai](https://metehan.ai)
- X: [@metehan777](https://x.com/metehan777)
- LinkedIn: [metehanyesilyurt](https://www.linkedin.com/in/metehanyesilyurt)

## License

MIT
