import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, ReduceMotion, ZoomIn, useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withSequence, withSpring, withTiming } from 'react-native-reanimated';

import { AppIcon } from './app-icon';
import { AppText } from './app-text';
import { Card } from './card';
import { SkillIllustration } from './illustration';
import { AnimatedNumber } from './motion';
import { motion } from '@/theme/motion';
import { colors, getSkillPalette, radius, spacing } from '@/theme/tokens';

export type CelebrationType = 'mission-complete' | 'badge-unlock' | 'level-up' | 'skill-complete';
const particleColors = [colors.kids.sun, colors.kids.coral, colors.kids.sky, colors.kids.mint, '#A58AE4'];
const particleData = Array.from({ length: 22 }, (_, index) => ({ x: 7 + ((index * 37) % 87), drift: ((index * 29) % 80) - 40, delay: (index % 6) * 45, color: particleColors[index % particleColors.length] }));

function Particle({ index, strong }: { index: number; strong: boolean }) {
  const item = particleData[index]!; const progress = useSharedValue(0);
  useEffect(() => { progress.value = withDelay(item.delay, withTiming(1, { duration: strong ? 1250 : 950, easing: motion.easing.standard, reduceMotion: ReduceMotion.System })); }, [item.delay, progress, strong]);
  const style = useAnimatedStyle(() => ({ opacity: progress.value < .08 ? progress.value * 12 : 1 - progress.value, transform: [{ translateX: item.drift * progress.value }, { translateY: -26 + progress.value * (strong ? 330 : 250) }, { rotate: `${progress.value * (index % 2 ? 420 : -360)}deg` }, { scale: .5 + Math.sin(progress.value * Math.PI) * .7 }] }));
  return <Animated.View style={[styles.particle, { left: `${item.x}%`, backgroundColor: item.color, borderRadius: index % 3 ? 3 : radius.pill }, style]} />;
}

export function CelebrationEffect({ type = 'mission-complete' }: { type?: CelebrationType }) {
  const reduced = useReducedMotion(); if (reduced) return null;
  const strong = type === 'level-up' || type === 'skill-complete'; const count = strong ? 22 : type === 'badge-unlock' ? 12 : 16;
  return <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={[StyleSheet.absoluteFill, styles.pointerNone]}>{particleData.slice(0, count).map((_, index) => <Particle key={index} index={index} strong={strong} />)}</View>;
}

export function AnimatedXP({ value }: { value: number }) {
  return <View accessibilityLabel={`Plus ${value} experience points`} style={styles.xp}><AppIcon name="star" size={25} color={colors.warning} /><AnimatedNumber value={value} suffix=" XP" variant="title" style={styles.xpText} /></View>;
}

export function BadgeReveal() {
  return <Animated.View entering={ZoomIn.springify().damping(15).delay(620).reduceMotion(ReduceMotion.System)} style={styles.badge}><View style={styles.badgeMedallion}><AppIcon name="rewards" size={34} color={colors.warning} /></View><View style={styles.badgeCopy}><AppText variant="micro" style={styles.badgeLabel}>NEW BADGE UNLOCKED!</AppText><AppText variant="bodyStrong">A new memory joined your collection</AppText></View></Animated.View>;
}

export function CompletionHero({ skillId, xp, badge = false, type = badge ? 'badge-unlock' : 'mission-complete', level }: { skillId: string; xp: number; badge?: boolean; type?: CelebrationType; level?: number }) {
  const palette = getSkillPalette(skillId); const scale = useSharedValue(.78);
  useEffect(() => { scale.value = withSequence(withSpring(1.04, motion.spring), withSpring(1, motion.spring)); }, [scale]);
  const artStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const title = type === 'skill-complete' ? 'You did it!' : type === 'level-up' ? 'Level up!' : 'Mission complete!';
  return <Card variant="achievement" style={[styles.completion, { backgroundColor: palette.surface }]}>
    <CelebrationEffect type={type} />
    <Animated.View entering={FadeIn.duration(260).reduceMotion(ReduceMotion.System)} style={[styles.art, artStyle]}><SkillIllustration skillId={skillId} variant="completed" accessibilityLabel={`${title} celebration for this skill`} style={styles.illustration} /></Animated.View>
    <Animated.View entering={ZoomIn.delay(120).springify().damping(16).reduceMotion(ReduceMotion.System)} style={[styles.check, { backgroundColor: palette.soft }]}><AppIcon name="check" size={34} color={palette.strong} /></Animated.View>
    <AppText variant="micro" style={{ color: palette.strong }}>ADVENTURE ACHIEVEMENT</AppText><AppText variant="display" style={styles.center}>{title}</AppText>{type === 'level-up' && level ? <AppText variant="heading" style={{ color: palette.strong }}>Welcome to Explorer Level {level}</AppText> : null}
    <AppText tone="muted" style={styles.center}>You paused, thought it through, and made the choice your own.</AppText>
    <AnimatedXP value={xp} />{badge ? <BadgeReveal /> : null}
  </Card>;
}

const styles = StyleSheet.create({ pointerNone: { pointerEvents: 'none' }, particle: { position: 'absolute', top: -12, width: 9, height: 14 }, xp: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderRadius: radius.pill, backgroundColor: '#FFF2C8' }, xpText: { color: '#8A5B10' }, badge: { width: '100%', flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: '#FFF8E3', borderWidth: 1, borderColor: '#F6D47A', padding: spacing.md, borderRadius: radius.lg }, badgeMedallion: { width: 58, height: 58, borderRadius: 29, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF0BD', borderWidth: 4, borderColor: '#F6D47A' }, badgeCopy: { flex: 1, gap: spacing.xs }, badgeLabel: { color: '#8A5B10' }, completion: { width: '100%', alignItems: 'center', gap: spacing.md, overflow: 'hidden' }, art: { width: '100%' }, illustration: { maxHeight: 225 }, check: { width: 66, height: 66, borderRadius: 33, marginTop: -50, alignItems: 'center', justifyContent: 'center', borderWidth: 4, borderColor: colors.white }, center: { textAlign: 'center', maxWidth: 440 } });
