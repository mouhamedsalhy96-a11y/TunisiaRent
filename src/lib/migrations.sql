
export const PROFILE_SCHEMA_SQL = `
-- Add missing columns to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS telephone text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email text;

-- These should match your auth.users.email, but we store locally for easy access
`;

export default PROFILE_SCHEMA_SQL;
