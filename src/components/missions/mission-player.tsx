import { AppIcon } from "@/components/ui/app-icon";
import { AppText } from "@/components/ui/app-text";
import { Button } from "@/components/ui/button";
import {
  CompletionHero,
  type CelebrationType,
} from "@/components/ui/celebration";
import { Chip } from "@/components/ui/chip";
import { SkillIllustration } from "@/components/ui/illustration";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Reveal } from "@/components/ui/reveal";
import { SkillWorldMark, skillIconName } from "@/components/ui/skill-world";
import { LoadingState } from "@/components/ui/states";
import { useChild } from "@/features/children/hooks";
import { useCompleteMission } from "@/features/missions/hooks";
import type { Mission } from "@/features/missions/types";
import { calculateLevel } from "@/features/progress/progress-utils";
import { getSkill } from "@/features/skills/utils";
import { haptics } from "@/services/feedback/haptics";
import { celebrationAudio } from "@/services/feedback/sound";
import { useMissionSessionStore } from "@/stores/mission-session-store";
import { colors, getSkillPalette, radius, spacing } from "@/theme/tokens";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { MultipleChoiceStepView } from "./multiple-choice-step-view";
import { OrderingStepView } from "./ordering-step-view";
import { ParentActivityStepView } from "./parent-activity-step-view";
import { ScenarioChoiceStepView } from "./scenario-choice-step-view";

export function MissionPlayer({
  mission,
  childId,
  onDone,
}: {
  mission: Mission;
  childId: string;
  onDone: () => void;
}) {
  const session = useMissionSessionStore();
  const complete = useCompleteMission();
  const { data: child } = useChild(childId);
  const [result, setResult] = useState<{
    xp: number;
    badge: boolean;
    type: CelebrationType;
    level?: number;
  } | null>(null);
  const [started, setStarted] = useState(false);
  const begin = session.begin;
  useEffect(() => {
    begin(mission.id);
  }, [mission.id, begin]);
  const step =
    mission.steps[Math.min(session.currentStep, mission.steps.length - 1)];
  if (!step) return null;
  const answer = session.answers.find((item) => item.stepId === step.id);
  const answered = Boolean(answer?.optionIds.length);
  async function advance() {
    if (session.currentStep < mission.steps.length - 1) {
      session.next();
      return;
    }
    const response = await complete.mutateAsync({
      childId,
      mission,
      answers: session.answers,
    });
    const nextLevel = calculateLevel(
      (child?.xp ?? 0) + response.completion.xpEarned,
    );
    const leveledUp = nextLevel > calculateLevel(child?.xp ?? 0);
    const badge = response.newBadgeIds.length > 0;
    setResult({
      xp: response.completion.xpEarned,
      badge,
      type: leveledUp
        ? "level-up"
        : badge
          ? "badge-unlock"
          : "mission-complete",
      level: leveledUp ? nextLevel : undefined,
    });
    void (leveledUp
      ? haptics.milestone()
      : badge
        ? haptics.badge()
        : haptics.success());
    void (leveledUp
      ? celebrationAudio.playLevelUp()
      : badge
        ? celebrationAudio.playBadgeUnlocked()
        : celebrationAudio.playMissionComplete());
    session.clear();
  }
  if (result)
    return (
      <Reveal style={styles.complete}>
        <CompletionHero
          skillId={mission.skillId}
          xp={result.xp}
          badge={result.badge}
          type={result.type}
          level={result.level}
        />
        <Reveal delay={760} style={styles.completeAction}>
          <Button
            mode="kids"
            label="Continue journey"
            icon="journey"
            onPress={onDone}
          />
        </Reveal>
      </Reveal>
    );
  if (session.missionId !== mission.id)
    return <LoadingState label="Opening mission…" />;
  if (!started) {
    const skill = getSkill(mission.skillId);
    const palette = getSkillPalette(mission.skillId);
    return (
      <Reveal style={styles.intro}>
        <SkillIllustration
          skillId={mission.skillId}
          accessibilityLabel={`${skill?.title.en ?? "Skill"} mission scene`}
          floating
        />
        <View style={styles.introBody}>
          <View style={styles.introMeta}>
            <SkillWorldMark skillId={mission.skillId} size={44} />
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
            <AppIcon name="star" size={20} color={colors.warning} />
            <AppText variant="label">
              Adventure reward · {mission.xpReward} XP
            </AppText>
          </View>
          <Button
            mode="kids"
            label="Begin adventure"
            icon="play"
            onPress={() => setStarted(true)}
          />
        </View>
      </Reveal>
    );
  }
  return (
    <View style={styles.player}>
      <View style={styles.top}>
        <AppText variant="micro" style={styles.purple}>
          ADVENTURE STEP {session.currentStep + 1} OF {mission.steps.length}
        </AppText>
        <ProgressBar
          value={((session.currentStep + 1) / mission.steps.length) * 100}
          label="Mission step progress"
        />
      </View>
      {step.type === "scenario-choice" ? (
        <ScenarioChoiceStepView
          step={step}
          selectedId={answer?.optionIds[0]}
          onSelect={(id, score) =>
            session.answer({ stepId: step.id, optionIds: [id] }, score)
          }
        />
      ) : null}
      {step.type === "multiple-choice" ? (
        <MultipleChoiceStepView
          step={step}
          selectedIds={answer?.optionIds ?? []}
          onSelect={(ids, score) =>
            session.answer({ stepId: step.id, optionIds: ids }, score)
          }
        />
      ) : null}
      {step.type === "ordering" ? (
        <OrderingStepView
          step={step}
          order={answer?.optionIds ?? []}
          onChange={(ids) =>
            session.answer({ stepId: step.id, optionIds: ids }, 0)
          }
        />
      ) : null}
      {step.type === "parent-activity" ? (
        <ParentActivityStepView
          step={step}
          completed={answered}
          onComplete={() =>
            session.answer({ stepId: step.id, optionIds: ["complete"] }, 1)
          }
        />
      ) : null}
      <Button
        mode="kids"
        label={
          session.currentStep === mission.steps.length - 1
            ? "Finish mission"
            : "Continue"
        }
        disabled={!answered}
        loading={complete.isPending}
        onPress={() => void advance()}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  player: { flex: 1, gap: spacing.xl },
  top: { gap: spacing.sm },
  intro: { flex: 1, gap: spacing.xl },
  introBody: { gap: spacing.lg },
  introMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  reward: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: "#FFF3CD",
    padding: spacing.md,
    borderRadius: radius.md,
    alignSelf: "flex-start",
  },
  complete: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.lg,
    paddingBottom: spacing.xl,
  },
  completeAction: { width: "100%" },
  purple: { color: colors.kids.primary },
  center: { textAlign: "center" },
});
