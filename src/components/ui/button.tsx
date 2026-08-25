import {
  ActivityIndicator,
  StyleSheet,
  View,
  type ViewStyle,
} from "react-native";

import { haptics } from "@/services/feedback/haptics";
import {
  colors,
  getExperiencePalette,
  radius,
  shadows,
  sizes,
  spacing,
  type ExperienceMode,
} from "@/theme/tokens";
import { AppIcon, type AppIconName } from "./app-icon";
import { AppText } from "./app-text";
import { ScalePressable } from "./motion";

type Props = {
  label: string;
  onPress: () => void;
  mode?: ExperienceMode;
  variant?: "primary" | "secondary" | "ghost" | "danger" | "success";
  icon?: AppIconName;
  disabled?: boolean;
  loading?: boolean;
  compact?: boolean;
  accessibilityHint?: string;
  style?: ViewStyle;
};

export function Button({
  label,
  onPress,
  mode = "parent",
  variant = "primary",
  icon,
  disabled = false,
  loading = false,
  compact = false,
  accessibilityHint,
  style,
}: Props) {
  const palette = getExperiencePalette(mode);
  const isPrimary =
    variant === "primary" || variant === "danger" || variant === "success";
  const base =
    variant === "danger"
      ? colors.danger
      : variant === "success"
        ? colors.success
        : palette.primary;
  return (
    <ScalePressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled, busy: loading }}
      disabled={disabled || loading}
      onPress={() => {
        void haptics.soft();
        onPress();
      }}
      style={({ pressed }) => [
        styles.base,
        compact && styles.compact,
        variant === "ghost" && styles.ghost,
        variant === "secondary" && {
          backgroundColor: palette.soft,
          borderColor: palette.primary,
        },
        isPrimary && {
          backgroundColor: pressed ? palette.primaryPressed : base,
        },
        mode === "kids" && isPrimary && styles.kidsPrimary,
        (disabled || loading) && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? colors.white : palette.primary} />
      ) : (
        <View style={styles.content}>
          {icon ? (
            <AppIcon
              name={icon}
              size={compact ? 18 : 20}
              color={isPrimary ? colors.white : palette.primary}
            />
          ) : null}
          <AppText
            variant="bodyStrong"
            tone={isPrimary ? "inverse" : "default"}
          >
            {label}
          </AppText>
        </View>
      )}
    </ScalePressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: sizes.minTouch,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "transparent",
    ...shadows.subtle,
  },
  compact: { minHeight: sizes.compactTouch, paddingHorizontal: spacing.lg },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },
  ghost: { backgroundColor: "transparent", shadowOpacity: 0, elevation: 0 },
  kidsPrimary: { borderBottomWidth: 4, borderBottomColor: colors.kids.navy },
  disabled: { opacity: 0.46 },
});
