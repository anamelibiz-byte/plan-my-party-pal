-- ═══════════════════════════════════════════════════════════════════
-- Migration: Add password authentication to users table
-- Run this SQL in your Supabase Dashboard → SQL Editor
-- https://supabase.com/dashboard/project/vchzagtmyilczwjmdfst/sql/new
-- ═══════════════════════════════════════════════════════════════════

-- Add password_hash column to users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- Add email_verified column to track email verification
ALTER TABLE users
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false;

-- Add verification_token for email verification
ALTER TABLE users
ADD COLUMN IF NOT EXISTS verification_token TEXT;

-- Add reset_token for password resets
ALTER TABLE users
ADD COLUMN IF NOT EXISTS reset_token TEXT;

-- Add reset_token_expires for password reset expiration
ALTER TABLE users
ADD COLUMN IF NOT EXISTS reset_token_expires TIMESTAMPTZ;

-- Create index on verification_token for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_verification_token ON users(verification_token);

-- Create index on reset_token for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_reset_token ON users(reset_token);

-- ═══════════════════════════════════════════════════════════════════
-- ✅ Migration complete!
-- Users table now supports password authentication
-- ═══════════════════════════════════════════════════════════════════
