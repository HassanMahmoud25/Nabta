const XP_PER_LEVEL = 250;
export function calculateLevel(xp: number) { return Math.max(1, Math.floor(Math.max(0, xp) / XP_PER_LEVEL) + 1); }
export function calculateProgressPercent(xp: number) { return Math.round(((Math.max(0, xp) % XP_PER_LEVEL) / XP_PER_LEVEL) * 100); }
export function calculateXpReward(baseXp: number, scorePercent: number) {
  const multiplier = scorePercent >= 80 ? 1 : scorePercent >= 50 ? 0.85 : 0.7;
  return Math.round(baseXp * multiplier);
}

