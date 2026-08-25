import { ChildSelector } from "@/components/parent/child-selector";
import { ParentHeader } from "@/components/parent/parent-header";
import { AppIcon } from "@/components/ui/app-icon";
import { AppText } from "@/components/ui/app-text";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Screen } from "@/components/ui/screen";
import { SkillWorldMark } from "@/components/ui/skill-world";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/states";
import { offlineActivities } from "@/data/offline-activities";
import { useAuth } from "@/features/auth/auth-provider";
import { useReconciledChildren } from "@/features/children/hooks";
import type { ChildProfile } from "@/features/children/types";
import { useDashboard } from "@/features/parent-dashboard/hooks";
import { getSkill } from "@/features/skills/utils";
import { analytics } from "@/services/analytics/analytics";
import { useAppStore } from "@/stores/app-store";
import { colors, getSkillPalette, radius, spacing } from "@/theme/tokens";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

export default function ParentDashboardScreen() {
  const { session } = useAuth();
  const router = useRouter();
  const { data, isLoading, error, refetch, activeChildId } =
    useReconciledChildren(session?.parentId);
  const setActiveChild = useAppStore((state) => state.setActiveChild);
  const enterKidsMode = useAppStore((state) => state.enterKidsMode);
  const [showKidsPicker, setShowKidsPicker] = useState(false);

  if (isLoading)
    return <LoadingState label="Preparing your family dashboard…" />;
  if (error)
    return (
      <ErrorState
        message="We couldn’t load your children."
        onRetry={() => void refetch()}
      />
    );
  const children = data ?? [];
  if (!children.length) {
    return (
      <Screen contentStyle={styles.empty}>
        <View style={styles.emptyIcon}>
          <AppIcon name="children" size={44} color={colors.parent.primary} />
        </View>
        <AppText variant="display" style={styles.center}>
          Create your first learning journey
        </AppText>
        <AppText tone="muted" style={styles.center}>
          Add a child profile to unlock personalized missions, progress, and
          Kids Mode.
        </AppText>
        <Button
          label="Add Child"
          icon="add"
          onPress={() => router.push("/(parent)/child-form")}
          style={styles.full}
        />
      </Screen>
    );
  }
  if (!activeChildId)
    return <LoadingState label="Choosing your family profile…" />;
  const child = children.find((item) => item.id === activeChildId);
  if (!child) return <LoadingState label="Refreshing your family profiles…" />;

  function selectChild(next: ChildProfile) {
    if (next.id === activeChildId) return;
    setActiveChild(next.id, session?.parentId);
    analytics.track("child_switched", { childId: next.id });
  }
  function startKidsMode(next: ChildProfile) {
    enterKidsMode(next.id, session?.parentId);
    analytics.track("kids_mode_child_selected", { childId: next.id });
    analytics.track("kids_mode_started", { childId: next.id });
    router.replace("/(kids)");
  }
  function chooseKidsMode() {
    if (children.length === 1) startKidsMode(children[0]!);
    else setShowKidsPicker(true);
  }

  if (showKidsPicker)
    return (
      <KidsModePicker
        profiles={children}
        onSelect={startKidsMode}
        onCancel={() => setShowKidsPicker(false)}
      />
    );
  return (
    <DashboardContent
      childId={child.id}
      profiles={children}
      onSelect={selectChild}
      onAdd={() => router.push("/(parent)/child-form")}
      onKids={chooseKidsMode}
    />
  );
}

