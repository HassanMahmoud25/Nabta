import type { ChildProfile } from '@/features/children/types';
import type { Mission, MissionAnswer } from '@/features/missions/types';
import type { SkillProgress } from '@/features/progress/types';

export type MissionCompletion = { missionId: string; childId: string; skillId: string; completedAt: string; xpEarned: number; scorePercent: number };
export type DashboardData = {
  child: ChildProfile; totalXp: number; weeklyMissions: number; progress: SkillProgress[];
  recentMissions: MissionCompletion[]; strongest: SkillProgress[]; needsPractice: SkillProgress[];
};
export type CompleteMissionInput = { childId: string; mission: Mission; answers: MissionAnswer[] };
export type CompleteMissionResult = { completion: MissionCompletion; newBadgeIds: string[]; duplicate: boolean };

