# Nash2 Premium Visual Redesign Plan

## Product direction

Nash2 should communicate three ideas at a glance: adventure for the child, progress for the parent, and thoughtful learning underneath both. Kids Mode will use lively skill worlds, tactile controls, illustration-led storytelling, and expressive motion. Parent Mode will share the same brand DNA through calmer color, denser information hierarchy, and restrained motion.

This document is the implementation checklist and visual QA record for the redesign. Functional learning, scoring, authentication, storage, privacy, mode switching, and routing behavior remain intact unless a presentation-safe refactor is required.

## Audit summary

### Current visual problems

- Most screens are a vertical stack of identical white bordered cards on a pale gray canvas, so content importance and screen purpose are difficult to scan.
- Kids and Parent modes mainly differ by accent color. Their layout rhythm, card language, typography, and interaction character are otherwise nearly identical.
- Kids Home does not establish a world, story, or clear visual hierarchy. The mission scene is a single emoji inside a flat rectangle.
- Parent Home presents correct data but lacks an insight hierarchy; XP and mission totals feel like generic counters rather than an actionable family summary.
- Backgrounds are uniformly flat and do not provide depth, landmarks, or gentle environmental personality.
- Typography has only six undifferentiated system styles. Kids headings are not characterful, parent labels are not calibrated for information density, and Arabic-specific line-height/font fallback behavior is not explicit.
- Radius, shadow, and spacing tokens exist but are too coarse for a premium system. A single card shadow and generic radius are applied broadly.
- Buttons have weak physicality, no icon support, no defined compact/destructive/success variants, and minimal pressed feedback.
- Progress bars are generic and static. They do not distinguish overall level, skill progress, mission steps, or parent analytics.
- Auth and onboarding are functionally clear but visually resemble plain forms and checklists.
- Existing empty/loading/error states are centered text blocks without branded visuals or contextual variants.
- The browser baseline currently fails before rendering because `expo-sqlite` cannot resolve `wa-sqlite/wa-sqlite.wasm`; this must be corrected before responsive web QA.

### Icon problems

- Tab bars use text glyphs (`⌂`, `◉`, `★`, `☺`, `↗`, `✦`, `⚙`) instead of a coherent icon family.
- Skill, avatar, badge, activity, mission, and completion visuals use emoji, so rendering varies by platform and violates the intended premium style.
- Selected/unselected tab states rely only on tint and do not consistently change symbol fill or container treatment.
- Icons are not centralized, so meaning, weight, size, and RTL behavior cannot be audited systematically.
- Several action rows have no affordance icon, while decorative symbols are used where semantic icons are needed.

### Illustration problems

- There is no illustration registry or dedicated Nash2 visual asset structure.
- Mission `illustrationKey` values are present in content data but are not rendered as illustrations.
- No scene art exists for onboarding, mission introductions, mission steps, completion, skill worlds, achievements, or empty states.
- Current emoji scenes have no controlled aspect ratio, art direction, resolution, theme context, or RTL behavior.
- Existing `assets/images` are Expo starter assets and do not express the Nash2 brand.

### Motion problems

- There are no centralized duration, easing, spring, stagger, or reduced-motion tokens.
- Screen transitions are a single global fade regardless of context.
- Buttons, answer cards, progress, badges, and navigation do not provide meaningful micro-feedback.
- Mission answers jump directly to static feedback without a reaction beat.
- Completion has no reveal sequence or delight moment.
- Haptics and optional sound-feedback architecture are absent.

### Kids Mode problems

- The experience reads like a themed form rather than an interactive mini-adventure.
- Home does not quickly show ownership, today’s story, skill world, reward, action, and progress as one coherent composition.
- Journey is a list of cards rather than a path through distinct worlds.
- Rewards are a flat two-column list with no collectible depth, rarity, lock treatment, or unlock moment.
- Skill detail is mostly text and one progress card; the world identity disappears.
- Mission flow has no intro screen. Scenario, choice, reaction, explanation, progress, and reward are visually compressed together.
- Answer options feel like radio buttons. They lack physical press, clear choice states, consequence feedback, and age-appropriate scale.
- Profile does not make the avatar feel owned or customizable.
- Parent Gate is secure but visually indistinguishable from an account form.

