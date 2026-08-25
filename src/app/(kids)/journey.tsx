import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

import { AppText } from "@/components/ui/app-text";
import { Reveal } from "@/components/ui/reveal";
import { Screen } from "@/components/ui/screen";
import { SkillCard } from "@/components/ui/skill-card";
import { EmptyState, LoadingState } from "@/components/ui/states";
import { useDashboard } from "@/features/parent-dashboard/hooks";
import { getSkill } from "@/features/skills/utils";
import { useAppStore } from "@/stores/app-store";
import { getSkillPalette, spacing } from "@/theme/tokens";

export default function JourneyScreen() {
  const router = useRouter();
  const childId = useAppStore((state) => state.activeChildId);
  const { data, isLoading } = useDashboard(childId);
  if (isLoading) return <LoadingState />;
  if (!data) return <EmptyState />;

  return (
    <Screen mode="kids" contentStyle={styles.screen}>
      <View style={styles.header}>
        <AppText variant="micro" style={styles.label}>
          YOUR ADVENTURE MAP
        </AppText>
        <AppText variant="display">Skill worlds</AppText>
        <AppText tone="muted">
          Each thoughtful mission lights up another part of your path.
        </AppText>
      </View>
      <View style={styles.path}>
        {data.progress.map((item, index) => {
          const skill = getSkill(item.skillId);
          const palette = getSkillPalette(item.skillId);
          return (
            <Reveal key={item.skillId} delay={index * 55}>
              <View style={styles.nodeWrap}>
                {index < data.progress.length - 1 ? (
                  <View
                    style={[styles.line, { backgroundColor: palette.soft }]}
                  />
                ) : null}
                <SkillCard
                  skillId={item.skillId}
                  title={skill?.title.en ?? item.skillId}
                  level={item.level}
                  xp={item.xp}
                  progress={item.progressPercent}
                  completedMissions={item.completedMissions}
                  onPress={() =>
                    router.push({
                      pathname: "/(kids)/skill/[id]",
                      params: { id: item.skillId },
                    })
                  }
                />
              </View>
            </Reveal>
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { gap: spacing.xl },
  header: { gap: spacing.sm },
  label: { color: "#5B3FD6" },
  path: { gap: spacing.md },
  nodeWrap: { position: "relative", paddingBottom: spacing.md },
  line: {
    position: "absolute",
    width: 5,
    top: 88,
    bottom: -20,
    left: 28,
    borderRadius: 3,
  },
});
