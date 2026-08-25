# Nash2 MVP Product Specification

## Product promise

Nash2 helps children aged 4–12 practice real-life judgment through short, curated scenarios, decisions, and offline activities. Parents own the authenticated account and manage private child profiles. Children never create accounts and never enter public or social spaces.

## MVP audience and modes

- **Parent mode:** authentication, onboarding, child management, progress insights, offline activities, settings, and entry to Kids Mode.
- **Kids Mode:** one active child, today's mission, learning journey, rewards, avatar, and mission history. Leaving Kids Mode always passes through a four-digit Parent Gate.
- **Age bands:** 4–6, 7–9, and 10–12. Mission eligibility and language are age-band aware.

## Core vertical slice

1. A parent creates an account and a four-digit PIN.
2. The parent creates Omar (age band 7–9), chooses an avatar, and selects Money, Internet Safety, and Responsibility.
3. The dashboard presents understandable progress and an offline activity.
4. The parent enters Kids Mode for Omar.
5. Omar completes a multi-step, scenario-led mission and receives explanatory feedback.
6. Completion is idempotent, awards XP once, updates skill progress, and evaluates badges.
7. Omar returns to Kids Home; returning to Parent Mode requires the PIN.
8. The parent sees the new result after reopening the app.

## Content model

Ten data-driven skill definitions are supported: Money, Responsibility, Internet Safety, Emotions, Communication, Time Management, Health, Problem Solving, Social Skills, and Independence. Polished MVP content prioritizes the first, second, third, fourth, and eighth skills.

Mission steps form a discriminated union with four v1 renderers:

- scenario choice
- multiple choice
- ordering
- parent activity

Every answer provides age-appropriate reasoning rather than binary “correct/incorrect” feedback. UI strings use i18next; curated mission content uses `{ en, ar }` localized values.

## Progress and rewards

- XP, skill level, progress percentage, and completion counts are derived by shared domain utilities.
- The first learning-path algorithm is deterministic and chooses an eligible incomplete mission from the lowest-progress selected skill while avoiding immediate skill repetition when possible.
- Badges and unlock rules are content data evaluated by a dedicated service.
- There are no streak penalties, leaderboards, public profiles, chat, feeds, targeted ads, or generated child-facing content.

## Privacy and safety

The parent is the only authenticated identity. Child records contain a nickname, age band, avatar key, preferences, XP, and progress—never a child email, exact birth date, photo, address, phone number, precise location, or public username. Analytics events exclude sensitive child information. Supabase Row Level Security enforces parent ownership at the database boundary.

## MVP acceptance criteria

- The complete Parent → Child → Mission → Progress → Parent loop works on iOS, Android, and web-compatible React Native surfaces.
- English and Arabic are available from the start, including RTL direction changes.
- Auth/session, onboarding draft, selected child, completed progress, and rewards persist appropriately.
- TypeScript, lint, domain tests, and Expo dependency checks pass.
- Network, empty, loading, and retry states use understandable language and never expose raw backend errors.

