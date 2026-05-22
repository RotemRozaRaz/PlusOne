-- Plus One — Supabase Schema
-- Run this entire file in the Supabase SQL Editor

-- ─── Tables ─────────────────────────────────────────────────────────────────

CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id     TEXT NOT NULL UNIQUE,
  name          TEXT NOT NULL,
  instagram     TEXT,
  photo_url     TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_active     BOOLEAN NOT NULL DEFAULT true
);

CREATE INDEX idx_users_device_id ON users(device_id);
CREATE INDEX idx_users_created_at ON users(created_at DESC);

CREATE TABLE likes (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  liker_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  liked_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT likes_no_self_like CHECK (liker_id <> liked_id),
  CONSTRAINT likes_unique UNIQUE (liker_id, liked_id)
);

CREATE INDEX idx_likes_liker_id ON likes(liker_id);
CREATE INDEX idx_likes_liked_id ON likes(liked_id);

CREATE TABLE matches (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user2_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT matches_ordered CHECK (user1_id < user2_id),
  CONSTRAINT matches_unique  UNIQUE (user1_id, user2_id),
  CONSTRAINT matches_no_self CHECK (user1_id <> user2_id)
);

CREATE INDEX idx_matches_user1 ON matches(user1_id);
CREATE INDEX idx_matches_user2 ON matches(user2_id);

-- ─── Stored Procedure ────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION try_create_match(p_liker UUID, p_liked UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF p_liker = p_liked THEN
    RETURN;
  END IF;

  INSERT INTO likes (liker_id, liked_id)
  VALUES (p_liker, p_liked)
  ON CONFLICT DO NOTHING;

  IF EXISTS (
    SELECT 1 FROM likes
    WHERE liker_id = p_liked AND liked_id = p_liker
  ) THEN
    INSERT INTO matches (user1_id, user2_id)
    VALUES (LEAST(p_liker, p_liked), GREATEST(p_liker, p_liked))
    ON CONFLICT DO NOTHING;
  END IF;
END;
$$;

-- ─── Row Level Security ───────────────────────────────────────────────────────

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

-- Users: anyone can read active profiles, anyone can insert
CREATE POLICY "Public read active users"   ON users FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can insert user"     ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update user"     ON users FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete user"     ON users FOR DELETE USING (true);

-- Likes: insert allowed; reads allowed (needed to build the swipe queue client-side)
CREATE POLICY "Anyone can insert like"     ON likes FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read likes"      ON likes FOR SELECT USING (true);

-- Matches: public read, no direct client insert (only via stored proc)
CREATE POLICY "Public read matches"        ON matches FOR SELECT USING (true);
CREATE POLICY "No direct match insert"     ON matches FOR INSERT WITH CHECK (false);

-- ─── Match Helpers ───────────────────────────────────────────────────────────

-- Returns matched user profiles for a given user, bypassing is_active RLS
CREATE OR REPLACE FUNCTION get_my_matches(p_user_id UUID)
RETURNS SETOF users
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT u.*
  FROM matches m
  JOIN users u ON u.id = CASE
    WHEN m.user1_id = p_user_id THEN m.user2_id
    ELSE m.user1_id
  END
  WHERE m.user1_id = p_user_id OR m.user2_id = p_user_id
  ORDER BY m.created_at DESC;
$$;

-- ─── Realtime ─────────────────────────────────────────────────────────────────
-- Enable in Supabase Dashboard → Database → Replication → matches table
-- Or run:
ALTER PUBLICATION supabase_realtime ADD TABLE matches;

-- ─── Storage Bucket ───────────────────────────────────────────────────────────
-- Create bucket named "photos" with Public access enabled in the Dashboard.
-- Then add these storage policies:

CREATE POLICY "Public photo read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'photos');

CREATE POLICY "Anyone can upload photos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'photos');

CREATE POLICY "Anyone can update photos"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'photos');
