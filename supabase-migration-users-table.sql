-- ═══════════════════════════════════════════════════════════════════
-- Plan My Party Pal — Add Users Table for Tier Tracking
-- Run this in Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════════════════

-- ─── Users Table (Tier Tracking & Subscription Management) ────
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  tier TEXT NOT NULL DEFAULT 'free',

  -- Stripe subscription data
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  subscription_status TEXT,
  subscription_current_period_end TIMESTAMPTZ,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  last_verified_at TIMESTAMPTZ,

  -- Constraint to ensure only valid tiers
  CONSTRAINT valid_tier CHECK (tier IN ('free', 'pro'))
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_stripe_customer ON users(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_users_stripe_subscription ON users(stripe_subscription_id);

-- Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Allow public read access (tier verification via email)
CREATE POLICY "Allow public read access to users"
  ON users
  FOR SELECT
  TO anon
  USING (true);

-- Only service_role can insert/update (via API webhooks)
CREATE POLICY "Service role can manage users"
  ON users
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ═══════════════════════════════════════════════════════════════════
-- ✅ Done! Users table is ready for tier tracking.
-- ═══════════════════════════════════════════════════════════════════
