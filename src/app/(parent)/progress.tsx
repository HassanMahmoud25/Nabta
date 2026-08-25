import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/ui/app-text';
import { ProgressCard } from '@/components/ui/progress-card';
import { Screen } from '@/components/ui/screen';
import { EmptyState, LoadingState } from '@/components/ui/states';
import { useAuth } from '@/features/auth/auth-provider';
import { useReconciledChildren } from '@/features/children/hooks';
import { useDashboard } from '@/features/parent-dashboard/hooks';
import { getSkill } from '@/features/skills/utils';
import { colors, spacing } from '@/theme/tokens';

export default function ProgressScreen() {
  const { session } = useAuth();
  const { activeChildId, isLoading: childrenLoading } = useReconciledChildren(session?.parentId);
  const { data, isLoading } = useDashboard(activeChildId);
  if (childrenLoading || isLoading) return <LoadingState />;
  if (!data) return <EmptyState />;
  return <Screen contentStyle={styles.screen}>
    <View style={styles.header}><AppText variant="micro" style={styles.label}>LEARNING INSIGHTS</AppText><AppText variant="title">{data.child.nickname}’s progress</AppText><AppText tone="muted">Look for patterns, not perfection. Skills grow through practice.</AppText></View>
    {data.progress.map((item) => <ProgressCard key={item.skillId} mode="parent" skillId={item.skillId} title={getSkill(item.skillId)?.title.en ?? item.skillId} level={item.level} xp={item.xp} progress={item.progressPercent} completedMissions={item.completedMissions} />)}
  </Screen>;
}
const styles = StyleSheet.create({ screen: { gap: spacing.lg }, header: { gap: spacing.sm, marginBottom: spacing.sm }, label: { color: colors.parent.primary } });
