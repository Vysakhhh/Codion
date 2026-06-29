-- Database Schema for Codion
-- Run these queries in the Supabase SQL Editor.

-- Enable pgvector extension (pre-packaged with Supabase)
CREATE EXTENSION IF NOT EXISTS vector;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  github_id BIGINT UNIQUE NOT NULL,
  username TEXT NOT NULL,
  email TEXT,
  avatar_url TEXT,
  github_access_token TEXT, -- Encrypted using AES-256-GCM
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT, -- PR title or manual label
  score SMALLINT CHECK (score BETWEEN 0 AND 100),
  summary TEXT,
  provider_used TEXT, -- gemini / groq / mistral
  diff_hash TEXT, -- sha256 of the diff
  diff TEXT, -- Full unified diff code
  tokens_used INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Comments Table
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID REFERENCES reviews(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  line_start INTEGER,
  line_end INTEGER,
  severity TEXT CHECK (severity IN ('CRITICAL', 'MAJOR', 'MINOR', 'INFO')),
  category TEXT,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  suggestion TEXT,
  suggested_code TEXT,
  embedding VECTOR(768) -- pgvector for semantic search (e.g. text-embedding-3-small)
);

-- Indexes for Fast Queries
CREATE INDEX IF NOT EXISTS idx_reviews_user_created ON reviews(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_review_id ON comments(review_id);
CREATE INDEX IF NOT EXISTS idx_comments_severity ON comments(severity);

-- Enable Row-Level Security (RLS) on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Row Level Security (RLS) Policies

-- Users Policies
CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (id = auth.uid());

-- Reviews Policies
CREATE POLICY "Users can only see their own reviews"
  ON reviews FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own reviews"
  ON reviews FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own reviews"
  ON reviews FOR DELETE
  USING (user_id = auth.uid());

-- Comments Policies
CREATE POLICY "Users can view comments on their reviews"
  ON comments FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM reviews 
    WHERE reviews.id = comments.review_id AND reviews.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert comments on their reviews"
  ON comments FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM reviews 
    WHERE reviews.id = comments.review_id AND reviews.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete comments on their reviews"
  ON comments FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM reviews 
    WHERE reviews.id = comments.review_id AND reviews.user_id = auth.uid()
  ));
