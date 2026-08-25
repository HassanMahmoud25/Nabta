import { AppIcon } from "@/components/ui/app-icon";
import { AppText } from "@/components/ui/app-text";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Illustration } from "@/components/ui/illustration";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Reveal } from "@/components/ui/reveal";
import { Screen } from "@/components/ui/screen";
import { SkillWorldMark } from "@/components/ui/skill-world";
import { TextField } from "@/components/ui/text-field";
import { skills } from "@/data/skills";
import { useAuth } from "@/features/auth/auth-provider";
import { childrenService } from "@/features/children/children-service";
import { parentPinService } from "@/features/onboarding/pin-service";
import { nicknameSchema, pinSchema } from "@/features/onboarding/schemas";
import { queryKeys } from "@/services/api/query-keys";
import { storage } from "@/services/storage/local-storage";
import { useAppStore } from "@/stores/app-store";
import { colors, radius, spacing } from "@/theme/tokens";
import type { AgeBand } from "@/types/common";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

type Draft = {
  step: number;
  pin: string;
  nickname: string;
  ageBand: AgeBand;
  avatarKey: string;
  selectedSkills: string[];
  goals: string[];
};
const defaults: Draft = {
  step: 0,
  pin: "",
  nickname: "",
  ageBand: "7-9",
  avatarKey: "explorer",
  selectedSkills: ["money", "internet-safety", "responsibility"],
  goals: ["confidence"],
};
const ages: AgeBand[] = ["4-6", "7-9", "10-12"];
const avatars = ["explorer", "astronaut", "inventor", "artist"];

