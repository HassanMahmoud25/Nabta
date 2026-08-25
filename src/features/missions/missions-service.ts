import { missions } from '@/data/missions';
import { devDatabase } from '@/services/api/dev-database';
import { prodDatabase } from '@/services/api/prod-database';
import { env } from '@/config/env';
import { selectNextMission } from '@/features/learning-path/learning-path-service';
import type { CompleteMissionInput } from '@/services/api/contracts';

export const missionsService = {
  async get(missionId: string) { return missions.find((mission) => mission.id === missionId) ?? null; },
  async listForSkill(skillId: string, ageBand: string) { return missions.filter((mission) => mission.skillId === skillId && mission.ageBands.some((band) => band === ageBand)); },
  async today(childId: string) {
    const database = env.useDevFixtures || !env.hasSupabaseConfig ? devDatabase : prodDatabase;
    const child = await database.getChild(childId); if (!child) return null;
    const completions = await database.getCompletions(childId); const progress = await database.getProgress(childId);
    return selectNextMission({ child, missions, progress, completedMissionIds: completions.map((item) => item.missionId), recentSkillId: completions[0]?.skillId });
  },
  async complete(input: CompleteMissionInput) { return env.useDevFixtures || !env.hasSupabaseConfig ? devDatabase.completeMission(input) : prodDatabase.completeMission(input); },
  async history(childId: string) { return env.useDevFixtures || !env.hasSupabaseConfig ? devDatabase.getCompletions(childId) : prodDatabase.getCompletions(childId); },
};