### Parent Mode problems

- The dashboard does not answer “what happened, what improved, what needs practice, and what should we do next?” in a clear priority order.
- Progress is a list of uniform cards without comparison, trend, recent evidence, or recommended focus.
- Activities lack imagery, skill color coding, clear time/effort metadata, and actionable presentation.
- Children uses a touch handler on a generic card rather than an explicit accessible selection control.
- Settings lacks grouped navigation rows, recognizable icons, and calm hierarchy.
- Parent navigation uses the same glyph-based visual approach as Kids Mode.

## Proposed visual foundation

### Color system

The palette will be semantic and world-based rather than decorative.

- Brand ink: deep navy-green for trustworthy readable text.
- Parent primary: forest teal; quiet, capable, and premium.
- Parent accent: warm brass used sparingly for recommendations and high-value moments.
- Kids primary: deep adventure violet used for navigation and primary actions, not every surface.
- Canvas families: warm cream for Parent Mode; cool moonlit lavender for Kids Mode.
- Money world: amber/gold with deep ochre contrast.
- Responsibility world: coral/orange with grounded terracotta contrast.
- Internet Safety world: cyan/blue with deep ocean contrast.
- Emotions world: rose/magenta with plum contrast.
- Communication world: violet with aubergine contrast.
- Time Management world: indigo with navy contrast.
- Health world: green/mint with forest contrast.
- Problem Solving world: turquoise with teal contrast.
- Social Skills world: sky blue with cobalt contrast.
- Independence world: warm red-orange with burgundy contrast.
- Feedback: emerald success, amber reflection, coral retry, and neutral learning-note states. Feedback will never depend on color alone.

All skill palettes will expose `base`, `strong`, `soft`, `surface`, and `gradient` roles. Text and control combinations will be checked for WCAG-aware contrast.

### Typography

- Create separate `kids` and `parent` type scales while retaining one readable system-font stack for bundle simplicity and reliable Arabic shaping.
- Kids display styles: rounder platform system fallback, bolder weight, shorter lines, more generous leading.
- Parent styles: tighter titles, strong section labels, tabular-friendly numerals, and calm body copy.
- Arabic: explicit Arabic-capable system fallback, increased line height, no forced letter spacing, and direction-aware alignment.
- Add display, hero, title, heading, subheading, body, body-strong, label, caption, and micro roles.

### Spacing, shape, elevation, and layout

- Expand the spacing scale while keeping a four-point base rhythm.
- Add component-specific radii: control, panel, hero, badge, and pill.
- Add three restrained elevation levels plus a tactile bottom-edge treatment for Kids primary buttons.
- Introduce responsive gutters and compact/regular content widths rather than fixed scene dimensions.
- Use `SafeAreaView`, flexible aspect ratios, and width-derived layouts for small Android through large iPhone sizes.

### Icon strategy

- Build a centralized `AppIcon` registry using Expo Symbols 57 cross-platform names: SF Symbols on iOS and Material Symbols on Android/web.
- Use one consistent rounded/semibold visual weight and audited sizes (16, 20, 24, 28, 32).
- Define paired selected/unselected tab symbols and semantic names for every recurring action, skill, badge, avatar archetype, and state.
- Never render emoji or arbitrary text glyphs as production icons.
- Mirror only genuinely directional icons in RTL; keep universal and object symbols unchanged.
- Provide a deterministic non-emoji fallback only when a platform symbol is unavailable.

### Illustration strategy

