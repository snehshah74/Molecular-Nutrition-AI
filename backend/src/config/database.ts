import { createClient } from '@supabase/supabase-js'
import { config } from './env.js'
import type { Database } from '../types/database.js'

if (!config.supabase.url || !config.supabase.anonKey) {
  throw new Error('Missing Supabase configuration. Please check your .env file.')
}

// Client for user-facing operations (uses anon key with RLS)
export const supabase = createClient<Database>(
  config.supabase.url,
  config.supabase.anonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: false,
    },
  }
)

// Admin client for server-side operations (uses service role key, bypasses RLS)
export const supabaseAdmin = createClient<Database>(
  config.supabase.url,
  config.supabase.serviceRoleKey || config.supabase.anonKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)

export default supabase

