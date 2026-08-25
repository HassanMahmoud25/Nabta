import { type PropsWithChildren } from "react";
import {
  StyleSheet,
  View,
  type PressableProps,
  type ViewProps,
} from "react-native";

import { colors, radius, shadows, spacing } from "@/theme/tokens";
import { ScalePressable } from "./motion";

export type CardVariant =
  | "default"
  | "skill"
  | "progress"
  | "mission"
  | "achievement"
  | "parent"
  | "interactive"
  | "elevated"
  | "outlined"
  | "flat"
  | "hero"
  | "tinted";

export function Card({
  style,
  variant = "default",
  ...props
}: ViewProps & { variant?: CardVariant }) {
  return <View {...props} style={[styles.base, styles[variant], style]} />;
}

export function InteractiveCard({
  children,
  style,
  ...props
}: PropsWithChildren<PressableProps>) {
  const cardStyle: PressableProps["style"] =
    typeof style === "function"
      ? (state) => [styles.base, styles.interactive, style(state)]
      : [styles.base, styles.interactive, style];
  return (
    <ScalePressable {...props} style={cardStyle}>
      {children}
    </ScalePressable>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderCurve: "continuous",
    padding: spacing.xl,
  },
  default: {
    borderWidth: 1,
    borderColor: "rgba(23,36,59,.055)",
    ...shadows.soft,
  },
  skill: {
    borderRadius: radius.hero,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,.82)",
    ...shadows.card,
  },
  progress: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: "rgba(23,36,59,.05)",
    ...shadows.soft,
  },
  mission: {
    borderRadius: radius.hero,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,.84)",
    ...shadows.soft,
  },
  achievement: {
    borderRadius: radius.hero,
    borderWidth: 1,
    borderColor: "rgba(240,182,75,.2)",
    ...shadows.floating,
  },
  parent: {
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceWarm,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.soft,
  },
  interactive: {
    borderWidth: 1,
    borderColor: "rgba(23,36,59,.07)",
    ...shadows.card,
  },
  elevated: {
    borderWidth: 1,
    borderColor: "rgba(23,36,59,.055)",
    ...shadows.card,
  },
  outlined: { borderWidth: 1, borderColor: colors.border },
  flat: { backgroundColor: colors.surfaceWarm },
  hero: {
    borderRadius: radius.hero,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,.72)",
    ...shadows.hero,
  },
  tinted: { backgroundColor: colors.parent.soft },
});
