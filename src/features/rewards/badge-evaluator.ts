import type { BadgeContext, BadgeDefinition } from './types';
export function evaluateBadges(definitions: BadgeDefinition[], context: BadgeContext, alreadyUnlocked: string[] = []) {
  return definitions.filter((badge) => {
    if (alreadyUnlocked.includes(badge.id)) return false;
    return badge.rule.type === 'total-missions'
      ? context.completedMissionIds.length >= badge.rule.count
      : (context.completedBySkill[badge.rule.skillId] ?? 0) >= badge.rule.count;
  });
}

