import { StyleSheet, View } from 'react-native';
import { AppText } from './app-text';
import { Card } from './card';
import { ProgressBar } from './progress-bar';
import { SkillWorldMark } from './skill-world';
import { getSkillPalette, spacing } from '@/theme/tokens';

export function ProgressCard({ skillId, title, level, xp, progress, completedMissions, mode = 'kids' }: { skillId: string; title: string; level: number; xp: number; progress: number; completedMissions: number; mode?: 'kids' | 'parent' }) {
  const palette = getSkillPalette(skillId);
  return <Card variant={mode === 'parent' ? 'parent' : 'progress'} style={[styles.card, { backgroundColor: palette.surface }]}>
    <View style={styles.row}><View style={styles.identity}><SkillWorldMark skillId={skillId} size={52} /><View style={styles.copy}><AppText variant="heading">{title}</AppText><AppText variant="caption" style={{ color: palette.strong }}>LEVEL {level} · {xp} SKILL XP</AppText></View></View><AppText variant="bodyStrong" style={{ color: palette.strong }}>{Math.round(progress)}%</AppText></View>
    <View style={styles.message}><AppText variant="bodyStrong">{completedMissions ? 'A little brighter every mission' : 'Ready for a first step'}</AppText><AppText variant="caption" tone="muted">{completedMissions} {completedMissions === 1 ? 'mission' : 'missions'} practiced</AppText></View>
    <ProgressBar value={progress} label={`${title} progress`} color={palette.base} size={mode === 'kids' ? 'large' : 'regular'} />
  </Card>;
}

const styles = StyleSheet.create({ card: { gap: spacing.lg }, row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.md }, identity: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.md }, copy: { flex: 1, gap: spacing.xs }, message: { gap: spacing.xs } });
