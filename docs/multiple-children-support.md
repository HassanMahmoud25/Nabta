# Nash2 Multiple Children Support

## Goal

Allow one authenticated parent to manage any supported number of child profiles while keeping every profile, mission, completion, XP total, skill level, badge, recommendation, and query cache strictly isolated by `childId`.

## Existing architecture audit

### What already supports multiple children

- The Supabase `children.parent_id` foreign key already models one parent to many children.
- `children_owned` RLS restricts all child CRUD to `parent_id = auth.uid()`.
- `child_skill_preferences`, `mission_assignments`, `mission_attempts`, `skill_progress`, and `child_badges` all reference `children(id)` with `on delete cascade`.
- Related-table RLS uses `owns_child(child_id)`, which resolves ownership through the authenticated parent.
- `complete_mission` validates `owns_child(p_child_id)` before inserting an attempt or updating XP/progress.
- Mission attempts, progress rows, badges, and assignments use child-scoped primary/unique keys.
- The development database already stores arrays of children/progress/completions and indexes badge IDs by child.
- The learning-path selector receives a concrete `ChildProfile`, child progress, and child completion IDs. It filters by that child’s age and selected skills.
- Existing query keys already include `childId` for child details, dashboard, today’s mission, mission history, progress, and rewards.
- Mission completion mutations invalidate only the completed child’s keys.
- Kids Home, Journey, Rewards, Profile, skill detail, and mission completion already read `activeChildId` rather than a hardcoded profile.
- The entitlement service already centralizes `maxChildren`; development returns the family entitlement.

### Existing single-child assumptions and gaps

- `activeChildId` exists in Zustand but is memory-only. It is not restored after restart and is not reconciled when a profile is deleted or belongs to a different signed-in parent.
- Parent Home resolves `stored active child ?? children[0]`, but does not write the fallback to the store. Other tabs can therefore resolve a different source of truth.
- Parent Progress separately uses `activeChildId ?? children[0]?.id`, duplicating fallback logic.
- Parent Home’s Kids Mode button enters directly for the currently rendered child. There is no “Who’s learning?” choice when siblings exist.
- The Children screen can select a profile but offers no Add, Edit, Delete, explicit View, or Enter Kids Mode actions.
- The no-child path redirects to full parent onboarding. That flow asks for the Parent PIN and account-level setup, so it cannot be reused directly for an additional child.
- Child services and both database adapters expose list/get/create only. Update and delete are absent.
- The client `ChildProfile` type omits `createdAt` and `updatedAt`, even though Supabase already stores both.
- Production child creation previously inserted the profile, preferences, and progress in separate client calls. The implementation now uses one transactional ownership-bound RPC so partial profiles cannot be created.
- Editing selected skills has no merge behavior. Removed skills must retain historical `skill_progress`, while future eligibility should follow current preferences.
- Deleting an active child has no deterministic fallback selection.
- Child switching has no transitional state; cached data is correctly keyed but the parent shell could temporarily keep the old profile visible until the new query resolves.
- Analytics supports `child_created` but not the requested add/switch/update/delete/kids-selection events.
- Existing tests cover core ownership, scoring, learning path, and badges individually, but not multi-child database isolation or active-child fallback.

## Minimum safe implementation

### Data model

- Extend `ChildProfile` with `createdAt` and `updatedAt`.
- Introduce a child draft/update type containing nickname, age band, avatar, selected skills, and goals.
- Keep all server child data in React Query. Zustand continues to store only `activeChildId`, current mode, and short-lived switching state.

### Database and migration

- No destructive table migration is required: the current schema is already one-parent-to-many-children.
- Add a `create_child_profile` security-definer RPC that binds the new profile to `auth.uid()` and atomically creates the child, preferences, and initial progress.
- Add an `update_child_profile` security-definer RPC that validates ownership, updates profile fields/preferences, and inserts missing progress rows without deleting old progress.
- Add a `delete_child_profile` security-definer RPC that validates ownership and deletes the child. Existing foreign-key cascades remove preferences, assignments, attempts, progress, and badges.
- Keep existing parents and children unchanged. Existing single-child accounts automatically become one-item multi-child accounts.

### State management

