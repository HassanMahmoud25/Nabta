import { StyleSheet, View } from 'react-native';
import { AppIcon } from './app-icon';
import { AppText } from './app-text';
import { InteractiveCard } from './card';
import { ProgressBar } from './progress-bar';
import { SkillWorldMark, skillIconName } from './skill-world';
import { getSkillPalette, radius, spacing } from '@/theme/tokens';

type Props = { skillId: string; title: string; level: number; xp: number; progress: number; completedMissions: number; onPress: () => void };

export function SkillCard({ skillId, title, level, xp, progress, completedMissions, onPress }: Props) {
  const palette = getSkillPalette(skillId); const remaining = Math.max(1, Math.ceil((100 - progress) / 20));
  return <InteractiveCard accessibilityRole="button" accessibilityLabel={`${title}, level ${level}, ${Math.round(progress)} percent complete`} onPress={onPress} style={[styles.card, { backgroundColor: palette.surface }]}>
    <View style={[styles.orb, styles.orbLarge, styles.pointerNone, { backgroundColor: palette.soft }]} /><View style={[styles.orb, styles.orbSmall, styles.pointerNone, { backgroundColor: palette.base }]} />
    <View style={styles.top}><SkillWorldMark skillId={skillId} size={68} /><View style={[styles.worldChip, { backgroundColor: palette.soft }]}><AppIcon name={skillIconName(skillId)} size={17} color={palette.strong} /><AppText variant="micro" style={{ color: palette.strong }}>SKILL WORLD</AppText></View></View>
    <View style={styles.copy}><AppText variant="heading">{title}</AppText><AppText variant="label" style={{ color: palette.strong }}>Level {level} · {xp} XP</AppText></View>
    <View style={styles.progressCopy}><AppText variant="bodyStrong">{completedMissions ? "You’re getting closer!" : 'Your first adventure is waiting'}</AppText><AppText variant="caption" tone="muted">{remaining} {remaining === 1 ? 'mission' : 'missions'} to the next milestone</AppText></View>
    <ProgressBar value={progress} label={`${title} progress`} color={palette.base} size="large" />
    <View style={styles.footer}><AppText variant="caption" style={{ color: palette.strong }}>{Math.round(progress)}% explored</AppText><AppIcon name="chevron" size={21} color={palette.strong} /></View>
  </InteractiveCard>;
}

const styles = StyleSheet.create({ card: { position: 'relative', overflow: 'hidden', gap: spacing.md, borderRadius: radius.hero }, orb: { position: 'absolute', borderRadius: radius.pill, opacity: .42 }, pointerNone: { pointerEvents: 'none' }, orbLarge: { width: 150, height: 150, top: -72, right: -52 }, orbSmall: { width: 28, height: 28, top: 82, right: 30, opacity: .16 }, top: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: spacing.md }, worldChip: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: radius.pill }, copy: { gap: spacing.xs }, progressCopy: { gap: spacing.xxs }, footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' } });