- Add `assets/illustrations/{brand,onboarding,missions,skills,states,rewards}` with optimized, transparent or intentionally colored assets.
- Add a typed centralized illustration registry mapping semantic keys to source, aspect ratio, focal behavior, background compatibility, and RTL sensitivity.
- Establish one art direction: warm editorial 3D/paper-cut forms, rounded geometry, subtle texture, expressive objects, no stock characters, no embedded text, and no baked-in UI chrome.
- Use custom hero/story illustrations for the welcome experience, onboarding ready state, Kids Home mission, mission intro/completion, journey worlds, rewards, and key empty states.
- Use code-native decorative shapes and symbol clusters for secondary moments to avoid loading dozens of large bitmaps.
- Render with `expo-image`, `contentFit="contain"`, fixed aspect-ratio shells, and responsive focal positioning.

### Motion system

- Centralize durations: instant 90 ms, quick 160 ms, standard 260 ms, reveal 420 ms, celebration 720 ms.
- Centralize easing: emphasized deceleration for entrances, standard ease for state changes, and restrained springs for tactile controls.
- Shared primitives: fade/slide entrance, press scale, card lift, progress fill, staggered reveal, selection pulse, badge pop, and completion sequence.
- Prefer opacity and transforms. Avoid continuous ambient loops and layout-heavy animation.
- Respect platform reduced-motion preference; replace movement with short opacity transitions when enabled.
- Add centralized haptic helpers for selection, soft impact, success, and warning. Haptics will be sparse and fire only for meaningful interactions.
- Add a no-op, parent-controllable sound-feedback service interface for future optional sounds; no audio files will be scattered in components.

## Reusable component redesign

- `AppText`: mode-aware typography, Arabic-safe leading/alignment, and expanded semantic variants.
- `AppIcon`: centralized cross-platform symbol mapping, selected states, consistent weights, and RTL rules.
- `Button`: primary, secondary, ghost, icon, compact, success, and danger presentations with pressed scale/edge feedback.
- `Card`: base, elevated, outlined, tinted, hero, choice, and insight variants.
- `Screen`: Kids/Parent background variants, decorative atmosphere, responsive gutter, and scroll indicators.
- `ProgressBar`: overall, mission, skill, compact, segmented, and animated variants.
- `Chip`: neutral and skill-colored variants with optional icons.
- `Avatar`: owned character tokens with color, accessory symbol, selected/locked states, and non-emoji rendering.
- `Badge`: collectible medallion, locked silhouette, tier ring, and unlock animation.
- `TextField`: icon slots, focus/error/success states, warm auth treatment, and Arabic alignment.
- `StateView`: contextual loading, empty, error, and offline variants with visual storytelling.
- `SkillWorld`: one source for palette, icon, atmospheric motif, and label.
- `Illustration`: typed registry-backed renderer with aspect-ratio and fallback behavior.
- `MotionPressable`: reusable accessible press animation and haptic coordination.
- `SectionHeader`, `MetricTile`, `InsightCard`, and `NavigationRow` for Parent Mode.

## Screen-by-screen redesign plan

### Entry and authentication

- [ ] Welcome: create a branded split hero with an original life-skills adventure illustration, warm parent entry actions, a real sample mission preview, and privacy reassurance.
- [ ] Sign in: add compact brand art, icon-enhanced fields, calmer form panel, clearer recovery/create-account hierarchy, and keyboard-safe spacing.
- [ ] Sign up: emphasize private parent ownership, soften the enterprise feel, and add a concise trust panel.
- [ ] Forgot password: create a focused recovery state and a designed sent-confirmation state.

### Onboarding

- [ ] Welcome: illustration-led promise and concise “one small adventure at a time” positioning.
- [ ] Parent PIN: trustworthy lock visual, purpose explanation, large digit entry, and privacy cue.
- [ ] Confirm PIN: clear progress and matching feedback.
- [ ] Child name: friendly avatar preview that reacts to the nickname.
- [ ] Age: large age-band cards with readable developmental cues.
- [ ] Avatar: visual avatar grid with selected depth and names, no emoji.
- [ ] Skills: world cards with semantic color, symbol, short description, and multi-select feedback.
- [ ] Goal/Ready: selected avatar plus chosen worlds and a celebratory “journey is ready” summary before launch.
- [ ] Animate step transitions subtly while preserving form state and validation.