export default function OnboardingScreen() {
  const { session } = useAuth();
  const router = useRouter();
  const setActiveChild = useAppStore((state) => state.setActiveChild);
  const queryClient = useQueryClient();
  const draftKey = `nabta.onboarding.${session?.parentId ?? "unknown"}`;
  const [draft, setDraft] = useState<Draft>(
    () => storage.get<Draft>(draftKey) ?? defaults,
  );
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  function update(values: Partial<Draft>) {
    const next = { ...draft, ...values };
    setDraft(next);
    storage.set(draftKey, next);
    setError("");
  }
  async function next() {
    if (draft.step === 1) {
      const valid = pinSchema.safeParse(draft.pin);
      if (!valid.success)
        return setError(valid.error.issues[0]?.message ?? "Enter four digits.");
    }
    if (draft.step === 2 && confirmation !== draft.pin)
      return setError("The PINs do not match.");
    if (draft.step === 3) {
      const valid = nicknameSchema.safeParse(draft.nickname);
      if (!valid.success)
        return setError(
          valid.error.issues[0]?.message ?? "Check the nickname.",
        );
    }
    if (draft.step === 6 && draft.selectedSkills.length === 0)
      return setError("Choose at least one skill.");
    if (draft.step < 8) return update({ step: draft.step + 1 });
    if (!session) return;
    setSaving(true);
    try {
      await parentPinService.create(session.parentId, draft.pin);
      const child = await childrenService.create({
        parentId: session.parentId,
        nickname: draft.nickname.trim(),
        ageBand: draft.ageBand,
        avatarKey: draft.avatarKey,
        selectedSkills: draft.selectedSkills,
        goals: draft.goals,
      });
      storage.remove(draftKey);
      setActiveChild(child.id, session.parentId);
      await queryClient.invalidateQueries({
        queryKey: queryKeys.children(session.parentId),
      });
      router.replace("/(parent)");
    } finally {
      setSaving(false);
    }
  }
  const titles = [
    "Welcome to Nabta",
    "Create your Parent PIN",
    "Confirm your PIN",
    "What should we call your child?",
    "Choose an age band",
    "Choose an avatar",
    "Pick skills to practice",
    "Choose a primary goal",
    `${draft.nickname || "Your child"}’s journey is ready!`,
  ];
  return (
    <Screen safeBottom contentStyle={styles.screen}>
      <ProgressBar
        value={((draft.step + 1) / 9) * 100}
        label={`Onboarding step ${draft.step + 1} of 9`}
        color={colors.parent.primary}
      />
      <View style={styles.header}>
        <AppText variant="micro" style={styles.step}>
          STEP {draft.step + 1} OF 9
        </AppText>
        <AppText variant="title">{titles[draft.step]}</AppText>
      </View>
      <Reveal key={draft.step}>
        <Card style={styles.content}>
          {draft.step === 0 ? (
            <>
              <Illustration
                name="adventure"
                accessibilityLabel="An explorer begins a journey through everyday skills"
              />
              <AppText variant="heading">
                Real-life skills. One small adventure at a time.
              </AppText>
              <AppText tone="muted">
                Create a private child profile, choose useful skill worlds, and
                Nabta will shape a thoughtful learning path.
              </AppText>
            </>
          ) : null}
          {draft.step === 1 ? (
            <>
              <AppText tone="muted">
                This PIN protects the way back from Kids Mode. It is not your
                account password.
              </AppText>
              <TextField
                label="4-digit PIN"
                value={draft.pin}
                onChangeText={(pin) =>
                  update({ pin: pin.replace(/\D/g, "").slice(0, 4) })
                }
                keyboardType="number-pad"
                secureTextEntry
                maxLength={4}
              />
            </>
          ) : null}
          {draft.step === 2 ? (
            <TextField
              label="Confirm PIN"
              value={confirmation}
              onChangeText={(value) => {
                setConfirmation(value.replace(/\D/g, "").slice(0, 4));
                setError("");
              }}
              keyboardType="number-pad"
              secureTextEntry
              maxLength={4}
            />
          ) : null}
          {draft.step === 3 ? (
            <>
              <AppText tone="muted">
                Use a nickname only—no surname or exact birth date needed.
              </AppText>
              <TextField
                label="Nickname"
                value={draft.nickname}
                onChangeText={(nickname) => update({ nickname })}
                autoCapitalize="words"
                maxLength={20}
              />
            </>
          ) : null}
          {draft.step === 4 ? (
            <ChoiceGrid
              values={ages}
              selected={[draft.ageBand]}
              label={(item) => `Ages ${item}`}
              onPress={(ageBand) => update({ ageBand })}
            />
          ) : null}
          {draft.step === 5 ? (
            <View style={styles.avatarGrid}>
              {avatars.map((key) => (
                <Pressable
                  key={key}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: draft.avatarKey === key }}
                  onPress={() => update({ avatarKey: key })}
                  style={[
                    styles.avatarChoice,
                    draft.avatarKey === key && styles.choiceActive,
                  ]}
                >
                  <Avatar
                    avatarKey={key}
                    nickname={key}
                    size={72}
                    selected={draft.avatarKey === key}
                  />
                  <AppText variant="label">
                    {key[0]?.toUpperCase()}
                    {key.slice(1)}
                  </AppText>
                  {draft.avatarKey === key ? (
                    <AppIcon
                      name="check"
                      size={20}
                      color={colors.parent.primary}
                    />
                  ) : null}
                </Pressable>
              ))}
            </View>
          ) : null}
          {draft.step === 6 ? (
            <View style={styles.skillGrid}>
              {skills
                .filter((skill) => !skill.comingSoon)
                .map((skill) => {
                  const active = draft.selectedSkills.includes(skill.id);
                  return (
                    <Pressable
                      key={skill.id}
                      accessibilityRole="checkbox"
                      accessibilityState={{ checked: active }}
                      onPress={() =>
                        update({
                          selectedSkills: active
                            ? draft.selectedSkills.filter(
                                (item) => item !== skill.id,
                              )
                            : [...draft.selectedSkills, skill.id],
                        })
                      }
                      style={[
                        styles.skillChoice,
                        active && styles.choiceActive,
                      ]}
                    >
                      <SkillWorldMark skillId={skill.id} size={46} />
                      <View style={styles.skillCopy}>
                        <AppText variant="label">{skill.title.en}</AppText>
                        <AppText variant="caption" tone="muted">
                          {skill.shortDescription.en}
                        </AppText>
                      </View>
                      {active ? (
                        <AppIcon
                          name="check"
                          size={22}
                          color={colors.parent.primary}
                        />
                      ) : null}
                    </Pressable>
                  );
                })}
            </View>
          ) : null}
          {draft.step === 7 ? (
            <ChoiceGrid
              values={["confidence", "safer-choices", "independence"]}
              selected={draft.goals}
              label={(id) =>
                ({
                  confidence: "Build confidence",
                  "safer-choices": "Make safer choices",
                  independence: "Grow independence",
                })[id] ?? id
              }
              onPress={(goal) => update({ goals: [goal] })}
            />
          ) : null}
          {draft.step === 8 ? (
            <View style={styles.ready}>
              <Avatar
                avatarKey={draft.avatarKey}
                nickname={draft.nickname}
                size={104}
                selected
              />
              <AppText variant="heading">{draft.nickname} will explore</AppText>
              <View style={styles.worlds}>
                {draft.selectedSkills.map((id) => (
                  <SkillWorldMark key={id} skillId={id} size={44} />
                ))}
              </View>
              <AppText tone="muted" style={styles.readyText}>
                A private learning path is ready with short adventures matched
                to ages {draft.ageBand}.
              </AppText>
            </View>
          ) : null}
          {error ? (
            <AppText tone="danger" accessibilityRole="alert">
              {error}
            </AppText>
          ) : null}
        </Card>
      </Reveal>
      <View style={styles.actions}>
        {draft.step > 0 ? (
          <Button
            label="Back"
            variant="secondary"
            onPress={() => update({ step: draft.step - 1 })}
          />
        ) : null}
        <Button
          label={draft.step === 8 ? "Start exploring" : "Continue"}
          icon={draft.step === 8 ? "play" : "arrow"}
          onPress={() => void next()}
          loading={saving}
        />
      </View>
    </Screen>
  );
}

