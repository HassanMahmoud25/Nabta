import { colors, typography } from "@/theme/tokens";
import { I18nManager, Text, type TextProps } from "react-native";

type AppTextProps = TextProps & {
  variant?: keyof typeof typography;
  tone?: "default" | "muted" | "inverse" | "danger" | "success";
};

const toneColors = {
  default: colors.ink,
  muted: colors.muted,
  inverse: colors.white,
  danger: colors.danger,
  success: colors.success,
} as const;

export function AppText({
  variant = "body",
  tone = "default",
  style,
  ...props
}: AppTextProps) {
  return (
    <Text
      {...props}
      style={[
        typography[variant],
        {
          color: toneColors[tone],
          textAlign: I18nManager.isRTL ? "right" : "left",
          writingDirection: I18nManager.isRTL ? "rtl" : "ltr",
        },
        style,
      ]}
    />
  );
}
