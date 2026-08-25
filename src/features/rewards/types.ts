import type { LocalizedText } from '@/types/common';
export type BadgeRule = { type: 'skill-missions'; skillId: string; count: number } | { type: 'total-missions'; count: number };
export type BadgeDefinition = { id: string; title: LocalizedText; description: LocalizedText; icon: string; rule: BadgeRule };
export type BadgeContext = { completedMissionIds: string[]; completedBySkill: Record<string, number> };

