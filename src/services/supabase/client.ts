import 'expo-sqlite/localStorage/install';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import { env } from '@/config/env';

let client: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (!env.hasSupabaseConfig || !env.supabaseUrl || !env.supabasePublishableKey) {
    throw new Error('Supabase is not configured. Copy .env.example to .env.local and add public client values.');
  }
  client ??= createClient(env.supabaseUrl, env.supabasePublishableKey, {
    auth: { storage: localStorage, autoRefreshToken: true, persistSession: true, detectSessionInUrl: false },
  });
  return client;
}

