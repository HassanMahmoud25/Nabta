import { StyleSheet, View } from 'react-native';
import { AppIcon } from './app-icon';
import { AppText } from './app-text';
import { Card } from './card';
import { AnimatedNumber } from './motion';
import { ProgressBar } from './progress-bar';
import { colors, radius, spacing } from '@/theme/tokens';

function progressMessage(progress: number) { if (progress >= 80) return 'Your next explorer level is almost here!'; if (progress >= 45) return 'You’re halfway to your next explorer level!'; if (progress > 0) return 'Every adventure makes your path brighter.'; return 'Your next adventure starts the journey.'; }

export function ExplorerProgressCard({ level, xp, progress }: { level: number; xp: number; progress: number }) {
  const safeProgress = Math.min(100, Math.max(0, progress));
  return <Card variant="progress" accessibilityLabel={`Explorer level ${level}, ${xp} XP collected, ${Math.round(safeProgress)} percent to the next level`} style={styles.card}>
    <View style={styles.orb} /><View style={styles.sparkle}><AppIcon name="star" size={16} color={colors.kids.primary} /></View>
    <View style={styles.top}><View style={styles.medal}><AppIcon name="star" size={27} color="#9A651D" /></View><View style={styles.copy}><AppText variant="caption" style={styles.eyebrow}>EXPLORER LEVEL {level}</AppText><AnimatedNumber value={xp} suffix=" XP collected" variant="heading" /></View><View style={styles.percentPill}><AnimatedNumber value={Math.round(safeProgress)} suffix="%" variant="bodyStrong" style={styles.percent} /></View></View>
    <ProgressBar value={safeProgress} label="Overall level progress" color="#F5AE2E" trackColor="rgba(88,70,184,.13)" size="large" />
    <View style={styles.footer}><AppText variant="caption" style={styles.message}>{progressMessage(safeProgress)}</AppText><AppIcon name="journey" size={19} color={colors.kids.primary} /></View>
  </Card>;
}

const styles = StyleSheet.create({ card: { position: 'relative', overflow: 'hidden', gap: spacing.md, padding: spacing.lg, backgroundColor: '#FFF9E9', borderColor: 'rgba(240,182,75,.3)' }, orb: { position: 'absolute', width: 132, height: 132, borderRadius: 66, top: -78, right: -42, backgroundColor: 'rgba(237,232,255,.72)' }, sparkle: { position: 'absolute', top: spacing.md, right: spacing.lg, opacity: .34 }, top: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: 'transparent' }, medal: { width: 58, height: 58, borderRadius: 29, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFE8A8', borderWidth: 3, borderColor: 'rgba(255,255,255,.9)' }, copy: { flex: 1, gap: spacing.xxs, backgroundColor: 'transparent' }, eyebrow: { color: '#8A5B10' }, percentPill: { minWidth: 54, alignItems: 'center', paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: radius.pill, backgroundColor: colors.kids.lavender }, percent: { color: colors.kids.navy }, footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md }, message: { flex: 1, color: colors.inkSoft } });
