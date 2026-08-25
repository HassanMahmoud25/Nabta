import { badges } from '@/data/badges';
import { calculateLevel, calculateProgressPercent, calculateXpReward } from '@/features/progress/progress-utils';
import { evaluateBadges } from '@/features/rewards/badge-evaluator';
import { scoreMission } from '@/features/missions/scoring';
import type { ChildProfile, ChildProfileInput, CreateChildInput } from '@/features/children/types';
import type { SkillProgress } from '@/features/progress/types';
import type { CompleteMissionInput, CompleteMissionResult, MissionCompletion } from './contracts';
import { storage } from '@/services/storage/local-storage';

type DevDatabaseState = { children: ChildProfile[]; progress: SkillProgress[]; completions: MissionCompletion[]; childBadges: Record<string, string[]> };
const KEY = 'nash2.dev.database.v1';
const initialState: DevDatabaseState = { children: [], progress: [], completions: [], childBadges: {} };
function read(): DevDatabaseState { const state = storage.get<DevDatabaseState>(KEY) ?? structuredClone(initialState); const fallback = new Date(0).toISOString(); state.children = state.children.map((child) => ({ ...child, createdAt: child.createdAt ?? fallback, updatedAt: child.updatedAt ?? fallback })); return state; }
function write(state: DevDatabaseState) { storage.set(KEY, state); }

export const devDatabase = {
  listChildren(parentId: string) { return read().children.filter((child) => child.parentId === parentId); },
  getChild(childId: string) { return read().children.find((child) => child.id === childId) ?? null; },
  createChild(input: CreateChildInput) {
    const state = read();
    const existing = state.children.find((child) => child.parentId === input.parentId && child.nickname.toLowerCase() === input.nickname.toLowerCase());
    if (existing) return existing;
    const now = new Date().toISOString(); const child: ChildProfile = { ...input, id: `child-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, xp: 0, createdAt: now, updatedAt: now };
    state.children.push(child);
    state.progress.push(...child.selectedSkills.map((skillId) => ({ childId: child.id, skillId, xp: 0, level: 1, completedMissions: 0, progressPercent: 0 })));
    state.childBadges[child.id] = [];
    write(state); return child;
  },
  updateChild(parentId: string, childId: string, input: ChildProfileInput) {
    const state = read(); const child = state.children.find((item) => item.id === childId && item.parentId === parentId); if (!child) throw new Error('Child profile not found.');
    const existingSkills = new Set(state.progress.filter((item) => item.childId === childId).map((item) => item.skillId));
    state.progress.push(...input.selectedSkills.filter((skillId) => !existingSkills.has(skillId)).map((skillId) => ({ childId, skillId, xp: 0, level: 1, completedMissions: 0, progressPercent: 0 })));
    Object.assign(child, input, { updatedAt: new Date().toISOString() }); write(state); return child;
  },
  deleteChild(parentId: string, childId: string) {
    const state = read(); const index = state.children.findIndex((item) => item.id === childId && item.parentId === parentId); if (index < 0) throw new Error('Child profile not found.');
    state.children.splice(index, 1); state.progress = state.progress.filter((item) => item.childId !== childId); state.completions = state.completions.filter((item) => item.childId !== childId); delete state.childBadges[childId]; write(state);
  },
  getProgress(childId: string) { return read().progress.filter((item) => item.childId === childId); },
  getCompletions(childId: string) { return read().completions.filter((item) => item.childId === childId).sort((a, b) => b.completedAt.localeCompare(a.completedAt)); },
  getBadges(childId: string) { return read().childBadges[childId] ?? []; },
  completeMission(input: CompleteMissionInput): CompleteMissionResult {
    const state = read();
    const existing = state.completions.find((item) => item.childId === input.childId && item.missionId === input.mission.id);
    if (existing) return { completion: existing, newBadgeIds: [], duplicate: true };
    const score = scoreMission(input.mission, input.answers);
    const xpEarned = calculateXpReward(input.mission.xpReward, score.percent);
    const completion: MissionCompletion = { missionId: input.mission.id, childId: input.childId, skillId: input.mission.skillId, completedAt: new Date().toISOString(), xpEarned, scorePercent: score.percent };
    state.completions.push(completion);
    const child = state.children.find((item) => item.id === input.childId);
    if (!child) throw new Error('Child profile not found.');
    child.xp += xpEarned;
    let progress = state.progress.find((item) => item.childId === input.childId && item.skillId === input.mission.skillId);
    if (!progress) { progress = { childId: input.childId, skillId: input.mission.skillId, xp: 0, level: 1, completedMissions: 0, progressPercent: 0 }; state.progress.push(progress); }
    progress.xp += xpEarned; progress.completedMissions += 1; progress.level = calculateLevel(progress.xp); progress.progressPercent = calculateProgressPercent(progress.xp);
    const completedBySkill = state.completions.filter((item) => item.childId === input.childId).reduce<Record<string, number>>((counts, item) => ({ ...counts, [item.skillId]: (counts[item.skillId] ?? 0) + 1 }), {});
    const unlocked = state.childBadges[input.childId] ?? [];
    const newBadges = evaluateBadges(badges, { completedMissionIds: state.completions.filter((item) => item.childId === input.childId).map((item) => item.missionId), completedBySkill }, unlocked);
    state.childBadges[input.childId] = [...unlocked, ...newBadges.map((badge) => badge.id)];
    write(state);
    return { completion, newBadgeIds: newBadges.map((badge) => badge.id), duplicate: false };
  },
};
