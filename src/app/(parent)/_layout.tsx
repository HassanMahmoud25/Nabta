import { Redirect, Tabs } from 'expo-router';
import { AppIcon, type AppIconName } from '@/components/ui/app-icon';
import { useAppStore } from '@/stores/app-store';
import { colors } from '@/theme/tokens';

const icons: Record<string, AppIconName> = { index: 'home', children: 'children', progress: 'progress', activities: 'activities', settings: 'settings' };
export default function ParentLayout() {
  const mode = useAppStore((state) => state.mode);
  if (mode === 'kids') return <Redirect href="/(kids)" />;
  return <Tabs screenOptions={({ route }) => ({ headerShown: false, tabBarActiveTintColor: colors.parent.primary, tabBarInactiveTintColor: colors.muted, tabBarLabelStyle: { fontSize: 11, fontWeight: '700' }, tabBarStyle: { height: 76, paddingTop: 8, paddingBottom: 9, backgroundColor: colors.surface, borderTopColor: colors.border }, tabBarIcon: ({ color, focused }) => <AppIcon name={icons[route.name] ?? 'home'} color={color} size={focused ? 23 : 21} /> })}>
    <Tabs.Screen name="index" options={{ title: 'Home' }} /><Tabs.Screen name="children" options={{ title: 'Children' }} /><Tabs.Screen name="progress" options={{ title: 'Progress' }} /><Tabs.Screen name="activities" options={{ title: 'Activities' }} /><Tabs.Screen name="settings" options={{ title: 'Settings' }} /><Tabs.Screen name="child-form" options={{ href: null, tabBarStyle: { display: 'none' } }} />
  </Tabs>;
}
