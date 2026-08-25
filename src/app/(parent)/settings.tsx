import { useState, type ReactNode } from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet, Switch, View } from 'react-native';
import { AppText } from '@/components/ui/app-text';
import { AppIcon, type AppIconName } from '@/components/ui/app-icon';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Screen } from '@/components/ui/screen';
import { useAuth } from '@/features/auth/auth-provider';
import { env } from '@/config/env';
import { soundFeedback } from '@/services/feedback/sound';
import { colors, radius, spacing } from '@/theme/tokens';

function Row({ icon, title, body, action }: { icon: AppIconName; title: string; body: string; action?: ReactNode }) {
  return <View style={styles.row}><View style={styles.rowIcon}><AppIcon name={icon} size={22} color={colors.parent.primary} /></View><View style={styles.copy}><AppText variant="label">{title}</AppText><AppText variant="caption" tone="muted">{body}</AppText></View>{action}</View>;
}

export default function SettingsScreen() {
  const { session, signOut } = useAuth(); const router = useRouter(); const [soundEnabled, setSoundEnabled] = useState(soundFeedback.isEnabled);
  function updateSound(value: boolean) { setSoundEnabled(value); soundFeedback.setEnabled(value); if (value) void soundFeedback.play('mission-success'); }
  return <Screen contentStyle={styles.screen}><View style={styles.header}><AppText variant="micro" style={styles.label}>PARENT CONTROLS</AppText><AppText variant="title">Settings</AppText></View><Card variant="parent" style={styles.card}>
    <Row icon="mail" title={session?.email ?? 'Parent account'} body="Children never need an email or password." /><View style={styles.divider} />
    <Row icon="privacy" title="Privacy by design" body="No public profiles, child chat, targeted ads, or leaderboards." /><View style={styles.divider} />
    <Row icon="celebration" title="Sound effects" body="Short success sounds for achievements. Off by default." action={<Switch accessibilityLabel="Sound effects" value={soundEnabled} onValueChange={updateSound} trackColor={{ false: colors.borderStrong, true: colors.parent.primary }} thumbColor={colors.white} />} />
    {env.useDevFixtures ? <><View style={styles.divider} /><Row icon="info" title="Development fixtures" body="Local fixture mode is currently active." /></> : null}
  </Card><Button label="Sign out" icon="logout" variant="secondary" onPress={() => void signOut().then(() => router.replace('/'))} /></Screen>;
}

const styles = StyleSheet.create({ screen: { gap: spacing.lg }, header: { gap: spacing.sm, marginBottom: spacing.sm }, label: { color: colors.parent.primary }, card: { padding: 0, overflow: 'hidden' }, row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg }, rowIcon: { width: 44, height: 44, borderRadius: radius.md, backgroundColor: colors.parent.soft, alignItems: 'center', justifyContent: 'center' }, copy: { flex: 1, gap: spacing.xs }, divider: { height: 1, backgroundColor: colors.border, marginLeft: spacing.huge } });