function KidsModePicker({
  profiles,
  onSelect,
  onCancel,
}: {
  profiles: ChildProfile[];
  onSelect: (child: ChildProfile) => void;
  onCancel: () => void;
}) {
  const children = profiles;
  return (
    <Screen contentStyle={styles.pickerScreen}>
      <View style={styles.pickerHeader}>
        <View style={styles.kidsMark}>
          <AppIcon name="play" size={30} color={colors.kids.navy} />
        </View>
        <AppText variant="micro" style={styles.kidsLabel}>
          KIDS MODE
        </AppText>
        <AppText variant="display" style={styles.center}>
          Who’s learning today?
        </AppText>
        <AppText tone="muted" style={styles.center}>
          Choose a profile so missions, XP, badges, and progress go to the right
          explorer.
        </AppText>
      </View>
      <View style={styles.pickerGrid}>
        {children.map((child) => (
          <Pressable
            key={child.id}
            accessibilityRole="button"
            accessibilityLabel={`Start Kids Mode for ${child.nickname}`}
            onPress={() => onSelect(child)}
            style={({ pressed }) => [
              styles.kidChoice,
              pressed && styles.kidChoicePressed,
            ]}
          >
            <Avatar
              avatarKey={child.avatarKey}
              nickname={child.nickname}
              size={88}
              selected
            />
            <AppText variant="heading">{child.nickname}</AppText>
            <AppText variant="caption" tone="muted">
              Ages {child.ageBand} · {child.xp} XP
            </AppText>
            <View style={styles.playPill}>
              <AppIcon name="play" size={18} color={colors.white} />
              <AppText variant="label" tone="inverse">
                Let’s go
              </AppText>
            </View>
          </Pressable>
        ))}
      </View>
      <Button
        label="Back to Parent Home"
        variant="secondary"
        onPress={onCancel}
      />
    </Screen>
  );
}

