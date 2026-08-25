# Nabta card redesign plan

## Audit snapshot

The app had a sound structural base, but most card-like surfaces were assembled from the same white/tinted rounded rectangle, `radius.lg`, border, and shadow recipe. This made semantically different moments read too similarly.

| Area                       | Existing card-like UI                          | Main issue                                                            | Design-system direction                                                                      |
| -------------------------- | ---------------------------------------------- | --------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Kids Home                  | explorer level, today's mission, thought nudge | level and mission shared generic surface language                     | `progress` for level; illustrated `mission` hero; calm supporting nudge                      |
| Journey                    | skill progress nodes                           | repeated hero cards behaved like rows                                 | `SkillCard` with a skill world, decoration, level, XP, milestone copy, and animated progress |
| Skill details              | skill hero and progress summary                | useful information but little distinction between world and analytics | illustrated `skill` hero plus friendly `ProgressCard`                                        |
| Mission player             | intro, scenario, answer, ordering, feedback    | answer cards duplicated hard borders/shadows                          | shared `InteractiveCard` press depth and consistent selected treatment                       |
| Completion                 | illustration, XP, badge notice                 | content was centered but not coordinated as an achievement sequence   | `CompletionHero`, `CelebrationEffect`, `AnimatedXP`, and `BadgeReveal`                       |
| Rewards                    | explorer crest, badges, empty shelf            | badge and empty surfaces did not share achievement language           | `achievement` surface with medallion depth and focused sparkle                               |
| Kids profile               | privacy note                                   | same generic flat card as unrelated content                           | calm `default` supporting card                                                               |
| Parent dashboard           | weekly hero, metrics, insight, activity        | hero/metrics/insight reused flat, outlined, and elevated surfaces     | calm `parent` cards with contextual tint and restrained depth                                |
| Parent progress            | skill rows                                     | looked like analytics widgets                                         | `ProgressCard` with skill identity and human milestone copy                                  |
| Child profiles             | profile rows, entitlement notice               | selected state depended mostly on background color                    | `parent` surface with avatar hierarchy and selected highlight                                |
| Offline activities         | activity rows                                  | repeated outlined cards                                               | `parent` surface tinted by the related skill                                                 |
| Forms/settings             | grouped sections and rows                      | many outlined containers carried equal emphasis                       | calm `parent` grouping; interactive rows remain visibly actionable                           |
| Empty/loading/error states | large uncontained state blocks                 | disconnected from the card family                                     | `default`/`achievement` contained state surface where appropriate                            |

## Shared system

The semantic variants are:

- `default`: quiet supporting content.
- `skill`: playful, large-radius skill-world surface.
- `progress`: cleaner, readable progress and milestone surface.
- `mission`: high-emphasis illustrated adventure hero.
- `achievement`: decorative reward or completion surface.
- `parent`: calm, warm, low-to-medium emphasis.
- `interactive`: touchable surface with spring press depth.

Legacy names (`elevated`, `outlined`, `flat`, `hero`, `tinted`) remain aliases during migration so presentation work does not destabilize product logic.

## Visual rules

- Use skill palettes for identity, not arbitrary screen-specific colors.
- Keep shadows diffused and pair them with a faint highlight/border instead of heavy elevation.
- Skill and mission cards may use layered circles, sparkles, or world marks. Parent surfaces remain restrained.
- Prefer one hero per screen. Supporting cards must be quieter.
- Press feedback scales to about `0.98` and reduces perceived depth with a system-aware spring.
- Progress always has text, a level/milestone cue, and an accessible animated bar.

## Celebration hierarchy

- Mission complete: brief confetti, success haptic, short sound, XP count-up.
- Badge unlock: the mission effect plus a delayed focused badge reveal.
- Level up: stronger radial particles and level reveal support.
- Skill complete: strongest but still short fireworks-style burst and skill-specific completion art.

Effects render a small fixed particle set, animate only opacity/transforms, stop automatically, and collapse to the final readable state when reduced motion is enabled. Sound effects are centralized, opt-in, persisted, and triggered from the completion event rather than render.

## Verification checklist

- Kids Home, Journey, Skill Details, mission intro/answers/completion, Rewards, Parent Dashboard, Parent Progress, Children, and Activities use the intended hierarchy.
- English and Arabic layouts wrap without fixed text widths; directional icons are kept non-semantic.
- Completion remains understandable with motion and sound disabled.
- Celebration audio plays once per completion event and players are released.
- Particles stop and do not block touches or readability.
- TypeScript, lint, tests, and Expo dependency validation pass.
