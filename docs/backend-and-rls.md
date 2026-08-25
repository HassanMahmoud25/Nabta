# Backend and Row Level Security

The initial migration creates relational ownership around `auth.users → parent_profiles → children`. Mission steps and localized mission content stay in JSONB because their discriminated shape changes more naturally as a document; ownership, progress, attempts, assignments, preferences, and badges remain relational.

Every parent-owned table enables RLS. Direct child ownership uses `parent_id = auth.uid()`. Indirect tables call the `security definer` helper `owns_child`, whose fixed search path and single ownership lookup prevent trusting a client-provided child ID. Skills, published missions, and active badges are authenticated read-only content. Attempts, progress, and child badges are client read-only; completion writes go through `complete_mission`.

`complete_mission` verifies ownership, checks the curated mission, calculates reward server-side, and inserts an attempt with unique child/mission and child/idempotency constraints. A retry returns the existing attempt and does not add XP again. The function then updates child XP and skill progress in the same transaction.

The mobile app must use only `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. A database password or service-role/secret key must never be placed in Expo environment variables or the app bundle.
