# Nabta

Nabta is an Expo/React Native MVP that helps children aged 4–12 practice life skills through short interactive decisions. Parents own the account and private child profiles; Kids Mode contains missions, journeys, XP, and badges, and can only return through a Parent PIN gate.

## Run locally

```bash
cp .env.example .env.local
npm install
npm start
```

Development fixture mode is enabled by default when no Supabase project is configured. The welcome screen includes **Explore demo · PIN 2468** only in development builds.

For hosted persistence, set `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, and `EXPO_PUBLIC_USE_DEV_FIXTURES=false`, then apply the migrations under `supabase/migrations`. Never place a service-role or secret key in the mobile app.

## Validation

```bash
npm run typecheck
npm run lint
npm test
npx expo install --check
npx expo export --platform web
```

Product and engineering details live in [docs/product-spec.md](docs/product-spec.md), [docs/architecture.md](docs/architecture.md), [docs/implementation-plan.md](docs/implementation-plan.md), and [docs/backend-and-rls.md](docs/backend-and-rls.md).
