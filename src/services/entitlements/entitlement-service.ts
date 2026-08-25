export type SubscriptionTier = 'free' | 'family';
export type Entitlements = { tier: SubscriptionTier; maxChildren: number; unlimitedMissions: boolean; detailedInsights: boolean };
const definitions: Record<SubscriptionTier, Entitlements> = {
  free: { tier: 'free', maxChildren: 1, unlimitedMissions: false, detailedInsights: false },
  family: { tier: 'family', maxChildren: 5, unlimitedMissions: true, detailedInsights: true },
};
export const entitlementService = { forTier(tier: SubscriptionTier) { return definitions[tier]; }, development() { return definitions.family; } };