### Kids core

- [ ] Kids Home: atmospheric background, personalized top bar, compact XP/level track, one dominant mission hero, world identity, duration/reward metadata, large CTA, and a lightweight thought prompt.
- [ ] Mission Intro: add a distinct intro state before questions with scene art, title, skill, estimated time, XP, short setup, and “Begin adventure.”
- [ ] Mission Player: full-width story composition, compact step progress, large scenario text, tactile answer cards, selection/reaction beat, explanation panel, and safe bottom action.
- [ ] Multiple choice: replace radio styling with illustrated/numbered choice tiles, clear selected state, and animated feedback.
- [ ] Scenario choice: make consequences legible without framing children as simply right/wrong.
- [ ] Ordering: create numbered slots, tactile item movement/tap ordering, and clear undo affordance.
- [ ] Parent activity step: distinguish the “together” moment with warm family styling and completion feedback.
- [ ] Mission Completion: choreograph completion mark, XP count-up, optional badge reveal, reflection message, next action, and restrained celebration.
- [ ] Journey: transform the card list into a responsive vertical path through distinct skill worlds with current/completed/locked landmarks.
- [ ] Skill Detail: create a world header, level trail, progress summary, current capability, and mission availability area.
- [ ] Rewards: collectible cabinet, level crest, earned/locked sections, rich badge medallions, and useful locked requirements.
- [ ] Profile: create a character stage, identity card, level summary, privacy note, and clearly separated Parent Gate action.
- [ ] Parent Gate: calmer grown-up-only visual language, PIN keypad/field clarity, secure reset flow, and obvious route back to Kids Mode.
- [ ] Kids navigation: replace glyphs with selected/unselected symbols, friendly active capsules, correct safe-area height, and hidden mission chrome.

### Parent core

- [ ] Parent Home: concise family header, weekly insight hero, prioritized progress summary, “needs practice” signal, recent evidence, recommended next action, and distinctive Kids Mode entry.
- [ ] Children: explicit selectable profile rows/cards, active-child state, XP/age/skill summary, and future-safe add-child affordance.
- [ ] Progress: skill-colored insight cards, comparable metrics, recent evidence, suggested focus, and non-competitive framing.
- [ ] Activities: actionable family activity cards with skill identity, time, effort, instructions, and completion-ready affordance.
- [ ] Settings: grouped icon rows for account, privacy, language/preferences, feedback architecture, and secure sign-out.
- [ ] Parent navigation: calm native symbols, compact labels, consistent selected state, and responsive five-tab spacing.

### States

- [ ] App startup: branded skeleton/loading composition without spinner-only presentation.
- [ ] Kids mission loading: map/scene assembly motif with reduced-motion fallback.
- [ ] Empty journey/rewards/progress: contextual illustration, specific explanation, and next action where available.
- [ ] Error: calm branded bump state with retry and helpful context.
- [ ] Offline/network: explicit offline state architecture and retry behavior without implying lost progress.
- [ ] Button/card skeletons: reusable parent and kids loading layouts to avoid content jumps.

## Implementation and validation phases

### Phase A — Visual foundation

- [ ] Expand tokens for semantic color, typography, shape, elevation, layout, motion, and skill worlds.
- [ ] Add centralized icon, illustration, haptic, and future sound-feedback architecture.
- [ ] Redesign base components and navigation primitives.
- [ ] Add and optimize the first production illustration set.
- [ ] Remove production emoji/text-glyph icon paths from shared components and data.
- [ ] Pass TypeScript, ESLint, automated tests, Android/web bundle checks, Arabic RTL smoke test, and representative runtime inspection.

### Phase B — Kids core

- [ ] Complete all Kids core screens and mission states listed above.
- [ ] Validate mission scoring/completion, XP, badges, navigation, and Parent Gate regression behavior.
- [ ] Verify small Android, typical Android, large Android, iPhone, and large iPhone layouts.
- [ ] Pass TypeScript, ESLint, tests, bundle checks, icon audit, illustration audit, English LTR, and Arabic RTL.

