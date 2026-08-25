# Nabta Implementation Plan

Status values: **Not Started**, **In Progress**, **Completed**.

| Phase                   | Scope                                                                                                                                                                               | Status    |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| 0 — Foundation          | SDK verification, strict TypeScript, Router, feature structure, tokens, UI primitives, i18n/RTL, Query provider, Supabase abstraction, Zustand, errors, environment, baseline tests | Completed |
| 1 — Authentication      | Parent sign-up/sign-in, persisted session, sign-out, protected navigation, reset architecture, Zod forms                                                                            | Completed |
| 2 — Parent onboarding   | PIN lifecycle, child profile, age/avatar/skills/goals, resumable onboarding                                                                                                         | Completed |
| 3 — Parent shell        | Parent tabs, child switching, empty/loading/error states                                                                                                                            | Completed |
| 4 — Mission domain      | Types, schemas, repositories, fixtures, learning path, scoring, progress/XP, badges, unit tests                                                                                     | Completed |
| 5 — Kids Mode           | Child selection, home, journey, rewards, profile, secure Parent Gate                                                                                                                | Completed |
| 6 — Mission player      | Typed step renderers, feedback, session recovery, completion, retry safety                                                                                                          | Completed |
| 7 — Parent progress     | Derived dashboard, insights, history, offline recommendation                                                                                                                        | Completed |
| 8 — Backend integration | Supabase schema/migrations, RLS, persistence, ownership verification, idempotent completion                                                                                         | Completed |
| 9 — Polish              | Arabic RTL, resilience, device layouts, accessibility, motion, navigation review                                                                                                    | Completed |

## Validation gate for every phase

1. `npm run typecheck`
2. `npm run lint`
3. `npm test`
4. `npx expo install --check`
5. Review unused imports, unsafe `any`, route accessibility, and iOS/Android compatibility.

The phase advances only after introduced failures are resolved. The end-to-end vertical slice takes precedence over breadth.

## Final validation record

- Strict TypeScript: passed
- Expo ESLint: passed
- Jest: 6 suites, 12 tests passed
- Expo dependency compatibility: passed
- Web static export: passed (32 routes)
- iOS Hermes bundle export: passed
- Android Hermes bundle export: passed
- Browser walkthrough: sign-in, resumable onboarding, persisted dashboard, Kids Mode, two-step mission, explanatory feedback, XP, badge, next mission, Parent Gate, and updated dashboard passed
