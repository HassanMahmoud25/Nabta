import type { AgeBand } from '@/types/common';
export type ChildProfile = { id: string; parentId: string; nickname: string; ageBand: AgeBand; avatarKey: string; selectedSkills: string[]; goals: string[]; xp: number; createdAt: string; updatedAt: string };
export type ChildProfileInput = Pick<ChildProfile, 'nickname' | 'ageBand' | 'avatarKey' | 'selectedSkills' | 'goals'>;
export type CreateChildInput = ChildProfileInput & { parentId: string };
