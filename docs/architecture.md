# Nash2 Architecture

## Runtime and boundaries

Nash2 targets Expo SDK 57, React Native 0.86, React 19.2, strict TypeScript, and Expo Router. Expo Router owns navigation; TanStack Query owns server-state caching; Zustand owns only mode, active-child, onboarding draft, and in-session mission state. Supabase is accessed through services, never directly by screens.

```text
Expo Router screens
  → feature hooks and UI components
    → domain services / repositories
      → Supabase client or development repository
        → PostgreSQL + Row Level Security
```

## Source layout

```text
src/
  app/                 route groups and layouts only
  components/ui/       accessible visual primitives
  components/parent/   parent presentation components
  components/child/    kids presentation components
  components/missions/ mission step renderers
  features/            auth, onboarding, missions, learning path, progress, rewards
  services/            API contracts, Supabase client, analytics, entitlements
  stores/              small persisted client/session stores
  theme/               tokens and semantic parent/kids palettes
  data/                curated skills, missions, badges, activities, dev fixtures
  i18n/                UI translations and direction helpers
  types/               shared domain types
  utils/               pure cross-feature utilities
supabase/migrations/    schema, constraints, functions, grants, and RLS policies
```

## Navigation and mode security

The root layout provides localization, QueryClient, auth, error boundary, and safe-area context. Public auth, onboarding, parent, and kids routes are separate groups. Auth and onboarding guards use protected routing. Client-side route guards improve UX but are never the authorization boundary. Kids Mode removes ordinary access to parent routes; the only exit is Parent Gate verification.

## Data ownership and persistence

Production repositories use the public Supabase client with a publishable/anon key. The mobile bundle never contains a service-role key. Every parent-owned table derives ownership from `auth.uid()` directly or through a child relationship. Database policies validate ownership for selects and mutations. Mission completion uses a database function and a unique completion key so retrying cannot award XP twice.

Development fixtures implement the same repository contracts and are enabled only by `EXPO_PUBLIC_USE_DEV_FIXTURES=true` in non-production builds. They persist locally so the full flow can be evaluated without a hosted project.

Parent PIN values are salted and hashed. Native builds store only the salted verifier in Expo SecureStore. Web uses local storage for the verifier because SecureStore has no web implementation; the PIN is a local mode gate rather than account authentication, and production account security remains Supabase Auth.

## Mission domain

`MissionStep` is a discriminated union. A renderer map selects one view per step type, keeping orchestration independent from presentation. Answers remain temporary in the mission-session store. Only a successful completion repository call changes permanent progress. Pure scoring, XP, level, age filtering, learning-path selection, and badge evaluation functions are unit tested.

## Localization and accessibility

i18next stores interface strings; mission content keeps localized values beside curated content. The locale provider updates React Native RTL state and direction-aware icons. Reusable controls provide labels, roles, minimum 44–48 point touch targets, visible pressed/disabled states, and non-color status cues. Motion is decorative and may be disabled when reduced motion is requested.

## Error and query strategy

Services normalize backend errors into stable app error codes. Query keys are centralized. Mutations invalidate only affected child progress, today's mission, dashboard, rewards, and history keys. Queries use bounded retries and non-zero stale times; auth failures are not retried blindly.

## Entitlements and analytics

A central entitlement service exposes `free | family` capabilities. Screens do not inspect ad-hoc premium flags. Analytics flows through a provider-neutral adapter and allow-listed event properties; child nickname, age, answers, and identifiers are excluded.
