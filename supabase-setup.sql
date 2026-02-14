-- ═══════════════════════════════════════════════════════════════════
-- Plan My Party Pal — Supabase Database Setup
-- Run this SQL in your Supabase Dashboard → SQL Editor
-- https://supabase.com/dashboard/project/vchzagtmyilczwjmdfst/sql/new
-- ═══════════════════════════════════════════════════════════════════

-- ─── 1. Email Subscribers Table ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  source TEXT DEFAULT 'landing',
  party_data JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Allow inserts from the anon key (public signups)
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public inserts on subscribers"
  ON subscribers
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Only service_role can read subscriber list (your admin)
CREATE POLICY "Allow service_role to read subscribers"
  ON subscribers
  FOR SELECT
  TO service_role
  USING (true);


-- ─── 2. RSVP Responses Table ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS rsvp_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  party_id TEXT NOT NULL,
  guest_name TEXT NOT NULL,
  attending BOOLEAN DEFAULT true,
  adult_count INTEGER DEFAULT 1,
  child_count INTEGER DEFAULT 0,
  dietary TEXT[] DEFAULT '{}',
  dietary_other TEXT DEFAULT '',
  message TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast lookups by party
CREATE INDEX IF NOT EXISTS idx_rsvp_party_id ON rsvp_responses(party_id);

-- Allow anyone with the link to submit RSVP (public form)
ALTER TABLE rsvp_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public inserts on rsvp_responses"
  ON rsvp_responses
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow reading RSVPs by party_id (so the host can see responses)
CREATE POLICY "Allow public reads on rsvp_responses"
  ON rsvp_responses
  FOR SELECT
  TO anon
  USING (true);


-- ─── 3. Party Plans Table (Cross-Device Sync) ─────────────────────
CREATE TABLE IF NOT EXISTS party_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email TEXT NOT NULL,
  party_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast email lookups
CREATE INDEX IF NOT EXISTS idx_party_plans_email ON party_plans(user_email);
CREATE INDEX IF NOT EXISTS idx_party_plans_updated ON party_plans(updated_at DESC);

-- Allow anyone to create and update their party plans
ALTER TABLE party_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public inserts on party_plans"
  ON party_plans
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public updates on party_plans"
  ON party_plans
  FOR UPDATE
  TO anon
  USING (true);

CREATE POLICY "Allow public reads on party_plans"
  ON party_plans
  FOR SELECT
  TO anon
  USING (true);


-- ═══════════════════════════════════════════════════════════════════
-- ✅ Done! All three tables are ready.
-- The app will automatically start using them.
-- ═══════════════════════════════════════════════════════════════════
