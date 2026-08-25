import type { AgeBand, LocalizedText } from '@/types/common';
export type SkillDefinition = { id: string; slug: string; title: LocalizedText; shortDescription: LocalizedText; iconKey: string; levels: number; ageAvailability: AgeBand[]; comingSoon?: boolean };

