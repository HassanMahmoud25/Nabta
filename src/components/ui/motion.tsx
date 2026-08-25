import { useEffect, useState, type PropsWithChildren } from 'react';
import { Pressable, type ColorValue, type PressableProps, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import Animated, { FadeIn, ReduceMotion, ZoomIn, cancelAnimation, runOnJS, useAnimatedReaction, useAnimatedStyle, useReducedMotion, useSharedValue, withRepeat, withSequence, withSpring, withTiming } from 'react-native-reanimated';
import { AppText } from './app-text';
import { AppIcon, type AppIconName } from './app-icon';
import { motion } from '@/theme/motion';

export function ScalePressable({ style, onPressIn, onPressOut, ...props }: PressableProps) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return <Animated.View style={[pressableStyles.wrapper, animatedStyle]}><Pressable {...props} onPressIn={(event) => { scale.set(withSpring(.975, motion.spring)); onPressIn?.(event); }} onPressOut={(event) => { scale.set(withSpring(1, motion.spring)); onPressOut?.(event); }} style={style} /></Animated.View>;
}

export function FloatingView({ children, style, distance = 5 }: PropsWithChildren<{ style?: StyleProp<ViewStyle>; distance?: number }>) {
  const reduced = useReducedMotion(); const offset = useSharedValue(0);
  useEffect(() => { if (reduced) { offset.value = 0; return; } offset.value = withRepeat(withSequence(withTiming(-distance, { duration: 1800, easing: motion.easing.standard, reduceMotion: ReduceMotion.System }), withTiming(distance, { duration: 1800, easing: motion.easing.standard, reduceMotion: ReduceMotion.System })), -1, true); return () => cancelAnimation(offset); }, [distance, offset, reduced]);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ translateY: offset.value }] }));
  return <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>;
}

export function PopIcon({ name, size, color, active = true }: { name: AppIconName; size: number; color: ColorValue; active?: boolean }) {
  return <Animated.View key={`${name}-${active}`} entering={active ? ZoomIn.duration(motion.duration.quick).reduceMotion(ReduceMotion.System) : FadeIn.duration(motion.duration.quick).reduceMotion(ReduceMotion.System)}><AppIcon name={name} size={size} color={color} /></Animated.View>;
}

export function AnimatedNumber({ value, suffix = '', variant = 'title', style }: { value: number; suffix?: string; variant?: 'title' | 'display' | 'heading' | 'bodyStrong'; style?: StyleProp<TextStyle> }) {
  const reduced = useReducedMotion(); const progress = useSharedValue(reduced ? value : 0); const [display, setDisplay] = useState(reduced ? value : 0);
  useEffect(() => { progress.value = reduced ? value : withTiming(value, { duration: motion.duration.celebration, easing: motion.easing.emphasized, reduceMotion: ReduceMotion.System }); }, [progress, reduced, value]);
  useAnimatedReaction(() => Math.round(progress.value), (current, previous) => { if (current !== previous) runOnJS(setDisplay)(current); });
  return <AppText variant={variant} style={style}>{display}{suffix}</AppText>;
}

const pressableStyles = { wrapper: { alignSelf: 'stretch' } } as const;
