import { StyleSheet, View } from 'react-native';

import { AppIcon } from '@/components/ui/app-icon';
import { AppText } from '@/components/ui/app-text';
import { PopIcon, ScalePressable } from '@/components/ui/motion';
import { Reveal } from '@/components/ui/reveal';
import type { MultipleChoiceStep } from '@/features/missions/types';
import { localize } from '@/i18n/localized';
import { haptics } from '@/services/feedback/haptics';
import { colors, radius, shadows, spacing } from '@/theme/tokens';

type Props = { step: MultipleChoiceStep; selectedIds: string[]; onSelect: (ids: string[], score: number) => void };

export function MultipleChoiceStepView({ step, selectedIds, onSelect }: Props) {
  const selected = step.options.find((option) => selectedIds.includes(option.id));
  return <View style={styles.wrap}><AppText variant="micro" style={styles.label}>YOUR EXPLORER TOOL</AppText><AppText variant="title">{localize(step.prompt)}</AppText><View style={styles.options}>{step.options.map((option, index) => {
    const active = selectedIds.includes(option.id);
    return <ScalePressable accessibilityRole="radio" accessibilityState={{ selected: active }} key={option.id} onPress={() => { void haptics.select(); onSelect([option.id], option.score); }} style={[styles.option, active && styles.selected]}><View style={[styles.letter, active && styles.letterActive]}><AppText variant="label" style={active && styles.white}>{String.fromCharCode(65 + index)}</AppText></View><AppText variant="bodyStrong" style={styles.optionText}>{localize(option.label)}</AppText>{active ? <PopIcon name="check" size={24} color={colors.kids.primary} /> : null}</ScalePressable>;
  })}</View>{selected ? <Reveal key={selected.id}><View style={styles.feedback}><View style={styles.feedbackTitle}><AppIcon name="lightbulb" size={22} color={colors.success} /><AppText variant="bodyStrong">A useful way to think</AppText></View><AppText>{localize(selected.feedback)}</AppText></View></Reveal> : null}</View>;
}

const styles = StyleSheet.create({ wrap: { gap: spacing.lg }, label: { color: colors.kids.primary }, options: { gap: spacing.md }, option: { minHeight: 66, padding: spacing.md, borderRadius: radius.lg, borderWidth: 2, borderColor: colors.border, backgroundColor: colors.surface, flexDirection: 'row', alignItems: 'center', gap: spacing.md, ...shadows.soft }, selected: { borderColor: colors.kids.primary, backgroundColor: colors.kids.lavender }, letter: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceWarm }, letterActive: { backgroundColor: colors.kids.primary }, white: { color: colors.white }, optionText: { flex: 1 }, feedback: { gap: spacing.sm, padding: spacing.lg, borderRadius: radius.lg, backgroundColor: colors.successSoft }, feedbackTitle: { flexDirection: 'row', gap: spacing.sm, alignItems: 'center' } });
