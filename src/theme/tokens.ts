import { Platform, type TextStyle, type ViewStyle } from "react-native";

export const colors = {
  ink: "#17243B",
  inkSoft: "#33445E",
  muted: "#6B768A",
  canvas: "#FBF8F1",
  kidsCanvas: "#F4F1FF",
  surface: "#FFFFFF",
  surfaceWarm: "#FFFDF8",
  border: "#E8E3D9",
  borderStrong: "#D6D0C4",
  white: "#FFFFFF",
  danger: "#B94335",
  dangerSoft: "#FDE9E5",
  warning: "#9A651D",
  warningSoft: "#FFF0CE",
  success: "#167257",
  successSoft: "#DDF5EA",
  info: "#276E9C",
  infoSoft: "#DDEFFD",
  parent: {
    primary: "#174F49",
    primaryPressed: "#103D38",
    accent: "#B9782D",
    soft: "#E8F2EE",
    canvas: "#FBF8F1",
  },
  kids: {
    primary: "#5846B8",
    primaryPressed: "#443593",
    lavender: "#EDE8FF",
    sun: "#F0B64B",
    sky: "#5EB2D4",
    coral: "#E8785D",
    mint: "#63BE99",
    navy: "#25205E",
  },
} as const;

export const skillColors = {
  money: {
    base: "#F0B64B",
    strong: "#8A5B10",
    soft: "#FFF1C9",
    surface: "#FFF9E9",
    gradient: ["#F7C95F", "#E99A35"] as const,
  },
  responsibility: {
    base: "#E8785D",
    strong: "#974333",
    soft: "#FCE5DE",
    surface: "#FFF5F1",
    gradient: ["#F18D70", "#D95D49"] as const,
  },
  "internet-safety": {
    base: "#54B5D7",
    strong: "#176583",
    soft: "#DDF3FA",
    surface: "#F1FBFE",
    gradient: ["#66C9E5", "#398DBE"] as const,
  },
  emotions: {
    base: "#D96D9D",
    strong: "#8A345D",
    soft: "#FAE1EC",
    surface: "#FFF4F8",
    gradient: ["#E986B2", "#C65387"] as const,
  },
  communication: {
    base: "#8A6DD1",
    strong: "#533894",
    soft: "#ECE5FA",
    surface: "#F8F4FF",
    gradient: ["#A58AE4", "#7254BD"] as const,
  },
  "time-management": {
    base: "#657BC8",
    strong: "#344A96",
    soft: "#E3E8FA",
    surface: "#F5F7FF",
    gradient: ["#8295DD", "#5066B4"] as const,
  },
  health: {
    base: "#63BE83",
    strong: "#307849",
    soft: "#DFF4E6",
    surface: "#F4FCF6",
    gradient: ["#7DD19B", "#47A96C"] as const,
  },
  "problem-solving": {
    base: "#49B4AA",
    strong: "#1F716B",
    soft: "#DDF3F0",
    surface: "#F2FBFA",
    gradient: ["#67CCC2", "#319A92"] as const,
  },
  "social-skills": {
    base: "#6BA6DE",
    strong: "#376B9D",
    soft: "#E3F0FB",
    surface: "#F5FAFF",
    gradient: ["#83B9EA", "#508CC7"] as const,
  },
  independence: {
    base: "#E56F4A",
    strong: "#963D27",
    soft: "#FAE5DD",
    surface: "#FFF5F1",
    gradient: ["#EF8967", "#D35438"] as const,
  },
} as const;

export type SkillId = keyof typeof skillColors;
export function getSkillPalette(skillId?: string) {
  return skillColors[skillId as SkillId] ?? skillColors["problem-solving"];
}

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
  huge: 64,
} as const;
export const radius = {
  xs: 8,
  sm: 12,
  md: 18,
  lg: 24,
  hero: 30,
  pill: 999,
} as const;
export const sizes = {
  minTouch: 48,
  compactTouch: 40,
  contentMax: 680,
  parentContentMax: 760,
  avatar: 56,
  icon: 24,
} as const;

