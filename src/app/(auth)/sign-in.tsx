import { AppText } from "@/components/ui/app-text";
import { Screen } from "@/components/ui/screen";
import { useAuth } from "@/features/auth/auth-provider";
import { AuthForm } from "@/features/auth/components/auth-form";
import { Link, useRouter } from "expo-router";

export default function SignInScreen() {
  const { signIn } = useAuth();
  const router = useRouter();
  return (
    <Screen contentStyle={{ justifyContent: "center" }}>
      <AuthForm
        title="Welcome back"
        subtitle="Sign in to continue your family’s learning journey."
        submitLabel="Sign in"
        onSubmit={async (values) => {
          await signIn(values);
          router.replace("/(parent)");
        }}
        footer={
          <>
            <Link href="/(auth)/forgot-password" asChild>
              <AppText style={{ textAlign: "center" }}>
                Forgot password?
              </AppText>
            </Link>
            <Link href="/(auth)/sign-up" asChild>
              <AppText variant="bodyStrong" style={{ textAlign: "center" }}>
                Create an account
              </AppText>
            </Link>
          </>
        }
      />
    </Screen>
  );
}
