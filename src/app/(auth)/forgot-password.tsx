import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useState } from 'react';
import { AppText } from '@/components/ui/app-text'; import { Button } from '@/components/ui/button'; import { Screen } from '@/components/ui/screen'; import { TextField } from '@/components/ui/text-field';
import { authService } from '@/features/auth/auth-service'; import { resetSchema, type ResetFormValues } from '@/features/auth/schemas';
export default function ForgotPasswordScreen() {
  const [sent, setSent] = useState(false); const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResetFormValues>({ resolver: zodResolver(resetSchema), defaultValues: { email: '' } });
  return <Screen contentStyle={{ justifyContent: 'center', gap: 16 }}><AppText variant="title">Reset your password</AppText><AppText tone="muted">We’ll send reset instructions if an account matches this email.</AppText>{sent ? <AppText tone="success">Check your inbox for the next step.</AppText> : <><Controller control={control} name="email" render={({ field }) => <TextField label="Email" keyboardType="email-address" autoCapitalize="none" value={field.value} onChangeText={field.onChange} error={errors.email?.message} />} /><Button label="Send reset link" loading={isSubmitting} onPress={handleSubmit(async ({ email }) => { await authService.requestPasswordReset(email); setSent(true); })} /></>}</Screen>;
}