- Persist active-child selection per parent, not globally.
- Add a reconciliation helper:
  1. keep the stored child if it still belongs to the loaded parent;
  2. otherwise choose the first available child;
  3. otherwise clear selection and show the child-creation empty state.
- On deletion, choose the next available child before rendering dependent parent data.
- Expose an explicit switching flag/name so the dashboard shows a transition state rather than old data under a new selection.

### Queries and mutations

- Keep every child-specific key child-scoped.
- Add child create/update/delete mutations.
- On create: invalidate the parent’s children key, seed/set the child detail cache, select the new child, and invalidate its dashboard/progress/mission/reward keys.
- On update: invalidate the child detail, parent child list, dashboard, progress, today-mission, and rewards keys.
- On delete: remove the deleted child’s cached query families, invalidate the parent child list, and reconcile selection.
- Use `placeholderData: undefined` for switched child dashboards so React Query never carries sibling data into the new key.

### UI and navigation

- Add a premium child selector directly below the Parent Header. It expands into an accessible in-screen family picker with avatar, nickname, age band, active state, and Add Child.
- Add `/(parent)/child-form` for Add/Edit child. It reuses age, avatar, skills, goals, tokens, and validation without repeating account or PIN onboarding.
- Upgrade Children with current level/XP, Switch, Enter Kids Mode, Edit, and guarded Delete actions.
- Add a polished no-children state with Add Child instead of broken dashboard metrics.
- Before Kids Mode: enter directly for one child; show a large child-friendly picker for multiple children.
- Parent PIN exit keeps the active child unchanged.

### Edit semantics

- Nickname, avatar, age band, selected skills, and goals are editable.
- Changing age band only affects future mission eligibility.
- Removing a skill deletes its preference but preserves existing progress and attempts.
- Re-adding a skill reuses preserved progress.
- Newly selected skills receive an initial progress row if one does not exist.

### Delete semantics

- Deletion requires an explicit destructive confirmation panel naming the child and explaining permanent data loss.
- Supabase cascade deletion removes all dependent child data.
- The development adapter mirrors the same cascade behavior.
- Deleting the active child selects another owned child or clears selection when none remain.

### Error and privacy handling

- Convert database failures into friendly UI messages; never display raw Supabase errors.
- Analytics includes only child IDs, counts, age band, and safe action metadata—never nickname or child-entered content.
- Ownership is validated on the server/RLS path, not inferred from Zustand.

## Test plan

- Parent can own multiple children.
- Persisted active child is restored only when still owned by the current parent.
- Invalid/deleted active child falls back to the first owned child.
- Query keys differ for every child-specific resource.
- Learning paths independently respect sibling age, selected skills, progress, and completions.
- Completing a mission updates only the targeted child’s XP/progress/badges.
- Update preserves historical progress for removed skills.
- Delete cascades all development data for that child and leaves siblings unchanged.
- Parent ownership prevents cross-parent get/update/delete access in the development adapter and Supabase RPC/RLS design.
- No-child state routes to Add Child, while first-time account onboarding remains compatible.

## Implementation status

Implemented on 2026-08-24:

- Added timestamp-complete child types, create/update/delete adapters, transactional Supabase RPCs, and cascade-equivalent development behavior.
- Added parent-scoped active-child persistence, startup/deletion reconciliation, and an explicit switch transition state.
- Added the premium Add/Edit child flow, dashboard selector, Children management cards, guarded deletion, no-child states, and the multi-profile Kids Mode picker.
- Preserved historical progress when age bands or selected skills change; future learning-path eligibility follows the updated profile.
- Added safe multi-child analytics events and child-scoped cache invalidation.
- Added automated coverage for selection fallback, query-key isolation, independent age/skill recommendations, targeted XP/progress/badges, ownership checks, and preserved progress.

Validation results:

- TypeScript: passed.
- ESLint: passed.
- Jest: 7 suites and 17 tests passed.
- Expo web export: passed (34 static routes).
- Expo Android export: passed.
- Manual browser scenario: passed for Omar → add Mariam → switch both directions → multi-child Kids picker → age/skill-appropriate Mariam mission → 110 XP and badge awarded only to Mariam → PIN-protected parent return → Omar remains at 0 XP. No browser console warnings or errors were reported.