### Phase C — Parent core

- [ ] Complete Parent Home, Children, Progress, Activities, Settings, and navigation redesigns.
- [ ] Verify dashboard/query behavior, child selection, Kids Mode entry, and sign-out.
- [ ] Pass TypeScript, ESLint, tests, bundle checks, English LTR, and Arabic RTL.

### Phase D — Entry experience

- [ ] Complete Welcome, authentication, onboarding, avatar selection, skill selection, and ready-state redesigns.
- [ ] Verify authentication, validation, onboarding persistence, PIN creation, child creation, and learning-path generation.
- [ ] Pass TypeScript, ESLint, tests, bundle checks, English LTR, and Arabic RTL.

### Phase E — States

- [ ] Complete contextual loading, empty, error, and offline states.
- [ ] Verify no state causes navigation dead ends or content-size jumps.
- [ ] Pass TypeScript, ESLint, tests, bundle checks, English LTR, and Arabic RTL.

### Phase F — Polish

- [ ] Complete micro-interactions, transitions, sparse haptics, reduced-motion handling, and future sound settings architecture.
- [ ] Optimize illustration dimensions and startup loading behavior.
- [ ] Perform the full responsive, icon, illustration, contrast, typography, RTL, motion, and regression audit.
- [ ] Resolve the baseline Expo SQLite web WASM error and verify the final rendered app.

## Final QA checklist

- [ ] No production emoji, arbitrary text glyph, missing symbol, placeholder square, mixed icon weight, or incorrect semantic icon remains.
- [ ] Every illustration has verified aspect ratio, `contentFit`, resolution, clipping, background, theme context, responsive behavior, and RTL behavior.
- [ ] Kids Home communicates ownership, today’s adventure, skill world, excitement, primary action, and progress without heavy reading.
- [ ] Missions follow scenario → decision → reaction → explanation → progress → reward.
- [ ] Parent Home communicates recent activity, improvement, practice need, and next action within seconds.
- [ ] Arabic has correct direction, alignment, numeral/text wrapping, icon order, and no clipped glyphs.
- [ ] All controls meet minimum touch size and have focus/pressed/disabled/loading states.
- [ ] Reduced motion is respected and haptics are not excessive.
- [ ] Authentication, onboarding, child creation, learning paths, scoring, completion, XP, badges, PIN, mode switching, queries, Supabase, RTL, navigation, and tests remain functional.

## Completion record

Implementation status: Phases A–F implemented for the current product surface. The welcome flow, nine-step onboarding, Kids Home, mission intro/player/completion, Journey, Rewards, Profile, skill detail, Parent Home, Children, Progress, Activities, Settings, navigation, and shared states now use the premium system. TypeScript, ESLint, all automated tests, web export, Android bundle export, and the complete fixture happy path pass.

Assets added:

- `assets/illustrations/brand/adventure-hero.jpg`
- `assets/illustrations/missions/money-choice.jpg`
- `assets/illustrations/missions/internet-safety.jpg`
- `assets/illustrations/rewards/mission-complete.jpg`

The generated artwork was resized to 1200 px and converted from 1.2–1.3 MB PNG files to 210–244 KB JPEG files before integration. Superseded PNG copies were removed; originals remain recoverable in the Codex generated-image store.

Temporary production replacements: none. The four integrated illustrations are treated as the first production art set and share one art direction. Future missions currently fall back to the general adventure illustration until dedicated world scenes are commissioned.

Remaining visual debt:

- Add dedicated scene art for the eight skill worlds that currently use the general adventure fallback.
- Expand the completion sequence with a numeric XP count-up and badge detail sheet when product requirements define timing and dismissal behavior.
- Perform final physical-device Arabic QA with native font rendering and screen-reader order; code-level RTL alignment, writing direction, flexible layouts, and symbol semantics are in place.
- Add parent-facing persisted controls when optional sound feedback ships; the centralized service is intentionally disabled today.
