import { AppIcon } from "@/components/ui/app-icon";
import { AppText } from "@/components/ui/app-text";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Screen } from "@/components/ui/screen";
import { ErrorState, LoadingState } from "@/components/ui/states";
import { useAuth } from "@/features/auth/auth-provider";
import {
  useDeleteChild,
  useReconciledChildren,
} from "@/features/children/hooks";
import { calculateLevel } from "@/features/progress/progress-utils";
import { analytics } from "@/services/analytics/analytics";
import { entitlementService } from "@/services/entitlements/entitlement-service";
import { useAppStore } from "@/stores/app-store";
import { colors, radius, spacing } from "@/theme/tokens";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

export default function ChildrenScreen() {
  const { session } = useAuth();
  const router = useRouter();
  const {
    data,
    isLoading,
    error: loadError,
    refetch,
    activeChildId,
  } = useReconciledChildren(session?.parentId);
  const setActive = useAppStore((state) => state.setActiveChild);
  const enterKids = useAppStore((state) => state.enterKidsMode);
  const remove = useDeleteChild(session?.parentId ?? "");
  const [confirming, setConfirming] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");
  if (isLoading)
    return <LoadingState label="Gathering your family profiles…" />;
  if (loadError)
    return (
      <ErrorState
        message="We couldn’t load your family profiles."
        onRetry={() => void refetch()}
      />
    );
  const children = data ?? [];
  const entitlement = entitlementService.development();
  const canAdd = children.length < entitlement.maxChildren;
  const add = () => {
    if (canAdd) router.push("/(parent)/child-form");
  };
  const activate = (childId: string) => {
    setActive(childId, session?.parentId);
    analytics.track("child_switched", { childId });
  };

  if (!children.length)
    return (
      <Screen contentStyle={styles.empty}>
        <View style={styles.emptyIcon}>
          <AppIcon name="children" size={44} color={colors.parent.primary} />
        </View>
        <AppText variant="display" style={styles.center}>
          Create your first learning journey
        </AppText>
        <AppText tone="muted" style={styles.center}>
          Add a child profile to begin personalized life-skill missions.
        </AppText>
        <Button
          label="Add Child"
          icon="add"
          onPress={add}
          style={styles.full}
        />
      </Screen>
    );

  return (
    <Screen contentStyle={styles.screen}>
      <View style={styles.header}>
        <View style={styles.title}>
          <AppText variant="micro" style={styles.label}>
            FAMILY PROFILES
          </AppText>
          <AppText variant="title">Children</AppText>
          <AppText tone="muted">
            Each child has a completely independent learning journey.
          </AppText>
        </View>
        <Button
          label="Add Child"
          icon="add"
          compact
          disabled={!canAdd}
          onPress={add}
        />
      </View>
      {children.map((child) => {
        const selected = child.id === activeChildId;
        const confirmDelete = confirming === child.id;
        return (
          <Card
            key={child.id}
            variant={selected ? "hero" : "outlined"}
            style={[styles.card, selected && styles.selected]}
          >
            <View style={styles.cardGlow} />
            <View style={styles.profile}>
              <Avatar
                avatarKey={child.avatarKey}
                nickname={child.nickname}
                size={60}
                selected={selected}
              />
              <View style={styles.copy}>
                <View style={styles.nameRow}>
                  <AppText variant="heading">{child.nickname}</AppText>
                  {selected ? (
                    <View style={styles.activePill}>
                      <AppIcon name="check" size={14} color={colors.success} />
                      <AppText variant="caption" style={styles.currentLabel}>
                        Current
                      </AppText>
                    </View>
                  ) : (
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`Make ${child.nickname} the active profile`}
                      onPress={() => activate(child.id)}
                      style={({ pressed }) => [
                        styles.activePill,
                        styles.selectPill,
                        pressed && styles.pressed,
                      ]}
                    >
                      <AppIcon
                        name="switch"
                        size={13}
                        color={colors.parent.primary}
                      />
                      <AppText variant="caption" style={styles.selectLabel}>
                        Choose
                      </AppText>
                    </Pressable>
                  )}
                </View>
                <AppText variant="caption" tone="muted">
                  Ages {child.ageBand} · Level {calculateLevel(child.xp)}
                </AppText>
                <View style={styles.chips}>
                  <View style={styles.xpChip}>
                    <AppIcon name="star" size={14} color={colors.warning} />
                    <AppText variant="caption">{child.xp} XP</AppText>
                  </View>
                  <View style={styles.worldChip}>
                    <AppIcon name="journey" size={14} color={colors.info} />
                    <AppText variant="caption">
                      {child.selectedSkills.length} skill worlds
                    </AppText>
                  </View>
                </View>
              </View>
            </View>
            {confirmDelete ? (
              <View style={styles.confirm}>
                <View style={styles.warning}>
                  <AppIcon name="delete" size={25} color={colors.danger} />
                  <View style={styles.copy}>
                    <AppText variant="bodyStrong">
                      Delete {child.nickname}’s profile?
                    </AppText>
                    <AppText variant="caption" tone="muted">
                      This permanently removes progress, missions, XP, and
                      badges. It cannot be undone.
                    </AppText>
                  </View>
                </View>
                <View style={styles.confirmActions}>
                  <Button
                    label="Keep profile"
                    variant="secondary"
                    compact
                    onPress={() => setConfirming(null)}
                  />
                  <Button
                    label="Delete permanently"
                    variant="danger"
                    compact
                    loading={remove.isPending}
                    onPress={() =>
                      void remove
                        .mutateAsync(child.id)
                        .then(() => setConfirming(null))
                        .catch(() =>
                          setActionError(
                            "We couldn’t delete this profile. Please try again.",
                          ),
                        )
                    }
                  />
                </View>
              </View>
            ) : (
              <View style={styles.actions}>
                <Button
                  label="Kids Mode"
                  icon="play"
                  compact
                  onPress={() => {
                    enterKids(child.id, session?.parentId);
                    analytics.track("kids_mode_child_selected", {
                      childId: child.id,
                    });
                    analytics.track("kids_mode_started", { childId: child.id });
                    router.replace("/(kids)");
                  }}
                  style={styles.primaryAction}
                />
                <Button
                  label="View"
                  icon="home"
                  variant="secondary"
                  compact
                  onPress={() => {
                    activate(child.id);
                    router.replace("/(parent)");
                  }}
                  style={styles.viewAction}
                />
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Edit ${child.nickname}’s profile`}
                  onPress={() =>
                    router.push({
                      pathname: "/(parent)/child-form",
                      params: { id: child.id },
                    })
                  }
                  style={({ pressed }) => [
                    styles.iconAction,
                    pressed && styles.pressed,
                  ]}
                >
                  <AppIcon
                    name="edit"
                    size={18}
                    color={colors.parent.primary}
                  />
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Delete ${child.nickname}’s profile`}
                  onPress={() => setConfirming(child.id)}
                  style={({ pressed }) => [
                    styles.iconAction,
                    pressed && styles.pressed,
                  ]}
                >
                  <AppIcon name="delete" size={18} color={colors.danger} />
                </Pressable>
              </View>
            )}
          </Card>
        );
      })}
      {actionError ? (
        <AppText tone="danger" accessibilityRole="alert">
          {actionError}
        </AppText>
      ) : null}
      {!canAdd ? (
        <Card variant="flat" style={styles.limit}>
          <AppIcon name="info" size={22} color={colors.parent.primary} />
          <AppText variant="caption" tone="muted" style={styles.copy}>
            Your current family entitlement supports {entitlement.maxChildren}{" "}
            child profiles.
          </AppText>
        </Card>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { gap: spacing.lg },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  title: { flex: 1, gap: spacing.sm },
  label: { color: colors.parent.primary },
  card: {
    position: "relative",
    overflow: "hidden",
    gap: spacing.lg,
    padding: spacing.lg,
  },
  selected: {
    backgroundColor: colors.surface,
    borderColor: "rgba(23,79,73,.15)",
  },
  cardGlow: {
    position: "absolute",
    width: 104,
    height: 104,
    borderRadius: 52,
    top: -58,
    right: -34,
    backgroundColor: colors.parent.soft,
    opacity: 0.72,
  },
  profile: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  copy: { flex: 1, gap: spacing.xs },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  activePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: 3,
    borderRadius: radius.pill,
    backgroundColor: colors.successSoft,
  },
  selectPill: { backgroundColor: colors.parent.soft },
  currentLabel: { color: colors.success },
  selectLabel: { color: colors.parent.primary },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  xpChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: 3,
    borderRadius: radius.pill,
    backgroundColor: colors.warningSoft,
  },
  worldChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: 3,
    borderRadius: radius.pill,
    backgroundColor: colors.infoSoft,
  },
  actions: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  primaryAction: { flex: 1.2, paddingHorizontal: spacing.lg },
  viewAction: { flex: 0.8, paddingHorizontal: spacing.sm },
  iconAction: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceWarm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: { opacity: 0.62 },
  confirm: {
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.dangerSoft,
  },
  warning: { flexDirection: "row", gap: spacing.md },
  confirmActions: { gap: spacing.sm },
  limit: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  empty: { alignItems: "center", justifyContent: "center", gap: spacing.lg },
  emptyIcon: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: colors.parent.soft,
    alignItems: "center",
    justifyContent: "center",
  },
  center: { textAlign: "center" },
  full: { width: "100%" },
});
