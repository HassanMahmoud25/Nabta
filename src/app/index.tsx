import { AppIcon } from "@/components/ui/app-icon";
import { AppText } from "@/components/ui/app-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { Illustration } from "@/components/ui/illustration";
import { Screen } from "@/components/ui/screen";
import { env } from "@/config/env";
import { useAuth } from "@/features/auth/auth-provider";
import { childrenService } from "@/features/children/children-service";
import { parentPinService } from "@/features/onboarding/pin-service";
import { queryKeys } from "@/services/api/query-keys";
import { useAppStore } from "@/stores/app-store";
import { colors, radius, spacing } from "@/theme/tokens";
import { useQueryClient } from "@tanstack/react-query";
import { Redirect, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
export default function HomeScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { session, signIn } = useAuth();
  const queryClient = useQueryClient();
  const setActiveChild = useAppStore((s) => s.setActiveChild);
  if (session) return <Redirect href="/(parent)" />;
  async function openDemo() {
    const parentId = "parent-dev";
    await parentPinService.create(parentId, "2468");
    const child = await childrenService.create({
      parentId,
      nickname: "Omar",
      ageBand: "7-9",
      avatarKey: "explorer",
      selectedSkills: ["money", "internet-safety", "responsibility"],
      goals: ["confidence"],
    });
    setActiveChild(child.id, parentId);
    await signIn({ email: "demo@nabta.local", password: "development-only" });
    await queryClient.invalidateQueries({
      queryKey: queryKeys.children(parentId),
    });
    router.replace("/(parent)");
  }
  return (
    <Screen contentStyle={styles.screen}>
      <View style={styles.brand}>
        <View style={styles.mark}>
          <AppIcon name="journey" size={24} color={colors.white} />
        </View>
        <View>
          <AppText variant="heading">Nabta</AppText>
          <AppText variant="micro" style={styles.brandSub}>
            LIFE SKILLS ADVENTURES
          </AppText>
        </View>
      </View>
      <Illustration
        name="adventure"
        accessibilityLabel="A young explorer follows a path through everyday life-skill worlds"
      />
      <View style={styles.hero}>
        <AppText variant="micro" style={styles.eyebrow}>
          {t("welcome.eyebrow")}
        </AppText>
        <AppText variant="hero">{"Little choices.\nBig confidence."}</AppText>
        <AppText tone="muted" style={styles.subtitle}>
          {t("welcome.body")}
        </AppText>
      </View>
      <View style={styles.actions}>
        <Button
          label={t("welcome.parentAction")}
          icon="children"
          onPress={() => router.push("/(auth)/sign-up")}
        />
        <Button
          label={t("welcome.signIn")}
          onPress={() => router.push("/(auth)/sign-in")}
          variant="secondary"
        />
        {env.useDevFixtures ? (
          <Button
            label="Explore demo · PIN 2468"
            icon="play"
            variant="ghost"
            onPress={() => void openDemo()}
          />
        ) : null}
      </View>
      <Card variant="flat" style={styles.trust}>
        <View style={styles.trustIcon}>
          <AppIcon name="privacy" size={24} color={colors.parent.primary} />
        </View>
        <View style={styles.trustCopy}>
          <AppText variant="label">Private by design</AppText>
          <AppText variant="caption" tone="muted">
            No child accounts, ads, chat, public profiles, or leaderboards.
          </AppText>
        </View>
      </Card>
      <View style={styles.preview}>
        <Chip label="5-minute missions" icon="time" />
        <Chip label="Built for families" icon="children" />
        <Chip label="English + العربية" icon="communication" />
      </View>
    </Screen>
  );
}
const styles = StyleSheet.create({
  screen: { gap: spacing.xl },
  brand: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  mark: {
    width: 46,
    height: 46,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.parent.primary,
  },
  brandSub: { color: colors.parent.primary },
  hero: { gap: spacing.md },
  eyebrow: { color: colors.parent.primary },
  subtitle: { maxWidth: 560 },
  actions: { gap: spacing.sm },
  trust: { flexDirection: "row", gap: spacing.md, alignItems: "center" },
  trustIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.parent.soft,
    alignItems: "center",
    justifyContent: "center",
  },
  trustCopy: { flex: 1, gap: spacing.xs },
  preview: {
    flexDirection: "row",
    gap: spacing.sm,
    flexWrap: "wrap",
    justifyContent: "center",
    paddingBottom: spacing.lg,
  },
});
