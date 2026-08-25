import { AppText } from "@/components/ui/app-text";
import { Button } from "@/components/ui/button";
import type { ParentActivityStep } from "@/features/missions/types";
import { localize } from "@/i18n/localized";
import { colors, radius, spacing } from "@/theme/tokens";
import { StyleSheet, View } from "react-native";
export function ParentActivityStepView({
  step,
  completed,
  onComplete,
}: {
  step: ParentActivityStep;
  completed: boolean;
  onComplete: () => void;
}) {
  return (
    <View style={styles.wrap}>
      <AppText variant="title">{localize(step.prompt)}</AppText>
      <View style={styles.note}>
        <AppText variant="heading">Try this together</AppText>
        <AppText>{localize(step.instructions)}</AppText>
      </View>
      <Button
        mode="kids"
        variant={completed ? "secondary" : "primary"}
        label={completed ? "✓ Done together" : localize(step.completionLabel)}
        onPress={onComplete}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  wrap: { gap: spacing.xl },
  note: {
    gap: spacing.md,
    padding: spacing.xl,
    borderRadius: radius.lg,
    backgroundColor: colors.kids.lavender,
  },
});
