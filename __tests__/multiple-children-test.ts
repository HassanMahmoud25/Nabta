jest.mock('@/services/storage/local-storage', () => {
  const values = new Map<string, unknown>();
  return { storage: { get: (key: string) => values.get(key) ?? null, set: (key: string, value: unknown) => values.set(key, value), remove: (key: string) => values.delete(key) } };
});

import { missions } from '@/data/missions';
import type { ChildProfile } from '@/features/children/types';
import { selectNextMission } from '@/features/learning-path/learning-path-service';
import { queryKeys } from '@/services/api/query-keys';
import { devDatabase } from '@/services/api/dev-database';
import { selectValidActiveChild } from '@/stores/app-store';

const parentId = `parent-multi-${Date.now()}`;
const createdIds: string[] = [];
const makeChild = (ageBand: ChildProfile['ageBand'], selectedSkills: string[]): ChildProfile => ({
  id: `child-${ageBand}`, parentId, nickname: ageBand, ageBand, avatarKey: 'explorer',
  selectedSkills, goals: [], xp: 0, createdAt: '2026-08-24T00:00:00.000Z', updatedAt: '2026-08-24T00:00:00.000Z',
});

afterAll(() => {
  for (const childId of createdIds) {
    try { devDatabase.deleteChild(parentId, childId); } catch { /* already removed by a test */ }
  }
});

describe('multiple child profile isolation', () => {
  test('reconciles persisted, removed, and no-child selections safely', () => {
    expect(selectValidActiveChild(null, 'mariam', ['omar', 'mariam'])).toBe('mariam');
    expect(selectValidActiveChild('removed', 'also-removed', ['omar'])).toBe('omar');
    expect(selectValidActiveChild('removed', null, [])).toBeNull();
  });

  test('uses distinct query keys for every child-scoped domain', () => {
    const builders = [queryKeys.child, queryKeys.todayMission, queryKeys.missionHistory, queryKeys.progress, queryKeys.dashboard, queryKeys.rewards];
    for (const build of builders) expect(build('omar')).not.toEqual(build('mariam'));
  });

  test('filters recommendations independently by age band and selected skills', () => {
    const omar = makeChild('7-9', ['money']);
    const mariam = makeChild('10-12', ['internet-safety', 'problem-solving']);
    const omarMission = selectNextMission({ child: omar, missions, progress: [], completedMissionIds: [] });
    const mariamMission = selectNextMission({ child: mariam, missions, progress: [], completedMissionIds: [] });
    expect(omarMission?.ageBands).toContain('7-9');
    expect(omarMission?.skillId).toBe('money');
    expect(mariamMission?.ageBands).toContain('10-12');
    expect(mariam.selectedSkills).toContain(mariamMission?.skillId);
  });

  test('keeps XP, mission history, progress, and badges on the targeted child', () => {
    const omar = devDatabase.createChild({ parentId, nickname: `Omar-${Date.now()}`, ageBand: '7-9', avatarKey: 'explorer', selectedSkills: ['money'], goals: [] });
    const mariam = devDatabase.createChild({ parentId, nickname: `Mariam-${Date.now()}`, ageBand: '10-12', avatarKey: 'inventor', selectedSkills: ['internet-safety', 'problem-solving'], goals: [] });
    createdIds.push(omar.id, mariam.id);
    const mission = missions.find((item) => item.id === 'safety-free-credits')!;
    const answers = mission.steps.map((step) => ({ stepId: step.id, optionIds: [step.type === 'multiple-choice' ? 'pause' : 'wise'] }));
    devDatabase.completeMission({ childId: mariam.id, mission, answers });

    expect(devDatabase.getChild(omar.id)?.xp).toBe(0);
    expect(devDatabase.getCompletions(omar.id)).toHaveLength(0);
    expect(devDatabase.getBadges(omar.id)).toHaveLength(0);
    expect(devDatabase.getChild(mariam.id)?.xp).toBeGreaterThan(0);
    expect(devDatabase.getCompletions(mariam.id).map((item) => item.missionId)).toEqual([mission.id]);
    expect(devDatabase.getProgress(mariam.id).find((item) => item.skillId === mission.skillId)?.completedMissions).toBe(1);
    expect(devDatabase.getBadges(mariam.id).length).toBeGreaterThan(0);
  });

  test('enforces parent ownership for update and delete and preserves removed-skill progress', () => {
    const child = devDatabase.createChild({ parentId, nickname: `Edit-${Date.now()}`, ageBand: '7-9', avatarKey: 'artist', selectedSkills: ['money', 'responsibility'], goals: [] });
    createdIds.push(child.id);
    expect(() => devDatabase.updateChild('another-parent', child.id, { nickname: 'Nope', ageBand: '7-9', avatarKey: 'artist', selectedSkills: ['money'], goals: [] })).toThrow();
    expect(() => devDatabase.deleteChild('another-parent', child.id)).toThrow();
    devDatabase.updateChild(parentId, child.id, { nickname: 'Updated', ageBand: '10-12', avatarKey: 'inventor', selectedSkills: ['problem-solving'], goals: ['confidence'] });
    expect(devDatabase.getChild(child.id)?.nickname).toBe('Updated');
    expect(devDatabase.getProgress(child.id).map((item) => item.skillId)).toEqual(expect.arrayContaining(['money', 'responsibility', 'problem-solving']));
  });
});
