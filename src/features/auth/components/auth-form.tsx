import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/ui/app-text';
import { AppIcon } from '@/components/ui/app-icon';
import { Button } from '@/components/ui/button';
import { TextField } from '@/components/ui/text-field';
import { authSchema, type AuthFormValues } from '../schemas';
import { spacing } from '@/theme/tokens';

type AuthFormProps = { title: string; subtitle: string; submitLabel: string; onSubmit: (values: AuthFormValues) => Promise<void>; footer?: ReactNode };
export function AuthForm({ title, subtitle, submitLabel, onSubmit, footer }: AuthFormProps) {
  const { control, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<AuthFormValues>({ resolver: zodResolver(authSchema), defaultValues: { email: '', password: '' } });
  const submit = handleSubmit(async (values) => {
    try { await onSubmit(values); } catch (error) { setError('root', { message: error instanceof Error ? error.message : 'Please try again.' }); }
  });
  return <View style={styles.form}>
    <View style={styles.brand}><View style={styles.mark}><AppIcon name="journey" size={25} color="#FFFFFF" /></View><View><AppText variant="heading">Nash2</AppText><AppText variant="micro" style={styles.eyebrow}>PARENT SPACE</AppText></View></View>
    <View style={styles.header}><AppText variant="title">{title}</AppText><AppText tone="muted">{subtitle}</AppText></View>
    <Controller control={control} name="email" render={({ field: { onChange, onBlur, value } }) => <TextField label="Email" autoCapitalize="none" autoComplete="email" keyboardType="email-address" value={value} onChangeText={onChange} onBlur={onBlur} error={errors.email?.message} />} />
    <Controller control={control} name="password" render={({ field: { onChange, onBlur, value } }) => <TextField label="Password" secureTextEntry autoComplete="password" value={value} onChangeText={onChange} onBlur={onBlur} error={errors.password?.message} />} />
    {errors.root?.message ? <AppText tone="danger" accessibilityRole="alert">{errors.root.message}</AppText> : null}
    <Button label={submitLabel} onPress={submit} loading={isSubmitting} />{footer}
  </View>;
}
const styles = StyleSheet.create({ form: { gap: spacing.lg }, brand: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md }, mark: { width: 48, height: 48, borderRadius: 16, backgroundColor: '#174F49', alignItems: 'center', justifyContent: 'center' }, eyebrow: { color: '#174F49' }, header: { gap: spacing.sm, marginBottom: spacing.md } });
