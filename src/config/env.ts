const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL?.trim();
const supabasePublishableKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();

export const env = {
  supabaseUrl,
  supabasePublishableKey,
  useDevFixtures: __DEV__ && process.env.EXPO_PUBLIC_USE_DEV_FIXTURES !== 'false',
  hasSupabaseConfig: Boolean(supabaseUrl && supabasePublishableKey),
} as const;

