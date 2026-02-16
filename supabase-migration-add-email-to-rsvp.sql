-- ═══════════════════════════════════════════════════════════════════
-- Migration: Add email field to rsvp_responses table
-- Run this SQL in your Supabase Dashboard → SQL Editor
-- https://supabase.com/dashboard/project/vchzagtmyilczwjmdfst/sql/new
-- ═══════════════════════════════════════════════════════════════════

-- Add email column to rsvp_responses table
ALTER TABLE rsvp_responses
ADD COLUMN IF NOT EXISTS email TEXT;

-- Add status column for tracking pending/confirmed RSVPs (for reminder system)
ALTER TABLE rsvp_responses
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'confirmed';

-- Add last_reminded column for tracking when reminders were sent
ALTER TABLE rsvp_responses
ADD COLUMN IF NOT EXISTS last_reminded TIMESTAMPTZ;

-- Add constraint to ensure valid status values
ALTER TABLE rsvp_responses
ADD CONSTRAINT valid_status CHECK (status IN ('pending', 'confirmed'));

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_rsvp_email ON rsvp_responses(email);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_rsvp_status ON rsvp_responses(status);

-- ═══════════════════════════════════════════════════════════════════
-- ✅ Migration complete!
-- You can now store guest email addresses with RSVP responses
-- ═══════════════════════════════════════════════════════════════════
