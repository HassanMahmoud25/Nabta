import type { ImageSource } from 'expo-image';

const ratio = 1690 / 931;
export const illustrationRegistry = {
  brand: { adventure: { source: require('../../../assets/illustrations/brand/adventure-hero.jpg'), ratio: 1200 / 661 } },
  skills: {
    money: { default: { source: require('../../../assets/illustrations/missions/money-choice.jpg'), ratio: 1200 / 661 }, completed: { source: require('../../../assets/illustrations/completions/money.png'), ratio } },
    responsibility: { default: { source: require('../../../assets/illustrations/skills/responsibility.png'), ratio }, completed: { source: require('../../../assets/illustrations/completions/responsibility.png'), ratio } },
    'internet-safety': { default: { source: require('../../../assets/illustrations/missions/internet-safety.jpg'), ratio: 1200 / 661 }, completed: { source: require('../../../assets/illustrations/completions/internet-safety.png'), ratio } },
    emotions: { default: { source: require('../../../assets/illustrations/skills/emotions.png'), ratio }, completed: { source: require('../../../assets/illustrations/completions/emotions.png'), ratio } },
    'problem-solving': { default: { source: require('../../../assets/illustrations/skills/problem-solving.png'), ratio }, completed: { source: require('../../../assets/illustrations/completions/problem-solving.png'), ratio } },
  },
  empty: { rewards: { source: require('../../../assets/illustrations/empty/rewards-shelf.png'), ratio } },
  fallback: { completed: { source: require('../../../assets/illustrations/rewards/mission-complete.jpg'), ratio: 1200 / 661 } },
} as const satisfies { brand: Record<string, { source: ImageSource; ratio: number }>; skills: Record<string, { default: { source: ImageSource; ratio: number }; completed: { source: ImageSource; ratio: number } }>; empty: Record<string, { source: ImageSource; ratio: number }>; fallback: Record<string, { source: ImageSource; ratio: number }> };

export type IllustratedSkillId = keyof typeof illustrationRegistry.skills;
export function hasSkillIllustration(skillId: string): skillId is IllustratedSkillId { return skillId in illustrationRegistry.skills; }