const kidsFont = Platform.select({
  ios: "System",
  android: "sans-serif",
  default: "system-ui",
});
const parentFont = Platform.select({
  ios: "System",
  android: "sans-serif",
  default: "system-ui",
});
export const typography = {
  hero: {
    fontFamily: kidsFont,
    fontSize: 40,
    lineHeight: 44,
    fontWeight: "900",
    letterSpacing: -1.1,
  },
  display: {
    fontFamily: kidsFont,
    fontSize: 26,
    lineHeight: 20,
    fontWeight: "900",
    letterSpacing: -0.6,
  },
  title: {
    fontFamily: parentFont,
    fontSize: 27,
    lineHeight: 34,
    fontWeight: "800",
    letterSpacing: -0.35,
  },
  heading: {
    fontFamily: parentFont,
    fontSize: 20,
    lineHeight: 27,
    fontWeight: "800",
    letterSpacing: -0.15,
  },
  subheading: {
    fontFamily: parentFont,
    fontSize: 18,
    lineHeight: 25,
    fontWeight: "700",
  },
  body: {
    fontFamily: parentFont,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400",
  },
  bodyStrong: {
    fontFamily: parentFont,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "700",
  },
  label: {
    fontFamily: parentFont,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "700",
  },
  caption: {
    fontFamily: parentFont,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600",
  },
  micro: {
    fontFamily: parentFont,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "800",
    letterSpacing: 0.7,
  },
} satisfies Record<string, TextStyle>;

export const shadows = {
  soft:
    Platform.select<ViewStyle>({
      ios: {
        shadowColor: "#17243B",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.035,
        shadowRadius: 16,
      },
      android: { elevation: 1 },
      default: { boxShadow: "0 6px 22px rgba(23,36,59,.045)" },
    }) ?? {},
  subtle:
    Platform.select<ViewStyle>({
      ios: {
        shadowColor: "#17243B",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.035,
        shadowRadius: 16,
      },
      android: { elevation: 1 },
      default: { boxShadow: "0 6px 22px rgba(23,36,59,.045)" },
    }) ?? {},
  card:
    Platform.select<ViewStyle>({
      ios: {
        shadowColor: "#17243B",
        shadowOffset: { width: 0, height: 9 },
        shadowOpacity: 0.055,
        shadowRadius: 28,
      },
      android: { elevation: 1 },
      default: { boxShadow: "0 12px 34px rgba(23,36,59,.06)" },
    }) ?? {},
  floating:
    Platform.select<ViewStyle>({
      ios: {
        shadowColor: "#2D246A",
        shadowOffset: { width: 0, height: 14 },
        shadowOpacity: 0.075,
        shadowRadius: 36,
      },
      android: { elevation: 2 },
      default: { boxShadow: "0 18px 46px rgba(45,36,106,.085)" },
    }) ?? {},
  hero:
    Platform.select<ViewStyle>({
      ios: {
        shadowColor: "#2D246A",
        shadowOffset: { width: 0, height: 14 },
        shadowOpacity: 0.075,
        shadowRadius: 36,
      },
      android: { elevation: 2 },
      default: { boxShadow: "0 18px 46px rgba(45,36,106,.085)" },
    }) ?? {},
} as const;

export const layout = {
  screenGutter: spacing.xl,
  compactGutter: spacing.lg,
  sectionGap: spacing.xxl,
} as const;
export type ExperienceMode = "parent" | "kids";
export function getExperiencePalette(mode: ExperienceMode) {
  return mode === "kids"
    ? {
        primary: colors.kids.primary,
        primaryPressed: colors.kids.primaryPressed,
        soft: colors.kids.lavender,
        canvas: colors.kidsCanvas,
      }
    : {
        primary: colors.parent.primary,
        primaryPressed: colors.parent.primaryPressed,
        soft: colors.parent.soft,
        canvas: colors.parent.canvas,
      };
}
