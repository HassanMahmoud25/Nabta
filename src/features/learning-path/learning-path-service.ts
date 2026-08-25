import type { ChildProfile } from '@/features/children/types';
import type { Mission } from '@/features/missions/types';
import type { SkillProgress } from '@/features/progress/types';

type LearningPathInput = { child: ChildProfile; missions: Mission[]; progress: SkillProgress[]; completedMissionIds: string[]; recentSkillId?: string };
export function selectNextMission({ child, missions, progress, completedMissionIds, recentSkillId }: LearningPathInput): Mission | null {
  const progressBySkill = new Map(progress.map((item) => [item.skillId, item]));
  const eligible = missions.filter((mission) => mission.ageBands.includes(child.ageBand) && child.selectedSkills.includes(mission.skillId) && !completedMissionIds.includes(mission.id));
  eligible.sort((a, b) => {
    const aProgress = progressBySkill.get(a.skillId)?.progressPercent ?? 0;
    const bProgress = progressBySkill.get(b.skillId)?.progressPercent ?? 0;
    const repeatA = a.skillId === recentSkillId ? 1 : 0; const repeatB = b.skillId === recentSkillId ? 1 : 0;
    const expectedA = Math.min(5, (progressBySkill.get(a.skillId)?.level ?? 1));
    const expectedB = Math.min(5, (progressBySkill.get(b.skillId)?.level ?? 1));
    return aProgress - bProgress || repeatA - repeatB || Math.abs(a.difficulty - expectedA) - Math.abs(b.difficulty - expectedB) || a.id.localeCompare(b.id);
  });
  return eligible[0] ?? null;
}

