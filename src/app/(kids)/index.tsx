import { AppIcon } from "@/components/ui/app-icon";
import { AppText } from "@/components/ui/app-text";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { ExplorerProgressCard } from "@/components/ui/explorer-progress-card";
import { SkillIllustration } from "@/components/ui/illustration";
import { Screen } from "@/components/ui/screen";
import { SkillWorldMark, skillIconName } from "@/components/ui/skill-world";
import { EmptyState, LoadingState } from "@/components/ui/states";
import { useChild } from "@/features/children/hooks";
import { useTodayMission } from "@/features/missions/hooks";
import {
  calculateLevel,
  calculateProgressPercent,
} from "@/features/progress/progress-utils";
import { getSkill } from "@/features/skills/utils";
import { useAppStore } from "@/stores/app-store";
import { colors, getSkillPalette, radius, spacing } from "@/theme/tokens";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
export default function KidsHomeScreen() {
  const router = useRouter();
  const childId = useAppStore((state) => state.activeChildId);
  const { data: child, isLoading: childLoading } = useChild(childId);
  const { data: mission, isLoading } = useTodayMission(childId);
  if (childLoading || isLoading)
    return <LoadingState label="Finding today’s adventure…" />;
  if (!child) return <EmptyState />;
  const level = calculateLevel(child.xp);
  const overall = calculateProgressPercent(child.xp);
  const skill = mission ? getSkill(mission.skillId) : null;
  const palette = getSkillPalette(mission?.skillId);
  return (
    <Screen mode="kids" contentStyle={styles.screen}>
      <View style={styles.header}>
        <View style={styles.greeting}>
          <AppText variant="micro" style={styles.eyebrow}>
            TODAY’S ADVENTURE
          </AppText>
          <AppText variant="title">Hey, {child.nickname}!</AppText>
        </View>
        <Avatar
          avatarKey={child.avatarKey}
          nickname={child.nickname}
          size={62}
        />
      </View>
      <ExplorerProgressCard level={level} xp={child.xp} progress={overall} />
      {mission ? (
        <Card
          variant="mission"
          style={[styles.mission, { backgroundColor: palette.surface }]}
        >
          <SkillIllustration
            skillId={mission.skillId}
            accessibilityLabel={`${skill?.title.en ?? "Life skill"} adventure scene`}
            floating
          />
          <View style={styles.missionBody}>
            <View style={styles.meta}>
              <SkillWorldMark skillId={mission.skillId} size={42} />
              <Chip
                label={`${skill?.title.en} · ${mission.estimatedMinutes} min`}
                icon={skillIconName(mission.skillId)}
                color={palette.strong}
                backgroundColor={palette.soft}
              />
            </View>
            <AppText variant="display">{mission.title.en}</AppText>
            <AppText tone="muted">{mission.description.en}</AppText>
            <View style={styles.reward}>
              <AppIcon name="star" size={18} color={colors.warning} />
              <AppText variant="label">Earn {mission.xpReward} XP</AppText>
            </View>
            <Button
              mode="kids"
              label="Start today’s adventure"
              icon="play"
              onPress={() =>
                router.push({
                  pathname: "/(kids)/mission/[id]",
                  params: { id: mission.id },
                })
              }
            />
          </View>
        </Card>
      ) : (
        <EmptyState
          title="All caught up, explorer"
          body="You’ve completed the adventures currently ready for your chosen worlds."
        />
      )}
      <View style={styles.nudge}>
        <View style={styles.nudgeIcon}>
          <AppIcon name="lightbulb" size={24} color={colors.kids.primary} />
        </View>
        <View style={styles.nudgeCopy}>
          <AppText variant="label">Explorer thought</AppText>
          <AppText tone="muted">
            A thoughtful choice starts with noticing what could happen next.
          </AppText>
        </View>
      </View>
    </Screen>
  );
}
const styles = StyleSheet.create({
  screen: { gap: spacing.xl },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.lg,
  },
  greeting: { flex: 1, gap: spacing.xs },
  eyebrow: { color: colors.kids.primary },
  levelCard: { gap: spacing.md, backgroundColor: "rgba(255,255,255,.78)" },
  levelTop: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  levelMark: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#FFF1C9",
    alignItems: "center",
    justifyContent: "center",
  },
  levelCopy: { flex: 1 },
  mission: { padding: 0, overflow: "hidden" },
  missionBody: { padding: spacing.xl, gap: spacing.md },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
    flexWrap: "wrap",
  },
  reward: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: "#FFF7DE",
    borderRadius: radius.md,
    alignSelf: "flex-start",
  },
  nudge: {
    flexDirection: "row",
    gap: spacing.md,
    padding: spacing.lg,
    backgroundColor: "rgba(237,232,255,.8)",
    borderRadius: radius.lg,
  },
  nudgeIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  nudgeCopy: { flex: 1, gap: spacing.xs },
});
