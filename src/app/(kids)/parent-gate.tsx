import { AppText } from "@/components/ui/app-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Screen } from "@/components/ui/screen";
import { TextField } from "@/components/ui/text-field";
import { useAuth } from "@/features/auth/auth-provider";
import { authService } from "@/features/auth/auth-service";
import { parentPinService } from "@/features/onboarding/pin-service";
import { useAppStore } from "@/stores/app-store";
import { spacing } from "@/theme/tokens";
import { useRouter } from "expo-router";
import { useState } from "react";
export default function ParentGateScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const enterParentMode = useAppStore((state) => state.enterParentMode);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [forgot, setForgot] = useState(false);
  const [email, setEmail] = useState(session?.email ?? "");
  const [password, setPassword] = useState("");
  const [nextPin, setNextPin] = useState("");
  const [busy, setBusy] = useState(false);
  async function verify() {
    if (!session) return;
    setBusy(true);
    try {
      if (!(await parentPinService.verify(session.parentId, pin)))
        return setError("That PIN didn’t match. Try again.");
      enterParentMode();
      router.replace("/(parent)");
    } finally {
      setBusy(false);
    }
  }
  async function reset() {
    if (!session || !/^\d{4}$/.test(nextPin))
      return setError("Choose a new four-digit PIN.");
    setBusy(true);
    try {
      const verified = await authService.verifyParentCredentials(
        { email, password },
        session.parentId,
      );
      if (!verified)
        return setError("We could not verify your parent account.");
      await parentPinService.resetAfterAuthentication(
        session.parentId,
        nextPin,
      );
      enterParentMode();
      router.replace("/(parent)");
    } finally {
      setBusy(false);
    }
  }
  return (
    <Screen contentStyle={{ justifyContent: "center", gap: spacing.lg }}>
      <Card style={{ gap: spacing.lg }}>
        <AppText variant="caption" tone="muted">
          PARENT GATE
        </AppText>
        <AppText variant="title">Grown-ups only</AppText>
        <AppText tone="muted">
          {forgot
            ? "Verify the authenticated parent account before creating a new PIN."
            : "Enter your four-digit Parent PIN to leave Kids Mode."}
        </AppText>
        {forgot ? (
          <>
            <TextField
              label="Parent email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <TextField
              label="Account password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <TextField
              label="New 4-digit PIN"
              value={nextPin}
              onChangeText={(value) =>
                setNextPin(value.replace(/\D/g, "").slice(0, 4))
              }
              keyboardType="number-pad"
              secureTextEntry
            />
            <Button
              label="Verify and reset PIN"
              onPress={() => void reset()}
              loading={busy}
            />
          </>
        ) : (
          <>
            <TextField
              label="Parent PIN"
              value={pin}
              onChangeText={(value) => {
                setPin(value.replace(/\D/g, "").slice(0, 4));
                setError("");
              }}
              keyboardType="number-pad"
              secureTextEntry
              maxLength={4}
            />
            <Button
              label="Return to Parent Mode"
              onPress={() => void verify()}
              loading={busy}
              disabled={pin.length !== 4}
            />
            <Button
              label="Forgot PIN?"
              variant="ghost"
              onPress={() => {
                setForgot(true);
                setError("");
              }}
            />
          </>
        )}
        {error ? (
          <AppText tone="danger" accessibilityRole="alert">
            {error}
          </AppText>
        ) : null}
        <Button
          mode="kids"
          label="Stay in Kids Mode"
          variant="secondary"
          onPress={() => router.back()}
        />
      </Card>
    </Screen>
  );
}