function DashboardContent({
  childId,
  profiles,
  onSelect,
  onAdd,
  onKids,
}: {
  childId: string;
  profiles: ChildProfile[];
  onSelect: (child: ChildProfile) => void;
  onAdd: () => void;
  onKids: () => void;
}) {
  const { data, isLoading, error, refetch } = useDashboard(childId);
  const switchingToChildId = useAppStore((state) => state.switchingToChildId);
  const finishChildSwitch = useAppStore((state) => state.finishChildSwitch);
  useEffect(() => {
    if (data?.child.id === childId) finishChildSwitch();
  }, [childId, data?.child.id, finishChildSwitch]);
  if (isLoading || switchingToChildId === childId)
    return <LoadingState label="Switching child profile…" />;
  if (error)
    return (
      <ErrorState
        message="We couldn’t build this dashboard."
        onRetry={() => void refetch()}
      />
    );
  if (!data) return <EmptyState />;
  const activity =
    offlineActivities.find(
      (item) =>
        item.ageBands.includes(data.child.ageBand) &&
        data.child.selectedSkills.includes(item.skillId),
    ) ?? offlineActivities[0];
  const focus = [...data.progress].sort(
    (a, b) => a.progressPercent - b.progressPercent,
  )[0];
  const strongest = [...data.progress].sort(
    (a, b) => b.progressPercent - a.progressPercent,
  )[0];
  return (
    <Screen contentStyle={styles.screen}>
      <ParentHeader child={data.child} />
      <ChildSelector
        profiles={profiles}
        activeChildId={childId}
        onSelect={onSelect}
        onAdd={onAdd}
      />
      <Card variant="hero" style={styles.hero}>
        <View style={styles.heroTop}>
          <View style={styles.heroIcon}>
            <AppIcon
              name={data.weeklyMissions ? "progress" : "journey"}
              size={30}
              color={colors.parent.primary}
            />
          </View>
          <AppText variant="micro" style={styles.accent}>
            THIS WEEK AT A GLANCE
          </AppText>
        </View>
        <AppText variant="title">
          {data.weeklyMissions === 0
            ? "Ready for a fresh start"
            : `${data.weeklyMissions} thoughtful mission${data.weeklyMissions === 1 ? "" : "s"} completed`}
        </AppText>
        <AppText tone="muted">
          {strongest
            ? `${getSkill(strongest.skillId)?.title.en} is currently the brightest skill world.`
            : "One small adventure is enough to begin."}
        </AppText>
        <Button label="Open Kids Mode" icon="play" onPress={onKids} />
      </Card>
      <View style={styles.metrics}>
        <Card variant="flat" style={styles.metric}>
          <AppIcon name="star" size={22} color={colors.warning} />
          <AppText variant="title">{data.totalXp}</AppText>
          <AppText variant="caption" tone="muted">
            TOTAL XP
          </AppText>
        </Card>
        <Card variant="flat" style={styles.metric}>
          <AppIcon name="check" size={22} color={colors.success} />
          <AppText variant="title">{data.recentMissions.length}</AppText>
          <AppText variant="caption" tone="muted">
            RECENT MISSIONS
          </AppText>
        </Card>
      </View>
      {focus ? (
        <Card variant="outlined" style={styles.insight}>
          <View style={styles.insightTop}>
            <SkillWorldMark skillId={focus.skillId} size={48} />
            <View style={styles.insightCopy}>
              <AppText variant="micro" style={styles.accent}>
                PRACTICE NEXT
              </AppText>
              <AppText variant="heading">
                {getSkill(focus.skillId)?.title.en}
              </AppText>
            </View>
          </View>
          <AppText tone="muted">
            A little more practice here will keep {data.child.nickname}’s
            learning path balanced.
          </AppText>
          <ProgressBar
            value={focus.progressPercent}
            label={`${focus.skillId} progress`}
            color={getSkillPalette(focus.skillId).base}
          />
        </Card>
      ) : null}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <AppText variant="heading">Skill progress</AppText>
          <AppText variant="caption" tone="muted">
            LEVELS, NOT RANKINGS
          </AppText>
        </View>
        {data.progress.map((item) => (
          <View key={item.skillId} style={styles.progressRow}>
            <View style={styles.row}>
              <View style={styles.skillName}>
                <SkillWorldMark skillId={item.skillId} size={34} />
                <AppText variant="bodyStrong">
                  {getSkill(item.skillId)?.title.en ?? item.skillId}
                </AppText>
              </View>
              <AppText variant="caption" tone="muted">
                Level {item.level}
              </AppText>
            </View>
            <ProgressBar
              value={item.progressPercent}
              label={`${item.skillId} progress`}
              color={getSkillPalette(item.skillId).base}
              size="compact"
            />
          </View>
        ))}
      </View>
      {activity ? (
        <Card style={styles.activity}>
          <View style={styles.activityIcon}>
            <AppIcon
              name="activities"
              size={28}
              color={getSkillPalette(activity.skillId).strong}
            />
          </View>
          <View style={styles.activityCopy}>
            <AppText variant="micro" tone="muted">
              TRY TOGETHER · {activity.minutes} MIN
            </AppText>
            <AppText variant="heading">{activity.title.en}</AppText>
            <AppText tone="muted">{activity.instructions.en}</AppText>
          </View>
        </Card>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { gap: spacing.xl },
  empty: { alignItems: "center", justifyContent: "center", gap: spacing.lg },
  emptyIcon: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.parent.soft,
    alignItems: "center",
    justifyContent: "center",
  },
  center: { textAlign: "center" },
  full: { width: "100%" },
  hero: { gap: spacing.lg, backgroundColor: colors.parent.soft },
  heroTop: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  heroIcon: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  accent: { color: colors.parent.primary },
  metrics: { flexDirection: "row", gap: spacing.md },
  metric: { flex: 1, gap: spacing.xs },
  insight: { gap: spacing.md },
  insightTop: { flexDirection: "row", gap: spacing.md, alignItems: "center" },
  insightCopy: { flex: 1, gap: spacing.xs },
  section: { gap: spacing.lg },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    gap: spacing.md,
  },
  progressRow: { gap: spacing.sm },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  skillName: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  activity: { flexDirection: "row", gap: spacing.lg, alignItems: "flex-start" },
  activityIcon: {
    width: 54,
    height: 54,
    borderRadius: radius.md,
    backgroundColor: colors.kids.lavender,
    alignItems: "center",
    justifyContent: "center",
  },
  activityCopy: { flex: 1, gap: spacing.xs },
  pickerScreen: { gap: spacing.xl, justifyContent: "center" },
  pickerHeader: { alignItems: "center", gap: spacing.sm },
  kidsMark: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: colors.kids.sun,
    alignItems: "center",
    justifyContent: "center",
  },
  kidsLabel: { color: colors.kids.primary },
  pickerGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md },
  kidChoice: {
    flexGrow: 1,
    width: "46%",
    minWidth: 145,
    alignItems: "center",
    gap: spacing.sm,
    padding: spacing.xl,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.kids.lavender,
    borderRadius: radius.hero,
  },
  kidChoicePressed: {
    transform: [{ scale: 0.98 }],
    borderColor: colors.kids.primary,
  },
  playPill: {
    marginTop: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: colors.kids.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
  },
});