function ChoiceGrid<T extends string>({
  values,
  selected,
  label,
  onPress,
}: {
  values: T[];
  selected: string[];
  label: (value: T) => string;
  onPress: (value: T) => void;
}) {
  return (
    <View style={styles.grid}>
      {values.map((value) => {
        const active = selected.includes(value);
        return (
          <Pressable
            key={value}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: active }}
            onPress={() => onPress(value)}
            style={[styles.choice, active && styles.choiceActive]}
          >
            <AppText variant="bodyStrong">
              {active ? "✓ " : ""}
              {label(value)}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { gap: spacing.xl },
  progress: {
    height: 7,
    backgroundColor: colors.border,
    borderRadius: radius.pill,
    overflow: "hidden",
  },
  progressFill: { height: "100%", backgroundColor: colors.parent.primary },
  header: { gap: spacing.sm },
  step: { color: colors.parent.primary },
  content: { gap: spacing.lg },
  grid: { gap: spacing.md },
  choice: {
    minHeight: 56,
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
  },
  choiceActive: {
    borderColor: colors.parent.primary,
    backgroundColor: colors.parent.soft,
  },
  actions: { gap: spacing.sm, marginTop: "auto" },
  avatarGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md },
  avatarChoice: {
    width: "47%",
    minWidth: 130,
    alignItems: "center",
    gap: spacing.sm,
    padding: spacing.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.lg,
  },
  skillGrid: { gap: spacing.md },
  skillChoice: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.lg,
  },
  skillCopy: { flex: 1, gap: spacing.xs },
  ready: { alignItems: "center", gap: spacing.lg, paddingVertical: spacing.lg },
  worlds: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: spacing.md,
  },
  readyText: { textAlign: "center" },
});
