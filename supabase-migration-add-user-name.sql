-- Add full_name column to users table for personalization
ALTER TABLE users ADD COLUMN IF NOT EXISTS full_name TEXT;

-- Create index for faster name lookups (useful for search features)
CREATE INDEX IF NOT EXISTS idx_users_full_name ON users(full_name);

-- Add comment explaining the column
COMMENT ON COLUMN users.full_name IS 'User''s full name for personalization (e.g., "Ana Meli")';
