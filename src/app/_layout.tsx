import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppProviders } from '@/providers/app-providers';
import { useAuth } from '@/features/auth/auth-provider';
import { LoadingState } from '@/components/ui/states';

function RootNavigator() {
  const { session, isLoading } = useAuth();
  if (isLoading) return <LoadingState />;
  return <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
    <Stack.Screen name="index" />
    <Stack.Protected guard={!session}><Stack.Screen name="(auth)" /></Stack.Protected>
    <Stack.Protected guard={Boolean(session)}>
      <Stack.Screen name="(onboarding)" />
      <Stack.Screen name="(parent)" />
      <Stack.Screen name="(kids)" />
    </Stack.Protected>
  </Stack>;
}

export default function RootLayout() {
  return <AppProviders><StatusBar style="dark" /><RootNavigator /></AppProviders>;
}
