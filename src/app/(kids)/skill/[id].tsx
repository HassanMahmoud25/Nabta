import { AppIcon } from "@/components/ui/app-icon";
import { AppText } from "@/components/ui/app-text";
import { Card } from "@/components/ui/card";
import { SkillIllustration } from "@/components/ui/illustration";
import { ProgressCard } from "@/components/ui/progress-card";
import { Screen } from "@/components/ui/screen";
import { LoadingState } from "@/components/ui/states";
import { useDashboard } from "@/features/parent-dashboard/hooks";
import { getSkill } from "@/features/skills/utils";
import { useAppStore } from "@/stores/app-store";
import { getSkillPalette, spacing } from "@/theme/tokens";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function SkillDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const childId = useAppStore((state) => state.activeChildId);
  const { data, isLoading } = useDashboard(childId);
  if (isLoading) return <LoadingState />;
  const progress = data?.progress.find((item) => item.skillId === id);
  const skill = getSkill(id);
  const palette = getSkillPalette(id);
  return (
    <Screen mode="kids" contentStyle={styles.screen}>
      <Card
        variant="skill"
        style={[styles.hero, { backgroundColor: palette.surface }]}
      >
        <SkillIllustration
          skillId={id}
          accessibilityLabel={`An illustration for ${skill?.title.en ?? id}`}
          floating
        />
        <AppText variant="micro" style={{ color: palette.strong }}>
          SKILL WORLD
        </AppText>
        <AppText variant="display">{skill?.title.en ?? id}</AppText>
        <AppText tone="muted">{skill?.shortDescription.en}</AppText>
      </Card>
      <ProgressCard
        skillId={id}
        title={skill?.title.en ?? id}
        level={progress?.level ?? 1}
        xp={progress?.xp ?? 0}
        progress={progress?.progressPercent ?? 0}
        completedMissions={progress?.completedMissions ?? 0}
      />
      <View style={styles.note}>
        <AppIcon name="journey" size={24} color={palette.strong} />
        <View style={styles.copy}>
          <AppText variant="heading">The path continues</AppText>
          <AppText tone="muted">
            New missions from this world appear on Home when they match your
            learning path.
          </AppText>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { gap: spacing.xl },
  hero: { alignItems: "flex-start", gap: spacing.md, overflow: "hidden" },
  note: { flexDirection: "row", gap: spacing.md, padding: spacing.lg },
  copy: { flex: 1, gap: spacing.xs },
});
