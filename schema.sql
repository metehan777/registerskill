-- AI Agent Skill Registry Database Schema

-- Skills table: stores registered website skills
CREATE TABLE IF NOT EXISTS skills (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  url TEXT NOT NULL,
  domain TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  markdown TEXT NOT NULL,
  open_graph TEXT, -- JSON string
  emoji TEXT DEFAULT '🌐',
  category TEXT DEFAULT 'documentation',
  version TEXT DEFAULT '1.0.0',
  mode TEXT DEFAULT 'blog_cron', -- Prompt mode: blog_cron, newsletter, signup_reminder, summary_email
  
  -- Registration info
  registered_by TEXT, -- Who registered this skill
  agent_platform TEXT, -- Which AI platform registered this
  
  -- Timestamps
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  fetched_at TEXT NOT NULL,
  
  -- Stats
  view_count INTEGER DEFAULT 0,
  download_count INTEGER DEFAULT 0
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_skills_domain ON skills(domain);
CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category);
CREATE INDEX IF NOT EXISTS idx_skills_created_at ON skills(created_at);

-- Full-text search on title and description
CREATE VIRTUAL TABLE IF NOT EXISTS skills_fts USING fts5(
  name,
  title,
  description,
  content='skills',
  content_rowid='rowid'
);

-- Triggers to keep FTS in sync
CREATE TRIGGER IF NOT EXISTS skills_ai AFTER INSERT ON skills BEGIN
  INSERT INTO skills_fts(rowid, name, title, description)
  VALUES (NEW.rowid, NEW.name, NEW.title, NEW.description);
END;

CREATE TRIGGER IF NOT EXISTS skills_ad AFTER DELETE ON skills BEGIN
  INSERT INTO skills_fts(skills_fts, rowid, name, title, description)
  VALUES('delete', OLD.rowid, OLD.name, OLD.title, OLD.description);
END;

CREATE TRIGGER IF NOT EXISTS skills_au AFTER UPDATE ON skills BEGIN
  INSERT INTO skills_fts(skills_fts, rowid, name, title, description)
  VALUES('delete', OLD.rowid, OLD.name, OLD.title, OLD.description);
  INSERT INTO skills_fts(rowid, name, title, description)
  VALUES (NEW.rowid, NEW.name, NEW.title, NEW.description);
END;
