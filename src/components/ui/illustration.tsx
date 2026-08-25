import { Image, type ImageSource } from 'expo-image';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { illustrationRegistry, hasSkillIllustration } from './illustration-registry';
import { FloatingView } from './motion';
import { radius } from '@/theme/tokens';

export type IllustrationName = 'adventure' | 'empty-rewards';
type Asset = { source: ImageSource; ratio: number };

function Artwork({ asset, style, accessibilityLabel, floating = false }: { asset: Asset; style?: StyleProp<ViewStyle>; accessibilityLabel: string; floating?: boolean }) {
  const image = <View style={[styles.shell, { aspectRatio: asset.ratio }, style]}><Image source={asset.source} style={StyleSheet.absoluteFill} contentFit="cover" transition={220} accessibilityLabel={accessibilityLabel} /></View>;
  return floating ? <FloatingView style={styles.floating}>{image}</FloatingView> : image;
}

export function Illustration({ name, style, accessibilityLabel, floating = false }: { name: IllustrationName; style?: StyleProp<ViewStyle>; accessibilityLabel: string; floating?: boolean }) {
  const asset = name === 'empty-rewards' ? illustrationRegistry.empty.rewards : illustrationRegistry.brand.adventure;
  return <Artwork asset={asset} style={style} accessibilityLabel={accessibilityLabel} floating={floating} />;
}

export function SkillIllustration({ skillId, variant = 'default', style, accessibilityLabel }: { skillId: string; variant?: 'default' | 'completed'; style?: StyleProp<ViewStyle>; accessibilityLabel: string; floating?: boolean }) {
  const asset = hasSkillIllustration(skillId) ? illustrationRegistry.skills[skillId][variant] : variant === 'completed' ? illustrationRegistry.fallback.completed : illustrationRegistry.brand.adventure;
  return <Artwork asset={asset} style={style} accessibilityLabel={accessibilityLabel} />;
}

const styles = StyleSheet.create({ shell: { width: '100%', overflow: 'hidden', borderRadius: radius.hero, backgroundColor: '#E9E3F7' }, floating: { alignSelf: 'stretch' } });
