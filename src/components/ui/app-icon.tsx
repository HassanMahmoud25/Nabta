import { SymbolView } from 'expo-symbols';
import semiBold from 'expo-symbols/androidWeights/semiBold';
import type { ComponentProps } from 'react';
import { StyleSheet, View, type ColorValue } from 'react-native';
import { colors } from '@/theme/tokens';

const symbols = {
  home: { ios: 'house.fill', android: 'home', web: 'home' }, journey: { ios: 'map.fill', android: 'map', web: 'map' },
  rewards: { ios: 'trophy.fill', android: 'trophy', web: 'trophy' }, profile: { ios: 'person.crop.circle.fill', android: 'account_circle', web: 'account_circle' },
  children: { ios: 'figure.2.and.child.holdinghands', android: 'family_restroom', web: 'family_restroom' }, progress: { ios: 'chart.line.uptrend.xyaxis', android: 'monitoring', web: 'monitoring' },
  activities: { ios: 'book.pages.fill', android: 'auto_stories', web: 'auto_stories' }, settings: { ios: 'gearshape.fill', android: 'settings', web: 'settings' },
  money: { ios: 'wallet.bifold.fill', android: 'account_balance_wallet', web: 'account_balance_wallet' }, responsibility: { ios: 'star.circle.fill', android: 'stars', web: 'stars' },
  safety: { ios: 'shield.checkered', android: 'verified_user', web: 'verified_user' }, emotions: { ios: 'heart.fill', android: 'favorite', web: 'favorite' },
  communication: { ios: 'bubble.left.and.bubble.right.fill', android: 'forum', web: 'forum' }, time: { ios: 'clock.fill', android: 'schedule', web: 'schedule' },
  health: { ios: 'leaf.fill', android: 'eco', web: 'eco' }, problem: { ios: 'puzzlepiece.fill', android: 'extension', web: 'extension' },
  social: { ios: 'person.3.fill', android: 'groups', web: 'groups' }, independence: { ios: 'safari.fill', android: 'explore', web: 'explore' },
  lock: { ios: 'lock.fill', android: 'lock', web: 'lock' }, check: { ios: 'checkmark.circle.fill', android: 'check_circle', web: 'check_circle' },
  lightbulb: { ios: 'lightbulb.fill', android: 'lightbulb', web: 'lightbulb' }, star: { ios: 'sparkles', android: 'auto_awesome', web: 'auto_awesome' },
  celebration: { ios: 'party.popper.fill', android: 'celebration', web: 'celebration' }, add: { ios: 'plus.circle.fill', android: 'add_circle', web: 'add_circle' },
  edit: { ios: 'pencil', android: 'edit', web: 'edit' }, delete: { ios: 'trash.fill', android: 'delete', web: 'delete' }, switch: { ios: 'arrow.triangle.swap', android: 'swap_horiz', web: 'swap_horiz' },
  logout: { ios: 'rectangle.portrait.and.arrow.right', android: 'logout', web: 'logout' }, privacy: { ios: 'hand.raised.fill', android: 'privacy_tip', web: 'privacy_tip' },
  mail: { ios: 'envelope.fill', android: 'mail', web: 'mail' }, key: { ios: 'key.fill', android: 'key', web: 'key' },
  info: { ios: 'info.circle.fill', android: 'info', web: 'info' }, refresh: { ios: 'arrow.clockwise', android: 'refresh', web: 'refresh' },
  offline: { ios: 'wifi.slash', android: 'cloud_off', web: 'cloud_off' }, chevron: { ios: 'chevron.forward', android: 'chevron_right', web: 'chevron_right' },
  arrow: { ios: 'arrow.forward', android: 'arrow_forward', web: 'arrow_forward' }, play: { ios: 'play.fill', android: 'play_arrow', web: 'play_arrow' },
  explorer: { ios: 'map.fill', android: 'map', web: 'map' }, astronaut: { ios: 'moon.stars.fill', android: 'rocket_launch', web: 'rocket_launch' },
  inventor: { ios: 'lightbulb.fill', android: 'lightbulb', web: 'lightbulb' }, artist: { ios: 'paintpalette.fill', android: 'palette', web: 'palette' },
} as const satisfies Record<string, ComponentProps<typeof SymbolView>['name']>;
export type AppIconName = keyof typeof symbols;
export function AppIcon({ name, size = 24, color = colors.ink, contained = false }: { name: AppIconName; size?: number; color?: ColorValue; contained?: boolean }) {
  const icon = <SymbolView name={symbols[name]} size={size} tintColor={color} weight={{ ios: 'semibold', android: semiBold }} />;
  return contained ? <View style={[styles.container, { width: size + 18, height: size + 18 }]}>{icon}</View> : icon;
}
const styles = StyleSheet.create({ container: { alignItems: 'center', justifyContent: 'center', borderRadius: 999, backgroundColor: 'rgba(255,255,255,.74)' } });
