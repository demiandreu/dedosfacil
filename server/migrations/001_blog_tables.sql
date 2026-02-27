-- Blog tables migration
-- Run this SQL against your PostgreSQL database

-- Categories table
CREATE TABLE IF NOT EXISTS blog_categories (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Category translations
CREATE TABLE IF NOT EXISTS blog_category_translations (
  id SERIAL PRIMARY KEY,
  category_id INTEGER NOT NULL REFERENCES blog_categories(id) ON DELETE CASCADE,
  lang VARCHAR(5) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  UNIQUE(category_id, lang)
);

-- Posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id SERIAL PRIMARY KEY,
  category_id INTEGER REFERENCES blog_categories(id) ON DELETE SET NULL,
  author VARCHAR(255) DEFAULT 'DedosFácil',
  featured_image TEXT,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Post translations
CREATE TABLE IF NOT EXISTS blog_post_translations (
  id SERIAL PRIMARY KEY,
  post_id INTEGER NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  lang VARCHAR(5) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  title VARCHAR(500) NOT NULL,
  excerpt TEXT,
  content TEXT,
  meta_title VARCHAR(255),
  meta_description VARCHAR(500),
  UNIQUE(post_id, lang),
  UNIQUE(lang, slug)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_post_translations_lang ON blog_post_translations(lang);
CREATE INDEX IF NOT EXISTS idx_blog_post_translations_slug ON blog_post_translations(lang, slug);
CREATE INDEX IF NOT EXISTS idx_blog_category_translations_lang ON blog_category_translations(lang);
