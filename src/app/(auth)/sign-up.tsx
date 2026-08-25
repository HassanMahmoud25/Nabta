import { Link, useRouter } from 'expo-router';
import { AuthForm } from '@/features/auth/components/auth-form';
import { useAuth } from '@/features/auth/auth-provider';
import { Screen } from '@/components/ui/screen';
import { AppText } from '@/components/ui/app-text';

export default function SignUpScreen() {
  const { signUp } = useAuth(); const router = useRouter();
  return <Screen contentStyle={{ justifyContent: 'center' }}><AuthForm title="Create your parent account" subtitle="Your account privately holds every child profile." submitLabel="Create account" onSubmit={async (values) => { await signUp(values); router.replace('/(onboarding)'); }} footer={<Link href="/(auth)/sign-in" asChild><AppText variant="bodyStrong" style={{ textAlign: 'center' }}>Already registered? Sign in</AppText></Link>} /></Screen>;
}

