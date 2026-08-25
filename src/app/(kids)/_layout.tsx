import { Redirect, Tabs } from 'expo-router';

import type { AppIconName } from '@/components/ui/app-icon';
import { PopIcon } from '@/components/ui/motion';
import { useAppStore } from '@/stores/app-store';
import { colors, radius } from '@/theme/tokens';

const icons: Record<string, AppIconName> = { index: 'home', journey: 'journey', rewards: 'rewards', profile: 'profile' };

export default function KidsLayout() {
  const mode = useAppStore((state) => state.mode); const childId = useAppStore((state) => state.activeChildId);
  if (mode !== 'kids' || !childId) return <Redirect href="/(parent)" />;
  return <Tabs screenOptions={({ route }) => ({ headerShown: false, tabBarActiveTintColor: colors.kids.primary, tabBarInactiveTintColor: colors.muted, tabBarLabelStyle: { fontWeight: '700', fontSize: 12 }, tabBarItemStyle: { borderRadius: radius.md, marginHorizontal: 2 }, tabBarActiveBackgroundColor: colors.kids.lavender, tabBarStyle: { height: 82, paddingTop: 8, paddingBottom: 10, paddingHorizontal: 8, backgroundColor: colors.surface, borderTopColor: 'transparent' }, tabBarIcon: ({ color, focused }) => <PopIcon key={`${route.name}-${focused}`} name={icons[route.name] ?? 'star'} color={color} size={focused ? 25 : 23} /> })}><Tabs.Screen name="index" options={{ title: 'Home' }} /><Tabs.Screen name="journey" options={{ title: 'Journey' }} /><Tabs.Screen name="rewards" options={{ title: 'Rewards' }} /><Tabs.Screen name="profile" options={{ title: 'Me' }} /><Tabs.Screen name="mission/[id]" options={{ href: null, tabBarStyle: { display: 'none' } }} /><Tabs.Screen name="skill/[id]" options={{ href: null }} /><Tabs.Screen name="parent-gate" options={{ href: null, tabBarStyle: { display: 'none' } }} /></Tabs>;
}
