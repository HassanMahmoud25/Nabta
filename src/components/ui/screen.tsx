import { motion } from "@/theme/motion";
import { colors, sizes, spacing, type ExperienceMode } from "@/theme/tokens";
import { type PropsWithChildren } from "react";
import {
    ScrollView,
    StyleSheet,
    View,
    useWindowDimensions,
    type ViewStyle,
} from "react-native";
import Animated, {
    FadeIn,
    FadeInDown,
    ReduceMotion,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
type Props = PropsWithChildren<{
  scroll?: boolean;
  contentStyle?: ViewStyle;
  mode?: ExperienceMode;
  safeBottom?: boolean;
}>;
export function Screen({
  children,
  scroll = true,
  contentStyle,
  mode = "parent",
  safeBottom = false,
}: Props) {
  const { width } = useWindowDimensions();
  const compact = width < 380;
  const entering =
    mode === "kids"
      ? FadeInDown.duration(motion.duration.standard).reduceMotion(
          ReduceMotion.System,
        )
      : FadeIn.duration(motion.duration.quick).reduceMotion(
          ReduceMotion.System,
        );
  const content = (
    <Animated.View
      entering={entering}
      style={[
        styles.content,
        {
          maxWidth:
            mode === "parent" ? sizes.parentContentMax : sizes.contentMax,
          paddingHorizontal: compact ? spacing.lg : spacing.xl,
        },
        contentStyle,
      ]}
    >
      {children}
    </Animated.View>
  );
  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        {
          backgroundColor: mode === "kids" ? colors.kidsCanvas : colors.canvas,
        },
      ]}
      edges={
        safeBottom
          ? ["top", "right", "bottom", "left"]
          : ["top", "right", "left"]
      }
    >
      {mode === "kids" ? (
        <>
          <View style={[styles.orb, styles.orbOne]} />
          <View style={[styles.orb, styles.orbTwo]} />
        </>
      ) : null}
      {scroll ? (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeArea: { flex: 1, overflow: "hidden" },
  scrollContent: { flexGrow: 1, alignItems: "center" },
  content: {
    flex: 1,
    width: "100%",
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  orb: { position: "absolute", borderRadius: 999, opacity: 0.32 },
  orbOne: {
    width: 220,
    height: 220,
    right: -100,
    top: 90,
    backgroundColor: "#DDD4FF",
  },
  orbTwo: {
    width: 150,
    height: 150,
    left: -80,
    bottom: 120,
    backgroundColor: "#D7F2EC",
  },
});
