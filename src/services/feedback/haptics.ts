import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
async function safe(run: () => Promise<void>) { if (Platform.OS === 'web') return; try { await run(); } catch {} }
export const haptics = { select: () => safe(() => Haptics.selectionAsync()), soft: () => safe(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft)), success: () => safe(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)), badge: () => safe(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)), milestone: () => safe(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)), warning: () => safe(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)) };
